from alembic import op
import sqlalchemy as sa

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("email", sa.String(length=255), unique=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "resumes",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("filename", sa.String(), nullable=False),
        sa.Column("file_type", sa.String(), nullable=False),
        sa.Column("path", sa.String(), nullable=False),
        sa.Column("text", sa.Text(), server_default=""),
        sa.Column("analysis", sa.Text(), server_default="{}"),
    )
    op.create_table(
        "selections",
        sa.Column("user_id", sa.String(), primary_key=True),
        sa.Column("career_id", sa.String(), nullable=False),
    )
    op.create_table(
        "assessments",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("career_id", sa.String(), nullable=False),
        sa.Column("difficulty", sa.String(), nullable=False),
        sa.Column("questions", sa.Text(), nullable=False),
        sa.Column("result", sa.Text(), server_default="{}"),
    )
    op.create_table(
        "careers",
        sa.Column("id", sa.String(length=80), primary_key=True),
        sa.Column("name", sa.String(length=150), unique=True),
        sa.Column("description", sa.Text(), nullable=False),
    )
    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), unique=True),
        sa.Column("category", sa.String(length=80), nullable=False, server_default="Technical"),
    )
    op.create_index("ix_skills_name", "skills", ["name"], unique=True)
    op.create_table(
        "resume_records",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("user_id", sa.String(length=64), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("file_type", sa.String(length=100), nullable=False),
        sa.Column("storage_path", sa.String(length=500), nullable=False),
        sa.Column("extracted_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_resume_records_user_id", "resume_records", ["user_id"])
    op.create_table(
        "resume_analyses",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("resume_id", sa.String(length=64), sa.ForeignKey("resume_records.id"), unique=True),
        sa.Column("resume_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="complete"),
        sa.Column("strengths_json", sa.Text(), nullable=False, server_default="[]"),
        sa.Column("weaknesses_json", sa.Text(), nullable=False, server_default="[]"),
    )
    op.create_table(
        "user_skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id"), nullable=False),
        sa.Column("evidence", sa.Text(), nullable=False, server_default=""),
        sa.Column("confidence", sa.Float(), nullable=False, server_default="0"),
        sa.UniqueConstraint("user_id", "skill_id"),
    )
    op.create_index("ix_user_skills_user_id", "user_skills", ["user_id"])
    op.create_index("ix_user_skills_skill_id", "user_skills", ["skill_id"])
    op.create_table(
        "career_skills",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("career_id", sa.String(length=80), sa.ForeignKey("careers.id"), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id"), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False, server_default="1"),
        sa.Column("priority", sa.String(length=10), nullable=False, server_default="MEDIUM"),
    )
    op.create_index("ix_career_skills_career_id", "career_skills", ["career_id"])
    op.create_index("ix_career_skills_skill_id", "career_skills", ["skill_id"])
    op.create_table(
        "skill_gaps",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("career_id", sa.String(length=80), sa.ForeignKey("careers.id"), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id"), nullable=False),
        sa.Column("priority", sa.String(length=10), nullable=False),
    )
    op.create_index("ix_skill_gaps_user_id", "skill_gaps", ["user_id"])
    op.create_index("ix_skill_gaps_career_id", "skill_gaps", ["career_id"])
    op.create_index("ix_skill_gaps_skill_id", "skill_gaps", ["skill_id"])
    op.create_table(
        "assessment_records",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("career_id", sa.String(length=80), sa.ForeignKey("careers.id"), nullable=False),
        sa.Column("difficulty", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_assessment_records_user_id", "assessment_records", ["user_id"])
    op.create_table(
        "questions",
        sa.Column("id", sa.String(length=80), primary_key=True),
        sa.Column("career_id", sa.String(length=80), sa.ForeignKey("careers.id"), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id"), nullable=False),
        sa.Column("difficulty", sa.String(length=20), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("options_json", sa.Text(), nullable=False),
        sa.Column("correct_answer", sa.Integer(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False, server_default=""),
    )
    op.create_index("ix_questions_career_id", "questions", ["career_id"])
    op.create_index("ix_questions_skill_id", "questions", ["skill_id"])
    op.create_table(
        "assessment_questions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("assessment_id", sa.String(length=64), sa.ForeignKey("assessment_records.id"), nullable=False),
        sa.Column("question_id", sa.String(length=80), sa.ForeignKey("questions.id"), nullable=False),
    )
    op.create_index("ix_assessment_questions_assessment_id", "assessment_questions", ["assessment_id"])
    op.create_index("ix_assessment_questions_question_id", "assessment_questions", ["question_id"])
    op.create_table(
        "assessment_answers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("assessment_id", sa.String(length=64), sa.ForeignKey("assessment_records.id"), nullable=False),
        sa.Column("question_id", sa.String(length=80), sa.ForeignKey("questions.id"), nullable=False),
        sa.Column("answer", sa.Integer(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_table(
        "assessment_results",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("assessment_id", sa.String(length=64), sa.ForeignKey("assessment_records.id"), unique=True),
        sa.Column("overall_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("skill_scores_json", sa.Text(), nullable=False, server_default="{}"),
    )
    op.create_table(
        "skill_confidence",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("skill_id", sa.Integer(), sa.ForeignKey("skills.id"), nullable=False),
        sa.Column("confidence_score", sa.Float(), nullable=False, server_default="0"),
    )
    op.create_index("ix_skill_confidence_user_id", "skill_confidence", ["user_id"])
    op.create_table(
        "career_readiness",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=64), nullable=False),
        sa.Column("career_id", sa.String(length=80), sa.ForeignKey("careers.id"), nullable=False),
        sa.Column("readiness_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("breakdown_json", sa.Text(), nullable=False, server_default="{}"),
    )
    op.create_index("ix_career_readiness_user_id", "career_readiness", ["user_id"])


def downgrade():
    from app.database import Base
    import app.models
    Base.metadata.drop_all(bind=op.get_bind())
    op.drop_table("career_readiness")
    op.drop_table("skill_confidence")
    op.drop_table("assessment_results")
    op.drop_table("assessment_answers")
    op.drop_index("ix_assessment_questions_question_id", table_name="assessment_questions")
    op.drop_index("ix_assessment_questions_assessment_id", table_name="assessment_questions")
    op.drop_table("assessment_questions")
    op.drop_index("ix_questions_skill_id", table_name="questions")
    op.drop_index("ix_questions_career_id", table_name="questions")
    op.drop_table("questions")
    op.drop_index("ix_assessment_records_user_id", table_name="assessment_records")
    op.drop_table("assessment_records")
    op.drop_index("ix_skill_gaps_skill_id", table_name="skill_gaps")
    op.drop_index("ix_skill_gaps_career_id", table_name="skill_gaps")
    op.drop_index("ix_skill_gaps_user_id", table_name="skill_gaps")
    op.drop_table("skill_gaps")
    op.drop_index("ix_career_skills_skill_id", table_name="career_skills")
    op.drop_index("ix_career_skills_career_id", table_name="career_skills")
    op.drop_table("career_skills")
    op.drop_index("ix_user_skills_skill_id", table_name="user_skills")
    op.drop_index("ix_user_skills_user_id", table_name="user_skills")
    op.drop_table("user_skills")
    op.drop_table("resume_analyses")
    op.drop_index("ix_resume_records_user_id", table_name="resume_records")
    op.drop_table("resume_records")
    op.drop_index("ix_skills_name", table_name="skills")
    op.drop_table("skills")
    op.drop_table("careers")
    op.drop_table("assessments")
    op.drop_table("selections")
    op.drop_table("resumes")
    op.drop_table("users")