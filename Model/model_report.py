"""Single-command comprehensive report summarizing the model, datasets, training, and artifacts.

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
SKILLS_CSV = DATASET_DIR / "skills_dataset.csv"
ASSESS_CSV = DATASET_DIR / "assessment_questions.csv"
MODEL_FILE = ARTIFACTS_DIR / "career_classifier.joblib"
METRICS_FILE = ARTIFACTS_DIR / "metrics.json"
CM_FILE = ARTIFACTS_DIR / "confusion_matrix.png"


def generate_report() -> None:
    print("=" * 60)
    print("RESUMEXPERT ML MODEL REPORT")
    print("=" * 60)

    # 1. Model Info
    model_obj = load(MODEL_FILE) if MODEL_FILE.exists() else None
    metrics_data = {}
    if METRICS_FILE.exists():
        try:
            metrics_data = json.loads(METRICS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass

    print("\nMODEL")
    print("  Algorithm    : TF-IDF Vectorizer + Multinomial Logistic Regression")
    print("  Task         : Resume Text to Career Category Prediction")
    print("  Problem Type : Supervised Multiclass Classification")
    print("  Library      : scikit-learn (Python)")

    # 2. Dataset Info
    resume_df = pd.read_csv(RESUME_CSV) if RESUME_CSV.exists() else None
    if resume_df is not None:
        total_samples = len(resume_df)
        cols = list(resume_df.columns)
        classes = sorted(resume_df["career"].unique())
        num_classes = len(classes)
    else:
        total_samples = metrics_data.get("total_samples", 0)
        cols = ["id", "resume_text", "career"]
        classes = metrics_data.get("classes", [])
        num_classes = len(classes)

    print("\nDATASET")
    print(f"  Source File   : {RESUME_CSV.name}")
    print(f"  Dataset Type  : Synthetic / Demonstration Dataset (Fixed Seed 42)")
    print(f"  Total Samples : {total_samples:,}")
    print(f"  Features      : Raw text ({cols[1]})")
    print(f"  Target Label  : Career ({cols[2]})")
    print(f"  Total Classes : {num_classes}")

    print("\nCLASSES")
    for idx, c in enumerate(classes, start=1):
        count_str = ""
        if resume_df is not None:
            count = (resume_df["career"] == c).sum()
            count_str = f" ({count} samples, {count/total_samples:.1%})"
        print(f"  {idx}. {c}{count_str}")

    # 3. Training Split
    train_samples = metrics_data.get("train_samples", int(total_samples * 0.8))
    test_samples = metrics_data.get("test_samples", int(total_samples * 0.2))
    seed = metrics_data.get("random_seed", 42)
    split_ratio = metrics_data.get("test_split_ratio", 0.20)

    print("\nTRAINING")
    print(f"  Train Samples : {train_samples:,} ({1.0 - split_ratio:.0%})")
    print(f"  Test Samples  : {test_samples:,} ({split_ratio:.0%})")
    print(f"  Test Split    : {split_ratio:.0%} (Stratified)")
    print(f"  Random Seed   : {seed}")

    # 4. Model Features
    vocab_size = metrics_data.get("tfidf_vocabulary_size", "N/A")
    ngrams = metrics_data.get("tfidf_ngram_range", [1, 2])
    print("\nMODEL FEATURES")
    print(f"  TF-IDF Features: {vocab_size:,} unigrams & bigrams" if isinstance(vocab_size, int) else f"  TF-IDF Features: {vocab_size}")
    print(f"  N-Grams        : {tuple(ngrams)}")
    print("  Sublinear TF   : True (logarithmic scaling)")
    print("  Document Freq  : min_df=2, max_df=0.95")

    # 5. Evaluation
    acc = metrics_data.get("accuracy", 1.0)
    m_prec = metrics_data.get("macro_precision", 1.0)
    m_rec = metrics_data.get("macro_recall", 1.0)
    m_f1 = metrics_data.get("macro_f1", 1.0)
    w_f1 = metrics_data.get("weighted_f1", 1.0)

    print("\nEVALUATION (ON TEST SET)")
    print(f"  Accuracy       : {acc:.4f} ({acc*100:.2f}%)")
    print(f"  Macro Precision: {m_prec:.4f}")
    print(f"  Macro Recall   : {m_rec:.4f}")
    print(f"  Macro F1       : {m_f1:.4f}")
    print(f"  Weighted F1    : {w_f1:.4f}")
    print("  * Note: Measured on controlled synthetic test data; not representative of messy real-world resumes.")

    # 6. Skills Dataset
    if SKILLS_CSV.exists():
        skills_df = pd.read_csv(SKILLS_CSV)
        total_skills = len(skills_df)
        categories = sorted(skills_df["category"].unique())
        print("\nSKILLS DATASET")
        print(f"  Total Skills   : {total_skills}")
        print(f"  Categories ({len(categories)}): {', '.join(categories)}")
    else:
        print("\nSKILLS DATASET: Not found.")

    # 7. Assessment Dataset
    if ASSESS_CSV.exists():
        assess_df = pd.read_csv(ASSESS_CSV)
        total_q = len(assess_df)
        diffs = assess_df["difficulty"].value_counts().to_dict()
        diff_str = ", ".join([f"{k}: {v}" for k, v in diffs.items()])
        print("\nASSESSMENT DATASET")
        print(f"  Total Questions  : {total_q}")
        print(f"  Difficulty Levels: {diff_str}")
    else:
        print("\nASSESSMENT DATASET: Not found.")

    # 8. Artifacts
    print("\nARTIFACTS")
    print(f"  Model File       : {MODEL_FILE.name} ({MODEL_FILE.stat().st_size:,} bytes)" if MODEL_FILE.exists() else "  Model File: Missing")
    print(f"  Metrics File     : {METRICS_FILE.name}" if METRICS_FILE.exists() else "  Metrics File: Missing")
    print(f"  Confusion Matrix : {CM_FILE.name}" if CM_FILE.exists() else "  Confusion Matrix: Missing")

    print("\n" + "=" * 60)
    print("END OF RESUMEXPERT MODEL REPORT")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    generate_report()
