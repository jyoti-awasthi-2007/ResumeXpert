"""Assessment engine for quiz generation and scoring."""
import logging
import random
from difflib import SequenceMatcher
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
        num_questions: int = 5,
        career: str = ""
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
        
        # Generate career-specific questions with the configured Groq provider first.
        available_questions = self._generate_with_ai(skills, difficulty, num_questions, career)

        # Keep the assessment usable when the provider is unavailable or returns too few questions.
        if len(available_questions) < num_questions:
            bank_questions = self._get_questions_from_bank(
                skills, difficulty, num_questions - len(available_questions),
                {item.get("question", "") for item in available_questions}
            )
            available_questions.extend(bank_questions)

        # A provider can return fewer unique questions than requested. Build
        # deterministic, difficulty-specific fallbacks for the remaining slots.
        if len(available_questions) < num_questions:
            available_questions.extend(self._fallback_questions(
                skills, difficulty, num_questions - len(available_questions),
                {item.get("question", "") for item in available_questions},
            ))
        
        # Format questions
        for i, q in enumerate(available_questions[:num_questions]):
            questions.append({
                "id": f"q_{i}",
                "question": q["question"],
                "options": q["options"],
                "skill": q.get("skill") or self._get_question_skill(q),
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
        
        answer_map = {question_id: answer for question_id, answer in answers}
        for question in questions:
            user_answer = answer_map.get(question["id"], -1)
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
        num_questions: int,
        blocked_questions: set[str] | None = None,
    ) -> list[dict[str, Any]]:
        """Get questions from pre-built question bank."""
        questions = []
        blocked = {question.strip().lower() for question in (blocked_questions or set())}
        
        for skill in skills:
            skill_normalized = skill.title()
            if skill_normalized in QUESTION_BANK:
                bank_by_difficulty = QUESTION_BANK[skill_normalized]
                if difficulty in bank_by_difficulty:
                    bank_questions = bank_by_difficulty[difficulty]
                    candidates = [item for item in bank_questions if item["question"].strip().lower() not in blocked]
                    random.shuffle(candidates)
                    for item in candidates[:num_questions - len(questions)]:
                        questions.append({**item, "skill": skill})
                        blocked.add(item["question"].strip().lower())
                    if len(questions) >= num_questions:
                        break
        
        return questions

    @staticmethod
    def _generate_with_ai(
        skills: list[str],
        difficulty: str,
        num_questions: int,
        career: str = "",
    ) -> list[dict[str, Any]]:
        """Generate questions using AI in a single fast batch request."""
        try:
            ai_questions = ai_service.generate_mcqs_batch(
                skills=skills,
                difficulty=difficulty,
                count=num_questions,
                career=career,
            )
            valid = []
            blocked = set()
            for q in ai_questions:
                q_text = q.get("question", "").strip().lower()
                if not q_text:
                    continue
                is_duplicate = any(
                    SequenceMatcher(None, q_text, existing).ratio() >= 0.84
                    for existing in blocked
                )
                if not is_duplicate:
                    valid.append(q)
                    blocked.add(q_text)
                if len(valid) >= num_questions:
                    break
            return valid
        except Exception as e:
            logger.warning(f"Error generating AI questions in batch: {e}")
            return []

    @staticmethod
    def _fallback_questions(skills: list[str], difficulty: str, count: int, blocked_questions: set[str]) -> list[dict[str, Any]]:
        templates = {
            "BEGINNER": [
                ("Which statement best describes {skill}?", ["A foundational technology used for practical development", "A file format only", "A database table only", "A hardware component"], 0),
                ("Which is a sensible first step when learning {skill}?", ["Learn its core concepts and syntax", "Skip documentation entirely", "Optimize before understanding it", "Avoid small practice exercises"], 0),
                ("What is the best way to build a foundation in {skill}?", ["Combine documentation with small practical exercises", "Memorize unrelated syntax", "Avoid feedback", "Start with production-scale optimization"], 0),
                ("A beginner using {skill} should primarily focus on:", ["Correct concepts and readable solutions", "Premature micro-optimization", "Ignoring errors", "Removing tests"], 0),
            ],
            "ADVANCED": [
                ("Which approach is most appropriate when applying {skill} in a real project?", ["Choose the technique that fits the constraints and test it", "Use the most complex option by default", "Ignore failure cases", "Avoid measuring the result"], 0),
                ("When debugging a {skill} implementation, what should you do first?", ["Reproduce and isolate the failing case", "Rewrite everything immediately", "Remove all validation", "Assume the input is always valid"], 0),
                ("How should an engineer improve a {skill} solution that is correct but slow?", ["Profile it, identify the bottleneck, then compare targeted alternatives", "Change code randomly", "Remove all input checks", "Add complexity without measurement"], 0),
                ("A robust {skill} implementation should be evaluated using:", ["Realistic cases, edge cases, and observable behavior", "Only the happy path", "Only source-code length", "No repeatable tests"], 0),
            ],
            "EXPERT": [
                ("Which decision shows expert {skill} practice in production?", ["Evaluate trade-offs, failure modes, and operational cost", "Optimize one metric while ignoring reliability", "Hide edge cases from monitoring", "Choose architecture without constraints"], 0),
                ("For a high-scale {skill} system, what should guide optimization?", ["Measured bottlenecks and explicit reliability requirements", "Assumptions without profiling", "Only code brevity", "Removing observability"], 0),
                ("When designing a critical {skill} system, which trade-off must be explicit?", ["Consistency, latency, scalability, and failure recovery", "Color choices only", "Variable naming only", "Avoiding operational metrics"], 0),
                ("What distinguishes expert reasoning about {skill} edge cases?", ["It anticipates invalid states and defines safe, observable behavior", "It assumes ideal inputs", "It removes safeguards", "It avoids testing failure modes"], 0),
            ],
        }
        result = []
        blocked = {question.strip().lower() for question in blocked_questions}
        for skill in skills:
            for template, options, correct in templates.get(difficulty, templates["BEGINNER"]):
                question = template.format(skill=skill)
                if question.lower() in blocked:
                    continue
                result.append({"question": question, "options": options, "correct": correct, "skill": skill})
                blocked.add(question.lower())
                if len(result) >= count:
                    return result
        for index in range(count - len(result)):
            skill = skills[index % len(skills)] if skills else "your target skill"
            question = f"Which practice most improves reliable {skill} work in scenario {index + 1}?"
            result.append({
                "question": question,
                "options": ["Use a small reproducible example and verify the outcome", "Skip verification", "Ignore input behavior", "Avoid documentation"],
                "correct": 0,
                "skill": skill,
            })
        return result

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
