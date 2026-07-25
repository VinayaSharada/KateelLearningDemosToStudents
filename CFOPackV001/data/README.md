# Data Schema & Documentation

## Overview

CFOPackV001 includes fully synthetic data (realistic but not real) designed for the treasury workshop. You can:
- **Use provided data** for the workshop (no setup needed)
- **Bring your real data** and adapt the workflow
- **Create custom synthetic data** for training/testing

---

## Provided Data Files

### **invoices.csv** (10,000 rows)

Customer invoices (paid and outstanding) for analysis and forecasting.

**Schema:**
```
invoice_id              (string)   INV-000001 to INV-010000
customer_id            (int)      1-148 (customer master reference)
invoice_date           (date)     YYYY-MM-DD (date issued, past 24 months)
due_date               (date)     YYYY-MM-DD (contractual payment date)
amount_usd             (float)    $5K-$500K (realistic distribution: 80% small, 15% medium, 5% large)
payment_terms_days     (int)      15, 30, or 60 (contractual terms)
status                 (string)   'paid' (8,000 records) or 'outstanding' (2,000 records)
```

**Notes:**
- 8,000 paid invoices: used for ML training in N3
- 2,000 outstanding invoices: used for ML prediction targets
- Date range: 2024-07-25 to 2026-07-25 (realistic 24-month spread)
- Total AR: $546.9M
- 148 unique customers across 5 industries
- Customer concentration: top 20 customers = 60% of AR

---

### **payments.csv** (8,200 rows)

Historical payment records: 8,000 invoice payments + 200 unrelated payments.

**Schema:**
```
payment_id               (int)      Payment record ID
invoice_id              (string)    Invoice paid (NULL for unrelated payments)
customer_id             (int)       Customer making payment (NULL for unrelated payments)
payment_date            (date)      When payment was received
amount_paid             (float)     Payment amount in USD
payment_type            (string)    'invoice_payment' or unrelated ('tax_refund', 'interest_income', 'rebate', etc.)
days_late               (int/NULL)  For invoice payments: 0=on time, >0=late; NULL for unrelated payments
```

**Notes:**
- 8,000 records: tied to invoices, used for N3 ML training
- 200 records: unrelated (tax refunds, interest income, rebates, credit memos) - realistic treasury activity
- Average days late (invoice payments): 42.1 days
- Range: 0 (on time) to 127 days (very late)
- Shows industry-specific patterns: Tech ~12 days late, Retail ~59 days late, Government ~61 days late

---

### **customers.csv** (148 rows)

Master customer data for AR and payment behavior analysis.

**Schema:**
```
customer_id         (int)      1-148 (unique customer reference)
customer_name       (string)   [company name] Technology Co., [industry] Inc., etc.
industry            (string)   'Technology', 'Manufacturing', 'Retail', 'Government', 'Healthcare'
avg_days_late       (float)    Historical average days late (customer-specific behavior)
risk_score          (float)    0.0 (low risk) to 1.0 (high risk)
concentration_weight (float)   Gini coefficient weight for realistic concentration (top 20 = 60% of AR)
```

**Notes:**
- Industry-specific payment patterns emerge naturally:
  - Technology: 11.9 days late (fast, reliable)
  - Manufacturing: 37.9 days late (medium)
  - Healthcare: 44.3 days late (slow)
  - Retail: 58.9 days late (very slow)
  - Government: 61.1 days late (extremely slow)
- avg_days_late is the MOST important feature (92.4%) for ML model predictions
- Concentration weight ensures realistic customer distribution (essential for working capital strategy)

---

### **fx_exposure.csv** (4 rows)

Open foreign exchange positions requiring hedging decision.

**Schema:**
```
currency                   (string)   EUR, GBP, JPY, INR (4 currencies)
notional_amount            (float)    Total position value in USD (ranges $854K-$987K)
transaction_type           (string)   'accounts_payable', 'accounts_receivable', 'intercompany', 'forecasted'
month                      (string)   YYYY-MM (current month for timing)
current_hedge_ratio        (float)    0.0-1.0 (0% = unhedged, 100% = fully hedged; currently 16%-42%)
```

**Notes:**
- Total exposure: ~$3.6M notional
- All positions currently UNDER-HEDGED (16-42% vs 50-75% board-approved range)
- Key for N6 hedging decision analysis
- Demonstrates FX risk as complement to liquidity management
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

