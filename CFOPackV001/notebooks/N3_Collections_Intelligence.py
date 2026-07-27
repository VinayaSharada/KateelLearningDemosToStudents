# Auto-exported from N3_Collections_Intelligence.ipynb. Edit the notebook, then regenerate this file.

# %% [code cell 1]
# ==============================================================================
# SETUP: Imports and Configuration
# ==============================================================================
# This cell imports all required libraries and configures data sources.
# No changes needed unless you want to use your own data.

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
import os
import sys
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
warnings.filterwarnings('ignore', category=DeprecationWarning)
warnings.filterwarnings('ignore', category=FutureWarning)

# Colab starts in /content; local Jupyter starts in this notebooks folder.
OUTPUT_DIR = '/content/outputs' if 'google.colab' in sys.modules else '../outputs'
os.makedirs(OUTPUT_DIR, exist_ok=True)
# CONFIGURATION: Choose your data source
USE_GITHUB_DATA = True
# Set to False if you want to upload your own data
GITHUB_RAW_URL = 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic'

print('✓ Imports successful')
print(f"✓ Data source: {'GitHub (synthetic)' if USE_GITHUB_DATA else 'Manual upload'}")

# %% [code cell 2]
def load_data_from_github():
    """Load synthetic data directly from GitHub repository.

    Advantages:
    - No API key required
    - Pre-validated and consistent with reference outputs
    - Fast (uses GitHub CDN)

    Returns: dict with keys 'invoices', 'payments', 'customers'
    """
    try:
        print('Loading data from GitHub...')
        invoices = pd.read_csv(f'{GITHUB_RAW_URL}/invoices.csv')
        payments = pd.read_csv(f'{GITHUB_RAW_URL}/payments.csv')
        customers = pd.read_csv(f'{GITHUB_RAW_URL}/customers.csv')

        print(f'✓ Loaded {len(invoices):,} invoices')
        print(f'✓ Loaded {len(payments):,} payments')
        print(f'✓ Loaded {len(customers):,} customers')
        return {'invoices': invoices, 'payments': payments, 'customers': customers}
    except Exception as e:
        print(f'✗ Error: {e}')
        print('  Try Option 2: Manual upload')
        return None

def load_data_from_upload():
    """Load data from files you upload manually.

    In Colab: Click Files panel → Upload → Select CSVs
    In Jupyter: Put CSVs in the same folder as this notebook

    Required files: invoices.csv, payments.csv, customers.csv
    See data/README.md for required columns.
    """
    try:
        print('Loading data from uploaded files...')
        invoices = pd.read_csv('invoices.csv')
        payments = pd.read_csv('payments.csv')
        customers = pd.read_csv('customers.csv')

        print(f'✓ Loaded {len(invoices):,} invoices')
        print(f'✓ Loaded {len(payments):,} payments')
        print(f'✓ Loaded {len(customers):,} customers')
        return {'invoices': invoices, 'payments': payments, 'customers': customers}
    except FileNotFoundError as e:
        print(f'✗ File not found: {e}')
        return None

# Execute data loading based on configuration above
if USE_GITHUB_DATA:
    data = load_data_from_github()
else:
    data = load_data_from_upload()

if data is None:
    print('\n⚠ Data loading failed. Check error above.')
else:
    invoices = data['invoices']
    payments = data['payments']
    customers = data['customers']
    print('\n✓ All data loaded and ready for analysis!')

# %% [code cell 3]
print("[ Preparing training data from historical payments...")
print()

# Load validated data (already includes customer features from N1)
# Try N1 outputs first, fall back to GitHub source data
try:
    validated_data = pd.read_csv(f"{OUTPUT_DIR}/N1_validated_data.csv")
    print(f"[OK] Loaded validated data from N1 outputs")
except FileNotFoundError:
    # Fallback: Load source data and prepare validated dataset
    print("N1 outputs not found, loading from GitHub source data...")
    invoices = pd.read_csv(f'{GITHUB_RAW_URL}/invoices.csv')
    payments = pd.read_csv(f'{GITHUB_RAW_URL}/payments.csv')
    customers = pd.read_csv(f'{GITHUB_RAW_URL}/customers.csv')
    # Prepare validated_data similar to N1
    validated_data = invoices.merge(
        customers[['customer_id', 'avg_days_late', 'risk_score', 'industry']],
        on='customer_id',
        how='left'
    ).merge(
        payments[['invoice_id', 'payment_date', 'days_late']],
        on='invoice_id',
        how='left',
        suffixes=('', '_actual')
    )
    validated_data.rename(columns={'days_late': 'actual_days_late'}, inplace=True)
    print(f"[OK] Prepared validated data from source files")

# Training data = all paid invoices (these have payment history)
training_data = validated_data[validated_data['status'] == 'paid'].copy()

# Remove rows with missing payment data
training_data = training_data.dropna(subset=['actual_days_late'])

# Remove rows with missing features
training_data = training_data.dropna()

print(f"[OK] Training data: {len(training_data)} historical payments")
print()

# %% [code cell 4]
print("[ Engineering features...")
print()

# Features
X = training_data[[
    'amount_usd',  # Invoice size
    'payment_terms_days',  # Payment terms (30, 45, 60 days?)
    'avg_days_late',  # Customer's historical avg days late
    'risk_score'  # Customer risk score (0-1)
]]

# Target: actual_days_late (how many days late was this payment?)
y = training_data['actual_days_late']

print(f"Features used:")
print(f"   Invoice amount (USD)")
print(f"   Payment terms (days)")
print(f"   Customer's historical avg payment days")
print(f"   Customer risk score")
print()
print(f"Target: Days Late (from historical payments)")
print(f"  Average: {y.mean():.1f} days")
print(f"  Std Dev: {y.std():.1f} days")
print(f"  Range: {y.min():.0f} to {y.max():.0f} days")
print()

# %% [code cell 5]
print("[[AI] Training Random Forest model...")
print()

# Split data for training and validation
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest
model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)
train_mae = mean_absolute_error(y_train, y_pred_train)
test_mae = mean_absolute_error(y_test, y_pred_test)
test_r2 = r2_score(y_test, y_pred_test)

print(f"[OK] Model trained on {len(X_train)} historical records")
print()
print(f"Model Performance:")
print(f"  Train MAE:  {train_mae:.2f} days")
print(f"  Test MAE:   {test_mae:.2f} days")
print(f"  Test R:    {test_r2:.3f}")
print()

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("[Feature Importance:")
for idx, row in feature_importance.iterrows():
    pct = row['importance'] * 100
    bar = "█" * int(pct / 5)
    print(f"  {row['feature']:30s} {pct:5.1f}% {bar}")

print()

# %% [code cell 6]
# ==============================================================================
print("[[GOAL] Making predictions on outstanding invoices...")
print()
# Outstanding invoices are the records that still need a payment prediction
outstanding = validated_data[validated_data['status'] == 'outstanding'].copy()
outstanding_features = outstanding[[
    'amount_usd',
    'payment_terms_days',
    'avg_days_late',
    'risk_score'
]].copy()

predicted_days_late = model.predict(outstanding_features)
predictions = outstanding[[
    'invoice_id', 'customer_id', 'due_date', 'amount_usd'
]].copy()
predictions['predicted_days_late'] = predicted_days_late.round(1)
predictions['due_date'] = pd.to_datetime(predictions['due_date'])
predictions['predicted_payment_date'] = (
    predictions['due_date']
    + pd.to_timedelta(predictions['predicted_days_late'], unit='D')
)
print(f"[OK] Predicted payment dates for {len(predictions)} outstanding invoices")
print()
# ==============================================================================

# %% [code cell 7]
# ==============================================================================
print("[[WARNING]  AT-RISK INVOICE ANALYSIS")
print()
# Focus collections attention on invoices predicted more than seven days late
at_risk = predictions[predictions['predicted_days_late'] > 7].copy()
at_risk = at_risk.sort_values('amount_usd', ascending=False)
print(f"Invoices predicted to be >7 days late: {len(at_risk)}")
print(f"Total at-risk amount: ${at_risk['amount_usd'].sum():,.0f}")
print()
if len(at_risk) > 0:
    print("[Top at-risk invoices:")
    print("[-" * 100)
    for _, row in at_risk.head(10).iterrows():
        print(
            f"  {row['invoice_id']:12s} Customer {row['customer_id']:>3.0f} "
            f"${row['amount_usd']:>10,.0f}  Due: {row['due_date'].date()} "
            f"(Predicted {row['predicted_days_late']:.0f} days late)"
        )
    print("[-" * 100)
print()
# ==============================================================================

# %% [code cell 8]
print("[[CHART] CUSTOMER CONCENTRATION (At-Risk)")
print()

concentration = predictions.groupby('customer_id').agg({
    'amount_usd': 'sum',
    'predicted_days_late': 'mean',
    'invoice_id': 'count'
}).rename(columns={'invoice_id': 'count'}).sort_values('amount_usd', ascending=False)

print("[Top customers by AR exposure:")
print("[-" * 80)
for idx, row in concentration.head(5).iterrows():
    pct = (row['amount_usd'] / predictions['amount_usd'].sum()) * 100
    if row['predicted_days_late'] < 5:
        risk = "[GREEN]"
    elif row['predicted_days_late'] < 10:
        risk = "[YELLOW]"
    else:
        risk = "[RED]"
    print(f"  Customer {idx:3.0f}      ${row['amount_usd']:>10,.0f} ({pct:5.1f}%) "
          f"Avg {row['predicted_days_late']:5.1f} days late  {risk}")

print("[-" * 80)
print()

# %% [code cell 9]
print("[[SAVE] Exporting predictions...")
print()

export_path = f"{OUTPUT_DIR}/N3_invoice_payment_predictions.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
predictions.to_csv(export_path, index=False)

print(f"[OK] Exported: {export_path}")
print(f"  Records: {len(predictions)}")
print()

# Also save model metadata
model_metadata = {
    'model_type': 'Random Forest Regressor',
    'training_records': len(X_train),
    'test_mae': test_mae,
    'test_r2': test_r2,
    'features': list(X.columns)
}

print("[Model saved for reference")
print()

# %% [code cell 10]
print("[=" * 80)
print("[[DONE] N3 COMPLETE - Collections Predictions Built")
print("[=" * 80)
print()

avg_predicted_days_late = predictions['predicted_days_late'].mean()
total_ar = predictions['amount_usd'].sum()

print("[[INFO] Key Insights:")
print(f"   Model predicts average payment will be {avg_predicted_days_late:.1f} days late")
print(f"   Total outstanding AR: ${total_ar:,.0f}")
print(f"   {len(at_risk)} invoices ({len(at_risk)/len(predictions)*100:.1f}%) predicted >7 days late")
print(f"   Top 3 customers = {(concentration.head(3)['amount_usd'].sum()/total_ar*100):.1f}% of exposure")
print()
print("[[GOAL] Comparison to Baseline:")
print(f"   N2 (Baseline): Assumed all invoices pay on their due date")
print(f"   N3 (Realistic): Model predicts average {avg_predicted_days_late:.1f} days late")
print("   N4 will quantify the cash impact from these predicted dates")
print()
print("[[GOAL] Next step: N4_Revised_Forecast.ipynb")
print("[   Rebuild the cash forecast using these predicted payment dates")
