# AI Cost Benefit Analyzer

## Overview

Business-case demo where students estimate implementation cost, operational savings, and value uplift to judge whether an AI initiative has an acceptable payback profile and strategic rationale.

## Learning Objectives

- Explain the main ai/ml decision that AI Cost Benefit Analyzer is designed to support.
- Use Data acquisition cost, Compute and tooling cost to test how different assumptions change the scenario.
- Interpret the result in plain language, not just as a number, chart, or AI recommendation.
- State one limitation, risk, or governance consideration before using the result in a real decision.

## Run Modes

- Browser

## Expected Setup / Startup Time

- Starts immediately in browser with no installs, no API keys, and classroom-safe defaults.

## Demo Type

- Interactive browser demo

## Files in This Folder

- `about.html`
- `app.js`
- `index.html`
- `README.md`
- `style.css`

## How To Run

- Browser: open `index.html`.

## How To Use The Demo

1. Choose the run mode that fits the class: Browser.
2. Review the default assumptions before changing anything.
3. Change one or two inputs, then use `Calculate Business Case`.
4. Read the output first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Data acquisition cost` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Compute and tooling cost` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Implementation hours` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Hourly personnel rate` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Monthly transaction volume` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Value per transaction` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Efficiency gain (%)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Calculate Business Case` is the main action that computes, compares, or generates the next result from the current inputs.

## Outputs

- The important outputs are total cost, expected benefit, payback timing, and the overall business-case conclusion.
- Students should compare optimistic and conservative assumptions instead of treating one ROI number as final truth.

## What To Notice

- A positive ROI can still hide timing risk if benefits arrive much later than implementation cost
- Discuss which assumptions are operationally measurable and which are more speculative strategic upside
- Use the result to debate investment timing and governance, not just to approve or reject the idea automatically

## What you can enhance on your own

- Add adoption curves, control-remediation cost, confidence ranges, and scenario bands instead of a single-point business case.
- Add side-by-side optimistic, base, and conservative cases with exportable assumptions.
- Add benefit categories that separate labor savings, revenue uplift, control improvement, and risk reduction.
- Add explicit owner and approval fields so the calculator becomes a reusable investment-decision record.

## How to adapt this demo to your use case

- Replace the sample volumes, costs, and efficiency assumptions with measures your team can actually validate.
- Decide which benefits are measurable within a budget cycle and which remain strategic or exploratory.
- Keep the calculator as a discussion tool until finance, product, and operations owners agree on the benefit logic.
- Use the same demo across AI/ML, transformation, CFO, and classroom settings by changing the case framing rather than the core math.

## Related Demos or Course Context

- Course path: [AI/ML Workflows](../../courses/ai-ml-workflows.html)
- Related demo: [AB Testing Framework](../ABTestingFramework/about.html)
- Related demo: [AI Data Analyzer](../AIDataAnalyzer/about.html)
- Related demo: [AI Decision Tracker](../AIDecisionTracker/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`

## Business decision

Use this demo to make the central decision in AI Cost Benefit Analyzer explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.
