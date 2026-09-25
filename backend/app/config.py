"""Application configuration."""
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # Application
    APP_NAME: str = "CareerLens AI API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    APP_ENV: str = "development"

    # Database
    DATABASE_URL: str | None = None

    # File uploads
    # On Render/production, UPLOAD_DIR env var is an absolute path like /tmp/resumexpert-uploads.
    # On local dev, it is relative (./uploads or uploads) and resolves to backend/uploads.
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # Frontend
    FRONTEND_URL: str = "http://localhost:5173"

    # AI Configuration
    AI_PROVIDER: str = "openai"
    AI_API_KEY: str = ""
    AI_MODEL: str = "openai/gpt-oss-20b"
    AI_BASE_URL: str = ""
    AI_TIMEOUT: int = 30
    AI_MAX_RETRIES: int = 3

    # Allowed file types
    ALLOWED_RESUME_EXTENSIONS: tuple = (".pdf", ".docx", ".doc")
    ALLOWED_RESUME_MIMETYPES: tuple = (
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    )

    @property
    def MAX_UPLOAD_BYTES(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    def get_upload_dir(self) -> Path:
        """Return the resolved upload directory as a Path object."""
        raw = self.UPLOAD_DIR.replace("./", "")
        path = Path(raw)
        if path.is_absolute():
            return path.resolve()
        return (Path(__file__).resolve().parents[1] / raw).resolve()

    class Config:
        env_file = str(Path(__file__).resolve().parents[1] / ".env")
        case_sensitive = True
        extra = "ignore"


settings = Settings()
