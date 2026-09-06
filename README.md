
## AI-Powered Resume, Skill Gap & Career Readiness System

> **Your resume tells us what you claim. Your assessment shows what you demonstrate.**

CareerLens AI is an AI-powered career intelligence platform that analyzes resumes using NLP, extracts skills, recommends suitable career paths, identifies skill gaps, recommends missing skills, and evaluates actual technical knowledge through AI-generated assessments.

---

## Features

### 1. AI Resume Analysis
- Upload PDF/DOCX resume
- NLP-based resume processing
- Extract education, experience, projects and skills
- Resume quality score
- Strengths and weaknesses analysis

### 2. Skill Extraction
- Automatically extract technical skills
- Categorize skills
- Skill confidence scores
- Identify strong and weak skills

### 3. Career Suggestions
- Recommend suitable career paths
- Career match percentage
- Show matched skills
- Show missing skills
- Select target career

### 4. Skill Gap Analysis
- Compare current skills with career requirements
- Identify missing skills
- Prioritize skill gaps
- Recommend skills to learn
- Provide learning order

### 5. AI Career Skill Assessment
- Career-specific MCQ test
- AI-generated questions
- Beginner level
- Advanced level
- Expert level
- Skill-wise assessment

### 6. Skill Confidence
- Overall confidence score
- Skill-wise confidence
- Low / Developing / Good / High / Expert levels

### 7. Resume Claim vs Actual Skill
Compare what the candidate claims on their resume with what they demonstrate in the assessment.

Example:

```text
Machine Learning

Resume Claim: Advanced
Assessment: 62%
Confidence: Medium

Status: Needs Validation
````

### 8. Career Readiness

Generate an overall career readiness score using:

* Resume quality
* Skill match
* Assessment performance
* Skill confidence

Example:

```text
Career Readiness: 81%

Status: Good Preparation
```

### 9. Analytics

* Resume analytics
* Skill analytics
* Career match analytics
* Skill gap analytics
* Assessment analytics
* Confidence analytics
* Career readiness analytics

---

## System Workflow

```text
Upload Resume
      ↓
NLP Processing
      ↓
Resume Analysis
      ↓
Skill Extraction
      ↓
Career Suggestions
      ↓
Select Target Career
      ↓
Skill Gap Analysis
      ↓
Missing Skills
      ↓
Skill Recommendations
      ↓
AI Skill Assessment
      ↓
Beginner / Advanced / Expert
      ↓
Assessment Results
      ↓
Skill Confidence
      ↓
Resume Claim vs Actual Skill
      ↓
Career Readiness
      ↓
Personalized Next Steps
```

---

## Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Recharts
* Lucide Icons

### Backend

* Python 3.11+
* FastAPI
* Uvicorn
* SQLite for local development (PostgreSQL can be added behind the database layer)

### AI / NLP

* NLP
* Machine Learning
* Semantic Similarity
* Skill Extraction
* AI Question Generation

### Database

* MongoDB / PostgreSQL

---

## Main Modules

```text
Dashboard
Resume Analysis
Skills
Career Suggestions
Skill Gap
Skill Recommendations
Skill Assessment
Assessment Results
Skill Confidence
Claim vs Actual Skill
Career Readiness
Analytics
```

---

## Unique Feature

The main differentiator of CareerLens AI is:

```text
Resume Claims
      VS
Demonstrated Skills
```

Instead of only analyzing what candidates write on their resumes, CareerLens AI evaluates whether their claimed skills are supported by their assessment performance.

---

## Project Objective

The main objective is to help students and job seekers understand:

* What skills they currently have
* Which careers suit them
* What skills they are missing
* What they should learn
* How well they actually understand their claimed skills
* How ready they are for their target career

---

## Conclusion

CareerLens AI transforms traditional resume analysis into an intelligent career guidance system by combining:

**Resume Analysis + NLP + Skill Extraction + Career Recommendation + Skill Gap Analysis + AI Assessment + Skill Confidence + Career Readiness**

> **Don't just analyze the resume. Understand the candidate.**

## Local Development

### Supabase Authentication and Storage

The frontend can use Supabase for account authentication, profile onboarding, and private resume storage. The existing FastAPI service still performs resume parsing and AI analysis.

1. Create a Supabase project.
2. Open Supabase SQL Editor and run [supabase/schema.sql](supabase/schema.sql).
3. Copy `frontend/.env.example` to `frontend/.env` and fill in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. In Supabase Authentication settings, choose whether new users must confirm their email. If confirmation is enabled, users confirm first and then sign in.
5. Start the app. New users follow: sign up -> profile setup -> resume upload -> existing AI analysis -> dashboard insights.

Resume files are stored privately in the `resumes` bucket under a user-specific folder. The browser also sends the selected file to the existing FastAPI upload endpoint so current analysis features continue to work.

Install backend dependencies and start the API:

```powershell
cd D:\jyoti\AI-Resume-System\backend
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In a second terminal, start the existing frontend:

```powershell
cd frontend
npm install
npm run dev
```

The API is available at `http://localhost:8000`, Swagger at `http://localhost:8000/docs`, and the frontend at `http://localhost:5173`. Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env` when changing local URLs.

Run backend tests with `cd backend; pytest`. The main flow is upload (`POST /api/resumes/upload`), analyze (`POST /api/resumes/{resume_id}/analyze`), recommend (`POST /api/careers/recommend`), skill gap (`POST /api/skill-gap/analyze`), recommendations (`POST /api/recommendations/skills`), assessment generation/submission, confidence, claim comparison, readiness, and analytics. Assessment generation deliberately omits the server-side answer key.