# AI Hedge Orchestrator

## Overview

Interactive treasury orchestration demo where students compare hedge choices under changing market conditions, review AI guidance, and inspect how hedge ratios, coverage, and residual risk shift across the exposure book.

## Learning Objectives

- Explain the main treasury decision that AI Hedge Orchestrator is designed to support.
- Use Market condition, AI guidance to test how different assumptions change the scenario.
- Interpret optimization Summary in plain language and connect them to an action or conclusion.
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
3. Change one or two inputs, then use `Optimize Hedge Ratios`.
4. Read optimization Summary first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Market condition` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `AI guidance` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Optimize Hedge Ratios` is the main action that computes, compares, or generates the next result from the current inputs.
- `Export Results` saves the current result so learners can document evidence or compare scenarios later.
- `Reset Demo` returns the demo to a known starting state so students can begin a fresh comparison.

## Outputs

- `Hedge Recommendations` are the primary result because they connect each exposure slice to a hedge choice and ratio.
- `Coverage and Decision Trace` explains how much risk is covered, what remains unhedged, and how the recommendation was reached.
- `Optimization Summary` gives the top-line before students drill into the detailed exposure book and recommendation logic.

## What To Notice

- A lower residual risk can still come with higher cost, so students should discuss trade-off rather than assume one best answer
- Compare AI guidance with the market-condition setting to see whether the recommendation becomes more conservative or more opportunistic
- Use the decision trace to explain the recommendation, not just to report the final hedge ratio

## What you can enhance on your own

- Add more exposure classes, hedge instruments, and cost assumptions for a fuller treasury book.
- Add side-by-side comparison of policy-driven hedging versus AI-guided hedging.
- Add approval thresholds, governance notes, and exportable hedge-decision records.
- Add stress scenarios for liquidity pressure, basis risk, or hedge-accounting constraints.

## How to adapt this demo to your use case

- Replace the sample exposures and market regimes with the currencies, commodities, and policy limits relevant to your organization.
- Decide whether the main objective is lower residual risk, lower hedge cost, smoother earnings, or higher policy compliance.
- Keep the AI narrative advisory until treasury owners confirm the strategy, limits, and accounting implications.
- Use the same orchestrator across treasury, risk, FP&A, and classroom settings by changing the decision lens around the shared hedge engine.

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [CCC Analyzer](../CCCAnalyzer/about.html)
- Related demo: [Collections Predictor](../CollectionsPredictor/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`

## Business decision

Use this demo to make the central decision in AI Hedge Orchestrator explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.
