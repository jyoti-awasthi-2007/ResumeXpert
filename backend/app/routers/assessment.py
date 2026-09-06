"""Assessment generation and submission routes."""
import logging
from typing import Any

from fastapi import APIRouter

from app.schemas import (
    AssessmentRequest,
    AssessmentGenerationResponse,
    AssessmentSubmission,
    AssessmentResultResponse,
)
from app.services import AssessmentService
from app.services.career import CareerService
from app.services.resume import ResumeService
from app.utils import get_error_response, get_success_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])
assessment_service = AssessmentService()
career_service = CareerService()
resume_service = ResumeService()


@router.post("/generate")
async def generate_assessment(request: AssessmentRequest) -> dict[str, Any]:
    """
    Generate a new assessment.
    
    Request body:
    {
        "skills": ["Python", "SQL"],
        "difficulty": "BEGINNER",
        "user_id": "user123"
    }
    """
    try:
        resume_skills = resume_service.get_resume_skills(request.resume_id)
        skills = [
            skill.get("name", "") if isinstance(skill, dict) else str(skill)
            for skill in resume_skills
        ]
        skills = [skill for skill in skills if skill]

        if not skills:
            career = career_service.get_career_details(request.career_id)
            skills = career.get("required_skills", [])

        assessment = assessment_service.generate_assessment(
            skills,
            request.difficulty,
            getattr(request, "user_id", None)
        )
        return assessment
    except Exception as error:
        logger.error(f"Error generating assessment: {error}")
        return {"code": "GENERATION_ERROR", "message": str(error)}


@router.post("/{assessment_id}/submit")
async def submit_assessment(
    assessment_id: str,
    request: AssessmentSubmission
) -> dict[str, Any]:
    """
    Submit assessment answers and get results.
    
    Request body:
    {
        "answers": [
            {"question_id": "q_0", "answer": 1},
            {"question_id": "q_1", "answer": 2}
        ]
    }
    """
    try:
        answers = [
            (ans["question_id"], ans["answer"])
            for ans in request.answers
        ]

        result = assessment_service.submit_assessment(assessment_id, answers)
        return result
    except ValueError as error:
        return {"code": "NOT_FOUND", "message": str(error)}
    except Exception as error:
        logger.error(f"Error submitting assessment: {error}")
        return {"code": "SUBMISSION_ERROR", "message": str(error)}


@router.get("/{assessment_id}")
async def get_assessment(assessment_id: str) -> dict[str, Any]:
    """Get assessment information."""
    try:
        assessment = assessment_service.get_assessment(assessment_id)
        return assessment
    except ValueError as error:
        return {"code": "NOT_FOUND", "message": str(error)}
    except Exception as error:
        logger.error(f"Error getting assessment: {error}")
        return {"code": "ERROR", "message": str(error)}


@router.get("/{assessment_id}/result")
async def get_assessment_result(assessment_id: str) -> dict[str, Any]:
    """Get assessment results."""
    try:
        result = assessment_service.get_assessment_result(assessment_id)
        return result
    except ValueError as error:
        return {"code": "NOT_FOUND", "message": str(error)}
    except Exception as error:
        logger.error(f"Error getting assessment result: {error}")
        return {"code": "ERROR", "message": str(error)}
