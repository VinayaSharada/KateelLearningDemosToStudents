# Demo Library Standards

## Purpose

These standards define what makes a demo reusable, self-service capable, and course-neutral in `KateelLearningDemosToStudents`.

They apply to:

- browser demos
- Colab and notebook demos
- local or hybrid demos
- newly created demos
- upgraded existing demos

## Core principle

A demo should contain reusable business logic and reusable learning value.

It should not depend on a specific course, institution, module number, or faculty narrative in its core implementation.

Courses should provide:

- sequencing
- timeboxing
- case framing
- assessment
- local teaching context

The demo itself should provide:

- a stable reusable experience
- transparent logic
- sample data
- self-service customization paths

## Mandatory demo elements

Every demo should include:

- `index.html` or a primary notebook entry point
- `about.html` for browser demos
- `README.md`
- `instructor-guide.md`
- `participant-task.md`
- `expected-answer.md`
- a visible `Reset` control for interactive browser demos

## Required demo structure

Every demo should clearly separate:

- inputs
- calculated outputs
- interpretation
- limitations

Every demo should also identify:

- what business decision the demo supports
- what evidence or assumptions are used
- what remains human judgment
- who is most likely to care about the output

## Self-service sections

Every demo should include two explicit self-service sections in its user-facing documentation and, where practical, in the UI:

### `What you can enhance on your own`

This section should help a learner or practitioner extend the demo safely. Typical enhancement ideas include:

- adding a new scenario
- changing decision thresholds
- modifying weights or assumptions
- swapping in a different sample dataset
- adding a new output or export
- localizing currency, terminology, or reporting format

### `How to adapt this demo to your use case`

This section should help a user translate the demo into their own organization, team, course, or domain. Typical guidance includes:

- what input fields need to be mapped
- what assumptions should be revalidated
- what outputs are safe to reuse directly
- what approvals or governance checks are needed
- what should remain synthetic in a classroom setting
- what additional production controls would be required

## Metadata requirements

Every demo should have stable metadata, either embedded in a central registry or stored in a structured demo definition.

Suggested metadata:

```json
{
  "demoId": "stable-id",
  "title": "Demo title",
  "engineType": "simulation",
  "domains": ["treasury", "risk-management"],
  "concepts": ["scenario-analysis"],
  "runModes": ["browser"],
  "currencies": ["INR", "USD", "generic"],
  "durationRange": "20-40 minutes",
  "requiresApiKey": false,
  "supportsOwnData": false,
  "dataSensitivity": "synthetic-only",
  "readiness": "classroom-ready",
  "lastVerified": "YYYY-MM-DD"
}
```

## Engine labeling

Each demo should declare its engine accurately. Use one of:

- `calculator`
- `rule-based`
- `simulation`
- `machine-learning`
- `GenAI`
- `external-api`

If a demo includes narrative guidance on top of calculations, the guidance should be labeled as `rule-based guidance` unless a stronger basis is truly present.

## Data and privacy standards

- Use synthetic or sanitized data only in committed demo assets.
- Do not commit confidential participant, employer, customer, supplier, or employee data.
- If own-data upload is supported, the demo must say clearly what data can be uploaded and what should not be uploaded.
- Notebook demos must never auto-commit or auto-publish participant data.

## Accessibility and usability standards

Every classroom-ready demo should meet at least basic expectations for:

- keyboard navigation
- contrast
- responsive layout
- screen-reader-friendly labeling
- visible reset and export actions

## Runtime standards

- Core classroom demos should be API-key-free whenever possible.
- Browser demos should work independently of a course pack.
- Notebook and local modes should explain why those modes exist and what extra setup they require.
- Public URLs should remain stable when a demo is upgraded.

## Validation expectations

Browser demos should pass smoke tests for:

- page load
- link reachability
- changing inputs changes outputs
- reset works
- export produces a non-empty result

Notebook demos should pass smoke tests for:

- fresh execution with sample data
- no hidden local-only dependency
- clearly separated training versus scoring behavior where relevant
- repeatable classroom execution where randomness is used

## Audience design principle

The library serves multiple audiences.

Some demos are primarily for CFOs and aspiring CFOs. Others are designed for treasury teams, operations teams, faculty, students, product teams, risk teams, or mixed executive groups.

Each demo should state:

- primary audience
- secondary audiences
- what each audience is expected to learn or decide

The goal is not to make every demo identical. The goal is to make every demo understandable, reusable, and adoptable by more than one stakeholder group when appropriate.
