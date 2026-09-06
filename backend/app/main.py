"""CareerLens AI Resume System - Backend API."""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import analytics, assessment, career, chat, health, resume, skill

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="CareerLens AI Resume System",
    description="Backend API for AI-powered career assessment and skill analysis",
    version="1.0.0",
)

# ---------------------------------------------------------
# CORS CONFIGURATION
# ---------------------------------------------------------

# Read configured frontend URLs from environment/config.
# Remove whitespace and trailing "/" so browser Origin values
# match correctly.
configured_origins = [
    origin.strip().rstrip("/")
    for origin in settings.FRONTEND_URL.split(",")
    if origin.strip()
]

# Explicitly allow the current production frontend and local development.
# Use dict.fromkeys() to remove duplicates while preserving order.
allowed_origins = list(
    dict.fromkeys(
        [
            *configured_origins,
            "https://resume-xpert-zeta.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )
)

logger.info("Allowed CORS origins: %s", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("CareerLens Backend API starting up")
    logger.info(f"Frontend URL: {settings.FRONTEND_URL}")
    logger.info(f"AI Provider: {settings.AI_PROVIDER}")
    logger.info(f"Upload Directory: {settings.UPLOAD_DIR}")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown."""
    logger.info("CareerLens Backend API shutting down")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
    )