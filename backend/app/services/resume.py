"""Resume service for handling resume operations."""
import json
import logging
import secrets
from pathlib import Path
from typing import Any

from fastapi import HTTPException, UploadFile

from app.config import settings
from app.engines import ResumeAnalysisEngine
from app.utils import parse_document, validate_file_extension, validate_file_size

logger = logging.getLogger(__name__)


class ResumeService:
    """Service for handling resume operations."""

    _instance: "ResumeService | None" = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize resume service."""
        if hasattr(self, "_initialized") and self._initialized:
            return

        self.upload_dir = settings.get_upload_dir()
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.analysis_engine = ResumeAnalysisEngine()
        self.store_path = self.upload_dir / "resumes.json"
        try:
            self.resume_store = json.loads(self.store_path.read_text(encoding="utf-8")) if self.store_path.exists() else {}
        except (OSError, json.JSONDecodeError):
            self.resume_store = {}
        self._initialized = True

    def _save_store(self) -> None:
        """Persist resumes to file store."""
        try:
            self.store_path.write_text(json.dumps(self.resume_store), encoding="utf-8")
        except Exception as e:
            logger.warning(f"Could not persist resume store: {e}")

    async def upload_resume(
        self,
        file: UploadFile,
        user_id: str | None = None
    ) -> dict[str, Any]:
        """
        Upload a resume file.
        
        Args:
            file: Uploaded file
            user_id: Optional user ID
            
        Returns:
            Upload result
        """
        # Validate filename and extension
        filename = file.filename or "resume"
        file_path = Path(filename)
        
        if not validate_file_extension(file_path, settings.ALLOWED_RESUME_EXTENSIONS):
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "INVALID_RESUME_TYPE",
                    "message": "Only PDF and DOCX files are supported"
                }
            )
        
        # Read file content
        content = await file.read()
        
        # Validate file size
        if not validate_file_size(len(content), settings.MAX_UPLOAD_BYTES):
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "INVALID_RESUME_SIZE",
                    "message": f"File size must be less than {settings.MAX_UPLOAD_SIZE_MB} MB"
                }
            )
        
        # Generate unique resume ID
        resume_id = secrets.token_urlsafe(12)
        
        # Save file
        file_ext = file_path.suffix
        saved_path = self.upload_dir / f"{resume_id}{file_ext}"
        
        try:
            saved_path.write_bytes(content)
        except IOError as error:
            raise HTTPException(
                status_code=500,
                detail={
                    "code": "UPLOAD_FAILED",
                    "message": "Failed to save resume file"
                }
            ) from error
        
        # Store metadata
        self.resume_store[resume_id] = {
            "id": resume_id,
            "filename": filename,
            "file_type": file_path.suffix[1:],
            "path": str(saved_path),
            "user_id": user_id,
            "size": len(content),
            "status": "uploaded",
            "analysis": None,
        }
        self._save_store()
        
        logger.info(f"Resume {resume_id} uploaded successfully")
        
        return {
            "resume_id": resume_id,
            "filename": filename,
            "file_type": file_path.suffix[1:],
            "status": "uploaded",
            "file_size": len(content),
        }

    def analyze_resume(self, resume_id: str) -> dict[str, Any]:
        """
        Analyze a resume.
        
        Args:
            resume_id: Resume ID to analyze
            
        Returns:
            Analysis results
        """
        if resume_id not in self.resume_store:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "RESUME_NOT_FOUND",
                    "message": "Resume not found"
                }
            )
        
        resume_meta = self.resume_store[resume_id]
        file_path = Path(resume_meta["path"])
        
        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "FILE_NOT_FOUND",
                    "message": "Resume file not found"
                }
            )
        
        try:
            # Parse document
            text = parse_document(file_path, resume_meta["file_type"])
            
            # Analyze using engine
            analysis = self.analysis_engine.analyze(text)
            
            # Store analysis
            self.resume_store[resume_id]["analysis"] = analysis
            self.resume_store[resume_id]["status"] = "analyzed"
            self._save_store()
            
            logger.info(f"Resume {resume_id} analyzed successfully")
            
            return {
                "resume_id": resume_id,
                **analysis,
            }
        except HTTPException:
            raise
        except Exception as error:
            logger.error(f"Error analyzing resume {resume_id}: {error}")
            raise HTTPException(
                status_code=500,
                detail={
                    "code": "ANALYSIS_FAILED",
                    "message": "Failed to analyze resume"
                }
            ) from error

    def get_resume(self, resume_id: str) -> dict[str, Any]:
        """Get resume information."""
        if resume_id not in self.resume_store:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "RESUME_NOT_FOUND",
                    "message": "Resume not found"
                }
            )
        
        resume_meta = self.resume_store[resume_id]
        
        return {
            "resume_id": resume_id,
            "filename": resume_meta["filename"],
            "file_type": resume_meta["file_type"],
            "status": resume_meta["status"],
            "size": resume_meta["size"],
        }

    def get_resume_file(self, resume_id: str) -> Path:
        """Get path to resume file for serving."""
        if resume_id not in self.resume_store:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "RESUME_NOT_FOUND",
                    "message": "Resume not found"
                }
            )
        
        file_path = Path(self.resume_store[resume_id]["path"])
        
        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "FILE_NOT_FOUND",
                    "message": "Resume file not found"
                }
            )
        
        return file_path

    def get_resume_analysis(self, resume_id: str) -> dict[str, Any]:
        """Get resume analysis results, lazily analyzing if needed."""
        if resume_id not in self.resume_store:
            raise HTTPException(
                status_code=404,
                detail={
                    "code": "RESUME_NOT_FOUND",
                    "message": "Resume not found"
                }
            )

        analysis = self.resume_store[resume_id].get("analysis")
        if not analysis:
            analysis = self.analyze_resume(resume_id)
            self.resume_store[resume_id]["analysis"] = analysis

        return analysis

    def get_resume_skills(self, resume_id: str) -> list[dict[str, Any]]:
        """Get skills extracted from resume."""
        analysis = self.get_resume_analysis(resume_id)
        return analysis.get("skills", [])
