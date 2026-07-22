# P2P Process Mining Workbench

Browser-based Procure-to-Pay process-mining demo for finance, controllership, treasury, and operations workshops. The demo uses a bundled fictional Asteron AP event log to show that finance transformation should begin by diagnosing how invoice processing actually flows before choosing workflow, RPA, or AI.

## What this demo is about

The workbench starts with an assumed five-step AP happy path, then reveals what the fictional event log actually shows: missing-PO loops, missing-GRN loops, duplicate-review rework, delayed approvals, and a control breach where payment-ready status was reached before evidence was complete.

## Learning objectives

- Distinguish between the designed P2P process and the executed AP process.
- Quantify lead time, wait time, rework, exception ageing, and straight-through-processing rate from an event log.
- Separate eliminate, standardize, enable, assure, and monitor actions instead of treating every delay as an automation opportunity.
- Explain why a mined insight does not replace policy, control design, or managerial judgement.

## Run mode

- Primary: Browser

## Files

- `index.html`
- `about.html`
- `app.js`
- `style.css`
- `Data/ap_event_log.csv`
- `instructor-guide.md`
- `participant-task.md`
- `expected-answer.md`
- `BUILD_SPEC.md`

## How to run

- Browser: open `index.html`.

## Business decision

Use this demo to decide which AP friction should be eliminated, standardized, enabled with workflow, retained as human judgement, or monitored through operating triggers before the organization commits automation effort.

## What you can enhance on your own

- Add more entities, policy variants, non-PO exceptions, or approval rules once the base event-log logic is clear.
- Add richer cost assumptions, duplicate-risk views, or before/after transformation scenarios.
- Add exportable management packs or facilitator prompts for your own workshop sequence.

## How to adapt this demo to your use case

- Replace the bundled fictional event log with sanitized AP or P2P events from your own organization or course context.
- Revalidate metric definitions, SLA thresholds, and control triggers with AP, procurement, operations, and controller owners before operational use.
- Keep the output framed as diagnostic evidence and management discussion support until the workflow and controls are tested in your own setting.
