"""
N2: Baseline Forecast
CFO Pack V001 - Treasury Decision Workshop

Purpose: Build a 14-day cash forecast assuming all invoices pay on their contractual due date
Output: daily_cash_baseline.csv

Key assumption: ALL INVOICES PAY ON TIME
This is intentionally optimistic to show why we need predictive modeling (N3)

Estimated time: 15-20 minutes
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

print("[=" * 80)
print("[N2: BASELINE CASH FORECAST (Optimistic Scenario)")
print("[=" * 80)
print()

# ============================================================================
# STEP 1: LOAD DATA
# ============================================================================

print("[[FILES] Loading data...")

# Load validated data and cash flow schedule
validated_data = pd.read_csv("../outputs/N1_validated_data.csv")
cash_flow = pd.read_csv("../outputs/N1_cash_flow.csv")

print(f"[OK] Loaded {len(validated_data)} invoice records")
print(f"[OK] Loaded {len(cash_flow)} days of cash flow schedule")
print()

# Convert date columns
validated_data['invoice_date'] = pd.to_datetime(validated_data['invoice_date'])
validated_data['due_date'] = pd.to_datetime(validated_data['due_date'])
cash_flow['date'] = pd.to_datetime(cash_flow['date'])

# ============================================================================
# STEP 2: SET UP THE FORECAST PERIOD
# ============================================================================

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

# ============================================================================
# STEP 3: PROJECT INFLOWS (Invoice Receipts)
# ============================================================================

print("[[MONEY] INFLOWS - Projected Invoice Receipts")
print()

# In this BASELINE scenario, invoices are assumed to pay on their due date
# So inflow amount = invoice amount, inflow date = due date

inflows = validated_data[['invoice_id', 'customer_id', 'customer_name', 'due_date', 'amount_usd']].copy()
inflows.columns = ['invoice_id', 'customer_id', 'customer_name', 'payment_date', 'payment_amount']
inflows = inflows[inflows['payment_date'] >= forecast_start]
inflows = inflows[inflows['payment_date'] <= forecast_end]

print(f"Invoices due during forecast period: {len(inflows)}")
print(f"Total inflows: ${inflows['payment_amount'].sum():,.0f}")
print()

# Show top inflows
print("[Top 5 inflows:")
top_inflows = inflows.nlargest(5, 'payment_amount')
for idx, row in top_inflows.iterrows():
    print(f"  {row['payment_date'].date()}: {row['customer_name']:30s} ${row['payment_amount']:>10,.0f}")
print()

# ============================================================================
# STEP 4: BUILD DAILY CASH POSITION
# ============================================================================

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
    day_outflows = day_row['total_outflows_usd']

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
        'closing_cash': max(0, closing_cash)  # Cash can't go negative
    })

cash_forecast = pd.DataFrame(daily_data)

print(f"[OK] 14-day baseline forecast complete")
print()

# ============================================================================
# STEP 5: FORECAST SUMMARY
# ============================================================================

print("[[CHART] BASELINE FORECAST SUMMARY")
print()

print(f"Starting cash position:    ${cash_forecast.iloc[0]['opening_cash']:>12,.0f}")
print(f"Total inflows (14 days):   ${cash_forecast['inflows'].sum():>12,.0f}")
print(f"Total outflows (14 days):  ${cash_forecast['outflows'].sum():>12,.0f}")
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
    status = "[OK]" if row['closing_cash'] > 1_000_000 else "[WARNING]" if row['closing_cash'] > 500_000 else "[ALERT]"
    print(f"  Day {int(row['day']):2d} ({row['date'].strftime('%a %m-%d')}): "
          f"${row['opening_cash']:>10,.0f} "
          f"+ ${row['inflows']:>10,.0f} "
          f"- ${row['outflows']:>10,.0f} "
          f"= ${row['closing_cash']:>10,.0f}  {status}")

print("[-" * 80)
print()

# ============================================================================
# STEP 6: RISK ASSESSMENT
# ============================================================================

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
print("[   Average payment is 8-10 days LATE.")
print()

# ============================================================================
# STEP 7: EXPORT FORECAST
# ============================================================================

print("[[SAVE] Exporting baseline forecast...")

export_path = "../outputs/N2_baseline_forecast.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
cash_forecast.to_csv(export_path, index=False)

print(f"[OK] Exported: {export_path}")
print()

# ============================================================================
# STEP 8: KEY INSIGHTS
# ============================================================================

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
print("[   Historical payment data shows customers pay ~8 days LATE on average")
print("[   Top 3 customers (57% of AR) have mixed payment behavior")
print("[   If payments slip, our actual cash could be $500K-$800K LOWER")
print()
print("[[GOAL] Next step: N3_Collections_Intelligence.py")
print("[   Use ML to predict which invoices will actually be late and by how many days")
