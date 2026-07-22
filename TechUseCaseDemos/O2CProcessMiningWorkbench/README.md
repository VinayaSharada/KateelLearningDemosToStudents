# O2C Process Mining Workbench

Browser-based Order-to-Cash process-mining demo for a CFO-aspirant workshop. The demo uses a bundled fictional Asteron O2C event log to show that finance transformation should begin by diagnosing how work actually flows before choosing low-code workflow, RPA, or AI.

## What this demo is about

The workbench starts with an assumed five-step happy path, then reveals what the fictional O2C event log actually shows: credit-hold loops, delivery disputes, short-payment reviews, unapplied-cash delay, and a control breach where cash was applied before evidence was complete.

## Learning objectives

- Distinguish between the designed O2C process and the executed O2C process.
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
- `Data/o2c_event_log.csv`
- `instructor-guide.md`
- `participant-task.md`
- `expected-answer.md`

## How to run

- Browser: open `index.html`.

## Business decision

Use this demo to decide which O2C friction should be eliminated, standardized, enabled with workflow, retained as human judgement, or monitored through operating triggers before the organization commits automation effort.

## What you can enhance on your own

- Add more entities, policy variants, payment terms, or regional credit-control rules once the base event-log logic is clear.
- Add richer cost assumptions, DSO impact estimates, and side-by-side before/after transformation scenarios.
- Add exportable management packs or facilitator prompts for your own workshop sequence.

## How to adapt this demo to your use case

- Replace the bundled fictional event log with sanitized O2C events from your own organization or course context.
- Revalidate metric definitions, SLA thresholds, and control triggers with finance, operations, and controller owners before operational use.
- Keep the output framed as diagnostic evidence and management discussion support until the workflow and controls are tested in your own setting.
