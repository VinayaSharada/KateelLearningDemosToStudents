# CFO Demo Standards

## Purpose

These standards define what makes a demo **CFO-ready** in `KateelLearningDemosToStudents`.

They apply to:

- upgraded existing demos
- newly created finance-transformation demos
- treasury, reconciliation, governance, workflow, and AI-support demos intended for finance audiences

## Core principle

Every CFO-facing demo must present the **business decision first**.

Technology is secondary. A user should be able to answer:

- What decision is being made?
- What evidence supports it?
- What are the limits?
- Who owns it?
- What requires approval?

## Mandatory demo elements

Every CFO-facing demo must include:

- `about.html`
- `index.html`
- `README.md`
- `instructor-guide.md`
- `participant-task.md`
- `expected-answer.md`
- a visible `Reset` control

## Required UX sections inside the demo

Every demo should visibly include:

- business decision
- source evidence
- limitation or warning
- owner
- exception route
- human approval point
- CFO-facing output summary

## CFO-facing output summary

Every demo must end in an output that covers:

- value
- risk
- control
- stakeholder impact
- next decision

## Evidence and judgement boundaries

Every demo must separate:

- signal
- evidence
- recommendation
- human judgement
- approval

The demo must never imply that:

- extraction equals accounting judgement
- AI-generated commentary is fit for CFO release without review
- approval can be skipped because a model is confident
- autonomous posting or autonomous finance approval is acceptable

## Data standards

- Use fictional or sanitized data only.
- Do not include real customer, supplier, employee, or company-sensitive data.
- If a demo simulates ERP or finance records, it must say clearly that the dataset is fictional.

## Runtime standards

- Core classroom demos should remain browser-based and API-key-free.
- If a notebook or local mode exists, the browser or launch page must explain why that mode is used.
- Any external dependency must be optional and clearly labeled.

## Teaching modes

Every demo must support:

- `Facilitator mode`: `5-8 minutes`
- `Participant exercise mode`: `10 minutes`

Facilitator mode should:

- guide the instructor to the main teaching point quickly
- highlight the evidence and approval logic
- make the recommended interpretation visible

Participant mode should:

- state the task clearly
- let the learner change assumptions or classify outcomes
- end with a decision or escalation choice

## Finance governance fields

Where relevant, demos should expose:

- initiative owner
- CFO sponsor
- CIO owner
- process owner
- data owner
- approval rights
- review date
- exception owner
- audit evidence

## Controls and exception-management standards

Where relevant, demos should show:

- materiality threshold
- ageing of exceptions
- root cause
- assigned owner
- SLA
- escalation outcome
- whether close or release should be blocked

## Content and commentary standards

For summarization, extraction, commentary, or workflow demos:

- require cited source evidence
- flag unsupported claims
- show reviewer sign-off
- identify what remains a human accounting, treasury, or policy judgement

## Objective-fit test

A demo is CFO-ready only if all of the following are true:

1. It supports a real finance decision.
2. It shows source evidence and limitations.
3. It identifies an owner and approval point.
4. It makes human judgement explicit.
5. It produces a CFO-facing output summary.

## Nice-to-have enhancements

- exportable summary or snapshot
- expected answer reveal
- facilitator cue card
- participant worksheet alignment
- metadata tags for `cfo`, `controller`, `finance-transformation`, `treasury`
