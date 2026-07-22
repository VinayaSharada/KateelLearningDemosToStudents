# O2C Process Mining Demo Build Spec

## Purpose

Build a reusable Order-to-Cash process-mining demo pair:

- a browser-based workbench for instructor-led reveal and participant exploration
- a Colab notebook companion for transparent, cell-by-cell metric calculation

The objective is to show that finance transformation should begin by diagnosing how work actually flows before choosing workflow, RPA, or AI.

## Audience

- Treasury and working-capital learners
- CFO and aspiring CFO audiences
- O2C, controllership, finance-transformation, and operations stakeholders
- Faculty who want a reusable process-diagnostic demo with no production dependencies

## Delivery Modes

- Browser demo: 8-minute facilitator path plus 10-minute participant exploration
- Colab notebook: 35-50 minute transparent walkthrough with step-by-step explanations after each code block

## Business Question

Which O2C friction should be eliminated or standardized upstream, which stable path is ready for workflow enablement, and which exception should remain controlled and human-reviewed?

## Fictional Dataset Standard

Use only fictional event-log data bundled with the repository. The minimum schema is:

- `case_id`
- `activity`
- `timestamp`
- `owner`
- `detail`
- `amount_inr`
- `entity`
- `credit_ok`
- `delivery_confirmed`
- `dispute_flag`
- `exception_type`
- `invoice_status`

The bundled O2C dataset should support:

- a clear straight-through path
- credit-hold loops
- delivery-dispute loops
- short-payment review
- unapplied-cash delay
- at least one control breach
- a small set of high-value cases

## Browser Demo Requirements

The browser workbench must include:

- Assumed happy path screen
- Actual variant reveal with a coverage slider
- Friction screen with lead time, wait time, touch time, handoffs, rework, and illustrative rework cost
- Compliance and control exception screen
- Transformation decision board
- Monitoring trigger screen
- `Reset demo`
- `Show instructor path` and `Explore data` modes
- glossary and fictional-data disclaimer

## Notebook Requirements

The Colab companion must:

- use the same fictional event log as the browser workbench
- include a `Run in Colab` button on the launch page
- explain each code block with a follow-on markdown cell
- calculate variant count, lead time, wait time, touch time, rework, first-pass yield, STP, and exception ageing
- separate diagnostic evidence from management judgement
- support both GitHub raw loading in Colab and local bundled loading when run from a repo checkout

## Decision Framework

Use the CLEAR framing:

- Clarify
- Lean out
- Enable
- Assure
- Realise

Every key finding should map to one or more of:

- Eliminate
- Standardize
- Enable workflow
- Keep human-reviewed
- Assure / monitor

## Self-Service Standard

Both surfaces should explicitly tell users:

- what they can enhance on their own
- how to adapt the demo to their use case

This is required because the demo library serves multiple stakeholders and should support self-service reuse, not just instructor projection.

## Deliverables

- `index.html`
- `about.html`
- `README.md`
- `BUILD_SPEC.md`
- `instructor-guide.md`
- `participant-task.md`
- `expected-answer.md`
- bundled fictional CSV
- Colab notebook launch page
- Colab notebook
- pack-local fallback notes

## Acceptance Check

The O2C demo pair is acceptable only when:

- both surfaces use fictional bundled data
- the browser demo runs locally with no login or API keys
- the notebook opens through a working Colab URL
- the metrics are traceable to the event log
- the straight-through path is visibly different from exception paths
- control exceptions have named owners or escalation logic
- both surfaces include self-service enhancement and adaptation guidance
