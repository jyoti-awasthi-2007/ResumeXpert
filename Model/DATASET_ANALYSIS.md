# Resume Dataset Analysis

> **Artifact References:**  
> - Dataset CSV: [`dataset/synthetic_resume_career_dataset.csv`](file:///dataset/synthetic_resume_career_dataset.csv)  
> - Distribution Chart: [`artifacts/class_distribution.png`](file:///artifacts/class_distribution.png)

---

## 1. Dataset Overview

This dataset was generated programmatically for the ResumeXpert offline career-classification proof-of-concept. It simulates candidate profiles across 8 technical career tracks.

| Property | Value | Description |
|---|---|---|
| **Total Rows** | **1,600** | Number of individual candidate resume samples |
| **Total Columns** | **3** | Attributes per record |
| **Missing Values (NaN/Null)** | **0** | Complete dataset with no missing fields |
| **Duplicate Rows** | **0** | All records have unique IDs and randomized profiles |
| **Target Variable** | `career` | Multiclass label representing the target career |
| **Input Feature** | `resume_text` | Unstructured text combining education, skills, projects, and experience |
| **Identifier** | `id` | Unique synthetic identifier (e.g., `DAT-0001`, `CYB-0042`) |

---

## 2. Class Distribution Table

| Class No. | Career Category | Total Samples | Percentage of Dataset | Train Split (80%) | Test Split (20%) |
|:---:|:---|:---:|:---:|:---:|:---:|
| 1 | Backend Developer | 200 | 12.50% | 160 | 40 |
| 2 | Cybersecurity Analyst | 200 | 12.50% | 160 | 40 |
| 3 | Data Analyst | 200 | 12.50% | 160 | 40 |
| 4 | Data Scientist | 200 | 12.50% | 160 | 40 |
| 5 | DevOps Engineer | 200 | 12.50% | 160 | 40 |
| 6 | Frontend Developer | 200 | 12.50% | 160 | 40 |
| 7 | Full Stack Developer | 200 | 12.50% | 160 | 40 |
| 8 | Machine Learning Engineer | 200 | 12.50% | 160 | 40 |
| **Summary** | **8 Classes** | **1,600** | **100.00%** | **1,280** | **320** |

### Key Observations on Distribution:
- **Perfect Balance:** Each class contains exactly 200 samples (12.5% of total dataset).
- **No Class Imbalance:** Unlike many raw scraping datasets where one career may dominate 60% of records, this balanced distribution eliminates majority-class bias and ensures the classifier learns decision boundaries for all careers equally.
- **Stratified Partitioning:** Stratified splitting guarantees that both the training set (1,280 samples) and test set (320 samples) preserve the exact 12.5% per-class ratio.

---

## 3. Resume Text Composition & Generation Mechanics

Each resume text entry in `resume_text` is dynamically constructed using five modular components:

1. **Education Component:** Drawn randomly from 5 realistic degree programs:
   - *B.Tech Computer Engineering*
   - *B.E. Computer Science*
   - *B.Sc. Computer Science*
   - *M.Tech Artificial Intelligence*
   - *Engineering student with software development experience*
2. **Core Technical Skills:** Drawn without replacement from the career profile's defined core skill set (e.g., 4 to 7 skills).
3. **Supporting Technical Skills:** Drawn without replacement from supporting tools and libraries (1 to 4 skills).
4. **Controlled Cross-Career Noise:**
   - 80% probability of including a general engineering skill (e.g., Git, Linux, Docker, REST API, Communication, Agile).
   - 35% probability of sampling a core skill from an entirely different career to mimic real candidates with multidisciplinary experience.
5. **Practical Experience & Projects:**
   - Experience phrases ranging from internship level to 5 years of practical experience.
   - Realistic project descriptions specific to the domain.

---

## 4. Visual Representation

The class distribution plot [`artifacts/class_distribution.png`](file:///artifacts/class_distribution.png) visualizes this balanced structure horizontally with exact counts and percentages per bar.
