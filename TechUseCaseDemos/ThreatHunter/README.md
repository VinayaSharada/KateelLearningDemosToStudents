# Threat Hunter

## Overview

Upload a log file and run a simulated threat hunt: the tool scores each entry, flags anomalies, and produces an overall risk score so students can practice narrowing broad telemetry into specific findings.

## Learning Objectives

- Explain the main risk decision that Threat Hunter is designed to support.
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
3. Upload a `.log`, `.csv`, or `.json` file, then click `Analyze Logs`.
4. Read the output first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- Start with the default assumptions, then change one variable at a time so students can isolate cause and effect.
- Treat each input as a lever that changes the scenario, baseline, or business context behind the result.

## Buttons / Actions

- `Analyze Logs` becomes active once a log file is uploaded, and runs the anomaly scan.

## Outputs

- Read the top-line result first, then look for supporting metrics, tables, or narratives that explain why it changed.
- Students should explain whether the output is descriptive, predictive, simulated, or recommended.

## What To Notice

- Look for hypothesis, telemetry source, indicator, and evidence trail
- Observe how a hunting query narrows from broad signals to specific activity
- Note that threat hunting is disciplined curiosity backed by evidence

## Related Demos or Course Context

- Course path: [Risk Management](../../courses/risk-management.html)
- Related demo: [Contagion Model](../../DomainUseCaseDemos/RiskManagement/ContagionModel/about.html)
- Related demo: [Counter Party Risk](../../DomainUseCaseDemos/RiskManagement/CounterPartyRisk/about.html)
- Related demo: [AI Risk Calculator](../AIRiskCalculator/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
