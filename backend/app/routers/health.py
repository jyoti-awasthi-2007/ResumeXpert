"""Health check routes."""
import logging
from typing import Any

from fastapi import APIRouter

from app.utils import get_success_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health")
async def health_check() -> dict[str, Any]:
    """Health check endpoint."""
    return {"status": "ok", "version": "1.0.0"}
