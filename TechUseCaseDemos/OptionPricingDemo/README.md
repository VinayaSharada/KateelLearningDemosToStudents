# Black-Scholes Option Pricer

## Learning Objectives
- Understand the Black-Scholes model for European options
- Learn how volatility affects option pricing
- Explore the Greeks (Delta, Gamma)
- Understand risk-neutral valuation

## How to Run
1. Open `index.html` in a browser
2. Adjust spot price, strike price, and volatility
3. See call and put prices update in real-time
4. Observe how Greeks change with parameters

## Key Concepts

### Black-Scholes Formula
```
C = S·N(d₁) - K·e^(-rT)·N(d₂)
d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)
d₂ = d₁ - σ√T
```

### Key Parameters
- **Spot Price (S)**: Current underlying price
- **Strike Price (K)**: Exercise price
- **Time (T)**: Time to expiration
- **Rate (r)**: Risk-free interest rate
- **Volatility (σ)**: Annualized volatility

## Use Cases
- **Trading**: Price options for arbitrage
- **Risk Management**: Calculate hedging ratios (Greeks)
- **Valuation**: Price employee stock options
- **Education**: Teach derivatives pricing

## Attribution
KateelLearningDemos - vinallcontact@gmail.com