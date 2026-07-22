# Fraud Playground

## Overview

Interactive demo for fraud detection using anomaly detection techniques.

## Learning Objectives

- Explain the main banking decision that Fraud Playground is designed to support.
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
3. Change one or two inputs, then use `Run the main action`.
4. Read the output first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- Start with the default assumptions, then change one variable at a time so students can isolate cause and effect.
- Treat each input as a lever that changes the scenario, baseline, or business context behind the result.

## Buttons / Actions

- Use the main run or simulate action to compute the scenario after inputs are set.
- Use export or reset actions, when present, to compare runs or return to a classroom-safe baseline.

## Outputs

- Read the top-line result first, then look for supporting metrics, tables, or narratives that explain why it changed.
- Students should explain whether the output is descriptive, predictive, simulated, or recommended.

## What To Notice

- Look for transaction signals, anomaly score, and fraud flag
- Observe how small changes in amount, location, or frequency alter the risk signal
- Note that fraud detection balances false positives, false negatives, and customer friction

## What you can enhance on your own

- Add more fraud features such as merchant category, device reputation, velocity windows, or customer history.
- Add explicit confusion-matrix outputs and threshold trade-off views for fraud versus customer friction.
- Add investigator workflow elements such as owner, alert queue, or escalation state.
- Export the scenario, threshold choice, and operating interpretation for class or internal review.

## How to adapt this demo to your use case

- Replace the sample transaction assumptions with the fraud patterns, channels, and review thresholds relevant to your environment.
- Revalidate whether the demo should emphasize model accuracy, analyst workload, customer experience, or fraud-loss prevention.
- Keep the output advisory until fraud, risk, and operations owners agree on the action thresholds.
- Use the same demo across banking, payments, risk, and classroom settings by changing the business question rather than the anomaly engine.

## Related Demos or Course Context

- Course path: [Banking & Finance](../../courses/banking.html)
- Related demo: [Interest Rate Risk](../../DomainUseCaseDemos/Banking/IntRateRisk/about.html)
- Related demo: [Liquidity Management](../../DomainUseCaseDemos/Banking/LiquidityMgmt/about.html)
- Related demo: [Loan Default Predictor](../../DomainUseCaseDemos/Banking/LoanDefaultPredictor/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`

## Business decision

Use this demo to make the central decision in Fraud Playground explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.
