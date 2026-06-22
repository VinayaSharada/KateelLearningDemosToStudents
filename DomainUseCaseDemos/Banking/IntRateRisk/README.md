# Interest Rate Risk

## Overview

Interest-rate risk lab where students build a synthetic deposit portfolio, apply a rate shock, and compare repricing cost and exposure concentration across savings, current, fixed, and recurring deposits.

## Learning Objectives

- Explain the main banking decision that Interest Rate Risk is designed to support.
- Use Synthetic accounts, Total portfolio size (INR crore) to test how different assumptions change the scenario.
- Interpret account Type Table, ai Insight in plain language and connect them to an action or conclusion.
- State one limitation, risk, or governance consideration before using the result in a real decision.

## Run Modes

- Browser
- Colab
- Local

## Expected Setup / Startup Time

- Browser mode is fastest to start. Colab and Local modes may spend extra time installing packages or opening notebooks.

## Demo Type

- Multi-mode demo

## Files in This Folder

- `app.js`
- `colab_demo.ipynb`
- `generate_synthetic_data.ipynb`
- `generate_synthetic_data.py`
- `index.html`
- `interest_rate_risk_management.ipynb`
- `interest_rate_risk_management.py`
- `README.md`
- `requirements.txt`
- `setup_venv.bat`
- `setup_venv.sh`
- `style.css`
- `syntheticdata.csv`

## How To Run

- Browser: open `index.html`.
- Colab: open `colab_demo.ipynb` in Google Colab and run the cells in order.
- Local: run the Python assets in this folder.
  Install dependencies first with `pip install -r requirements.txt`.

## How To Use The Demo

1. Choose the run mode that fits the class: Browser, Colab, Local.
2. Review the default assumptions before changing anything.
3. Change one or two inputs, then use `Build Portfolio`.
4. Read account Type Table first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Synthetic accounts` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Total portfolio size (INR crore)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Rate shock (basis points)` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Enable AI-style interpretation` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Savings` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Current` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Fixed Deposit` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Recurring Deposit` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Build Portfolio` is the main action that computes, compares, or generates the next result from the current inputs.
- `Export CSV` saves the current result so learners can document evidence or compare scenarios later.
- `Reset Inputs` returns the demo to a known starting state so students can begin a fresh comparison.

## Outputs

- The most important outputs are the post-shock annual interest cost, the exposure mix by account type, and any AI-style interpretation of repricing pressure.
- Students should compare current versus shocked cost rather than read either number in isolation.

## What To Notice

- Look for the main decision, data input, and output the demo is designed to explain
- Observe how changing one assumption changes the result or recommendation
- Note the limitation students should mention before applying the result in a real decision
- Compare the headline output with supporting views such as account Type Table, ai Insight before drawing a conclusion

## Related Demos or Course Context

- Course path: [Banking & Finance](../../../courses/banking.html)
- Related demo: [Liquidity Management](../LiquidityMgmt/about.html)
- Related demo: [Loan Default Predictor](../LoanDefaultPredictor/about.html)
- Related demo: [Mesa Liquidity Data Generator](../MesaLiquidity/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
