from __future__ import annotations

import logging
from typing import Any, Dict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from .config import get_settings
from .pipeline import MedAssistantPipeline

logger = logging.getLogger(__name__)
settings = get_settings()
pipeline = MedAssistantPipeline(settings)

app = FastAPI(
    title="Med LLaVA Inference API",
    version="0.1.0",
    description="GPU inference server with LangChain memory + self-correction.",
)


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=4)
    session_id: str = Field(default="default", max_length=128)
    max_new_tokens: int | None = Field(default=None, ge=64, le=1024)
    top_k: int | None = Field(default=None, ge=1, le=10)


class ChatResponse(BaseModel):
    answer: str
    draft: str
    confidence: float
    verdict: str
    citations: list[str]
    context_docs: list[Dict[str, Any]]
    warning: str | None = None
    intent: str | None = None
    action: str | None = None
    router_plan: Dict[str, Any] | None = None
    trace_id: str | None = None
    sanitized_user_prompt: str | None = None
    output_guard_flagged: bool | None = None
    tool_params: Dict[str, Any] | None = None


@app.get("/")
def root() -> Dict[str, Any]:
    """Root endpoint with API information."""
    return {
        "name": "Med LLaVA Inference API",
        "version": "0.1.0",
        "description": "GPU inference server with LangChain memory + self-correction.",
        "endpoints": {
            "health": "/health",
            "chat": "/v1/chat/completions",
            "docs": "/docs",
            "openapi": "/openapi.json",
        },
    }


@app.get("/health")
def health_check() -> Dict[str, str]:
    status = "ok" if pipeline.retriever.available else "degraded"
    return {"status": status, "model_id": settings.model_id}


@app.post("/v1/chat/completions", response_model=ChatResponse)
def chat_completion(request: ChatRequest) -> Dict[str, Any]:
    try:
        result = pipeline.ask(
            question=request.question,
            session_id=request.session_id,
            max_new_tokens=request.max_new_tokens,
            top_k=request.top_k,
        )
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        import traceback
        error_msg = str(exc)
        error_type = type(exc).__name__
        logger.exception("Chat completion failed: %s", exc)
        # In development, return more details
        detail = f"Inference failed: {error_type}: {error_msg}"
        raise HTTPException(status_code=500, detail=detail) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.api:app",
        host=settings.server_host,
        port=settings.server_port,
        log_level=settings.log_level,
    )

