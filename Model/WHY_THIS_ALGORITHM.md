# Why This Algorithm Was Chosen

This document details the technical rationale behind selecting **TF-IDF Vectorization + Multinomial Logistic Regression** for the ResumeXpert offline career classification model, along with a comparative analysis against alternative ML/NLP architectures.

---

## 1. Primary Reasons for Selection

### 1. Natural Fit for High-Dimensional Sparse Text
Text classification problems typically generate very high-dimensional feature spaces where most values are zero (sparse representation). In our vocabulary of 1,594 unigrams and bigrams, an individual resume might only activate 40 to 80 terms (~3% to 5% sparsity).
Logistic Regression with L2 regularization is mathematically optimized to handle sparse matrices via coordinate descent or quasi-Newton algorithms (such as L-BFGS) without requiring dense memory allocation.

### 2. Full Model Interpretability (White-Box Behavior)
In academic, hiring, and career guidance contexts, model explainability is essential:
- In deep neural networks or complex ensembles, attributing why a specific career was selected requires post-hoc surrogate explainers (like SHAP or LIME), which are computationally expensive approximations.
- In Logistic Regression, each feature has an explicit learned weight ($w_{k, i}$). We can directly inspect the exact terms that positively or negatively influenced the classification (as documented in `TOP_FEATURES_EXPLANATION.md`).

### 3. Calibrated Posterior Probabilities
Unlike standard Support Vector Machines (SVMs), which output raw geometric distances from a separating hyperplane, Logistic Regression directly models probabilities via the Softmax activation function. This makes it trivial to present students with a ranked list of top career paths (e.g., 78% Data Scientist, 14% ML Engineer, 5% Data Analyst).

### 4. Computational Efficiency & Instant Training
- **Training Time:** < 2 seconds on standard CPU hardware for 1,600 resumes.
- **Inference Latency:** < 15 milliseconds per resume snippet.
- **Resource Footprint:** The serialized model artifact (`career_classifier.joblib`) is only **144 KB**, requiring no GPU acceleration, external model registries, or heavy CUDA dependencies.

### 5. Proven Baseline Standard in Industry & Research
In text classification benchmarks, TF-IDF + Logistic Regression frequently serves as the golden standard linear baseline. It is often challenging to outperform with complex neural models unless substantial amounts of labeled data (tens of thousands of examples) are available.

---

## 2. Comparative Analysis with Alternatives

| Algorithm | Pros | Cons | Why Not Selected for this POC |
|---|---|---|---|
| **Multinomial Naive Bayes** | Extremely fast; handles word counts naturally | Assumes strict feature independence ($P(w_1, w_2) = P(w_1)P(w_2)$), which fails on coupled technical skills (e.g., `scikit` and `learn`) | Logistic Regression models feature correlations better and produces superior probability calibration. |
| **Linear Support Vector Machine (LinearSVC)** | Excellent margin maximization on text | Does not natively output calibrated probabilities (requires Platt scaling, which adds training time) | Logistic regression provides direct softmax probabilities necessary for career ranking. |
| **Random Forest / Gradient Boosted Trees (XGBoost)** | Captures non-linear feature interactions | Scales poorly with high-dimensional sparse text (trees split on single sparse words); slow training; large file size | Decision trees struggle with sparse text where 97% of features are zero in any given row. |
| **Recurrent Neural Networks (LSTM / BiLSTM)** | Understands word order and sequential grammar | Requires large training corpora; prone to vanishing gradients; computationally heavy | Resumes are primarily keyword-driven rather than sequential prose; word order matters less than skill presence. |
| **Transformer Models (BERT / RoBERTa / DeBERTa)** | State-of-the-art semantic contextual understanding | Model size > 400 MB; requires GPU for reasonable inference speed; slow training; black-box opacity | Overkill for a proof-of-concept demonstration; requires significant compute without substantial benefit on structured keyword data. |

---

## 3. Summary Conclusion

For an offline educational and demonstrative career classification prototype, **TF-IDF + Logistic Regression** achieves the optimal balance among:
1. Classification accuracy
2. Complete explainability and coefficient transparency
3. Minimal computational footprint and instant reproducibility
4. Straightforward viva presentation for faculty defense
