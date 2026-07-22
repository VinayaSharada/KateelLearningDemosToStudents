# Demo Authoring Template

Use this template when creating or upgrading a demo.

## Required file set

```text
<demo-folder>/
├── README.md
├── about.html
├── index.html
├── instructor-guide.md
├── participant-task.md
├── expected-answer.md
└── optional supporting assets
```

Notebook-first demos may replace `index.html` with a launch page that explains notebook purpose, run mode, and warnings.

## Required README sections

```md
# <Demo title>

## Business decision

## Engine type

## Primary audience

## Secondary audiences

## What this demo shows

## Inputs

## Outputs

## Assumptions and formulas

## Limitations and warnings

## What you can enhance on your own

## How to adapt this demo to your use case
```

## Required UI sections

Where practical, the demo UI should visibly surface:

- business decision
- audience or stakeholder context
- evidence or assumptions
- output summary
- limitations
- reset action
- export action

## Self-service prompts

### What you can enhance on your own

Include 3-6 concrete ideas such as:

- add a new scenario
- adjust weights
- change thresholds
- add a new dashboard view
- add a CSV export
- localize currency or units

### How to adapt this demo to your use case

Include practical adoption guidance such as:

- map your own input data to these columns
- revalidate these assumptions with your team
- review these thresholds with risk or finance owners
- replace sample labels with your own process steps
- keep these outputs advisory until approved

## Tone guidance

- Keep the core demo course-neutral.
- Avoid hard-coding module, session, or institution references in the demo UI.
- Put course-specific framing in course-pack guides, not in the demo implementation.
- Prefer plain language over tool jargon when explaining results.
