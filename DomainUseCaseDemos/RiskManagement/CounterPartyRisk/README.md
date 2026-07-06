# Counter Party Risk

## Overview

Rating-driven CVA calculator with a collateral-mitigation view: pick a credit rating (AAA–CCC), set notional, maturity, and collateral, then use "Simulate 1-Notch Downgrade" to see exactly how much a rating transition moves net CVA at your current collateral level — the standard credit-risk-desk framing of counterparty exposure.

For a parametric CVA/DVA calculator with an Expected Exposure profile chart instead of a rating table, see [Counterparty Risk (CVA/DVA)](../../../TechUseCaseDemos/CounterpartyRiskDemo/about.html).

## Learning Objectives

- Explain the main risk decision that Counter Party Risk is designed to support.
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

- Look for exposure, probability of default, recovery rate, and expected loss
- Observe how counterparty risk changes with exposure size and credit quality
- Use "Simulate 1-Notch Downgrade" to see how much rating migration alone can move CVA, holding collateral fixed
- Note that expected loss is a starting point for collateral, limits, and monitoring decisions

## Related Demos or Course Context

- Course path: [Risk Management](../../../courses/risk-management.html)
- Related demo: [Contagion Model](../ContagionModel/about.html)
- Related demo: [AI Risk Calculator](../../../TechUseCaseDemos/AIRiskCalculator/about.html)
- Related demo: [Counterparty Risk (CVA/DVA)](../../../TechUseCaseDemos/CounterpartyRiskDemo/about.html) (parametric bilateral CVA/DVA with an exposure profile chart)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
