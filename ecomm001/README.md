# E-commerce Data Analysis Pipeline

This project demonstrates a complete, end-to-end data analysis pipeline, starting from raw data creation to the final presentation in an interactive business intelligence dashboard. The primary objective is to simulate a realistic e-commerce environment to analyze complex customer behaviors, identify sales patterns, and detect anomalies.

The workflow is divided into four key stages:

1.  **Realistic Data Generation:** A 5-year synthetic dataset (900k+ orders) was generated using a custom Python script (`syndata.py`). This data is highly customized with defined customer personas (e.g., "Tech Enthusiast," "Family Shopper"), realistic product-bundling rules, and geographically accurate customer locations to mimic real-world shopping habits.

2.  **Detailed Exploratory Analysis (EDA):** A Jupyter Notebook (`analysis.ipynb`) is used to perform a deep dive into the data. This notebook applies statistical methods (RFM Analysis, Cohort Analysis) and machine learning algorithms (K-Means Clustering, Isolation Forest) to uncover deep insights into customer segmentation, retention, and fraud.

3.  **Automated Reporting:** A second Python script (`ecomm.py`) serves as an automated analysis tool. It runs the key business analytics found in the notebook and automatically generates a static PDF summary report.

4.  **Interactive Dashboard:** The final, aggregated findings are presented in a dynamic, user-friendly dashboard built in Power BI. This allows non-technical users to filter the data and visually explore sales trends, geographic hotspots, and product performance.

---

## Project Structure

* `syndata.py`: The Python script used to generate the synthetic 5-year dataset. It creates customers with specific personas and products with realistic price ranges and bundling rules.
* `ecomm.py`: A Python script that performs a full automated analysis on the data and generates a PDF report summarizing the findings.
* `analysis.ipynb`: A Jupyter Notebook containing a detailed, step-by-step exploratory data analysis (EDA) of the dataset.
* `requirements.txt`: A list of all Python libraries required to run the project.
 
---

##  How to Run This Project

### 1. Setup the Environment

First, clone the repository and install the necessary libraries.

```bash
# Install all required libraries
pip install -r requirements.txt

```
---

### 2. Generate the 5-Year Dataset

The 5-year dataset is already included in this repository. To generate a new or different dataset, you can run the syndata.py script with your desired parameters.

This was the command used to generate the data for this project:

```bash
python syndata.py --customers 10000 --products 3000 --stores 250 --orders-per-day 1000 --output ./data_production_5_years

```

---

##  Power BI Dashboard

An interactive dashboard was built in Power BI to visualize the key performance indicators (KPIs), trends, and customer segments from the analysis.

###  Dashboard Demonstration

Since the dashboard requires Power BI Desktop, I have created a short video to showcase its features and interactivity (filters, slicers, etc.).

**[Click here to watch the video demonstration of the dashboard](https://youtu.be/dowzny4IS8E)**

### Screenshots

Below are screenshots of the two main pages of the dashboard.

**(Page 1: Sales & Geographic Overview)**

![Dashboard 1](https://github.com/Safwannn89/KateelLearningDemosToStudents/blob/add-final-project/Screenshot%202025-11-01%20012319.png)

**(Page 2: Product & Customer Insights)**

![Dashboard 2](https://github.com/Safwannn89/KateelLearningDemosToStudents/blob/add-final-project/Screenshot%202025-11-01%20013043.png)

---

## Acknowledgements

This project was completed as a contribution to the [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) repository, with thanks to **[Vinaya Sir]** for providing the project framework and guidance.

---

## 👤 Contributor

* **[Safwan Khan]**
* [GitHub Profile](https://github.com/Safwannn89)
* [LinkedIn Profile](www.linkedin.com/in/safwankhan89)