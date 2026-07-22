# High-Frequency Trading (HFT) Demo

**Repository:** [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents)
**Author:** Professor Vinaya Sathyanarayana
**Section:** `TechUseCaseDemos/HFT/`

An educational simulation of high-frequency trading strategies on synthetic tick data,
covering momentum and mean-reversion signals, transaction cost modelling, and
performance metrics — without any real market connectivity.

---

## What This Demo Does

| Component | Detail |
|-----------|--------|
| Data | 5,000 synthetic tick prices (random walk, 1-min bars) |
| Momentum signal | Short MA (5) vs Long MA (20) crossover |
| Mean-reversion signal | Z-score of price vs rolling mean; entry at ±1σ |
| Transaction costs | Configurable basis-points per side (default 5 bps) |
| Performance metrics | P&L curve, Sharpe ratio, maximum drawdown |

---

## Files

| File | Purpose |
|------|---------|
| `hft_demo.py` | Full demo — data generation, signals, backtest, metrics |
| `requirements.txt` | Python dependencies |

---

## Setup & Run

```bash
cd TechUseCaseDemos/HFT
pip install -r requirements.txt
python hft_demo.py
```

---

## Key Concepts Illustrated

- **Market microstructure** — tick price simulation as a random walk with drift
- **Signal generation** — how simple technical indicators create trading signals
- **Transaction cost drag** — how 5 bps per side erodes strategy returns at high frequency
- **Sharpe ratio** — risk-adjusted return comparison between strategies
- **Max drawdown** — peak-to-trough loss as a risk measure

---

## Student Extensions

1. Increase transaction costs to 20 bps and observe how the momentum strategy degrades.
2. Add a **limit order book** simulation with bid-ask spread.
3. Compare the Sharpe ratio of momentum vs mean-reversion over different market regimes (trending vs ranging).
4. Implement a **volatility filter** — only trade when rolling volatility is below a threshold.
5. Connect to `DomainUseCaseDemos/WealthMgmt/NIFTYOpt` to apply HFT signals on real NIFTY 50 data.

---

## Attribution

If you use this demo in a course or project, see [ATTRIBUTION.md](../../ATTRIBUTION.md).

## Business decision

Use this demo to make the central decision in High-Frequency Trading (HFT) Demo explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
