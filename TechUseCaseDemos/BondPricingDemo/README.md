# Bond Pricing Calculator

## Learning Objectives
- Understand bond pricing using present value of future cash flows
- Learn yield to maturity (YTM) calculations
- Explore bond duration and interest rate sensitivity
- Compare premium/discount bonds to par bonds

## Theory Behind This Demo

### Bond Pricing
A bond's price is the **present value** of all future cash flows discounted at the yield to maturity.

**Formula:**
```
P = Σ C/(1+y)^t + F/(1+y)^T
```

Where:
- **C**: Coupon payment per period
- **F**: Face value (redemption at maturity)
- **y**: Yield per period
- **T**: Number of periods
- **t**: Time period (1 to T)

### Duration (Macaulay)
Measures **interest rate sensitivity** - the weighted average time to receive cash flows.

```
D = Σ t × PV(CF_t) / P
```

### Key Concepts
- **At Par**: Price = Face when Coupon = YTM
- **Premium**: Price > Face when Coupon > YTM
- **Discount**: Price < Face when Coupon < YTM
- **Duration**: Higher duration = higher interest rate risk

## How to Run
1. Open `index.html` in a browser
2. Adjust face value, coupon rate, and years to maturity
3. Set yield to maturity and payment frequency
4. See bond price, duration, and par/yield relationship

## Learning Outcomes

| Concept | What You'll Understand |
|---------|------------------------|
| Bond Price | How coupon, yield, and time affect price |
| Duration | Interest rate risk measurement |
| Yield | Required return vs coupon relationship |
| Premium/Discount | Why bonds trade above/below face value |

## Use Cases
- **Fixed Income Trading**: Price bonds and calculate yields
- **Portfolio Management**: Assess interest rate risk
- **Risk Management**: Duration hedging strategies
- **Valuation**: Bond investment analysis

## Attribution
KateelLearningDemos - vinallcontact@gmail.com