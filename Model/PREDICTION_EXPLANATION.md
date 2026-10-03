# Resume Prediction Explanation Guide

This document explains the mathematical and algorithmic process that occurs from the moment a user submits a resume until the final career prediction is displayed.

---

## 1. Step-by-Step Prediction Lifecycle

```text
                  1. Raw Resume Text Input
                             │
                             ▼
                  2. Text Preprocessing
          (Lowercase, punctuation, tokenization)
                             │
                             ▼
                  3. TF-IDF Transformation
          (Vocabulary lookup, TF-IDF calculation, L2 norm)
                             │
                             ▼
               4. Linear Score (Logit) Computation
                       z = W · x + b
                             │
                             ▼
                  5. Softmax Normalization
                  P(y = k | x) = exp(z_k) / Σ exp(z_j)
                             │
                             ▼
            6. Argmax Selection & Probability Ranking
         (Predicted Career, Top 3 Careers with %)
```

---

## 2. Walkthrough with a Concrete Example

Consider the sample resume input:
> *"Experience with Python, SQL, Pandas, NumPy, Scikit-learn, building machine learning models and analyzing datasets."*

### Step 1: Tokenization and Matching
The text is lowercased and matched against the fitted 1,594-feature vocabulary.
- Matched unigrams: `python`, `sql`, `pandas`, `numpy`, `scikit`, `learn`, `machine`, `learning`, `models`, `datasets`, `experience`
- Matched bigrams: `scikit learn`, `machine learning`

### Step 2: TF-IDF Vector Construction
For each matched term, its Term Frequency is scaled logarithmically ($1 + \log(\text{TF})$) and multiplied by its stored corpus Inverse Document Frequency ($\text{IDF}$).
All 1,594 positions are populated; non-matching words remain `0.0`.
The resulting sparse vector is L2-normalized so its Euclidean length equals `1.0`.

### Step 3: Raw Logit Scoring
For each of the 8 career classes $k$, the dot product of the feature vector with the class weight row is computed:
$$z_k = \sum_{i=1}^{1594} w_{k, i} \cdot x_i + b_k$$

- Terms like `numpy`, `scikit learn`, `pandas`, and `statistics` have high positive weights for **Data Scientist**.
- Terms like `machine learning` have positive weights for both **Data Scientist** and **Machine Learning Engineer**.
- Consequently:
  - $z_{\text{Data Scientist}}$ is high positive (~ +3.8)
  - $z_{\text{Machine Learning Engineer}}$ is moderate positive (~ +1.6)
  - $z_{\text{Data Analyst}}$ is low positive (~ +0.2)
  - $z_{\text{DevOps Engineer}}$ is negative (~ -2.1)
  - $z_{\text{Cybersecurity Analyst}}$ is negative (~ -2.9)

### Step 4: Softmax Probability Transformation
The Softmax function exponentiates each score and divides by the sum of exponentials across all 8 classes:
$$P(\text{Data Scientist}) = \frac{e^{3.8}}{\sum_{j=1}^{8} e^{z_j}} \approx 80.72\%$$
$$P(\text{Machine Learning Engineer}) \approx 8.79\%$$
$$P(\text{Data Analyst}) \approx 2.32\%$$
The probabilities across all 8 classes strictly sum to 100.0%.

### Step 5: Output Generation
The script sorts classes by probability in descending order and outputs:
1. **Primary Prediction:** `Data Scientist` (80.72% confidence)
2. **Top 3 Breakdown:**
   - 1. Data Scientist — 80.72%
   - 2. Machine Learning Engineer — 8.79%
   - 3. Data Analyst — 2.32%
3. **Contributing Features:** `numpy`, `scikit learn`, `machine learning`, `pandas`, `sql`

---

## 3. What Does the Prediction Probability Mean?

- **Confidence Indicator:** The probability represents the relative certainty of the linear classifier that the candidate's keyword profile resembles the training distribution for that career.
- **Multi-Skill Ambiguity:** If a candidate has a hybrid profile (e.g., strong backend skills AND strong cloud DevOps skills), the probabilities might show 48% Backend Developer and 44% DevOps Engineer. This highlights realistic career cross-compatibility rather than a binary yes/no decision.
- **Out-of-Distribution Inputs:** If completely unrelated text (e.g., a recipe or legal document) is supplied, the classifier will still output probabilities that sum to 100%, distributing small probabilities across whatever vague vocabulary happens to overlap. This is a known property of closed-world softmax classifiers.
