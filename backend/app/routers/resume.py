"""Resume upload and analysis routes."""
import logging
from pathlib import Path
from typing import Any

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from app.schemas import (
    ResumeUploadResponse,
    ResumeAnalysisResponse,
)
from app.services import ResumeService
from app.utils import get_error_response, get_success_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])
resume_service = ResumeService()


@router.post("/upload")
async def upload_resume(resume: UploadFile = File(...)) -> dict[str, Any]:
    """
    Upload a resume file.
    
    Accepts PDF or DOCX files up to MAX_UPLOAD_SIZE_MB.
    """
    try:
        result = await resume_service.upload_resume(resume, user_id="default_user")
        return result
    except HTTPException as error:
        detail = error.detail if isinstance(error.detail, dict) else {"code": "UPLOAD_ERROR", "message": str(error.detail)}
        raise HTTPException(
            status_code=getattr(error, "status_code", 400),
            detail=detail,
        ) from error
    except Exception as error:
        logger.error(f"Resume upload error: {error}")
        raise HTTPException(status_code=500, detail={"code": "UPLOAD_ERROR", "message": str(error)}) from error


@router.post("/{resume_id}/analyze")
async def analyze_resume(resume_id: str) -> dict[str, Any]:
    """
    Analyze an uploaded resume.
    
    Extracts text, skills, scores resume, and performs AI analysis.
    """
    try:
        result = resume_service.analyze_resume(resume_id)
        return result
    except HTTPException as error:
        return {
            "code": error.detail.get("code", "ANALYSIS_ERROR"),
            "message": error.detail.get("message", "Analysis failed")
        }
    except Exception as error:
        logger.error(f"Resume analysis error: {error}")
        return {"code": "ANALYSIS_ERROR", "message": str(error)}


@router.get("/{resume_id}")
async def get_resume(resume_id: str) -> dict[str, Any]:
    """Get resume information."""
    try:
        result = resume_service.get_resume(resume_id)
        return result
    except HTTPException as error:
        return {
            "code": error.detail.get("code", "NOT_FOUND"),
            "message": error.detail.get("message", "Resume not found")
        }
    except Exception as error:
        logger.error(f"Get resume error: {error}")
        return {"code": "ERROR", "message": str(error)}


@router.get("/{resume_id}/file")
async def download_resume(resume_id: str) -> FileResponse:
    """Download the original resume file."""
    try:
        file_path = resume_service.get_resume_file(resume_id)
        return FileResponse(
            file_path,
            filename=f"resume.{Path(file_path).suffix}"
        )
    except HTTPException as error:
        raise error
    except Exception as error:
        logger.error(f"Download error: {error}")
        raise HTTPException(status_code=500, detail="Download failed")
