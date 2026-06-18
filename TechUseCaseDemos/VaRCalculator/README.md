# VaR Calculator

## Learning Objectives
- Understand Value at Risk (VaR) concept
- Compare parametric vs historical simulation methods
- Learn Expected Shortfall (CVaR)
- Explore time scaling of risk

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

## Use Cases
- **Banking**: Regulatory capital requirements
- **Asset Management**: Portfolio risk limits
- **Insurance**: Reserve calculations
- **Risk Management**: Daily risk monitoring

## Attribution
KateelLearningDemos - vinallcontact@gmail.com