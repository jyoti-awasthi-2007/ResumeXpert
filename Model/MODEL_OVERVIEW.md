# ResumeXpert ML Model Overview

> **Important Presentation Notice:**  
> This machine learning model is a **separate experimental / proof-of-concept component** developed for academic demonstration and faculty presentation.  
> It is **NOT currently integrated into the deployed ResumeXpert production application** (which uses its own API/LLM pipeline). It is maintained independently inside the `Model/` directory.

---

## 1. Model Purpose

The ResumeXpert ML model addresses the task of **Automated Career Category Classification from Resume Text**.

Given an unstructured candidate resume snippet containing technical skills, educational background, past experience, and project descriptions, the model predicts the most appropriate career category among 8 distinct technical career tracks and computes confidence probabilities across all supported classes.

### Pipeline Concept
```text
Unstructured Resume Text
          ↓
Text Preprocessing & Lowercasing
          ↓
TF-IDF Feature Extraction (Unigrams + Bigrams)
          ↓
High-Dimensional Numerical Sparse Matrix (1,594 features)
          ↓
Multinomial Logistic Regression Classifier (L2 Regularization)
          ↓
Probability Distribution & Predicted Career Class
```

---

## 2. Model Type

Based on standard machine learning terminology:

- **Field:** Machine Learning (ML) & Natural Language Processing (NLP)
- **Learning Paradigm:** Supervised Learning (trained on paired `(resume_text, career_label)` records)
- **Task Type:** Multi-Class Classification (each resume belongs to exactly one of 8 distinct career classes)
- **Feature Space:** High-dimensional sparse bag-of-words / n-gram representation

---

## 3. Algorithm Details

The model utilizes a two-stage sequential scikit-learn `Pipeline`:

1. **Feature Extractor:** `TfidfVectorizer` (Term Frequency-Inverse Document Frequency)
2. **Estimator:** `LogisticRegression` (Multinomial Logistic Regression with L-BFGS solver)

### What is TF-IDF?
**TF-IDF** stands for **Term Frequency – Inverse Document Frequency**. It is a statistical numerical statistic intended to reflect how important a word or phrase is to a document in a collection or corpus.

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

- **Term Frequency (TF):** Measures how frequently a word $t$ appears in a specific resume $d$. In this implementation, `sublinear_tf=True` applies logarithmic scaling ($1 + \log(\text{TF})$) to prevent words repeated multiple times from dominating the score.
- **Inverse Document Frequency (IDF):** Measures how rare or common a word is across all 1,600 resumes in the corpus:
  $$\text{IDF}(t) = \log\left(\frac{1 + N}{1 + \text{DF}(t)}\right) + 1$$
  Common words like `"experience"` or `"worked"` appear in almost every resume, giving them low IDF weights. Domain-distinguishing words like `"pytorch"`, `"kubernetes"`, or `"wireshark"` appear mostly in specific career tracks, yielding high IDF weights.

**Why TF-IDF is effective for resume classification:**
Resumes are keyword-dense documents. Domain-specific technical terms (libraries, tools, protocols) are strong signals of job role fit. TF-IDF naturally highlights specialized skills while penalizing generic boilerplate terminology without requiring heavy neural network compute.

### What is Logistic Regression?
**Logistic Regression** is a linear classification algorithm that models the probability of discrete outcomes using the sigmoid (or softmax in multiclass) function.

For multiclass classification with $K = 8$ classes, the model computes a linear combination of input TF-IDF feature values $X$ and learned weights $W_k$ plus bias $b_k$:

$$z_k = W_k \cdot X + b_k$$

These raw scores (logits) are passed through the **Softmax function** to generate a normalized probability distribution where all probabilities sum to 1.0 (100%):

$$P(y = k \mid X) = \frac{e^{z_k}}{\sum_{j=1}^{K} e^{z_j}}$$

The class with the highest probability is selected as the predicted career:

$$\hat{y} = \arg\max_{k} P(y = k \mid X)$$

**Why Logistic Regression is ideal for this application:**
- **Sparse Feature Efficiency:** TF-IDF creates high-dimensional sparse vectors (1,594 features). Logistic regression scales exceptionally well to sparse inputs without heavy memory overhead.
- **Interpretability:** The learned coefficients directly represent the positive or negative contribution of each technical term to a career class.
- **Calibrated Probabilities:** Logistic regression produces well-calibrated posterior probabilities, allowing the system to display confidence rankings (e.g., Top 3 career matches).
- **Fast Training and Inference:** Training 1,600 samples takes under 2 seconds, and inference takes less than 15 milliseconds on standard CPU hardware.

---

## 4. End-to-End Model Workflow

```text
+-------------------------------------------------------------------+
|                        1. RESUME INPUT                            |
| Candidate text containing education, skills, projects, experience |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
|                     2. TEXT PREPROCESSING                         |
| • Lowercasing                                                     |
| • Word tokenization & N-gram grouping ((1, 2) unigrams & bigrams) |
| • Document frequency pruning (min_df=2, max_df=0.95)             |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
|                   3. TF-IDF VECTORIZATION                         |
| • Sublinear term frequency scaling (1 + log(tf))                  |
| • Inverse document frequency weighting                            |
| • L2 Euclidean normalization of vectors                           |
| • Outputs 1,594-dimensional sparse numerical vector              |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
|                4. LOGISTIC REGRESSION ESTIMATOR                   |
| • Linear dot product: z = W · X + b                               |
| • Softmax activation across 8 career classes                      |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
|                        5. MODEL OUTPUT                            |
| • Primary Predicted Career (argmax probability)                   |
| • Probability distribution across all 8 classes                   |
| • Top 3 Ranked Career Matches with percentages                    |
+-------------------------------------------------------------------+
```

---

## 5. Dataset Information

All values below are dynamically inspected from `dataset/synthetic_resume_career_dataset.csv`:

- **Total Rows:** 1,600 records
- **Total Columns:** 3 columns (`id`, `resume_text`, `career`)
- **Missing Values:** 0 (clean dataset)
- **Duplicate Rows:** 0 (all 1,600 synthetic profiles are uniquely generated)
- **Feature Column:** `resume_text` (unstructured string containing candidate profile)
- **Target Column:** `career` (categorical label)
- **Total Classes:** 8 classes
- **Samples per Class:** Exactly 200 samples per class
- **Minimum Class Size:** 200
- **Maximum Class Size:** 200
- **Class Balance:** Perfectly balanced (each class represents exactly 12.50% of the dataset)

---

## 6. Class Information

| Class No. | Career Class | Number of Samples | Percentage of Dataset |
|:---:|:---|:---:|:---:|
| 1 | Backend Developer | 200 | 12.50% |
| 2 | Cybersecurity Analyst | 200 | 12.50% |
| 3 | Data Analyst | 200 | 12.50% |
| 4 | Data Scientist | 200 | 12.50% |
| 5 | DevOps Engineer | 200 | 12.50% |
| 6 | Frontend Developer | 200 | 12.50% |
| 7 | Full Stack Developer | 200 | 12.50% |
| 8 | Machine Learning Engineer | 200 | 12.50% |
| **Total** | **8 Unique Classes** | **1,600 Samples** | **100.00%** |

---

## 7. Input Features & Vectorization Settings

The model transforms raw text into a 1,594-dimensional feature vector. The exact configuration extracted from the fitted `TfidfVectorizer` is:

| Setting | Value | Rationale |
|---|---|---|
| `lowercase` | `True` | Ensures casing consistency (`Python` vs `python`) |
| `ngram_range` | `(1, 2)` | Captures single words (`python`, `react`) and key bigrams (`machine learning`, `rest api`, `deep learning`) |
| `min_df` | `2` | Prunes rare typographical artifacts that appear in fewer than 2 resumes |
| `max_df` | `0.95` | Discards corpus-wide terms appearing in more than 95% of resumes |
| `sublinear_tf` | `True` | Replaces term frequency $tf$ with $1 + \log(tf)$ to balance word frequency impact |
| `stop_words` | `None` | Preserves compound technical terms; IDF downweights general words automatically |
| `max_features` | `None` | Retains all 1,594 vocabulary terms meeting the frequency constraints |
| `norm` | `'l2'` | Normalizes feature vectors to unit length to ensure fair comparison across short and long resumes |

---

## 8. Model Hyperparameters

The following parameters are extracted directly from the serialized `LogisticRegression` classifier:

| Component | Parameter | Actual Value | Purpose |
|---|---|---|---|
| Split | `test_size` | `0.20` | Allocates 80% (1,280 samples) for training and 20% (320 samples) for testing |
| Split | `stratify` | `df['career']` | Ensures exact 40 test samples per class (12.5% each) in both splits |
| Split | `random_state` | `42` | Ensures deterministic, reproducible data partitioning |
| Classifier | `C` | `1.0` | Inverse regularization strength (standard L2 penalty) |
| Classifier | `penalty` | `'l2'` | Ridge penalty preventing any single feature weight from exploding |
| Classifier | `solver` | `'lbfgs'` | Limited-memory BFGS quasi-Newton optimization algorithm |
| Classifier | `max_iter` | `2500` | Ample iteration limit ensuring guaranteed mathematical convergence |
| Classifier | `class_weight` | `'balanced'` | Automatically adjusts weights inversely proportional to class frequencies |
| Classifier | `random_state` | `42` | Ensures identical coefficient convergence across runs |

---

## 9. Training Process

1. **Dataset Generation:** `generate_dataset()` builds 1,600 synthetic resumes based on 8 career profiles with core skills, supporting tools, cross-career noise, and experience phrases.
2. **Persistence:** Saves dataset to `dataset/synthetic_resume_career_dataset.csv`.
3. **Stratified Split:** Divides data into 1,280 training samples and 320 testing samples using `random_state=42`. Stratification guarantees exactly 40 test samples per class.
4. **Pipeline Construction:** Bundles `TfidfVectorizer` and `LogisticRegression` into a single atomic scikit-learn `Pipeline`.
5. **Fitting:** The pipeline fits vocabulary and weights strictly on `X_train`, preventing information leakage from the test split.
6. **Inference on Test Set:** Computes discrete predictions and continuous probability matrices on `X_test`.
7. **Evaluation:** Evaluates performance against ground truth `y_test` using Accuracy, Precision, Recall, F1 (Macro and Weighted), and Confusion Matrix.
8. **Artifact Serialization:** Serializes the trained pipeline into `artifacts/career_classifier.joblib` along with CSV and graphical reports.

---

## 10. Model Architecture Diagram

```text
                  Raw Resume Text
                         │
                         ▼
        ┌───────────────────────────────────┐
        │        Text Preprocessing         │
        │ • Lowercase conversion            │
        │ • N-gram tokenization ((1, 2))    │
        │ • Frequency filter [2, 0.95]      │
        └───────────────────────────────────┘
                         │
                         ▼
        ┌───────────────────────────────────┐
        │       TF-IDF Vectorizer           │
        │ • Vocabulary: 1,594 terms         │
        │ • Sublinear TF log-scaling        │
        │ • L2 unit vector normalization    │
        └───────────────────────────────────┘
                         │
                         ▼
             1,594-Dimensional Vector
                         │
                         ▼
        ┌───────────────────────────────────┐
        │       Logistic Regression         │
        │ • 8 linear decision boundaries    │
        │ • Weights: 8 x 1,594 matrix       │
        │ • Biases: 8-element vector        │
        └───────────────────────────────────┘
                         │
                         ▼
        ┌───────────────────────────────────┐
        │         Softmax Function          │
        │ • Converts logits into [0, 1]     │
        │ • Probabilities sum to 100%       │
        └───────────────────────────────────┘
                         │
                         ▼
              Predicted Career + Ranking
```
