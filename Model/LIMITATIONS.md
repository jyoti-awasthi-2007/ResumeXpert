# Model Limitations and Academic Transparency

This document outlines the real-world limitations, constraints, and data characteristics of the ResumeXpert offline career classification model.

---

## 1. Evaluation Accuracy vs. Real-World Expectation

> **MANDATORY PRESENTATION STATEMENT:**  
> **"The measured accuracy is 100.00% on this evaluation dataset."**  
> **"This should NOT be interpreted as 100% real-world accuracy because the dataset is synthetic/controlled and contains highly class-specific keyword patterns."**

### Why Real-World Resumes are Harder to Classify:
1. **Ambiguous Terminology:** Real resumes use diverse, non-standard phrasing (e.g., *"orchestrated digital assets"* instead of *"managed Kubernetes clusters"*).
2. **Formatting & Parsing Noise:** Real resumes parsed from PDF or DOCX often contain OCR errors, misordered columns, broken tables, and missing punctuation.
3. **Cross-Domain Profiles:** Many real candidates possess multidisciplinary experience (e.g., a Full Stack developer who also trains small PyTorch models and configures Docker containers). These candidates have ambiguous class boundaries that yield lower confidence scores.
4. **Length Discrepancies:** Real resumes range from 150 words (fresh graduates) to 2,000 words (senior architects), whereas synthetic examples have relatively consistent length (~70 to 90 words).

---

## 2. Dataset Limitations

1. **Synthetic Nature:** The dataset `synthetic_resume_career_dataset.csv` was generated programmatically using predefined career skill profiles and templates. It is not scraped from LinkedIn, Indeed, Kaggle, or private company HR systems.
2. **Dataset Scale:** 1,600 samples (200 per class) is sufficient for a proof-of-concept linear model, but significantly smaller than industrial NLP corpora (which typically exceed 50,000 to 500,000 labeled profiles).
3. **Closed-World Assumption:** The model can only predict one of the **8 hardcoded career classes**. If an applicant is an *Embedded Systems Engineer*, *Product Manager*, *UI/UX Designer*, or *Mobile App Developer*, the model will forcibly assign them to one of the 8 available classes with high or medium confidence.

---

## 3. Algorithmic Limitations

1. **Bag-of-Words Lack of Semantic Understanding:**
   TF-IDF does not capture true syntactic meaning or word order beyond 2-word bigrams. For example:
   - *"I want to learn Python"* vs *"5 years leading Python development"*
   Both resumes receive identical positive TF-IDF weight for the word `"python"`, despite vastly different candidate seniorities.
2. **Polysemy and Synonymy:**
   Words with multiple meanings (e.g., `"model"`, `"pipeline"`, `"driver"`) receive fixed IDF weights that do not adjust based on sentence context.
3. **Keyword Vulnerability (Adversarial Susceptibility):**
   A candidate could manipulate the model's prediction simply by pasting a list of 20 keywords from a target career into their resume footer in white text, artificially inflating the TF-IDF feature vector.

---

## 4. Production Integration Status

1. **Standalone Status:** This model is **NOT integrated into the deployed ResumeXpert application**.
2. **Application Architecture:** The live ResumeXpert web application uses its FastAPI backend and configured AI/LLM API pipelines for resume analysis, skill extraction, and career suggestions.
3. **No Automatic Decision Making:** This model is not an automated hiring, filtering, or employment decision tool. It is solely an experimental educational prototype.

---

## 5. Requirements for Production Deployment

Before a model of this type could ever be deployed in a commercial HR or career guidance environment, the following engineering steps would be required:

1. **Replace Synthetic Data with Real Data:** Collect and anonymize 20,000+ real-world resumes across 50+ career roles with consent under data privacy laws (GDPR, DPDP Act).
2. **Human Expert Annotation:** Multiple certified career counselors and technical recruiters must independently label resumes to calculate inter-annotator agreement (Cohen's Kappa).
3. **Context-Aware Embeddings:** Transition from TF-IDF to transformer-based contextual embeddings (e.g., Sentence-BERT, DeBERTa, or modern LLM fine-tuning) to capture seniority, role depth, and semantic context.
4. **Out-of-Distribution Detection:** Implement an entropy threshold or rejection class to flag resumes that do not match any known career track.
5. **Bias and Fairness Audits:** Audit the model to ensure predictions are not correlated with gender, university pedigree, nationality, or demographic indicators.
