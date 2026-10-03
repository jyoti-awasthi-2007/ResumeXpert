"""Run evaluation and predictions on 8+ realistic held-out demonstration resume snippets.

IMPORTANT:
These demonstration samples are strictly held-out demonstration test cases.
They are NOT part of the training data and are evaluated solely to showcase
model inference across all 8 career categories.
"""
from __future__ import annotations

import csv
from pathlib import Path
from joblib import load

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "artifacts" / "career_classifier.joblib"
OUTPUT_CSV = ROOT / "artifacts" / "sample_predictions.csv"

# 8 Realistic resume profiles representing all 8 classes
DEMO_SAMPLES = [
    {
        "sample_id": "DEMO-DS-01",
        "actual_class": "Data Scientist",
        "resume_text": (
            "Senior undergraduate specializing in Data Science. Skilled in Python, Pandas, NumPy, "
            "Scikit-learn, statistical hypothesis testing, and SQL. Completed an end-to-end predictive "
            "modeling project forecasting customer churn with logistic regression and random forests. "
            "Proficient in exploratory data analysis using Matplotlib, Seaborn, and Jupyter notebooks."
        ),
    },
    {
        "sample_id": "DEMO-MLE-02",
        "actual_class": "Machine Learning Engineer",
        "resume_text": (
            "AI and ML enthusiast with hands-on experience in PyTorch, TensorFlow, and Scikit-learn. "
            "Designed and trained deep learning convolutional neural networks for computer vision. "
            "Containerized inference endpoints using Docker and deployed real-time APIs using FastAPI. "
            "Experienced with MLflow for experiment tracking and Kubernetes for scaling workloads."
        ),
    },
    {
        "sample_id": "DEMO-DA-03",
        "actual_class": "Data Analyst",
        "resume_text": (
            "Business analytics professional with expertise in advanced SQL queries, window functions, "
            "Excel pivot tables, and dashboard creation in Power BI and Tableau. Analyzed monthly revenue "
            "and user acquisition KPIs to produce executive reports. Working knowledge of Python and Pandas "
            "for automated data transformation and data visualization."
        ),
    },
    {
        "sample_id": "DEMO-FSD-04",
        "actual_class": "Full Stack Developer",
        "resume_text": (
            "Full Stack Web Developer proficient in JavaScript, TypeScript, React, Node.js, Express, and "
            "MongoDB. Developed scalable web applications featuring user authentication, role-based access "
            "control, and RESTful APIs. Experience with Next.js, Tailwind CSS, Docker, and Git collaborative workflows."
        ),
    },
    {
        "sample_id": "DEMO-FED-05",
        "actual_class": "Frontend Developer",
        "resume_text": (
            "Frontend Engineer focused on building responsive, accessible, and high-performance user interfaces. "
            "Expert in modern JavaScript (ES6+), TypeScript, React, HTML5, CSS3, and Tailwind CSS. Built animated "
            "single-page applications with Vite, Redux Toolkit, Framer Motion, and translated Figma wireframes into code."
        ),
    },
    {
        "sample_id": "DEMO-BED-06",
        "actual_class": "Backend Developer",
        "resume_text": (
            "Backend Systems Developer experienced in designing high-throughput REST APIs and microservices using "
            "Python, FastAPI, Node.js, and Express. Proficient in database modeling with PostgreSQL and SQL, Redis caching, "
            "JWT token authentication, and Docker containerization. Focused on API performance and query optimization."
        ),
    },
    {
        "sample_id": "DEMO-DOE-07",
        "actual_class": "DevOps Engineer",
        "resume_text": (
            "Cloud and DevOps Practitioner with hands-on expertise in Linux administration, Docker containerization, "
            "Kubernetes pod orchestration, and AWS cloud infrastructure. Built automated CI/CD deployment pipelines using "
            "GitHub Actions and provisioned reproducible infrastructure with Terraform. Configured Prometheus and Grafana monitoring."
        ),
    },
    {
        "sample_id": "DEMO-CSA-08",
        "actual_class": "Cybersecurity Analyst",
        "resume_text": (
            "Information Security Analyst skilled in network security fundamentals, packet inspection using Wireshark, "
            "Linux system auditing, and incident response procedures. Conducted vulnerability assessments using Nmap and "
            "Burp Suite. Experienced in monitoring security events, analyzing alerts in SIEM tools like Splunk, and firewall configuration."
        ),
    },
    {
        "sample_id": "DEMO-DS-09",
        "actual_class": "Data Scientist",
        "resume_text": (
            "Applied data scientist with strong background in mathematical statistics, linear algebra, Python, SQL, "
            "and machine learning. Performed feature engineering and hyperparameter tuning on complex tabular datasets. "
            "Built data visualization dashboards in Matplotlib to present actionable machine learning findings."
        ),
    },
    {
        "sample_id": "DEMO-BED-10",
        "actual_class": "Backend Developer",
        "resume_text": (
            "Server-side engineer with background in building RESTful services, relational database schemas in PostgreSQL, "
            "asynchronous job queues in Redis, and OAuth2 security. Clean modular architecture in Python and FastAPI."
        ),
    },
]


def run_sample_predictions() -> list[dict]:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Run `python train_model.py` first.")

    model = load(MODEL_PATH)
    results = []

    print("================================================================================")
    print("RESUMEXPERT HELD-OUT DEMONSTRATION SAMPLE PREDICTIONS")
    print("================================================================================")
    print(f"{'Sample ID':<12} | {'Actual Class':<24} | {'Predicted Class':<24} | {'Prob':<8} | {'Match'}")
    print("-" * 80)

    for item in DEMO_SAMPLES:
        sample_id = item["sample_id"]
        actual = item["actual_class"]
        text = item["resume_text"]

        predicted = model.predict([text])[0]
        probabilities = model.predict_proba([text])[0]
        classes = list(model.classes_)
        pred_idx = classes.index(predicted)
        top_prob = float(probabilities[pred_idx])

        is_correct = (predicted.strip().lower() == actual.strip().lower())
        match_str = "CORRECT" if is_correct else "MISMATCH"

        # Brief summary of input
        words = text.split()
        summary = " ".join(words[:12]) + "..."

        results.append({
            "sample_id": sample_id,
            "input_summary": summary,
            "actual_class": actual,
            "predicted_class": predicted,
            "top_probability": round(top_prob, 4),
            "correct": is_correct,
        })

        print(f"{sample_id:<12} | {actual:<24} | {predicted:<24} | {top_prob:6.2%} | {match_str}")

    print("-" * 80)
    correct_count = sum(1 for r in results if r["correct"])
    print(f"Summary: {correct_count}/{len(results)} demonstration samples classified correctly ({correct_count/len(results):.1%})")
    print("================================================================================")

    # Save to artifacts/sample_predictions.csv
    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["sample_id", "input_summary", "actual_class", "predicted_class", "top_probability", "correct"])
        writer.writeheader()
        writer.writerows(results)

    print(f"Saved sample predictions to: {OUTPUT_CSV}\n")
    return results


if __name__ == "__main__":
    run_sample_predictions()
