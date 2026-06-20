# Monte Carlo Company Valuation

## Overview

Browser-based Monte Carlo simulation for valuing a company over a five-year forecast horizon. Students can edit revenue growth, margin, tax, working capital, capex, terminal growth, WACC, simulation count, confidence interval, NPV threshold, and value-creation probability controls.

## Learning Objectives

- Explain how Monte Carlo simulation turns uncertain assumptions into a valuation distribution.
- Compare point-estimate DCF valuation with probability-based decision making.
- Interpret mean NPV, median NPV, P10/P90, standard deviation, coefficient of variation, and probability of value creation.
- Recommend whether to proceed, renegotiate, or reject an acquisition using both expected value and downside risk.

## Theory

The demo simulates five-year free cash flows and terminal value:

- Revenue grows stochastically around a mean growth rate and volatility.
- EBITDA margin varies around a mean margin and volatility.
- Free cash flow = EBITDA − Tax − Capex − Incremental working capital.
- Enterprise value = present value of forecast free cash flows + present value of terminal value.
- NPV = enterprise value − acquisition price / initial investment.

The simulator uses browser-only random sampling. No cloud service, LLM API, or API key is required.

## How to Use

1. Start with the Base case scenario.
2. Change business assumptions such as growth, margin, WACC, terminal growth, and acquisition price.
3. Adjust statistical controls: simulations, confidence interval, NPV threshold, and enterprise value threshold.
4. Run the simulation and compare mean NPV with the probability of positive NPV.
5. Export JSON or CSV for a student reflection or classroom exercise.

## Suggested Classroom Prompt

Ask students:

- Is the mean NPV enough to justify the investment?
- What is the probability that NPV exceeds the decision threshold?
- Which assumption creates the most valuation uncertainty?
- Should management proceed, renegotiate the price, or reject the acquisition?

## Attribution

Created by Professor Vinaya Sathyanarayana for KateelLearningDemos.

Attribution Email: vinallcontact@gmail.com
