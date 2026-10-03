# Training Reproduction Guide

This guide provides step-by-step instructions to completely retrain, evaluate, and inspect the ResumeXpert offline career classification model from scratch.

---

## 1. System Requirements

- **Operating System:** Windows 10/11, macOS, or Linux
- **Python Version:** Python 3.10+ (Tested on Python 3.12.10)
- **Virtual Environment:** Recommended (e.g., `venv` or `conda`)

---

## 2. Dependencies Installation

Navigate to the `Model/` directory and install the required packages:

```powershell
cd D:\jyoti\AI-Resume-System\Model
pip install -r requirements.txt
```

### Direct Package Installation (if preferred):
```powershell
pip install "scikit-learn>=1.4.0" "pandas>=2.0.0" "joblib>=1.3.0" "matplotlib>=3.8.0"
```

---

## 3. Retraining the Model

To generate the dataset, perform stratified train/test split, train the TF-IDF and Logistic Regression pipeline, and generate all artifacts:

```powershell
python train_model.py
```

### What Happens During Training:
1. `generate_dataset()` generates 1,600 synthetic candidate resumes (200 per class) with a deterministic seed (`SEED = 42`).
2. Persists the dataset to `dataset/synthetic_resume_career_dataset.csv`.
3. Splits data into 1,280 train samples (80%) and 320 test samples (20%) stratified by career class.
4. Fits a `TfidfVectorizer` (unigrams + bigrams, `min_df=2`, `max_df=0.95`, sublinear TF).
5. Fits a `LogisticRegression` classifier (`class_weight='balanced'`, `max_iter=2500`, `random_state=42`).
6. Evaluates test set metrics and generates:
   - `artifacts/career_classifier.joblib` (Trained model pipeline)
   - `artifacts/metrics.json` (Structured JSON metrics)
   - `artifacts/classification_report.txt` (Text classification table)
   - `artifacts/classification_report.csv` (CSV classification metrics)
   - `artifacts/confusion_matrix.csv` (Confusion matrix tabular data)
   - `artifacts/confusion_matrix.png` (Confusion matrix graphical heatmap)
   - `artifacts/class_distribution.png` (Class distribution bar plot)
   - `artifacts/top_terms_by_career.csv` (Top 15 weighted features per class)

---

## 4. Running Model Inspection

To inspect the internal parameters, vocabulary length, and classifier weights of the generated joblib model:

```powershell
python inspect_model.py
```

---

## 5. Running the One-Command Model Report

To view a comprehensive, production-grade terminal summary of model architecture, dataset properties, classes, metrics, and question counts:

```powershell
python model_report.py
```

---

## 6. Running Predictions and Demos

### Interactive Paste Demo:
```powershell
python demo_predict.py
# Prompt: Paste resume text:
```

### Direct CLI Argument Prediction:
```powershell
python demo_predict.py "Python, Pandas, SQL, Scikit-learn, exploratory data analysis and predictive modeling"
```

### Standard Prediction CLI:
```powershell
python predict.py "Docker, Kubernetes, AWS, Linux, Terraform and CI/CD pipelines"
```

### Held-Out 10-Sample Demonstration Suite:
```powershell
python sample_predictions.py
```
This runs inference across 10 realistic resume samples spanning all 8 career categories and exports results to `artifacts/sample_predictions.csv`.

---

## 7. Deterministic Reproducibility Parameters

To guarantee exact numerical reproduction across any operating system:

| Setting | Parameter Name | Hardcoded Value |
|---|---|:---:|
| Random Seed | `SEED` | `42` |
| Samples per Class | `SAMPLES_PER_CLASS` | `200` |
| Test Ratio | `test_size` | `0.20` |
| Stratification | `stratify` | `df['career']` |
| TF-IDF N-gram Range | `ngram_range` | `(1, 2)` |
| TF-IDF Sublinear TF | `sublinear_tf` | `True` |
| Logistic Regression C | `C` | `1.0` |
| Logistic Solver | `solver` | `'lbfgs'` |
