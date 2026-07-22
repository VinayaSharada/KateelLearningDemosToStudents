# O2C Process Mining Notebook Hub

Colab-based treasury and finance-transformation demo that walks through process-mining calculations for a fictional Asteron Order-to-Cash event log.

## What it covers

- Happy-path versus executed-path comparison for a fictional O2C process
- Variant count and top-variant reveal from the event log
- Lead time, touch time, wait time, rework rate, first-pass yield, and straight-through-processing rate
- Compliance and control exception detection
- Transformation decision board using eliminate, standardize, enable, assure, and monitor actions
- Monitoring triggers for high-value unresolved cases, disputes, and falling STP rate

## Run mode

- Primary: Google Colab
- Secondary: export and extend in your own notebook environment

## Notebook

- `o2c_process_mining_notebook.ipynb`

## Data source

The notebook reads the bundled fictional event log from this repository:

- `TechUseCaseDemos/O2CProcessMiningWorkbench/Data/o2c_event_log.csv`

The Colab version fetches the raw CSV from this same repo so the browser demo and the notebook stay aligned.

## Teaching use

Use this notebook after or alongside the browser-based `O2C Process Mining Workbench` when you want students to see how the metrics are calculated from the event log instead of only consuming the finished workbench.

## What you can enhance on your own

- Add more regional entities, policy variants, payment terms, or dispute classes once the base notebook flow is stable.
- Add additional plots for owner-level queue ageing, amount-weighted friction, or future-state scenario comparison.
- Add your own control-rule library or exportable management-summary tables.

## How to adapt this demo to your use case

- Replace the fictional O2C event log with sanitized events from your own process before changing the calculations.
- Revalidate metric definitions, activity labels, and control thresholds with finance, operations, and controller owners.
- Keep the notebook framed as diagnostic and educational until the workflow and controls are tested in your own environment.

## Business decision

Use this demo to make the central decision in O2C Process Mining Notebook Hub explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.
