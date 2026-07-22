# P2P Process Mining Notebook Hub

Colab-based finance and operations demo that walks through process-mining calculations for a fictional Asteron AP event log.

## What this demo is about

Use this notebook after or alongside the browser-based `P2P Process Mining Workbench` when you want students to see how the metrics are calculated from the AP event log instead of only consuming the finished workbench.

## Run mode

- Primary: Colab
- Secondary: local Jupyter notebook execution

## Data source

The notebook reads the shared fictional AP event log used by the browser workbench:

- `TechUseCaseDemos/P2PProcessMiningWorkbench/Data/ap_event_log.csv`
- GitHub raw fallback for Colab: `https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/TechUseCaseDemos/P2PProcessMiningWorkbench/Data/ap_event_log.csv`

## Business decision

Use this notebook to make the central decision in P2P Process Mining Notebook Hub explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own entities, thresholds, amount bands, or exception classes.
- Compare pre-change and post-change process variants.
- Add exportable summaries for AP, procurement, and controllership stakeholders.

## How to adapt this demo to your use case

- Replace the fictional event log with sanitized AP or P2P events from your own context.
- Revalidate activity labels, SLA assumptions, and control triggers with domain owners.
- Treat the notebook output as diagnostic evidence, not root-cause proof.
