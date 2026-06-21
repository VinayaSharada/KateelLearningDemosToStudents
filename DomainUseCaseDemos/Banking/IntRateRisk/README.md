# Interest Rate Risk Management

## Overview

This demo now supports three modes:

- `Browser`: instant classroom exploration with no Python setup
- `Colab`: notebook-based analysis using Python and charts
- `Local`: script-based execution for editing and extension

The learning goal is the same across modes: help students understand how account mix, interest-rate levels, and rate shocks change annual interest cost and exposure concentration.

## Files

- `index.html`: browser variant
- `about.html`: teaching guide and mode guidance
- `colab_demo.ipynb`: Colab-ready notebook variant
- `generate_synthetic_data.py`: local synthetic data generator
- `interest_rate_risk_management.py`: local analysis script
- `generate_synthetic_data.ipynb`: existing notebook asset
- `interest_rate_risk_management.ipynb`: existing notebook asset
- `requirements.txt`: local Python dependencies

## Recommended Mode

- Use `Browser` for short classes and fast what-if testing.
- Use `Colab` when students should see Python, pandas, and chart code.
- Use `Local` when students need to modify the generator or analysis logic.

## Browser Mode

Open `index.html`.

Students can:

- choose portfolio size and account count
- change the deposit mix
- apply a rate shock in basis points
- see exposure by account type
- compare current vs post-shock annual interest cost
- export the browser-generated synthetic portfolio as CSV

## Colab Mode

Open `colab_demo.ipynb` in Google Colab.

The notebook includes:

- lightweight package install
- synthetic data generation
- exposure-by-account-type analysis
- weighted-rate and shock calculations
- matplotlib charts

## Local Mode

### 1. Install dependencies

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Generate synthetic data

```powershell
python generate_synthetic_data.py
```

### 3. Run analysis

```powershell
python interest_rate_risk_management.py
```

## What Students Learn

- how portfolio mix changes interest-rate exposure
- why fixed deposits usually dominate repricing cost
- how a rate shock changes annual interest payment
- why grouped exposure and weighted-rate views both matter

## Suggested Extensions

- compare positive and negative rate shocks
- model separate asset and liability repricing
- add duration buckets or maturity ladders
- introduce hedging or repricing strategies
