# Mesa Liquidity Data Generator

## Overview

This folder contains a synthetic financial transaction data generator intended for agent-based or simulation-style liquidity management exercises. It is a useful foundation when students want richer banking datasets with customers, accounts, balances, transactions, and liquidity-oriented attributes.

The generator is especially suitable for experimentation, simulation backlogs, and future extensions using Mesa or other agent-based modeling tools.

## Files in This Folder

- `data_generator.py` creates synthetic banking customers, accounts, and transactions for liquidity-oriented analysis (CLI/Python)
- `index.html` browser-based interactive demo for generating and visualizing synthetic banking data
- `about.html` learning guide with concepts, outcomes, and classroom activities
- `app.js` client-side JavaScript for data generation and Monte Carlo simulation

## What This Folder Is Best For

- creating richer synthetic BFSI datasets
- supporting future liquidity simulation work
- classroom experiments around customer segments, balances, channels, and transaction behavior

## How To Run

**CLI (Python):**
```powershell
python data_generator.py --help
python data_generator.py --customers 1000 --transactions 10000
```

**Browser Demo:**
- Open `index.html` directly in a modern browser
- Adjust controls for customer count, transaction count, and seed
- Click "Generate Data" to create synthetic banking data
- Toggle "AI Insights" for automated risk analysis
- Use "Run Monte Carlo Forecast" for liquidity projections

Start with a small dataset first, then scale up after verifying the output structure.

## Suggested Uses In The Course

- payments and transaction flow simulations
- liquidity and treasury case discussions
- operational risk and monitoring exercises
- data engineering practice before modeling

## Implemented Features

- ✅ Browser-based interactive visualization demo (`index.html`, `app.js`)
- ✅ AI toggle for liquidity risk insights
- ✅ Monte Carlo simulation for cash flow forecasting
- ✅ CSV export functionality
- ✅ Doughnut and bar charts for segment/risk distribution
- ✅ Tabbed interface for viewing customers, accounts, transactions, metrics

## Suggested Next Improvements

- Add sample output file with schema documentation
- Add Mesa agent-based simulation example that consumes this generated data
- Add pytest tests for the Monte Carlo and data generation functions
