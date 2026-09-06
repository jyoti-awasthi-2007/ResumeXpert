"""Pydantic schemas for request/response validation."""
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


# ============================================================
# Resume Schemas
# ============================================================

class ResumeUploadResponse(BaseModel):
    """Response after resume upload."""
    success: bool
    data: dict[str, Any] = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "resume_id": "abc123xyz",
                    "filename": "resume.pdf",
                    "file_type": "pdf",
                    "status": "uploaded"
                }
            }
        }


class ResumeAnalysisResponse(BaseModel):
    """Response after resume analysis."""
    success: bool
    data: dict[str, Any] = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "resume_id": "abc123xyz",
                    "resume_score": 84,
                    "status": "complete",
                    "summary": {"skills": 88, "projects": 82},
                    "strengths": ["Strong Python skills"],
                    "weaknesses": ["Limited deployment experience"],
                    "skills": [{"name": "Python", "category": "Programming", "confidence": 85}],
                    "missing_information": []
                }
            }
        }


class SkillExtracted(BaseModel):
    """Extracted skill from resume."""
    name: str
    category: str
    confidence: float = Field(ge=0, le=100)
    evidence: Optional[str] = None


class ResumeSummary(BaseModel):
    """Resume summary breakdown."""
    skills_score: int = Field(ge=0, le=100)
    projects_score: int = Field(ge=0, le=100)
    education_score: int = Field(ge=0, le=100)
    experience_score: int = Field(ge=0, le=100)
    keywords_score: int = Field(ge=0, le=100)


class ResumeAnalysisData(BaseModel):
    """Complete resume analysis data."""
    resume_id: str
    resume_score: int = Field(ge=0, le=100)
    status: str
    summary: ResumeSummary
    strengths: list[str]
    weaknesses: list[str]
    skills: list[SkillExtracted]
    missing_information: list[str]


# ============================================================
# Career Schemas
# ============================================================

class CareerRecommendation(BaseModel):
    """Recommended career."""
    id: str
    title: str
    description: str
    score: int = Field(ge=0, le=100)
    matched_skills: list[str]
    missing_skills: list[str]


class CareerRecommendationResponse(BaseModel):
    """Response with career recommendations."""
    success: bool
    data: dict[str, Any]


class CareerListResponse(BaseModel):
    """Response with all careers."""
    success: bool
    data: dict[str, list[dict[str, Any]]]


class CareerSelectionRequest(BaseModel):
    """Request to select target career."""
    user_id: str = "default_user"
    career_id: str


class CareerSelectionResponse(BaseModel):
    """Response after career selection."""
    success: bool
    data: dict[str, Any]


# ============================================================
# Skill Gap Schemas
# ============================================================

class SkillGapRequest(BaseModel):
    """Request for skill gap analysis."""
    resume_id: str
    career_id: str


class SkillGapPriority(BaseModel):
    """Skill gap priority group."""
    level: str  # HIGH, MEDIUM, LOW
    skills: list[str]


class SkillGapAnalysis(BaseModel):
    """Skill gap analysis result."""
    overall_match: int = Field(ge=0, le=100)
    have_skills: list[str]
    missing_skills: list[str]
    priorities: list[SkillGapPriority]


class SkillGapResponse(BaseModel):
    """Response with skill gap analysis."""
    success: bool
    data: SkillGapAnalysis


# ============================================================
# Recommendation Schemas
# ============================================================

class Recommendation(BaseModel):
    """Skill recommendation."""
    skill: str
    priority: str  # HIGH, MEDIUM, LOW
    reason: str
    estimated_learning_time: Optional[str] = None
    difficulty: Optional[str] = None
    prerequisites: list[str] = []


class RecommendationsResponse(BaseModel):
    """Response with recommendations."""
    success: bool
    data: list[Recommendation]


class RecommendationResponse(BaseModel):
    """Compatibility alias for recommendations responses."""
    success: bool
    data: list[Recommendation]


# ============================================================
# Assessment Schemas
# ============================================================

class AssessmentRequest(BaseModel):
    """Request to generate assessment."""
    resume_id: str
    career_id: str
    difficulty: str = Field(pattern="^(BEGINNER|ADVANCED|EXPERT)$")
    user_id: Optional[str] = None


class AssessmentQuestion(BaseModel):
    """Question in assessment."""
    id: str
    question: str
    options: list[str]
    skill: str
    difficulty: str
    career_id: str


class AssessmentGenerationResponse(BaseModel):
    """Response with generated assessment."""
    success: bool
    data: dict[str, Any]


class AssessmentResponse(BaseModel):
    """Compatibility alias for assessment generation response."""
    success: bool
    data: dict[str, Any]


class AssessmentAnswer(BaseModel):
    """Answer to assessment question."""
    question_id: str
    answer: int = Field(ge=0, le=3)


class AssessmentSubmission(BaseModel):
    """Assessment submission."""
    answers: list[AssessmentAnswer]


class SkillScore(BaseModel):
    """Skill score in assessment."""
    skill: str
    score: int = Field(ge=0, le=100)


class AssessmentResult(BaseModel):
    """Assessment result."""
    assessment_id: str
    score: int = Field(ge=0, le=100)
    status: str
    correct: int
    incorrect: int
    total: int
    skill_scores: list[SkillScore]


class AssessmentResultResponse(BaseModel):
    """Response with assessment result."""
    success: bool
    data: AssessmentResult


# ============================================================
# Confidence Schemas
# ============================================================

class SkillConfidence(BaseModel):
    """Skill confidence data."""
    skill: str
    resume_claim: Optional[str] = None
    assessment_score: int = Field(ge=0, le=100)
    confidence_score: int = Field(ge=0, le=100)
    confidence_level: str


class ConfidenceResponse(BaseModel):
    """Response with confidence data."""
    success: bool
    data: list[SkillConfidence]


# ============================================================
# Claim vs Actual Schemas
# ============================================================

class ClaimVsActual(BaseModel):
    """Comparison of claimed vs actual skill."""
    skill: str
    claimed_level: Optional[str] = None
    assessment_score: int = Field(ge=0, le=100)
    confidence_score: int = Field(ge=0, le=100)
    status: str


class ClaimVsActualResponse(BaseModel):
    """Response with claim vs actual data."""
    success: bool
    data: list[ClaimVsActual]


# ============================================================
# Career Readiness Schemas
# ============================================================

class ReadinessBreakdown(BaseModel):
    """Career readiness score breakdown."""
    resume_quality: int = Field(ge=0, le=100)
    skill_match: int = Field(ge=0, le=100)
    assessment: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)


class NextStep(BaseModel):
    """Next step recommendation."""
    title: str
    reason: str
    action: str


class CareerReadiness(BaseModel):
    """Career readiness data."""
    score: int = Field(ge=0, le=100)
    status: str
    breakdown: ReadinessBreakdown
    strengths: list[str]
    improvements: list[str]
    next_steps: list[NextStep]


class CareerReadinessResponse(BaseModel):
    """Response with career readiness."""
    success: bool
    data: CareerReadiness


# ============================================================
# Analytics Schemas
# ============================================================

class DashboardMetrics(BaseModel):
    """Dashboard analytics metrics."""
    career_readiness: int = Field(ge=0, le=100)
    resume_score: int = Field(ge=0, le=100)
    assessment_score: int = Field(ge=0, le=100)
    confidence_score: int = Field(ge=0, le=100)
    skills_detected: int = Field(ge=0)
    career_match: int = Field(ge=0, le=100)
    skill_gap_count: int = Field(ge=0)


class AnalyticsResponse(BaseModel):
    """Response with analytics."""
    success: bool
    data: DashboardMetrics


# ============================================================
# Error Schemas
# ============================================================

class ErrorDetail(BaseModel):
    """Error detail."""
    code: str
    message: str


class ErrorResponse(BaseModel):
    """Error response."""
    success: bool = False
    error: ErrorDetail


# ============================================================
# Health Schemas
# ============================================================

class HealthResponse(BaseModel):
    """Health check response."""
    success: bool
    data: dict[str, Any]
