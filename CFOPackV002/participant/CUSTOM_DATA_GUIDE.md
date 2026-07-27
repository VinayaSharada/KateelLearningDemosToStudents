# Adapting CFOPackV002 to Company Data

Company use is a controlled mapping exercise, not a simple file replacement.

## Required input groups

1. Customer master and relationship attributes
2. Historical invoices and matched payments
3. Current outstanding receivables
4. Dated non-supplier operating outflows
5. Dated supplier payments and extension constraints
6. Inventory-release options and execution costs
7. FX exposures by currency, direction and tenor
8. Opening cash, minimum liquidity and facility terms
9. FX and approval policy boundaries

## Minimum historical evidence

- At least 12 months of matched invoice/payment history
- Enough observations across customer types to evaluate a chronological holdout
- Documented treatment of partial payments, credits, disputes and write-offs

If this evidence is unavailable, use a transparent rule-based receipt model and
do not imply that machine learning adds validated predictive value.

## Mapping controls

- Preserve raw extracts separately from transformed workshop inputs.
- Reconcile invoice and payment totals before modeling.
- Record timezone, currency conversion and date conventions.
- Remove or tokenize personal and confidential identifiers.
- Confirm facility, policy and approval inputs with their accountable owners.
- Run every blocking validation check before calculating a forecast.

## Required sign-offs

- Controller: source integrity and accounting treatment
- Treasurer: cash, facility and hedge assumptions
- Commercial owner: customer/supplier action constraints
- Information security/privacy owner: data handling
- CFO or delegate: decision authority and minimum-liquidity policy

The synthetic case is educational. A company-data result is advisory until the
organization completes its own validation and approval process.
