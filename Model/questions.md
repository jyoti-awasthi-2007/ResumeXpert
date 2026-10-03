# ResumeXpert — Faculty Viva Questions & Answers

This document contains 38 high-value, technically accurate questions and concise answers prepared specifically for college viva defense and faculty project reviews.

---

## SECTION A — MODEL BASICS

### Q1: What is the purpose of this model?
**A:** The model automatically analyzes unstructured resume text to predict the candidate's most suitable technical career path and calculate confidence probabilities across 8 career tracks.

### Q2: What problem does the model solve?
**A:** It addresses career-skill misalignment by eliminating manual, subjective resume screening and mapping candidate competencies to standardized industry roles.

### Q3: Is this supervised or unsupervised learning?
**A:** It is **Supervised Learning**. The model is trained on labeled pairs of `(resume_text, career_label)`.

### Q4: Is this classification or regression?
**A:** It is **Classification** because the target variable is a discrete category (a career title), not a continuous numerical value.

### Q5: Is this binary or multiclass classification?
**A:** It is **Multiclass Classification** because there are 8 mutually exclusive target classes.

### Q6: What is the input to the model?
**A:** Raw, unstructured resume text containing skills, education, experience, and project descriptions.

### Q7: What is the output of the model?
**A:** The predicted career class, its confidence probability, and a ranked probability distribution across all 8 classes (e.g., Top 3 career matches).

### Q8: How many classes are there and what are their names?
**A:** There are **8 classes**:
1. Backend Developer
2. Cybersecurity Analyst
3. Data Analyst
4. Data Scientist
5. DevOps Engineer
6. Frontend Developer
7. Full Stack Developer
8. Machine Learning Engineer

---

## SECTION B — DATASET

### Q9: How many resume samples are in the training dataset?
**A:** Exactly **1,600 samples** in `dataset/synthetic_resume_career_dataset.csv`.

### Q10: How many samples belong to each class?
**A:** Exactly **200 samples per class** (12.50% each), making the dataset perfectly balanced.

### Q11: Is the dataset real or synthetic?
**A:** It is a **synthetic demonstration dataset** generated programmatically using domain skill templates and fixed random seed 42 to ensure 100% reproducibility.

### Q12: Why was a synthetic dataset used instead of scraped data?
**A:** To create a controlled, reproducible proof-of-concept without scraping copyrighted resumes or violating data privacy regulations (GDPR, DPDP Act).

### Q13: How was the dataset divided into training and testing?
**A:** Using an **80/20 stratified split**:
- **Training Set:** 1,280 samples (80%; 160 per class)
- **Testing Set:** 320 samples (20%; 40 per class)

### Q14: Why was stratified splitting used?
**A:** Stratification ensures that each class maintains the exact same proportion (12.50%) in both the training set and the test set, preventing split bias.

### Q15: Did you check for duplicates and target leakage?
**A:** Yes. There are 0 duplicate rows. Full career titles do not appear in the input text, though some role-specific keywords naturally appear in project descriptions.

---

## SECTION C — NLP & TF-IDF

### Q16: What is NLP?
**A:** Natural Language Processing (NLP) is the subfield of AI focused on enabling computers to understand, process, and extract meaningful features from human language.

### Q17: What is TF-IDF?
**A:** **Term Frequency–Inverse Document Frequency**. It measures how important a word is by multiplying its frequency in a specific resume (TF) by its rarity across the entire dataset (IDF), giving high weight to specialized skills and low weight to common words.

### Q18: What is a unigram and a bigram?
**A:**
- **Unigram:** A single token/word (e.g., `python`, `docker`).
- **Bigram:** A contiguous sequence of two words (e.g., `machine learning`, `deep learning`, `ci cd`).

### Q19: What is the TF-IDF vocabulary size?
**A:** Exactly **1,594 features** (unigrams and bigrams) meeting the document frequency thresholds.

### Q20: What preprocessing is performed?
**A:** Text lowercasing, unigram and bigram extraction (`ngram_range=(1, 2)`), sublinear frequency scaling ($1 + \log(\text{TF})$), frequency pruning (`min_df=2`, `max_df=0.95`), and L2 unit-norm vector scaling.

---

## SECTION D — ALGORITHM

### Q21: Which machine learning algorithm is used?
**A:** **Multinomial Logistic Regression** with L2 Ridge regularization and the L-BFGS solver, bundled with the TF-IDF vectorizer inside a single scikit-learn `Pipeline`.

### Q22: Why was Logistic Regression selected over deep learning?
**A:** Because resume classification creates high-dimensional sparse vectors (1,594 features). Logistic Regression handles sparse text efficiently, trains in seconds, provides fully interpretable linear weights, and directly outputs calibrated probabilities via Softmax.

### Q23: Can Logistic Regression perform multiclass classification?
**A:** Yes. It trains a weight vector for each class and uses the **Softmax function** to normalize scores into a probability distribution that sums to 1.0 (100%).

### Q24: What is regularization and what solver was used?
**A:** We used **L2 Ridge Regularization** ($C = 1.0$) to penalize excessively large weights and prevent overfitting. The solver is **L-BFGS** (Limited-memory Broyden–Fletcher–Goldfarb–Shanno), a quasi-Newton optimization algorithm.

### Q25: What other algorithms could be used?
**A:** Multinomial Naive Bayes, Linear Support Vector Machines (LinearSVC), Random Forests, or Transformer-based models like Sentence-BERT.

---

## SECTION E — EVALUATION & ACCURACY

### Q26: What is the standard test accuracy?
**A:** On the held-out 20% test split (320 samples), the standard test accuracy is **100.00% (320/320 correct)**.

### Q27: Why is the standard accuracy 100%? Does it mean the model is perfect?
**A:** **No, it does NOT mean real-world perfection.** The 100% accuracy occurs because the synthetic training dataset uses distinct technical keyword clusters that are cleanly linearly separable in the 1,594-dimensional TF-IDF space. It validates that the pipeline code is bug-free, but cannot be claimed as real-world accuracy.

### Q28: What is the independent challenge accuracy?
**A:** When tested on our separate realistic challenge dataset of 48 complex, multi-skilled resumes, the model achieved **93.75% accuracy (45/48 correct)**, demonstrating realistic classification behavior.

### Q29: What are Precision, Recall, and F1-Score?
**A:**
- **Precision:** $\frac{\text{True Positives}}{\text{True Positives} + \text{False Positives}}$ (minimizes false alarms).
- **Recall:** $\frac{\text{True Positives}}{\text{True Positives} + \text{False Negatives}}$ (minimizes missed candidates).
- **F1-Score:** Harmonic mean of Precision and Recall ($2 \times \frac{P \times R}{P + R}$).

### Q30: What is a confusion matrix?
**A:** An $N \times N$ matrix comparing actual classes (rows) against predicted classes (columns). The main diagonal represents correct predictions, and off-diagonal cells represent misclassifications.

---

## SECTION F — PREDICTION

### Q31: How does a new resume get predicted?
**A:** The text is lowercased, converted into a 1,594-dimensional TF-IDF vector, multiplied by the trained linear weights ($W \cdot X + b$), and converted into 8 probabilities using Softmax. The class with the highest probability is selected.

### Q32: What does the prediction probability mean?
**A:** It reflects the model's mathematical confidence based on how strongly the candidate's keywords align with the learned decision boundary for each career.

### Q33: Why can one resume have multiple non-zero career probabilities?
**A:** Because modern technical skills naturally overlap. For example, a candidate with Python, SQL, and Docker may have a 52% probability for Backend Developer, 30% for Full Stack Developer, and 12% for Data Scientist.

---

## SECTION G — SKILLS & ASSESSMENT

### Q34: How many skills and questions are in the datasets?
**A:**
- **Skills Dataset:** 87 unique technical skills across 9 categories in `dataset/skills_dataset.csv`.
- **Assessment Dataset:** 48 multiple-choice questions across 3 difficulty tiers in `dataset/assessment_questions.csv`.
- **Career-Skill Mappings:** 110 mappings (13.75 avg per career) in `dataset/career_skill_mapping.csv`.

### Q35: What do Beginner, Advanced, and Expert assessment levels test?
**A:**
- **Beginner (16 Qs):** Fundamental syntax, core definitions, and basic concepts.
- **Advanced (16 Qs):** Practical implementation, library APIs, edge cases, and debugging.
- **Expert (16 Qs):** High-scale architecture, trade-offs, reliability, and security.

---

## SECTION H — LIMITATIONS & PRODUCTION

### Q36: What are the main limitations of this model?
**A:**
1. Trained on synthetic data with clean keyword patterns.
2. Evaluates bag-of-words keyword frequency, not true sentence semantics or candidate seniority.
3. Operates under a closed world of 8 hardcoded classes.
4. Not designed for automated hiring decisions.

### Q37: Is this model currently integrated into the production app?
**A:** **No.** It is maintained separately as an offline educational proof-of-concept. The deployed ResumeXpert application uses its existing FastAPI backend and AI/LLM API pipeline.

### Q38: What would be required to deploy this model in real production?
**A:**
1. Collecting 20,000+ real, anonymized resumes across 50+ job titles.
2. Independent multi-expert human labeling.
3. Upgrading to contextual transformer embeddings (e.g., Sentence-BERT).
4. Implementing an "out-of-distribution" rejection threshold.
5. Conducting demographic fairness and bias audits.
