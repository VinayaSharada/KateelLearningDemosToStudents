# Options Greeks Calculator

## Learning Objectives
- Understand the four main Greeks (Delta, Gamma, Vega, Theta)
- Learn how to hedge option positions
- Explore sensitivity to market factors
- Practice risk management calculations

## Theory Behind This Demo

### Option Greeks
Measures of **option sensitivity** to changes in underlying factors. Derived from the Black-Scholes partial derivatives.

**Mathematical Foundation:**
- **Delta**: ∂Option/∂S (price sensitivity)
- **Gamma**: ∂²Option/∂S² (convexity)
- **Vega**: ∂Option/∂σ (volatility sensitivity)
- **Theta**: ∂Option/∂T (time decay)

### Key Concepts
- **Delta Hedging**: Maintaining neutral price exposure
- **Convexity**: Gamma measures curvature risk
- **Vega Risk**: Volatility exposure management
- **Time Decay**: Theta accelerates as expiration nears

## How to Run
1. Open `index.html` in a browser
2. Adjust option parameters (spot, strike, time, vol, rate)
3. Switch between call and put options
4. Observe how Greeks change with parameters

## Key Concepts

### The Greeks
- **Delta (Δ)**: Price change per $1 underlying move
- **Gamma (Γ)**: Delta's rate of change
- **Vega (ν)**: Price change per 1% vol change
- **Theta (Θ)**: Daily time decay

### Hedging
- **Delta-neutral**: Hedge with underlying or opposite delta options
- **Gamma-hedge**: Add options with negative gamma
- **Vega-hedge**: Adjust for volatility exposure
- **Theta-hedge**: Short options for positive theta

## Learning Outcomes

| Greek | What You'll Understand |
|-------|------------------------|
| Delta | Price sensitivity and directional risk |
| Gamma | Convexity and acceleration risk |
| Vega | Volatility exposure management |
| Theta | Time decay and opportunity cost |

## Use Cases
- **Market Making**: Providing liquidity
- **Risk Management**: Position hedging
- **Options Trading**: Strategy construction
- **Portfolio Insurance**: Dynamic hedging

## Attribution
KateelLearningDemos - vinallcontact@gmail.com