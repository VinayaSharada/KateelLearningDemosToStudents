# Fair Interpretable Trustworthy Machine Learning (FITML / FAccT ML)
**Course 2 of 28,001** • *Curated Classroom & Executive Demo Series*  
**Instructor:** Professor Vinaya Sathyanarayana ([vinallcontact@gmail.com](mailto:vinallcontact@gmail.com))

Welcome to the 4-part webinar and hands-on lab series for **Fair Interpretable Trustworthy Machine Learning**. This curriculum bridges theoretical foundations with code execution, covering algorithmic fairness audits, in-processing debiasing, local and global feature attribution (LIME & SHAP), and vision adversarial robustness.

---

## 📚 Curriculum Structure & Lab Resources

| Session | Topic & Focus | About Demo | Interactive Lab | Open in Colab | Lecture Deck | Student Assignment | Solution Guide |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Webinar 1** | **Algorithmic Bias Detection & Pre-Processing**<br>Disparate impact (80% rule), statistical parity difference, reweighting, and DIR on COMPAS & Adult Income. | [About Guide](lab01-bias-detection/about.html) | [Launch Lab](lab01-bias-detection/index.html) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/fitml/notebooks/webinar_01_bias_detection_lab.ipynb) | [Download `.pptx`](decks/Webinar_01_Bias_Detection_and_Preprocessing.pptx) | [Download Prompt `.pdf`](assignments/Webinar_01_Student_Assignment_Prompt.pdf) | [Download Solution `.pdf`](guides/Webinar_01_Assignment_Prompt_and_Solution.pdf) |
| **Webinar 2** | **In-Processing & Causal Fairness**<br>Constrained optimization loss, adversarial debiasing representations, causal DAGs, and counterfactual invariance. | [About Guide](lab02-causal-fairness/about.html) | [Launch Lab](lab02-causal-fairness/index.html) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/fitml/notebooks/webinar_02_inprocessing_lab.ipynb) | [Download `.pptx`](decks/Webinar_02_Inprocessing_and_Causal_Fairness.pptx) | [Download Prompt `.pdf`](assignments/Webinar_02_Student_Assignment_Prompt.pdf) | [Download Solution `.pdf`](guides/Webinar_02_Assignment_Prompt_and_Solution.pdf) |
| **Webinar 3** | **Feature Attribution (LIME & SHAP)**<br>Shapley value cooperative game theory, TreeSHAP, KernelSHAP waterfall charts, and local linear surrogate models. | [About Guide](lab03-lime-shap/about.html) | [Launch Lab](lab03-lime-shap/index.html) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/fitml/notebooks/webinar_03_interpretability_lab.ipynb) | [Download `.pptx`](decks/Webinar_03_Feature_Attribution_LIME_SHAP.pptx) | [Download Prompt `.pdf`](assignments/Webinar_03_Student_Assignment_Prompt.pdf) | [Download Solution `.pdf`](guides/Webinar_03_Assignment_Prompt_and_Solution.pdf) |
| **Webinar 4** | **Vision XAI & Adversarial Attacks**<br>Grad-CAM convolutional saliency maps, FGSM & PGD evasion attacks, and Madry robust min-max adversarial training. | [About Guide](lab04-adversarial-robustness/about.html) | [Launch Lab](lab04-adversarial-robustness/index.html) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/fitml/notebooks/webinar_04_adversarial_robustness_lab.ipynb) | [Download `.pptx`](decks/Webinar_04_Vision_XAI_and_Adversarial_Robustness.pptx) | [Download Prompt `.pdf`](assignments/Webinar_04_Student_Assignment_Prompt.pdf) | [Download Solution `.pdf`](guides/Webinar_04_Assignment_Prompt_and_Solution.pdf) |

---

## ⚡ Standalone Interactive Lab
- **[Interactive Algorithmic Fairness Simulator (Community Edition)](../fairness-simulator-community/index.html)**: In-browser live confusion matrix decomposition laboratory. Explore the Five Slicing Cuts, demographic parity, disparate impact ratio, and real-time EEOC four-fifths rule compliance. Read the [About Guide](../fairness-simulator-community/about.html) for theoretical framing and classroom discussion scenarios.

---

## 📖 Theoretical Monograph
- **Mathematical Foundations:** [Download Theoretical Foundations and Mathematical Tutorials (PDF)](guides/Theoretical_Foundations_and_Mathematical_Tutorials.pdf) — comprehensive 4-part theoretical guide covering proofs, lemmas, and optimization formulations.

---

## 📊 Benchmark Datasets
All datasets used in the notebooks and labs are located in [`fitml/data/`](data/):
1. [`adult_income.csv`](data/adult_income.csv) — US Census Bureau income prediction dataset with demographic indicators (gender, race, age).
2. [`compas_recidivism.csv`](data/compas_recidivism.csv) — ProPublica COMPAS criminal recidivism risk assessment benchmark dataset.
3. [`german_credit.csv`](data/german_credit.csv) — UCI German Credit risk dataset with protected demographic attributes.
4. [`diabetes_data.csv`](data/diabetes_data.csv) — Clinical diabetes health indicator tabular dataset for feature attribution auditing.

---

## 🚀 Running the Notebooks
Each notebook can be launched with a single click in Google Colab using the badges above, or executed locally:
```bash
pip install -r requirements.txt # or: pip install numpy pandas scikit-learn matplotlib seaborn shap lime torch torchvision
jupyter notebook fitml/notebooks/webinar_01_bias_detection_lab.ipynb
```
