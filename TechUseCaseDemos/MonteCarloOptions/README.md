# Monte Carlo Options Pricer

## Learning Objectives
- Understand Monte Carlo simulation for option pricing
- Learn how random sampling prices options
- Explore convergence with increasing paths
- Compare with analytical Black-Scholes

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

## Use Cases
- **Complex Options**: Exotic options without closed-form solutions
- **Multi-Asset Options**: Correlation between assets
- **American Options**: Early exercise features
- **Credit Derivatives**: Default modeling

## Attribution
KateelLearningDemos - vinallcontact@gmail.com