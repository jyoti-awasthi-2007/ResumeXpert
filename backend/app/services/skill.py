"""Skill gap and recommendation service."""
import logging
from typing import Any

from app.engines import RecommendationEngine, SkillGapEngine

logger = logging.getLogger(__name__)


class SkillGapService:
    """Service for skill gap analysis."""

    def __init__(self):
        """Initialize skill gap service."""
        self.engine = SkillGapEngine()

    def analyze_gap(
        self,
        user_skills: list[str],
        required_skills: list[str]
    ) -> dict[str, Any]:
        """
        Analyze skill gap for a user.
        
        Args:
            user_skills: Skills user has
            required_skills: Skills required for target
            
        Returns:
            Skill gap analysis
        """
        logger.info(f"Analyzing skill gap for user with {len(user_skills)} skills")
        return self.engine.analyze_gap(user_skills, required_skills)


class RecommendationService:
    """Service for generating skill recommendations."""

    def __init__(self):
        """Initialize recommendation service."""
        self.engine = RecommendationEngine()

    def generate_recommendations(
        self,
        missing_skills: list[str],
        career_path: str,
        user_skills: list[str]
    ) -> list[dict[str, Any]]:
        """
        Generate recommendations for skill development.
        
        Args:
            missing_skills: Skills user needs to learn
            career_path: Target career path
            user_skills: Skills user currently has
            
        Returns:
            List of recommendations
        """
        logger.info(f"Generating recommendations for {career_path}")
        return self.engine.generate_recommendations(
            missing_skills,
            career_path,
            user_skills
        )
