# Monte Carlo Company Valuation

## Overview

Browser-based Monte Carlo simulation for valuing a company over a five-year forecast horizon. Students can edit revenue growth, margin, tax, working capital, capex, terminal growth, WACC, simulation count, confidence interval, NPV threshold, and value-creation probability controls.

## Learning Objectives

- Explain the main ai/ml decision that Monte Carlo Company Valuation is designed to support.
- Use Scenario, Current acquisition price / initial investment (₹ crore) to test how different assumptions change the scenario.
- Interpret 3. Simulation output, 4. Statistical summary in plain language and connect them to an action or conclusion.
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
3. Change one or two inputs, then use `Reset defaults`.
4. Read 3. Simulation output first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Scenario` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Current acquisition price / initial investment (₹ crore)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Base-year revenue (₹ crore)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Mean annual revenue growth (%)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Revenue growth volatility (%)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Mean EBITDA margin (%)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `EBITDA margin volatility (%)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Tax rate (%)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Reset defaults` returns the demo to a known starting state so students can begin a fresh comparison.
- `Run simulation` is the main action that computes, compares, or generates the next result from the current inputs.
- `Export JSON` saves the current result so learners can document evidence or compare scenarios later.
- `Export CSV` saves the current result so learners can document evidence or compare scenarios later.

## Outputs

- `3. Simulation output` should be read as evidence for the decision, not just a display element. Ask what high, low, or changing values imply.
- `4. Statistical summary` should be read as evidence for the decision, not just a display element. Ask what high, low, or changing values imply.

## What To Notice

- Look for the acquisition price, five-year free-cash-flow path, terminal value, WACC, and NPV distribution
- Observe how growth volatility, margin volatility, WACC, and terminal growth widen or tighten the valuation range
- Note that a high mean valuation can still be risky; students should compare mean NPV with downside probability and P10/P90
- Compare the headline output with supporting views such as 3. Simulation output, 4. Statistical summary before drawing a conclusion

## Related Demos or Course Context

- Course path: [AI/ML Workflows](../../courses/ai-ml-workflows.html)
- Related demo: [AB Testing Framework](../ABTestingFramework/about.html)
- Related demo: [AI Cost Benefit Analyzer](../AICostBenefitAnalyzer/about.html)
- Related demo: [AI Data Analyzer](../AIDataAnalyzer/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
