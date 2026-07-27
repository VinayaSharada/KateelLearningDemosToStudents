# Auto-exported from N2_Baseline_Forecast.ipynb. Edit the notebook, then regenerate this file.

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
print("[[FILES] Loading data...")
print()

# Load validated data and cash flow schedule
# Try N1 outputs first, fall back to GitHub source data
try:
    validated_data = pd.read_csv(f"{OUTPUT_DIR}/N1_validated_data.csv")
    cash_flow = pd.read_csv(f"{OUTPUT_DIR}/N1_cash_flow.csv")
    print(f"[OK] Loaded {len(validated_data)} invoice records from N1 outputs")
    print(f"[OK] Loaded {len(cash_flow)} days of cash flow schedule from N1 outputs")
except FileNotFoundError:
    # Fallback: Load source data and prepare validated dataset
    print("N1 outputs not found, loading from GitHub source data...")
    invoices = pd.read_csv(f'{GITHUB_RAW_URL}/invoices.csv')
    customers = pd.read_csv(f'{GITHUB_RAW_URL}/customers.csv')
    payments = pd.read_csv(f'{GITHUB_RAW_URL}/payments.csv')
    cash_flow = pd.read_csv(f'{GITHUB_RAW_URL}/cash_flow.csv')
    # Prepare validated_data similar to N1
    validated_data = invoices.merge(
        customers[['customer_id', 'avg_days_late', 'risk_score', 'industry']],
        on='customer_id',
        how='left'
    ).merge(
        payments[['invoice_id', 'payment_date', 'days_late']],
        on='invoice_id',
        how='left'
    )
    validated_data.rename(columns={'days_late': 'actual_days_late'}, inplace=True)
    print(f"[OK] Prepared {len(validated_data)} invoice records")
    print(f"[OK] Loaded {len(cash_flow)} days of cash flow schedule")

print()

# Convert date columns
validated_data['invoice_date'] = pd.to_datetime(validated_data['invoice_date'])
validated_data['due_date'] = pd.to_datetime(validated_data['due_date'])
cash_flow['date'] = pd.to_datetime(cash_flow['date'])

# %% [code cell 4]
print("[ Forecast Setup")
print()

# Forecast starts today (using the earliest date in cash_flow as "today")
forecast_start = cash_flow['date'].min()
forecast_end = cash_flow['date'].max()

print(f"  Forecast period: {forecast_start.date()} to {forecast_end.date()}")
print(f"  Duration: {len(cash_flow)} days")
print()

# Starting cash position (assumption - customize as needed)
starting_cash = 5_000_000  # $5M starting balance
print(f"  Starting cash position: ${starting_cash:,.0f}")
print()

# %% [code cell 5]
print("[[MONEY] INFLOWS - Projected Invoice Receipts")
print()

# In this BASELINE scenario, invoices are assumed to pay on their due date
# So inflow amount = invoice amount, inflow date = due date
inflows = validated_data[['invoice_id', 'customer_id', 'due_date', 'amount_usd']].copy()
inflows.columns = ['invoice_id', 'customer_id', 'payment_date', 'payment_amount']
inflows = inflows[inflows['payment_date'] >= forecast_start]
inflows = inflows[inflows['payment_date'] <= forecast_end]

print(f"Invoices due during forecast period: {len(inflows)}")
print(f"Total inflows: ${inflows['payment_amount'].sum():,.0f}")
print()

# Show top inflows
print("[Top 5 inflows:")
top_inflows = inflows.nlargest(5, 'payment_amount')
for idx, row in top_inflows.iterrows():
    print(f"  {row['payment_date'].date()}: Customer {row['customer_id']:>3d} ${row['payment_amount']:>10,.0f}")

print()

# %% [code cell 6]
print("[[BANK] Building Daily Cash Position")
print()

# Create a day-by-day cash position
daily_data = []
for day_num in range(len(cash_flow)):
    day_row = cash_flow.iloc[day_num]
    day_date = day_row['date']
    # Get inflows for this day
    day_inflows = inflows[inflows['payment_date'] == day_date]['payment_amount'].sum()
    # Get outflows for this day
    day_outflows = day_row['total_outflows']

    # Calculate cumulative cash
    if day_num == 0:
        opening_cash = starting_cash
    else:
        opening_cash = daily_data[day_num - 1]['closing_cash']

    # Net change
    net_change = day_inflows - day_outflows
    closing_cash = opening_cash + net_change
    daily_data.append({
        'day': day_num + 1,
        'date': day_date,
        'opening_cash': opening_cash,
        'inflows': day_inflows,
        'outflows': day_outflows,
        'net_change': net_change,
        # Negative cash is intentional: it quantifies the funding requirement.
        'closing_cash': closing_cash
    })

cash_forecast = pd.DataFrame(daily_data)
print(f"[OK] {len(cash_forecast)}-day baseline forecast complete")
print()

# %% [code cell 7]
print("[[CHART] BASELINE FORECAST SUMMARY")
print()
print(f"Starting cash position:    ${cash_forecast.iloc[0]['opening_cash']:>12,.0f}")
print(f"Total inflows ({len(cash_forecast)} days):  ${cash_forecast['inflows'].sum():>12,.0f}")
print(f"Total outflows ({len(cash_forecast)} days): ${cash_forecast['outflows'].sum():>12,.0f}")
print(f"Net change:                ${cash_forecast['net_change'].sum():>12,.0f}")
print(f"Ending cash position:      ${cash_forecast.iloc[-1]['closing_cash']:>12,.0f}")
print()

# Critical days
print("[Cash position key points:")
min_cash_day = cash_forecast.loc[cash_forecast['closing_cash'].idxmin()]
print(f"  Lowest point: Day {int(min_cash_day['day'])}, ${min_cash_day['closing_cash']:,.0f}")
max_cash_day = cash_forecast.loc[cash_forecast['closing_cash'].idxmax()]
print(f"  Highest point: Day {int(max_cash_day['day'])}, ${max_cash_day['closing_cash']:,.0f}")
print()

# Daily detail
print("[Daily cash position:")
print("[-" * 80)
for idx, row in cash_forecast.iterrows():
    status = "[OK]" if row['closing_cash'] > 1_000_000 else ("[WARNING]" if row['closing_cash'] > 500_000 else "[ALERT]")
    print(f"  Day {int(row['day']):2d} ({row['date'].strftime('%a %m-%d')}): "
          f"${row['opening_cash']:>10,.0f} "
          f"+ ${row['inflows']:>10,.0f} "
          f"- ${row['outflows']:>10,.0f} "
          f"= ${row['closing_cash']:>10,.0f}  {status}")

print("[-" * 80)
print()

# %% [code cell 8]
print("[[WARNING]  RISK ASSESSMENT (Baseline Scenario)")
print()

min_cash = cash_forecast['closing_cash'].min()

if min_cash < 500_000:
    print("[[ALERT] HIGH RISK: Cash balance drops below $500K")
elif min_cash < 1_000_000:
    print("[[WARNING]  MEDIUM RISK: Cash balance drops below $1M")
else:
    print("[[OK] LOW RISK: Comfortable cash balance maintained")

print()
print("[[WARNING]  CRITICAL ASSUMPTION:")
print("[   This baseline assumes ALL invoices pay on their due date.")
print("[   Historical data shows this is OPTIMISTIC.")
historical_avg_late = validated_data['actual_days_late'].dropna().mean()
print(f"[   Historical average payment delay is {historical_avg_late:.1f} days.")
print()

# %% [code cell 9]
print("[[SAVE] Exporting baseline forecast...")
export_path = f"{OUTPUT_DIR}/N2_baseline_forecast.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
cash_forecast.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")
print()

# %% [code cell 10]
print("[=" * 80)
print("[[DONE] N2 COMPLETE - Baseline Forecast Built")
print("[=" * 80)
print()
print("[[INFO] Key Insights:")
print(f"   If all invoices pay on time, we end with ${cash_forecast.iloc[-1]['closing_cash']:,.0f}")
print(f"   Minimum cash point: Day {int(min_cash_day['day'])} (${min_cash_day['closing_cash']:,.0f})")

if min_cash < 1_500_000:
    print(f"   [WARNING]  Our cash balance dips below $1.5M on Day {int(min_cash_day['day'])}")
    print(f"   This is approaching our minimum comfort zone")
else:
    print(f"   [OK] Cash position remains healthy throughout")

print()
print("[[GOAL] BUT WAIT - Why This Might Be Wrong:")
print(f"[   Historical payments arrived {historical_avg_late:.1f} days late on average")
print("[   N3 will estimate the delay invoice by invoice")
print("[   N4 will quantify the resulting cash-position difference")
print()
print("[[GOAL] Next step: N3_Collections_Intelligence.ipynb")
print("[   Use ML to predict which invoices will actually be late and by how many days")
