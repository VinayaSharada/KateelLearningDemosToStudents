# Liquidity Management

## Overview

Launch guide for the liquidity management teaching workflow. Students review the scenario framing in browser, then run the actual compute-heavy analysis in Colab or local Python where the Monte Carlo and reporting steps are visible.

## Learning Objectives

- Explain the main banking decision that Liquidity Management is designed to support.
- Change input assumptions and predict how the output should respond before running the demo.
- Interpret the result in plain language, not just as a number, chart, or AI recommendation.
- State one limitation, risk, or governance consideration before using the result in a real decision.

## Run Modes

- Colab
- Local

## Expected Setup / Startup Time

- The browser page opens immediately, but the actual analysis runs in Colab or Local Python and may take noticeable time because the simulation is intentionally compute-heavy.

## Demo Type

- Launch guide for Colab and Local analysis

## Files in This Folder

- `about.html`
- `colab_demo.ipynb`
- `generate_synthetic_liquidity_data.ipynb`
- `generate_synthetic_liquidity_data.py`
- `index.html`
- `liquidity_analysis_report.txt`
- `liquidity_monte_carlo_analysis.png`
- `liquidity_monte_carlo_simulation.ipynb`
- `liquidity_monte_carlo_simulation.py`
- `README.md`
- `requirements.txt`
- `setup_env.sh`
- `synthetic_liquidity_data.csv`

## How To Run

- Colab: open `colab_demo.ipynb` in Google Colab and run the cells in order.
- Local: run the Python assets in this folder.
  Install dependencies first with `pip install -r requirements.txt`.

## How To Use The Demo

1. Choose the run mode that fits the class: Colab, Local.
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

- Use this page to set expectations, then move students into Colab or Local for the real analysis workflow
- Focus on how the liquidity position changes when assumptions around inflows, outflows, or timing are stressed
- Ask students which metric would trigger action now versus which one is more useful for trend monitoring

## Related Demos or Course Context

- Course path: [Banking & Finance](../../../courses/banking.html)
- Related demo: [Interest Rate Risk](../IntRateRisk/about.html)
- Related demo: [Loan Default Predictor](../LoanDefaultPredictor/about.html)
- Related demo: [Mesa Liquidity Data Generator](../MesaLiquidity/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
