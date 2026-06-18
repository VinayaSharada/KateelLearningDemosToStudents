# VaR Calculator

## Learning Objectives
- Understand Value at Risk (VaR) concept
- Compare parametric vs historical simulation methods
- Learn Expected Shortfall (CVaR)
- Explore time scaling of risk

## Theory Behind This Demo

### Value at Risk (VaR)
A **statistical risk measure** that estimates the maximum potential loss at a given confidence level over a specified time horizon.

**Key Concepts:**
- **Confidence Level**: Probability that loss exceeds VaR (e.g., 95%, 99%)
- **Time Horizon**: Period over which risk is measured (1 day, 10 days, 1 year)
- **Parametric Method**: Assumes normal distribution of returns
- **Historical Simulation**: Uses actual historical returns

### Expected Shortfall (CVaR)
Also called Conditional VaR - the **average loss beyond the VaR threshold**. A coherent risk measure that addresses VaR's limitation of not indicating severity beyond the threshold.

### Time Scaling
Based on the **square-root-of-time rule**: Risk scales with √T. This assumes independent, identically distributed returns.

## How to Run
1. Open `index.html` in a browser
2. Set portfolio value and volatility
3. Select confidence level and time horizon
4. Compare parametric and historical VaR

## Key Concepts

### Parametric VaR
```
VaR = Portfolio_Value × σ × Z × √T
```
Where Z is the quantile of standard normal distribution.

### Expected Shortfall (CVaR)
Average loss beyond the VaR threshold. Also called Conditional VaR.

### Time Scaling
Risk scales with square root of time: VaR(T) = VaR(1) × √T

## Learning Outcomes

| Concept | What You'll Understand |
|---------|------------------------|
| VaR Interpretation | Maximum loss at given confidence level |
| Method Comparison | When to use parametric vs historical |
| ES Importance | Why coherent risk measures matter |
| Time Scaling | How risk grows over time |

## Use Cases
- **Banking**: Regulatory capital requirements
- **Asset Management**: Portfolio risk limits
- **Insurance**: Reserve calculations
- **Risk Management**: Daily risk monitoring

## Attribution
KateelLearningDemos - vinallcontact@gmail.com