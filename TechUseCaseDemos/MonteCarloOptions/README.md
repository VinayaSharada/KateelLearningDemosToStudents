# Monte Carlo Options Pricer

## Learning Objectives
- Understand Monte Carlo simulation for option pricing
- Learn how random sampling prices options
- Explore convergence with increasing paths
- Compare with analytical Black-Scholes

## Theory Behind This Demo

### Monte Carlo Method
Based on the **Law of Large Numbers** - as sample size increases, the sample mean converges to the expected value.

**Mathematical Foundation:**
```
C = e^(-rT) × E[max(S_T - K, 0)]
  ≈ e^(-rT) × (1/N) × Σ max(S_T^i - K, 0)
```

**Key Concepts:**
- **Geometric Brownian Motion**: dS = μSdt + σSdW
- **Risk-neutral valuation**: Discount at risk-free rate
- **Variance reduction**: Antithetic variates, control variates

### Convergence Properties
- Standard error ~ 1/√N
- Doubling paths only improves accuracy by ~40%
- Confidence intervals narrow with √N

## How to Run
1. Open `index.html` in a browser
2. Adjust market parameters (spot, volatility, rate)
3. Set simulation parameters (time, strike, paths)
4. Watch prices converge as paths increase

## Key Concepts

### Monte Carlo Method
1. Generate random stock price paths using Geometric Brownian Motion
2. Calculate payoffs at expiration for each path
3. Average discounted payoffs

### Convergence
- More paths = lower standard error
- Standard error ~ 1/√N
- Doubling paths only improves accuracy by ~40%

## Learning Outcomes

| Concept | What You'll Understand |
|---------|------------------------|
| Simulation | How random sampling prices derivatives |
| Convergence | Trade-off between accuracy and computation |
| Variance | Why more paths don't proportionally help |
| Exotics | When MC is preferred over analytical methods |

## Use Cases
- **Complex Options**: Exotic options without closed-form solutions
- **Multi-Asset Options**: Correlation between assets
- **American Options**: Early exercise features
- **Credit Derivatives**: Default modeling

## Attribution
KateelLearningDemos - vinallcontact@gmail.com