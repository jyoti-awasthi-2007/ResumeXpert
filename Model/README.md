# ResumeXpert — Machine Learning Model (Offline POC)

> ### IMPORTANT ARCHITECTURAL BOUNDARY
> **THIS MODEL IS A SEPARATE EXPERIMENTAL / PROOF-OF-CONCEPT MODEL AND IS NOT CURRENTLY INTEGRATED INTO THE DEPLOYED RESUMEXPERT APPLICATION.**
> 
> The deployed ResumeXpert production application continues to operate on its independent frontend, FastAPI backend, Supabase services, and configured AI/LLM API pipelines.  
> This `Model/` folder serves exclusively as an isolated machine-learning proof-of-concept for academic demonstration, evaluation, and faculty viva defense.

---

## 1. What the Model Does

The ResumeXpert ML model performs **supervised career classification from unstructured resume text**. Given a candidate's resume snippet (skills, education, experience, and project descriptions), the model predicts the most appropriate career track among 8 standardized technical domains and computes class confidence probabilities.

---

## 2. Algorithm & Pipeline

- **Feature Extraction:** `TfidfVectorizer` (Unigrams + Bigrams, 1,594 features, sublinear scaling, L2 normalization)
- **Classifier:** `Multinomial Logistic Regression` (L2 Ridge Regularization, $C = 1.0$, L-BFGS solver)
- **Architecture:** Sequential scikit-learn `Pipeline` serialized to `artifacts/career_classifier.joblib` (144 KB)

---

## 3. Supported Career Classes (8 Classes, 200 Samples Each)

1. **Backend Developer**
2. **Cybersecurity Analyst**
3. **Data Analyst**
4. **Data Scientist**
5. **DevOps Engineer**
6. **Frontend Developer**
7. **Full Stack Developer**
8. **Machine Learning Engineer**

---

## 4. Datasets in `dataset/`

- **`synthetic_resume_career_dataset.csv`:** 1,600 synthetic candidate resumes across 8 classes (perfectly balanced).
- **`challenge_resume_dataset.csv`:** 48 independent, multi-skilled, interdisciplinary resumes used exclusively for evaluation (never trained on).
- **`skills_dataset.csv`:** 87 curated technical skills across 9 categories with aliases and descriptions.
- **`career_skill_mapping.csv`:** 110 weighted career-to-skill competency mappings (13.75 average per career).
- **`assessment_questions.csv`:** 48 multiple-choice evaluation questions across 3 difficulty tiers (16 Beginner, 16 Advanced, 16 Expert).

---

## 5. Evaluation Results

- **Standard Held-Out Test Accuracy:** **100.00% (320 / 320 correct)** on the 20% stratified test split.
- **Independent Challenge Accuracy:** **93.75% (45 / 48 correct)** on the realistic challenge set with multi-domain overlapping skills.
- *Academic Note:* The 100% standard test accuracy reflects the clean separation of synthetic keyword clusters, while the 93.75% challenge accuracy reflects realistic multi-skill generalization.

---

## 6. How to Run

Navigate to the `Model/` directory:

```powershell
cd D:\jyoti\AI-Resume-System\Model
```

### 1. Run Complete Retraining Pipeline
```powershell
python train_model.py
```
*Trains the pipeline, computes standard metrics, and saves model and diagnostic plots to `artifacts/`.*

### 2. Run Comprehensive Evaluation & Challenge Test
```powershell
python evaluate_model.py
```
*Evaluates the model against the independent challenge dataset and generates comparison plots.*

### 3. Run Real-Time Career Prediction
```powershell
# Interactive mode (prompts to paste resume text):
python predict.py

# Direct command-line argument:
python predict.py "Python, SQL, Pandas, NumPy, Scikit-learn, building machine learning models"
```

### 4. Display One-Command Console Summary
```powershell
python model_report.py
```
*Displays a complete terminal summary dynamically calculated from actual files.*

---

## 7. Key Artifact Files in `artifacts/`

- `career_classifier.joblib`: Serialized trained model pipeline.
- `metrics.json`: Dynamic machine-readable evaluation metrics.
- `classification_report.csv`: Tabular per-class precision, recall, and F1.
- `confusion_matrix.png`: Heatmap visualization of the confusion matrix.
- `class_distribution.png`: Bar chart of dataset class balance.
- `per_class_metrics.png`: Grouped bar chart of Precision, Recall, and F1 per career.
- `top_features_by_class.png`: Top positive TF-IDF feature weights per career.
- `learning_curve.png`: Cross-validated learning curve showing convergence.
- `challenge_accuracy.png`: Accuracy comparison chart (Standard 100% vs Challenge 93.75%).
- `prediction_probabilities.png`: Probability distribution bar chart for a sample profile.
- `challenge_predictions.csv`: Predictions and correctness flags on the challenge set.
- `sample_predictions.csv`: Evaluation results on 10 realistic held-out sample profiles.

---

## 8. Documentation Files in `Model/`

- [`MODEL_REPORT.md`](file:///MODEL_REPORT.md): Complete technical report containing all 22 detailed sections.
- [`questions.md`](file:///questions.md): 38 high-value faculty viva questions and concise answers.
- [`PRESENTATION_GUIDE.md`](file:///PRESENTATION_GUIDE.md): 15-slide technical presentation guide with speaker notes.
- [`README.md`](file:///README.md): Quick executive summary (this file).
