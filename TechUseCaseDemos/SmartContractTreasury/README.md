# Smart Contract Treasury

## Overview

Treasury controls demo showing how payment rules, wallet details, token choice, and AI monitoring interact before a transaction is approved, flagged, or blocked in a smart-contract style workflow.

## Learning Objectives

- Explain the main treasury decision that Smart Contract Treasury is designed to support.
- Use Treasury scenario, Enable AI monitoring to test how different assumptions change the scenario.
- Interpret Output: Approval Queue in plain language and connect them to an action or conclusion.
- State one limitation, risk, or governance consideration before using the result in a real decision.

## Run Modes

- Browser

## Expected Setup / Startup Time

- Starts immediately in browser with no installs, no API keys, and classroom-safe defaults.

## Demo Type

- Interactive browser demo

## Files in This Folder

- `app.js`
- `index.html`
- `README.md`
- `style.css`

## How To Run

- Browser: open `index.html`.

## How To Use The Demo

1. Choose the run mode that fits the class: Browser.
2. Review the default assumptions before changing anything.
3. Change one or two inputs, then use `Submit Transaction`.
4. Read Output: Approval Queue first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Treasury scenario` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Enable AI monitoring` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Recipient wallet or vendor` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Amount` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Token` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Submit Transaction` runs the policy checks and shows whether the treasury instruction is approved, warned on, or rejected.
- `Reset` returns the payment scenario to a clean baseline.
- `Export Snapshot` saves the transaction state and control outcome for audit or classroom review.

## Outputs

- `Output: Approval Queue` should be read as evidence for the decision, not just a display element. Ask what high, low, or changing values imply.

## What To Notice

- The interesting learning moment is not only whether the transaction passes, but which control caused the decision
- Use AI monitoring as an explanatory layer, not as a replacement for explicit treasury policy rules
- Discuss where human override is appropriate and where automation should stay strict

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [AI Hedge Orchestrator](../AIHedgeOrchestrator/about.html)
- Related demo: [CCC Analyzer](../CCCAnalyzer/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
