from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from .config import settings

BASE_DIR = Path(__file__).resolve().parents[1]
if not settings.DATABASE_URL:
    if settings.APP_ENV.lower() in {"production", "prod"}:
        raise RuntimeError("DATABASE_URL is required in production. Configure a PostgreSQL URL.")
    DATABASE_URL = f"sqlite:///{BASE_DIR / 'careerlens.db'}"
else:
    DATABASE_URL = settings.DATABASE_URL

if settings.APP_ENV.lower() in {"production", "prod"} and DATABASE_URL.startswith("sqlite"):
    raise RuntimeError("SQLite is not supported in production. Set DATABASE_URL to Supabase PostgreSQL.")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql+psycopg://" + DATABASE_URL.removeprefix("postgres://")
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = "postgresql+psycopg://" + DATABASE_URL.removeprefix("postgresql://")

# Resolve relative sqlite paths against the backend directory so the DB
# is always found regardless of the working directory used to start the server.
if DATABASE_URL.startswith("sqlite"):
    import re
    match = re.match(r"sqlite:///(.+)", DATABASE_URL)
    if match:
        db_path = Path(match.group(1))
        if not db_path.is_absolute():
            DATABASE_URL = f"sqlite:///{BASE_DIR / db_path}"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def create_tables() -> None:
    from . import models
    Base.metadata.create_all(bind=engine)


def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()