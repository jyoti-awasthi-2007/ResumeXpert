"""Career service for career-related operations."""
import logging
from typing import Any

from app.engines import CareerMatchingEngine

logger = logging.getLogger(__name__)


class CareerService:
    """Service for career operations."""

    _instance: "CareerService | None" = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize career service."""
        if hasattr(self, "_initialized") and self._initialized:
            return

        self.engine = CareerMatchingEngine()
        self.user_selections = {}  # user_id -> career_id
        self._initialized = True

    def get_all_careers(self) -> list[dict[str, Any]]:
        """Get all available careers."""
        return self.engine.get_all_careers()

    def recommend_careers(
        self,
        user_skills: list[str],
        top_n: int = 5
    ) -> list[dict[str, Any]]:
        """
        Recommend careers based on user skills.
        
        Args:
            user_skills: Skills the user has
            top_n: Number of recommendations to return
            
        Returns:
            List of recommended careers
        """
        logger.info(f"Recommending careers for skills: {user_skills}")
        return self.engine.recommend_careers(user_skills, top_n)

    def select_career(self, user_id: str, career_id: str) -> dict[str, Any]:
        """
        Select target career for user.
        
        Args:
            user_id: User ID
            career_id: Career ID to select
            
        Returns:
            Selection result
        """
        # Verify career exists
        career = self.engine.get_career_details(career_id)
        if not career:
            raise ValueError(f"Career {career_id} not found")
        
        self.user_selections[user_id] = career_id
        logger.info(f"User {user_id} selected career {career_id}")
        
        return {
            "user_id": user_id,
            "career_id": career_id,
            "career_title": career["title"],
        }

    def get_user_selected_career(self, user_id: str) -> dict[str, Any] | None:
        """Get user's selected target career."""
        career_id = self.user_selections.get(user_id)
        if not career_id:
            return None
        
        return self.engine.get_career_details(career_id)

    def get_career_details(self, career_id: str) -> dict[str, Any]:
        """Get detailed information about a career."""
        career = self.engine.get_career_details(career_id)
        if not career:
            raise ValueError(f"Career {career_id} not found")
        return career
