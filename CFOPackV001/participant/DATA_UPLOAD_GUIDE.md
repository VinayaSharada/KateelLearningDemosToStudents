# Data Upload Guide

**How to use your own company data with the notebooks.**

---

## Quick Start

1. Export your AR/AP data as CSVs
2. Rename columns to match schema (see below)
3. Replace files in `/data/synthetic/`
4. Run N1-N8 as normal

**Time required:** 30-60 minutes depending on data complexity

---

## Schema Mapping

### **invoices.csv** (Required)

Map your AR aging report to this schema:

| Your Column | Our Column | Type | Notes |
|---|---|---|---|
| Invoice # | `invoice_id` | string | Must be unique |
| Customer | `customer_id` | string | Use code (CUST-A) not full name |
| Customer Name | `customer_name` | string | Full legal name |
| Issue Date | `invoice_date` | date | YYYY-MM-DD format |
| Due Date | `due_date` | date | YYYY-MM-DD format |
| Amount | `amount_usd` | float | Numbers only (no $ or commas) |
| Industry | `industry` | string | e.g., Manufacturing, Retail |
| Terms | `payment_terms_days` | int | 30, 45, 60, etc. |
| Cust Avg Payment | `prior_payment_avg_days` | float | From payment history (N/A if unknown) |
| Days Overdue | `days_overdue_currently` | int | Today - due date (0 if not overdue) |

**Example:**
```
invoice_id,customer_id,customer_name,invoice_date,due_date,amount_usd,industry,payment_terms_days,prior_payment_avg_days,days_overdue_currently
INV-1001,CUST-A,Acme Corp,2024-07-15,2024-08-15,450000,Manufacturing,30,25,5
INV-1002,CUST-B,BuildCo Inc,2024-07-18,2024-08-18,280000,Construction,30,35,0
```

### **payments.csv** (Highly Recommended)**

Map your payment history:

| Your Column | Our Column | Type | Notes |
|---|---|---|---|
| Invoice # | `invoice_id` | string | Must match invoices.csv |
| Payment Date | `payment_date` | date | YYYY-MM-DD |
| Amount Paid | `amount_paid` | float | Usually full invoice amount |
| Days Late | `days_late` | int | Payment date - due date (0 if on time) |

**Example:**
```
invoice_id,payment_date,amount_paid,days_late
INV-1001,2024-08-20,450000,5
INV-1002,2024-08-28,280000,10
```

**Why it matters:** This trains the ML model (N3). Without it, model defaults to average. With it, you get customer-specific predictions.

**Minimum data:** 12 months of payment history (200+ payment records helps).

### **customers.csv** (Recommended)**

Map your customer master:

| Your Column | Our Column | Type | Notes |
|---|---|---|---|
| Customer Code | `customer_id` | string | Must match invoices.csv |
| Customer Name | `customer_name` | string | Full legal name |
| Industry | `industry` | string | Sector classification |
| Avg Payment Days | `avg_payment_days` | float | From payment history |
| Risk Score | `risk_score` | float | 0.0 (low) to 1.0 (high); your rating |
| Key Account? | `key_account_flag` | string | 'yes' or 'no' |
| Credit Limit | `credit_limit_usd` | float | Max exposure |

**Example:**
```
customer_id,customer_name,industry,avg_payment_days,risk_score,key_account_flag,credit_limit_usd
CUST-A,Acme Corp,Manufacturing,25,0.25,yes,2000000
CUST-B,BuildCo Inc,Construction,35,0.40,yes,1500000
```

### **cash_flow.csv** (Required)**

Map your 14-day outflow forecast:

| Your Column | Our Column | Type | Notes |
|---|---|---|---|
| Day # | `day` | int | 1-14 |
| Date | `date` | date | YYYY-MM-DD |
| Supplier Payments | `payables_amount_usd` | float | Payments to AP |
| Capital Spending | `capex_amount_usd` | float | Equipment, property |
| Debt Payments | `debt_maturity_amount_usd` | float | Principal/interest |
| Payroll | `payroll_amount_usd` | float | Employee wages |
| Other | `other_outflows_usd` | float | Miscellaneous |
| Total | `total_outflows_usd` | float | Sum of above |

**Example:**
```
day,date,payables_amount_usd,capex_amount_usd,debt_maturity_amount_usd,payroll_amount_usd,other_outflows_usd,total_outflows_usd
1,2024-08-19,450000,0,0,250000,15000,715000
2,2024-08-20,120000,0,0,250000,8000,378000
```

### **fx_exposure.csv** (Optional)**

Map your FX positions (if applicable):

| Your Column | Our Column | Type | Notes |
|---|---|---|---|
| Currency | `currency` | string | EUR, GBP, JPY, CAD, etc. |
| Exposure USD | `notional_exposure_usd` | float | Total position in USD value |
| Type | `transaction_type` | string | 'receivables' or 'payables' |
| Maturity | `maturity_month` | date | YYYY-MM (when exposure settles) |
| Hedged % | `current_hedge_ratio` | float | 0.0 to 1.0 (0% to 100%) |
| Counterparty | `counterparty` | string | Bank name (JP Morgan, etc.) |
| Rate | `current_rate` | float | Current spot rate |

**Example:**
```
currency,notional_exposure_usd,transaction_type,maturity_month,current_hedge_ratio,counterparty,current_rate
EUR,2500000,receivables,2024-09,0.50,JP Morgan,1.08
```

---

## Step-by-Step Data Prep

### **Step 1: Export from Your System**

**AR Aging Report**
- Source: AP/AR module in ERP (SAP, Oracle, NetSuite, etc.)
- Format: CSV
- Columns: invoice ID, customer, due date, amount
- Rows: All open invoices + recently closed (last 30 days)

**Payment History**
- Source: General ledger or AR detail report
- Format: CSV
- Columns: invoice ID, payment date, amount paid
- Rows: 12 months of payment records
- Filter: AR payments only (don't include other transactions)

**Customer Master**
- Source: Customer/account list
- Format: CSV
- Include: All customers with open AR

**Cash Flow**
- Source: Cash forecast or cash manager
- Format: CSV
- Rolling 14-day forecast of all cash outflows

**FX Exposure** (optional)
- Source: Treasury system or deal register
- Format: CSV
- Include: All open positions

### **Step 2: Rename Columns**

Open each CSV in Excel and rename columns to match schema above.

**Quick way using Python:**
```python
import pandas as pd

# Load your file
df = pd.read_csv("your_data.csv")

# Rename columns
df = df.rename(columns={
    "Your Column Name": "our_column_name",
    "Another Column": "another_column_name"
})

# Save
df.to_csv("renamed_data.csv", index=False)
```

### **Step 3: Format Data**

Ensure correct data types:

| Column | Format | Example | Fix |
|---|---|---|---|
| Dates | YYYY-MM-DD | 2024-08-15 | Convert in Excel: Format Cells → Date |
| Amounts | Number (no $) | 450000 | Remove $ signs, commas |
| Integers | Whole numbers | 30 | Remove decimals (30, not 30.0) |
| Floats | Decimal | 25.5 | Keep as-is (for days late, risk scores) |
| Strings | Plain text | CUST-A | No special characters |

### **Step 4: Validate**

Before using, run these checks in Excel or Python:

**Completeness:**
- [ ] No blank cells in required columns
- [ ] Every invoice_id is unique
- [ ] Every customer_id in invoices.csv exists in customers.csv
- [ ] Date ranges are consistent (invoices are recent, not year-old)

**Format:**
- [ ] Dates are YYYY-MM-DD (check one cell, verify format)
- [ ] Amounts are numbers (not text like "$450,000")
- [ ] No special characters in IDs (CUST-A is OK, "CUST A" is not)

**Reasonableness:**
- [ ] Invoice amounts are positive and sensible for your business
- [ ] Days late are 0-60 (not 0-3650)
- [ ] Customer count is reasonable (not 1 or 50,000)
- [ ] Cash flow adds up (total outflows = sum of components)

### **Step 5: Anonymize** (if using real data)

If running with confidential data:

**Rename customers:**
```
Acme Corp → CUST-A
BuildCo Inc → CUST-B
(Map in a separate document you keep private)
```

**Round amounts:**
```
$1,234,567 → $1,200,000
(Precision less important than patterns)
```

**Sample if huge:**
```
If 10,000 customers, pick top 100 by AR volume
Still represents 80-90% of exposure
```

### **Step 6: Replace Provided Files**

Move your CSVs to the right location:

```
CFOPackV001/
└── data/
    └── synthetic/
        ├── invoices.csv (← your data)
        ├── payments.csv (← your data)
        ├── customers.csv (← your data)
        ├── cash_flow.csv (← your data)
        └── fx_exposure.csv (← your data, optional)
```

**Backup first!** Copy `synthetic/` folder to `synthetic_backup/` before replacing.

### **Step 7: Validate with N1**

Run the first notebook:

```bash
cd notebooks
python N1_Import_and_Validate.py
```

Or run in Jupyter. Check output:

```
Data Quality Assessment
✅ EXCELLENT - Data quality is good
```

If not excellent:
- Go back to step 4 (format issues)
- Missing data? Determine why and fill or remove
- Date format wrong? Fix and re-export
- Customer mismatch? Update invoice_id or customer_id

---

## Troubleshooting

### **"Customer not found" error in N1**

**Problem:** `INV-001 has customer CUST-X but CUST-X not in customers.csv`

**Solution:** 
1. Find all unique customers in invoices.csv
2. Make sure all exist in customers.csv
3. Or run N1 with missing customers removed:
```python
# In N1, after loading data:
valid_customers = customers['customer_id'].unique()
invoices = invoices[invoices['customer_id'].isin(valid_customers)]
```

### **"Date format error" in N1**

**Problem:** Dates shown as "2024-15-08" or "08/15/2024"

**Solution:**
- Excel: Format Cells → Date → Select format
- Or in Python before running:
```python
df['due_date'] = pd.to_datetime(df['due_date'], format='%m/%d/%Y')
```

### **"Amounts are text" error**

**Problem:** Amounts shown as "$450,000" or "450,000" (with commas)

**Solution:**
```python
# Remove $ and commas, convert to float
df['amount_usd'] = df['amount_usd'].str.replace('$','').str.replace(',','').astype(float)
```

### **"Dataset too small" error**

**Problem:** Only 10 invoices or 1 month of history

**Solution:**
- Minimum: 50 invoices + 12 months payment history
- Extend date range in export query
- Or use provided synthetic data (it's representative)

---

## After Upload

Once N1 validates successfully:

1. **Run N2-N8** with your data
2. **Review outputs** — Do they match your intuition?
3. **Share decision memo** with your CFO
4. **Implement plan** — Use operationalization checklist

---

## Questions?

- **Data schema unclear?** See `data/README.md`
- **Excel formatting help?** Google "Excel format cells as date"
- **Python code errors?** Check syntax or ask ChatGPT
- **Results don't match intuition?** That's normal. Compare to your manual forecast. Use Claude prompts to interpret.

**Ready to go!** 🎉

