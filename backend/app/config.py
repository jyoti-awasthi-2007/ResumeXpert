"""Application configuration."""
import os
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # Application
    APP_NAME: str = "CareerLens AI API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    APP_ENV: str = os.getenv("APP_ENV", "development")

    # Database
    DATABASE_URL: str | None = os.getenv("DATABASE_URL")

    # File uploads
    UPLOAD_DIR: Path = Path(os.getenv(
        "UPLOAD_DIR",
        Path(__file__).resolve().parents[1] / "uploads"
    ))
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
    MAX_UPLOAD_BYTES: int = MAX_UPLOAD_SIZE_MB * 1024 * 1024

    # Frontend
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # AI Configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "openai")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "openai/gpt-oss-20b")
    AI_BASE_URL: str = os.getenv("AI_BASE_URL", "")
    AI_TIMEOUT: int = int(os.getenv("AI_TIMEOUT", "30"))
    AI_MAX_RETRIES: int = int(os.getenv("AI_MAX_RETRIES", "3"))

    # Allowed file types
    ALLOWED_RESUME_EXTENSIONS: tuple = (".pdf", ".docx", ".doc")
    ALLOWED_RESUME_MIMETYPES: tuple = (
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    )

    class Config:
        env_file = str(Path(__file__).resolve().parents[1] / ".env")
        case_sensitive = True
        extra = "ignore"


settings = Settings()
