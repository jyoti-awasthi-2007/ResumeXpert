from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_careers_are_seeded():
    response = client.get("/api/careers")
    assert response.status_code == 200
    assert any(item["id"] == "ml-engineer" for item in response.json())


def test_upload_analyze_and_assessment_flow(tmp_path, monkeypatch):
    upload = client.post("/api/resumes/upload", files={"resume": ("resume.docx", b"test resume", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")})
    assert upload.status_code == 200
    assert upload.json()["status"] == "uploaded"


def test_rejects_unsupported_resume_type():
    response = client.post("/api/resumes/upload", files={"resume": ("notes.txt", b"not a resume", "text/plain")})
    assert response.status_code == 400


def test_resume_analysis_contains_frontend_ready_fields():
    from app.engines.resume_analysis import ResumeAnalysisEngine

    result = ResumeAnalysisEngine().analyze("Python React SQL AWS Docker JavaScript REST APIs Git")

    assert "summary" in result
    assert "personal" in result
    assert "education" in result
    assert "experience" in result
    assert "projects" in result
    assert "improvements" in result


def test_frontend_skill_gap_contract_works():
    upload = client.post(
        "/api/resumes/upload",
        files={"resume": ("resume.docx", b"Python React SQL AWS Docker JavaScript REST APIs Git", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )
    resume_id = upload.json()["resume_id"]

    response = client.post(
        "/api/skill-gap/analyze",
        json={"resume_id": resume_id, "career_id": "ml-engineer"},
    )

    assert response.status_code == 200
    body = response.json()
    assert "have_skills" in body
    assert "missing_skills" in body
    assert isinstance(body["have_skills"], list)


def test_frontend_recommendation_contract_works():
    upload = client.post(
        "/api/resumes/upload",
        files={"resume": ("resume.docx", b"Python React SQL AWS Docker JavaScript REST APIs Git", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )
    resume_id = upload.json()["resume_id"]

    response = client.post(
        "/api/recommendations/skills",
        json={"resume_id": resume_id, "career_id": "ml-engineer"},
    )

    assert response.status_code == 200
    body = response.json()
    assert "recommendations" in body
    assert isinstance(body["recommendations"], list)
