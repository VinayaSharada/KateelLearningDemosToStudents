# Stablecoin Manager

## Overview

Interactive stablecoin treasury demo where learners rebalance lending, DEX liquidity, and cash reserves and watch the weighted portfolio yield respond to the mix.

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
3. Move the lending, DEX, or cash allocation sliders — the yield recalculates immediately.
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

- The key outputs are the weighted portfolio yield (%) and its annual dollar value, computed from the lending/DEX/cash allocation mix and each bucket's base yield.
- Students should ask whether the higher-yield allocation leaves enough in the zero-yield cash reserve for redemptions and confidence under stress.

## What To Notice

- More deployment into lending or DEX liquidity may improve yield while weakening near-term redemption flexibility
- Use the allocation profile to compare a conservative treasury posture with a more aggressive yield-seeking posture
- Talk through the governance question: who should approve a riskier reserve mix and under what trigger?

## What you can enhance on your own

- Add stress scenarios for depeg risk, redemption surge, counterparty concentration, or protocol failure.
- Add a policy minimum for cash reserves and a visible breach warning when the mix becomes too aggressive.
- Add side-by-side profiles for regulated reserve management versus yield-seeking treasury behavior.
- Export the allocation, yield, and reserve-readiness view for workshop or committee discussion.

## How to adapt this demo to your use case

- Replace the sample stablecoin buckets and yields with the reserve instruments or protocols relevant to your context.
- Revalidate who can approve a change in reserve mix and what triggers a forced rebalance.
- Keep the demo focused on treasury trade-offs rather than treating the displayed yield as an investable recommendation.
- Use the same simulator in treasury, risk, digital-assets, or classroom settings by changing the decision lens around the shared allocation logic.

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [AI Hedge Orchestrator](../AIHedgeOrchestrator/about.html)
- Related demo: [CCC Analyzer](../CCCAnalyzer/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`

## Business decision

Use this demo to make the central decision in Stablecoin Manager explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.
