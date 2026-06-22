# Stablecoin Manager

## Overview

Interactive stablecoin treasury demo where learners rebalance lending, DEX liquidity, and cash reserves to see how yield, redemption readiness, and peg resilience move together under different allocation profiles.

## Learning Objectives

- Explain the main treasury decision that Stablecoin Manager is designed to support.
- Use Allocation profile, Enable AI commentary to test how different assumptions change the scenario.
- Interpret the result in plain language, not just as a number, chart, or AI recommendation.
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
3. Change one or two inputs, then use `Reset Mix`.
4. Read the output first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Allocation profile` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Enable AI commentary` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Lending allocation` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `DEX liquidity allocation` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Cash reserve allocation` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Reset Mix` returns the demo to a known starting state so students can begin a fresh comparison.
- `Export Snapshot` saves the current result so learners can document evidence or compare scenarios later.

## Outputs

- The key outputs are reserve strength, deployment mix, and any commentary on peg stability or redemption pressure.
- Students should ask whether the higher-yield allocation leaves enough liquidity for redemptions and confidence under stress.

## What To Notice

- More deployment into lending or DEX liquidity may improve yield while weakening near-term redemption flexibility
- Use the allocation profile to compare a conservative treasury posture with a more aggressive yield-seeking posture
- Talk through the governance question: who should approve a riskier reserve mix and under what trigger?

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [AI Hedge Orchestrator](../AIHedgeOrchestrator/about.html)
- Related demo: [CCC Analyzer](../CCCAnalyzer/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
