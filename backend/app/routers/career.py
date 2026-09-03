"""Career recommendation and selection routes."""
import logging
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas import (
    CareerListResponse,
    CareerRecommendationResponse,
    CareerSelectionRequest,
    CareerSelectionResponse,
)
from app.services import CareerService
from app.utils import get_error_response, get_success_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/careers", tags=["Careers"])
career_service = CareerService()


@router.get("")
async def list_careers() -> list[dict[str, Any]]:
    """List all available careers."""
    try:
        return career_service.get_all_careers()
    except Exception as error:
        logger.error(f"Error listing careers: {error}")
        return [{"code": "LIST_ERROR", "message": str(error)}]


@router.post("/recommend")
async def recommend_careers(request: dict[str, Any]) -> dict[str, Any]:
    """
    Recommend careers based on user skills.
    
    Request body:
    {
        "skills": ["Python", "React", "SQL"],
        "top_n": 5
    }
    """
    try:
        skills = request.get("skills", [])
        top_n = request.get("top_n", 5)

        if not skills:
            # No skills provided — return all careers with default ordering
            all_careers = career_service.get_all_careers()
            # Attach empty matchedSkills/missingSkills so CareerCard renders correctly
            all_with_defaults = [
                {**c, "score": 0, "status": "Upload Resume", "matchedSkills": [], "missingSkills": [], "matched_skills": [], "missing_skills": [], "reasoning": "Upload your resume to get a personalised match score."}
                for c in all_careers
            ]
            return {"recommendations": all_with_defaults[:top_n]}

        recommendations = career_service.recommend_careers(skills, top_n)
        return {"recommendations": recommendations}
    except Exception as error:
        logger.error(f"Error recommending careers: {error}")
        return {"code": "RECOMMENDATION_ERROR", "message": str(error)}


@router.post("/select")
async def select_career(request: CareerSelectionRequest) -> dict[str, Any]:
    """
    Select target career for user.
    
    Request body:
    {
        "user_id": "user123",
        "career_id": "backend-developer"
    }
    """
    try:
        result = career_service.select_career(
            request.user_id,
            request.career_id
        )
        return result
    except ValueError as error:
        return {"code": "INVALID_CAREER", "message": str(error)}
    except Exception as error:
        logger.error(f"Error selecting career: {error}")
        return {"code": "SELECTION_ERROR", "message": str(error)}


@router.get("/{career_id}")
async def get_career(career_id: str) -> dict[str, Any]:
    """Get detailed information about a career."""
    try:
        return career_service.get_career_details(career_id)
    except ValueError as error:
        return {"code": "NOT_FOUND", "message": str(error)}
    except Exception as error:
        logger.error(f"Error getting career: {error}")
        return {"code": "ERROR", "message": str(error)}
