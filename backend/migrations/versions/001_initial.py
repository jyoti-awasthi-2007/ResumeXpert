from alembic import op

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    from app.database import Base
    import app.models
    Base.metadata.create_all(bind=op.get_bind())
    op.execute("CREATE TABLE IF NOT EXISTS resumes (id TEXT PRIMARY KEY, filename TEXT NOT NULL, file_type TEXT NOT NULL, path TEXT NOT NULL, text TEXT DEFAULT '', analysis TEXT DEFAULT '{}')")
    op.execute("CREATE TABLE IF NOT EXISTS selections (user_id TEXT PRIMARY KEY, career_id TEXT NOT NULL)")
    op.execute("CREATE TABLE IF NOT EXISTS assessments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, career_id TEXT NOT NULL, difficulty TEXT NOT NULL, questions TEXT NOT NULL, result TEXT DEFAULT '{}')")


def downgrade():
    from app.database import Base
    import app.models
    Base.metadata.drop_all(bind=op.get_bind())
    op.execute("DROP TABLE IF EXISTS assessments")
    op.execute("DROP TABLE IF EXISTS selections")
    op.execute("DROP TABLE IF EXISTS resumes")