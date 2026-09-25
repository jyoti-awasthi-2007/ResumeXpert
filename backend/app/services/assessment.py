"""Assessment service for quiz operations."""
import logging
import json
from pathlib import Path
from typing import Any

from app.engines import AssessmentEngine
from app.config import settings

logger = logging.getLogger(__name__)


class AssessmentService:
    """Service for assessment operations."""

    _instance: "AssessmentService | None" = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize assessment service."""
        if hasattr(self, "_initialized") and self._initialized:
            return

        self.engine = AssessmentEngine()
        self.store_path = settings.get_upload_dir() / "assessments.json"
        self.store_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            self.assessments = json.loads(self.store_path.read_text(encoding="utf-8")) if self.store_path.exists() else {}
        except (OSError, json.JSONDecodeError):
            logger.warning("Assessment store could not be loaded; starting with an empty store.")
            self.assessments = {}
        self._initialized = True

    def _save(self) -> None:
        """Persist assessment sessions and results without exposing answers to clients."""
        self.store_path.write_text(json.dumps(self.assessments), encoding="utf-8")

    def generate_assessment(
        self,
        skills: list[str],
        difficulty: str,
        user_id: str | None = None,
        career: str = ""
    ) -> dict[str, Any]:
        """
        Generate a new assessment.
        
        Args:
            skills: Skills to assess
            difficulty: BEGINNER, ADVANCED, or EXPERT
            user_id: Optional user ID
            
        Returns:
            Generated assessment
        """
        import secrets
        
        # Generate questions (with correct answers for server-side)
        questions = self.engine.generate_assessment(skills, difficulty, num_questions=10, career=career)
        
        # Create assessment ID
        assessment_id = secrets.token_urlsafe(12)
        
        # Store assessment (questions with correct answers)
        self.assessments[assessment_id] = {
            "id": assessment_id,
            "user_id": user_id,
            "skills": skills,
            "difficulty": difficulty,
            "questions": questions,
            "status": "generated",
            "result": None,
        }
        self._save()
        
        logger.info(f"Assessment {assessment_id} generated for skills: {skills}")
        
        # Return questions WITHOUT correct answers to frontend
        public_questions = [
            {
                "id": q["id"],
                "question": q["question"],
                "options": q["options"],
                "skill": q["skill"],
                "difficulty": q["difficulty"],
            }
            for q in questions
        ]
        
        return {
            "assessment_id": assessment_id,
            "skills": skills,
            "difficulty": difficulty,
            "questions": public_questions,
        }

    def submit_assessment(
        self,
        assessment_id: str,
        answers: list[tuple[str, int]]
    ) -> dict[str, Any]:
        """
        Submit and score assessment.
        
        Args:
            assessment_id: Assessment ID
            answers: List of (question_id, answer) tuples
            
        Returns:
            Assessment results
        """
        if assessment_id not in self.assessments:
            raise ValueError(f"Assessment {assessment_id} not found")
        
        assessment = self.assessments[assessment_id]
        if assessment["status"] == "completed" and assessment["result"]:
            return {"assessment_id": assessment_id, **assessment["result"]}
        questions = assessment["questions"]
        
        # Score the assessment
        result = self.engine.score_assessment(questions, answers)
        
        # Store result
        self.assessments[assessment_id]["result"] = result
        self.assessments[assessment_id]["status"] = "completed"
        self._save()
        
        logger.info(f"Assessment {assessment_id} scored: {result['score']}")
        
        return {
            "assessment_id": assessment_id,
            **result,
        }

    def get_assessment(self, assessment_id: str) -> dict[str, Any]:
        """Get assessment information."""
        if assessment_id not in self.assessments:
            raise ValueError(f"Assessment {assessment_id} not found")
        
        assessment = self.assessments[assessment_id]
        return {
            "assessment_id": assessment_id,
            "status": assessment["status"],
            "difficulty": assessment["difficulty"],
            "skills": assessment["skills"],
        }

    def get_assessment_result(self, assessment_id: str) -> dict[str, Any]:
        """Get assessment result."""
        if assessment_id not in self.assessments:
            raise ValueError(f"Assessment {assessment_id} not found")
        
        result = self.assessments[assessment_id]["result"]
        if not result:
            raise ValueError(f"Assessment {assessment_id} has no result")
        
        return {
            "assessment_id": assessment_id,
            **result,
        }
