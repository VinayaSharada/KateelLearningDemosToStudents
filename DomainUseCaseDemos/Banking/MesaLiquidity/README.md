# Mesa Liquidity Data Generator

## Overview

Browser-first liquidity lab where students generate synthetic bank data, inspect customer and account structure, then run a Monte Carlo liquidity forecast to see how uncertainty changes funding pressure and expected buffers.

## Learning Objectives

- Explain how customer balances, account mix, and transaction behavior feed into a bank liquidity view.
- Generate synthetic data first, then compare the static liquidity snapshot with the Monte Carlo forecast.
- Interpret the most likely liquidity path, risk buckets, and AI-style coaching as decision support for treasury action.
- Discuss why simulation output is still only a model and should be checked against policy limits and stress assumptions.

## Run Modes

- Browser
- Local

## Expected Setup / Startup Time

- Expect local setup time for Python dependencies before the first run, then faster repeat execution.

## Demo Type

- Multi-mode demo

## Files in This Folder

- `about.html`
- `app.js`
- `data_generator.py`
- `index.html`
- `README.md`
- `requirements.txt`

## How To Run

- Browser: open `index.html`.
- Local: run the Python assets in this folder.
  Install dependencies first with `pip install -r requirements.txt`.

## How To Use The Demo

1. Choose the run mode that fits the class: Browser, Local.
2. Review the default assumptions before changing anything.
3. Change one or two inputs, then use `Generate Data`.
4. Read Monte Carlo Simulation first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Enable AI-style insights` adds classroom-friendly commentary on the generated liquidity picture and forecast output.
- Use the generated customer, account, and transaction views as the base dataset before discussing the forecast result.

## Buttons / Actions

- `Generate Data` creates the synthetic banking dataset that the later tabs and metrics depend on.
- `Run Monte Carlo Simulation` projects many future liquidity paths so students can see uncertainty rather than a single deterministic answer.
- `Export CSV` downloads the synthetic dataset for spreadsheet or Python follow-up work.
- `Reset` returns the demo to a clean teaching state.
- The `Overview`, `Customers`, `Accounts`, and `Transactions` tabs help students move from raw data to liquidity interpretation.

## Outputs

- `Liquidity metrics` summarize the current synthetic balance-sheet position before stress is introduced.
- `Monte Carlo Simulation` shows the forecast distribution, progress, and most likely liquidity outcome under repeated simulated paths.
- `Liquidity coaching` translates the numbers into a treasury-style explanation of buffer strength and potential pressure points.

## What To Notice

- Compare the current liquidity snapshot with the simulated future distribution instead of treating them as the same thing
- Watch how the most likely value can still sit beside a wider risk range that matters for funding and escalation decisions
- Use the customer, account, and transaction tabs to explain why the forecast behaves the way it does

## Related Demos or Course Context

- Course path: [Banking & Finance](../../../courses/banking.html)
- Related demo: [Interest Rate Risk](../IntRateRisk/about.html)
- Related demo: [Liquidity Management](../LiquidityMgmt/about.html)
- Related demo: [Loan Default Predictor](../LoanDefaultPredictor/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
