# During-Pipeline Prompts

Use these **while running N2-N6**, whenever a result surprises you or you're not
sure it makes sense. Paste the relevant notebook output where marked.

All prompts are optional — use them only if stuck or curious.

---

## 1. After N2: Baseline Forecast Interpretation

**When to use:** The baseline forecast looks fine, but you're not sure if "fine" is realistic.

```
I just built a 14-day cash forecast assuming every outstanding invoice pays
on its contractual due date.

[paste baseline forecast summary: starting cash, day-by-day or Day 14 ending
cash, any minimum-cash day]

1. What's risky about the assumption "all invoices pay on time"?
2. What would make this baseline more or less trustworthy?
3. What should I check before I present this number to anyone?
```

---

## 2. After N3: Collections ML Interpretation

**When to use:** The model spits out predictions and feature importances that don't match your intuition.

```
I trained a model to predict how many days late each outstanding invoice will
be paid, using historical payment data.

[paste: accuracy/R², top feature importances, a few example predictions
(invoice amount, customer, predicted days late)]

1. Does this feature importance ranking make business sense, or is something
   likely wrong (e.g. leakage, an odd correlation)?
2. Which of these predictions would you personally double-check before acting
   on them, and why?
3. How should I explain "why the model thinks this" to someone who doesn't
   trust ML?
```

---

## 3. After N4: Revised Forecast Gap Assessment

**When to use:** You now have a gap between baseline and realistic forecast and need to judge how serious it is.

```
My baseline (optimistic) forecast and my revised (ML-informed) forecast now
disagree.

[paste: baseline Day 14 cash, revised Day 14 cash, the gap in $ and days
until the gap becomes a problem, minimum comfortable cash threshold]

1. Is this gap material, or within a normal range of forecast noise?
2. What's the actual urgency here — days, weeks?
3. What's the single most important number I should lead with if I only have
   two sentences with my CFO?
```

---

## 4. After N5: CCC Lever Feasibility Assessment

**When to use:** You've modeled collections/payables/inventory levers and need to pick a combination.

```
I modeled three working-capital levers to close a cash gap:

[paste: each lever's $ impact, timeline, feasibility rating, and stated risk
— e.g. collections +$200K/1-2wk/medium/churn risk, payables +$180K/2-3wk/
medium/supplier tension, inventory +$150K/4-8wk/hard/stockout risk]

1. Given the gap size and timeline I'm working with, which combination would
   you recommend and why?
2. What's the biggest thing that could go wrong with the combination you'd
   pick, and how would you hedge against it?
3. What question is my Controller/Risk teammate most likely to push back with?
```

---

## 5. After N6: FX & Hedge Policy Compliance Check

**When to use:** You have a hedge recommendation and want a second opinion before treating it as "solved."

```
Here's our FX exposure and a proposed hedge adjustment:

[paste: exposure by currency, current hedge ratio per currency, board policy
range (e.g. 50-75%), proposed new hedge ratio, annual cost of the hedge]

1. Does the proposed hedge ratio actually bring us into policy, or just closer?
2. Is the cost reasonable relative to the exposure being protected?
3. Is this urgent relative to the liquidity gap, or can it wait a cycle?
```
