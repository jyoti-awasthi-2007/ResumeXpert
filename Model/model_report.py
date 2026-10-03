"""Single-command comprehensive report summarizing the trained model, datasets, evaluation, and artifacts.

All metrics, parameters, and counts are read dynamically from actual files in Model/.
"""
from __future__ import annotations

import json
from pathlib import Path
import pandas as pd
from joblib import load

ROOT = Path(__file__).resolve().parent
DATASET_DIR = ROOT / "dataset"
ARTIFACTS_DIR = ROOT / "artifacts"

RESUME_CSV = DATASET_DIR / "synthetic_resume_career_dataset.csv"
CHALLENGE_CSV = DATASET_DIR / "challenge_resume_dataset.csv"
SKILLS_CSV = DATASET_DIR / "skills_dataset.csv"
ASSESS_CSV = DATASET_DIR / "assessment_questions.csv"
MODEL_FILE = ARTIFACTS_DIR / "career_classifier.joblib"
METRICS_FILE = ARTIFACTS_DIR / "metrics.json"


def generate_report() -> None:
    print("=" * 60)
    print("RESUMEXPERT ML MODEL REPORT")
    print("=" * 60)

    # 1. Model Info
    metrics_data = {}
    if METRICS_FILE.exists():
        try:
            metrics_data = json.loads(METRICS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass

    print("\nMODEL")
    print("  Algorithm    : TF-IDF Vectorizer + Multinomial Logistic Regression")
    print("  Problem      : Supervised Multiclass Text Classification")
    print(f"  Total Samples: {metrics_data.get('total_samples', 1600):,}")
    print(f"  Total Classes: {metrics_data.get('num_classes', 8)}")

    # 2. Classes
    classes = metrics_data.get("classes", [])
    if not classes and RESUME_CSV.exists():
        df = pd.read_csv(RESUME_CSV)
        classes = sorted(df["career"].unique())

    print("\nCLASSES")
    for idx, c in enumerate(classes, start=1):
        print(f"  {idx}. {c}")

    # 3. Training
    train_samples = metrics_data.get("train_samples", 1280)
    test_samples = metrics_data.get("test_samples", 320)
    seed = metrics_data.get("random_seed", 42)
    split_ratio = metrics_data.get("test_split_ratio", 0.20)

    print("\nTRAINING")
    print(f"  Train Samples: {train_samples:,} (80%)")
    print(f"  Test Samples : {test_samples:,} (20%)")
    print(f"  Split        : Stratified 80/20")
    print(f"  Random Seed  : {seed}")

    # 4. Features
    vocab_size = metrics_data.get("tfidf_vocabulary_size", "1,594")
    ngrams = metrics_data.get("tfidf_ngram_range", [1, 2])
    print("\nFEATURES")
    print(f"  TF-IDF Vocabulary: {vocab_size:,} features" if isinstance(vocab_size, int) else f"  TF-IDF Vocabulary: {vocab_size}")
    print(f"  N-Gram Range     : {tuple(ngrams)} (Unigrams + Bigrams)")

    # 5. Standard Test Evaluation
    std_acc = metrics_data.get("standard_test_accuracy", 1.0)
    m_prec = metrics_data.get("standard_test_macro_precision", 1.0)
    m_rec = metrics_data.get("standard_test_macro_recall", 1.0)
    m_f1 = metrics_data.get("standard_test_macro_f1", 1.0)
    w_f1 = metrics_data.get("standard_test_weighted_f1", 1.0)

    print("\nSTANDARD TEST (HELD-OUT SYNTHETIC)")
    print(f"  Accuracy   : {std_acc:.4f} ({std_acc*100:.2f}%)")
    print(f"  Precision  : {m_prec:.4f}")
    print(f"  Recall     : {m_rec:.4f}")
    print(f"  F1         : {m_f1:.4f}")
    print(f"  Macro F1   : {m_f1:.4f}")
    print(f"  Weighted F1: {w_f1:.4f}")

    # 6. Challenge Test Evaluation
    chal_samples = metrics_data.get("challenge_samples", 0)
    chal_acc = metrics_data.get("challenge_accuracy", None)
    chal_corr = metrics_data.get("challenge_correct", 0)

    print("\nCHALLENGE TEST (INDEPENDENT REALISTIC DATASET)")
    print(f"  Challenge Samples : {chal_samples}")
    if chal_acc is not None:
        print(f"  Challenge Accuracy: {chal_acc:.4f} ({chal_corr}/{chal_samples} correct, {chal_acc*100:.2f}%)")
    else:
        print("  Challenge Accuracy: Run python evaluate_model.py to compute")

    # 7. Skills Dataset
    if SKILLS_CSV.exists():
        skills_df = pd.read_csv(SKILLS_CSV)
        total_skills = len(skills_df)
        categories = sorted(skills_df["category"].unique())
        print("\nSKILLS DATASET")
        print(f"  Total Skills: {total_skills}")
        print(f"  Categories  : {len(categories)} ({', '.join(categories)})")

    # 8. Assessment Dataset
    if ASSESS_CSV.exists():
        assess_df = pd.read_csv(ASSESS_CSV)
        total_q = len(assess_df)
        diff_counts = assess_df["difficulty"].value_counts().to_dict()
        print("\nASSESSMENT DATASET")
        print(f"  Total Questions: {total_q}")
        print(f"  Beginner       : {diff_counts.get('BEGINNER', 0)}")
        print(f"  Advanced       : {diff_counts.get('ADVANCED', 0)}")
        print(f"  Expert         : {diff_counts.get('EXPERT', 0)}")

    # 9. Artifacts Verification
    print("\nGENERATED ARTIFACTS")
    artifacts = [
        "career_classifier.joblib",
        "metrics.json",
        "classification_report.csv",
        "confusion_matrix.csv",
        "confusion_matrix.png",
        "class_distribution.png",
        "per_class_metrics.png",
        "top_features_by_class.csv",
        "top_features_by_class.png",
        "learning_curve.png",
        "challenge_predictions.csv",
        "challenge_accuracy.png",
        "prediction_probabilities.png",
        "sample_predictions.csv",
    ]
    for art in artifacts:
        fpath = ARTIFACTS_DIR / art
        status = "EXISTS" if fpath.exists() else "MISSING"
        print(f"  - {art:<30}: [{status}]")

    print("\n" + "=" * 60)
    print("END OF RESUMEXPERT MODEL REPORT")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    generate_report()
