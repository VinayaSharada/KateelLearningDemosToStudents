Pattern Mining Demo (demo002)

This folder contains a credit-card transaction synthetic generator (`syndata.py`) and
an ecommerce-focused synthetic data generator (`ecom_syndata.py`). Both write
`syntheticdata.csv` in item-level format so the existing `fulldemo.py` can run without
modification.

Usage examples:
- python syndata.py --rows 5000
- python ecom_syndata.py --orders 2000
- python ecom_syndata.py --sample  # quick preview

Notes:
- `ecom_syndata.py` produces realistic product bundles (e.g., Electronics + Accessories,
  Clothing + Shoes, Groceries + Household) and repeated customers to make pattern
  mining examples more realistic.

New demo:
- `ecom_fulldemo.py` demonstrates frequent itemset mining with **Apriori** and **FP-Growth**
  using baskets created from orders (CustomerID + TransactionDate). Use `--minsup` and `--plot`.

Tests:
- `test_ecom_syndata.py` and `test_ecom_fulldemo.py` provide lightweight smoke tests.

## Business decision

Use this demo or hub to make the central decision in demo002 explicit, understand the main trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
