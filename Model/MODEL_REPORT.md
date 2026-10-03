## 1. Model Purpose

The primary objective of this offline machine learning model is **automated career classification from unstructured resume text**.

Given a candidate's resume text containing technical competencies, coursework, past experience, and project descriptions, the model predicts the most appropriate career category among 8 standardized technical tracks and computes confidence probabilities across all supported classes.

---

## 2. Machine Learning Problem

- **Discipline:** Natural Language Processing (NLP) & Supervised Machine Learning
- **Problem Formulation:** Multi-Class Classification ($K = 8$ mutually exclusive classes)
- **Input Feature Space:** High-dimensional sparse numerical vector of n-gram term frequencies (1,594 dimensions)
- **Target Output:** Single categorical career label $\hat{y} \in \{1, \dots, 8\}$ along with a normalized posterior probability vector $P(y = k \mid X)$

---

## 3. Algorithm Used

The model is implemented as a scikit-learn `Pipeline` composed of two stages:
1. **Feature Extractor:** `TfidfVectorizer` (Term Frequency–Inverse Document Frequency)
2. **Estimator:** `LogisticRegression` (Multinomial Logistic Regression with L2 Ridge Regularization and L-BFGS quasi-Newton solver)

---

## 4. Why This Algorithm

1. **Efficiency with High-Dimensional Sparse Text:** Resumes activate only 30–80 terms out of a 1,594-term vocabulary (over 95% sparsity). Logistic Regression with L2 regularization converges rapidly on sparse feature representations without heavy memory overhead.
2. **Full Interpretability (White-Box Modeling):** Unlike deep neural networks, each feature has an explicit learned weight ($w_{k, i}$). We can directly inspect the exact terms that positively or negatively influence any prediction.
3. **Calibrated Posterior Probabilities:** Logistic Regression uses the Softmax function to produce well-calibrated probabilities, enabling realistic multi-career recommendations (e.g., Top 3 career rankings).
4. **Computational Speed:** The pipeline trains in under 2 seconds on standard CPU hardware and performs inference in under 15 milliseconds. The serialized model artifact (`artifacts/career_classifier.joblib`) is only **144 KB**.
5. **Alternative Trade-Offs:**
   - *Naive Bayes:* Assumes strict word independence ($P(w_1, w_2) = P(w_1)P(w_2)$), which breaks on coupled technical terms like `scikit` and `learn`.
   - *Linear SVM:* Good margin separation, but requires Platt scaling to produce calibrated probabilities.
   - *Random Forest / XGBoost:* Struggles with sparse 1,594-dimensional text data where most features are zero in any given sample.
   - *Transformers (BERT / RoBERTa):* Exceeds 400 MB in size and requires GPU acceleration for inference, which is disproportionate for keyword-focused career classification.

---

## 5. Resume Dataset

The primary training dataset is located at [`dataset/synthetic_resume_career_dataset.csv`](file:///dataset/synthetic_resume_career_dataset.csv):
- **Total Rows:** 1,600 candidate profiles
- **Total Columns:** 3 (`id`, `resume_text`, `career`)
- **Missing Values:** 0
- **Duplicate Rows:** 0
- **Feature Column:** `resume_text` (unstructured string containing candidate profile)
- **Target Column:** `career` (categorical label)
- **Nature:** Synthetically generated demonstration dataset using randomized profiles with fixed seed `SEED = 42`.

---

## 6. Classes

The model classifies resumes into **8 technical career categories**:
1. **Backend Developer**
2. **Cybersecurity Analyst**
3. **Data Analyst**
4. **Data Scientist**
5. **DevOps Engineer**
6. **Frontend Developer**
7. **Full Stack Developer**
8. **Machine Learning Engineer**

---

## 7. Dataset Distribution

| Class No. | Career Class | Total Samples | Percentage | Train Samples (80%) | Test Samples (20%) |
|:---:|:---|:---:|:---:|:---:|:---:|
| 1 | Backend Developer | 200 | 12.50% | 160 | 40 |
| 2 | Cybersecurity Analyst | 200 | 12.50% | 160 | 40 |
| 3 | Data Analyst | 200 | 12.50% | 160 | 40 |
| 4 | Data Scientist | 200 | 12.50% | 160 | 40 |
| 5 | DevOps Engineer | 200 | 12.50% | 160 | 40 |
| 6 | Frontend Developer | 200 | 12.50% | 160 | 40 |
| 7 | Full Stack Developer | 200 | 12.50% | 160 | 40 |
| 8 | Machine Learning Engineer | 200 | 12.50% | 160 | 40 |
| **Total** | **8 Classes** | **1,600** | **100.00%** | **1,280** | **320** |

*Visual reference:* [`artifacts/class_distribution.png`](file:///artifacts/class_distribution.png) shows the sample distribution across all 8 classes.

---

## 8. Data Preprocessing

Text cleaning is automated within the pipeline:
1. **Case Normalization:** Converts all text to lowercase to ensure consistency (`Python` vs `python`).
2. **Tokenization & N-Grams:** Extracts unigrams and bigrams (`ngram_range=(1, 2)`).
3. **Frequency Filtering:**
   - `min_df=2`: Prunes rare tokens appearing in fewer than 2 resumes.
   - `max_df=0.95`: Discards corpus-wide boilerplate appearing in over 95% of resumes.
4. **Sublinear TF Scaling:** Computes term frequency as $1 + \log(\text{TF})$ to prevent repeated words from dominating.
5. **L2 Normalization:** Normalizes feature vectors to unit length so resume length does not bias classification.

---

## 9. TF-IDF Feature Extraction

- **Vocabulary Size:** Exactly **1,594 features** (unigrams and bigrams).
- **Mathematical Formula:**
  $$\text{TF-IDF}(t, d, D) = (1 + \log(\text{TF}(t, d))) \times \left(\log\frac{1 + N}{1 + \text{DF}(t)} + 1\right)$$
- Domain-defining terms (`pytorch`, `wireshark`, `kubernetes`, `tableau`) receive high IDF weights, while generic words (`worked`, `experience`, `software`) receive low weights.

---

## 10. Training Process

1. **Stratified Split:** 80% Train (1,280 samples) and 20% Test (320 samples) using `random_state=42`. Stratification guarantees exactly 40 test samples per class.
2. **No Data Leakage:** The `TfidfVectorizer` fits vocabulary and IDF weights strictly on `X_train`. The test set `X_test` is transformed using the fitted training vocabulary.
3. **Optimization:** Multinomial Logistic Regression fits weight vectors for all 8 classes simultaneously using the L-BFGS solver over up to 2,500 iterations.
4. **Learning Curve:** Cross-validated learning curve evaluation confirms steady convergence between training score and cross-validation score without divergence (*visual reference:* [`artifacts/learning_curve.png`](file:///artifacts/learning_curve.png)).

---

## 11. Model Parameters

| Component | Hyperparameter | Actual Value | Purpose |
|---|---|:---:|---|
| Split | `test_size` | `0.20` | Allocates 80% train / 20% test |
| Split | `stratify` | `df['career']` | Preserves 12.5% per-class balance |
| Split | `random_state` | `42` | Ensures 100% deterministic reproduction |
| TF-IDF | `ngram_range` | `(1, 2)` | Captures single words and two-word phrases |
| TF-IDF | `min_df` / `max_df` | `2` / `0.95` | Eliminates outliers and common boilerplate |
| TF-IDF | `sublinear_tf` | `True` | Dampens repeated keyword impact |
| Classifier | `C` | `1.0` | Inverse regularization strength (L2 penalty) |
| Classifier | `solver` | `'lbfgs'` | Quasi-Newton optimization algorithm |
| Classifier | `max_iter` | `2500` | Ensures mathematical convergence |
| Classifier | `class_weight` | `'balanced'` | Balances class influence |

---

## 12. Standard Test Results

Evaluated on the held-out 20% test split (320 samples; 40 per class):

| Metric | Score | Percentage |
|---|:---:|:---:|
| **Accuracy** | `1.0000` | **100.00%** |
| **Macro Precision** | `1.0000` | **100.00%** |
| **Macro Recall** | `1.0000` | **100.00%** |
| **Macro F1 Score** | `1.0000` | **100.00%** |
| **Weighted Precision** | `1.0000` | **100.00%** |
| **Weighted Recall** | `1.0000` | **100.00%** |
| **Weighted F1 Score** | `1.0000` | **100.00%** |

---

## 13. Precision, Recall and F1

Extracted from [`artifacts/classification_report.csv`](file:///artifacts/classification_report.csv):

| Career Class | Precision | Recall | F1-Score | Support |
|---|:---:|:---:|:---:|:---:|
| Backend Developer | 1.0000 | 1.0000 | 1.0000 | 40 |
| Cybersecurity Analyst | 1.0000 | 1.0000 | 1.0000 | 40 |
| Data Analyst | 1.0000 | 1.0000 | 1.0000 | 40 |
| Data Scientist | 1.0000 | 1.0000 | 1.0000 | 40 |
| DevOps Engineer | 1.0000 | 1.0000 | 1.0000 | 40 |
| Frontend Developer | 1.0000 | 1.0000 | 1.0000 | 40 |
| Full Stack Developer | 1.0000 | 1.0000 | 1.0000 | 40 |
| Machine Learning Engineer | 1.0000 | 1.0000 | 1.0000 | 40 |

*Visual reference:* [`artifacts/per_class_metrics.png`](file:///artifacts/per_class_metrics.png) displays precision, recall, and F1 across all 8 classes.

---

## 14. Confusion Matrix

The $8 \times 8$ confusion matrix ([`artifacts/confusion_matrix.csv`](file:///artifacts/confusion_matrix.csv) and [`artifacts/confusion_matrix.png`](file:///artifacts/confusion_matrix.png)) confirms:
- **Main Diagonal:** 40 correct predictions for each of the 8 classes (320 / 320 total).
- **Off-Diagonal Values:** 0 misclassifications on this controlled evaluation split.

---

## 15. Important Features

Top positive linear coefficients from [`artifacts/top_features_by_class.csv`](file:///artifacts/top_features_by_class.csv) and [`artifacts/top_features_by_class.png`](file:///artifacts/top_features_by_class.png):
- **Backend Developer:** `postgresql` (+1.76), `fastapi` (+1.54), `api` (+1.34), `authentication` (+1.34)
- **Cybersecurity Analyst:** `security` (+1.58), `incident` (+1.54), `network` (+1.50), `analysis` (+1.47)
- **Data Analyst:** `tableau` (+1.63), `data` (+1.61), `reporting` (+1.59), `excel` (+1.56)
- **Data Scientist:** `statistics` (+1.46), `numpy` (+1.45), `seaborn` (+1.18), `feature` (+1.13)
- **DevOps Engineer:** `ci` (+1.86), `ci cd` (+1.86), `infrastructure` (+1.73), `terraform` (+1.70)
- **Frontend Developer:** `interfaces` (+1.50), `vite` (+1.46), `tailwind` (+1.44), `user` (+1.42)
- **Full Stack Developer:** `mongodb` (+1.71), `applications` (+1.61), `web applications` (+1.61), `full stack` (+1.54)
- **Machine Learning Engineer:** `pytorch` (+1.81), `learning` (+1.62), `deep` (+1.60), `deep learning` (+1.60)

---

## 16. Independent Challenge Evaluation

To test true generalization beyond the original synthetic dataset, an independent evaluation dataset ([`dataset/challenge_resume_dataset.csv`](file:///dataset/challenge_resume_dataset.csv)) was created:
- **Challenge Set Size:** 48 realistic, held-out resume profiles (6 per career class).
- **Properties:** Realistic multi-disciplinary profiles with overlapping skills (e.g., Python + SQL + Docker + React + FastAPI), varied sentence structures, and zero career labels in the text.
- **Training Integrity:** The model was **NEVER trained or fine-tuned** on this challenge dataset.

### Challenge Results (from `artifacts/challenge_predictions.csv`):
- **Challenge Accuracy:** **93.75% (45 / 48 correct)**
- **Mismatches (3 out of 48):**
  1. `CHAL-MLE-02` (Expected MLE $\rightarrow$ Predicted DevOps, Top Prob: 36.96%): Profile combined deep learning with heavy Kubernetes and cloud infrastructure orchestration.
  2. `CHAL-FSD-04` (Expected Full Stack $\rightarrow$ Predicted Backend, Top Prob: 30.49%): Profile emphasized TypeScript ORMs, Express microservices, and Docker.
  3. `CHAL-FED-04` (Expected Frontend $\rightarrow$ Predicted Full Stack, Top Prob: 42.38%): Profile emphasized full REST API consumption and SPA state architecture.
- **Accuracy Comparison Chart:** [`artifacts/challenge_accuracy.png`](file:///artifacts/challenge_accuracy.png) visually compares Standard Test Accuracy (100.00%) vs Independent Challenge Accuracy (93.75%).

---

## 17. Prediction Demonstration

The prediction script ([`predict.py`](file:///predict.py)) supports both interactive and CLI modes.

### Prediction Output Format:
```text
==================================================
RESUMEXPERT ML PREDICTION
==================================================

Predicted Career:
  Data Scientist

Probability:
  49.78% (0.4978)

Top 3 Predictions:

  1. Data Scientist             -- 49.78%
  2. Machine Learning Engineer  -- 19.52%
  3. Data Analyst               --  8.44%

Top Related TF-IDF Features:
  - learn
  - scikit
  - scikit learn
  - machine
  - machine learning

==================================================
```
*Visual reference:* [`artifacts/prediction_probabilities.png`](file:///artifacts/prediction_probabilities.png) displays the probability distribution across all 8 classes for a representative profile.

---

## 18. Skills Dataset

Located at [`dataset/skills_dataset.csv`](file:///dataset/skills_dataset.csv):
- **Total Skills:** 87 unique technical skills across 9 categories
- **Categories:**
  1. Web & Frontend (12 skills)
  2. Cloud & DevOps (12 skills)
  3. AI & Machine Learning (11 skills)
  4. Data Analysis & BI (11 skills)
  5. Cybersecurity (11 skills)
  6. Programming Languages (9 skills)
  7. Backend & APIs (8 skills)
  8. Core Engineering & Collaboration (8 skills)
  9. Databases & Storage (5 skills)
- **Features:** Each skill includes a unique ID, canonical name, domain category, search aliases, and role description.

---

## 19. Career-Skill Mapping

Located at [`dataset/career_skill_mapping.csv`](file:///dataset/career_skill_mapping.csv):
- **Total Careers:** 8
- **Total Mappings:** 110 competency links
- **Average Skills per Career:** 13.75 skills (Min: 13, Max: 14)
- **Core Skills:** Weighted 0.85 to 1.00 (High Priority)
- **Supporting Skills:** Weighted 0.65 to 0.85 (Medium/Low Priority)

---

## 20. Assessment Question Dataset

Located at [`dataset/assessment_questions.csv`](file:///dataset/assessment_questions.csv):
- **Total Questions:** 48 multiple-choice questions
- **Career Breakdown:** Exactly 6 questions per career (8 careers $\times$ 6 = 48)
- **Difficulty Breakdown:** Exactly 16 Beginner, 16 Advanced, and 16 Expert questions
- **Skills Evaluated:** 40 distinct technical skills
- **Structure:** 11 columns including `question_id`, `career`, `skill`, `difficulty`, `question`, 4 options, `correct_answer`, and `explanation`.

---

## 21. Limitations

1. **Synthetic Training Baseline:** The model was trained on a synthetic dataset generated with defined skill templates. The 100% test accuracy proves the pipeline is mathematically bug-free, but **does not represent real-world performance**.
2. **Realistic Challenge Performance:** When evaluated on the independent challenge dataset with overlapping and ambiguous skills, the model achieved **93.75% accuracy**, demonstrating realistic multi-class boundary behavior.
3. **Closed-World Assumption:** The model maps inputs to one of the 8 hardcoded categories. Resumes from other fields (e.g., Mobile Development, Hardware Engineering) will be forced into the nearest available class.
4. **Lack of Sentence Semantics:** TF-IDF weights words based on frequency and rarity, but cannot discern candidate seniority or narrative context (e.g., "aspiring to learn Python" vs "10 years leading Python teams").

---

## 22. Production Integration Status

1. **Strictly Standalone:** This model is **NOT integrated into the deployed ResumeXpert application**.
2. **Production App Operations:** The live ResumeXpert web application uses its FastAPI backend and configured AI/LLM API pipelines for resume analysis, skill extraction, and career suggestions.
3. **No Automatic Hiring Decisions:** This model is purely an educational proof-of-concept and should not be used as an automated hiring filter.
