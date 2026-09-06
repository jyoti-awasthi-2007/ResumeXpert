from alembic import context
from sqlalchemy import create_engine
from app.config import settings
from app.database import Base
import app.models

config = context.config
database_url = settings.DATABASE_URL
if not database_url:
    if settings.APP_ENV.lower() in {"production", "prod"}:
        raise RuntimeError("DATABASE_URL is required to run Alembic in production.")
    from app.database import DATABASE_URL
    database_url = DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = "postgresql+psycopg://" + database_url.removeprefix("postgres://")
elif database_url.startswith("postgresql://"):
    database_url = "postgresql+psycopg://" + database_url.removeprefix("postgresql://")
if settings.APP_ENV.lower() in {"production", "prod"} and database_url.startswith("sqlite"):
    raise RuntimeError("SQLite is not supported for production migrations. Set DATABASE_URL to Supabase PostgreSQL.")

target_metadata = Base.metadata


def run_migrations_online():
    engine = create_engine(database_url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()