# Auto-exported from N1_Import_and_Validate.ipynb. Edit the notebook, then regenerate this file.

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

# Shared workshop chart helpers (local Jupyter or fresh Colab runtime).
try:
    import cfopack_visuals as workshop_viz
except ImportError:
    from types import SimpleNamespace
    from urllib.request import urlopen
    visual_url = (
        'https://raw.githubusercontent.com/VinayaSharada/'
        'KateelLearningDemosToStudents/main/CFOPackV001/notebooks/'
        'cfopack_visuals.py'
    )
    visual_namespace = {}
    exec(compile(urlopen(visual_url).read(), visual_url, 'exec'), visual_namespace)
    workshop_viz = SimpleNamespace(**visual_namespace)
workshop_viz.configure_workshop()

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
# ==============================================================================

print("N1: IMPORT AND VALIDATE DATA")
print()
# Define file paths (adjust if running from different directory)
# Try local first, fall back to GitHub
try:
    data_dir = "../data/synthetic/"
    invoices = pd.read_csv(data_dir + "invoices.csv")
    payments = pd.read_csv(data_dir + "payments.csv")
    customers = pd.read_csv(data_dir + "customers.csv")
    fx_exposure = pd.read_csv(data_dir + "fx_exposure.csv")
    cash_flow = pd.read_csv(data_dir + "cash_flow.csv")
except FileNotFoundError:
# Fallback to GitHub if local files not found
    print("Local data not found, loading from GitHub...")
    invoices = pd.read_csv(f'{GITHUB_RAW_URL}/invoices.csv')
    payments = pd.read_csv(f'{GITHUB_RAW_URL}/payments.csv')
    customers = pd.read_csv(f'{GITHUB_RAW_URL}/customers.csv')
    fx_exposure = pd.read_csv(f'{GITHUB_RAW_URL}/fx_exposure.csv')
    cash_flow = pd.read_csv(f'{GITHUB_RAW_URL}/cash_flow.csv')
print("Loading data files...")
print(f"[OK] invoices.csv: {len(invoices)} rows")
print(f"[OK] payments.csv: {len(payments)} rows")
print(f"[OK] customers.csv: {len(customers)} rows")
print(f"[OK] fx_exposure.csv: {len(fx_exposure)} rows")
print(f"[OK] cash_flow.csv: {len(cash_flow)} rows")
print()
# ==============================================================================

# %% [code cell 4]
workshop_viz.explore_n1(invoices, payments, customers, cash_flow, OUTPUT_DIR)

# %% [code cell 5]
print("RUNNING DATA QUALITY CHECKS...")
print()

# Check 1: Invoices completeness
print("Check 1: Invoices Completeness")
missing_cols = invoices.columns[invoices.isnull().any()].tolist()
if missing_cols:
    print(f"  [WARNING]  Missing values in: {missing_cols}")
    print(f"     {invoices[missing_cols].isnull().sum()}")
else:
    print("  [OK] No missing values")

# Check 2: Date format validation
print("\nCheck 2: Date Format Validation")
date_cols = ['invoice_date', 'due_date']
try:
    for col in date_cols:
        invoices[col] = pd.to_datetime(invoices[col])
    print(f"  [OK] All date columns are valid")
except Exception as e:
    print(f"  [WARNING]  Date parsing error: {e}")

# Check 3: Currency amounts are positive
print("\nCheck 3: Currency Values")
amount_cols = [col for col in invoices.columns if 'amount' in col.lower() or 'usd' in col.lower()]
negative_amounts = (invoices[amount_cols] < 0).sum().sum()
if negative_amounts > 0:
    print(f"  [WARNING]  {negative_amounts} negative amounts found (should all be positive)")
else:
    print(f"  [OK] All amounts are positive")

# Check 4: Payments vs Invoices
print("\nCheck 4: Payment to Invoice Matching")
invoices_set = set(invoices['invoice_id'].unique())
payments_set = set(payments['invoice_id'].unique())
orphaned_payments = payments_set - invoices_set
matching_payments = len(payments_set & invoices_set)
print(f"  {matching_payments} payments matched to invoices")
if orphaned_payments:
    print(f"  [WARNING]  {len(orphaned_payments)} payments have no matching invoice")
else:
    print(f"  [OK] All payments matched to invoices")

# Check 5: Customer references
print("\nCheck 5: Customer Reference Integrity")
invoices_customers = set(invoices['customer_id'].unique())
defined_customers = set(customers['customer_id'].unique())
undefined_customers = invoices_customers - defined_customers
if undefined_customers:
    print(f"  [WARNING]  {len(undefined_customers)} customers in invoices are not in customer master")
    print(f"     Missing: {undefined_customers}")
else:
    print(f"  [OK] All invoice customers are in customer master")

# Check 6: FX exposure sanity check
print("\nCheck 6: FX Exposure Validation")
if fx_exposure['notional_amount'].sum() > 0:
    print(f"  [OK] Total FX notional exposure: ${fx_exposure['notional_amount'].sum():,.0f}")
else:
    print(f"  [WARNING]  No FX exposure found")

# Check 7: Cash flow consistency
print("\nCheck 7: Cash Flow Schedule")
if len(cash_flow) >= 14:
    print(f"  [OK] {len(cash_flow)}-day cash flow schedule present")
else:
    print(f"  [WARNING]  Only {len(cash_flow)} days in schedule (expected 14+)")

print()

# %% [code cell 6]
print("DATA SUMMARY")
print()
print("INVOICES Summary:")
print(f"  Total invoices: {len(invoices)}")
print(f"  Total AR value: ${invoices['amount_usd'].sum():,.0f}")
print(f"  Average invoice: ${invoices['amount_usd'].mean():,.0f}")
print(f"  Date range: {invoices['invoice_date'].min()} to {invoices['invoice_date'].max()}")
print(f"  Unique customers: {invoices['customer_id'].nunique()}")
print(f"  Paid invoices: {(invoices['status']=='paid').sum():,}")
print(f"  Outstanding invoices: {(invoices['status']=='outstanding').sum():,}")
print("\nCUSTOMERS Summary:")
print(f"  Total customers: {len(customers)}")
print(f"  Industries: {customers['industry'].nunique()} unique")
print(f"  Avg days late: {customers['avg_days_late'].mean():.1f}")
print(f"  Avg risk score: {customers['risk_score'].mean():.2f}")
print("\nPAYMENT HISTORY Summary:")
print(f"  Historical payments: {len(payments)}")
print(f"  Average days late: {payments['days_late'].mean():.1f}")
print(f"  On-time (0 days late): {(payments['days_late'] == 0).sum()}")
print(f"  Late (>7 days): {(payments['days_late'] > 7).sum()}")
print("\nFX EXPOSURE Summary:")
for idx, row in fx_exposure.iterrows():
    hedge_pct = row['current_hedge_ratio'] * 100
    print(f"  {row['currency']}: ${row['notional_amount']:,.0f} ({hedge_pct:.0f}% hedged)")
print(f"[\nCASH FLOW Summary ({len(cash_flow)}-day):")
total_outflows = cash_flow['total_outflows'].sum()
print(f"  Total outflows: ${total_outflows:,.0f}")
print(f"  Largest outflow day: Day {cash_flow.loc[cash_flow['total_outflows'].idxmax(), 'day']:.0f}")
print(f"    (${cash_flow['total_outflows'].max():,.0f})")
print()

# %% [code cell 7]
print("DATA QUALITY ASSESSMENT")
print()

# Calculate quality score
quality_score = 100
quality_issues = []

if missing_cols:
    quality_score -= 10
    quality_issues.append(f"Missing values in {len(missing_cols)} columns")

if negative_amounts > 0:
    quality_score -= 15
    quality_issues.append(f"{negative_amounts} negative amounts")

if len(orphaned_payments) > 0:
    quality_score -= 5
    quality_issues.append(f"{len(orphaned_payments)} orphaned payments")

if len(undefined_customers) > 0:
    quality_score -= 10
    quality_issues.append(f"{len(undefined_customers)} undefined customers")

if len(cash_flow) < 14:
    quality_score -= 5
    quality_issues.append(f"Cash flow incomplete ({len(cash_flow)} days instead of 14+)")

quality_score = max(0, quality_score)

if quality_score == 100:
    print("EXCELLENT - Data quality is good. Ready to proceed.")
elif quality_score >= 80:
    print("GOOD - Minor issues found. Safe to proceed with caution.")
    for issue in quality_issues:
        print(f"   {issue}")
elif quality_score >= 60:
    print("Warning: FAIR - Several issues found. Recommend cleaning before analysis.")
    for issue in quality_issues:
        print(f"   {issue}")
else:
    print("Error: POOR - Major issues found. Data cleaning required.")
    for issue in quality_issues:
        print(f"   {issue}")

print(f"\nData Quality Score: {quality_score}/100")
print()

# %% [code cell 8]
# ==============================================================================
print("EXPORTING VALIDATED DATA")
print()
# Combine invoices with customer information
invoices_with_customers = invoices.merge(
    customers[['customer_id', 'avg_days_late', 'risk_score', 'industry']],
    on='customer_id',
    how='left'
)
# Combine with payment history (for each invoice, was it paid, when, how many days late?)
# Left join keeps outstanding invoices that have no payment yet
invoices_with_payments = invoices_with_customers.merge(
    payments[['invoice_id', 'payment_date', 'days_late']],
    on='invoice_id',
    how='left',
    suffixes=('', '_actual')
)
invoices_with_payments.rename(
    columns={'days_late': 'actual_days_late'},
    inplace=True
)

export_path = f"{OUTPUT_DIR}/N1_validated_data.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
invoices_with_payments.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")
print(f"  Records: {len(invoices_with_payments)}")
print(f"  Columns: {len(invoices_with_payments.columns)}")
print()
# Save supporting files for downstream notebooks
customers.to_csv(f"{OUTPUT_DIR}/N1_customers.csv", index=False)
fx_exposure.to_csv(f"{OUTPUT_DIR}/N1_fx_exposure.csv", index=False)
cash_flow.to_csv(f"{OUTPUT_DIR}/N1_cash_flow.csv", index=False)
print("Supporting files exported")
print()
print("N1 COMPLETE - Data validated and ready for forecasting")
print()
print("What we learned:")
print("   Data quality is", "EXCELLENT [OK]"
if quality_score == 100 else f"{quality_score}/100")
print(f"   We have {invoices['customer_id'].nunique()} customers with ${invoices['amount_usd'].sum()/1_000_000:.1f}M in receivables")
print(f"   Payment history shows customers typically pay {payments['days_late'].mean():.1f} days late")
print(f"   This suggests our baseline forecast (assuming on-time payment) is OPTIMISTIC")
print()
print("Next step: N2_Baseline_Forecast.ipynb")
print("   Build a 14-day cash forecast assuming all invoices pay on their due dates")

# %% [code cell 9]
workshop_viz.outcome_n1(invoices, payments, quality_score, OUTPUT_DIR)
