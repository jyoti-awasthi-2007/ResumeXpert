# Dataset Data Dictionary

This directory contains the experimental and demonstration datasets used by the ResumeXpert offline model and assessment prototype.

---

## 1. Resume Career Classification Dataset

**File:** `synthetic_resume_career_dataset.csv`  
**Total Records:** 1,600  
**Target:** `career` (Multiclass text classification, 8 classes)  
**Nature:** Synthetic demonstration data generated with fixed seed (42).

| Column | Data Type | Description | Example |
|---|---|---|---|
| `id` | String | Unique synthetic candidate profile identifier | `DAT-0001` |
| `resume_text` | String | Synthetic resume text comprising Education, Skills, Experience, and Project narratives | `Education: B.Tech Computer Engineering. Technical skills: python, pandas, sql...` |
| `career` | String | Ground truth target career label | `Data Scientist` |

### Career Class Distribution (200 records each = 1,600 total)
1. Data Scientist (200, 12.5%)
2. Machine Learning Engineer (200, 12.5%)
3. Data Analyst (200, 12.5%)
4. Full Stack Developer (200, 12.5%)
5. Frontend Developer (200, 12.5%)
6. Backend Developer (200, 12.5%)
7. DevOps Engineer (200, 12.5%)
8. Cybersecurity Analyst (200, 12.5%)

---

## 2. Technical Skills Dataset

**File:** `skills_dataset.csv`  
**Total Records:** 87 unique technical skills across 9 categories  
**Nature:** Curated skills ontology supporting skill extraction, normalization, and gap analysis.

| Column | Data Type | Description | Example |
|---|---|---|---|
| `skill_id` | String | Standard skill identifier | `SKILL-001` |
| `skill_name` | String | Canonical display name of the technical skill | `Python` |
| `category` | String | High-level domain/functional category | `Programming Languages` |
| `aliases` | String | Comma-separated alternative names/tokens for NLP matching | `py, python3` |
| `description` | String | Technical overview and role of the skill | `High-level programming language used in AI...` |

### Categories Included
- Programming Languages (9 skills)
- Web & Frontend (12 skills)
- Backend & APIs (8 skills)
- Databases & Storage (5 skills)
- AI & Machine Learning (11 skills)
- Data Analysis & BI (11 skills)
- Cloud & DevOps (12 skills)
- Cybersecurity (11 skills)
- Core Engineering & Collaboration (8 skills)

---

## 3. Career-to-Skill Mapping Dataset

**File:** `career_skill_mapping.csv`  
**Total Records:** 110 mappings  
**Nature:** Curriculum and career competency mapping connecting each career to its required core and supporting competencies.

| Column | Data Type | Description | Example |
|---|---|---|---|
| `career_title` | String | Name of the target career | `Data Scientist` |
| `skill_name` | String | Name of the required or supporting skill | `Scikit-learn` |
| `skill_type` | String | Role of skill: `Core` (essential) or `Supporting` (complementary) | `Core` |
| `priority` | String | Industry hiring priority level: `High`, `Medium`, or `Low` | `High` |
| `relevance_weight` | Float | Importance weight normalized from 0.0 to 1.0 | `0.95` |

---

## 4. Assessment Questions Dataset

**File:** `assessment_questions.csv`  
**Total Records:** 48 multiple-choice questions  
**Distribution:** 6 questions per career (2 Beginner, 2 Advanced, 2 Expert)  
**Nature:** Standardized evaluation question bank for testing candidate technical competency.

| Column | Data Type | Description | Example |
|---|---|---|---|
| `question_id` | String | Unique question identifier | `Q-DS-01` |
| `career` | String | Associated career domain | `Data Scientist` |
| `skill` | String | Specific technical skill evaluated | `Python` |
| `difficulty` | String | Difficulty tier (`BEGINNER`, `ADVANCED`, `EXPERT`) | `BEGINNER` |
| `question` | String | Multiple-choice question text | `Which Python library is primarily used...` |
| `option_a` | String | Option choice A | `NumPy` |
| `option_b` | String | Option choice B | `Pandas` |
| `option_c` | String | Option choice C | `Matplotlib` |
| `option_d` | String | Option choice D | `Requests` |
| `correct_answer` | String | Correct answer indicator (`A`, `B`, `C`, or `D`) | `B` |
| `explanation` | String | Technical rationale and explanation for viva and self-study | `Pandas provides DataFrame data structures...` |
