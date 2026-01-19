from __future__ import annotations

import logging
import uuid
from typing import Dict, List, Optional

from .config import Settings, get_settings
from .memory import SessionMemoryManager
from .model_loader import generate_with_confidence
from .prompts import GEMINI_SYSTEM_PROMPT, ROUTER_PROMPT
from .retriever import PubMedRetriever
from .utils import (
    postprocess_answer,
    safe_json_loads,
    safety_guard,
    suppress_unmentioned_terms,
    sanitize_context_payload,
    sanitize_text_for_gemini,
    output_guard,
    has_data_exfil_request,
)

logger = logging.getLogger(__name__)


class MedAssistantPipeline:
    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()
        self.retriever = PubMedRetriever(self.settings)
        self.memory_manager = SessionMemoryManager()

    def _default_plan(self, question: str) -> Dict:
        base = {
            "intent": "GENERAL_MEDICAL_QA",
            "confidence": 0.5,
            "action": "CALL_GEMINI",
            "needs_patient_db": False,
            "db_query_spec": {
                "target_collection": "all",
                "time_frame": "latest",
                "keywords": [],
            },
            "gemini_payload_spec": {
                "is_pii_removed": True,
                "sanitized_user_prompt": question,
                "system_instruction_hint": "medical_consultant",
            },
            "tool_params": {"tool_name": None, "tool_args": {}},
            "local_reply_content": "",
        }
        return {
            **base,
            "db_query_spec": {**base["db_query_spec"]},
            "gemini_payload_spec": {**base["gemini_payload_spec"]},
            "tool_params": {**base["tool_params"]},
        }

    def _filter_docs(self, docs: List[Dict], question: str) -> List[Dict]:
        if not docs:
            return []

        filtered = [
            d for d in docs if d.get("score", 0.0) >= self.settings.rag_score_threshold
        ]
        if not filtered:
            return []

        question_lower = question.lower()
        user_mentions_noise = any(
            keyword in question_lower for keyword in self.settings.noise_keywords
        )

        cleaned_docs = []
        for doc in filtered:
            text = f"{doc.get('title', '')} {doc.get('abstract', '')}".lower()
            doc_contains_noise = any(
                keyword in text for keyword in self.settings.noise_keywords
            )
            if doc_contains_noise and not user_mentions_noise:
                continue
            cleaned_docs.append(doc)

        return cleaned_docs

    def _build_context(self, docs: List[Dict]) -> str:
        if not docs:
            return "Khong co tai lieu lien quan."

        context_lines = []
        current_len = 0
        for idx, doc in enumerate(docs, 1):
            title = doc.get("title") or f"Bai {idx}"
            abstract = doc.get("abstract") or ""
            snippet = abstract[:1000]
            chunk = f"[{idx}] Title: {title}\nAbstract: {snippet}\nPMID: {doc.get('pmid', '')}\n"
            if current_len + len(chunk) > self.settings.max_context_chars:
                break
            context_lines.append(chunk)
            current_len += len(chunk)
        return "\n".join(context_lines)

    def _retrieve_context(
        self,
        question: str,
        db_query_spec: Optional[Dict],
        top_k: Optional[int],
    ) -> tuple[str, List[Dict]]:
        if not self.retriever.available:
            return "", []

        retrieval_query = question
        if db_query_spec and isinstance(db_query_spec, dict):
            keywords = db_query_spec.get("keywords") or []
            if keywords:
                retrieval_query = f"{question} {' '.join(keywords)}"

        docs = self.retriever.retrieve(
            retrieval_query, top_k or self.settings.rag_top_k
        )
        rag_docs = self._filter_docs(docs, question)
        context_text = self._build_context(rag_docs)
        return context_text, rag_docs

    def _route_and_plan(
        self, question: str, history_text: str, recent_context: str
    ) -> Dict:
        plan = self._default_plan(question)
        if has_data_exfil_request(question):
            plan.update(
                {
                    "intent": "OUT_OF_SCOPE",
                    "action": "REPLY_LOCALLY",
                    "local_reply_content": "Xin loi, toi khong the cung cap ho so hoac danh sach dinh danh. Vui long dat cau hoi khac.",
                }
            )
            return plan

        router_prompt = ROUTER_PROMPT.format(
            history=history_text or "Chua co lich su.",
            recent_context=recent_context or "Chua co context gan.",
            question=question,
        )
        router_text, _ = generate_with_confidence(
            router_prompt, temperature=0.0, max_new_tokens=400
        )
        router_json = safe_json_loads(router_text)

        if router_json and isinstance(router_json, dict):
            for key, value in router_json.items():
                if value is None:
                    continue
                if isinstance(value, dict):
                    merged = {**plan.get(key, {}), **value}
                    plan[key] = merged
                else:
                    plan[key] = value

        base = self._default_plan(question)
        plan["db_query_spec"] = {**base["db_query_spec"], **(plan.get("db_query_spec") or {})}
        plan["gemini_payload_spec"] = {
            **base["gemini_payload_spec"],
            **(plan.get("gemini_payload_spec") or {}),
        }
        plan["tool_params"] = {**base["tool_params"], **(plan.get("tool_params") or {})}

        if not plan.get("local_reply_content"):
            plan["local_reply_content"] = (
                "Chao ban, toi la tro ly y te ao. Toi chi ho tro cac cau hoi lien quan suc khoe."
            )
        return plan

    def _call_gemini(
        self,
        sanitized_question: str,
        context_text: str,
        *,
        max_new_tokens: Optional[int] = None,
    ) -> tuple[str, str, float, bool]:
        prompt = (
            f"{GEMINI_SYSTEM_PROMPT}\n\n"
            f"[Sanitized question]\n{sanitized_question}\n\n"
            f"[Context]\n{context_text}\n"
            "Tra loi ngan gon bang tieng Viet; neu thong tin thieu, hoi lai mot cau ro rang."
        )
        draft, confidence = generate_with_confidence(
            prompt,
            max_new_tokens=min(
                max_new_tokens or self.settings.max_new_tokens,
                self.settings.max_new_tokens,
            ),
            temperature=self.settings.temperature,
        )
        processed_draft = suppress_unmentioned_terms(
            postprocess_answer(draft),
            f"{sanitized_question}\n{context_text}",
            self.settings.cautious_terms,
        )
        guarded_answer, flagged = output_guard(processed_draft)
        return guarded_answer, processed_draft, confidence, flagged

    def _build_response(
        self,
        answer: str,
        draft: str,
        confidence: float,
        plan: Dict,
        rag_docs: List[Dict],
        warning: Optional[str],
        trace_id: str,
        *,
        output_flag: bool = False,
        sanitized_prompt: Optional[str] = None,
        tool_params: Optional[Dict] = None,
    ) -> Dict:
        return {
            "answer": answer,
            "draft": draft,
            "confidence": confidence,
            "verdict": "pass",
            "citations": [],
            "context_docs": rag_docs,
            "warning": warning,
            "intent": plan.get("intent"),
            "action": plan.get("action"),
            "router_plan": plan,
            "trace_id": trace_id,
            "sanitized_user_prompt": sanitized_prompt,
            "output_guard_flagged": output_flag,
            "tool_params": tool_params or plan.get("tool_params"),
        }

    def ask(
        self,
        question: str,
        session_id: str = "default",
        *,
        max_new_tokens: Optional[int] = None,
        top_k: Optional[int] = None,
    ) -> Dict:
        if not question or not question.strip():
            raise ValueError("Question must not be empty.")

        question = question.strip()
        trace_id = str(uuid.uuid4())
        warning = safety_guard(question) if self.settings.enable_safety_guard else None

        history_text = self.memory_manager.get_history_text(session_id)
        recent_context = self.memory_manager.get_recent_context(
            session_id, max_exchanges=2
        )

        logger.info("[Pipeline] trace_id=%s question=%s", trace_id, question[:120])
        plan = self._route_and_plan(question, history_text, recent_context)

        if warning:
            plan["intent"] = plan.get("intent") or "EMERGENCY"
            plan["action"] = "REPLY_LOCALLY"
            plan["local_reply_content"] = warning

        if plan.get("needs_patient_db") and session_id == "default":
            answer = "Ban can dang nhap/xac thuc de xem thong tin ca nhan."
            response = self._build_response(
                answer,
                answer,
                plan.get("confidence", 0.0),
                plan,
                [],
                warning,
                trace_id,
                output_flag=True,
                sanitized_prompt=question,
            )
            self.memory_manager.save_exchange(session_id, question, answer)
            return response

        if plan.get("action") == "REPLY_LOCALLY":
            answer = plan.get("local_reply_content") or ""
            guarded_answer, flagged = output_guard(answer)
            response = self._build_response(
                guarded_answer,
                answer,
                plan.get("confidence", 0.0),
                plan,
                [],
                warning,
                trace_id,
                output_flag=flagged,
                sanitized_prompt=plan.get("gemini_payload_spec", {}).get(
                    "sanitized_user_prompt"
                ),
            )
            self.memory_manager.save_exchange(session_id, question, guarded_answer)
            return response

        if plan.get("action") == "CALL_ADMIN_TOOL":
            tool_params = plan.get("tool_params") or {}
            tool_name = tool_params.get("tool_name") or "admin_tool"
            local_reply = plan.get("local_reply_content") or (
                f"Toi da ghi nhan yeu cau '{tool_name}'. He thong se xu ly va thong bao cho ban."
            )
            guarded_answer, flagged = output_guard(local_reply)
            response = self._build_response(
                guarded_answer,
                local_reply,
                plan.get("confidence", 0.0),
                plan,
                [],
                warning,
                trace_id,
                output_flag=flagged,
                sanitized_prompt=plan.get("gemini_payload_spec", {}).get(
                    "sanitized_user_prompt"
                ),
                tool_params=tool_params,
            )
            self.memory_manager.save_exchange(session_id, question, guarded_answer)
            return response

        sanitized_question, user_redacted = sanitize_text_for_gemini(question)
        plan["gemini_payload_spec"]["sanitized_user_prompt"] = sanitized_question
        plan["gemini_payload_spec"]["is_pii_removed"] = user_redacted

        context_text = ""
        rag_docs: List[Dict] = []
        if plan.get("action") == "SEARCH_DB":
            context_text, rag_docs = self._retrieve_context(
                question, plan.get("db_query_spec"), top_k
            )
        elif plan.get("intent") == "CONTEXT_FOLLOWUP":
            context_text = recent_context or history_text

        sanitized_context, context_redacted = sanitize_context_payload(
            context_text or ""
        )

        answer, draft, confidence, flagged = self._call_gemini(
            sanitized_question,
            sanitized_context or "Khong co du lieu lien quan.",
            max_new_tokens=max_new_tokens,
        )
        if warning and warning not in answer:
            answer = f"{warning}\n\n{answer}"

        response = self._build_response(
            answer,
            draft,
            confidence,
            plan,
            rag_docs,
            warning,
            trace_id,
            output_flag=flagged or user_redacted or context_redacted,
            sanitized_prompt=sanitized_question,
        )
        self.memory_manager.save_exchange(session_id, question, answer)
        return response
