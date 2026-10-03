# Confusion Matrix Explanation

> **Artifact References:**  
> - Matrix Data: [`artifacts/confusion_matrix.csv`](file:///artifacts/confusion_matrix.csv)  
> - Visual Plot: [`artifacts/confusion_matrix.png`](file:///artifacts/confusion_matrix.png)

---

## 1. What is a Confusion Matrix?

A **confusion matrix** is a structured $N \times N$ tabular layout used to evaluate the performance of a supervised classification model on a held-out test dataset, where $N$ is the number of target classes.

In our multi-class model with 8 career classes, the confusion matrix has dimensions $8 \times 8$:
- **Vertical Axis (Rows):** The **True (Actual) Career Class** of the test sample.
- **Horizontal Axis (Columns):** The **Predicted Career Class** assigned by the model.

---

## 2. Actual Confusion Matrix Values

Below is the exact numerical matrix computed from the 320 held-out test samples:

| True \ Predicted | BED | CSA | DA | DS | DOE | FED | FSD | MLE | Total Actual |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Backend Developer (BED)** | **40** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| **Cybersecurity Analyst (CSA)** | 0 | **40** | 0 | 0 | 0 | 0 | 0 | 0 | 40 |
| **Data Analyst (DA)** | 0 | 0 | **40** | 0 | 0 | 0 | 0 | 0 | 40 |
| **Data Scientist (DS)** | 0 | 0 | 0 | **40** | 0 | 0 | 0 | 0 | 40 |
| **DevOps Engineer (DOE)** | 0 | 0 | 0 | 0 | **40** | 0 | 0 | 0 | 40 |
| **Frontend Developer (FED)** | 0 | 0 | 0 | 0 | 0 | **40** | 0 | 0 | 40 |
| **Full Stack Developer (FSD)** | 0 | 0 | 0 | 0 | 0 | 0 | **40** | 0 | 40 |
| **Machine Learning Engineer (MLE)** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **40** | 40 |
| **Total Predicted** | **40** | **40** | **40** | **40** | **40** | **40** | **40** | **40** | **320** |

---

## 3. Structural Analysis: Diagonal vs. Off-Diagonal

### The Main Diagonal (True Positives)
- The cells running from top-left to bottom-right where the row index equals the column index represent **correct predictions** (True Positives).
- In this evaluation:
  - Backend Developer correctly classified: 40 / 40
  - Cybersecurity Analyst correctly classified: 40 / 40
  - Data Analyst correctly classified: 40 / 40
  - Data Scientist correctly classified: 40 / 40
  - DevOps Engineer correctly classified: 40 / 40
  - Frontend Developer correctly classified: 40 / 40
  - Full Stack Developer correctly classified: 40 / 40
  - Machine Learning Engineer correctly classified: 40 / 40
- **Total Correct Predictions:** $40 + 40 + 40 + 40 + 40 + 40 + 40 + 40 = 320$.

### Off-Diagonal Elements (Errors & Misclassifications)
- Any non-zero cell outside the main diagonal indicates a prediction error:
  - If row is $A$ and column is $B$, an actual candidate of career $A$ was incorrectly labeled as career $B$ (False Negative for $A$, False Positive for $B$).
- In this evaluation:
  - **All off-diagonal entries are 0**.
  - There are 0 false positives and 0 false negatives across all 8 classes in this test set.

---

## 4. Factual Performance Observations

- **Highest F1-Score:** All 8 classes achieved an identical F1-score of `1.0000` with 100% precision and recall on the synthetic test split.
- **Inter-Class Confusion Potential:**
  While the matrix shows zero off-diagonal values on the synthetic test set, inspection of the probability distributions in `demo_predict.py` and `sample_predictions.py` reveals which classes have the closest feature overlap:
  1. **Data Scientist vs. Machine Learning Engineer:** Both careers share Python, Pandas, Scikit-learn, and general ML keywords. When a candidate mentions deep learning or model serving, the probability shifts toward MLE; when statistical analysis and tabular modeling dominate, it shifts toward Data Scientist.
  2. **Full Stack Developer vs. Frontend Developer / Backend Developer:** Full Stack resumes contain overlapping web technologies (JavaScript, React, Node.js).
  3. **DevOps Engineer vs. Backend Developer:** Overlap occurs around Docker, Linux, and REST APIs.

In real-world resumes with less distinct wording, these pairs would generate the majority of off-diagonal misclassifications.
