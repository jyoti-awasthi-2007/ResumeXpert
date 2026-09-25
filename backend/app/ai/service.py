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
    def generate_mcqs_batch(
        self,
        skills: list[str],
        difficulty: str,
        count: int = 10,
        career: str = "",
    ) -> list[dict[str, Any]]:
        """Generate multiple choice questions in a single batch request."""
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

    @abstractmethod
    def chat(self, message: str, context: Optional[str] = None) -> str:
        """Answer a user help question."""
        pass


class OpenAIProvider(AIProvider):
    """OpenAI GPT provider implementation."""

    def __init__(self):
        """Initialize OpenAI-compatible provider."""
        try:
            import openai
            client_kwargs = {"api_key": settings.AI_API_KEY, "max_retries": max(1, settings.AI_MAX_RETRIES)}
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
                max_tokens=350,
                timeout=min(self.timeout, 8),
            )
            
            content = response.choices[0].message.content or ""
            # Some compatible providers wrap JSON in a markdown code fence.
            content = content.strip().removeprefix("```json").removesuffix("```").strip()
            result = json.loads(content)
            options = result.get("options", [])
            correct_answer = result.get("correct_answer", result.get("correct"))
            if not result.get("question") or len(options) != 4 or len(set(options)) != 4 or not isinstance(correct_answer, int) or not 0 <= correct_answer < 4:
                raise ValueError("AI returned an invalid MCQ shape")
            return {
                "question": result["question"],
                "options": options,
                "correct": correct_answer,
                "correct_answer": correct_answer,
                "explanation": result.get("explanation", ""),
            }
        except Exception as error:
            logger.error(f"Error generating MCQ: {error}")
            return self._get_fallback_mcq(skill, difficulty)

    def generate_mcqs_batch(
        self,
        skills: list[str],
        difficulty: str,
        count: int = 10,
        career: str = "",
    ) -> list[dict[str, Any]]:
        """Generate multiple choice questions in a single batch request."""
        target_skills = ", ".join(skills[:5]) if skills else "general technical concepts"
        career_ctx = f" for the role of '{career}'" if career else ""
        prompt = f"""Generate {count} unique multiple choice questions testing these skills: {target_skills} at {difficulty} level{career_ctx}.
Return ONLY a valid JSON array of objects. No markdown code fences, no extra text.
Each object must have:
- "question": string
- "options": array of exactly 4 distinct choices
- "correct_answer": integer (0, 1, 2, or 3)
- "skill": string (one of the tested skills)
- "explanation": brief explanation"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=800,
                timeout=min(self.timeout, 8),
            )
            content = response.choices[0].message.content or ""
            content = content.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            if "[" in content and "]" in content:
                content = content[content.find("["):content.rfind("]") + 1]
            items = json.loads(content)
            if not isinstance(items, list):
                return []
            valid_questions = []
            for item in items:
                options = item.get("options", [])
                correct_answer = item.get("correct_answer", item.get("correct"))
                if (
                    item.get("question")
                    and len(options) == 4
                    and len(set(options)) == 4
                    and isinstance(correct_answer, int)
                    and 0 <= correct_answer < 4
                ):
                    valid_questions.append({
                        "question": item["question"].strip(),
                        "options": options,
                        "correct": correct_answer,
                        "correct_answer": correct_answer,
                        "skill": item.get("skill") or (skills[0] if skills else "General"),
                        "explanation": item.get("explanation", ""),
                    })
            return valid_questions
        except Exception as error:
            logger.warning(f"Batch MCQ generation failed: {error}")
            return []

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
                max_tokens=200,
                timeout=min(self.timeout, 6),
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
                temperature=0.6,
                max_tokens=450,
                timeout=min(self.timeout, 8),
            )
            
            content = response.choices[0].message.content or ""
            content = content.strip()
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()

            result = json.loads(content)
            return result
        except Exception as error:
            logger.error(f"Error analyzing resume: {error}")
            return {
                "strengths": ["Resume structure is clear and organized"],
                "weaknesses": [
                    "Quantify achievements with measurable metrics (e.g., percentages, project scope)",
                    "Include specific project examples and technical responsibilities",
                    "Add cloud or modern framework experience to broaden skill coverage",
                ],
                "recommendations": [
                    "Use quantifiable achievements in experience bullet points",
                    "Highlight technical tools and project outcomes clearly",
                ],
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
                max_tokens=200,
                timeout=min(self.timeout, 6),
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
                max_tokens=400,
                timeout=min(self.timeout, 8),
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

    def chat(self, message: str, context: Optional[str] = None) -> str:
        """Answer a user help question with the configured AI model."""
        system_prompt = (
            "You are ResumeXpert AI Career Assistant, the built-in intelligent guide for the ResumeXpert platform. "
            "Your mission is to help users excel with their resumes, career roadmaps, skill gaps, technical interview preparation, and skill assessments.\n"
            "Key Instructions:\n"
            "1. When the user asks about 'this system', 'the app', or 'how to use this', explain how to use the ResumeXpert platform itself (Dashboard, Resume Analysis, Career Suggestions, Skill Gap, Assessments, Career Readiness).\n"
            "2. When the user asks what skills are important or in-demand, provide a clear, prioritized breakdown of core technical and domain skills.\n"
            "3. Structure your response with clear headings, bullet points, and bold text. Keep answers focused, rich, and well-structured (around 400 to 650 words).\n"
            "4. Always deliver a complete, fully finished answer. Finish every section, list, table, and conclusion completely. Never cut off."
        )

        user_content_parts = []
        if context and context.strip():
            user_content_parts.append(f"User Profile / Context: {context.strip()}")
        user_content_parts.append(f"User Question: {message.strip()}")
        user_content_parts.append("Please provide a thorough, complete, and fully finished actionable response.")
        prompt = "\n\n".join(user_content_parts)

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.4,
                max_tokens=3072,
                timeout=min(self.timeout, 55),
            )
            content = (response.choices[0].message.content or "").strip()
            if not content:
                return self._fallback_chat(message)
            return content
        except Exception as error:
            logger.error(f"Error generating chat response: {error}")
            return self._fallback_chat(message)

    @staticmethod
    def _fallback_chat(message: str) -> str:
        """Provide rich, structured support when the external AI service is temporarily unavailable."""
        q = message.lower()

        if "how" in q and ("use" in q or "system" in q or "work" in q or "start" in q):
            return (
                "### How to Use the ResumeXpert System\n\n"
                "ResumeXpert is designed to guide you step-by-step from resume upload to career readiness:\n\n"
                "1. **Upload Resume (`Resume Analysis`)**: Upload your resume in PDF or DOCX format. The system automatically parses your profile, scores ATS compliance, and extracts your key skills.\n"
                "2. **Explore In-Demand Roles (`Career Suggestions`)**: Discover matched careers ranked by compatibility with your current technical skill set.\n"
                "3. **Analyze Missing Skills (`Skill Gap`)**: See exact skills required for your target role that are missing from your resume, along with prioritized recommendations.\n"
                "4. **Validate Your Knowledge (`Skill Assessment`)**: Take interactive, AI-generated multiple-choice assessments to test your claimed skills.\n"
                "5. **Track Readiness (`Career Readiness`)**: Monitor your overall match score, verified skills vs. claimed skills, and readiness breakdown for hiring."
            )

        if "which skill" in q or "what skill" in q or "important skill" in q or "skills are important" in q:
            return (
                "### Top In-Demand Skills for Modern Roles\n\n"
                "Depending on your career trajectory, employers prioritize these critical skill pillars:\n\n"
                "• **Backend & Core Programming**: Python, Java, JavaScript/TypeScript, Go, or C# with solid understanding of OOP, data structures, and algorithms.\n"
                "• **Web & API Frameworks**: FastAPI, Django, Node.js/Express, Spring Boot, or React for full-stack integration.\n"
                "• **Database Management**: Relational databases (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis), including query optimization and indexing.\n"
                "• **Cloud & DevOps**: Docker containerization, Kubernetes orchestration, CI/CD pipelines, and cloud services (AWS, Azure, GCP).\n"
                "• **System Design & Security**: RESTful APIs, microservices, authentication (OAuth/JWT), caching, and scalability.\n"
                "• **Essential Soft Skills**: Structured problem-solving, clean code documentation, and clear technical communication."
            )

        if "score" in q or "improve" in q or "impact" in q:
            return (
                "### How to Improve Your Resume Score & Impact\n\n"
                "1. **Quantify Achievements**: Use concrete metrics (e.g., 'Increased pipeline efficiency by 35%').\n"
                "2. **Keyword Optimization**: Include core skills matching target job titles (e.g., React, Python, AWS, Docker).\n"
                "3. **Action Verbs**: Start bullets with strong impact verbs like *Architected*, *Spearheaded*, *Optimized*, or *Deployed*.\n"
                "4. **Tailored Summary**: Keep a 3-4 line professional summary highlighting your top stack and total experience.\n"
                "5. **Clean Formatting**: Use standard section headers (Experience, Skills, Projects, Education) for maximum ATS readability."
            )

        if "skill" in q or "gap" in q or "missing" in q:
            return (
                "### Skill Gap Analysis & Strategy\n\n"
                "• **Identify Target Role Requirements**: Review top skill matches on the Career Paths page.\n"
                "• **Prioritize Core Gaps**: Focus first on high-frequency required skills (e.g., Cloud Platforms, System Design).\n"
                "• **Take Assessments**: Use the Skill Assessments tab to validate your knowledge level.\n"
                "• **Project-Based Learning**: Build 1-2 open-source or portfolio projects featuring missing technologies."
            )

        if "interview" in q or "prep" in q or "question" in q:
            return (
                "### Technical Interview Preparation Strategy\n\n"
                "1. **Core Fundamentals**: Be ready to explain data structures, system design, and API design for your primary stack.\n"
                "2. **STAR Method**: Frame behavioral questions using **S**ituation, **T**ask, **A**ction, **R**esult.\n"
                "3. **Code Quality**: Practice writing clean, modular code with proper error handling and complexity analysis.\n"
                "4. **System Architecture**: Explain trade-offs in database selection, caching strategies, and scalability.\n"
                "5. **Mock Practice**: Take targeted skill quizzes in ResumeXpert to test your readiness."
            )

        if "plan" in q or "roadmap" in q or "90" in q or "30" in q:
            return (
                "### 30-60-90 Day Career Acceleration Plan\n\n"
                "• **Days 1–30 (Foundation)**: Master critical missing technical skills and complete beginner/intermediate assessments.\n"
                "• **Days 31–60 (Application)**: Build an end-to-end portfolio project incorporating modern tools and cloud deployment.\n"
                "• **Days 61–90 (Optimization & Outreach)**: Polish your resume score to 85%+, practice technical mock interviews, and apply to target roles."
            )

        if "upload" in q or "pdf" in q or "docx" in q or "file" in q:
            return (
                "### Resume Upload Assistance\n\n"
                "• **Supported Formats**: PDF, DOCX, or Plain Text (.txt).\n"
                "• **File Size Limit**: Up to 10 MB.\n"
                "• **Best Results**: Ensure text is selectable (avoid scanned image PDFs)."
            )

        return (
            "### ResumeXpert Career Assistant\n\n"
            "I can assist you with:\n"
            "• **Resume Score Optimization** – Action verbs, ATS keywords & formatting\n"
            "• **Skill Gap Analysis** – Identifying missing skills for target roles\n"
            "• **Interview Preparation** – Technical questions & STAR framework tips\n"
            "• **Career Roadmaps** – 30-60-90 day structured action plans\n"
            "• **System Navigation** – Guide on using ResumeXpert features\n\n"
            "Feel free to ask any question about your resume, careers, or the system!"
        )

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

    def generate_mcqs_batch(
        self,
        skills: list[str],
        difficulty: str,
        count: int = 10,
        career: str = "",
    ) -> list[dict[str, Any]]:
        """Fallback batch MCQ generation."""
        return []

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

    def chat(self, message: str, context: Optional[str] = None) -> str:
        """Provide support guidance without an external AI service."""
        return OpenAIProvider._fallback_chat(message)


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

    def generate_mcqs_batch(
        self,
        skills: list[str],
        difficulty: str,
        count: int = 10,
        career: str = "",
    ) -> list[dict[str, Any]]:
        """Generate multiple choice questions in a single batch."""
        return self.provider.generate_mcqs_batch(skills, difficulty, count, career)

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

    def chat(self, message: str, context: Optional[str] = None) -> str:
        """Answer a user help question."""
        return self.provider.chat(message, context)


# Global AI service instance
ai_service = AIService()
