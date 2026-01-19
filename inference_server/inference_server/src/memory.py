"""
Memory module theo chuẩn LangChain pattern:
1. Retrieve: Lấy lịch sử từ ConversationBufferMemory
2. Inject: Đưa vào prompt thông qua memory.load_memory_variables()
3. Generate: LLM xử lý
4. Update: Tự động lưu bằng memory.save_context()
"""
from __future__ import annotations

from typing import Dict

from langchain.memory import ConversationBufferMemory

from .config import get_settings
from .utils import format_history


class SessionMemoryManager:
    """
    Quản lý memory theo session đơn giản, sử dụng ConversationBufferMemory của LangChain.
    
    Flow:
    - get_memory(session_id) -> Lấy hoặc tạo memory cho session
    - load_memory_variables() -> Retrieve lịch sử (tự động bởi LangChain)
    - save_context() -> Update lịch sử (tự động bởi LangChain)
    """
    
    def __init__(self):
        self.settings = get_settings()
        self._sessions: Dict[str, ConversationBufferMemory] = {}

    def get_memory(self, session_id: str) -> ConversationBufferMemory:
        """
        Retrieve: Lấy memory instance cho session_id.
        Tạo mới nếu chưa tồn tại.
        """
        if session_id not in self._sessions:
            memory = ConversationBufferMemory(
                memory_key="history",
                return_messages=True,
                ai_prefix="Bác sĩ AI",
                human_prefix="Bệnh nhân",
                max_token_limit=2000,  # Giới hạn token để tránh quá dài
            )
            self._sessions[session_id] = memory
        return self._sessions[session_id]

    def get_history_text(self, session_id: str) -> str:
        """
        Inject: Format lịch sử thành text để inject vào prompt.
        """
        memory = self.get_memory(session_id)
        # load_memory_variables() là bước Retrieve của LangChain
        history_messages = memory.load_memory_variables({}).get("history", [])
        if not history_messages:
            return "Chưa có lịch sử hội thoại."
        return format_history(history_messages)

    def save_exchange(self, session_id: str, question: str, answer: str) -> None:
        """
        Update: Lưu câu hỏi và câu trả lời vào memory.
        LangChain tự động quản lý việc lưu trữ.
        """
        memory = self.get_memory(session_id)
        # save_context() là bước Update của LangChain
        memory.save_context(
            {"input": question.strip()},
            {"output": answer.strip()}
        )

    def get_recent_context(self, session_id: str, max_exchanges: int = 3) -> str:
        """
        Lấy N cuộc trao đổi gần nhất để làm context cho câu hỏi hiện tại.
        Giúp model hiểu context mà không cần ghép câu hỏi phức tạp.
        """
        memory = self.get_memory(session_id)
        messages = memory.load_memory_variables({}).get("history", [])
        
        if not messages:
            return ""
        
        # Lấy max_exchanges cặp gần nhất (mỗi cặp = 2 messages: human + ai)
        recent_messages = messages[-(max_exchanges * 2):]
        
        formatted_lines = []
        for msg in recent_messages:
            role = getattr(msg, "type", getattr(msg, "role", ""))
            content = msg.content.strip()
            if not content:
                continue
            
            if role in ("human", "user"):
                formatted_lines.append(f"Bệnh nhân: {content}")
            elif role in ("ai", "assistant"):
                # Rút gọn câu trả lời cũ (chỉ lấy 200 ký tự đầu)
                short_content = content[:200] + "..." if len(content) > 200 else content
                formatted_lines.append(f"Bác sĩ AI: {short_content}")
        
        return "\n".join(formatted_lines) if formatted_lines else ""

    def reset(self, session_id: str) -> None:
        """Xóa memory của một session cụ thể."""
        if session_id in self._sessions:
            del self._sessions[session_id]

    def clear(self) -> None:
        """Xóa tất cả session memory."""
        self._sessions.clear()
