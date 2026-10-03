# Assessment Question Dataset Analysis

> **Artifact Reference:**  
> - Assessment Questions CSV: [`dataset/assessment_questions.csv`](file:///dataset/assessment_questions.csv)  
> - **Notice:** This dataset is a standalone demonstration question bank maintained within the `Model/` directory to demonstrate technical evaluation concepts for faculty presentations. It does not replace the deployed application's runtime assessment generator.

---

## 1. Summary Statistics

The assessment question dataset provides a standardized evaluation bank to test candidate technical competency following resume analysis.

| Metric | Computed Value | Description |
|---|:---:|---|
| **Total Assessment Questions** | **48** | Full bank of multiple-choice questions |
| **Unique Careers Covered** | **8** | All 8 career paths represented |
| **Unique Skills Evaluated** | **40** | Focused technical competencies tested |
| **Questions per Career** | **6** | Exactly 6 questions per career track |
| **Difficulty Levels** | **3** | `BEGINNER`, `ADVANCED`, `EXPERT` |
| **Questions per Difficulty** | **16 each** | Perfectly balanced distribution |

---

## 2. Questions by Difficulty Level

| Difficulty Level | Number of Questions | Percentage | Target Proficiency Tested |
|:---|:---:|:---:|---|
| **BEGINNER** | 16 | 33.33% | Syntax, core concepts, basic terminology, and fundamental definitions |
| **ADVANCED** | 16 | 33.33% | Practical implementation, library APIs, edge cases, and common debugging |
| **EXPERT** | 16 | 33.33% | High-scale trade-offs, architecture patterns, reliability, security, and optimization |
| **Total** | **48** | **100.00%** | Comprehensive 3-tier skill evaluation |

---

## 3. Questions by Career Track

| Career | Total Questions | Beginner Questions | Advanced Questions | Expert Questions |
|:---|:---:|:---:|:---:|:---:|
| **Data Scientist** | 6 | 2 | 2 | 2 |
| **Machine Learning Engineer** | 6 | 2 | 2 | 2 |
| **Data Analyst** | 6 | 2 | 2 | 2 |
| **Full Stack Developer** | 6 | 2 | 2 | 2 |
| **Frontend Developer** | 6 | 2 | 2 | 2 |
| **Backend Developer** | 6 | 2 | 2 | 2 |
| **DevOps Engineer** | 6 | 2 | 2 | 2 |
| **Cybersecurity Analyst** | 6 | 2 | 2 | 2 |
| **Total** | **48** | **16** | **16** | **16** |

---

## 4. Questions by Technical Skill

The 48 questions span 40 individual technical skills across the 8 career domains:

| Skill Evaluated | Number of Questions | Careers Covered | Sample Difficulty |
|:---|:---:|:---|:---:|
| **SQL** | 3 | Data Analyst, Data Scientist, Backend Developer | Beginner, Advanced |
| **Docker** | 2 | DevOps Engineer, ML Engineer | Beginner, Advanced |
| **Kubernetes** | 2 | DevOps Engineer, ML Engineer | Expert |
| **Linux** | 2 | DevOps Engineer, Cybersecurity Analyst | Beginner |
| **REST API** | 2 | Backend Developer, Full Stack Developer | Beginner, Expert |
| **React** | 2 | Frontend Developer | Beginner, Expert |
| **Statistics** | 2 | Data Scientist | Beginner, Expert |
| **Python** | 1 | Data Scientist | Beginner |
| **PyTorch** | 1 | Machine Learning Engineer | Advanced |
| **Deep Learning** | 1 | Machine Learning Engineer | Beginner |
| **Scikit-learn** | 1 | Data Scientist | Expert |
| **Machine Learning** | 1 | Data Scientist | Advanced |
| **Power BI** | 1 | Data Analyst | Advanced |
| **Excel** | 1 | Data Analyst | Beginner |
| **Data Visualization** | 1 | Data Analyst | Advanced |
| **Business Intelligence** | 1 | Data Analyst | Expert |
| **Reporting** | 1 | Data Analyst | Expert |
| **MLOps** | 1 | Machine Learning Engineer | Expert |
| **Model Deployment** | 1 | Machine Learning Engineer | Advanced |
| **JavaScript** | 1 | Full Stack Developer | Beginner |
| **HTML** | 1 | Full Stack Developer | Beginner |
| **Node.js** | 1 | Full Stack Developer | Advanced |
| **MongoDB** | 1 | Full Stack Developer | Advanced |
| **Authentication** | 1 | Full Stack Developer | Expert |
| **CSS** | 1 | Frontend Developer | Beginner |
| **TypeScript** | 1 | Frontend Developer | Advanced |
| **Tailwind CSS** | 1 | Frontend Developer | Advanced |
| **Responsive Design** | 1 | Frontend Developer | Expert |
| **FastAPI** | 1 | Backend Developer | Advanced |
| **Redis** | 1 | Backend Developer | Advanced |
| **PostgreSQL** | 1 | Backend Developer | Expert |
| **Microservices** | 1 | Backend Developer | Expert |
| **CI/CD** | 1 | DevOps Engineer | Beginner |
| **Terraform** | 1 | DevOps Engineer | Advanced |
| **Prometheus** | 1 | DevOps Engineer | Expert |
| **Network Security** | 1 | Cybersecurity Analyst | Beginner |
| **Wireshark** | 1 | Cybersecurity Analyst | Advanced |
| **SIEM** | 1 | Cybersecurity Analyst | Advanced |
| **Penetration Testing** | 1 | Cybersecurity Analyst | Expert |
| **Incident Response** | 1 | Cybersecurity Analyst | Expert |

---

## 5. Question Schema & Structure

Each question in `assessment_questions.csv` contains 11 structured columns:

1. `question_id`: Unique identifier (e.g., `Q-DS-01`, `Q-CSA-06`)
2. `career`: Associated target career path
3. `skill`: Technical skill tested
4. `difficulty`: Tier (`BEGINNER`, `ADVANCED`, `EXPERT`)
5. `question`: Multiple-choice technical prompt
6. `option_a`: Choice A
7. `option_b`: Choice B
8. `option_c`: Choice C
9. `option_d`: Choice D
10. `correct_answer`: Answer key (`A`, `B`, `C`, or `D`)
11. `explanation`: Academic rationale explaining why the answer is correct

---

## 6. Skill Assessment Logic

The assessment concept operationalizes candidate verification through the following workflow:

```text
               Predicted or Target Career
                           │
                           ▼
          Required Skills Identified from Mapping
                           │
                           ▼
          Candidate Claims Verified Against Assessment
                           │
                           ▼
    Difficulty Level Selected (Beginner / Advanced / Expert)
                           │
                           ▼
          Questions Delivered to Candidate
                           │
                           ▼
          User Responses Scored Against Key
                           │
                           ▼
    Skill Confidence Score Computed (0% - 100%)
                           │
                           ▼
  Skill Gap Analysis: High / Medium / Low Priority Learning Needs
```

This workflow ensures that resume claims (e.g., "Advanced in Python") can be validated with objective assessment data rather than relying solely on self-reported keywords.
