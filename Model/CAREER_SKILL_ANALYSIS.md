# Career-Skill Mapping Analysis

> **Artifact Reference:**  
> - Career-Skill CSV: [`dataset/career_skill_mapping.csv`](file:///dataset/career_skill_mapping.csv)

---

## 1. Summary Statistics

The career-skill mapping defines the technical competency benchmarks for each of the 8 career classes. These mappings form the basis of ResumeXpert's skill gap calculation and recommendation logic.

| Metric | Computed Value | Description |
|---|:---:|---|
| **Total Career Classes** | **8** | Full scope of supported career pathways |
| **Total Career-Skill Mappings** | **110** | Individual career-to-skill links |
| **Average Skills per Career** | **13.75** | Mean number of required & supporting competencies |
| **Minimum Skills in a Career** | **13** | Data Analyst (13), Data Scientist (13) |
| **Maximum Skills in a Career** | **14** | Backend Developer, Cybersecurity Analyst, DevOps, Frontend, Full Stack, MLE (14 each) |

---

## 2. Career Competency Profiles (Career → Skills)

### 1. Data Scientist (13 Skills)
- **Core Skills:** Python (High, 1.00), Pandas (High, 0.95), NumPy (High, 0.90), Scikit-learn (High, 0.95), Statistics (High, 0.95), Machine Learning (High, 1.00), SQL (High, 0.90)
- **Supporting Skills:** Matplotlib (Medium, 0.75), Seaborn (Medium, 0.75), Jupyter (Medium, 0.70), Feature Engineering (High, 0.85), Data Visualization (Medium, 0.80), TensorFlow (Medium, 0.70)

### 2. Machine Learning Engineer (14 Skills)
- **Core Skills:** Python (High, 1.00), PyTorch (High, 0.95), TensorFlow (High, 0.95), Scikit-learn (High, 0.90), Machine Learning (High, 1.00), Deep Learning (High, 1.00), Docker (High, 0.85)
- **Supporting Skills:** MLflow (Medium, 0.80), FastAPI (Medium, 0.75), NumPy (Medium, 0.80), Pandas (Medium, 0.80), Kubernetes (Medium, 0.75), AWS (Medium, 0.75), Model Deployment (High, 0.90)

### 3. Data Analyst (13 Skills)
- **Core Skills:** SQL (High, 1.00), Excel (High, 0.95), Power BI (High, 0.95), Tableau (High, 0.95), Python (High, 0.85), Pandas (High, 0.85), Data Visualization (High, 0.95)
- **Supporting Skills:** Statistics (High, 0.80), Dashboarding (High, 0.90), Reporting (High, 0.85), Business Intelligence (High, 0.90), Google Sheets (Low, 0.65), Matplotlib (Medium, 0.70)

### 4. Full Stack Developer (14 Skills)
- **Core Skills:** JavaScript (High, 1.00), TypeScript (High, 0.90), React (High, 0.95), Node.js (High, 0.95), Express (High, 0.90), HTML (High, 0.85), CSS (High, 0.85), MongoDB (High, 0.85)
- **Supporting Skills:** Next.js (Medium, 0.80), Git (High, 0.85), REST API (High, 0.90), Tailwind CSS (Medium, 0.75), SQL (Medium, 0.80), Docker (Medium, 0.70)

### 5. Frontend Developer (14 Skills)
- **Core Skills:** JavaScript (High, 1.00), TypeScript (High, 0.95), React (High, 1.00), HTML (High, 0.90), CSS (High, 0.90), Tailwind CSS (High, 0.85), Vite (Medium, 0.80)
- **Supporting Skills:** Next.js (High, 0.85), Redux (Medium, 0.80), Figma (Medium, 0.75), Responsive Design (High, 0.95), Framer Motion (Medium, 0.70), Git (High, 0.80), REST API (High, 0.80)

### 6. Backend Developer (14 Skills)
- **Core Skills:** Python (High, 0.95), FastAPI (High, 0.90), Node.js (High, 0.90), Express (High, 0.85), SQL (High, 0.95), PostgreSQL (High, 0.90), REST API (High, 1.00)
- **Supporting Skills:** Redis (Medium, 0.80), Docker (High, 0.85), Authentication (High, 0.90), JWT (High, 0.85), MongoDB (Medium, 0.75), Git (High, 0.85), Microservices (High, 0.85)

### 7. DevOps Engineer (14 Skills)
- **Core Skills:** Linux (High, 1.00), Docker (High, 1.00), Kubernetes (High, 1.00), AWS (High, 0.95), CI/CD (High, 1.00), GitHub Actions (High, 0.90), Terraform (High, 0.95)
- **Supporting Skills:** Python (Medium, 0.80), Bash (High, 0.85), Nginx (Medium, 0.75), Prometheus (High, 0.85), Grafana (High, 0.85), Azure (Medium, 0.75), GCP (Medium, 0.75)

### 8. Cybersecurity Analyst (14 Skills)
- **Core Skills:** Network Security (High, 1.00), Linux (High, 0.90), Python (Medium, 0.80), SIEM (High, 0.95), Wireshark (High, 0.95), Penetration Testing (High, 0.95), Incident Response (High, 1.00)
- **Supporting Skills:** Splunk (High, 0.85), Nmap (High, 0.85), Burp Suite (High, 0.85), Firewalls (High, 0.90), Vulnerability Assessment (High, 0.95), Threat Analysis (High, 0.90), Bash (Medium, 0.75)

---

## 3. How Skills Relate to Career Classification

1. **Shared Foundation vs Distinct Specialization:** General skills (e.g., Git, Python, SQL) are present across multiple roles, acting as baseline requirements.
2. **Career Discriminators:** The presence of specialized clusters (e.g., `Wireshark` + `SIEM` for Cybersecurity vs `Kubernetes` + `Terraform` for DevOps vs `React` + `Tailwind` for Frontend) provides the mathematical basis upon which the TF-IDF vectorizer and logistic regression weights distinguish candidate resumes.
