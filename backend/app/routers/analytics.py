"""Analytics and insights routes."""
import logging
from typing import Any

from fastapi import APIRouter

from app.services import AssessmentService, CareerService, ResumeService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Analytics"])

assessment_service = AssessmentService()
career_service = CareerService()
resume_service = ResumeService()


def _get_user_assessment(user_id: str) -> dict[str, Any] | None:
    """Find latest completed assessment for a user or fallback."""
    try:
        import json
        store_path = getattr(assessment_service, "store_path", None)
        if store_path and store_path.exists():
            assessments = json.loads(store_path.read_text(encoding="utf-8"))
        else:
            assessments = getattr(assessment_service, "assessments", {})
    except Exception:
        assessments = getattr(assessment_service, "assessments", {})

    # Check for direct user_id match
    matching = [
        a for a in assessments.values()
        if a.get("user_id") == user_id and a.get("status") == "completed" and a.get("result")
    ]
    if matching:
        return matching[-1]

    # If generic demo-user or no match, find any latest completed assessment
    completed = [
        a for a in assessments.values()
        if a.get("status") == "completed" and a.get("result")
    ]
    return completed[-1] if completed else None


def _get_user_resume(user_id: str) -> dict[str, Any] | None:
    """Find latest analyzed resume for a user."""
    store = getattr(resume_service, "resume_store", {})
    matching = [
        r for r in store.values()
        if r.get("user_id") == user_id and r.get("analysis")
    ]
    if matching:
        return matching[-1]
    
    # Fallback to any latest analyzed resume in store
    analyzed = [r for r in store.values() if r.get("analysis")]
    return analyzed[-1] if analyzed else None


@router.get("/confidence/{user_id}")
async def get_confidence_score(user_id: str) -> list[dict[str, Any]]:
    """
    Get skill confidence scores dynamically calculated from real assessments and resume evidence.
    """
    try:
        assessment = _get_user_assessment(user_id)
        if not assessment or not assessment.get("result"):
            return []

        result = assessment["result"]
        raw_scores = result.get("skill_scores") or result.get("skills") or []
        normalized_scores = []
        if isinstance(raw_scores, list):
            for item in raw_scores:
                if isinstance(item, dict):
                    name = item.get("skill") or item.get("name")
                    score_val = item.get("score", result.get("score", 0))
                    if name:
                        normalized_scores.append((name, score_val))
                elif isinstance(item, str):
                    normalized_scores.append((item, result.get("score", 0)))
        elif isinstance(raw_scores, dict):
            for name, score_val in raw_scores.items():
                normalized_scores.append((name, score_val))

        if not normalized_scores and assessment.get("skills"):
            for name in assessment.get("skills", []):
                normalized_scores.append((name, result.get("score", 0)))

        # Build resume skills set for matching
        resume_record = _get_user_resume(user_id)
        resume_skills = set()
        if resume_record and resume_record.get("analysis"):
            raw_resume_skills = resume_record["analysis"].get("skills", [])
            resume_skills = {
                (s["name"] if isinstance(s, dict) else str(s)).lower()
                for s in raw_resume_skills
            }

        confidence_items = []
        for skill, score in normalized_scores:
            has_resume_claim = skill.lower() in resume_skills
            resume_evidence = 80 if has_resume_claim else 60
            confidence_score = round((resume_evidence + score) / 2)
            level = "High" if confidence_score >= 76 else ("Medium" if confidence_score >= 50 else "Developing")
            claim = "Demonstrated" if has_resume_claim else "Inferred"

            confidence_items.append({
                "skill": skill,
                "resume_claim": claim,
                "assessment_score": score,
                "confidence_score": confidence_score,
                "confidence_level": level,
            })

        return confidence_items
    except Exception as error:
        logger.error(f"Error getting confidence: {error}")
        return []


@router.get("/skills/claim-vs-actual/{user_id}")
async def get_claim_vs_actual(user_id: str) -> list[dict[str, Any]]:
    """
    Compare claimed skills vs actual assessment scores from real data.
    """
    try:
        confidence_items = await get_confidence_score(user_id)
        if not confidence_items:
            return []

        return [
            {
                "skill": item["skill"],
                "claimed_level": item["resume_claim"],
                "assessment_score": item["assessment_score"],
                "confidence_score": item["confidence_score"],
                "status": "Well Supported" if item["confidence_score"] >= 70 else "Needs Validation",
            }
            for item in confidence_items
        ]
    except Exception as error:
        logger.error(f"Error getting claim vs actual: {error}")
        return []


@router.get("/career-readiness/{user_id}")
async def get_career_readiness(user_id: str) -> dict[str, Any]:
    """
    Get overall career readiness score calculated from real assessment and resume data.
    """
    try:
        resume_record = _get_user_resume(user_id)
        resume_analysis = resume_record.get("analysis", {}) if resume_record else {}
        resume_score = resume_analysis.get("score", 0)

        assessment = _get_user_assessment(user_id)
        assessment_score = assessment.get("result", {}).get("score", 0) if assessment else 0

        # Calculate confidence from real items
        conf_items = await get_confidence_score(user_id)
        confidence_val = (
            round(sum(c["confidence_score"] for c in conf_items) / len(conf_items))
            if conf_items
            else (assessment_score if assessment_score > 0 else 0)
        )

        selected_career = career_service.get_user_selected_career(user_id)
        career_match = selected_career.get("score", 0) if selected_career else 0

        valid_scores = [s for s in [resume_score, career_match, assessment_score, confidence_val] if s > 0]
        overall = round(sum(valid_scores) / len(valid_scores)) if valid_scores else 0

        status = "Strong Preparation" if overall >= 75 else ("Good Preparation" if overall >= 50 else "Developing")

        strengths = resume_analysis.get("strengths", []) or [
            "Resume content processed successfully",
            "Core qualifications identified",
        ]
        improvements = resume_analysis.get("improvements", []) or resume_analysis.get("weaknesses", []) or [
            "Take skill assessments to validate your expertise",
            "Focus on target career recommendations",
        ]

        return {
            "user_id": user_id,
            "overall_score": overall,
            "status": status,
            "breakdown": {
                "resume_quality": resume_score,
                "skill_match": career_match,
                "assessment_score": assessment_score,
                "confidence": confidence_val,
            },
            "strengths": strengths,
            "improvements": improvements,
        }
    except Exception as error:
        logger.error(f"Error getting readiness: {error}")
        return {"code": "ERROR", "message": str(error)}


@router.get("/analytics/dashboard/{user_id}")
async def get_dashboard_analytics(user_id: str) -> dict[str, Any]:
    """
    Get comprehensive dashboard analytics from real data.
    """
    try:
        readiness = await get_career_readiness(user_id)
        breakdown = readiness.get("breakdown", {})

        resume_record = _get_user_resume(user_id)
        skills_count = len(resume_record.get("analysis", {}).get("skills", [])) if resume_record else 0

        selected_career = career_service.get_user_selected_career(user_id)
        career_match = selected_career.get("score", 0) if selected_career else breakdown.get("skill_match", 0)

        return {
            "user_id": user_id,
            "career_readiness_score": readiness.get("overall_score", 0),
            "resume_score": breakdown.get("resume_quality", 0),
            "assessment_score": breakdown.get("assessment_score", 0),
            "confidence_score": breakdown.get("confidence", 0),
            "skills_detected": skills_count,
            "career_match": career_match,
            "skill_gap_count": max(0, 5 - min(5, skills_count)),
        }
    except Exception as error:
        logger.error(f"Error getting dashboard: {error}")
        return {"code": "ERROR", "message": str(error)}

