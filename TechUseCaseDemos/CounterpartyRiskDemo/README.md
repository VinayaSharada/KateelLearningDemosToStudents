# Counterparty Risk

## Overview

Parametric bilateral CVA/DVA calculator: set notional, exposure factor, counterparty PD, your own PD, and LGD to see CVA, a genuinely computed DVA, and the Net Bilateral CVA update live, alongside an Expected Exposure profile chart showing how exposure actually rises and decays over the life of a trade.

For a rating-driven CVA view with a one-notch-downgrade scenario and collateral mitigation instead, see [Counter Party Risk](../../DomainUseCaseDemos/RiskManagement/CounterPartyRisk/about.html).

## Learning Objectives

- Explain the main risk decision that Counterparty Risk is designed to support.
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

- Look for counterparty profile, exposure, credit signal, and mitigation action
- Observe how concentration and credit deterioration change risk posture
- Raise "Own PD" and watch DVA offset CVA in the Net Bilateral CVA figure — this is the accounting benefit of your own default risk, not a free lunch
- Compare the flat Expected Exposure number to the actual profile curve — CVA calculated off a single snapshot understates or overstates risk depending on where in the trade's life that snapshot falls
- Note that counterparty risk management depends on limits, collateral, and timely escalation

## What you can enhance on your own

- Add collateral, netting, wrong-way risk, and concentration overlays on top of the base CVA/DVA view.
- Add side-by-side scenarios for downgraded counterparties, collateral disputes, or stressed PD assumptions.
- Add exportable exposure and adjustment summaries for committee or class discussion.
- Add clearer separation between accounting adjustment, economic exposure, and risk-limit usage.

## How to adapt this demo to your use case

- Replace the sample PD, LGD, and exposure assumptions with the market, counterparty, and product conditions relevant to your environment.
- Decide whether the discussion should emphasize pricing adjustment, limit management, accounting impact, or escalation policy.
- Keep the calculator educational until risk owners confirm model assumptions, legal netting treatment, and collateral mechanics.
- Use the same demo across risk, treasury, banking, quant, and classroom settings by changing the decision question rather than the core CVA engine.

## Related Demos or Course Context

- Course path: [Risk Management](../../courses/risk-management.html)
- Related demo: [Contagion Model](../../DomainUseCaseDemos/RiskManagement/ContagionModel/about.html)
- Related demo: [Counter Party Risk](../../DomainUseCaseDemos/RiskManagement/CounterPartyRisk/about.html) (rating-driven CVA with a downgrade scenario and collateral mitigation)
- Related demo: [AI Risk Calculator](../AIRiskCalculator/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
