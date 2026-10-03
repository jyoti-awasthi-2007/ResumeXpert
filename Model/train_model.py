"""Train an offline ResumeXpert career-classification demonstration model.

IMPORTANT: This script creates and trains on a synthetic dataset for demonstration.
The resulting model is NOT integrated into the deployed ResumeXpert application.
"""
from __future__ import annotations

import json
import random
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from joblib import dump
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.utils import Bunch

SEED = 42
SAMPLES_PER_CLASS = 200
RANDOM = random.Random(SEED)
ROOT = Path(__file__).resolve().parent
DATASET_PATH = ROOT / "dataset" / "synthetic_resume_career_dataset.csv"
ARTIFACTS = ROOT / "artifacts"
ARTIFACTS.mkdir(parents=True, exist_ok=True)

CAREER_PROFILES = {
    "Data Scientist": {
        "core": ["python", "pandas", "numpy", "scikit-learn", "statistics", "machine learning", "sql"],
        "support": ["matplotlib", "seaborn", "jupyter", "feature engineering", "data visualization", "tensorflow"],
        "projects": [
            "built predictive models and analyzed structured datasets",
            "created a customer churn prediction workflow",
            "developed classification and regression experiments",
        ],
    },
    "Machine Learning Engineer": {
        "core": ["python", "pytorch", "tensorflow", "scikit-learn", "machine learning", "deep learning", "docker"],
        "support": ["mlflow", "fastapi", "numpy", "pandas", "kubernetes", "aws", "model deployment"],
        "projects": [
            "deployed machine learning inference services",
            "built deep learning pipelines and model APIs",
            "optimized training and production inference workflows",
        ],
    },
    "Data Analyst": {
        "core": ["sql", "excel", "power bi", "tableau", "python", "pandas", "data visualization"],
        "support": ["statistics", "dashboarding", "reporting", "business intelligence", "google sheets", "matplotlib"],
        "projects": [
            "built business dashboards and KPI reports",
            "analyzed sales and customer behavior data",
            "created automated reporting workflows",
        ],
    },
    "Full Stack Developer": {
        "core": ["javascript", "typescript", "react", "node.js", "express", "html", "css", "mongodb"],
        "support": ["next.js", "git", "rest api", "tailwind css", "sql", "docker", "firebase"],
        "projects": [
            "built full stack web applications with authentication",
            "developed REST APIs and responsive frontend interfaces",
            "created database-backed web applications",
        ],
    },
    "Frontend Developer": {
        "core": ["javascript", "typescript", "react", "html", "css", "tailwind css", "vite"],
        "support": ["next.js", "redux", "figma", "responsive design", "framer motion", "git", "rest api"],
        "projects": [
            "built responsive and accessible user interfaces",
            "created animated React dashboards and component systems",
            "implemented responsive web experiences from design files",
        ],
    },
    "Backend Developer": {
        "core": ["python", "fastapi", "node.js", "express", "sql", "postgresql", "rest api"],
        "support": ["redis", "docker", "authentication", "jwt", "mongodb", "git", "microservices"],
        "projects": [
            "built scalable backend services and REST APIs",
            "implemented authentication and database integrations",
            "designed server-side business logic and API systems",
        ],
    },
    "DevOps Engineer": {
        "core": ["linux", "docker", "kubernetes", "aws", "ci/cd", "github actions", "terraform"],
        "support": ["python", "bash", "nginx", "prometheus", "grafana", "azure", "gcp"],
        "projects": [
            "automated deployment pipelines and cloud infrastructure",
            "containerized applications and managed production environments",
            "implemented monitoring and continuous delivery workflows",
        ],
    },
    "Cybersecurity Analyst": {
        "core": ["network security", "linux", "python", "siem", "wireshark", "penetration testing", "incident response"],
        "support": ["splunk", "nmap", "burp suite", "firewalls", "vulnerability assessment", "threat analysis", "bash"],
        "projects": [
            "performed vulnerability assessment and incident analysis",
            "monitored security events and investigated suspicious activity",
            "conducted network traffic analysis and penetration testing labs",
        ],
    },
}

EDUCATION = [
    "B.Tech Computer Engineering",
    "B.E. Computer Science",
    "B.Sc. Computer Science",
    "M.Tech Artificial Intelligence",
    "Engineering student with software development experience",
]

NOISE_SKILLS = [
    "git", "python", "sql", "docker", "linux", "rest api", "communication", "problem solving",
    "agile", "teamwork", "project management", "research", "github",
]


def _sample_without_replacement(items: list[str], count: int) -> list[str]:
    if count >= len(items):
        return list(items)
    return RANDOM.sample(items, count)


def generate_dataset() -> pd.DataFrame:
    rows: list[dict[str, str]] = []
    for career, profile in CAREER_PROFILES.items():
        for index in range(SAMPLES_PER_CLASS):
            core_count = min(len(profile["core"]), RANDOM.randint(max(4, len(profile["core"]) - 2), len(profile["core"])))
            support_count = RANDOM.randint(1, min(4, len(profile["support"])))
            skills = _sample_without_replacement(profile["core"], core_count)
            skills += _sample_without_replacement(profile["support"], support_count)

            # Add cross-career noise so the classifier learns patterns from
            # skills/projects rather than a perfectly clean class boundary.
            if RANDOM.random() < 0.80:
                skills.append(RANDOM.choice(NOISE_SKILLS))
            if RANDOM.random() < 0.35:
                other_careers = [name for name in CAREER_PROFILES if name != career]
                other = RANDOM.choice(other_careers)
                skills.append(RANDOM.choice(CAREER_PROFILES[other]["core"]))
            skills = list(dict.fromkeys(skills))

            project = RANDOM.choice(profile["projects"])
            education = RANDOM.choice(EDUCATION)
            experience_years = RANDOM.randint(0, 5)
            experience_phrase = (
                "internship experience"
                if experience_years == 0
                else f"{experience_years} years of practical experience"
            )

            resume_text = (
                f"Education: {education}. "
                f"Technical skills: {', '.join(skills)}. "
                f"Experience: {experience_phrase}. "
                f"Project work: {project}. "
                f"Worked with Git and collaborative software development practices. "
                f"Interested in solving practical technical problems and building measurable solutions."
            )

            rows.append({
                "id": f"{career[:3].upper()}-{index+1:04d}",
                "resume_text": resume_text,
                "career": career,
            })
    return pd.DataFrame(rows)


def train() -> Bunch:
    # 1. Dataset Generation & Persistence
    df = generate_dataset()
    DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(DATASET_PATH, index=False)

    # 2. Stratified Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        df["resume_text"],
        df["career"],
        test_size=0.20,
        random_state=SEED,
        stratify=df["career"],
    )

    # 3. Model Pipeline Construction
    pipeline = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                ngram_range=(1, 2),
                min_df=2,
                max_df=0.95,
                sublinear_tf=True,
            ),
        ),
        (
            "classifier",
            LogisticRegression(
                max_iter=2500,
                class_weight="balanced",
                random_state=SEED,
            ),
        ),
    ])

    # 4. Pipeline Fitting
    pipeline.fit(X_train, y_train)

    # 5. Prediction & Probability Estimation
    predictions = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)

    # 6. Evaluation Metrics Computation
    labels = list(pipeline.classes_)
    accuracy = float(accuracy_score(y_test, predictions))
    macro_precision = float(precision_score(y_test, predictions, average="macro", zero_division=0))
    macro_recall = float(recall_score(y_test, predictions, average="macro", zero_division=0))
    macro_f1 = float(f1_score(y_test, predictions, average="macro", zero_division=0))
    weighted_precision = float(precision_score(y_test, predictions, average="weighted", zero_division=0))
    weighted_recall = float(recall_score(y_test, predictions, average="weighted", zero_division=0))
    weighted_f1 = float(f1_score(y_test, predictions, average="weighted", zero_division=0))

    report_text = classification_report(y_test, predictions, digits=4)
    report_dict = classification_report(y_test, predictions, output_dict=True, digits=4)
    cm = confusion_matrix(y_test, predictions, labels=labels)

    # 7. Model Serialization
    dump(pipeline, ARTIFACTS / "career_classifier.joblib")

    # 8. Save Metrics & Reports
    vectorizer: TfidfVectorizer = pipeline.named_steps["tfidf"]
    classifier: LogisticRegression = pipeline.named_steps["classifier"]
    vocab_size = len(vectorizer.vocabulary_)

    metrics = {
        "task": "resume_text_to_career_classification",
        "dataset": DATASET_PATH.name,
        "dataset_type": "synthetic",
        "random_seed": SEED,
        "total_samples": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "test_split_ratio": 0.20,
        "num_classes": int(len(labels)),
        "classes": labels,
        "model": "TF-IDF + Logistic Regression",
        "tfidf_ngram_range": [1, 2],
        "tfidf_vocabulary_size": vocab_size,
        "accuracy": round(accuracy, 6),
        "macro_precision": round(macro_precision, 6),
        "macro_recall": round(macro_recall, 6),
        "macro_f1": round(macro_f1, 6),
        "weighted_precision": round(weighted_precision, 6),
        "weighted_recall": round(weighted_recall, 6),
        "weighted_f1": round(weighted_f1, 6),
    }
    (ARTIFACTS / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    (ARTIFACTS / "classification_report.txt").write_text(report_text, encoding="utf-8")

    # Save classification report as CSV
    report_df = pd.DataFrame(report_dict).transpose().reset_index()
    report_df.rename(columns={"index": "class_or_metric"}, inplace=True)
    report_df.to_csv(ARTIFACTS / "classification_report.csv", index=False)

    # Save confusion matrix CSV
    cm_df = pd.DataFrame(cm, index=labels, columns=labels)
    cm_df.to_csv(ARTIFACTS / "confusion_matrix.csv")

    # 9. Confusion Matrix Visualization Plot
    fig, ax = plt.subplots(figsize=(10, 8))
    im = ax.imshow(cm, interpolation="nearest", cmap="Blues")
    ax.set_title("ResumeXpert Career Classifier — Confusion Matrix", fontsize=14, fontweight="bold", pad=15)
    fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    ax.set_xlabel("Predicted Career Class", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylabel("True Career Class", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_xticks(range(len(labels)))
    ax.set_yticks(range(len(labels)))
    ax.set_xticklabels(labels, rotation=45, ha="right", fontsize=9)
    ax.set_yticklabels(labels, fontsize=9)
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            val = int(cm[i, j])
            color = "white" if val > cm.max() / 2 else "black"
            ax.text(j, i, str(val), ha="center", va="center", color=color, fontweight="bold")
    fig.tight_layout()
    fig.savefig(ARTIFACTS / "confusion_matrix.png", dpi=180)
    plt.close(fig)

    # 10. Class Distribution Visualization Plot
    class_counts = df["career"].value_counts()[labels]
    fig2, ax2 = plt.subplots(figsize=(10, 6))
    bars = ax2.barh(labels, class_counts.values, color="#2563EB", edgecolor="#1D4ED8", height=0.6)
    ax2.set_title("Resume Career Dataset — Class Distribution (Samples per Career)", fontsize=13, fontweight="bold", pad=15)
    ax2.set_xlabel("Number of Samples", fontsize=11, fontweight="bold", labelpad=10)
    ax2.set_ylabel("Career Class", fontsize=11, fontweight="bold")
    ax2.set_xlim(0, max(class_counts.values) * 1.15)
    for bar in bars:
        width = bar.get_width()
        ax2.text(width + 3, bar.get_y() + bar.get_height() / 2, f"{int(width)} ({width/len(df):.1%})",
                 va="center", fontsize=9, fontweight="bold")
    ax2.grid(axis="x", linestyle="--", alpha=0.5)
    fig2.tight_layout()
    fig2.savefig(ARTIFACTS / "class_distribution.png", dpi=180)
    plt.close(fig2)

    # 11. Top Features / Terms per Career Class
    feature_names = vectorizer.get_feature_names_out()
    records = []
    for class_index, career in enumerate(classifier.classes_):
        weights = classifier.coef_[class_index]
        top_indices = weights.argsort()[-15:][::-1]
        for rank, feature_index in enumerate(top_indices, start=1):
            records.append({
                "career": career,
                "rank": rank,
                "term": feature_names[feature_index],
                "coefficient": float(weights[feature_index]),
            })
    top_terms_df = pd.DataFrame(records)
    top_terms_df.to_csv(ARTIFACTS / "top_terms_by_career.csv", index=False)

    print("==================================================")
    print("RESUMEXPERT MODEL TRAINING COMPLETE")
    print("==================================================")
    print(f"Dataset: {DATASET_PATH}")
    print(f"Total Samples: {len(df)}")
    print(f"Train Samples: {len(X_train)} | Test Samples: {len(X_test)}")
    print(f"Classes ({len(labels)}): {', '.join(labels)}")
    print(f"TF-IDF Vocabulary: {vocab_size} features")
    print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Macro F1: {macro_f1:.4f} | Weighted F1: {weighted_f1:.4f}")
    print(f"Artifacts directory: {ARTIFACTS}")
    print("==================================================")
    return Bunch(model=pipeline, metrics=metrics, probabilities=probabilities)


if __name__ == "__main__":
    train()
