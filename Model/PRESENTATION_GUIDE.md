# ResumeXpert — 15-Slide Technical Presentation Guide

This guide provides a concise, slide-by-slide script for presenting the ResumeXpert offline machine learning model during faculty defense and project reviews.

---

### Slide 1: Problem Statement
- **Topic:** Automated Career Alignment from Resume Text
- **Speaking Points:**
  - Candidates struggle to objectively assess how their technical skills map to specific industry job roles.
  - Manual resume screening is slow and prone to human bias.
  - We developed a supervised ML prototype to classify unstructured resume text into standardized career tracks.
- **Key Boundary:** *"This is a separate offline proof-of-concept ML model developed for academic demonstration and evaluation."*

---

### Slide 2: Resume Dataset
- **Topic:** Dataset Architecture & Integrity
- **Speaking Points:**
  - 1,600 total resume samples stored in `dataset/synthetic_resume_career_dataset.csv`.
  - Programmatically generated with fixed seed (`SEED = 42`) for 100% deterministic reproducibility.
  - Zero missing values, zero duplicates, and zero full career titles in input text.

---

### Slide 3: Career Classes & Balance
- **Topic:** 8 Balanced Career Classes
- **Speaking Points:**
  - 8 classes: Backend Developer, Cybersecurity Analyst, Data Analyst, Data Scientist, DevOps Engineer, Frontend Developer, Full Stack Developer, Machine Learning Engineer.
  - Perfectly balanced: exactly 200 samples per class (12.50% each).
  - *Show:* [`artifacts/class_distribution.png`](file:///artifacts/class_distribution.png).

---

### Slide 4: Skills Dataset Ontology
- **Topic:** Technical Skills Catalog
- **Speaking Points:**
  - 87 unique technical skills across 9 categories in `dataset/skills_dataset.csv`.
  - Includes standard names, search aliases, and role descriptions.
  - Covers Web/Frontend (12), Cloud/DevOps (12), AI/ML (11), Data Analysis (11), Security (11), Languages (9), Backend (8), Tools (8), and Databases (5).

---

### Slide 5: Assessment Question Dataset
- **Topic:** Competency Verification Question Bank
- **Speaking Points:**
  - 48 multiple-choice questions in `dataset/assessment_questions.csv`.
  - Exactly 6 questions per career (48 total) covering 40 distinct technical skills.
  - Balanced across 3 difficulty tiers: 16 Beginner, 16 Advanced, and 16 Expert questions with full academic explanations.

---

### Slide 6: NLP Processing Pipeline
- **Topic:** Text Preprocessing & Cleaning
- **Speaking Points:**
  - Converts raw text to lowercase to prevent casing mismatches (`Python` vs `python`).
  - Extracts unigrams and bigrams (`ngram_range=(1, 2)`).
  - Prunes rare outliers (`min_df=2`) and corpus-wide boilerplate (`max_df=0.95`).
  - Implements sublinear frequency scaling ($1 + \log(\text{TF})$) to balance word frequency impact.

---

### Slide 7: TF-IDF Feature Extraction
- **Topic:** Converting Text to Numerical Vectors
- **Speaking Points:**
  - Generates a 1,594-dimensional numerical feature space.
  - Multiplies Term Frequency (TF) by Inverse Document Frequency (IDF) to amplify specialized keywords (`wireshark`, `pytorch`, `kubernetes`).
  - Applies L2 Euclidean vector normalization to ensure fair evaluation across varying resume lengths.

---

### Slide 8: Classification Algorithm
- **Topic:** Multinomial Logistic Regression
- **Speaking Points:**
  - Linear classifier with L2 Ridge regularization ($C=1.0$) and L-BFGS optimization.
  - Well-suited for high-dimensional sparse text vectors (1,594 features).
  - Provides full white-box interpretability: learned weights directly reveal feature importance.
  - Uses the Softmax activation function to output well-calibrated class probabilities.

---

### Slide 9: Training Process
- **Topic:** Stratified Splitting & Leakage Prevention
- **Speaking Points:**
  - Stratified 80/20 train/test split: 1,280 training samples (160 per class) and 320 testing samples (40 per class).
  - TF-IDF vocabulary is fitted strictly on `X_train` to eliminate data leakage.
  - Fast convergence: trains in under 2 seconds on standard CPU hardware.
  - *Show:* [`artifacts/learning_curve.png`](file:///artifacts/learning_curve.png) confirming convergence without overfitting.

---

### Slide 10: Standard Evaluation Metrics
- **Topic:** Performance on Held-Out Test Split
- **Speaking Points:**
  - Evaluated on 320 held-out test samples.
  - Standard Test Accuracy: **100.00% (320 / 320 correct)**.
  - Macro Precision: 1.0000 | Macro Recall: 1.0000 | Macro F1: 1.0000.
  - *Show:* [`artifacts/per_class_metrics.png`](file:///artifacts/per_class_metrics.png).

---

### Slide 11: Confusion Matrix Analysis
- **Topic:** Evaluating Classification Errors
- **Speaking Points:**
  - *Show:* [`artifacts/confusion_matrix.png`](file:///artifacts/confusion_matrix.png).
  - $8 \times 8$ matrix shows 40 true positives on the diagonal for all 8 classes.
  - Zero off-diagonal misclassifications on this controlled evaluation set.
  - Discuss potential real-world overlap (e.g., Data Scientist vs ML Engineer).

---

### Slide 12: Independent Challenge Evaluation
- **Topic:** Realism Check on Independent Challenge Set
- **Speaking Points:**
  - Evaluated on 48 independent, multi-skilled, interdisciplinary resumes (`dataset/challenge_resume_dataset.csv`).
  - Model was **NEVER trained or fine-tuned** on this challenge set.
  - Independent Challenge Accuracy: **93.75% (45 / 48 correct)**.
  - *Show:* [`artifacts/challenge_accuracy.png`](file:///artifacts/challenge_accuracy.png) comparing Standard (100.00%) vs Challenge (93.75%).

---

### Slide 13: Live Prediction Demonstration
- **Topic:** Real-Time Inference Demo
- **Live Action:** Execute terminal command:
  ```powershell
  python predict.py "Python, SQL, Pandas, NumPy, Scikit-learn, building machine learning models, statistical analysis"
  ```
- **Show Outputs:**
  - Predicted Career: `Data Scientist`
  - Confidence: `49.78%`
  - Top 3 Rankings: Data Scientist (49.78%), ML Engineer (19.52%), Data Analyst (8.44%).
  - Top features: `learn`, `scikit`, `scikit learn`, `machine`, `machine learning`.
  - *Show:* [`artifacts/prediction_probabilities.png`](file:///artifacts/prediction_probabilities.png).

---

### Slide 14: Model Limitations
- **Topic:** Academic Honesty & Constraints
- **Speaking Points:**
  - Synthetic training data uses clean keyword clusters; real resumes have formatting and OCR noise.
  - TF-IDF operates as a bag-of-words and cannot assess narrative context or candidate seniority.
  - Closed-world assumption: only 8 career paths are recognized.
  - Model is an educational proof-of-concept, not an automated hiring decision tool.

---

### Slide 15: Future Scope & Production Roadmap
- **Topic:** Steps Toward Production Deployment
- **Speaking Points:**
  - Expand dataset to 20,000+ real, anonymized resumes across 50+ career roles.
  - Incorporate multi-expert human annotation to verify ground truth labels.
  - Upgrade from bag-of-words TF-IDF to transformer embeddings (e.g., Sentence-BERT).
  - Implement an out-of-distribution rejection class for non-technical resumes.
  - Conduct demographic fairness and bias audits prior to deployment.
