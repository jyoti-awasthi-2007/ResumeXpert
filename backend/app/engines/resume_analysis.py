"""Resume analysis engine."""
import logging
import re
from typing import Any

from app.ai import ai_service
from app.utils import (
    calculate_overall_resume_score,
    calculate_resume_score_breakdown,
    clean_text,
    detect_sections,
    extract_skills_from_text,
)

logger = logging.getLogger(__name__)


class ResumeAnalysisEngine:
    """Engine for analyzing resume content."""

    def analyze(self, resume_text: str) -> dict[str, Any]:
        """
        Analyze resume and return comprehensive results.
        
        Args:
            resume_text: Raw resume text extracted from document
            
        Returns:
            Analysis results including score, skills, sections, etc.
        """
        # Clean text
        text_clean = clean_text(resume_text)

        # Extract skills
        skills_raw = extract_skills_from_text(text_clean)
        skills = [
            {
                "name": name,
                "category": category,
                "confidence": 85,
            }
            for name, category in skills_raw
        ]

        # Detect sections
        sections = detect_sections(text_clean)

        # Calculate scores
        score_breakdown = calculate_resume_score_breakdown(
            text_clean,
            len(skills),
            sections,
        )
        overall_score = calculate_overall_resume_score(score_breakdown)

        # Generate AI-powered analysis
        ai_analysis = ai_service.analyze_resume_summary(
            text_clean[:3000],
            [skill["name"] for skill in skills],
        )

        summary = {
            "ATS": min(100, max(0, int(score_breakdown.get("keywords", 0) * 0.9 + 50))),
            "Skills": min(100, max(0, score_breakdown.get("skills", 0))),
            "Projects": min(100, max(0, score_breakdown.get("projects", 0))),
            "Education": min(100, max(0, score_breakdown.get("education", 0))),
            "Experience": min(100, max(0, score_breakdown.get("experience", 0))),
            "Keywords": min(100, max(0, score_breakdown.get("keywords", 0))),
        }

        personal = self._extract_personal_info(text_clean)
        education = self._extract_education(sections)
        experience = self._extract_experience(sections)
        projects = self._extract_projects(sections)
        strengths = ai_analysis.get("strengths", []) or [
            "Resume structure is clear and well organized",
            "Core technical skills are listed",
        ]
        weaknesses = ai_analysis.get("weaknesses", []) or [
            "Quantify achievements with measurable metrics (e.g., percentages, project scope)",
            "Include specific project examples and technical responsibilities",
            "Add cloud or modern framework experience to broaden skill coverage",
        ]
        impressions = ai_analysis.get("recommendations", []) or [
            "Add measurable outcomes to achievements",
            "Include specific technologies and results",
        ]

        return {
            "score": overall_score,
            "resume_score": overall_score,
            "score_breakdown": {
                "skills": score_breakdown.get("skills", 0),
                "experience": score_breakdown.get("experience", 0),
                "education": score_breakdown.get("education", 0),
                "projects": score_breakdown.get("projects", 0),
                "keywords": score_breakdown.get("keywords", 0),
            },
            "status": "complete",
            "summary": summary,
            "personal": personal,
            "education": education,
            "experience": experience,
            "projects": projects,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "improvements": ai_analysis.get("improvements", []) or weaknesses,
            "recommendations": impressions,
            "skills": skills,
            "sections": {
                "education": sections.get("education", [])[:5],
                "experience": sections.get("experience", [])[:5],
                "projects": sections.get("projects", [])[:5],
                "certifications": sections.get("certifications", [])[:3],
                "achievements": sections.get("achievements", [])[:3],
            },
            "missing_information": self._detect_missing_information(sections),
        }

    @staticmethod
    def _extract_personal_info(text: str) -> dict[str, str]:
        """Extract basic personal info from the resume text."""
        email_match = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
        phone_match = re.search(r"(?:\+?\d[\d\s().-]{7,}\d)", text)
        name_match = re.search(
            r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b",
            text,
        )

        return {
            "name": name_match.group(1) if name_match else "Resume Candidate",
            "email": email_match.group(0) if email_match else "not provided",
            "phone": phone_match.group(0).strip() if phone_match else "not provided",
            "location": "Not provided",
        }

    @staticmethod
    def _extract_education(sections: dict[str, list[str]]) -> dict[str, str]:
        """Build a frontend-friendly education object."""
        education_items = sections.get("education", [])
        first = education_items[0] if education_items else ""
        return {
            "degree": first or "Bachelor's Degree",
            "college": "University / Institution",
            "branch": "Computer Science / Related Field",
            "cgpa": "N/A",
            "year": "N/A",
        }

    @staticmethod
    def _extract_experience(sections: dict[str, list[str]]) -> list[dict[str, str]]:
        """Build a frontend-friendly experience list."""
        experiences = []
        for item in sections.get("experience", [])[:5]:
            experience_text = item.strip()
            role_part = experience_text.split(" - ")[0].split(" at ")[0].strip()
            company_part = "Company"
            if " - " in experience_text:
                company_part = experience_text.split(" - ", 1)[1].strip()
            elif " at " in experience_text.lower():
                company_part = experience_text.split(" at ", 1)[1].strip()

            experiences.append({
                "company": company_part[:60] or "Company",
                "role": role_part[:80] or "Professional Experience",
                "duration": "Recent role",
            })

        return experiences if experiences else []

    @staticmethod
    def _extract_projects(sections: dict[str, list[str]]) -> list[dict[str, Any]]:
        """Build a frontend-friendly project list."""
        projects = []
        for item in sections.get("projects", [])[:5]:
            projects.append({
                "name": "Project",
                "description": item[:200],
                "technologies": [
                    part.strip() for part in re.split(r"[,;]", item) if part.strip() and len(part.strip()) < 25
                ][:5],
            })

        return projects if projects else []

    @staticmethod
    def _detect_missing_information(sections: dict[str, list[str]]) -> list[str]:
        """Detect missing information in resume."""
        missing = []
        
        if not sections.get("education"):
            missing.append("Education section is missing")
        
        if not sections.get("experience"):
            missing.append("Work experience section is missing")
        
        if not sections.get("projects"):
            missing.append("Projects section could make resume stronger")
        
        if not sections.get("certifications"):
            missing.append("No certifications or training mentioned")
        
        return missing
