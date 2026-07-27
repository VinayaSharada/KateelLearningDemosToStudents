# Auto-exported from N4_Revised_Forecast.ipynb. Edit the notebook, then regenerate this file.

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

def ensure_pipeline_outputs(through):
    """Build missing upstream outputs when this notebook runs by itself."""
    try:
        from cfopack_pipeline import ensure_outputs as build_outputs
    except ImportError:
        from urllib.request import urlopen
        helper_url = 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/notebooks/cfopack_pipeline.py'
        namespace = {}
        exec(compile(urlopen(helper_url).read(), helper_url, 'exec'), namespace)
        build_outputs = namespace['ensure_outputs']
    build_outputs(OUTPUT_DIR, through, GITHUB_RAW_URL)

print('✓ Imports successful')
print(f"✓ Data source: {'GitHub (synthetic)' if USE_GITHUB_DATA else 'Manual upload'}")

# %% [code cell 2]
ensure_pipeline_outputs(3)
print("[[LOAD] Loading data from N1, N2, N3 outputs...")
print()

# Load baseline forecast (from N2)
try:
    baseline_forecast = pd.read_csv(f"{OUTPUT_DIR}/N2_baseline_forecast.csv")
    print(f"[OK] Loaded baseline forecast from N2: {len(baseline_forecast)} days")
except FileNotFoundError:
    print("[WARNING] N2 baseline forecast not found, will create placeholder")
    baseline_forecast = None

# Load predictions (from N3)
try:
    predictions = pd.read_csv(f"{OUTPUT_DIR}/N3_invoice_payment_predictions.csv")
    print(f"[OK] Loaded predictions from N3: {len(predictions)} invoices")
except FileNotFoundError:
    print("[WARNING] N3 predictions not found, will create placeholder")
    predictions = None

# Load cash flow (from N1)
try:
    cash_flow = pd.read_csv(f"{OUTPUT_DIR}/N1_cash_flow.csv")
    print(f"[OK] Loaded cash flow from N1: {len(cash_flow)} days")
except FileNotFoundError:
    # Fallback to source data
    try:
        cash_flow = pd.read_csv(f'{GITHUB_RAW_URL}/cash_flow.csv')
        print(f"[OK] Loaded cash flow from GitHub: {len(cash_flow)} days")
    except:
        print("[ERROR] Could not load cash flow")
        cash_flow = None

# Convert date columns
if baseline_forecast is not None:
    baseline_forecast['date'] = pd.to_datetime(baseline_forecast['date'])

if predictions is not None:
    predictions['due_date'] = pd.to_datetime(predictions['due_date'])
    predictions['predicted_payment_date'] = pd.to_datetime(predictions['predicted_payment_date'])

if cash_flow is not None:
    cash_flow['date'] = pd.to_datetime(cash_flow['date'])

print()

# %% [code cell 3]
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

# %% [code cell 4]
print("[[BANK] Building revised forecast using predicted payment dates...")
print()

forecast_start = cash_flow['date'].min()
forecast_end = cash_flow['date'].max()
starting_cash = 5_000_000

# Get inflows using PREDICTED payment dates
revised_inflows = predictions[['invoice_id', 'predicted_payment_date', 'amount_usd']].copy()
revised_inflows.columns = ['invoice_id', 'payment_date', 'payment_amount']
revised_inflows = revised_inflows[revised_inflows['payment_date'] >= forecast_start]
revised_inflows = revised_inflows[revised_inflows['payment_date'] <= forecast_end]

print(f"Inflows (using predicted dates): {len(revised_inflows)}")
print(f"Total: ${revised_inflows['payment_amount'].sum():,.0f}")
print()

# Build day-by-day forecast
daily_revised = []
for day_num in range(len(cash_flow)):
    day_row = cash_flow.iloc[day_num]
    day_date = day_row['date']
    # Get inflows for this day (using predicted payment dates)
    day_inflows = revised_inflows[revised_inflows['payment_date'] == day_date]['payment_amount'].sum()
    # Get outflows
    day_outflows = day_row['total_outflows']

    # Calculate cash
    if day_num == 0:
        opening_cash = starting_cash
    else:
        opening_cash = daily_revised[day_num - 1]['closing_cash']

    net_change = day_inflows - day_outflows
    closing_cash = opening_cash + net_change
    daily_revised.append({
        'day': day_num + 1,
        'date': day_date,
        'opening_cash': opening_cash,
        'inflows': day_inflows,
        'outflows': day_outflows,
        'net_change': net_change,
        # Preserve deficits so the forecast shows the required funding amount.
        'closing_cash': closing_cash
    })

revised_forecast = pd.DataFrame(daily_revised)
print(f"[[OK] Revised {len(revised_forecast)}-day forecast complete")
print()

# %% [code cell 5]
print("[[CHART] BASELINE vs REVISED COMPARISON")
print()

# Merge for comparison
comparison = baseline_forecast[['day', 'date', 'closing_cash']].copy()
comparison.columns = ['day', 'date', 'baseline_closing_cash']
comparison['revised_closing_cash'] = revised_forecast['closing_cash'].values
comparison['gap'] = comparison['baseline_closing_cash'] - comparison['revised_closing_cash']

print("[Day-by-day gap:")
print("[-" * 100)
for idx, row in comparison.iterrows():
    if row['gap'] > 0:
        print(f"  Day {int(row['day']):2d}: Baseline ${row['baseline_closing_cash']:>10,.0f}  "
              f"Revised ${row['revised_closing_cash']:>10,.0f}  "
              f"Gap ${row['gap']:>10,.0f}")

print("[-" * 100)
print()

# Key metrics
baseline_min = comparison['baseline_closing_cash'].min()
revised_min = comparison['revised_closing_cash'].min()
final_gap = comparison.iloc[-1]['gap']

print(f"Summary Metrics:")
print(f"  Baseline minimum: ${baseline_min:,.0f} (Day {int(comparison[comparison['baseline_closing_cash'] == baseline_min]['day'].values[0])})")
print(f"  Revised minimum:  ${revised_min:,.0f} (Day {int(comparison[comparison['revised_closing_cash'] == revised_min]['day'].values[0])})")
print(f"  Gap on Day {len(comparison)}:    ${final_gap:,.0f}")
print()

# Interpretation
print("[[WARNING]  WHAT THIS MEANS:")
print(f"   Baseline (optimistic): Assumes all invoices pay on time")
print(f"   Revised (realistic): Assumes invoices pay {predictions['predicted_days_late'].mean():.1f} days late")
print(f"   Cash gap on Day {len(comparison)}: ${final_gap:,.0f}")
print()

if final_gap > 500_000:
    print(f"  [ALERT] This is a MATERIAL gap. Needs action.")
elif final_gap > 200_000:
    print(f"  [WARNING]  This is SIGNIFICANT. Consider mitigation strategies.")
else:
    print(f"  [OK] Gap is manageable with existing credit facility.")

print()

# %% [code cell 6]
print("[ CASH POSITION RISK ZONES")
print()

danger_threshold = 1_000_000
revised_in_danger = revised_forecast[revised_forecast['closing_cash'] < danger_threshold]

if len(revised_in_danger) > 0:
    print(f"[WARNING]  Days when cash falls below ${danger_threshold:,.0f}:")
    for idx, row in revised_in_danger.iterrows():
        print(f"    Day {int(row['day'])}: ${row['closing_cash']:,.0f}")
    print()
else:
    print(f"[OK] Cash stays above ${danger_threshold:,.0f} throughout forecast period")
    print()

# %% [code cell 7]
print("[[SAVE] Exporting revised forecast...")

export_path = f"{OUTPUT_DIR}/N4_revised_forecast.csv"
revised_forecast.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")

export_path = f"{OUTPUT_DIR}/N4_gap_analysis.csv"
comparison.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")
print()

# %% [code cell 8]
print("[=" * 80)
print("[[DONE] N4 COMPLETE - Revised Forecast Built")
print("[=" * 80)
print()
print("[[INFO] Key Finding:")
print(f"  Realistic cash position is ${final_gap:,.0f} LOWER than baseline on Day {len(comparison)}")
print()
print("[[GOAL] Next step: N5_Working_Capital_Levers.ipynb")
print("[   Model which operational levers (collections, inventory, payables) can close this gap")
