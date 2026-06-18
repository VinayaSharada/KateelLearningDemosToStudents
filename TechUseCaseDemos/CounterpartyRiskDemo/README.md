# Counterparty Risk Calculator

## Learning Objectives
- Understand Credit Valuation Adjustment (CVA)
- Learn Debt Valuation Adjustment (DVA)
- Calculate expected exposure and loss given default
- Apply counterparty risk to trade valuation

## Theory Behind This Demo

### Credit Valuation Adjustment (CVA)
The **mark-to-market adjustment** for counterparty default risk. It represents the expected loss from counterparty default.

**Formula:**
```
CVA = EE × PD × LGD
```

Where:
- **EE**: Expected Exposure (average exposure over option's life)
- **PD**: Probability of Default
- **LGD**: Loss Given Default (1 - Recovery Rate)

### Debt Valuation Adjustment (DVA)
The **accounting adjustment** for own credit risk. Increases liability value when own credit deteriorates.

### Key Concepts
- **Expected Exposure**: Average positive exposure over time
- **Potential Future Exposure**: Maximum likely exposure
- **Terminal Exposure**: Exposure at maturity

## How to Run
1. Open `index.html` in a browser
2. Adjust notional amount and exposure factor
3. Set probability of default and LGD
4. See CVA and adjusted value calculations

## Learning Outcomes

| Concept | What You'll Understand |
|---------|------------------------|
| CVA | How counterparty risk affects trade value |
| DVA | Own credit risk accounting treatment |
| Exposure | Relationship between notional and exposure |
| PD/LGD | Components of expected loss |

## Use Cases
- **Banks**: Derivative counterparty risk management
- **Hedge Funds**: Trading book risk assessment
- **Regulatory**: Basel III CVA capital requirements
- **Valuation**: Fair value adjustments

## Attribution
KateelLearningDemos - vinallcontact@gmail.com