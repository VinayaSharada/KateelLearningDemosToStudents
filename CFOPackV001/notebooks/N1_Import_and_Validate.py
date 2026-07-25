"""
N1: Import and Validate
CFO Pack V001 - Treasury Decision Workshop

Purpose: Load and validate synthetic data files. Check for data quality issues.
Output: validated_data.csv (combined dataset ready for analysis)

Estimated time: 10-15 minutes
"""

import pandas as pd
import numpy as np
from datetime import datetime
import os

# ============================================================================
# STEP 1: LOAD DATA FILES
# ============================================================================

print("[=" * 80)
print("[N1: IMPORT AND VALIDATE DATA")
print("[=" * 80)
print()

# Define file paths (adjust if running from different directory)
data_dir = "../data/synthetic/"

print("[[FILES] Loading data files...")

# Load all CSVs
invoices = pd.read_csv(data_dir + "invoices.csv")
payments = pd.read_csv(data_dir + "payments.csv")
customers = pd.read_csv(data_dir + "customers.csv")
fx_exposure = pd.read_csv(data_dir + "fx_exposure.csv")
cash_flow = pd.read_csv(data_dir + "cash_flow.csv")

print(f"[OK] invoices.csv: {len(invoices)} rows")
print(f"[OK] payments.csv: {len(payments)} rows")
print(f"[OK] customers.csv: {len(customers)} rows")
print(f"[OK] fx_exposure.csv: {len(fx_exposure)} rows")
print(f"[OK] cash_flow.csv: {len(cash_flow)} rows")
print()

# ============================================================================
# STEP 2: DATA QUALITY CHECKS
# ============================================================================

print("[[CHECK] RUNNING DATA QUALITY CHECKS...")
print()

# Check 1: Invoices completeness
print("[Check 1: Invoices Completeness")
missing_cols = invoices.columns[invoices.isnull().any()].tolist()
if missing_cols:
    print(f"  [WARNING]  Missing values in: {missing_cols}")
    print(f"     {invoices[missing_cols].isnull().sum()}")
else:
    print("[  [OK] No missing values")

# Check 2: Date format validation
print("[\nCheck 2: Date Format Validation")
date_cols = ['invoice_date', 'due_date']
try:
    for col in date_cols:
        invoices[col] = pd.to_datetime(invoices[col])
    print(f"  [OK] All date columns are valid")
except Exception as e:
    print(f"  [WARNING]  Date parsing error: {e}")

# Check 3: Currency amounts are positive
print("[\nCheck 3: Currency Values")
amount_cols = [col for col in invoices.columns if 'amount' in col.lower() or 'usd' in col.lower()]
negative_amounts = (invoices[amount_cols] < 0).sum().sum()
if negative_amounts > 0:
    print(f"  [WARNING]  {negative_amounts} negative amounts found (should all be positive)")
else:
    print(f"  [OK] All amounts are positive")

# Check 4: Payments vs Invoices
print("[\nCheck 4: Payment to Invoice Matching")
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
print("[\nCheck 5: Customer Reference Integrity")
invoices_customers = set(invoices['customer_id'].unique())
defined_customers = set(customers['customer_id'].unique())
undefined_customers = invoices_customers - defined_customers
if undefined_customers:
    print(f"  [WARNING]  {len(undefined_customers)} customers in invoices are not in customer master")
    print(f"     Missing: {undefined_customers}")
else:
    print(f"  [OK] All invoice customers are in customer master")

# Check 6: FX exposure sanity check
print("[\nCheck 6: FX Exposure Validation")
if fx_exposure['notional_amount'].sum() > 0:
    print(f"  [OK] Total FX notional exposure: ${fx_exposure['notional_amount'].sum():,.0f}")
else:
    print(f"  [WARNING]  No FX exposure found")

# Check 7: Cash flow consistency
print("[\nCheck 7: Cash Flow Schedule")
if len(cash_flow) >= 14:
    print(f"  [OK] {len(cash_flow)}-day cash flow schedule present")
else:
    print(f"  [WARNING]  Only {len(cash_flow)} days in schedule (expected 14+)")

print()

# ============================================================================
# STEP 3: DATA SUMMARY STATISTICS
# ============================================================================

print("[[CHART] DATA SUMMARY")
print()

print("[INVOICES Summary:")
print(f"  Total invoices: {len(invoices)}")
print(f"  Total AR value: ${invoices['amount_usd'].sum():,.0f}")
print(f"  Average invoice: ${invoices['amount_usd'].mean():,.0f}")
print(f"  Date range: {invoices['invoice_date'].min()} to {invoices['invoice_date'].max()}")
print(f"  Unique customers: {invoices['customer_id'].nunique()}")
print(f"  Paid invoices: {(invoices['status']=='paid').sum():,}")
print(f"  Outstanding invoices: {(invoices['status']=='outstanding').sum():,}")

print("[\nCUSTOMERS Summary:")
print(f"  Total customers: {len(customers)}")
print(f"  Industries: {customers['industry'].nunique()} unique")
print(f"  Avg days late: {customers['avg_days_late'].mean():.1f}")
print(f"  Avg risk score: {customers['risk_score'].mean():.2f}")

print("[\nPAYMENT HISTORY Summary:")
print(f"  Historical payments: {len(payments)}")
print(f"  Average days late: {payments['days_late'].mean():.1f}")
print(f"  On-time (0 days late): {(payments['days_late'] == 0).sum()}")
print(f"  Late (>7 days): {(payments['days_late'] > 7).sum()}")

print("[\nFX EXPOSURE Summary:")
for idx, row in fx_exposure.iterrows():
    hedge_pct = row['current_hedge_ratio'] * 100
    print(f"  {row['currency']}: ${row['notional_amount']:,.0f} ({hedge_pct:.0f}% hedged)")

print(f"[\nCASH FLOW Summary ({len(cash_flow)}-day):")
total_outflows = cash_flow['total_outflows'].sum()
print(f"  Total outflows: ${total_outflows:,.0f}")
print(f"  Largest outflow day: Day {cash_flow.loc[cash_flow['total_outflows'].idxmax(), 'day']:.0f}")
print(f"    (${cash_flow['total_outflows'].max():,.0f})")

print()

# ============================================================================
# STEP 4: DATA QUALITY SCORE
# ============================================================================

print("[[LIST] DATA QUALITY ASSESSMENT")
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
    print("[[DONE] EXCELLENT - Data quality is good. Ready to proceed.")
elif quality_score >= 80:
    print("[[OK] GOOD - Minor issues found. Safe to proceed with caution.")
    for issue in quality_issues:
        print(f"   {issue}")
elif quality_score >= 60:
    print("[[WARNING]  FAIR - Several issues found. Recommend cleaning before analysis.")
    for issue in quality_issues:
        print(f"   {issue}")
else:
    print("[[ERROR] POOR - Major issues found. Data cleaning required.")
    for issue in quality_issues:
        print(f"   {issue}")

print(f"\nData Quality Score: {quality_score}/100")
print()

# ============================================================================
# STEP 5: PREPARE VALIDATED DATASET
# ============================================================================

print("[[SAVE] EXPORTING VALIDATED DATA")
print()

# Combine invoices with customer info
invoices_with_customers = invoices.merge(
    customers[['customer_id', 'avg_days_late', 'risk_score', 'industry']],
    on='customer_id',
    how='left'
)

# Combine with payment history (for each invoice, was it paid, when, how many days late?)
# Left join on invoice_id to keep all invoices even if not yet paid
invoices_with_payments = invoices_with_customers.merge(
    payments[['invoice_id', 'payment_date', 'days_late']],
    on='invoice_id',
    how='left',
    suffixes=('', '_actual')
)

# Rename for clarity
invoices_with_payments.rename(columns={
    'days_late': 'actual_days_late'  # Historical data
}, inplace=True)

# Export
export_path = "../outputs/N1_validated_data.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
invoices_with_payments.to_csv(export_path, index=False)

print(f"[OK] Exported: {export_path}")
print(f"  Records: {len(invoices_with_payments)}")
print(f"  Columns: {len(invoices_with_payments.columns)}")
print()

# Also save supporting files
customers.to_csv("../outputs/N1_customers.csv", index=False)
fx_exposure.to_csv("../outputs/N1_fx_exposure.csv", index=False)
cash_flow.to_csv("../outputs/N1_cash_flow.csv", index=False)

print("[[OK] Supporting files exported")
print()

print("[=" * 80)
print("[[DONE] N1 COMPLETE - Data validated and ready for forecasting")
print("[=" * 80)
print()
print("[[INFO] What we learned:")
print("[   Data quality is", "EXCELLENT [OK]" if quality_score == 100 else f"{quality_score}/100")
print(f"   We have {invoices['customer_id'].nunique()} customers with ${invoices['amount_usd'].sum()/1_000_000:.1f}M in receivables")
print(f"   Payment history shows customers typically pay {payments['days_late'].mean():.1f} days late")
print(f"   This suggests our baseline forecast (assuming on-time payment) is OPTIMISTIC")
print()
print("[[GOAL] Next step: N2_Baseline_Forecast.py")
print("[   Build a 14-day cash forecast assuming all invoices pay on their due dates")
