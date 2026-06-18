# Black-Scholes Option Pricer

## Learning Objectives
- Understand the Black-Scholes model for European options
- Learn how volatility affects option pricing
- Explore the Greeks (Delta, Gamma)
- Understand risk-neutral valuation

## Theory Behind This Demo

### Black-Scholes-Merton Model
Developed in 1973 by Fischer Black, Myron Scholes, and Robert Merton. Based on **stochastic calculus** and **risk-neutral valuation**.

**Key Assumptions:**
- European-style options (exercisable only at expiration)
- Constant volatility and interest rates
- Log-normal distribution of underlying prices
- No dividends during option life
- Frictionless markets (no transaction costs)

**Formula:**
```
C = S·N(d₁) - K·e^(-rT)·N(d₂)
d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)
d₂ = d₁ - σ√T
```

### The Greeks
**Delta (Δ)**: Rate of change of option price w.r.t. underlying price  
**Gamma (Γ)**: Rate of change of delta w.r.t. underlying price  
**Vega (ν)**: Rate of change of option price w.r.t. volatility  
**Theta (Θ)**: Rate of change of option price w.r.t. time

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

## Learning Outcomes

| Concept | What You'll Understand |
|---------|------------------------|
| Option Pricing | How intrinsic value + time value combine |
| Volatility Impact | Why OTM options are more sensitive to vol |
| Time Decay | Why options lose value as expiration approaches |
| Hedging | How Greeks guide delta-neutral positions |

## Use Cases
- **Trading**: Price options for arbitrage
- **Risk Management**: Calculate hedging ratios (Greeks)
- **Valuation**: Price employee stock options
- **Education**: Teach derivatives pricing

## Attribution
KateelLearningDemos - vinallcontact@gmail.com