# CFOPackV002 Synthetic Data

The data is generated deterministically from
`config/scenario_manifest.json` using `data/generate_scenario.py`.

| File | Purpose | Key grain |
|---|---|---|
| `customers.csv` | Observable customer characteristics | One row per customer |
| `invoices.csv` | Historical paid and current outstanding receivables | One row per invoice |
| `payments.csv` | Historical payment outcomes | One row per paid invoice |
| `operating_outflows.csv` | Non-supplier operating cash requirements | One row per forecast day |
| `supplier_payments.csv` | Dated AP payments and extension constraints | One row per supplier payment |
| `fx_exposures.csv` | Currency, direction, tenor and hedge position | One row per exposure |
| `inventory_options.csv` | Timing, cost and risk of inventory-release choices | One row per option |

## Design principles

- The as-of date and seed are fixed for reproducible workshops.
- The target payment delay is not copied from a customer-average feature.
- Historical model validation uses a chronological holdout.
- Receivables and payables retain their FX direction.
- Liquidity actions use explicit dates, costs and bounds.

## Company-data adaptation

Do not replace these files until you have completed
`participant/CUSTOM_DATA_GUIDE.md`. Company use also requires facility,
liquidity-policy, accounting and hedge-policy inputs in the scenario manifest.
