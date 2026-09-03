"""Assessment engine for quiz generation and scoring."""
import logging
import random
from typing import Any

from app.ai import ai_service

logger = logging.getLogger(__name__)

# Question bank organized by skill and difficulty
QUESTION_BANK = {
    "Python": {
        "BEGINNER": [
            {
                "question": "What does Python prioritize?",
                "options": ["Speed", "Readability and simplicity", "Memory usage", "Compilation"],
                "correct": 1,
            },
            {
                "question": "Which data structure is mutable in Python?",
                "options": ["Tuple", "String", "List", "Integer"],
                "correct": 2,
            },
        ],
        "ADVANCED": [
            {
                "question": "What is a decorator in Python?",
                "options": [
                    "A type of string formatting",
                    "A function that modifies another function without permanently changing it",
                    "A way to format code",
                    "A loop structure",
                ],
                "correct": 1,
            },
        ],
    },
    "JavaScript": {
        "BEGINNER": [
            {
                "question": "What is the purpose of 'const' in JavaScript?",
                "options": [
                    "To declare a function",
                    "To declare a constant variable",
                    "To declare a class",
                    "To create a loop",
                ],
                "correct": 1,
            },
        ],
    },
    "React": {
        "BEGINNER": [
            {
                "question": "What is a React component?",
                "options": [
                    "A database table",
                    "A reusable piece of UI",
                    "A CSS framework",
                    "A server",
                ],
                "correct": 1,
            },
        ],
    },
    "SQL": {
        "BEGINNER": [
            {
                "question": "What does SQL stand for?",
                "options": [
                    "Structured Query Language",
                    "Server Query Language",
                    "Simple Query Language",
                    "System Query Language",
                ],
                "correct": 0,
            },
        ],
    },
}


class AssessmentEngine:
    """Engine for generating and scoring assessments."""

    def generate_assessment(
        self,
        skills: list[str],
        difficulty: str,
        num_questions: int = 5
    ) -> list[dict[str, Any]]:
        """
        Generate assessment questions for given skills.
        
        Args:
            skills: List of skills to assess
            difficulty: BEGINNER, ADVANCED, or EXPERT
            num_questions: Number of questions to generate
            
        Returns:
            List of assessment questions
        """
        questions = []
        
        # Get questions from question bank
        available_questions = self._get_questions_from_bank(
            skills, difficulty, num_questions
        )
        
        # If not enough from bank, generate with AI
        if len(available_questions) < num_questions:
            ai_questions = self._generate_with_ai(
                skills, difficulty, num_questions - len(available_questions)
            )
            available_questions.extend(ai_questions)
        
        # Format questions
        for i, q in enumerate(available_questions[:num_questions]):
            questions.append({
                "id": f"q_{i}",
                "question": q["question"],
                "options": q["options"],
                "skill": self._get_question_skill(q),
                "difficulty": difficulty,
                "correct_answer": q["correct"],  # Server-side only
            })
        
        return questions

    def score_assessment(
        self,
        questions: list[dict[str, Any]],
        answers: list[tuple[str, int]]
    ) -> dict[str, Any]:
        """
        Score submitted assessment.
        
        Args:
            questions: Original questions with correct answers
            answers: List of (question_id, user_answer) tuples
            
        Returns:
            Scoring results
        """
        results_by_skill = {}
        total_correct = 0
        total_questions = len(questions)
        
        for i, question in enumerate(questions):
            user_answer = answers[i][1] if i < len(answers) else -1
            correct_answer = question["correct_answer"]
            skill = question.get("skill", "General")
            
            is_correct = user_answer == correct_answer
            
            if is_correct:
                total_correct += 1
            
            if skill not in results_by_skill:
                results_by_skill[skill] = {"correct": 0, "total": 0}
            
            results_by_skill[skill]["total"] += 1
            if is_correct:
                results_by_skill[skill]["correct"] += 1
        
        # Calculate skill scores
        skill_scores = [
            {
                "skill": skill,
                "score": int((data["correct"] / data["total"] * 100))
                if data["total"] > 0 else 0,
            }
            for skill, data in results_by_skill.items()
        ]
        
        overall_score = int(
            (total_correct / total_questions * 100) if total_questions > 0 else 0
        )
        
        return {
            "score": overall_score,
            "status": "complete",
            "correct": total_correct,
            "incorrect": total_questions - total_correct,
            "total": total_questions,
            "skill_scores": skill_scores,
        }

    @staticmethod
    def _get_questions_from_bank(
        skills: list[str],
        difficulty: str,
        num_questions: int
    ) -> list[dict[str, Any]]:
        """Get questions from pre-built question bank."""
        questions = []
        
        for skill in skills:
            skill_normalized = skill.title()
            if skill_normalized in QUESTION_BANK:
                bank_by_difficulty = QUESTION_BANK[skill_normalized]
                if difficulty in bank_by_difficulty:
                    bank_questions = bank_by_difficulty[difficulty]
                    selected = random.sample(
                        bank_questions,
                        min(len(bank_questions), num_questions)
                    )
                    questions.extend(selected)
        
        return questions

    @staticmethod
    def _generate_with_ai(
        skills: list[str],
        difficulty: str,
        num_questions: int
    ) -> list[dict[str, Any]]:
        """Generate questions using AI."""
        questions = []
        
        for skill in skills[:3]:  # Limit to first 3 skills
            for _ in range(min(2, num_questions - len(questions))):
                try:
                    ai_question = ai_service.generate_mcq(skill, difficulty)
                    questions.append(ai_question)
                except Exception as e:
                    logger.warning(f"Error generating AI question: {e}")
        
        return questions

    @staticmethod
    def _get_question_skill(question: dict[str, Any]) -> str:
        """Extract skill name from question."""
        # Try to determine skill from question text
        question_text = question.get("question", "").lower()
        
        skill_keywords = {
            "python": ["python", "lambda", "decorator"],
            "javascript": ["javascript", "javascript", "const", "let"],
            "react": ["react", "component", "jsx", "hook"],
            "sql": ["sql", "query", "database", "table"],
        }
        
        for skill, keywords in skill_keywords.items():
            for keyword in keywords:
                if keyword in question_text:
                    return skill.title()
        
        return "General"
