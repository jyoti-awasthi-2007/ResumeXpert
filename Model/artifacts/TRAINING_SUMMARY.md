# Training Summary

- Task: Resume text → career classification
- Dataset: synthetic_resume_career_dataset.csv
- Dataset size: 1,600 examples
- Number of classes: 8
- Train/test split: 80% / 20%
- Random seed: 42
- Feature extraction: TF-IDF (unigrams + bigrams)
- Classifier: Logistic Regression
- Model artifact: career_classifier.joblib

See `metrics.json` and `classification_report.txt` for the generated evaluation metrics.

**Important:** Because the dataset is synthetic, these metrics demonstrate the training pipeline but are not representative of real-world performance.
