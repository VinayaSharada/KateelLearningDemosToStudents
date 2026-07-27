# Auto-exported from N6_FX_Hedge_Decision.ipynb. Edit the notebook, then regenerate this file.

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
print("[[LOAD] Loading FX exposure and gap analysis data...")
print()

# Load FX exposure data
try:
    fx_exposure = pd.read_csv(f"{OUTPUT_DIR}/N1_fx_exposure.csv")
    print(f"[OK] Loaded FX exposure from N1: {len(fx_exposure)} currencies")
except FileNotFoundError:
    # Fallback to source data
    try:
        fx_exposure = pd.read_csv(f'{GITHUB_RAW_URL}/fx_exposure.csv')
        print(f"[OK] Loaded FX exposure from GitHub: {len(fx_exposure)} currencies")
    except:
        print("[WARNING] Could not load FX exposure")
        fx_exposure = None

# Load gap analysis for target_gap calculation
try:
    gap_analysis = pd.read_csv(f"{OUTPUT_DIR}/N4_gap_analysis.csv")
    print(f"[OK] Loaded gap analysis from N4")
    target_gap = max(0, gap_analysis.iloc[-1]['gap'])
    print(f"[OK] Target gap: ${target_gap:,.0f}")
except FileNotFoundError:
    print("[WARNING] N4 gap analysis not found, using default")
    target_gap = 500000
    gap_analysis = None

# Set approved policy range for hedging
approved_range = (0.50, 0.75)
print(f"[OK] Board-approved hedge range: {approved_range[0]*100:.0f}% - {approved_range[1]*100:.0f}%")
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
print(f"Current Open Exposures:")
print("[-" * 80)

total_exposure = fx_exposure['notional_amount'].sum()

for idx, row in fx_exposure.iterrows():
    pct_total = (row['notional_amount'] / total_exposure) * 100
    current_hedge = row['current_hedge_ratio'] * 100
    print(f"{row['currency']} Exposure:")
    print(f"  Notional:        ${row['notional_amount']:>10,.0f} ({pct_total:5.1f}% of total)")
    print(f"  Type:            {row['transaction_type']}")
    print(f"  Current hedge:   {current_hedge:>10.0f}%")
    print()

print(f"Total FX exposure: ${total_exposure:,.0f}")
print()

# %% [code cell 5]
print("[[WARNING]  VOLATILITY ANALYSIS")
print()

# Assume historical volatility (in real system, would pull from market data)
volatility_assumptions = {
    'EUR': {'volatility': 0.08, 'current_rate': 1.08, 'worst_case_rate': 1.00},  # 8% volatility
    'GBP': {'volatility': 0.10, 'current_rate': 1.27, 'worst_case_rate': 1.15},
    'JPY': {'volatility': 0.12, 'current_rate': 0.0067, 'worst_case_rate': 0.0063},
    'INR': {'volatility': 0.07, 'current_rate': 0.012, 'worst_case_rate': 0.011}
}

print("[Estimated exposure risk (worst-case 1 standard deviation move):")
print("[-" * 80)

total_exposure_at_risk = 0

for idx, row in fx_exposure.iterrows():
    currency = row['currency']
    notional = row['notional_amount']

    if currency in volatility_assumptions:
        vol = volatility_assumptions[currency]['volatility']
        exposure_at_risk = notional * vol
        total_exposure_at_risk += exposure_at_risk
        print(f"{currency}: ${exposure_at_risk:>10,.0f} (${notional:,.0f}  {vol*100:.0f}% volatility)")

print("[-" * 80)
print(f"Total exposure at risk: ${total_exposure_at_risk:,.0f}")
print()

if total_exposure_at_risk > target_gap:
    print(f"[WARNING]  FX risk (${total_exposure_at_risk:,.0f}) exceeds cash gap (${target_gap:,.0f})")
    print("[   Hedging recommended to reduce this risk")
else:
    print(f"[OK] FX risk (${total_exposure_at_risk:,.0f}) is less than cash gap")
    print("[   But hedging still recommended as prudent risk management")

print()

# %% [code cell 6]
print("[[GOAL] HEDGING SCENARIOS")
print()

# Calculate hedging costs (assume ~0.5% of notional for 3-month forward)
hedging_cost_pct = 0.005
recommendations = []

for hedge_ratio in [0.50, 0.65, 0.75, 0.85]:
    hedge_amount = total_exposure * hedge_ratio
    hedge_cost_monthly = hedge_amount * hedging_cost_pct
    recommendations.append({
        'hedge_ratio': hedge_ratio,
        'hedge_amount': hedge_amount,
        'monthly_cost': hedge_cost_monthly,
        'annual_cost': hedge_cost_monthly * 12,
        'unhedged_exposure': total_exposure * (1 - hedge_ratio)
    })

    print(f"Scenario: {hedge_ratio*100:.0f}% Hedge Ratio")
    print(f"  Hedge amount:       ${hedge_amount:,.0f}")
    print(f"  Monthly cost:       ${hedge_cost_monthly:,.0f}")
    print(f"  Annual cost:        ${hedge_cost_monthly*12:,.0f}")
    print(f"  Unhedged exposure:  ${total_exposure * (1 - hedge_ratio):,.0f}")
    print()

# %% [code cell 7]
print("[[LIST] POLICY COMPLIANCE")
print()

# Assume board-approved policy: 50-75% EUR hedge ratio
approved_range = (0.50, 0.75)

print(f"Board-approved hedge range: {approved_range[0]*100:.0f}% - {approved_range[1]*100:.0f}%")
print()

# Check each currency
for idx, row in fx_exposure.iterrows():
    current_hedge = row['current_hedge_ratio']

    if current_hedge < approved_range[0]:
        status = "[WARNING]  UNDER-HEDGED"
    elif current_hedge > approved_range[1]:
        status = "[WARNING]  OVER-HEDGED"
    else:
        status = "[OK] COMPLIANT"

    print(f"{row['currency']}: Current {current_hedge*100:.0f}%  {status}")

print()

# %% [code cell 8]
print("[[IDEA] HEDGE RECOMMENDATION")
print()

recommended_ratio = 0.65
recommended_scenario = [r for r in recommendations if r['hedge_ratio'] == recommended_ratio][0]

print(f"Recommend: {recommended_ratio*100:.0f}% hedge ratio")
print(f"  EUR: Increase from current to {recommended_ratio*100:.0f}%")
print(f"  Hedge amount: ${recommended_scenario['hedge_amount']:,.0f}")
print(f"  Annual cost: ${recommended_scenario['annual_cost']:,.0f}")
print()
print("[Rationale:")
print(f"[   {recommended_ratio*100:.0f}% is within board-approved range ({approved_range[0]*100:.0f}%-{approved_range[1]*100:.0f}%)")
print(f"   Protects ~${recommended_scenario['unhedged_exposure']:,.0f} of exposure")
print(f"   Cost (${recommended_scenario['annual_cost']:,.0f}/year) is reasonable")
print(f"   Leaves some upside if EUR weakens")
print()

# %% [code cell 9]
print("[[OK] APPROVAL PATH")
print()

if recommended_ratio > 0.70:
    print("[This recommendation requires:")
    print("[  1. CFO approval (within existing authority)")
    print("[  2. Quarterly board review notification (>70% trigger)")
else:
    print("[This recommendation requires:")
    print("[  1. CFO approval only (within existing authority)")
    print()

# %% [code cell 10]
print("[[SAVE] Exporting hedge recommendation...")

recommendations_df = pd.DataFrame(recommendations)
export_path = f"{OUTPUT_DIR}/N6_hedge_recommendation.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
recommendations_df.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")
print()

# %% [code cell 11]
print("[=" * 80)
print("[[DONE] N6 COMPLETE - FX Hedge Decision")
print("[=" * 80)
print()
print("[[INFO] Key Insights:")
print(f"   Total FX exposure: ${total_exposure:,.0f}")
print(f"   Exposure at risk: ${total_exposure_at_risk:,.0f}")
print(f"   Recommended hedge: {recommended_ratio*100:.0f}%")
print(f"   Annual hedging cost: ${recommended_scenario['annual_cost']:,.0f}")
print()
print("[[GOAL] Next step: N7_Decision_Framework.ipynb")
print("[   Synthesize all analysis into CFO-ready decision memo")
