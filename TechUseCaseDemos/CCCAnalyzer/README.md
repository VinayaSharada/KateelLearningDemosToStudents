# CCC Analyzer

## Overview

Browser-based hands-on exercise for Working Capital Optimization (Session 3).

## Learning Objectives

- Explain the main treasury decision that CCC Analyzer is designed to support.
- Change input assumptions and predict how the output should respond before running the demo.
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
3. Adjust the receivables, inventory, or payables inputs — the cash conversion cycle recalculates immediately.
4. Read the output first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- Start with the default assumptions, then change one variable at a time so students can isolate cause and effect.
- Treat each input as a lever that changes the scenario, baseline, or business context behind the result.

## Buttons / Actions

- Inputs recalculate the cash conversion cycle live — there is no separate run button.
- `Reset` returns to the default figures; `Export Results` saves the current scenario.

## Outputs

- Read the top-line result first, then look for supporting metrics, tables, or narratives that explain why it changed.
- Students should explain whether the output is descriptive, predictive, simulated, or recommended.

## What To Notice

- Look for receivables, inventory, payables, and cash conversion cycle components
- Observe which working-capital lever most improves cash tied up in operations
- Note that CCC improvements should be balanced against supplier, customer, and service impacts

## What you can enhance on your own

- Add explicit lever-by-lever cash-release math for DSO, DIO, and DPO instead of only showing the combined change.
- Add INR, lakh, and crore display modes alongside generic currency output.
- Add commercial constraints such as stock-out risk, supplier stress, and customer-service impact.
- Add scenario challenges such as "use only two levers" or "protect strategic suppliers."

## How to adapt this demo to your use case

- Map the formulas to your own balance-sheet and sales figures before discussing target improvements.
- Confirm whether payables improvement should be modeled with purchases or COGS in your environment, and disclose the approximation.
- Treat the cash-release number as a discussion starter until operations, procurement, and sales owners validate feasibility.
- Keep the shared demo reusable and move institution-specific cases into course notes or facilitation prompts.

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [AI Hedge Orchestrator](../AIHedgeOrchestrator/about.html)
- Related demo: [Collections Predictor](../CollectionsPredictor/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`

## Business decision

Use this demo to make the central decision in CCC Analyzer explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.
