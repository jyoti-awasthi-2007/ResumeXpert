"""Train the offline ResumeXpert career-classification demonstration model.

IMPORTANT:
- This script trains strictly on dataset/synthetic_resume_career_dataset.csv.
- It NEVER touches or trains on the independent challenge dataset.
- The test set is evaluated independently and never used to fit the pipeline.
- All evaluation artifacts, metric tables, and diagnostic plots are saved to artifacts/.
"""
from __future__ import annotations

import json
import random
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
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
from sklearn.model_selection import learning_curve, train_test_split
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
    print("==================================================")
    print("RESUMEXPERT MODEL TRAINING & EVALUATION")
    print("==================================================")

    # 1. Dataset Loading / Generation
    if not DATASET_PATH.exists():
        print(f"Generating synthetic dataset at {DATASET_PATH}...")
        df = generate_dataset()
        DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(DATASET_PATH, index=False)
    else:
        print(f"Loading dataset from {DATASET_PATH}...")
        df = pd.read_csv(DATASET_PATH)

    print(f"Dataset successfully loaded: {len(df):,} total samples across {df['career'].nunique()} classes.")

    # 2. Stratified Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        df["resume_text"],
        df["career"],
        test_size=0.20,
        random_state=SEED,
        stratify=df["career"],
    )

    print(f"Split completed: Train={len(X_train)} samples (80%), Test={len(X_test)} samples (20%).")

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

    # 4. Pipeline Fitting (Strictly on X_train)
    print("Fitting TF-IDF Vectorizer and Logistic Regression classifier on training data...")
    pipeline.fit(X_train, y_train)

    # 5. Prediction & Evaluation on Held-Out Test Split
    print("Evaluating model on held-out test split (320 samples)...")
    predictions = pipeline.predict(X_test)
    probabilities = pipeline.predict_proba(X_test)

    labels = sorted(list(pipeline.classes_))
    accuracy = float(accuracy_score(y_test, predictions))
    macro_precision = float(precision_score(y_test, predictions, average="macro", zero_division=0))
    macro_recall = float(recall_score(y_test, predictions, average="macro", zero_division=0))
    macro_f1 = float(f1_score(y_test, predictions, average="macro", zero_division=0))
    weighted_precision = float(precision_score(y_test, predictions, average="weighted", zero_division=0))
    weighted_recall = float(recall_score(y_test, predictions, average="weighted", zero_division=0))
    weighted_f1 = float(f1_score(y_test, predictions, average="weighted", zero_division=0))

    report_dict = classification_report(y_test, predictions, output_dict=True, digits=4)
    cm = confusion_matrix(y_test, predictions, labels=labels)

    # 6. Model Serialization
    model_file = ARTIFACTS / "career_classifier.joblib"
    dump(pipeline, model_file)
    print(f"Trained model serialized to: {model_file}")

    # 7. Save Metrics & CSV Report
    vectorizer: TfidfVectorizer = pipeline.named_steps["tfidf"]
    classifier: LogisticRegression = pipeline.named_steps["classifier"]
    vocab_size = len(vectorizer.vocabulary_)

    metrics = {
        "model_algorithm": "TF-IDF Vectorizer + Multinomial Logistic Regression",
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
        "tfidf_ngram_range": [1, 2],
        "tfidf_vocabulary_size": vocab_size,
        "standard_test_accuracy": round(accuracy, 6),
        "standard_test_macro_precision": round(macro_precision, 6),
        "standard_test_macro_recall": round(macro_recall, 6),
        "standard_test_macro_f1": round(macro_f1, 6),
        "standard_test_weighted_precision": round(weighted_precision, 6),
        "standard_test_weighted_recall": round(weighted_recall, 6),
        "standard_test_weighted_f1": round(weighted_f1, 6),
    }
    (ARTIFACTS / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    # Save classification report as CSV
    report_df = pd.DataFrame(report_dict).transpose().reset_index()
    report_df.rename(columns={"index": "career_or_metric"}, inplace=True)
    report_df.to_csv(ARTIFACTS / "classification_report.csv", index=False)

    # Save confusion matrix CSV
    cm_df = pd.DataFrame(cm, index=labels, columns=labels)
    cm_df.to_csv(ARTIFACTS / "confusion_matrix.csv")

    # 8. Plot 1: Confusion Matrix Visualization Heatmap
    fig, ax = plt.subplots(figsize=(9, 7.5))
    im = ax.imshow(cm, interpolation="nearest", cmap="Blues")
    ax.set_title("ResumeXpert Career Classifier — Confusion Matrix", fontsize=13, fontweight="bold", pad=12)
    fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    ax.set_xlabel("Predicted Career Class", fontsize=11, fontweight="bold", labelpad=10)
    ax.set_ylabel("Actual Career Class", fontsize=11, fontweight="bold", labelpad=10)
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

    # 9. Plot 2: Class Distribution Visualization Plot
    class_counts = df["career"].value_counts()[labels]
    fig2, ax2 = plt.subplots(figsize=(9.5, 5.5))
    bars = ax2.barh(labels, class_counts.values, color="#2563EB", edgecolor="#1D4ED8", height=0.6)
    ax2.set_title("Resume Career Dataset — Class Distribution (Samples per Career)", fontsize=13, fontweight="bold", pad=12)
    ax2.set_xlabel("Number of Samples", fontsize=11, fontweight="bold", labelpad=8)
    ax2.set_ylabel("Career Class", fontsize=11, fontweight="bold")
    ax2.set_xlim(0, max(class_counts.values) * 1.18)
    for bar in bars:
        width = bar.get_width()
        ax2.text(width + 3, bar.get_y() + bar.get_height() / 2, f"{int(width)} ({width/len(df):.1%})",
                 va="center", fontsize=9, fontweight="bold")
    ax2.grid(axis="x", linestyle="--", alpha=0.5)
    fig2.tight_layout()
    fig2.savefig(ARTIFACTS / "class_distribution.png", dpi=180)
    plt.close(fig2)

    # 10. Plot 3: Per-Class Metric Graph (Precision, Recall, F1 for every career)
    class_metrics = [report_dict[c] for c in labels]
    precisions = [m["precision"] for m in class_metrics]
    recalls = [m["recall"] for m in class_metrics]
    f1s = [m["f1-score"] for m in class_metrics]

    x = np.arange(len(labels))
    width = 0.25

    fig3, ax3 = plt.subplots(figsize=(11, 6))
    ax3.bar(x - width, precisions, width, label="Precision", color="#3B82F6")
    ax3.bar(x, recalls, width, label="Recall", color="#10B981")
    ax3.bar(x + width, f1s, width, label="F1-Score", color="#F59E0B")
    ax3.set_title("Per-Class Performance Metrics (Test Set)", fontsize=13, fontweight="bold", pad=12)
    ax3.set_ylabel("Score (0.0 to 1.0)", fontsize=11, fontweight="bold")
    ax3.set_xticks(x)
    ax3.set_xticklabels(labels, rotation=35, ha="right", fontsize=9)
    ax3.set_ylim(0, 1.15)
    ax3.legend(loc="upper right", framealpha=0.9)
    ax3.grid(axis="y", linestyle="--", alpha=0.4)
    fig3.tight_layout()
    fig3.savefig(ARTIFACTS / "per_class_metrics.png", dpi=180)
    plt.close(fig3)

    # 11. Plot 4 & CSV: Top Features by Class
    feature_names = vectorizer.get_feature_names_out()
    records = []
    top_n_features = 8
    fig4, axes = plt.subplots(4, 2, figsize=(14, 16))
    axes = axes.flatten()

    for class_index, career in enumerate(classifier.classes_):
        weights = classifier.coef_[class_index]
        top_indices = weights.argsort()[-15:][::-1]
        for rank, feature_index in enumerate(top_indices, start=1):
            records.append({
                "career": career,
                "rank": rank,
                "feature": feature_names[feature_index],
                "coefficient": float(weights[feature_index]),
            })

        # Plot top 8 for this class in subplot
        top_plot_idx = weights.argsort()[-top_n_features:]
        top_plot_terms = [feature_names[i] for i in top_plot_idx]
        top_plot_weights = [weights[i] for i in top_plot_idx]

        ax = axes[class_index]
        ax.barh(top_plot_terms, top_plot_weights, color="#4F46E5", edgecolor="#3730A3", height=0.6)
        ax.set_title(career, fontsize=11, fontweight="bold")
        ax.set_xlabel("Coefficient Weight", fontsize=9)
        ax.grid(axis="x", linestyle="--", alpha=0.5)

    fig4.suptitle("Top Discriminative TF-IDF Features by Career Class", fontsize=15, fontweight="bold", y=0.995)
    fig4.tight_layout()
    fig4.savefig(ARTIFACTS / "top_features_by_class.png", dpi=180)
    plt.close(fig4)

    pd.DataFrame(records).to_csv(ARTIFACTS / "top_features_by_class.csv", index=False)

    # 12. Plot 5: Scikit-Learn Learning Curve
    print("Computing cross-validated learning curve...")
    train_sizes, train_scores, test_scores = learning_curve(
        pipeline,
        X_train,
        y_train,
        cv=5,
        scoring="accuracy",
        train_sizes=np.linspace(0.2, 1.0, 5),
        random_state=SEED,
        n_jobs=1,
    )

    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    test_mean = np.mean(test_scores, axis=1)
    test_std = np.std(test_scores, axis=1)

    fig5, ax5 = plt.subplots(figsize=(8.5, 5.5))
    ax5.plot(train_sizes, train_mean, "o-", color="#DC2626", label="Training Score", linewidth=2)
    ax5.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.15, color="#DC2626")
    ax5.plot(train_sizes, test_mean, "s-", color="#2563EB", label="Cross-Validation Score", linewidth=2)
    ax5.fill_between(train_sizes, test_mean - test_std, test_mean + test_std, alpha=0.15, color="#2563EB")
    ax5.set_title("Model Learning Curve (TF-IDF + Logistic Regression)", fontsize=13, fontweight="bold", pad=12)
    ax5.set_xlabel("Training Set Size (Samples)", fontsize=11, fontweight="bold", labelpad=8)
    ax5.set_ylabel("Accuracy Score", fontsize=11, fontweight="bold", labelpad=8)
    ax5.set_ylim(0.7, 1.05)
    ax5.legend(loc="lower right", framealpha=0.9)
    ax5.grid(True, linestyle="--", alpha=0.4)
    fig5.tight_layout()
    fig5.savefig(ARTIFACTS / "learning_curve.png", dpi=180)
    plt.close(fig5)

    print("==================================================")
    print("TRAINING & INITIAL EVALUATION COMPLETE")
    print(f"Standard Test Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Macro F1: {macro_f1:.4f} | Weighted F1: {weighted_f1:.4f}")
    print(f"Generated artifacts saved to {ARTIFACTS}")
    print("==================================================")

    return Bunch(model=pipeline, metrics=metrics, probabilities=probabilities)


if __name__ == "__main__":
    train()
