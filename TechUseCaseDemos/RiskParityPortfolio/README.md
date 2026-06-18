# Risk Parity Portfolio

## Learning Objectives
- Understand risk parity vs equal weighting
- Learn how to equalize risk contribution
- Explore volatility weighting
- Compare with traditional 60/40 portfolio

## Theory Behind This Demo

### Risk Parity
A portfolio construction approach that **equalizes risk contribution** from each asset rather than equal weight.

**Mathematical Foundation:**
```
Weight_i = (σ_i)^(-1) / Σ_j (σ_j)^(-1)
```

**Risk Contribution:**
Each asset contributes: `Weight_i × σ_i / Portfolio_Vol`

### Key Concepts
- **Risk Budgeting**: Allocating risk equally across assets
- **Volatility Weighting**: Lower vol = higher weight
- **Leverage**: Often requires leverage vs unlevered equal weight

## How to Run
1. Open `index.html` in a browser
2. Adjust asset volatilities
3. See how weights change to equalize risk
4. Observe risk contribution per asset

## Key Concepts

### Risk Parity Formula
```
Weight_i = (σ_i)^(-1) / Σ_j (σ_j)^(-1)
```

### Risk Contribution
Each asset contributes: `Weight_i × σ_i / Portfolio_Vol`

### Why Risk Parity?
- Equal weighting ignores volatility differences
- Risk parity gives higher weights to lower-volatility assets
- Often more stable than 60/40 portfolios

## Learning Outcomes

| Concept | What You'll Understand |
|---------|------------------------|
| Risk Budgeting | How to allocate risk equally |
| Volatility Impact | Why low-vol assets get high weights |
| Portfolio Stability | Risk parity vs traditional allocation |
| Leverage Needs | Why risk parity often requires leverage |

## Use Cases
- **Pension Funds**: Long-term stability
- **Insurance**: Matching asset risk profiles
- **Multi-Asset Strategies**: Balanced portfolios
- **Risk Management**: Understanding contribution

## Attribution
KateelLearningDemos - vinallcontact@gmail.com