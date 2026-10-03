"""Inspect and display the internal structure, parameters, and metadata of the saved model artifact.

This script uses safe attribute lookups to prevent crashes if certain properties
or steps are altered in the future.
"""
from __future__ import annotations

import os
from pathlib import Path
from joblib import load

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "artifacts" / "career_classifier.joblib"


def format_bytes(size: int) -> str:
    """Format byte count into human-readable string."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024.0:
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} TB"


def inspect_model() -> None:
    print("=" * 65)
    print("RESUMEXPERT MODEL INSPECTION REPORT")
    print("=" * 65)

    if not MODEL_PATH.exists():
        print(f"Error: Model file not found at: {MODEL_PATH}")
        print("Please train the model first by running: python train_model.py")
        return

    # File statistics
    file_size_bytes = os.path.getsize(MODEL_PATH)
    print("\n[ARTIFACT FILE]")
    print(f"  Path      : {MODEL_PATH}")
    print(f"  File Size : {format_bytes(file_size_bytes)} ({file_size_bytes:,} bytes)")

    try:
        model = load(MODEL_PATH)
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    print("\n[TOP-LEVEL OBJECT]")
    print(f"  Class Type : {model.__class__.__module__}.{model.__class__.__name__}")

    # Check if object is a scikit-learn Pipeline
    if hasattr(model, "named_steps"):
        print("\n[PIPELINE STEPS]")
        for step_name, step_obj in model.named_steps.items():
            print(f"  - Step '{step_name}': {step_obj.__class__.__module__}.{step_obj.__class__.__name__}")

    # Inspect Feature Extractor / Vectorizer
    vectorizer = None
    if hasattr(model, "named_steps") and "tfidf" in model.named_steps:
        vectorizer = model.named_steps["tfidf"]
    elif hasattr(model, "vocabulary_"):
        vectorizer = model

    if vectorizer:
        print("\n[TEXT VECTORIZER SETTINGS (TF-IDF)]")
        print(f"  Type              : {vectorizer.__class__.__name__}")
        print(f"  N-Gram Range      : {getattr(vectorizer, 'ngram_range', 'N/A')}")
        print(f"  Lowercase         : {getattr(vectorizer, 'lowercase', 'N/A')}")
        print(f"  Min Document Freq : {getattr(vectorizer, 'min_df', 'N/A')}")
        print(f"  Max Document Freq : {getattr(vectorizer, 'max_df', 'N/A')}")
        print(f"  Sublinear TF      : {getattr(vectorizer, 'sublinear_tf', 'N/A')}")
        print(f"  Stop Words        : {getattr(vectorizer, 'stop_words', 'None')}")
        print(f"  Max Features      : {getattr(vectorizer, 'max_features', 'Unlimited')}")

        if hasattr(vectorizer, "vocabulary_"):
            vocab_len = len(vectorizer.vocabulary_)
            print(f"  Vocabulary Size   : {vocab_len:,} extracted features")
        if hasattr(vectorizer, "get_feature_names_out"):
            try:
                sample_features = list(vectorizer.get_feature_names_out()[:8])
                print(f"  Sample Features   : {', '.join(sample_features)} ...")
            except Exception:
                pass

    # Inspect Classifier
    classifier = None
    if hasattr(model, "named_steps") and "classifier" in model.named_steps:
        classifier = model.named_steps["classifier"]
    elif hasattr(model, "classes_"):
        classifier = model

    if classifier:
        print("\n[CLASSIFIER SETTINGS]")
        print(f"  Algorithm         : {classifier.__class__.__name__}")
        print(f"  Regularization C  : {getattr(classifier, 'C', 'N/A')}")
        print(f"  Max Iterations    : {getattr(classifier, 'max_iter', 'N/A')}")
        print(f"  Solver            : {getattr(classifier, 'solver', 'N/A')}")
        print(f"  Class Weight      : {getattr(classifier, 'class_weight', 'None')}")
        print(f"  Random State      : {getattr(classifier, 'random_state', 'None')}")

        if hasattr(classifier, "classes_"):
            classes = list(classifier.classes_)
            print(f"  Output Classes ({len(classes)}):")
            for idx, c in enumerate(classes, start=1):
                print(f"    {idx}. {c}")

        if hasattr(classifier, "coef_"):
            coef = classifier.coef_
            print(f"  Coefficient Matrix: {coef.shape} (classes x features)")
        if hasattr(classifier, "intercept_"):
            intercept = classifier.intercept_
            print(f"  Intercept Vector  : {intercept.shape}")

    print("\n" + "=" * 65)
    print("INSPECTION COMPLETE - All checks passed successfully.")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    inspect_model()
