# College Viva & Faculty Presentation Q&A

This document contains direct, technically precise, and concise answers to the 44 most common faculty questions regarding the ResumeXpert machine learning model.

---

### Q1: What model did you train?
**A:** We trained an offline supervised career classification model that takes unstructured resume text as input and predicts the candidate's most suitable technical career category along with probability scores.

### Q2: What algorithm did you use?
**A:** We used **TF-IDF Vectorization** (Term Frequency–Inverse Document Frequency) for feature extraction paired with **Multinomial Logistic Regression** (with an L2 regularization penalty and L-BFGS solver) for multi-class classification.

### Q3: Why did you choose that algorithm?
**A:** Because resume classification is a high-dimensional sparse text problem. Logistic Regression handles sparse text efficiently, trains in seconds, provides fully explainable feature coefficients (weights), and directly outputs calibrated class probabilities via the Softmax function.

### Q4: How many classes are there?
**A:** There are **8 classes**.

### Q5: What are the class names?
**A:**
1. Backend Developer
2. Cybersecurity Analyst
3. Data Analyst
4. Data Scientist
5. DevOps Engineer
6. Frontend Developer
7. Full Stack Developer
8. Machine Learning Engineer

### Q6: How many records are in the dataset?
**A:** There are **1,600 total records** in `dataset/synthetic_resume_career_dataset.csv`.

### Q7: How many records are in each class?
**A:** Exactly **200 records per class**.

### Q8: What are the input features?
**A:** The raw input is unstructured resume text containing education, technical skills, project descriptions, and work experience. After TF-IDF vectorization, this text is converted into a **1,594-dimensional numerical feature vector** of unigrams and bigrams.

### Q9: What is the target/output?
**A:** The target is a categorical career label representing one of the 8 technical career categories (`career` column).

### Q10: How was the resume text converted into ML features?
**A:** Using scikit-learn's `TfidfVectorizer`. The vectorizer tokenizes the text into single words and two-word phrases, filters out rare and overly common terms, computes TF-IDF weights, and applies L2 unit-length normalization.

### Q11: What preprocessing was performed?
**A:** Preprocessing includes:
- Case normalization (converting all text to lowercase).
- N-gram extraction (`ngram_range=(1, 2)` to capture unigrams and bigrams).
- Document frequency filtering (`min_df=2` to drop unique noise words, `max_df=0.95` to drop corpus-wide common words).
- Sublinear TF scaling (`sublinear_tf=True`) using $1 + \log(\text{TF})$ to dampen the impact of repeated words.

### Q12: What is TF-IDF?
**A:** TF-IDF stands for **Term Frequency – Inverse Document Frequency**. It measures the importance of a term in a document relative to a corpus:
- **TF** measures how frequently a term appears in the document.
- **IDF** downweights words that appear across almost all documents and boosts specialized, discriminative words.

### Q13: What is Logistic Regression?
**A:** Logistic Regression is a linear classification algorithm. In multiclass classification, it calculates a linear score for each class ($z_k = W_k \cdot X + b_k$) and transforms these scores into a valid probability distribution using the **Softmax function**.

### Q14: How was training performed?
**A:** Training was performed using a scikit-learn `Pipeline`. The dataset was split into training and testing sets. The vectorizer was fitted strictly on the training set, and the logistic regression weights were optimized using the L-BFGS solver with a maximum of 2,500 iterations.

### Q15: What train/test split was used?
**A:** An **80/20 train/test split** was used:
- **Training Set:** 80% (1,280 samples; 160 per class)
- **Testing Set:** 20% (320 samples; 40 per class)
- The split was stratified by career class.

### Q16: What random seed was used?
**A:** `random_state = 42`. This ensures that data generation, train/test splitting, and model convergence are 100% reproducible.

### Q17: What is the training accuracy?
**A:** The training accuracy is **100.00% (1,280/1,280)** on the synthetic training split.

### Q18: What is the testing accuracy?
**A:** The testing accuracy is **100.00% (320/320)** on the held-out synthetic test split.

### Q19: What is precision?
**A:** Precision is the fraction of predicted instances for a class that are actually correct:
$$\text{Precision} = \frac{\text{True Positives}}{\text{True Positives} + \text{False Positives}}$$
Our model achieved 1.0000 (100%) precision across all classes on the test set.

### Q20: What is recall?
**A:** Recall is the fraction of actual instances of a class that the model correctly identified:
$$\text{Recall} = \frac{\text{True Positives}}{\text{True Positives} + \text{False Negatives}}$$
Our model achieved 1.0000 (100%) recall across all classes on the test set.

### Q21: What is F1-score?
**A:** F1-score is the harmonic mean of precision and recall:
$$\text{F1} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$
It provides a single metric balancing both false positives and false negatives.

### Q22: What is macro F1?
**A:** Macro F1 is the unweighted arithmetic mean of F1-scores calculated independently for each class. It treats all 8 classes equally. Our macro F1 is **1.0000**.

### Q23: What is weighted F1?
**A:** Weighted F1 averages the F1-scores weighted by the number of true instances (support) in each class. Because our test set is perfectly balanced (40 samples per class), weighted F1 is **1.0000**, identical to macro F1.

### Q24: What does the confusion matrix show?
**A:** The confusion matrix is an $8 \times 8$ table showing true career classes in rows and predicted career classes in columns. In our test set, all 320 samples appear along the main diagonal (40 per class) with zero off-diagonal values, confirming zero misclassifications on this evaluation set.

### Q25: Which class has the most samples?
**A:** All classes have an equal number of samples: **200 samples each** (12.5% each).

### Q26: Which class has the fewest samples?
**A:** None. The dataset is perfectly balanced across all 8 classes.

### Q27: Which classes are most likely to be confused with each other?
**A:** In real-world data and edge cases, the most common overlaps occur between:
1. **Data Scientist** and **Machine Learning Engineer** (shared Python, Pandas, Scikit-learn).
2. **Full Stack Developer** and **Frontend / Backend Developer** (shared JavaScript, React, Node.js).
3. **DevOps Engineer** and **Backend Developer** (shared Docker, Linux, REST APIs).

### Q28: What are the most important terms/features for each class?
**A:** The strongest learned positive coefficients are:
- **Backend Developer:** `postgresql` (+1.76), `fastapi` (+1.54), `api` (+1.34)
- **Cybersecurity Analyst:** `security` (+1.58), `incident` (+1.54), `network` (+1.50)
- **Data Analyst:** `tableau` (+1.63), `data` (+1.61), `reporting` (+1.59)
- **Data Scientist:** `statistics` (+1.46), `numpy` (+1.45), `seaborn` (+1.18)
- **DevOps Engineer:** `ci` (+1.86), `ci cd` (+1.86), `terraform` (+1.70)
- **Frontend Developer:** `interfaces` (+1.50), `vite` (+1.46), `tailwind` (+1.44)
- **Full Stack Developer:** `mongodb` (+1.71), `applications` (+1.61), `full stack` (+1.54)
- **Machine Learning Engineer:** `pytorch` (+1.81), `deep learning` (+1.60), `deployment` (+1.58)

### Q29: How does a new resume get predicted?
**A:** The resume text is cleaned and transformed into a 1,594-element TF-IDF vector, multiplied by the trained coefficient matrix ($W \cdot X + b$), and converted into 8 probabilities using Softmax. The class with the highest probability is selected.

### Q30: What does the prediction probability mean?
**A:** It represents the model's mathematical confidence based on the alignment of the resume's TF-IDF features with each career's learned linear decision boundary.

### Q31: Can I manually enter a resume and get a prediction?
**A:** Yes. Running `python demo_predict.py` opens an interactive prompt where you can paste any resume snippet and immediately receive the predicted career and top 3 probabilities.

### Q32: Can I show multiple example predictions?
**A:** Yes. Running `python sample_predictions.py` executes inference across 10 realistic held-out candidate resumes representing all 8 career categories and prints a formatted verification table.

### Q33: How are skills related to careers?
**A:** Skills serve as the primary distinguishing features of each career path. In `dataset/career_skill_mapping.csv`, each career is mapped to 13–14 core and supporting skills with explicit importance weights.

### Q34: How many skills are present in the skills dataset?
**A:** There are **87 unique technical skills** across 9 categories in `dataset/skills_dataset.csv`.

### Q35: How many assessment questions are present?
**A:** There are **48 multiple-choice questions** in `dataset/assessment_questions.csv`.

### Q36: How many questions belong to each career, skill, and difficulty?
**A:**
- **Per Career:** Exactly 6 questions per career (8 careers $\times$ 6 = 48).
- **Per Difficulty:** Exactly 16 Beginner, 16 Advanced, and 16 Expert questions.
- **Per Skill:** Covers 40 distinct technical skills.

### Q37: What do the Beginner, Advanced, and Expert levels represent?
**A:**
- **Beginner:** Core definitions, fundamental syntax, and basic concepts.
- **Advanced:** Practical implementation, APIs, edge cases, and debugging.
- **Expert:** High-scale system trade-offs, architecture patterns, reliability, and optimization.

### Q38: How are the questions structured?
**A:** Each question contains: `question_id`, `career`, `skill`, `difficulty`, `question`, 4 options (`option_a` through `option_d`), `correct_answer`, and an `explanation`.

### Q39: How does the skill dataset support the assessment concept?
**A:** Once a candidate's target career is identified, the system queries the career-skill mapping to find required competencies, benchmarks them against candidate claims, and serves targeted assessment questions to objectively score proficiency.

### Q40: What are the limitations of the model?
**A:**
1. The dataset is synthetic and uses controlled keyword distributions.
2. The model assumes a closed world of exactly 8 classes.
3. TF-IDF does not capture semantic sentence structure or candidate seniority beyond keyword presence.
4. The model is an academic proof-of-concept and not an automated hiring tool.

### Q41: Is this model currently integrated into the production app?
**A:** **No.** This model is maintained as a separate offline experimental component. The deployed ResumeXpert application uses its existing FastAPI backend and AI/LLM API pipeline.

### Q42: Is the dataset real or synthetic?
**A:** It is **synthetic**. It was programmatically generated using career competency profiles and randomized templates with fixed seed 42 for academic demonstration.

### Q43: Why is the accuracy 100% on this dataset?
**A:** Because the synthetic resumes were generated using distinct, role-specific technical skill clusters. While cross-career noise was introduced, the decision boundaries remain clean and linearly separable in the 1,594-dimensional TF-IDF space. This validates pipeline correctness, not real-world benchmark performance.

### Q44: What would be required before deploying this model in a real production environment?
**A:**
1. Gathering 20,000+ real, anonymized resumes across 50+ career roles.
2. Multi-expert human labeling to ensure high inter-annotator agreement.
3. Replacing bag-of-words TF-IDF with modern contextual language embeddings (e.g., Sentence-BERT or fine-tuned LLMs).
4. Implementing an "Unknown / Out-of-Distribution" rejection threshold.
5. Conducting rigorous fairness, bias, and privacy audits.
