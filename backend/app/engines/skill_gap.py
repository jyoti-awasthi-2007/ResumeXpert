"""Skill gap analysis engine."""
import logging
from typing import Any

logger = logging.getLogger(__name__)


class SkillGapEngine:
    """Engine for analyzing skill gaps."""

    def analyze_gap(
        self,
        user_skills: list[str],
        required_skills: list[str]
    ) -> dict[str, Any]:
        """
        Analyze skill gap between user skills and requirements.
        
        Args:
            user_skills: Skills the user has
            required_skills: Skills required for the target
            
        Returns:
            Skill gap analysis
        """
        user_skills_set = {skill.lower() for skill in user_skills}
        required_skills_set = {skill.lower() for skill in required_skills}
        
        # Calculate match
        have_skills = list(user_skills_set & required_skills_set)
        missing_skills = list(required_skills_set - user_skills_set)
        
        overall_match = int(
            (len(have_skills) / len(required_skills_set) * 100)
            if required_skills_set else 0
        )
        
        # Prioritize missing skills
        priorities = self._prioritize_skills(missing_skills)
        
        return {
            "overall_match": overall_match,
            "have_skills": sorted(have_skills),
            "missing_skills": sorted(missing_skills),
            "priorities": priorities,
        }

    @staticmethod
    def _prioritize_skills(skills: list[str]) -> list[dict[str, Any]]:
        """Prioritize skills into HIGH, MEDIUM, LOW categories."""
        # High priority: fundamental skills (first 3)
        # Medium priority: intermediate skills (next 3)
        # Low priority: nice-to-have skills (rest)
        
        priorities = []
        
        for level, threshold in [("HIGH", 3), ("MEDIUM", 6)]:
            priority_skills = skills[
                (len([s for s in priorities if s["level"] == "HIGH" or s["level"] == "MEDIUM"])):
                threshold
            ]
            if priority_skills:
                priorities.append({
                    "level": level,
                    "skills": priority_skills,
                })
        
        # Low priority
        if len(skills) > 6:
            priorities.append({
                "level": "LOW",
                "skills": skills[6:],
            })
        
        return priorities


class RecommendationEngine:
    """Engine for generating personalized recommendations."""

    def generate_recommendations(
        self,
        missing_skills: list[str],
        career_path: str,
        user_skills: list[str]
    ) -> list[dict[str, Any]]:
        """
        Generate personalized skill recommendations.
        
        Args:
            missing_skills: Skills user is missing
            career_path: Target career path
            user_skills: Skills user already has
            
        Returns:
            List of recommendations
        """
        from app.ai import ai_service
        
        # Get AI-generated recommendations
        ai_recommendations = ai_service.generate_recommendations(
            user_skills,
            missing_skills,
            career_path
        )
        
        # Enhance with additional metadata
        recommendations = []
        for rec in ai_recommendations:
            recommendations.append({
                "skill": rec.get("skill", ""),
                "priority": rec.get("priority", "MEDIUM"),
                "reason": rec.get("reason", "Important skill for career growth"),
                "estimated_learning_time": self._estimate_learning_time(
                    rec.get("skill", "")
                ),
                "difficulty": self._estimate_difficulty(rec.get("skill", "")),
                "prerequisites": self._get_prerequisites(rec.get("skill", "")),
            })
        
        return recommendations

    @staticmethod
    def _estimate_learning_time(skill: str) -> str:
        """Estimate time needed to learn a skill."""
        skill_lower = skill.lower()
        
        # Quick skills (< 1 month)
        if any(x in skill_lower for x in ["basic", "intro", "fundamentals"]):
            return "2-4 weeks"
        
        # Medium skills (1-3 months)
        if any(x in skill_lower for x in [
            "python", "javascript", "sql", "git",
            "html", "css", "react", "vue"
        ]):
            return "1-3 months"
        
        # Long skills (3-6 months)
        if any(x in skill_lower for x in [
            "machine learning", "deep learning", "kubernetes",
            "full stack", "devops", "cloud"
        ]):
            return "3-6 months"
        
        # Very long skills (6+ months)
        return "6+ months"

    @staticmethod
    def _estimate_difficulty(skill: str) -> str:
        """Estimate difficulty of learning a skill."""
        skill_lower = skill.lower()
        
        if any(x in skill_lower for x in [
            "python", "javascript", "html", "css", "git", "sql"
        ]):
            return "Beginner Friendly"
        
        if any(x in skill_lower for x in [
            "react", "django", "node.js", "docker", "postgresql"
        ]):
            return "Intermediate"
        
        if any(x in skill_lower for x in [
            "machine learning", "kubernetes", "devops", "cloud",
            "deep learning", "tensorflow", "spark"
        ]):
            return "Advanced"
        
        return "Intermediate"

    @staticmethod
    def _get_prerequisites(skill: str) -> list[str]:
        """Get prerequisite skills for learning a skill."""
        skill_lower = skill.lower()
        
        prerequisites = {
            "python": ["Programming Basics"],
            "javascript": ["HTML/CSS", "Web Fundamentals"],
            "react": ["JavaScript", "HTML/CSS"],
            "django": ["Python", "SQL", "Web Fundamentals"],
            "machine learning": ["Python", "Statistics", "Linear Algebra"],
            "deep learning": ["Machine Learning", "Python", "Calculus"],
            "kubernetes": ["Docker", "Linux", "Networking"],
            "devops": ["Linux", "Git", "Networking", "Databases"],
        }
        
        for key, prereqs in prerequisites.items():
            if key in skill_lower:
                return prereqs
        
        return []
