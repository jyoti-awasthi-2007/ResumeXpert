# Model Card: ResumeXpert Career Classifier

## Model Overview
- **Model Name:** ResumeXpert Career Classifier (Offline Demonstration Model)
- **Model Version:** 1.1.0
- **Model Architecture:** TF-IDF Vectorizer (1,594 unigrams/bigrams) + Multinomial Logistic Regression (L2 penalty, L-BFGS solver)
- **Release Date:** October 2026
- **License:** Educational / Demonstration Use Only
- **Primary Framework:** scikit-learn (Python 3.12)
- **Serialization Format:** joblib (`artifacts/career_classifier.joblib`, 144 KB)

---

## Intended Use
- **Primary Intended Use:** Academic demonstration of a supervised machine learning workflow for classifying candidate resume text into technical career categories.
- **Intended Users:** Engineering faculty, project examiners, students, and software developers evaluating ML pipelines.
- **Out-of-Scope Uses:**
  - Automated hiring or rejection of job candidates.
  - Legal or employment compliance decisions.
  - Real-world production deployment without extensive retraining on verified industry datasets.
  - Integration into the deployed ResumeXpert application (which operates independently on its configured API pipeline).

---

## Data & Preprocessing
- **Training Dataset:** `dataset/synthetic_resume_career_dataset.csv`
- **Dataset Nature:** Programmatically generated synthetic dataset based on 8 technical career profiles.
- **Total Records:** 1,600 samples (200 samples per class; perfectly balanced).
- **Split Ratio:** Stratified 80% Train (1,280 samples) / 20% Test (320 samples).
- **Random Seed:** 42 (deterministic reproducibility).
- **Preprocessing:**
  - Lowercasing and tokenization.
  - Extraction of unigrams and bigrams (`ngram_range=(1, 2)`).
  - Frequency bounds: `min_df=2`, `max_df=0.95`.
  - Sublinear term frequency scaling ($1 + \log(\text{TF})$).
  - Euclidean L2 vector normalization.

---

## Evaluation Summary
Evaluated on 320 held-out test samples across 8 career classes (40 samples per class):
- **Accuracy:** 1.0000 (100.00%)
- **Macro Precision:** 1.0000
- **Macro Recall:** 1.0000
- **Macro F1 Score:** 1.0000
- **Weighted F1 Score:** 1.0000

*Academic Disclaimer:* The 100% test accuracy reflects the distinct keyword clusters in the controlled synthetic dataset. It should not be interpreted as benchmark accuracy on noisy real-world industry resumes.

---

## Ethical & Fairness Considerations
- **Demographic Neutrality:** The synthetic dataset contains no personal demographic identifiers (no names, gender, age, race, or geographic markers).
- **Keyword Reliance:** As a bag-of-words model, it does not assess candidate depth or experience quality beyond keyword presence.
