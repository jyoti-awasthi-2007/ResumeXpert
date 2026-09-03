"""AI support chatbot routes."""
from typing import Any

from fastapi import APIRouter

from app.ai import ai_service

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("")
async def chat(request: dict[str, Any]) -> dict[str, str]:
    """Answer a CareerLens support question using the configured AI provider."""
    message = str(request.get("message", "")).strip()
    if not message:
        return {"message": "Please enter a question so I can help."}

    context = str(request.get("context", "")).strip()[:1000]
    return {"message": ai_service.chat(message, context)}