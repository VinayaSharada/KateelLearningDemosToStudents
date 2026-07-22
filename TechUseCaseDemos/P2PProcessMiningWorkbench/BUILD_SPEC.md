# P2P Process Mining Demo Build Spec

## Purpose

Build a reusable Procure-to-Pay process-mining demo pair:

- a browser-based workbench for instructor-led reveal and participant exploration
- a Colab notebook companion for transparent, cell-by-cell metric calculation

The objective is to show that finance transformation should begin by diagnosing how invoice processing actually flows before choosing workflow, RPA, or AI.

## Audience

- CFO and aspiring CFO audiences
- AP, procurement, operations, controllership, and finance-transformation stakeholders
- Faculty who want a reusable process-diagnostic demo with no production dependencies

## Business Question

Which AP friction should be eliminated or standardized upstream, which stable path is ready for workflow enablement, and which exception should remain controlled and human-reviewed?

## Dataset Standard

Use bundled fictional AP event-log data only. Minimum schema:

- `case_id`
- `activity`
- `timestamp`
- `owner`
- `detail`
- `amount_inr`
- `entity`
- `po_present`
- `grn_present`
- `exception_type`
- `invoice_status`

Required patterns:

- straight-through path
- missing-PO loops
- missing-GRN loops
- duplicate-review rework
- delayed-approval variants
- at least one control breach

## Acceptance

The P2P set is acceptable only when:

- both surfaces use fictional bundled data
- the browser demo runs locally with no login or API keys
- the notebook opens through a working Colab URL
- the metrics are traceable to the event log
- the straight-through path is visibly different from exception paths
- control exceptions have named owners or escalation logic
- both surfaces include self-service enhancement and adaptation guidance
