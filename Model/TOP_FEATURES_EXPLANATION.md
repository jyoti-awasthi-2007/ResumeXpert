# Top Features and Term Coefficients Explanation

> **Artifact Reference:**  
> - Top Features CSV: [`artifacts/top_terms_by_career.csv`](file:///artifacts/top_terms_by_career.csv)

---

## 1. What are Model Feature Coefficients?

In a multinomial Logistic Regression classifier trained on TF-IDF features, the decision score for class $k$ is computed as a linear dot product:

$$z_k = \sum_{i=1}^{V} w_{k, i} \cdot x_i + b_k$$

Where:
- $V = 1,594$ is the total vocabulary size.
- $x_i$ is the TF-IDF weight of word or n-gram $i$ in the input resume.
- $w_{k, i}$ is the learned **linear coefficient (weight)** for feature $i$ with respect to class $k$.
- $b_k$ is the class bias intercept.

### Interpretation:
- **Positive Coefficient ($w_{k, i} > 0$):** The presence of term $i$ increases the log-odds (and therefore the predicted probability) that the resume belongs to career $k$.
- **Negative Coefficient ($w_{k, i} < 0$):** The presence of term $i$ decreases the probability that the resume belongs to career $k$.
- **Magnitude:** Larger absolute values indicate stronger mathematical association.

> **CRITICAL ACADEMIC DISTINCTION (VIVA NOTE):**  
> These coefficients reflect **statistical correlation and discriminative associations** learned from training data. They **do not mean the model understands semantic language or human intent**. The model operates purely as a mathematical mapping from bag-of-words token frequencies to class probabilities.

---

## 2. Strongest Positive Features by Career Class

Below are the top 5 highest-weighted positive terms for each career class extracted from `artifacts/top_terms_by_career.csv`:

### 1. Backend Developer
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `postgresql` | +1.7557 | Relational database modeling |
| 2 | `fastapi` | +1.5415 | Modern Python backend API framework |
| 3 | `api` | +1.3376 | RESTful service endpoints |
| 4 | `authentication` | +1.3364 | User auth, JWT, session management |
| 5 | `rest` | +1.2729 | Architectural protocol for web APIs |

### 2. Cybersecurity Analyst
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `security` | +1.5810 | Network defense and security policies |
| 2 | `incident` | +1.5420 | Threat monitoring and incident response |
| 3 | `network` | +1.5029 | Network traffic inspection and firewalls |
| 4 | `analysis` | +1.4738 | Log auditing and threat analytics |
| 5 | `penetration` | +1.4129 | Ethical hacking and vulnerability scanning |

### 3. Data Analyst
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `tableau` | +1.6331 | Visual analytics and reporting |
| 2 | `data` | +1.6133 | Tabular and business metrics |
| 3 | `reporting` | +1.5936 | Stakeholder report generation |
| 4 | `excel` | +1.5619 | Spreadsheet calculations and pivot tables |
| 5 | `power bi` / `power` | +1.5604 | Enterprise business intelligence dashboards |

### 4. Data Scientist
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `statistics` | +1.4604 | Mathematical inference and hypothesis testing |
| 2 | `numpy` | +1.4504 | Numerical arrays and matrix operations |
| 3 | `seaborn` | +1.1762 | Statistical data plotting |
| 4 | `feature` | +1.1349 | Feature engineering and data prep |
| 5 | `feature engineering` | +1.1349 | Predictive variable transformation |

### 5. DevOps Engineer
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `ci` | +1.8606 | Continuous Integration pipelines |
| 2 | `ci cd` | +1.8606 | Automated build and release workflows |
| 3 | `cd` | +1.8606 | Continuous Delivery / Deployment |
| 4 | `infrastructure` | +1.7346 | Cloud servers, networking, and IaC |
| 5 | `terraform` | +1.6961 | Infrastructure as Code provisioning |

### 6. Frontend Developer
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `interfaces` | +1.4984 | Accessible user interface construction |
| 2 | `user interfaces` | +1.4984 | UI layout design and styling |
| 3 | `user` | +1.4984 | Client interaction patterns |
| 4 | `vite` | +1.4580 | Fast modern build tooling |
| 5 | `tailwind` | +1.4367 | Utility-first CSS responsive design |

### 7. Full Stack Developer
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `mongodb` | +1.7107 | Document-oriented database storage |
| 2 | `applications` | +1.6146 | End-to-end full stack web products |
| 3 | `web applications` | +1.6146 | Database-backed responsive platforms |
| 4 | `full stack` | +1.5413 | Integrated client-server architecture |
| 5 | `full` | +1.5413 | Full stack role identification |

### 8. Machine Learning Engineer
| Rank | Term (Feature) | Learned Coefficient ($w$) | Role / Context |
|:---:|---|:---:|---|
| 1 | `pytorch` | +1.8105 | Deep neural network training |
| 2 | `learning` | +1.6163 | Deep learning & neural architectures |
| 3 | `deep` | +1.5991 | Multi-layer neural network modeling |
| 4 | `deep learning` | +1.5991 | Advanced AI modeling paradigms |
| 5 | `deployment` | +1.5794 | Model serving and production APIs |

---

## 3. Key Observations for Faculty Presentation

1. **High Domain Specificity:** The top features are strongly aligned with genuine industry requirements for each technical discipline.
2. **Sublinear TF Impact:** Because sublinear term frequency scaling is enabled, repeating the word `pytorch` 10 times in a resume does not multiply its score by 10; it scales logarithmically, preventing keyword stuffing.
3. **Bigram Value:** Bigrams like `ci cd`, `user interfaces`, `deep learning`, and `power bi` provide context that individual unigrams (`ci`, `cd`, `user`) cannot convey alone.
