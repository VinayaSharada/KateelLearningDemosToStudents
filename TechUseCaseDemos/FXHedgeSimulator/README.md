# FX Hedge Simulator

## Overview
Interactive FX hedging strategy simulator with options pricing for treasury professionals and finance students.

## Learning Objectives
- Understand forward contract pricing and hedging strategies
- Learn Black-Scholes option pricing for currency options
- Analyze currency correlation and its impact on hedging
- Evaluate hedge effectiveness and risk mitigation

## Features
- **Forward Contract Calculator**: Price forward contracts for currency exposure
- **Option Pricing**: Black-Scholes model for currency options
- **Currency Correlation Analysis**: Visualize relationships between major currencies
- **Hedge Effectiveness Dashboard**: Measure risk reduction from hedging

## How to Run
1. Open `index.html` in a browser
2. Enter currency exposure details
3. Select hedging strategy (forward vs options)
4. View hedge effectiveness metrics

## Key Formulas

### Forward Contract Pricing
```
Forward Rate = Spot Rate × (1 + r_domestic) / (1 + r_foreign)
```

### Black-Scholes Call
```
C = S × N(d1) - K × e^(-rT) × N(d2)
d1 = (ln(S/K) + (r + σ²/2)T) / (σ√T)
```

## Attribution
This demo is part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) by Professor Vinaya Sathyanarayana.

**Attribution Email:** vinallcontact@gmail.com

---
*Educational Use Only - For usage guidelines, see the main repository.*