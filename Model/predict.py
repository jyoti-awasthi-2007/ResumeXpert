"""Run real predictions on resume text using the trained ResumeXpert model.

Supports both interactive input and command-line arguments:
    python predict.py
    python predict.py "Experienced in Python, SQL, Pandas, NumPy, Scikit-learn, and Machine Learning"
"""
from __future__ import annotations

import sys
from pathlib import Path
from joblib import load

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "artifacts" / "career_classifier.joblib"


def get_top_features_for_input(pipeline, text: str, predicted_career: str, top_k: int = 5) -> list[str]:
    """Extract input terms that have positive weights for the predicted career class."""
    try:
        vectorizer = pipeline.named_steps["tfidf"]
        classifier = pipeline.named_steps["classifier"]
        feature_names = vectorizer.get_feature_names_out()

        class_idx = list(classifier.classes_).index(predicted_career)
        weights = classifier.coef_[class_idx]

        # Transform input text into TF-IDF vector
        vec = vectorizer.transform([text]).toarray()[0]
        active_indices = [idx for idx in range(len(vec)) if vec[idx] > 0]

        # Sort active features by positive linear coefficient
        ranked = sorted(active_indices, key=lambda idx: weights[idx], reverse=True)
        return [feature_names[idx] for idx in ranked[:top_k] if weights[idx] > 0]
    except Exception:
        return []


def predict(resume_text: str) -> None:
    if not MODEL_PATH.exists():
        print(f"Error: Model not found at {MODEL_PATH}.")
        print("Please train the model first by running: python train_model.py")
        sys.exit(1)

    model = load(MODEL_PATH)
    predicted_career = model.predict([resume_text])[0]
    probabilities = model.predict_proba([resume_text])[0]
    classes = list(model.classes_)

    ranked = sorted(zip(classes, probabilities), key=lambda item: item[1], reverse=True)
    top_pred, top_prob = ranked[0]
    top_features = get_top_features_for_input(model, resume_text, top_pred, top_k=5)

    print()
    print("==================================================")
    print("RESUMEXPERT ML PREDICTION")
    print("==================================================")
    print()
    print("Predicted Career:")
    print(f"  {top_pred}")
    print()
    print("Probability:")
    print(f"  {top_prob:.2%} ({top_prob:.4f})")
    print()
    print("Top 3 Predictions:")
    print()
    for rank, (career, prob) in enumerate(ranked[:3], start=1):
        print(f"  {rank}. {career:26s} -- {prob:6.2%}")
    print()
    print("Top Related TF-IDF Features:")
    if top_features:
        for feat in top_features:
            print(f"  - {feat}")
    else:
        print("  - (No high-weight vocabulary tokens matched directly)")
    print()
    print("==================================================")
    print()


def main() -> None:
    if len(sys.argv) > 1:
        resume_text = " ".join(sys.argv[1:]).strip()
    else:
        print("==================================================")
        print("ResumeXpert Career Classifier")
        print("==================================================")
        try:
            resume_text = input("Paste resume text: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nPrediction cancelled.")
            return

    if not resume_text:
        print("No resume text provided. Exiting.")
        return

    predict(resume_text)


if __name__ == "__main__":
    main()
