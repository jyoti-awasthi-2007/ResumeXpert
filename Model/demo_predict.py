"""Interactive and CLI demonstration script for the ResumeXpert career prediction model.

Usage:
    python demo_predict.py
    python demo_predict.py "Python, Pandas, Scikit-learn, SQL, machine learning models"
"""
from __future__ import annotations

import sys
from pathlib import Path
from joblib import load

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "artifacts" / "career_classifier.joblib"


def get_top_contributing_words(pipeline, text: str, predicted_class: str, top_k: int = 5) -> list[str]:
    """Find features present in the input text that have high positive coefficients for the predicted class."""
    try:
        vectorizer = pipeline.named_steps["tfidf"]
        classifier = pipeline.named_steps["classifier"]
        feature_names = vectorizer.get_feature_names_out()
        class_idx = list(classifier.classes_).index(predicted_class)
        weights = classifier.coef_[class_idx]

        # Transform input
        vec = vectorizer.transform([text]).toarray()[0]
        present_indices = [idx for idx in range(len(vec)) if vec[idx] > 0]

        # Rank present features by positive weight
        ranked = sorted(present_indices, key=lambda idx: weights[idx], reverse=True)
        return [feature_names[idx] for idx in ranked[:top_k] if weights[idx] > 0]
    except Exception:
        return []


def run_demo(resume_text: str) -> None:
    if not MODEL_PATH.exists():
        print(f"Error: Model not found at {MODEL_PATH}.")
        print("Please train the model first by running: python train_model.py")
        sys.exit(1)

    model = load(MODEL_PATH)
    prediction = model.predict([resume_text])[0]
    probabilities = model.predict_proba([resume_text])[0]
    classes = list(model.classes_)

    ranked = sorted(zip(classes, probabilities), key=lambda item: item[1], reverse=True)
    top_pred, top_prob = ranked[0]

    # Summarize input text
    cleaned_words = resume_text.strip().split()
    input_word_count = len(cleaned_words)
    input_preview = " ".join(cleaned_words[:25]) + ("..." if input_word_count > 25 else "")
    contributing_terms = get_top_contributing_words(model, resume_text, top_pred, top_k=5)

    print()
    print("========================================")
    print("RESUMEXPERT MODEL PREDICTION")
    print("========================================")
    print()
    print("Predicted Career:")
    print(f"  {top_pred}")
    print()
    print("Confidence / Probability:")
    print(f"  {top_prob:.2%} ({top_prob:.4f})")
    print()
    print("Top 3 Predictions:")
    for rank, (career, prob) in enumerate(ranked[:3], start=1):
        print(f"  {rank}. {career:26s} -- {prob:6.2%}")
    print()
    print("Input Summary:")
    print(f"  Total words : {input_word_count}")
    print(f"  Snippet     : \"{input_preview}\"")
    if contributing_terms:
        print(f"  Key terms   : {', '.join(contributing_terms)}")
    print("========================================")
    print()


def main() -> None:
    if len(sys.argv) > 1:
        resume_text = " ".join(sys.argv[1:]).strip()
    else:
        print("==================================================")
        print("ResumeXpert Career Classifier — Interactive Demo")
        print("==================================================")
        try:
            resume_text = input("Paste resume text: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nDemo cancelled.")
            return

    if not resume_text:
        print("No resume text provided. Please enter resume or skill keywords.")
        return

    run_demo(resume_text)


if __name__ == "__main__":
    main()
