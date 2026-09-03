"""AI service abstraction for configurable provider integration."""
import json
import logging
from abc import ABC, abstractmethod
from typing import Any, Optional

from app.config import settings

logger = logging.getLogger(__name__)


class AIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    def generate_mcq(
        self,
        skill: str,
        difficulty: str,
        context: Optional[str] = None,
    ) -> dict[str, Any]:
        """Generate multiple choice question for a skill."""
        pass

    @abstractmethod
    def generate_question_explanation(
        self,
        question: str,
        correct_answer: str,
        explanation_style: str = "brief",
    ) -> str:
        """Generate explanation for a question answer."""
        pass

    @abstractmethod
    def analyze_resume_summary(
        self,
        resume_text: str,
        skills_found: list[str],
    ) -> dict[str, Any]:
        """Generate AI-powered resume summary."""
        pass

    @abstractmethod
    def generate_career_reasoning(
        self,
        career_title: str,
        user_skills: list[str],
        missing_skills: list[str],
    ) -> str:
        """Generate reasoning for career recommendation."""
        pass

    @abstractmethod
    def generate_recommendations(
        self,
        user_skills: list[str],
        missing_skills: list[str],
        career_path: str,
    ) -> list[dict[str, str]]:
        """Generate personalized skill recommendations."""
        pass


class OpenAIProvider(AIProvider):
    """OpenAI GPT provider implementation."""

    def __init__(self):
        """Initialize OpenAI-compatible provider."""
        try:
            import openai
            client_kwargs = {"api_key": settings.AI_API_KEY}
            if settings.AI_BASE_URL:
                client_kwargs["base_url"] = settings.AI_BASE_URL
            self.client = openai.OpenAI(**client_kwargs)
            self.model = settings.AI_MODEL
            self.timeout = settings.AI_TIMEOUT
        except ImportError:
            logger.error("openai package not installed")
            raise

    def generate_mcq(
        self,
        skill: str,
        difficulty: str,
        context: Optional[str] = None,
    ) -> dict[str, Any]:
        """Generate MCQ using OpenAI."""
        prompt = f"""Generate a multiple choice question for testing {skill} knowledge at {difficulty} level.
Context: {context or 'General knowledge'}

Return ONLY valid JSON in this exact format:
{{
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Brief explanation of why this is correct"
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                timeout=self.timeout,
            )
            
            content = response.choices[0].message.content
            result = json.loads(content)
            return result
        except Exception as error:
            logger.error(f"Error generating MCQ: {error}")
            return self._get_fallback_mcq(skill, difficulty)

    def generate_question_explanation(
        self,
        question: str,
        correct_answer: str,
        explanation_style: str = "brief",
    ) -> str:
        """Generate explanation for question answer."""
        prompt = f"""Provide a {explanation_style} explanation for this Q&A:
Question: {question}
Correct Answer: {correct_answer}

Keep explanation concise and educational."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                timeout=self.timeout,
            )
            return response.choices[0].message.content
        except Exception as error:
            logger.error(f"Error generating explanation: {error}")
            return "See documentation for more information."

    def analyze_resume_summary(
        self,
        resume_text: str,
        skills_found: list[str],
    ) -> dict[str, Any]:
        """Generate AI-powered resume summary."""
        prompt = f"""Analyze this resume and provide constructive feedback:
Skills detected: {', '.join(skills_found)}

Resume excerpt:
{resume_text[:2000]}

Return ONLY valid JSON in this format:
{{
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "recommendations": ["recommendation 1", "recommendation 2"]
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                timeout=self.timeout,
            )
            
            content = response.choices[0].message.content
            result = json.loads(content)
            return result
        except Exception as error:
            logger.error(f"Error analyzing resume: {error}")
            return {
                "strengths": ["Resume structure is clear"],
                "weaknesses": ["Could add more specific metrics"],
                "recommendations": ["Use quantifiable achievements"],
            }

    def generate_career_reasoning(
        self,
        career_title: str,
        user_skills: list[str],
        missing_skills: list[str],
    ) -> str:
        """Generate reasoning for career recommendation."""
        prompt = f"""Provide a brief, personalized reasoning why {career_title} is a good match:
User's skills: {', '.join(user_skills)}
Missing skills: {', '.join(missing_skills)}

Keep response concise and motivating (2-3 sentences)."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                timeout=self.timeout,
            )
            return response.choices[0].message.content
        except Exception as error:
            logger.error(f"Error generating career reasoning: {error}")
            return f"Your skills align well with {career_title} requirements. Focus on filling skill gaps to accelerate career growth."

    def generate_recommendations(
        self,
        user_skills: list[str],
        missing_skills: list[str],
        career_path: str,
    ) -> list[dict[str, str]]:
        """Generate personalized skill recommendations."""
        prompt = f"""Generate personalized skill recommendations for someone pursuing {career_path}:
Current skills: {', '.join(user_skills)}
Missing skills: {', '.join(missing_skills[:5])}

Return ONLY valid JSON array:
[
    {{"skill": "Skill Name", "priority": "HIGH/MEDIUM/LOW", "reason": "Why this skill is important"}},
]

Generate 3-5 recommendations with highest priority skills first."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                timeout=self.timeout,
            )
            
            content = response.choices[0].message.content
            # Clean markdown formatting if present
            content = content.strip()
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()
            
            result = json.loads(content)
            return result
        except Exception as error:
            logger.error(f"Error generating recommendations: {error}")
            return self._get_fallback_recommendations(missing_skills, career_path)

    @staticmethod
    def _get_fallback_mcq(skill: str, difficulty: str) -> dict[str, Any]:
        """Fallback MCQ when AI is unavailable."""
        fallback_mcqs = {
            "Python": {
                "BEGINNER": {
                    "question": "What is Python primarily used for?",
                    "options": [
                        "Web development only",
                        "General-purpose programming including web, data, and AI",
                        "Mobile app development only",
                        "Game development only",
                    ],
                    "correct_answer": 1,
                    "explanation": "Python is versatile and used for web development, data science, AI/ML, scripting, and more.",
                },
            },
        }
        
        if skill in fallback_mcqs and difficulty in fallback_mcqs[skill]:
            return fallback_mcqs[skill][difficulty]
        
        return {
            "question": f"What is a key characteristic of {skill}?",
            "options": ["Powerful and flexible", "Limited scope", "Outdated", "Rarely used"],
            "correct_answer": 0,
            "explanation": f"{skill} is known for its powerful capabilities and wide adoption.",
        }

    @staticmethod
    def _get_fallback_recommendations(
        missing_skills: list[str],
        career_path: str,
    ) -> list[dict[str, str]]:
        """Fallback recommendations when AI is unavailable."""
        recommendations = []
        for i, skill in enumerate(missing_skills[:3]):
            priority = "HIGH" if i == 0 else "MEDIUM" if i == 1 else "LOW"
            recommendations.append({
                "skill": skill,
                "priority": priority,
                "reason": f"Essential skill for advancing in {career_path}",
            })
        return recommendations


class FallbackAIProvider(AIProvider):
    """Fallback provider when AI service is unavailable."""

    def generate_mcq(
        self,
        skill: str,
        difficulty: str,
        context: Optional[str] = None,
    ) -> dict[str, Any]:
        """Generate fallback MCQ."""
        return {
            "question": f"What is a fundamental concept in {skill}?",
            "options": [
                f"Understanding {skill} basics",
                "Advanced techniques",
                "Only theoretical knowledge",
                "Practical implementation",
            ],
            "correct_answer": 0,
            "explanation": f"Foundation in {skill} fundamentals is essential.",
        }

    def generate_question_explanation(
        self,
        question: str,
        correct_answer: str,
        explanation_style: str = "brief",
    ) -> str:
        """Generate fallback explanation."""
        return f"The answer '{correct_answer}' is correct because it represents the core concept being tested."

    def analyze_resume_summary(
        self,
        resume_text: str,
        skills_found: list[str],
    ) -> dict[str, Any]:
        """Generate fallback resume summary."""
        return {
            "strengths": [
                "Resume clearly lists relevant skills",
                "Professional format is readable",
            ],
            "weaknesses": [
                "Could include more quantifiable metrics",
                "Missing specific project examples",
            ],
            "recommendations": [
                "Add measurable outcomes to achievements",
                "Include specific technologies and results",
            ],
        }

    def generate_career_reasoning(
        self,
        career_title: str,
        user_skills: list[str],
        missing_skills: list[str],
    ) -> str:
        """Generate fallback career reasoning."""
        return f"Your current skills provide a solid foundation for {career_title}. By focusing on the identified skill gaps, you can significantly strengthen your candidacy."

    def generate_recommendations(
        self,
        user_skills: list[str],
        missing_skills: list[str],
        career_path: str,
    ) -> list[dict[str, str]]:
        """Generate fallback recommendations."""
        recommendations = []
        for i, skill in enumerate(missing_skills[:3]):
            priority = "HIGH" if i == 0 else "MEDIUM" if i == 1 else "LOW"
            recommendations.append({
                "skill": skill,
                "priority": priority,
                "reason": f"Important for {career_path} role requirements",
            })
        return recommendations


class AIService:
    """Service for AI operations with provider abstraction."""

    def __init__(self):
        """Initialize AI service with configured provider."""
        self.provider = self._get_provider()

    def _get_provider(self) -> AIProvider:
        """Get configured AI provider."""
        provider_name = (settings.AI_PROVIDER or "openai").lower()

        if provider_name in {"openai", "grok", "xai", "groq"} and settings.AI_API_KEY:
            try:
                logger.info("Initializing OpenAI-compatible provider: %s", provider_name)
                return OpenAIProvider()
            except Exception as error:
                logger.warning(f"Failed to initialize AI provider: {error}. Using fallback.")
                return FallbackAIProvider()

        logger.info("Using fallback AI provider")
        return FallbackAIProvider()

    def generate_mcq(
        self,
        skill: str,
        difficulty: str,
        context: Optional[str] = None,
    ) -> dict[str, Any]:
        """Generate multiple choice question."""
        return self.provider.generate_mcq(skill, difficulty, context)

    def generate_question_explanation(
        self,
        question: str,
        correct_answer: str,
        explanation_style: str = "brief",
    ) -> str:
        """Generate explanation for question answer."""
        return self.provider.generate_question_explanation(
            question, correct_answer, explanation_style
        )

    def analyze_resume_summary(
        self,
        resume_text: str,
        skills_found: list[str],
    ) -> dict[str, Any]:
        """Generate AI-powered resume summary."""
        return self.provider.analyze_resume_summary(resume_text, skills_found)

    def generate_career_reasoning(
        self,
        career_title: str,
        user_skills: list[str],
        missing_skills: list[str],
    ) -> str:
        """Generate reasoning for career recommendation."""
        return self.provider.generate_career_reasoning(
            career_title, user_skills, missing_skills
        )

    def generate_recommendations(
        self,
        user_skills: list[str],
        missing_skills: list[str],
        career_path: str,
    ) -> list[dict[str, str]]:
        """Generate personalized skill recommendations."""
        return self.provider.generate_recommendations(
            user_skills, missing_skills, career_path
        )


# Global AI service instance
ai_service = AIService()
