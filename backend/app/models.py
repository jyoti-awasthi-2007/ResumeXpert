from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str | None] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resumes: Mapped[list["Resume"]] = relationship(back_populates="user")


class Resume(Base):
    __tablename__ = "resume_records"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), index=True)
    filename: Mapped[str] = mapped_column(String(255))
    file_type: Mapped[str] = mapped_column(String(100))
    storage_path: Mapped[str] = mapped_column(String(500))
    extracted_text: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user: Mapped[User | None] = relationship(back_populates="resumes")
    analysis: Mapped["ResumeAnalysis | None"] = relationship(back_populates="resume", uselist=False)


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    resume_id: Mapped[str] = mapped_column(ForeignKey("resume_records.id"), unique=True)
    resume_score: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(30), default="complete")
    strengths_json: Mapped[str] = mapped_column(Text, default="[]")
    weaknesses_json: Mapped[str] = mapped_column(Text, default="[]")
    resume: Mapped[Resume] = relationship(back_populates="analysis")


class Skill(Base):
    __tablename__ = "skills"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(80), default="Technical")


class UserSkill(Base):
    __tablename__ = "user_skills"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"), index=True)
    evidence: Mapped[str] = mapped_column(Text, default="")
    confidence: Mapped[float] = mapped_column(Float, default=0)
    __table_args__ = (UniqueConstraint("user_id", "skill_id"),)


class Career(Base):
    __tablename__ = "careers"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(150), unique=True)
    description: Mapped[str] = mapped_column(Text)


class CareerSkill(Base):
    __tablename__ = "career_skills"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    career_id: Mapped[str] = mapped_column(ForeignKey("careers.id"), index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"), index=True)
    weight: Mapped[float] = mapped_column(Float, default=1)
    priority: Mapped[str] = mapped_column(String(10), default="MEDIUM")


class SkillGap(Base):
    __tablename__ = "skill_gaps"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    career_id: Mapped[str] = mapped_column(ForeignKey("careers.id"), index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"), index=True)
    priority: Mapped[str] = mapped_column(String(10))


class Assessment(Base):
    __tablename__ = "assessment_records"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    career_id: Mapped[str] = mapped_column(ForeignKey("careers.id"))
    difficulty: Mapped[str] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Question(Base):
    __tablename__ = "questions"
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    career_id: Mapped[str] = mapped_column(ForeignKey("careers.id"), index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"), index=True)
    difficulty: Mapped[str] = mapped_column(String(20))
    prompt: Mapped[str] = mapped_column(Text)
    options_json: Mapped[str] = mapped_column(Text)
    correct_answer: Mapped[int] = mapped_column(Integer)
    explanation: Mapped[str] = mapped_column(Text, default="")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    assessment_id: Mapped[str] = mapped_column(ForeignKey("assessment_records.id"), index=True)
    question_id: Mapped[str] = mapped_column(ForeignKey("questions.id"), index=True)


class AssessmentAnswer(Base):
    __tablename__ = "assessment_answers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    assessment_id: Mapped[str] = mapped_column(ForeignKey("assessment_records.id"), index=True)
    question_id: Mapped[str] = mapped_column(ForeignKey("questions.id"))
    answer: Mapped[int] = mapped_column(Integer)
    is_correct: Mapped[bool] = mapped_column(default=False)


class AssessmentResult(Base):
    __tablename__ = "assessment_results"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    assessment_id: Mapped[str] = mapped_column(ForeignKey("assessment_records.id"), unique=True)
    overall_score: Mapped[float] = mapped_column(Float, default=0)
    skill_scores_json: Mapped[str] = mapped_column(Text, default="{}")


class SkillConfidence(Base):
    __tablename__ = "skill_confidence"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    confidence_score: Mapped[float] = mapped_column(Float, default=0)


class CareerReadiness(Base):
    __tablename__ = "career_readiness"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    career_id: Mapped[str] = mapped_column(ForeignKey("careers.id"))
    readiness_score: Mapped[float] = mapped_column(Float, default=0)
    breakdown_json: Mapped[str] = mapped_column(Text, default="{}")