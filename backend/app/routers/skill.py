"""Skill gap analysis and recommendations routes."""
import logging
from typing import Any

from fastapi import APIRouter

from app.schemas import SkillGapResponse, RecommendationResponse
from app.services import CareerService, ResumeService, SkillGapService, RecommendationService
from app.utils import get_error_response, get_success_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Skills"])
gap_service = SkillGapService()
recommendation_service = RecommendationService()
career_service = CareerService()
resume_service = ResumeService()


def _resolve_user_skills(request: dict[str, Any]) -> list[str]:
    """Resolve user skills from either direct payloads or resume_id."""
    if request.get("user_skills"):
        return [str(skill) for skill in request["user_skills"] if skill]

    resume_id = request.get("resume_id")
    if resume_id:
        try:
            analysis = resume_service.get_resume_analysis(resume_id)
            return [str(skill["name"]) for skill in analysis.get("skills", []) if isinstance(skill, dict) and skill.get("name")]
        except Exception:
            pass

    return []


def _resolve_required_skills(request: dict[str, Any]) -> list[str]:
    """Resolve required skills from either direct payloads or career_id."""
    if request.get("required_skills"):
        return [str(skill) for skill in request["required_skills"]]

    career_id = request.get("career_id")
    if career_id:
        try:
            career = career_service.get_career_details(career_id)
            return [str(skill) for skill in career.get("required_skills", [])]
        except Exception:
            pass

    return []


def _resolve_career_path(request: dict[str, Any]) -> str:
    """Resolve career title from either the payload or the selected career."""
    if request.get("career_path"):
        return str(request["career_path"])

    career_id = request.get("career_id")
    if career_id:
        try:
            career = career_service.get_career_details(career_id)
            return str(career.get("title", ""))
        except Exception:
            pass

    return ""


@router.post("/skill-gap/analyze")
async def analyze_skill_gap(request: dict[str, Any]) -> dict[str, Any]:
    """
    Analyze skill gap for a specific career.
    
    Request body:
    {
        "resume_id": "abc123",
        "career_id": "backend-developer"
    }
    """
    try:
        user_skills = _resolve_user_skills(request)
        required_skills = _resolve_required_skills(request)
        career_path = _resolve_career_path(request)

        if not required_skills:
            return {"code": "INVALID_REQUEST", "message": "career requirements are required"}

        gap_analysis = gap_service.analyze_gap(user_skills, required_skills)

        return {
            "career_path": career_path,
            **gap_analysis,
        }
    except Exception as error:
        logger.error(f"Error analyzing skill gap: {error}")
        return {"code": "GAP_ANALYSIS_ERROR", "message": str(error)}


@router.post("/recommendations/skills")
async def get_skill_recommendations(request: dict[str, Any]) -> dict[str, Any]:
    """
    Get personalized skill recommendations.
    
    Request body:
    {
        "resume_id": "abc123",
        "career_id": "backend-developer"
    }
    """
    try:
        user_skills = _resolve_user_skills(request)
        career_path = _resolve_career_path(request)

        if request.get("missing_skills"):
            missing_skills = [str(skill) for skill in request["missing_skills"]]
        else:
            required_skills = _resolve_required_skills(request)
            if not required_skills:
                return {"code": "INVALID_REQUEST", "message": "career requirements are required"}
            missing_skills = gap_service.analyze_gap(user_skills, required_skills).get("missing_skills", [])

        if not missing_skills or not career_path:
            return {"code": "INVALID_REQUEST", "message": "missing skills and career path are required"}

        recommendations = recommendation_service.generate_recommendations(
            missing_skills,
            career_path,
            user_skills,
        )

        return {
            "career_path": career_path,
            "recommendations": recommendations,
        }
    except Exception as error:
        logger.error(f"Error generating recommendations: {error}")
        return {"code": "RECOMMENDATION_ERROR", "message": str(error)}
