# FX Hedge Simulator

## Overview

Browser-based hands-on exercise for FX Risk & Hedging (Session 2).

## Learning Objectives

- Explain the main treasury decision that FX Hedge Simulator is designed to support.
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

- Look for currency exposure, hedge choice, spot rate movement, and hedge outcome
- Observe how forwards, options, or natural hedges behave under different FX scenarios
- Note that hedge effectiveness should be judged against the original risk objective

## What you can enhance on your own

- Add more currencies, time buckets, and hedge instruments such as layered forwards or collars.
- Add explicit cost-versus-protection charts and side-by-side strategy exports.
- Add policy limits, hedge-accounting notes, and liquidity implications for each instrument.
- Add scenario modes for tariff shock, commodity-linked FX, or emerging-market stress.

## How to adapt this demo to your use case

- Replace the sample FX exposure and market assumptions with your own currencies, tenors, and policy constraints.
- Decide whether your organization optimizes for earnings stability, budget certainty, cash-flow protection, or downside insurance.
- Keep the simulator educational until treasury owners confirm the instrument suitability, accounting treatment, and liquidity impact.
- Use the same demo across treasury, risk, FP&A, and faculty contexts by changing the teaching question rather than the hedge engine.

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [AI Hedge Orchestrator](../AIHedgeOrchestrator/about.html)
- Related demo: [CCC Analyzer](../CCCAnalyzer/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
