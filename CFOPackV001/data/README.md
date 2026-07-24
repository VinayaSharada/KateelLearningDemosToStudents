# Data Schema & Documentation

## Overview

CFOPackV001 includes fully synthetic data (realistic but not real) designed for the treasury workshop. You can:
- **Use provided data** for the workshop (no setup needed)
- **Bring your real data** and adapt the workflow
- **Create custom synthetic data** for training/testing

---

## Provided Data Files

### **invoices.csv** (500 rows)

Outstanding customer invoices ready for collection/forecasting.

**Schema:**
```
invoice_id              (string)   INV-001, INV-002, ...
customer_id            (string)   CUST-A, CUST-B, ...
customer_name          (string)   Acme Corp, BuildCo Inc, ...
invoice_date           (date)     YYYY-MM-DD (when invoice was issued)
due_date               (date)     YYYY-MM-DD (contractual payment date)
amount_usd             (float)    Invoice amount in USD
industry               (string)   Manufacturing, Construction, Technology, ...
payment_terms_days     (int)      30, 45, 60 (contractual terms)
prior_payment_avg_days (float)    Customer's historical avg days to pay
days_overdue_currently (int)      How many days past due (0 if not overdue)
```

**Notes:**
- Some invoices are currently overdue (use for collections priority)
- Date range: 2024-07-15 to 2024-08-18
- Invoice amounts: $85K-$1.2M
- 13 unique customers across 5 industries

---

### **payments.csv** (200 rows)

Historical payment data (12 months of history) used for training the ML model.

**Schema:**
```
invoice_id     (string)   Invoice that was paid
payment_date   (date)     When the payment actually arrived
amount_paid    (float)    Amount paid (usually full invoice amount)
days_late      (int)      How many days after due date it arrived
                          0 = on time, >0 = late
```

**Notes:**
- Key for N3 (ML model training)
- Shows real payment behavior
- Average: 8 days late
- Range: 0 (on time) to 20 (very late)

---

### **customers.csv** (13 rows)

Master customer data for AR management.

**Schema:**
```
customer_id         (string)   CUST-A, CUST-B, ...
customer_name       (string)   Legal name
industry            (string)   Manufacturing, Construction, ...
avg_payment_days    (float)    Historical average days to pay
risk_score          (float)    0.0 (low risk) to 1.0 (high risk)
key_account_flag    (string)   'yes' or 'no' (flagship customer?)
credit_limit_usd    (float)    Max exposure for this customer
```

**Notes:**
- Risk score correlates with payment slowness
- Key accounts require careful handling (avoid aggressive collections)
- Credit limits sum to ~$15M total

---

### **fx_exposure.csv** (4 rows)

Open foreign exchange positions requiring hedging decision.

**Schema:**
```
currency                   (string)   EUR, GBP, JPY, CAD
notional_exposure_usd      (float)    Total position value in USD
transaction_type           (string)   'receivables' or 'payables'
maturity_month             (date)     When exposure settles
current_hedge_ratio        (float)    0.0-1.0 (0% = unhedged, 100% = fully hedged)
counterparty               (string)   JP Morgan, Bank of America, etc.
current_rate               (float)    Current spot rate
```

**Notes:**
- Total exposure: ~$4.7M notional
- EUR is largest ($2.5M)
- Used for N6 (FX hedging analysis)

---

### **cash_flow.csv** (14 rows)

14-day cash outflow schedule (payables, capex, debt, payroll).

**Schema:**
```
day                    (int)      1-14
date                   (date)     2024-08-19 to 2024-09-01
payables_amount_usd    (float)    Payments to suppliers
capex_amount_usd       (float)    Capital expenditures
debt_maturity_amount   (float)    Debt payments
payroll_amount_usd     (float)    Employee payroll (~$250K/day)
other_outflows_usd     (float)    Misc outflows
total_outflows_usd     (float)    Sum of above
```

**Notes:**
- Used for N2/N4 (baseline & revised forecasts)
- Largest outflow day: Day 7 ($2.1M payables due)
- Payroll is consistent ($250K/day)
- Total 14-day outflows: ~$7.5M

---

## Data Privacy

**This data is fully synthetic.**

- No real company data
- No real customer information
- No real payment history
- Safe to share, print, use in training materials

---

## Using Your Own Data

### **Step 1: Prepare Your CSVs**

Adapt your real data to match the schema above. Minimum columns needed:

**invoices.csv** (required):
- invoice_id, customer_id, due_date, amount_usd
- Optional: industry, payment_terms_days, prior_payment_avg_days

**payments.csv** (highly recommended):
- invoice_id, payment_date, days_late
- This trains the ML model (N3)
- Without it, model defaults to average payment behavior

**customers.csv** (recommended):
- customer_id, customer_name, avg_payment_days, risk_score
- Optional: key_account_flag, credit_limit_usd

**cash_flow.csv** (required):
- day, date, total_outflows_usd (can combine all outflows into one column)

**fx_exposure.csv** (optional):
- Currency, notional_exposure_usd, current_hedge_ratio
- Skip if no FX management needed

### **Step 2: Anonymize (If Using Real Data)**

Before using real company data:
- Rename customers (CUST-A, CUST-B, etc.)
- Round amounts ($1.2M instead of $1,234,567)
- Sample if dataset is huge (100+ customers → pick 20 biggest)
- Remove internal margin/cost data

### **Step 3: Validate**

Run N1 (Import & Validate) on your data:
- Check for missing values
- Verify date formats (YYYY-MM-DD)
- Check amount signs (all positive)
- Validate customer references

### **Step 4: Replace**

Move your CSVs to `/data/synthetic/` and overwrite provided files:
```
CFOPackV001/data/synthetic/
  ├── invoices.csv (your data)
  ├── payments.csv (your data)
  ├── customers.csv (your data)
  ├── fx_exposure.csv (your data, optional)
  └── cash_flow.csv (your data)
```

Then run N1-N8 as normal. All outputs will be based on your data.

---

## Data Quality Checklist

Before using your data, verify:

- [ ] All required columns present
- [ ] No missing values (or documented why)
- [ ] Dates in YYYY-MM-DD format
- [ ] Amount fields are numeric (no $, commas)
- [ ] Customer IDs consistent (CUST-A, not "cust a" or "Customer A")
- [ ] date range covers at least 12 months (for payment history)
- [ ] Invoice amounts are all positive

---

## Troubleshooting

**Q: "My data doesn't fit the schema"**  
A: Map your columns to the schema. Use N1 to validate. Rename columns if needed.

**Q: "I have too much data"**  
A: Sample. Pick top 50 customers by AR volume. Still represents 80%+ of exposure.

**Q: "I have too little payment history"**  
A: Model needs 12+ months of payment data to learn patterns. Use provided data + yours.

**Q: "I can't anonymize customer names"**  
A: Run locally/in private environment. Don't upload to shared systems.

---

## Next Steps

- **For workshop:** Use provided synthetic data (no changes needed)
- **For real company:** See POST_WORKSHOP_TAKEAWAY.md for adaptation guide
- **Help needed?** See DATA_UPLOAD_GUIDE.md for step-by-step instructions

