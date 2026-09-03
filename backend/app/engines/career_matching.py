"""Career matching and recommendation engine."""
import logging
from typing import Any

from app.ai import ai_service

logger = logging.getLogger(__name__)

# Career definitions
CAREERS_DB = [
    {
        "id": "backend-developer",
        "title": "Backend Developer",
        "description": "Build scalable server-side applications and APIs",
        "required_skills": [
            "Python", "JavaScript", "Java", "SQL", "REST APIs",
            "Database Design", "Git", "CI/CD", "Linux"
        ],
        "preferred_skills": [
            "Docker", "Kubernetes", "AWS", "PostgreSQL", "Node.js", "Django", "Spring Boot"
        ],
    },
    {
        "id": "frontend-developer",
        "title": "Frontend Developer",
        "description": "Create responsive and interactive user interfaces",
        "required_skills": [
            "JavaScript", "HTML/CSS", "React", "TypeScript", "Git",
            "REST APIs", "UI/UX Principles", "Responsive Design"
        ],
        "preferred_skills": [
            "Vue", "Angular", "Next.js", "Tailwind CSS", "Redux", "Testing"
        ],
    },
    {
        "id": "fullstack-developer",
        "title": "Full Stack Developer",
        "description": "Develop complete web applications from front to back",
        "required_skills": [
            "JavaScript", "React", "Node.js", "Python", "SQL", "REST APIs",
            "Git", "Database Design", "HTML/CSS"
        ],
        "preferred_skills": [
            "Docker", "AWS", "TypeScript", "Testing", "CI/CD", "MongoDB"
        ],
    },
    {
        "id": "data-scientist",
        "title": "Data Scientist",
        "description": "Extract insights from data and build ML models",
        "required_skills": [
            "Python", "Machine Learning", "Statistics", "SQL", "Data Analysis",
            "Pandas", "NumPy", "Scikit-learn"
        ],
        "preferred_skills": [
            "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision",
            "Tableau", "Big Data"
        ],
    },
    {
        "id": "ml-engineer",
        "title": "Machine Learning Engineer",
        "description": "Build and deploy machine learning systems",
        "required_skills": [
            "Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
            "Statistics", "SQL", "Git"
        ],
        "preferred_skills": [
            "NLP", "Computer Vision", "MLOps", "Docker", "Kubernetes", "AWS", "Scala"
        ],
    },
    {
        "id": "devops-engineer",
        "title": "DevOps Engineer",
        "description": "Manage infrastructure and deployment pipelines",
        "required_skills": [
            "Linux", "Docker", "Kubernetes", "Git", "CI/CD", "AWS", "Azure",
            "Shell Scripting", "Database Administration"
        ],
        "preferred_skills": [
            "Terraform", "Ansible", "Jenkins", "Monitoring", "Networking", "Python"
        ],
    },
]


class CareerMatchingEngine:
    """Engine for career matching and recommendations."""

    def __init__(self):
        """Initialize career matching engine."""
        self.careers = CAREERS_DB

    def recommend_careers(
        self,
        user_skills: list[str],
        top_n: int = 5
    ) -> list[dict[str, Any]]:
        """
        Recommend careers based on user skills.
        
        Args:
            user_skills: List of skills the user has
            top_n: Number of top recommendations to return
            
        Returns:
            List of recommended careers with scores
        """
        user_skills_set = {skill.lower() for skill in user_skills}
        recommendations = []
        
        for career in self.careers:
            # Calculate match score
            required_skills = {s.lower() for s in career["required_skills"]}
            preferred_skills = {s.lower() for s in career["preferred_skills"]}
            
            # Skills user has
            matched_required = user_skills_set & required_skills
            matched_preferred = user_skills_set & preferred_skills
            
            # Skills user is missing
            missing_required = required_skills - user_skills_set
            missing_preferred = preferred_skills - user_skills_set
            
            # Calculate score
            required_coverage = len(matched_required) / len(required_skills) if required_skills else 0
            preferred_coverage = len(matched_preferred) / len(preferred_skills) if preferred_skills else 0
            
            score = int((required_coverage * 0.7 + preferred_coverage * 0.3) * 100)
            
            # Determine status
            if required_coverage >= 0.6:
                status = "Strong Match"
            elif required_coverage >= 0.3:
                status = "Potential Match"
            else:
                status = "Consider Building Skills"
            
            # Get AI-powered reasoning
            reasoning = ai_service.generate_career_reasoning(
                career["title"],
                list(user_skills),
                list(missing_required)[:3]
            )
            
            recommendations.append({
                "id": career["id"],
                "title": career["title"],
                "description": career["description"],
                "score": score,
                "status": status,
                # camelCase for frontend CareerCard compatibility
                "matchedSkills": sorted([s.title() for s in matched_required.union(matched_preferred)]),
                "missingSkills": sorted([s.title() for s in missing_required]),
                # snake_case also kept for backward compat
                "matched_skills": sorted([s.title() for s in matched_required.union(matched_preferred)]),
                "missing_skills": sorted([s.title() for s in missing_required]),
                "reasoning": reasoning,
            })
        
        # Sort by score and return top N
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        return recommendations[:top_n]

    def get_career_details(self, career_id: str) -> dict[str, Any] | None:
        """Get detailed information about a specific career."""
        for career in self.careers:
            if career["id"] == career_id:
                return {
                    "id": career["id"],
                    "title": career["title"],
                    "description": career["description"],
                    "required_skills": career["required_skills"],
                    "preferred_skills": career["preferred_skills"],
                }
        return None

    def get_all_careers(self) -> list[dict[str, Any]]:
        """Get all available careers."""
        return [
            {
                "id": career["id"],
                "title": career["title"],
                "description": career["description"],
            }
            for career in self.careers
        ]
