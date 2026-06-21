# Liquidity Management

## Overview

This demo now supports two practical modes:

- `Colab`: notebook-based teaching and analytics
- `Local`: script-based execution for full control

A browser version is possible later, but the current simulation-heavy workflow is best served by Colab or local Python so students can see the real compute path clearly.

## Files

- `index.html`: launch page with mode guidance
- `about.html`: teaching guide
- `colab_demo.ipynb`: Colab-ready notebook variant
- `generate_synthetic_liquidity_data.py`: local transaction generator
- `liquidity_monte_carlo_simulation.py`: local simulation and reporting script
- `generate_synthetic_liquidity_data.ipynb`: existing notebook asset
- `liquidity_monte_carlo_simulation.ipynb`: existing notebook asset
- `requirements.txt`: local dependencies

## Recommended Mode

- Use `Colab` when students should run the workflow with minimal setup.
- Use `Local` when students need to inspect or extend the scripts directly.

## Colab Mode

Open `colab_demo.ipynb` in Google Colab.

The notebook includes:

- lightweight package install
- synthetic transaction generation
- daily net-flow aggregation
- Monte Carlo liquidity forecasting
- risk metrics like mean outcome, VaR, and shortfall probability
- classroom-friendly charts

## Local Mode

### 1. Install dependencies

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Generate synthetic data

```powershell
python generate_synthetic_liquidity_data.py
```

### 3. Run the simulation

```powershell
python liquidity_monte_carlo_simulation.py
```

## What Students Learn

- how inflow and outflow timing affects liquidity
- why volatility matters in addition to averages
- how Monte Carlo forecasts create a distribution of outcomes
- how treasury-style liquidity metrics support decision-making

## Suggested Extensions

- compare baseline and stressed flow distributions
- add minimum-liquidity thresholds and alerts
- change forecast horizon and simulation count
- add funding-cost or buffer-policy assumptions
