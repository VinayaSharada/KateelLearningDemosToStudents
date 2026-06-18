# Options Pricing Calculator

## Learning Objectives
- Understand the Black-Scholes model for European options
- Learn how volatility affects option pricing
- Explore the Greeks (Delta, Gamma, Vega)
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

## How to Run
1. Open `index.html` in a browser
2. Adjust spot price, strike price, and volatility
3. See call and put prices update in real-time
4. Observe how Greeks change with parameters

## Key Concepts
- Black-Scholes Formula
- Option sensitivity measures
- Delta hedging
- Volatility impact

## Attribution
KateelLearningDemos - vinallcontact@gmail.com