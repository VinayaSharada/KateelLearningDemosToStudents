# Auto-exported from N5_Working_Capital_Levers.ipynb. Edit the notebook, then regenerate this file.

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
ensure_pipeline_outputs(4)
print("Loading data from previous notebooks...")
print()

# Load validated data and predictions
try:
    validated_data = pd.read_csv(f"{OUTPUT_DIR}/N1_validated_data.csv")
    print(f"[OK] Loaded validated data from N1: {len(validated_data)} invoices")
except FileNotFoundError:
    print("Warning: N1 validated data not found")
    validated_data = None

try:
    predictions = pd.read_csv(f"{OUTPUT_DIR}/N3_invoice_payment_predictions.csv")
    print(f"[OK] Loaded predictions from N3: {len(predictions)} invoices")
except FileNotFoundError:
    print("Warning: N3 predictions not found")
    predictions = None

try:
    gap_analysis = pd.read_csv(f"{OUTPUT_DIR}/N4_gap_analysis.csv")
    print(f"[OK] Loaded gap analysis from N4: {len(gap_analysis)} days")
except FileNotFoundError:
    print("Warning: N4 gap analysis not found")
    gap_analysis = None

# Calculate target gap (cash to be closed)
if gap_analysis is not None:
    target_gap = max(0, gap_analysis.iloc[-1]['gap'])
    print(f"[OK] Target gap identified: ${target_gap:,.0f}")
else:
    target_gap = 500000
    # Default assumption
    print(f"[NOTE] Using default target gap: ${target_gap:,.0f}")

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
workshop_viz.explore_n5(gap_analysis, predictions, OUTPUT_DIR)

# %% [code cell 5]
print(" Current Working Capital Metrics")
print()
# Calculate baseline CCC metrics
total_ar = predictions['amount_usd'].sum()
avg_payment_terms = validated_data['payment_terms_days'].mean()
avg_dso = predictions['predicted_days_late'].mean() + avg_payment_terms

# Illustrative accounting assumptions for inventory, payables, and annual COGS
assumed_inventory_value = 8_000_000
assumed_payables_value = 10_000_000
assumed_cogs = 60_000_000
dio = (assumed_inventory_value / assumed_cogs) * 365
dpo = (assumed_payables_value / assumed_cogs) * 365
ccc = avg_dso + dio - dpo
print(f"  DSO (Days Sales Outstanding):        {avg_dso:.1f} days")
print(f"  DIO (Days Inventory Outstanding):    {dio:.1f} days")
print(f"  DPO (Days Payable Outstanding):      {dpo:.1f} days")
print(f"  CCC (Cash Conversion Cycle):         {ccc:.1f} days")
print()

# %% [code cell 6]
print("SCENARIO ANALYSIS")
print()

scenarios = []

# Scenario 0: Baseline (no changes)
scenarios.append({
    'scenario': 'Baseline',
    'dso_reduction': 0,
    'dio_reduction': 0,
    'dpo_increase': 0,
    'description': 'No changes'
})

# Scenario 1: Aggressive Collections (reduce DSO 5 days)
dso_reduction = 5
cash_impact_1 = (dso_reduction / 365) * total_ar
scenarios.append({
    'scenario': 'Collections Push',
    'dso_reduction': dso_reduction,
    'dio_reduction': 0,
    'dpo_increase': 0,
    'description': 'Activate dunning + early-pay discounts',
    'cash_impact': cash_impact_1
})

# Scenario 2: Inventory Reduction (reduce DIO 10%)
dio_reduction_pct = 10
cash_impact_2 = (dio_reduction_pct / 100) * assumed_inventory_value
scenarios.append({
    'scenario': 'Inventory Reduction',
    'dso_reduction': 0,
    'dio_reduction': dio_reduction_pct,
    'dpo_increase': 0,
    'description': 'JIT inventory + demand forecast',
    'cash_impact': cash_impact_2
})

# Scenario 3: Extend Payables (increase DPO 7 days)
dpo_increase = 7
cash_impact_3 = (dpo_increase / 365) * assumed_cogs
scenarios.append({
    'scenario': 'Extend Payables',
    'dso_reduction': 0,
    'dio_reduction': 0,
    'dpo_increase': dpo_increase,
    'description': 'Negotiate extended terms with suppliers',
    'cash_impact': cash_impact_3
})

# Scenario 4: Combined (Collections + Payables)
cash_impact_4 = cash_impact_1 + cash_impact_3
scenarios.append({
    'scenario': 'Combined (Collections + Payables)',
    'dso_reduction': dso_reduction,
    'dio_reduction': 0,
    'dpo_increase': dpo_increase,
    'description': 'Both collections push AND payables extension',
    'cash_impact': cash_impact_4
})

# Scenario 5: Aggressive Combined
cash_impact_5 = cash_impact_1 + cash_impact_2 + cash_impact_3
scenarios.append({
    'scenario': 'All Three Levers',
    'dso_reduction': dso_reduction,
    'dio_reduction': dio_reduction_pct,
    'dpo_increase': dpo_increase,
    'description': 'Collections + Inventory + Payables',
    'cash_impact': cash_impact_5
})

# Convert to dataframe
scenarios_df = pd.DataFrame(scenarios)

print("Scenario Summary:")

for idx, row in scenarios_df.iterrows():
    if 'cash_impact' in row and pd.notna(row['cash_impact']):
        impact = row['cash_impact']
        pct_closed = (impact / target_gap * 100) if target_gap > 0 else 0
        status = "[OK] CLOSES GAP" if impact >= target_gap else f"{pct_closed:.0f}% closes gap"
        print(f"{row['scenario']:30s}")
        print(f"  {row['description']}")
        print(f"  Cash impact: ${impact:,.0f}  ({status})")
        if row['dso_reduction'] > 0:
            print(f"     DSO reduction: {row['dso_reduction']:.0f} days")
        if row['dio_reduction'] > 0:
            print(f"     DIO reduction: {row['dio_reduction']:.0f}%")
        if row['dpo_increase'] > 0:
            print(f"     DPO increase: {row['dpo_increase']:.0f} days")
        print()

print()

# %% [code cell 7]
print("Warning: RISK ANALYSIS")
print()

risks = {
    'Collections': {
        'impact': cash_impact_1,
        'risks': [
            'Customer churn from aggressive dunning',
            'Early-pay discounts reduce margin',
            'Sales team pushback on key accounts'
        ],
        'timeline': '1-2 weeks',
        'feasibility': 'Medium'
    },
    'Inventory': {
        'impact': cash_impact_2,
        'risks': [
            'Stockout risk if demand increases',
            'Supply chain disruption impact',
            'Requires operations coordination'
        ],
        'timeline': '4-8 weeks',
        'feasibility': 'Hard'
    },
    'Payables': {
        'impact': cash_impact_3,
        'risks': [
            'Supplier relationship tension',
            'Lose early-pay discounts',
            'May lose preferred status'
        ],
        'timeline': '2-3 weeks',
        'feasibility': 'Medium'
    }
}

for lever, details in risks.items():
    print(f"{lever} (${details['impact']:,.0f} impact):")
    print(f"  Timeline: {details['timeline']}")
    print(f"  Feasibility: {details['feasibility']}")
    for risk in details['risks']:
        print(f"   {risk}")
    print()

# %% [code cell 8]
print("Idea: RECOMMENDATION")
print()
print("Based on impact, timeline, and feasibility:")
print()
print(f"[OK] BEST APPROACH: Collections + Payables (Scenario 4)")
print(f"  Impact: ${cash_impact_4:,.0f}")
print(f"  Closes {(cash_impact_4/target_gap*100):.0f}% of gap")
print()
print("  Why this approach:")
print("  1. Collections is fast (1-2 weeks) and impactful")
print("  2. Payables is negotiation-based (medium-term)")
print("  3. Both independent (can do in parallel)")
print("  4. If one stalls, you still have the other")
print()

# %% [code cell 9]
print("Exporting scenarios...")

export_path = f"{OUTPUT_DIR}/N5_ccc_scenarios.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
scenarios_df.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")
print()

# %% [code cell 10]
print("N5 COMPLETE - Working Capital Levers Modeled")
print()
print("Key Insights:")
print(f"   ${target_gap:,.0f} gap needs to be closed")
print(f"   Collections alone can close {(cash_impact_1/target_gap*100):.0f}% of gap")
print(f"   Payables alone can close {(cash_impact_3/target_gap*100):.0f}% of gap")
print(f"   Combined can close {(cash_impact_4/target_gap*100):.0f}% of gap")
print()
print("Next step: N6_FX_Hedge_Decision.ipynb")
print("   Consider FX hedging strategy for open exposures")

# %% [code cell 11]
workshop_viz.outcome_n5(scenarios_df, target_gap, OUTPUT_DIR)
