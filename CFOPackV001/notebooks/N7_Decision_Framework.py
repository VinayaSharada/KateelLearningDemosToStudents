# Auto-exported from N7_Decision_Framework.ipynb. Edit the notebook, then regenerate this file.

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
import json
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
ensure_pipeline_outputs(6)
print("Loading comprehensive analysis data from all previous notebooks...")
print()

# Load validated data (N1)
try:
    validated_data = pd.read_csv(f"{OUTPUT_DIR}/N1_validated_data.csv")
    print(f"[OK] N1: Loaded validated data ({len(validated_data)} invoices)")
except FileNotFoundError:
    validated_data = None
    print("Warning: N1 validated data not found")

# Load baseline forecast (N2)
try:
    baseline_forecast = pd.read_csv(f"{OUTPUT_DIR}/N2_baseline_forecast.csv")
    print(f"[OK] N2: Loaded baseline forecast ({len(baseline_forecast)} days)")
except FileNotFoundError:
    baseline_forecast = None
    print("Warning: N2 baseline forecast not found")

# Load predictions (N3)
try:
    predictions = pd.read_csv(f"{OUTPUT_DIR}/N3_invoice_payment_predictions.csv")
    print(f"[OK] N3: Loaded payment predictions ({len(predictions)} invoices)")
except FileNotFoundError:
    predictions = None
    print("Warning: N3 predictions not found")

# Load revised forecast and gap analysis (N4)
try:
    revised_forecast = pd.read_csv(f"{OUTPUT_DIR}/N4_revised_forecast.csv")
    gap_analysis = pd.read_csv(f"{OUTPUT_DIR}/N4_gap_analysis.csv")
    print(f"[OK] N4: Loaded revised forecast and gap analysis")
except FileNotFoundError:
    revised_forecast = None
    gap_analysis = None
    print("Warning: N4 outputs not found")

# Load CCC scenarios (N5)
try:
    scenarios_df = pd.read_csv(f"{OUTPUT_DIR}/N5_ccc_scenarios.csv")
    print(f"[OK] N5: Loaded {len(scenarios_df)} working capital scenarios")
except FileNotFoundError:
    scenarios_df = None
    print("Warning: N5 scenarios not found")

# Load FX hedge recommendation (N6)
try:
    hedge_recommendation = pd.read_csv(f"{OUTPUT_DIR}/N6_hedge_recommendation.csv")
    print(f"[OK] N6: Loaded FX hedge recommendation")
except FileNotFoundError:
    hedge_recommendation = None
    print("Warning: N6 hedge recommendation not found")

# Derive key metrics
if predictions is not None:
    avg_predicted_days_late = predictions['predicted_days_late'].mean()
else:
    avg_predicted_days_late = 8.5
    # Default

if gap_analysis is not None:
    total_gap = max(0, gap_analysis.iloc[-1]['gap'])
else:
    total_gap = 500000
    # Default

print(f"[OK] Key metrics: {avg_predicted_days_late:.1f} days late, ${total_gap:,.0f} gap")
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
workshop_viz.explore_n7(baseline_forecast, revised_forecast, scenarios_df, OUTPUT_DIR)

# %% [code cell 5]
forecast_days = len(gap_analysis)
baseline_end = baseline_forecast.iloc[-1]['closing_cash']
revised_end = revised_forecast.iloc[-1]['closing_cash']
final_gap = max(0, gap_analysis.iloc[-1]['gap'])
revised_min_row = revised_forecast.loc[revised_forecast['closing_cash'].idxmin()]
at_risk_count = int((predictions['predicted_days_late'] > 7).sum())
avg_delay = predictions['predicted_days_late'].mean()

def scenario_impact(name):
    row = scenarios_df.loc[scenarios_df['scenario'] == name, 'cash_impact']
    return float(row.iloc[0]) if len(row) else 0.0

collections_impact = scenario_impact('Collections Push')
payables_impact = scenario_impact('Extend Payables')
inventory_impact = scenario_impact('Inventory Reduction')
combined_impact = scenario_impact('Combined (Collections + Payables)')
all_levers_impact = scenario_impact('All Three Levers')
residual_gap = max(0, final_gap - all_levers_impact)
combined_pct = (combined_impact / final_gap * 100) if final_gap else 100.0
all_levers_pct = (all_levers_impact / final_gap * 100) if final_gap else 100.0

def money(value):
    sign = '-' if value < 0 else ''
    return f"{sign}${abs(value):,.0f}"

recommended_hedge = hedge_recommendation.iloc[(hedge_recommendation['hedge_ratio'] - 0.65).abs().argsort()[:1]].iloc[0]
fx_notional = recommended_hedge['hedge_amount'] / recommended_hedge['hedge_ratio']

memo_content = f"""# TREASURY DECISION MEMO

**TO:** Chief Financial Officer

**FROM:** Treasury Team

**DATE:** {datetime.now().strftime('%B %d, %Y')}

**SUBJECT:** 30-Day Liquidity Response

**PRIORITY:** High

---

## Executive summary

The contractual-due-date forecast ends Day {forecast_days} at **{money(baseline_end)}**. Applying the payment-delay model produces an ending position of **{money(revised_end)}**, a **{money(final_gap)} scenario gap**. The realistic forecast reaches its low point on Day {int(revised_min_row['day'])} at **{money(revised_min_row['closing_cash'])}**.

The model predicts an average delay of **{avg_delay:.1f} days**; **{at_risk_count:,} of {len(predictions):,}** outstanding invoices are predicted more than seven days late.

## Recommended decision

1. Launch collections and supplier-term work immediately. Their modeled combined impact is **{money(combined_impact)}** ({combined_pct:.1f}% of the gap).
2. Prepare the inventory lever as a second wave. All three modeled levers total **{money(all_levers_impact)}** ({all_levers_pct:.1f}% of the gap).
3. Arrange committed funding, payment deferrals, or other treasury actions for the remaining **{money(residual_gap)}**. The operational levers alone do not close the modeled gap.
4. Move FX coverage to the policy-compliant **{recommended_hedge['hedge_ratio']:.0%}** scenario, subject to CFO approval.

## Evidence

| Measure | Current result |
|---|---:|
| Forecast horizon | {forecast_days} days |
| Baseline ending cash | {money(baseline_end)} |
| Revised ending cash | {money(revised_end)} |
| End-of-horizon scenario gap | {money(final_gap)} |
| Collections impact | {money(collections_impact)} |
| Payables impact | {money(payables_impact)} |
| Inventory impact | {money(inventory_impact)} |
| All-levers residual gap | {money(residual_gap)} |
| FX notional reviewed | {money(fx_notional)} |
| Recommended hedge amount | {money(recommended_hedge['hedge_amount'])} |
| Estimated annual hedge cost | {money(recommended_hedge['annual_cost'])} |

## Execution and controls

- Begin targeted collections with key-account approval gates.
- Negotiate supplier extensions in parallel and record every concession.
- Reforecast cash daily against actual receipts and outflows.
- Escalate immediately when projected cash falls below the agreed minimum.
- Treat the working-capital values as scenario estimates; validate accounting assumptions before approval.

## Decision requested

Approve the operational launch, authorize treasury to secure the residual funding backstop, and approve the {recommended_hedge['hedge_ratio']:.0%} hedge scenario within the stated policy range.
"""

print('Ok: Decision memo generated from current pipeline outputs')
print(f'[OK] End-of-horizon gap: ${final_gap:,.0f}; residual after all levers: ${residual_gap:,.0f}')

# %% [code cell 6]
print("Exporting decision memo...")

export_path = f"{OUTPUT_DIR}/N7_decision_memo.md"
os.makedirs(os.path.dirname(export_path), exist_ok=True)

with open(export_path, 'w') as f:
    f.write(memo_content)

print(f"[OK] Exported: {export_path}")
print()

# %% [code cell 7]
print('N7 COMPLETE - Decision Memo Built')
print(f'Forecast gap: ${final_gap:,.0f}')
print(f'All-levers impact: ${all_levers_impact:,.0f} ({all_levers_pct:.1f}% of gap)')
print(f'Residual funding need: ${residual_gap:,.0f}')
print(f'Recommended FX hedge: {recommended_hedge["hedge_ratio"]:.0%}')
print('Next step: N8_Operationalize.ipynb')

# %% [code cell 8]
workshop_viz.outcome_n7(final_gap, all_levers_impact, residual_gap, recommended_hedge, OUTPUT_DIR)
