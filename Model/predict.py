"""Run the offline ResumeXpert career classifier for single predictions."""
from __future__ import annotations

import argparse
from pathlib import Path

from joblib import load

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "artifacts" / "career_classifier.joblib"


def predict_career(text: str) -> dict:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run `python train_model.py` first.")

    model = load(MODEL_PATH)
    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    classes = model.classes_

    ranked = sorted(zip(classes, probabilities), key=lambda item: item[1], reverse=True)
    return {
        "predicted_career": prediction,
        "top_probability": ranked[0][1],
        "ranked_probabilities": ranked,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Predict a career from resume text.")
    parser.add_argument("resume_text", nargs="?", help="Resume text or a short skills/profile description.")
    args = parser.parse_args()

    text = args.resume_text
    if not text:
        text = input("Enter or paste resume text: ").strip()
        if not text:
            print("No resume text provided. Exiting.")
            return

    result = predict_career(text)
    print(f"\nPredicted career: {result['predicted_career']}")
    print("Career probabilities:")
    for career, probability in result["ranked_probabilities"]:
        print(f"  {career:26s}: {probability:6.2%}")


if __name__ == "__main__":
    main()
