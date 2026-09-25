"""CareerLens AI Resume System - Backend API."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.routers import analytics, assessment, career, chat, health, resume, skill

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------
# LIFESPAN (replaces deprecated on_event)
# ---------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize application on startup, clean up on shutdown."""
    logger.info("CareerLens Backend API starting up")
    logger.info(f"Frontend URL: {settings.FRONTEND_URL}")
    logger.info(f"AI Provider: {settings.AI_PROVIDER}")
    logger.info(f"Upload Directory: {settings.get_upload_dir()}")

    # Ensure database tables exist
    create_tables()

    yield

    logger.info("CareerLens Backend API shutting down")


# Create FastAPI application
app = FastAPI(
    title="CareerLens AI Resume System",
    description="Backend API for AI-powered career assessment and skill analysis",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------

# Read configured frontend URLs from environment/config.
configured_origins = [
    origin.strip().rstrip("/")
    for origin in settings.FRONTEND_URL.split(",")
    if origin.strip()
]

# Build the full allowed origins list.
allowed_origins = list(
    dict.fromkeys(
        [
            *configured_origins,
            "https://resume-xpert-zeta.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
        ]
    )
)

logger.info("Allowed CORS origins: %s", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
)

# ---------------------------------------------------------
# INCLUDE ROUTERS
# ---------------------------------------------------------

app.include_router(health.router)
app.include_router(resume.router)
app.include_router(career.router)
app.include_router(skill.router)
app.include_router(assessment.router)
app.include_router(analytics.router)
app.include_router(chat.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
    )