# ResumeXpert Model Evaluation Report

> **Evaluation Environment:**  
> Python 3.12.10 | scikit-learn 1.9.0 | Test Samples: 320 (20% of 1,600) | Split Seed: 42

---

## 1. Overall Model Performance Metrics

The metrics below were calculated on the held-out test split (320 samples, 40 samples per career):

| Metric | Score | Percentage | Definition & Interpretation |
|---|:---:|:---:|---|
| **Accuracy** | `1.0000` | **100.00%** | Proportion of total test samples classified correctly ($\frac{320}{320}$) |
| **Macro Precision** | `1.0000` | **100.00%** | Unweighted average precision across all 8 classes |
| **Macro Recall** | `1.0000` | **100.00%** | Unweighted average recall across all 8 classes |
| **Macro F1 Score** | `1.0000` | **100.00%** | Harmonic mean of macro precision and recall |
| **Weighted Precision** | `1.0000` | **100.00%** | Class-frequency weighted precision across all classes |
| **Weighted Recall** | `1.0000` | **100.00%** | Class-frequency weighted recall across all classes |
| **Weighted F1 Score** | `1.0000` | **100.00%** | Class-frequency weighted F1 score |

---

## 2. Per-Class Classification Report

Extracted from `artifacts/classification_report.csv` and `artifacts/classification_report.txt`:

| Career Class | Precision | Recall | F1-Score | Support (Test Samples) |
|---|:---:|:---:|:---:|:---:|
| **Backend Developer** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **Cybersecurity Analyst** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **Data Analyst** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **Data Scientist** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **DevOps Engineer** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **Frontend Developer** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **Full Stack Developer** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **Machine Learning Engineer** | 1.0000 | 1.0000 | 1.0000 | 40 |
| **Macro Average** | **1.0000** | **1.0000** | **1.0000** | **320** |
| **Weighted Average** | **1.0000** | **1.0000** | **1.0000** | **320** |

---

## 3. Explanation of Evaluation Metrics

### Accuracy
$$\text{Accuracy} = \frac{\text{True Positives} + \text{True Negatives}}{\text{Total Predictions}}$$
Accuracy measures the overall fraction of correct predictions. While simple, accuracy can be deceptive on imbalanced datasets. Because our test set is perfectly balanced (40 samples per class), accuracy provides an unbiased initial metric.

### Precision
$$\text{Precision} = \frac{\text{True Positives}}{\text{True Positives} + \text{False Positives}}$$
Answers: *"Of all resumes the model predicted as Data Scientist, how many were actually Data Scientists?"* High precision means the model rarely makes false-positive mistakes.

### Recall
$$\text{Recall} = \frac{\text{True Positives}}{\text{True Positives} + \text{False Negatives}}$$
Answers: *"Of all actual Data Scientist resumes in the test set, how many did the model identify?"* High recall means the model rarely misses candidates who belong to that career.

### F1-Score
$$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$
The harmonic mean of precision and recall. It balances false positives and false negatives into a single measure of class classification quality.

### Macro F1 vs Weighted F1
- **Macro F1:** Computes the F1-score independently for each class and calculates the unweighted mean. It gives equal importance to every class, ensuring small classes are not masked by large classes.
- **Weighted F1:** Calculates F1 for each class and weights the average by the support (number of true instances) of each class. In our dataset, because all classes have equal support (40), Macro F1 and Weighted F1 are mathematically identical.

---

## 4. Factual Context Regarding 100% Accuracy

> **VIVA / FACULTY PRESENTATION KEY NOTE:**  
> The measured accuracy on this test set is **100.00% (320/320 correct)**.  
> **This MUST NOT be claimed as 100% real-world accuracy.**

### Why is the test accuracy 100%?
1. **Synthetic Nature:** The dataset is generated from well-defined technical competency profiles (e.g., Python + Pandas + Scikit-Learn for Data Science vs Wireshark + SIEM + Nmap for Cybersecurity).
2. **Clear Decision Boundaries:** Although cross-career noise and general engineering skills (Git, Docker, SQL) are present, each career profile retains distinct discriminatory keyword clusters that linear hyperplanes easily separate.
3. **Controlled Vocabulary:** The synthetic text generator uses consistent phrasing without the erratic formatting, OCR artifacts, typos, or heavy domain overlaps found in real industry resumes.
4. **Valid Pipeline Validation:** The 100% result validates that the end-to-end data pipeline, tokenization, TF-IDF feature weighting, training loop, and multiclass Softmax inference are mathematically and programmatically correct.
