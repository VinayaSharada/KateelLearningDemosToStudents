"""
N4: Revised Forecast
CFO Pack V001 - Treasury Decision Workshop

Purpose: Rebuild cash forecast using ML-predicted payment dates (from N3)
Output: daily_cash_revised.csv + gap analysis

Key difference from N2: Uses realistic (predicted late) payment dates instead of due dates
This shows the actual cash gap we need to address

Estimated time: 15-20 minutes
"""

import pandas as pd
import numpy as np
import os

print("[=" * 80)
print("[N4: REVISED CASH FORECAST (Realistic Scenario)")
print("[=" * 80)
print()

# Load data
baseline_forecast = pd.read_csv("../outputs/N2_baseline_forecast.csv")
predictions = pd.read_csv("../outputs/N3_invoice_payment_predictions.csv")
cash_flow = pd.read_csv("../outputs/N1_cash_flow.csv")

# Convert dates
predictions['predicted_payment_date'] = pd.to_datetime(predictions['predicted_payment_date'])
cash_flow['date'] = pd.to_datetime(cash_flow['date'])

print(f"Loading data...")
print(f"  Baseline forecast: {len(baseline_forecast)} days")
print(f"  Predicted invoices: {len(predictions)}")
print()

# ============================================================================
# REBUILD FORECAST WITH PREDICTED PAYMENT DATES
# ============================================================================

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
        'closing_cash': max(0, closing_cash)
    })

revised_forecast = pd.DataFrame(daily_revised)

print("[[OK] Revised 14-day forecast complete")
print()

# ============================================================================
# GAP ANALYSIS
# ============================================================================

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
total_gap_day14 = comparison.iloc[-1]['gap']

print(f"Summary Metrics:")
print(f"  Baseline minimum: ${baseline_min:,.0f} (Day {int(comparison[comparison['baseline_closing_cash'] == baseline_min]['day'].values[0])})")
print(f"  Revised minimum:  ${revised_min:,.0f} (Day {int(comparison[comparison['revised_closing_cash'] == revised_min]['day'].values[0])})")
print(f"  Gap on Day 14:    ${total_gap_day14:,.0f}")
print()

# Interpretation
print("[[WARNING]  WHAT THIS MEANS:")
print(f"   Baseline (optimistic): Assumes all invoices pay on time")
print(f"   Revised (realistic): Assumes invoices pay {predictions['predicted_days_late'].mean():.1f} days late")
print(f"   Cash gap on Day 14: ${total_gap_day14:,.0f}")
print()

if total_gap_day14 > 500_000:
    print(f"  [ALERT] This is a MATERIAL gap. Needs action.")
elif total_gap_day14 > 200_000:
    print(f"  [WARNING]  This is SIGNIFICANT. Consider mitigation strategies.")
else:
    print(f"  [OK] Gap is manageable with existing credit facility.")

print()

# ============================================================================
# RISK ZONES
# ============================================================================

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

# ============================================================================
# EXPORT RESULTS
# ============================================================================

print("[[SAVE] Exporting revised forecast...")

export_path = "../outputs/N4_revised_forecast.csv"
revised_forecast.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")

export_path = "../outputs/N4_gap_analysis.csv"
comparison.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")
print()

# ============================================================================
# KEY INSIGHTS
# ============================================================================

print("[=" * 80)
print("[[DONE] N4 COMPLETE - Revised Forecast Built")
print("[=" * 80)
print()

print("[[INFO] Key Finding:")
print(f"  Realistic cash position is ${total_gap_day14:,.0f} LOWER than baseline on Day 14")
print()

print("[[GOAL] Next step: N5_Working_Capital_Levers.py")
print("[   Model which operational levers (collections, inventory, payables) can close this gap")
