# ResumeXpert — Complete Project Documentation

## 1. Project Overview

**ResumeXpert** is an AI-powered resume and career analysis platform.

It analyzes a user's resume, extracts education, experience, projects, certifications and technical skills, matches those skills with career requirements, identifies skill gaps, recommends learning paths, and uses an AI-generated technical assessment to measure actual skill knowledge.

### Overall Workflow

```text
User
 ↓
Register / Login
 ↓
Profile Setup
 ↓
Upload Resume
 ↓
Resume Parsing
 ↓
NLP Processing
 ↓
Information Extraction
 ↓
Skill Extraction
 ↓
Career Analysis
 ↓
Skill Gap Analysis
 ↓
Skill Recommendations
 ↓
AI Technical Assessment
 ↓
Beginner / Advanced / Expert
 ↓
Score + Skill Performance
 ↓
Claim vs Actual Skill Analysis
 ↓
Confidence
 ↓
Career Readiness
 ↓
Analytics
```

---

## 2. Core Features

### User Authentication
Supabase Auth provides:
- Signup
- Login
- Logout
- Session management
- Protected application access

Flow:

```text
Sign Up
 ↓
Supabase Auth
 ↓
Profile Setup
 ↓
Dashboard
```

### Profile Management
The user profile can contain:
- Full name
- Location
- Target role
- Experience level

Profile information is stored in Supabase.

### Resume Upload
The user uploads a resume through the React frontend. The original file is stored in a **private Supabase Storage bucket** named `resumes`.

```text
User
 ↓
Frontend
 ↓
Supabase Storage
 ↓
Private Resume File
 ↓
FastAPI Resume Analysis
```

### Resume Processing
The resume analysis pipeline is conceptually:

```text
PDF / DOCX
 ↓
Text Extraction
 ↓
Text Cleaning
 ↓
Section Detection
 ↓
NLP Processing
 ↓
Information Extraction
```

The system aims to extract:
- Name
- Education
- Experience
- Projects
- Certifications
- Skills
- Technologies
- Achievements

### Skill Extraction
Skills can be extracted from:
- Skills section
- Projects
- Experience
- Education
- Certifications
- Achievements

Example:

```text
Built a recommendation system using Python, PyTorch and PostgreSQL.
```

Possible extracted skills:

```text
Python
PyTorch
PostgreSQL
```

Skill categories can include:
- Programming
- Database
- AI / ML
- Web Development
- Tools
- Other technical skills

---

## 3. Career Analysis

The extracted skills are compared with career requirements.

Example:

```text
Candidate Skills:
Python
SQL
Pandas
Machine Learning

Possible Careers:
Data Scientist
ML Engineer
Data Analyst
Python Developer
```

Existing career information can include:
- Career name
- Match percentage
- Matching skills
- Missing skills
- Explanation

Core concept:

```text
Candidate Skills
 +
Career Skill Requirements
 ↓
Career Match
```

---

## 4. Skill Gap Analysis

After choosing a target career:

```text
Candidate Skills
        VS
Required Career Skills
```

Example:

```text
Target Career:
Machine Learning Engineer

Candidate:
Python
SQL
NumPy
Pandas

Required:
Python
NumPy
Pandas
PyTorch
TensorFlow
Docker
ML System Design
```

The system identifies:
- Existing skills
- Missing skills
- Priority

Example:

```text
PyTorch       → High
Docker        → Medium
System Design → Medium
```

---

## 5. Skill Recommendations

Recommendations answer:

```text
What should I learn?
Why should I learn it?
What should I learn first?
What skills depend on other skills?
```

Example learning order:

```text
Python
 ↓
NumPy
 ↓
Pandas
 ↓
Machine Learning
 ↓
PyTorch
```

---

## 6. AI Technical MCQ Assessment

The assessment is one of the core ResumeXpert features.

It uses:

```text
Resume Skills
 +
Target Career
 +
Selected Difficulty
```

to generate technical questions.

Three assessment levels:

```text
Beginner
Advanced
Expert
```

### Beginner
Tests:
- Fundamentals
- Definitions
- Basic syntax
- Basic usage
- Foundational concepts

### Advanced
Tests:
- Applied knowledge
- Debugging
- Practical scenarios
- Implementation decisions
- Moderate complexity

### Expert
Tests:
- Deep technical knowledge
- Optimization
- Architecture
- Edge cases
- Performance
- Trade-offs
- Production-level reasoning

Important:

```text
Beginner ≠ Advanced ≠ Expert
```

Difficulty should affect the actual complexity of questions, not only the label.

---

## 7. Skill-Driven Assessment

Questions should be relevant to the user's real resume skills and target career.

Example:

```text
Resume Skills:
Python
SQL
Machine Learning
Pandas

Target Career:
Data Scientist
```

The assessment should prioritize relevant skills such as:

```text
Python
SQL
Machine Learning
Pandas
Statistics
```

rather than unrelated random questions.

---

## 8. Duplicate MCQ Prevention

The assessment should prevent:

### Exact duplicates

```text
"What is normalization?"
```

appearing twice.

### Semantic duplicates

```text
Why is database normalization important?
```

and:

```text
What is the purpose of database normalization?
```

These can represent the same underlying concept.

A strong assessment system should therefore perform:
1. Text normalization
2. Similarity checking
3. Duplicate rejection
4. Regeneration only for missing questions

---

## 9. Assessment Scoring

After submission:

```text
Questions
 ↓
Answers
 ↓
Backend Scoring
 ↓
Overall Score
 ↓
Skill-wise Score
```

Example:

```text
Python            92%
SQL               68%
Machine Learning  84%
Statistics        51%
```

This identifies both strengths and weaknesses.

---

## 10. Resume Claim vs Actual Skill

The system can compare resume claims with assessment evidence.

Example:

```text
Resume:
Machine Learning — Advanced

Assessment:
61%
```

Possible status:

```text
Needs Validation
```

Another example:

```text
Resume:
SQL — Intermediate

Assessment:
94%
```

Possible status:

```text
Demonstrated Above Claimed Level
```

The aim is to make the resume more evidence-based.

---

## 11. Confidence Score

Assessment performance can feed the confidence system.

Concept:

```text
Higher demonstrated skill score
 ↓
Higher confidence
```

The score can be displayed with:
- Progress ring
- Gauge
- Score card
- Progress indicator

The backend should remain authoritative for calculations.

---

## 12. Career Readiness

Career readiness combines major dimensions:

```text
Resume Quality
 +
Skill Match
 +
Technical Assessment
 +
Confidence
 ↓
Career Readiness
```

This gives a broader view of preparation for the target career.

---

## 13. Analytics

Analytics can visualize existing application data such as:

```text
Resume Score
Skill Match
Assessment Score
Skill-wise Performance
Confidence
Career Readiness
Skill Gaps
```

Analytics should use real stored data and not fabricated statistics.

---

# 14. Technology Stack

## Frontend

```text
React
Vite
JavaScript / JSX
Axios
React Router
Supabase JS
```

Purpose:
- React: UI
- Vite: build/development
- Axios: API communication
- React Router: SPA navigation
- Supabase JS: Auth/Storage/Profile integration

## Backend

```text
Python
FastAPI
SQLAlchemy
Alembic
```

Purpose:
- FastAPI: REST API
- SQLAlchemy: relational database access
- Alembic: database migrations

## Database

```text
SQLite
```

for local development and:

```text
Supabase PostgreSQL
```

for production.

## AI

```text
Groq
```

for AI-generated analysis/explanations/assessment content where used.

## Hosting

```text
Vercel → React frontend
Render → FastAPI backend
Supabase → Auth + Storage + PostgreSQL
```

---

# 15. Backend API Structure

The FastAPI application includes routers for:

```text
analytics
assessment
career
chat
health
resume
skill
```

The architecture is broadly:

```text
Frontend
 ↓
Axios
 ↓
FastAPI Router
 ↓
Service / Business Logic
 ↓
SQLAlchemy
 ↓
PostgreSQL
```

---

# 16. Database Tables

Backend-owned tables include:

```text
users
resumes
selections
assessments
careers
skills
resume_records
resume_analyses
user_skills
career_skills
skill_gaps
assessment_records
questions
assessment_questions
assessment_answers
assessment_results
skill_confidence
career_readiness
```

Supabase-managed/application tables that were preserved include:

```text
profiles
activity_logs
auth.users
storage.objects
```

---

# 17. Authentication Architecture

```text
React Frontend
 ↓
Supabase Auth
 ↓
Authenticated Session
 ↓
Access Token
 ↓
FastAPI
```

Authenticated API requests can use:

```http
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
```

This allows the backend to associate requests with authenticated users.

---

# 18. API Communication

Production:

```text
React / Vercel
 ↓
Axios
 ↓
https://resumexpert-3v2l.onrender.com/api
 ↓
FastAPI
```

Local development can use:

```text
http://localhost:8000/api
```

Production must not use localhost.

---

# 19. CORS

Because Vercel and Render use different origins, FastAPI uses:

```text
CORSMiddleware
```

The production frontend origin is:

```text
https://resume-xpert-zeta.vercel.app
```

Local origins can also be allowed for development.

---

# 20. AI Architecture

AI-related work can include:

```text
Resume interpretation
Career explanations
Skill explanations
Personalized recommendations
MCQ generation
MCQ explanations
```

Deterministic/backend logic should handle:

```text
Skill matching
Skill gap
Assessment scoring
Confidence
Career readiness
Analytics
```

This keeps calculations reliable and reproducible.

---

# 21. Deployment Architecture

```text
                         USER
                           │
                           ▼
                ┌────────────────────┐
                │  ResumeXpert Web   │
                │ React + Vite       │
                │ Hosted on Vercel   │
                └─────────┬──────────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
       Supabase Auth   Supabase     FastAPI
                       Storage        API
                                       │
                                       ▼
                              PostgreSQL Database
                                       │
                                       ▼
                                     Groq AI
```

---

# 22. Current Production URLs

### Frontend

```text
https://resume-xpert-zeta.vercel.app
```

### Backend

```text
https://resumexpert-3v2l.onrender.com
```

### API Base URL

```text
https://resumexpert-3v2l.onrender.com/api
```

### Health Check

```text
https://resumexpert-3v2l.onrender.com/api/health
```

Expected:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

### FastAPI Documentation

```text
https://resumexpert-3v2l.onrender.com/docs
```

---

# 23. Environment Variables

## Frontend

```env
VITE_API_BASE_URL=https://resumexpert-3v2l.onrender.com/api
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

`VITE_*` values are available to the browser. Do not put server secrets in them.

## Backend

```env
APP_ENV=production
DATABASE_URL=...
AI_PROVIDER=groq
AI_API_KEY=...
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=...
FRONTEND_URL=https://resume-xpert-zeta.vercel.app
```

Keep the database password and AI secret server-side.

---

# 24. Resume Upload Flow

```text
1. User logs in
        ↓
2. Supabase session is active
        ↓
3. User selects PDF/DOCX
        ↓
4. Original file stored in Supabase Storage
        ↓
5. Frontend calls FastAPI
        ↓
6. Authorization token is attached
        ↓
7. FastAPI processes the resume
        ↓
8. Text is extracted
        ↓
9. Resume information and skills are analyzed
        ↓
10. Results are persisted
        ↓
11. Frontend displays results
```

---

# 25. Career Analysis Flow

```text
Resume
 ↓
Extracted Skills
 ↓
Target Career
 ↓
Required Career Skills
 ↓
Skill Match
 ↓
Missing Skills
 ↓
Priority
 ↓
Recommendations
```

---

# 26. Assessment Flow

```text
Resume Skills
 +
Target Career
 +
Difficulty
 ↓
AI Question Generation
 ↓
Question Validation
 ↓
Duplicate Detection
 ↓
Assessment Created
 ↓
Questions Shown
 ↓
User Answers
 ↓
Submit
 ↓
Backend Scoring
 ↓
Skill-wise Results
 ↓
Confidence
 ↓
Claim vs Actual
 ↓
Career Readiness
```

---

# 27. Folder Architecture

```text
AI-Resume-System/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── layouts/
│   │   └── ...
│   ├── package.json
│   ├── .env.production
│   ├── vercel.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── analytics.py
│   │   │   ├── assessment.py
│   │   │   ├── career.py
│   │   │   ├── chat.py
│   │   │   ├── health.py
│   │   │   ├── resume.py
│   │   │   └── skill.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   ├── config.py
│   │   └── main.py
│   ├── migrations/
│   ├── requirements.txt
│   └── ...
│
├── schema.sql
├── render.yaml
└── README.md
```

---

# 28. Production vs Local

## Local

```text
React
localhost:5173

FastAPI
localhost:8000

SQLite
careerlens.db
```

## Production

```text
React
Vercel

FastAPI
Render

Database
Supabase PostgreSQL

Storage
Supabase Storage

Authentication
Supabase Auth

AI
Groq
```

---

# 29. Important Mobile Deployment Lesson

The mobile upload issue was caused by the production frontend using:

```text
http://127.0.0.1:8000/api
```

instead of the deployed backend URL.

On a laptop:

```text
127.0.0.1
→ Laptop
→ Local FastAPI
→ Works
```

On a phone:

```text
127.0.0.1
→ Phone itself
→ No local FastAPI
→ Network Error
```

The production frontend API configuration was corrected to use:

```text
https://resumexpert-3v2l.onrender.com/api
```

and the live bundle was checked to make sure the old localhost reference was removed.

---

# 30. Security

Important security principles:

- Supabase Auth handles identity.
- Private Supabase Storage is used for resumes.
- Production relational data uses PostgreSQL.
- FastAPI can verify authenticated requests.
- CORS permits approved frontend origins.
- Groq API key remains server-side.
- Database credentials remain server-side.
- `.env` files should not be committed unnecessarily.
- Never expose Supabase secret/service-role keys in frontend code.

---

# 31. Current Production Considerations

The database migration from SQLite to Supabase PostgreSQL is complete.

However, the project inspection identified remaining areas that should be addressed for a fully production-grade multi-user system:

```text
ResumeService.resume_store
Local resume filesystem usage
Assessment JSON/in-memory persistence
Some default_user references
Not every backend route fully propagates authenticated Supabase user IDs
```

These areas can affect persistence and complete multi-user isolation across restarts.

---

# 32. What Makes ResumeXpert Different

A basic resume analyzer might do:

```text
Resume
 ↓
Score
 ↓
Suggestions
```

ResumeXpert is designed to go further:

```text
Resume
 ↓
Understand Candidate
 ↓
Extract Skills
 ↓
Find Career Opportunities
 ↓
Find Skill Gaps
 ↓
Recommend Learning
 ↓
Test Actual Knowledge
 ↓
Compare Resume Claims With Demonstrated Skills
 ↓
Calculate Confidence
 ↓
Calculate Career Readiness
 ↓
Show Personalized Next Steps
```

The key concept is the combination of **resume evidence + skill assessment + career analysis**.

---

# 33. Viva — One-Line Explanation

> **ResumeXpert is a full-stack AI career analysis platform where a React/Vite frontend communicates with a FastAPI backend, Supabase provides authentication, profiles, PostgreSQL and resume storage, Groq provides AI generation, and the system combines resume analysis, skill-gap detection, career matching and field-specific technical assessments to provide career-readiness insights.**

---

# 34. Viva — Simple Professor Explanation

> **First, the user creates an account and completes their profile. They upload their resume, which is securely stored and processed by the FastAPI backend. The system extracts resume information and technical skills using text processing and NLP. Those skills are compared with career requirements to identify suitable careers and skill gaps. Based on the selected career and the candidate's skills, the system generates technical MCQs at beginner, advanced or expert level. The assessment measures actual technical knowledge, and the result can be compared with what the candidate claimed on the resume. Finally, the system combines the resume, skill match, assessment and confidence information to provide career-readiness insights and personalized improvement recommendations.**

---

# 35. Complete Technology Summary

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Build Tool | Vite | Frontend build/development |
| API Client | Axios | Frontend → FastAPI |
| Routing | React Router | SPA navigation |
| Authentication | Supabase Auth | Signup/login/session |
| Profile | Supabase | User profile |
| Storage | Supabase Storage | Resume files |
| Backend | FastAPI | REST API |
| Language | Python | Backend |
| ORM | SQLAlchemy | Database access |
| Migration | Alembic | Schema migrations |
| Production DB | Supabase PostgreSQL | Persistent relational data |
| AI Provider | Groq | AI generation |
| Frontend Hosting | Vercel | React production hosting |
| Backend Hosting | Render | FastAPI production hosting |

---

# 36. Final System Architecture

```text
                         USER
                           │
                           ▼
                ┌────────────────────┐
                │    ResumeXpert     │
                │  React + Vite      │
                │      Vercel        │
                └─────────┬──────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
            ▼             ▼             ▼
      Supabase Auth   Supabase      FastAPI
                     Storage          Render
                                      │
                                      ▼
                              Supabase PostgreSQL
                                      │
                                      ▼
                                     Groq
                                      AI
```

### Core Product Pipeline

```text
Authentication
      ↓
Profile
      ↓
Resume Upload
      ↓
Resume Analysis
      ↓
NLP
      ↓
Skill Extraction
      ↓
Career Matching
      ↓
Skill Gap
      ↓
Recommendations
      ↓
AI Assessment
      ↓
Beginner / Advanced / Expert
      ↓
Skill Scores
      ↓
Claim vs Actual
      ↓
Confidence
      ↓
Career Readiness
      ↓
Analytics
```

---

## Project Purpose in One Sentence

**ResumeXpert transforms a traditional resume into an evidence-based career profile by combining AI resume analysis, skill extraction, career matching, skill-gap identification, technical assessment and career-readiness analysis.**
