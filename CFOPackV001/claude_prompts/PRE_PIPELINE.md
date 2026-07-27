# Pre-Pipeline Prompts

Use these **before N1** (or before your session, if you're prepping data at home). Copy a prompt, paste your data/context where marked, and send it to Claude.

All prompts are optional — the notebooks run fine without them.

---

## 1. Data Quality Exploration

**When to use:** Right after loading the CSVs, before you trust any number in them.

```
I'm about to run a treasury analysis pipeline on this data. Before I trust it,
help me spot problems.

[paste output of df.head() and df.describe() for invoices.csv, or a summary:
row count, columns, date range, min/max amount]

Questions:
1. What looks unusual (outliers, suspicious dates, negative amounts)?
2. What would you check before using this for a $500K+ decision?
3. What's missing that I should ask about (e.g. currency, tax treatment)?
```

---

## 2. Schema Mapping for Your Own Data

**When to use:** You're replacing the synthetic CSVs with your company's real export and the columns don't line up.

```
I have an invoices export from [your ERP/accounting system] with these columns:
[paste your column names]

The workshop notebooks expect this schema:
invoice_id, customer_id, invoice_date, due_date, amount_usd, payment_terms_days, status

Map my columns to theirs. Flag anything that doesn't have an obvious match,
and tell me if I need to compute a column (e.g. payment_terms_days from
invoice_date and due_date).
```

---

## 3. Anonymization Helper

**When to use:** You want to bring real company data but can't share actual customer names or exact amounts.

```
I need to anonymize this data before using it in a workshop / sharing it
outside my company.

[describe or paste a few sample rows]

Give me a consistent scheme to:
1. Replace customer names with labels (CUST-A, CUST-B, ...) while preserving
   which rows belong to the same customer
2. Round dollar amounts to remove precision that could identify a specific deal
3. Keep relative patterns intact (who's a big customer, who pays late) so the
   analysis still teaches something real
```

---

## 4. Customer Concentration First Look

**When to use:** Before N1, if you want a head start on "who actually matters in this book of business."

```
Here's a summary of my customer/invoice data (or the full customers.csv):
[paste data or summary: customer count, total AR, top 10 customers by
outstanding balance]

1. What does the concentration look like (e.g. top 20% of customers = X% of AR)?
2. Is this concentration a risk in itself, separate from payment timing?
3. What would you want to know about the top 5 customers before recommending
   any collections action against them?
```

---

## 5. Framing the Business Challenge

**When to use:** Before the workshop starts, to get your head into "CFO mode" rather than "spreadsheet mode."

```
I'm about to work through a treasury liquidity scenario: a forecast shows a
cash gap in the next two weeks, and I need to recommend action to my CFO by
end of day.

Before I look at any data, help me think through:
1. What questions should I be asking about *why* the gap exists, not just
   *how big* it is?
2. What's the difference between a forecasting problem and an execution problem
   here?
3. What would make a recommendation credible to a CFO vs. just "busy work"?
```
