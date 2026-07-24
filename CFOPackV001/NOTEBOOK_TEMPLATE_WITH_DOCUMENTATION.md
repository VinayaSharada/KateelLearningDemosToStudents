# Notebook Template: Production-Ready with Full Documentation

**Template showing how all notebooks should be structured for CFO use**

This document shows the exact structure for N1-N8 notebooks with:
- Colab button
- Detailed header documentation
- CFO-friendly comments
- Customization guidance
- Dos and don'ts

---

## HTML/Markdown Header (For Colab Compatibility)

Place this at the very top of the notebook (as raw text or markdown cell):

```markdown
# N3: Collections Intelligence - Treasury Decision Workshop

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N3_Collections_Intelligence.ipynb)

**Alternative:** [Open in GitHub](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N3_Collections_Intelligence.ipynb)

---
```

---

## Structure: Cell-by-Cell Template

### Cell 1: Overview & Setup (Markdown)

```markdown
## Module Overview

**Purpose:** Build ML model to predict customer payment behavior

**Why This Matters:**
- Your baseline forecast assumes customers pay on time
- Reality: Most customers pay 8-15 days late
- This prediction improves your cash forecast accuracy
- Better forecast = Better decisions

**What You'll Learn:**
- Train ML model on historical payment data
- Predict payment timing for outstanding invoices
- Identify high-risk (slow-paying) customers
- Understand feature importance (what drives late payments)

**Estimated Time:** 25-30 minutes

**Key Assumption:** You have 12+ months of historical payment data
- If not, you can use the provided synthetic data

---

### Data Requirements

Before running this notebook, make sure you have:

1. **invoices.csv** - Outstanding invoices with:
   - `invoice_id`, `customer_id`, `customer_name`
   - `amount_usd`, `due_date`
   - `payment_terms_days` (e.g., Net 30)
   
2. **payments.csv** - Historical payment data with:
   - `invoice_id`, `payment_date`, `amount_paid`
   - `days_late` (how many days after due date was paid)
   - `customer_id`

3. **customers.csv** - Customer reference data with:
   - `customer_id`, `avg_payment_days`, `risk_score`

---

### Outputs Generated

After running this notebook, you'll get:

- **N3_invoice_payment_predictions.csv** - Predictions for all outstanding invoices
- **Model statistics** - Accuracy, feature importance
- **Customer concentration analysis** - Which customers are at-risk

Use these outputs in N4 (Revised Forecast).
```

### Cell 2: Configuration & Setup

```python
"""
Configuration Cell
=================
Only change values here. All other cells use these settings.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import os
import json

# ============================================================================
# CONFIGURATION: Customize these settings
# ============================================================================

CONFIG = {
    # Input data files
    'invoices_file': '../data/synthetic/invoices.csv',
    'payments_file': '../data/synthetic/payments.csv',
    'customers_file': '../data/synthetic/customers.csv',
    
    # Model parameters
    'model_type': 'RandomForestRegressor',
    'test_size': 0.2,  # Use 20% of data for validation
    'random_state': 42,  # For reproducibility
    'n_estimators': 100,  # Number of trees
    'max_depth': 10,  # Tree depth (prevents overfitting)
    
    # Output settings
    'output_file': '../outputs/N3_invoice_payment_predictions.csv',
    'show_top_n_customers': 5,  # Show top 5 at-risk customers
    
    # Thresholds for alerts
    'at_risk_threshold_days': 7,  # Invoice >7 days late = at-risk
    'manual_review_threshold': 0.5,  # Confidence <50% = needs review
}

print("[OK] Configuration loaded")
print(f"[MODEL] Using {CONFIG['model_type']}")
print(f"[DATA] Loading from {CONFIG['invoices_file']}")
```

### Cell 3: Data Loading & Preparation

```python
"""
Load and Prepare Data
====================
This cell loads your data and creates features for the ML model.

IMPORTANT: If your data structure is different, modify the column names here.
"""

print("\n" + "="*80)
print("[STEP 1] Load Historical Data")
print("="*80 + "\n")

# Load files
try:
    invoices = pd.read_csv(CONFIG['invoices_file'])
    payments = pd.read_csv(CONFIG['payments_file'])
    customers = pd.read_csv(CONFIG['customers_file'])
    print(f"[OK] Loaded invoices: {len(invoices)} rows")
    print(f"[OK] Loaded payments: {len(payments)} rows")
    print(f"[OK] Loaded customers: {len(customers)} rows")
except FileNotFoundError as e:
    print(f"[ERROR] File not found: {e}")
    print("[TIP] Make sure CSV files are in the right location")
    raise

# ============================================================================
# Data Quality Checks
# ============================================================================

print("\n[CHECK] Data Quality Validation")

# Check for required columns
required_cols_invoices = ['invoice_id', 'customer_id', 'amount_usd', 'payment_terms_days']
required_cols_payments = ['invoice_id', 'days_late']

if not all(col in invoices.columns for col in required_cols_invoices):
    missing = [c for c in required_cols_invoices if c not in invoices.columns]
    print(f"[ERROR] Missing columns in invoices.csv: {missing}")
    print("[TIP] Expected columns: " + str(required_cols_invoices))

if not all(col in payments.columns for col in required_cols_payments):
    missing = [c for c in required_cols_payments if c not in payments.columns]
    print(f"[ERROR] Missing columns in payments.csv: {missing}")
    print("[TIP] Expected columns: " + str(required_cols_payments))

print("[OK] All required columns present")

# ============================================================================
# Feature Engineering
# ============================================================================

print("\n[STEP 2] Create Features for ML Model")

# Merge payment history with invoice/customer data
training_data = payments.merge(
    invoices[['invoice_id', 'amount_usd', 'payment_terms_days']],
    on='invoice_id',
    how='left'
)

training_data = training_data.merge(
    customers[['customer_id', 'avg_payment_days', 'risk_score']],
    on='customer_id',
    how='left'
)

# Remove any rows with missing values
training_data = training_data.dropna()

print(f"[OK] Training dataset: {len(training_data)} historical invoices")
print(f"[STAT] Average days late: {training_data['days_late'].mean():.1f} days")
print(f"[STAT] Payment range: {training_data['days_late'].min():.0f} to {training_data['days_late'].max():.0f} days")

# Define features (what predicts payment timing)
FEATURES = [
    'amount_usd',           # Larger invoices = longer payment?
    'payment_terms_days',   # Net 30 vs. Net 60
    'avg_payment_days',     # Customer's historical pattern
    'risk_score'            # Customer creditworthiness
]

print(f"\n[MODEL] Using {len(FEATURES)} features for prediction:")
for i, feat in enumerate(FEATURES, 1):
    print(f"  {i}. {feat}")
```

### Cell 4: Model Training

```python
"""
Train ML Model
==============
This cell builds the machine learning model using historical data.

The model learns patterns: "When customers have these characteristics, 
they typically pay this many days late."
"""

print("\n" + "="*80)
print("[STEP 3] Train Machine Learning Model")
print("="*80 + "\n")

# Prepare features and target
X = training_data[FEATURES]
y = training_data['days_late']

# Split into training (80%) and test (20%) sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=CONFIG['test_size'],
    random_state=CONFIG['random_state']
)

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")

# Train Random Forest model
# This model is like an ensemble of decision trees
# Each tree learns different patterns, then votes on the prediction
model = RandomForestRegressor(
    n_estimators=CONFIG['n_estimators'],
    max_depth=CONFIG['max_depth'],
    random_state=CONFIG['random_state']
)

print("\n[TRAINING] Building model... (this may take a few seconds)")
model.fit(X_train, y_train)
print("[OK] Model training complete")

# Evaluate model
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)

train_mae = mean_absolute_error(y_train, y_pred_train)
test_mae = mean_absolute_error(y_test, y_pred_test)
test_r2 = r2_score(y_test, y_pred_test)

print(f"\n[ACCURACY] Training MAE: ±{train_mae:.2f} days")
print(f"[ACCURACY] Test MAE: ±{test_mae:.2f} days")
print(f"[ACCURACY] R² Score: {test_r2:.3f}")

# Interpretation
print("\n[INTERPRETATION]")
if test_mae < 2:
    print("  ✅ Model is ACCURATE (±1-2 days error) - Good for decision-making")
elif test_mae < 5:
    print("  ⚠️  Model is MODERATE (±3-5 days error) - OK, use with caution")
else:
    print("  ❌ Model is POOR (>5 days error) - Might indicate bad data quality")

# Feature Importance
print("\n[IMPORTANT] What drives late payments?")
print("(Feature importance - what matters most)")
importance_df = pd.DataFrame({
    'feature': FEATURES,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in importance_df.iterrows():
    pct = row['importance'] * 100
    bar = '█' * int(pct / 5)
    print(f"  {row['feature']:25s} {pct:5.1f}% {bar}")
```

### Cell 5: Make Predictions on Outstanding Invoices

```python
"""
Predict Payment Dates
====================
This cell uses the trained model to predict when outstanding invoices 
will actually be paid.
"""

print("\n" + "="*80)
print("[STEP 4] Predict Payment Timing for Outstanding Invoices")
print("="*80 + "\n")

# Load outstanding invoices (ones that haven't been paid yet)
# Filter: actual_days_late is null/NaN = not yet paid
outstanding = invoices[invoices['actual_days_late'].isna()].copy()

print(f"Outstanding invoices: {len(outstanding)}")
print(f"Total outstanding AR: ${outstanding['amount_usd'].sum():,.0f}")

# Prepare features for prediction
# Use same features as training, but from outstanding invoices
outstanding_features = outstanding[[
    'amount_usd',
    'payment_terms_days',
    'customer_id'
]].copy()

# Add customer reference data
outstanding_features = outstanding_features.merge(
    customers[['customer_id', 'avg_payment_days', 'risk_score']],
    on='customer_id'
)

# Make predictions
print("\n[PREDICTING] Generating predictions...")
predicted_days_late = model.predict(outstanding_features[FEATURES])

# Build results dataframe
predictions = outstanding[[
    'invoice_id', 'customer_id', 'customer_name',
    'due_date', 'amount_usd'
]].copy()

predictions['predicted_days_late'] = predicted_days_late
predictions['due_date'] = pd.to_datetime(predictions['due_date'])
predictions['predicted_payment_date'] = (
    predictions['due_date'] + 
    pd.to_timedelta(predicted_days_late, unit='D')
)

print(f"[OK] Generated {len(predictions)} predictions")

# Statistics
print("\n[STATISTICS] Prediction Summary")
print(f"  Average predicted late payment: {predictions['predicted_days_late'].mean():.1f} days")
print(f"  Earliest predicted: {predictions['predicted_days_late'].min():.0f} days")
print(f"  Latest predicted: {predictions['predicted_days_late'].max():.0f} days")

# Identify at-risk invoices
at_risk = predictions[
    predictions['predicted_days_late'] > CONFIG['at_risk_threshold_days']
]

print(f"\n[ALERT] At-risk invoices (>{CONFIG['at_risk_threshold_days']} days late):")
print(f"  Count: {len(at_risk)} of {len(predictions)} ({len(at_risk)/len(predictions)*100:.0f}%)")
print(f"  Amount: ${at_risk['amount_usd'].sum():,.0f}")
```

### Cell 6: Customer Concentration Analysis

```python
"""
Customer Concentration
======================
Which customers represent the biggest risk?
This helps prioritize your collections efforts.
"""

print("\n" + "="*80)
print("[ANALYSIS] Customer Concentration & Risk")
print("="*80 + "\n")

# Group by customer
concentration = predictions.groupby('customer_id').agg({
    'amount_usd': 'sum',
    'predicted_days_late': 'mean',
    'invoice_id': 'count'
}).rename(columns={'invoice_id': 'invoice_count'})

# Add customer names
concentration['customer_name'] = concentration.index.map(
    dict(zip(outstanding['customer_id'], outstanding['customer_name']))
)

concentration = concentration.sort_values('amount_usd', ascending=False)

print("[TOP CUSTOMERS BY AMOUNT AT-RISK]")
print("-" * 100)

for idx, (cust_id, row) in enumerate(concentration.head(CONFIG['show_top_n_customers']).iterrows(), 1):
    pct = row['amount_usd'] / predictions['amount_usd'].sum() * 100
    risk_level = "🔴 HIGH" if row['predicted_days_late'] > 14 else "🟡 MEDIUM" if row['predicted_days_late'] > 7 else "🟢 LOW"
    
    print(f"\n{idx}. {row['customer_name']}")
    print(f"   Amount: ${row['amount_usd']:>12,.0f} ({pct:5.1f}% of total)")
    print(f"   Invoices: {row['invoice_count']:.0f}")
    print(f"   Avg days late: {row['predicted_days_late']:5.1f} days  {risk_level}")
```

### Cell 7: Export Results

```python
"""
Export Predictions
==================
Save the predictions to CSV so N4 (Revised Forecast) can use them.
"""

print("\n" + "="*80)
print("[STEP 5] Export Results")
print("="*80 + "\n")

# Save predictions
output_path = CONFIG['output_file']
os.makedirs(os.path.dirname(output_path), exist_ok=True)

predictions.to_csv(output_path, index=False)

print(f"[OK] Saved predictions: {output_path}")
print(f"[RECORDS] {len(predictions)} invoices with predictions")

# Also save model metadata for documentation
metadata = {
    'model_type': CONFIG['model_type'],
    'features_used': FEATURES,
    'accuracy_mae': float(test_mae),
    'accuracy_r2': float(test_r2),
    'training_records': len(X_train),
    'test_records': len(X_test),
    'avg_predicted_days_late': float(predictions['predicted_days_late'].mean()),
}

print(f"\n[MODEL] Summary Statistics")
print(f"  Type: {metadata['model_type']}")
print(f"  Accuracy (MAE): ±{metadata['accuracy_mae']:.2f} days")
print(f"  Training records: {metadata['training_records']}")

print("\n" + "="*80)
print("[COMPLETE] N3 Collections Intelligence Module Finished")
print("="*80)
print("\nNext: Run N4_Revised_Forecast.py to rebuild cash forecast using these predictions")
```

### Cell 8: Customization Guide

```markdown
## Customization Guide

Want to adjust this analysis for your own data? Here's how:

### 1. Change the Model Type

By default, this uses Random Forest. You can try:

```python
# Linear Regression (simpler, less accurate)
from sklearn.linear_model import LinearRegression
model = LinearRegression()

# XGBoost (more advanced, better accuracy)
from xgboost import XGBRegressor
model = XGBRegressor(n_estimators=100, max_depth=5)

# Gradient Boosting
from sklearn.ensemble import GradientBoostingRegressor
model = GradientBoostingRegressor()
```

Then run the training cell again.

### 2. Add More Features

If you have additional data (industry, customer tenure, etc.), add them:

```python
FEATURES = [
    'amount_usd',
    'payment_terms_days',
    'avg_payment_days',
    'risk_score',
    'industry_code',      # ← New feature
    'customer_tenure_days'  # ← New feature
]
```

### 3. Adjust Model Parameters

```python
model = RandomForestRegressor(
    n_estimators=200,   # More trees = potentially more accurate (but slower)
    max_depth=15,       # Deeper trees = more complex (but risk overfitting)
    min_samples_leaf=2, # Minimum invoices to make a decision
    random_state=42
)
```

### 4. Change At-Risk Threshold

```python
# Currently: At-risk = >7 days late
# Change to:
at_risk = predictions[predictions['predicted_days_late'] > 10]  # ← More conservative
at_risk = predictions[predictions['predicted_days_late'] > 5]   # ← More aggressive
```

---

### DO's and DON'Ts

#### DO:
✅ Use this on real data (replace synthetic data)
✅ Validate model accuracy (compare to your actual results)
✅ Adjust features based on your business (add customer size, industry, etc.)
✅ Retrain model monthly (as you get new payment data)
✅ Use this to prioritize collections efforts (target slow-paying customers)

#### DON'T:
❌ Don't use predictions as absolutes (they're predictions, not guarantees)
❌ Don't ignore extremely small samples (with <50 payment records, model is unreliable)
❌ Don't forget about business context (a prediction of 15 days late for a customer with 30-day terms is different from one with 60-day terms)
❌ Don't trust 100% accuracy (even models with low MAE can be wrong sometimes)
❌ Don't forget to validate on out-of-sample data (test on invoices you didn't train on)

---

### Real-World Notes

**When this model works well:**
- You have 100+ historical payment records
- Customers have consistent payment behavior
- No major changes in customer mix or payment practices

**When this model might struggle:**
- You have <50 historical records (not enough data)
- Payment behavior is erratic/unpredictable
- Recent changes (new customers, policy changes) aren't in historical data
- Customers are paying due to collection efforts (won't capture true behavior)

**How to improve accuracy:**
1. Add more features (industry, company size, credit rating)
2. Train separate models per customer segment (big customers often have different behavior)
3. Use more sophisticated models (XGBoost, neural networks)
4. Include recent payment data (retrain monthly)
5. Account for known changes (if a customer's payment behavior changed, add that context)

---

### Troubleshooting

**Q: Model has very high error (>10 days MAE)**
A: Your data might be noisy or inconsistent. Check:
- Are due dates correct in your data?
- Do some customers have vastly different payment behavior?
- Is there bad data (negative days_late, missing values)?

**Q: Predictions seem unrealistic**
A: Common issues:
- Not enough training data (need 100+ records minimum)
- Outliers in training data skewing results
- Features don't match your actual situation

**Q: Want to use this for a different prediction?**
A: You can predict anything that changes over time:
- Discount take-rate (% of customers taking early-pay discounts)
- Churn probability (which customers will leave)
- Default probability (which customers might not pay at all)

Just change the target variable (y) and features (X), and retrain.
```

---

## Summary of Structure

This template shows how EACH notebook should be structured:

### 1. **Title with Colab Button**
```markdown
# Module Name
[![Open in Colab](link)](colab-button)
```

### 2. **Overview & Context**
```markdown
## Purpose
Why does this matter?

## What You'll Learn
Clear learning outcomes

## Key Assumptions
What data/prerequisites needed
```

### 3. **Configuration Cell**
```python
# Settings that can be customized
CONFIG = { ... }
```

### 4. **Data Loading & Validation**
```python
# Load data
# Validate structure
# Quality checks
```

### 5. **Analysis/Model Building**
```python
# Main logic with detailed comments
# Explain WHAT and WHY
```

### 6. **Results & Interpretation**
```python
# Show results clearly
# Explain what they mean
# Actionable insights
```

### 7. **Export/Output**
```python
# Save results for next notebook
# Document what was created
```

### 8. **Customization Guide**
```markdown
# How to adapt this for your needs
# Dos and don'ts
# Real-world notes
```

---

## Key Principles for CFO-Ready Notebooks

1. **Every cell has a purpose** - Header explains what it does
2. **Every number has context** - "±1.32 days" not just "1.32"
3. **Every decision is visible** - Parameters at top of notebook
4. **Every output is explained** - What does this metric mean?
5. **Every assumption is documented** - Why did we choose this approach?
6. **Every limitation is stated** - When/why might this fail?
7. **Every customization is shown** - How to adapt for your data
8. **Every risk is highlighted** - What could go wrong?

---

## Generating Colab Links

To create the badge link for each notebook:

```markdown
For N3_Collections_Intelligence.ipynb:

[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N3_Collections_Intelligence.ipynb)
```

Pattern:
```
https://colab.research.google.com/github/[USERNAME]/[REPO]/blob/main/[PATH_TO_NOTEBOOK].ipynb
```

Replace:
- `[USERNAME]` - GitHub username (VinayaSharada)
- `[REPO]` - Repository name (KateelLearningDemosToStudents)
- `[PATH_TO_NOTEBOOK]` - Full path to .ipynb file

---

## Usage Statistics

Having the Colab button lets you track usage:

1. **GitHub Analytics** - See who clicked the link
2. **Colab Analytics** - Google tracks notebook opens
3. **Natural feedback** - Which notebooks are popular/problematic

This helps you improve future workshops!

---

**This template applies to ALL notebooks (N1-N8).**

Adjust for each module's specific purpose, but keep the structure consistent.
