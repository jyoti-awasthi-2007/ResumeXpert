"""Comprehensive evaluation script for the trained ResumeXpert model.

Performs:
1. Independent Challenge Evaluation on dataset/challenge_resume_dataset.csv
2. Saves artifacts/challenge_predictions.csv
3. Generates artifacts/challenge_accuracy.png (Standard vs Challenge accuracy)
4. Generates artifacts/prediction_probabilities.png for a representative profile
5. Generates artifacts/sample_predictions.csv for 10 realistic held-out samples
6. Updates artifacts/metrics.json with challenge results
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from joblib import load

ROOT = Path(__file__).resolve().parent
ARTIFACTS = ROOT / "artifacts"
DATASET_DIR = ROOT / "dataset"

MODEL_FILE = ARTIFACTS / "career_classifier.joblib"
METRICS_FILE = ARTIFACTS / "metrics.json"
CHALLENGE_CSV = DATASET_DIR / "challenge_resume_dataset.csv"

# 10 Realistic held-out sample profiles representing all 8 classes
DEMO_SAMPLES = [
    {
        "sample_id": "SAMPLE-DS-01",
        "expected_class": "Data Scientist",
        "resume_text": (
            "Senior undergraduate specializing in Data Science. Skilled in Python, Pandas, NumPy, "
            "Scikit-learn, statistical hypothesis testing, and SQL. Completed an end-to-end predictive "
            "modeling project forecasting customer churn with logistic regression and random forests. "
            "Proficient in exploratory data analysis using Matplotlib, Seaborn, and Jupyter notebooks."
        ),
    },
    {
        "sample_id": "SAMPLE-MLE-02",
        "expected_class": "Machine Learning Engineer",
        "resume_text": (
            "AI and ML enthusiast with hands-on experience in PyTorch, TensorFlow, and Scikit-learn. "
            "Designed and trained deep learning convolutional neural networks for computer vision. "
            "Containerized inference endpoints using Docker and deployed real-time APIs using FastAPI. "
            "Experienced with MLflow for experiment tracking and Kubernetes for scaling workloads."
        ),
    },
    {
        "sample_id": "SAMPLE-DA-03",
        "expected_class": "Data Analyst",
        "resume_text": (
            "Business analytics professional with expertise in advanced SQL queries, window functions, "
            "Excel pivot tables, and dashboard creation in Power BI and Tableau. Analyzed monthly revenue "
            "and user acquisition KPIs to produce executive reports. Working knowledge of Python and Pandas "
            "for automated data transformation and data visualization."
        ),
    },
    {
        "sample_id": "SAMPLE-FSD-04",
        "expected_class": "Full Stack Developer",
        "resume_text": (
            "Full Stack Web Developer proficient in JavaScript, TypeScript, React, Node.js, Express, and "
            "MongoDB. Developed scalable web applications featuring user authentication, role-based access "
            "control, and RESTful APIs. Experience with Next.js, Tailwind CSS, Docker, and Git collaborative workflows."
        ),
    },
    {
        "sample_id": "SAMPLE-FED-05",
        "expected_class": "Frontend Developer",
        "resume_text": (
            "Frontend Engineer focused on building responsive, accessible, and high-performance user interfaces. "
            "Expert in modern JavaScript (ES6+), TypeScript, React, HTML5, CSS3, and Tailwind CSS. Built animated "
            "single-page applications with Vite, Redux Toolkit, Framer Motion, and translated Figma wireframes into code."
        ),
    },
    {
        "sample_id": "SAMPLE-BED-06",
        "expected_class": "Backend Developer",
        "resume_text": (
            "Backend Systems Developer experienced in designing high-throughput REST APIs and microservices using "
            "Python, FastAPI, Node.js, and Express. Proficient in database modeling with PostgreSQL and SQL, Redis caching, "
            "JWT token authentication, and Docker containerization. Focused on API performance and query optimization."
        ),
    },
    {
        "sample_id": "SAMPLE-DOE-07",
        "expected_class": "DevOps Engineer",
        "resume_text": (
            "Cloud and DevOps Practitioner with hands-on expertise in Linux administration, Docker containerization, "
            "Kubernetes pod orchestration, and AWS cloud infrastructure. Built automated CI/CD deployment pipelines using "
            "GitHub Actions and provisioned reproducible infrastructure with Terraform. Configured Prometheus and Grafana monitoring."
        ),
    },
    {
        "sample_id": "SAMPLE-CSA-08",
        "expected_class": "Cybersecurity Analyst",
        "resume_text": (
            "Information Security Analyst skilled in network security fundamentals, packet inspection using Wireshark, "
            "Linux system auditing, and incident response procedures. Conducted vulnerability assessments using Nmap and "
            "Burp Suite. Experienced in monitoring security events, analyzing alerts in SIEM tools like Splunk, and firewall configuration."
        ),
    },
    {
        "sample_id": "SAMPLE-DS-09",
        "expected_class": "Data Scientist",
        "resume_text": (
            "Applied data scientist with strong background in mathematical statistics, linear algebra, Python, SQL, "
            "and machine learning. Performed feature engineering and hyperparameter tuning on complex tabular datasets. "
            "Built data visualization dashboards in Matplotlib to present actionable machine learning findings."
        ),
    },
    {
        "sample_id": "SAMPLE-BED-10",
        "expected_class": "Backend Developer",
        "resume_text": (
            "Server-side engineer with background in building RESTful services, relational database schemas in PostgreSQL, "
            "asynchronous job queues in Redis, and OAuth2 security. Clean modular architecture in Python and FastAPI."
        ),
    },
]


def evaluate() -> None:
    print("==================================================")
    print("RESUMEXPERT INDEPENDENT CHALLENGE EVALUATION")
    print("==================================================")

    if not MODEL_FILE.exists():
        raise FileNotFoundError(f"Model file not found at {MODEL_FILE}. Run python train_model.py first.")

    model = load(MODEL_FILE)
    classes = list(model.classes_)

    # 1. Evaluate on Independent Challenge Dataset
    if not CHALLENGE_CSV.exists():
        raise FileNotFoundError(f"Challenge dataset not found at {CHALLENGE_CSV}.")

    chal_df = pd.read_csv(CHALLENGE_CSV)
    print(f"Loaded {len(chal_df)} challenge resumes across {chal_df['career'].nunique()} career classes.")

    chal_predictions = model.predict(chal_df["resume_text"])
    chal_probs = model.predict_proba(chal_df["resume_text"])

    challenge_records = []
    correct_count = 0
    for idx, row in chal_df.iterrows():
        expected = row["career"]
        predicted = chal_predictions[idx]
        is_corr = bool(predicted.strip().lower() == expected.strip().lower())
        if is_corr:
            correct_count += 1

        pred_idx = classes.index(predicted)
        top_p = float(chal_probs[idx][pred_idx])

        challenge_records.append({
            "sample_id": row["sample_id"],
            "expected_career": expected,
            "predicted_career": predicted,
            "correct": is_corr,
            "top_probability": round(top_p, 4),
        })

    challenge_acc = correct_count / len(chal_df)
    print(f"Challenge Accuracy: {challenge_acc:.4f} ({correct_count}/{len(chal_df)} correct, {challenge_acc*100:.2f}%)")

    # Save artifacts/challenge_predictions.csv
    pd.DataFrame(challenge_records).to_csv(ARTIFACTS / "challenge_predictions.csv", index=False)
    print(f"Saved challenge predictions to {ARTIFACTS / 'challenge_predictions.csv'}")

    # Load existing standard test metrics
    metrics = {}
    if METRICS_FILE.exists():
        try:
            metrics = json.loads(METRICS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass

    std_acc = metrics.get("standard_test_accuracy", 1.0)
    metrics["challenge_dataset"] = CHALLENGE_CSV.name
    metrics["challenge_samples"] = len(chal_df)
    metrics["challenge_correct"] = correct_count
    metrics["challenge_accuracy"] = round(challenge_acc, 6)
    (ARTIFACTS / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    # 2. Graph: Challenge Accuracy vs Standard Test Accuracy
    fig, ax = plt.subplots(figsize=(7.5, 5))
    bars = ax.bar(["Standard Test Split\n(Controlled Synthetic)", "Independent Challenge Set\n(Complex Overlapping)"],
                  [std_acc * 100, challenge_acc * 100],
                  color=["#2563EB", "#059669"], width=0.45, edgecolor=["#1D4ED8", "#047857"])
    ax.set_title("Standard Test Accuracy vs Independent Challenge Accuracy", fontsize=12, fontweight="bold", pad=12)
    ax.set_ylabel("Accuracy (%)", fontsize=11, fontweight="bold")
    ax.set_ylim(0, 115)
    for bar in bars:
        h = bar.get_height()
        ax.text(bar.get_x() + bar.get_width() / 2, h + 2, f"{h:.2f}%", ha="center", fontsize=10, fontweight="bold")
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    fig.tight_layout()
    fig.savefig(ARTIFACTS / "challenge_accuracy.png", dpi=180)
    plt.close(fig)
    print(f"Saved accuracy comparison plot to {ARTIFACTS / 'challenge_accuracy.png'}")

    # 3. Graph: Prediction Probabilities for a Sample Resume
    sample_eval_text = (
        "Experienced in Python, SQL, Pandas, NumPy, Scikit-learn, exploratory data analysis, "
        "and building predictive machine learning models. Familiar with Git and Docker."
    )
    sample_probs = model.predict_proba([sample_eval_text])[0]
    sample_pred = model.predict([sample_eval_text])[0]

    # Sort probabilities descending for horizontal bar chart
    sorted_indices = np.argsort(sample_probs)
    sorted_classes = [classes[i] for i in sorted_indices]
    sorted_p = [sample_probs[i] * 100 for i in sorted_indices]

    fig2, ax2 = plt.subplots(figsize=(9, 5.5))
    colors = ["#2563EB" if c == sample_pred else "#94A3B8" for c in sorted_classes]
    bars2 = ax2.barh(sorted_classes, sorted_p, color=colors, height=0.6)
    ax2.set_title(f"Prediction Probabilities for Representative Profile\nPredicted: {sample_pred}",
                  fontsize=12, fontweight="bold", pad=10)
    ax2.set_xlabel("Probability (%)", fontsize=10, fontweight="bold")
    ax2.set_xlim(0, max(sorted_p) * 1.25)
    for bar in bars2:
        w = bar.get_width()
        ax2.text(w + 1, bar.get_y() + bar.get_height() / 2, f"{w:.2f}%", va="center", fontsize=9, fontweight="bold")
    ax2.grid(axis="x", linestyle="--", alpha=0.4)
    fig2.tight_layout()
    fig2.savefig(ARTIFACTS / "prediction_probabilities.png", dpi=180)
    plt.close(fig2)
    print(f"Saved prediction probability plot to {ARTIFACTS / 'prediction_probabilities.png'}")

    # 4. Generate artifacts/sample_predictions.csv
    sample_records = []
    print("\nEvaluating 10 realistic held-out sample profiles...")
    for s in DEMO_SAMPLES:
        text = s["resume_text"]
        exp = s["expected_class"]
        pred = model.predict([text])[0]
        p_vec = model.predict_proba([text])[0]
        p_top = float(p_vec[classes.index(pred)])
        is_c = bool(pred.strip().lower() == exp.strip().lower())

        words = text.split()
        summary = " ".join(words[:12]) + "..."
        sample_records.append({
            "sample_id": s["sample_id"],
            "input_summary": summary,
            "expected_class": exp,
            "predicted_class": pred,
            "probability": round(p_top, 4),
            "correct": is_c,
        })
    pd.DataFrame(sample_records).to_csv(ARTIFACTS / "sample_predictions.csv", index=False)
    print(f"Saved sample predictions to {ARTIFACTS / 'sample_predictions.csv'}")

    print("\n==================================================")
    print("EVALUATION & ARTIFACT GENERATION COMPLETE")
    print(f"Standard Test Accuracy  : {std_acc:.2%}")
    print(f"Challenge Test Accuracy : {challenge_acc:.2%}")
    print("==================================================")


if __name__ == "__main__":
    evaluate()
