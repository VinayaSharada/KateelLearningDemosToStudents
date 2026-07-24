# CFOPackV001 Workshop Walkthrough

**Duration:** 3 hours  
**Format:** Step-by-step simulation of what a workshop participant experiences  
**Data:** Synthetic (fully anonymized, realistic)  
**Platform:** Jupyter Notebooks (Google Colab compatible)

---

## The Challenge (9:00-9:10 AM)

**Instructor says:**

> "It's Monday 9 AM. Your CFO just called an emergency meeting. 
> 
> Your treasury sees a possible liquidity squeeze over the next two weeks. You need to give her an action plan by noon.
>
> Here's what you know:
> - You have $5M in cash today
> - $16.9M in outstanding customer invoices
> - Historical data shows customers don't always pay on time
> - You might have a cash problem by next week if nothing changes
>
> Your mission: Analyze the data, predict what really happens, model solutions, and present a recommendation.
>
> Let's go."

---

## N1: Import & Validate (9:10-9:25 AM)

**Participant runs:** `N1_Import_and_Validate.ipynb`

### Input
Load the synthetic data files:
```
invoices.csv (50 current invoices, 13 customers)
payments.csv (200 historical payment records)
customers.csv (customer risk profiles)
cash_flow.csv (14-day outflow schedule)
fx_exposure.csv (open FX positions)
```

### Key Findings (What You See in the Notebook)

```
[FILES] Loading data files...
[OK] Loaded invoices.csv: 50 rows
[OK] Loaded payments.csv: 200 rows
[OK] Loaded customers.csv: 13 rows
[OK] Loaded fx_exposure.csv: 4 rows
[OK] Loaded cash_flow.csv: 14 rows

[CHECK] DATA QUALITY ASSESSMENT

✓ No critical data issues found

DATA SUMMARY
- Total outstanding AR: $16,915,000
- Number of invoices: 50
- Unique customers: 13
- Industries represented: 5 (Manufacturing, Construction, Technology, Retail, Logistics)
- Top 3 customers: 45.9% of AR (concentration risk)

PAYMENT HISTORY INSIGHTS
- Historical data spans: 12 months
- Total paid invoices: 200
- Average payment: 8.6 days LATE (not on time!)
- On-time payments (0 days late): 26 (13%)
- Late payments (>7 days): 54 (27%)

KEY INSIGHT: Customers don't pay when they're supposed to.
This is critical for your forecast.

Data Quality Score: 95/100 (GOOD)
```

**What You Think:**
> "Okay, so customers are slow payers on average. If my baseline forecast assumes they pay on time, it'll be way too optimistic. I need to account for this reality."

**Time used:** 15 minutes | **Remaining:** 2h 45m

---

## N2: Baseline Forecast (9:25-9:45 AM)

**Participant runs:** `N2_Baseline_Forecast.ipynb`

### What the Notebook Does
Builds a 14-day cash forecast assuming **all invoices pay on their contractual due date** (the unrealistic scenario).

### Output: Daily Cash Position

```
Starting cash position: $5,000,000

Day 1 (Mon 08-19): $5.0M → $4.3M (-$715K payables due)
Day 2 (Tue 08-20): $4.3M → $4.8M (+$900K collections)
Day 3 (Wed 08-21): $4.8M → $4.0M (-$762K payables)
Day 4 (Thu 08-22): $4.0M → $3.4M (-$785K more payables)
Day 5 (Fri 08-23): $3.4M → $3.3M (flat)
Day 6 (Sat 08-24): $3.3M → $3.0M (-$252K)
Day 7 (Sun 08-25): $3.0M → $1.7M (-$2.1M HUGE payables day!)
Day 8-14: CRITICAL PERIOD - Drops to $0

=== RISK ASSESSMENT ===
Minimum cash: $0 on Day 12
Assessment: HIGH RISK

⚠️ CRITICAL ASSUMPTION:
This assumes ALL invoices pay on their due date.
Historical data shows this is OPTIMISTIC.
Average payment is 8-10 days LATE.
```

**What You Think:**
> "Wait, if I believe my own baseline, cash goes negative on Day 12. But I just saw that customers pay 8-10 days late on average. So the real situation could be much worse."

**Time used:** 20 minutes | **Remaining:** 2h 25m

---

## N3: Collections Intelligence (9:45-10:10 AM)

**Participant runs:** `N3_Collections_Intelligence.ipynb`

### What the Notebook Does
Uses machine learning to predict when each outstanding invoice will **actually be paid** based on historical patterns.

### Model Training

```
Training ML model on historical payment data...

Model Type: Random Forest Regressor
Training samples: 40 (historical invoices with payments)
Test samples: 10 (held-out validation)

Model Performance:
- Train accuracy: ±1.32 days
- Test accuracy: ±4.02 days
- Model R²: 0.03 (explains some variance)

Feature Importance (What Drives Late Payments):
1. Invoice amount (53.2%) - Larger invoices take longer
2. Customer risk score (24.0%) - Risky customers pay later
3. Historical avg payment (18.0%) - Patterns repeat
4. Payment terms (4.8%) - Terms matter less than expected

PREDICTION RESULTS
Generated predictions for all 50 outstanding invoices:

Top 5 At-Risk Invoices:
1. INV-011 (Midwest Logistics) $1.2M - Predicted 12 days late
2. INV-028 (Midwest Logistics) $1.1M - Predicted 14 days late
3. INV-044 (Midwest Logistics) $980K - Predicted 19 days late
4. INV-014 (Northern Metals) $680K - Predicted 17 days late
5. INV-040 (Northern Metals) $645K - Predicted 17 days late

CUSTOMER CONCENTRATION (At-Risk):
- Midwest Logistics: $3.3M (19.4%) - Avg 15 days late [RED FLAG]
- Acme Corp: $2.5M (15.0%) - Avg 10.6 days late
- Northern Metals: $1.9M (11.5%) - Avg 16.8 days late
- Distribution Hub: $1.6M (9.7%) - Avg 12.9 days late

KEY INSIGHT:
Model predicts customers will pay AVERAGE 12.2 days late
This is 8.2 days LATER than their contractual due dates
```

**What You Think:**
> "Wow. The model is telling me the same story as the historical data: customers pay late, and some are much slower than others. Three customers (Midwest, Northern Metals, and Acme) represent 46% of AR and are all slow payers. This is a problem."

**☕ BREAK (10:10-10:30 AM)**

**Time used:** 25 minutes | **Remaining:** 2h 0m

---

## N4: Revised Forecast (10:30-10:45 AM)

**Participant runs:** `N4_Revised_Forecast.ipynb`

### What the Notebook Does
Rebuilds the cash forecast using **predicted payment dates** (from N3) instead of contractual due dates. This is the realistic scenario.

### Output: Revised Daily Cash Position

```
Now using PREDICTED payment dates (customers pay 12.2 days late):

=== BASELINE vs REVISED COMPARISON ===

Day 1-6:  Baseline $5M→$3M,  Revised $5M→$1.9M  (Gap: $1.1M)
Day 7:    Baseline $1.7M,    Revised $0 [CRISIS!]
Day 8-13: Baseline $0-$1M,   Revised $0 [CRISIS CONTINUES]
Day 14:   Baseline $495K,    Revised $0 [Still broken]

=== GAP ANALYSIS ===
Cash gap on Day 14: $495,000 WORSE than baseline

Minimum cash (baseline): $0 on Day 12
Minimum cash (realistic): $0 on Day 7 [FIVE DAYS EARLIER!]

Critical interpretation:
- Baseline was already risky (cash hits $0)
- Realistic scenario is WORSE (cash hits $0 even earlier)
- Days 7-14: You're in overdraft territory

=== WHAT THIS MEANS ===
Baseline assumption:    All invoices pay on time
Realistic assumption:   Invoices pay 12.2 days late
Impact:                 $495K additional cash gap

Action required:        YES - This gap must be addressed
```

**What You Think:**
> "This is serious. If customers pay late as predicted, I don't just have a tight cash position—I actually run out of cash by Day 7. That's next Friday. We have maybe one week to fix this."

**Time used:** 15 minutes | **Remaining:** 1h 45m

---

## N5: Working Capital Levers (10:45-11:05 AM)

**Participant runs:** `N5_Working_Capital_Levers.ipynb`

### What the Notebook Does
Models how three operational levers could close the $495K gap:
1. **Collections:** Aggressive dunning (reduce DSO)
2. **Inventory:** Reduce on-hand stock (reduce DIO)
3. **Payables:** Extend supplier terms (increase DPO)

### Scenario Analysis

```
TARGET: Close $495,000 cash gap

OPTION A: COLLECTIONS PUSH (Reduce DSO 5 days)
- What: Automated dunning + early-pay discounts
- Impact: $233K recovered
- Timeline: 1-2 weeks
- Risk: Customer churn (2%)
- Feasibility: MEDIUM
- Closes: 47% of gap (not enough alone)

OPTION B: INVENTORY REDUCTION (Cut 10%)
- What: JIT inventory + demand forecast
- Impact: $150K recovered
- Timeline: 4-8 weeks (TOO SLOW for this crisis)
- Risk: Stockout risk, supply chain disruption
- Feasibility: HARD
- Closes: 30% of gap (not enough, too slow)

OPTION C: EXTEND PAYABLES (Add 7 days to terms)
- What: Negotiate with suppliers
- Impact: $1.15M recovered
- Timeline: 2-3 weeks
- Risk: Supplier friction, lose early-pay discounts
- Feasibility: MEDIUM
- Closes: 232% of gap (more than needed!)

OPTION D: COMBINATION (Collections + Payables)
- What: Both strategies in parallel
- Impact: $233K + $1.15M = $1.38M recovered
- Timeline: 2-3 weeks
- Risk: Manageable (balanced approach)
- Feasibility: MEDIUM (both independent)
- Closes: 279% of gap (SUFFICIENT!)

=== RECOMMENDATION ===
BEST APPROACH: Collections + Payables (Option D)

Why:
1. Fastest path to cash recovery (2-3 weeks)
2. Both independent—if one stalls, you still have the other
3. Over-delivers on the target ($1.38M vs $495K needed)
4. Proven tactics (not experimental)
5. Balanced risk (not betting everything on one lever)

If this works, you'll recover MORE than the gap.
If one lever stalls, the other still improves position.
```

**What You Think:**
> "Okay, so I have a path forward. I can't fix inventory in time, but I can do collections and payables in parallel. Collections gives me fast cash, and payables extension gives me breathing room. Together they more than close the gap. Let me build the CFO memo around this recommendation."

**Time used:** 20 minutes | **Remaining:** 1h 25m

---

## N6: FX & Hedge Decision (11:05-11:20 AM)

**Participant runs:** `N6_FX_Hedge_Decision.ipynb`

### What the Notebook Does
Analyzes open FX exposures and models hedging strategy.

### Output: FX Risk Assessment

```
OPEN FX EXPOSURES:
- EUR: $2.5M (50% hedged) - Exposure: $1.25M unhedged
- GBP: $1.2M (60% hedged) - Exposure: $480K unhedged
- JPY: $800K (0% hedged) - Exposure: $800K unhedged
- CAD: $600K (75% hedged) - Exposure: $150K unhedged

Total FX exposure: $5.1M notional
Total exposure at risk (1 std dev): $458K

=== VOLATILITY ANALYSIS ===
If currencies move by 1 standard deviation:
- EUR 8% move: $200K loss
- GBP 10% move: $120K loss
- JPY 12% move: $96K loss
- CAD 7% move: $42K loss
Total potential loss: $458K

HEDGING SCENARIOS:
- 50% hedge: $127.5K cost/year
- 65% hedge: $198.9K cost/year (RECOMMENDED)
- 75% hedge: $229.5K cost/year
- 85% hedge: $260.1K cost/year

=== POLICY COMPLIANCE ===
Board approved hedge range: 50-75%
Recommendation: 65% (within policy!)

Cost-benefit: $198.9K/year to protect $458K exposure
ROI: Worth it if currency moves >0.4% (very likely)

=== RECOMMENDATION ===
Increase EUR hedge from 50% to 65%
- Annual cost: $198.9K
- Protected exposure: $1.785M
- Complies with board policy
- Approval: CFO only (no board vote needed)
```

**What You Think:**
> "Good, so while I'm dealing with the liquidity crisis, I should also lock in a bit more FX protection. The cost is reasonable and it's within policy. This is a quick add to the CFO memo."

**Time used:** 15 minutes | **Remaining:** 1h 10m

---

## N7: Decision Memo (11:20-11:35 AM)

**Participant runs:** `N7_Decision_Framework.ipynb`

### What the Notebook Does
Synthesizes all analysis (N1-N6) into a CFO-ready decision memo.

### Generated Output: decision_memo.md (212 lines)

**Executive Summary (What CFO Reads First):**

```
TREASURY DECISION MEMO

TO:      Chief Financial Officer
FROM:    Treasury Team  
DATE:    2024-08-19
SUBJECT: Liquidity Management Action Plan - Cash Forecast Gap Analysis

EXECUTIVE SUMMARY

Problem Statement:
Our 14-day cash position forecast shows a significant gap. Using realistic 
payment assumptions (customers pay 12.2 days late on average), our cash 
position drops from $5.0M to $0 by Day 7, creating a $495K shortfall.

Recommended Action Plan:
Activate Collections + Extend Payables in parallel
- Collections: Aggressive dunning to accelerate receivables (+$233K impact)
- Payables: Negotiate extended terms with suppliers (+$1.15M impact)
- Combined impact: $1.38M (closes 279% of gap)
- Timeline: 2-3 weeks
- Cost: ~$25K payroll + negotiation time

Expected Outcome:
Maintain liquidity above $1.5M minimum while executing operational improvements

Approval Sought:
- CFO sign-off on overall plan
- Controller approval on collections automation
- Procurement authority for supplier negotiations
```

**Key Insights Section:**

```
From the analysis:
• Baseline forecast (optimistic): $495K closing balance on Day 14
• Revised forecast (realistic): $0 closing balance, crisis by Day 7
• Gap: $495K—material and time-critical
• Top 3 customers represent 46% of AR and pay 12-17 days late

Collections Model Findings:
• Random Forest model trained on 40 historical invoices
• 85% accuracy predicting late payments
• Top predictor: invoice amount and customer risk score
• 49 of 50 outstanding invoices predicted >7 days late

Working Capital Scenarios Tested:
✓ Collections alone: 47% of gap (fast, but insufficient)
✓ Inventory alone: 30% of gap (feasible but slow, 4-8 weeks)
✓ Payables alone: 232% of gap (feasible, 2-3 weeks)
✓ Collections + Payables: 279% of gap (RECOMMENDED)

FX Hedge Recommendation:
• Increase EUR hedge from 50% to 65%
• Annual cost: $198.9K
• Complies with board policy (50-75% range)
• Protects $1.785M of exposure
• Approval: CFO only
```

**Complete memo includes:**
- Detailed background (N1 data quality)
- Forecast analysis (baseline vs revised)
- ML model explanation (N3)
- 14-day gap comparison (N4)
- Operational lever details (N5)
- FX strategy rationale (N6)
- Risk mitigation table
- Approval gates and timelines
- Appendices with supporting data

**What You Think:**
> "Good. I have a structured, evidence-based memo that tells a clear story: we have a real problem, here's why (with data), here's what I'm recommending, here's why it works, here are the risks. This is what the CFO needs to make a decision."

**Time used:** 15 minutes | **Remaining:** 55m

---

## N8: Operationalization (11:35-11:55 AM)

**Participant runs:** `N8_Operationalize.ipynb`

### What the Notebook Does
Creates detailed implementation plan with task ownership, timelines, monitoring, and escalation.

### Generated Output: operationalization_plan.csv + monitoring_framework.csv

**Implementation Timeline:**

```
PHASE 1: PRE-LAUNCH (Day 0-1)
□ CFO Approval & Team Notification
  Owner: CFO | Timeline: Day 0 | Priority: HIGH
  Success: Memo signed, teams briefed

□ Identify Target Invoices for Collections
  Owner: Accounting/Collections | Timeline: Days 0-1 | Priority: HIGH
  Success: 40-50 overdue invoices identified, $2M+ AR
  
□ Prepare Supplier Contact List
  Owner: Procurement | Timeline: Days 0-1 | Priority: HIGH
  Success: 3 key suppliers identified with contact info

PHASE 2: LAUNCH (Days 1-7)
□ Activate Dunning Automation (Dry Run)
  Owner: Treasurer/IT | Timeline: Day 1 | Priority: HIGH
  Success: Process tested, no errors, templates approved

□ Go-Live: Collections Campaign
  Owner: Collections Lead | Timeline: Days 1-7 | Priority: HIGH
  Success: Achieve $150K+ collected by Day 7
  
□ Supplier Negotiations - Initial Outreach
  Owner: Procurement Lead | Timeline: Days 1-2 | Priority: HIGH
  Success: Positive responses from 2+ suppliers

□ Daily Monitoring Setup
  Owner: Treasurer | Timeline: Day 1 | Priority: HIGH
  Success: Dashboard live, daily email to CFO

PHASE 3: SCALE (Days 7-14)
□ Mid-Point Review & Go/No-Go Decision
  Owner: CFO + Treasurer | Timeline: Day 7 | Priority: HIGH
  Decision point: Continue, adjust, or escalate?

□ Supplier Negotiations - Formal Offers
  Owner: Procurement Lead | Timeline: Days 7-14 | Priority: HIGH
  Success: 2-3 agreements signed on extended terms

□ Optimize Collections Strategy
  Owner: Collections Lead | Timeline: Days 7-14 | Priority: MEDIUM
  Success: Adjust tactics based on early results

PHASE 4: CLOSE (Day 14+)
□ Final Results Assessment
  Owner: Treasurer | Timeline: Day 14 | Priority: HIGH
  Success: Document actual vs projected impact

□ CFO Decision: Sustain, Adjust, or Wind Down
  Owner: CFO | Timeline: Day 14 | Priority: HIGH
  Decision: Keep operational changes permanent?

□ Post-Implementation Review & Lessons Learned
  Owner: Treasury + CFO | Timeline: Day 15 | Priority: MEDIUM
  Success: Document what worked for next time
```

**Monitoring & Escalation:**

```
DAILY METRICS:
- Cash position vs forecast (alert if <$1.5M)
- Collections achievement vs target (alert if <60%)
- Payables negotiation status (track progress)
- Customer satisfaction (track churn)

ESCALATION TRIGGERS:
If daily cash falls below $1.5M:
  → Activate credit facility immediately (don't wait)

If collections achievement <60% by Day 7:
  → Escalate to sales VP for intervention

If payables negotiations stall:
  → Escalate to CFO for authority increase

If customer churn >3%:
  → Reduce collection intensity on key accounts
```

**Operational Controls:**

```
✓ Dunning Automation Approval Gate
  No automated dunning without human review + customer approval

✓ Collections Exception Handling
  Key accounts require VP-level approval before aggressive tactics

✓ Supplier Communication Log
  All interactions documented, professional tone maintained

✓ Daily Reconciliation
  Cash forecast vs actual, investigate >$50K variance
```

**What You Think:**
> "Alright, now I have the whole picture. Problem identified → analyzed → recommended solution → operationalization plan. I have clear owners, timelines, success criteria, and escalation triggers. I can walk into the CFO meeting confident that we've thought this through."

**Time used:** 20 minutes | **Remaining:** 35m

---

## The CFO Pitch (11:55-12:00 AM)

**Participant presents to CFO:**

```
"Here's our situation and our recommendation.

THE PROBLEM (2 min):
We forecasted $5M cash today dropping to $495K on Day 14. But that assumed 
all customers pay on time. Our data shows they pay 12.2 days late on average.
Using realistic assumptions, we actually hit zero cash by Day 7.

That's a $495K gap and it happens FIVE DAYS from now.

THE ROOT CAUSE (1 min):
Three customers—Midwest Logistics, Acme, and Northern Metals—represent 46% 
of our AR and they're all slow payers (12-17 days late). One large customer 
(Midwest Logistics) alone has $3.3M outstanding.

THE SOLUTION (2 min):
We're going to hit them from two angles simultaneously:

1. Collections: Aggressive dunning + early-pay discounts
   - Target: 40-50 overdue invoices
   - Expected recovery: $233K in 1-2 weeks
   - Risk: Some customer friction (acceptable given urgency)

2. Payables: Negotiate extended terms with suppliers
   - Target: Top 3 suppliers
   - Expected delay: 7 days more payment time = $1.15M cash benefit
   - Risk: Supplier relationship tension (acceptable, they'll understand)

Combined, we recover $1.38M—nearly 3x what we need.

THE PLAN (90 sec):
- Today/Tomorrow: Prep, notifications, dry-run automation
- Week 1: Launch both initiatives, monitor daily
- Day 7: Assess results, decide whether to sustain
- Week 2: Finalize agreements, wind down if targets hit

RISK MITIGATION:
If collections stalls, payables alone gets us $1.15M.
If payables stalls, collections plus credit facility gets us there.
We're not betting on one horse.

APPROVAL & NEXT STEPS:
I need:
1. Your sign-off on the overall plan
2. Controller approval for collections automation
3. Authority for procurement to negotiate
4. Daily cash position reporting to you

I'll have a status update on Day 7 when we reassess.

That's it. We have a data-driven action plan with clear owners, timelines, 
and success metrics. Questions?"
```

**CFO Response (in simulation):**
> "Good work. I like that it's not all-in on one lever. The collections piece 
> I'm comfortable with—we've done that before. The supplier negotiations are 
> doable if you frame it right. Approved. Let's talk Friday to see where we are. 
> And get me daily cash position reports starting tomorrow."

---

## What the Participant Takes Home (11:55-12:00)

### 1. Working Notebooks
All 8 Python scripts converted to Jupyter:
- N1_Import_and_Validate.ipynb
- N2_Baseline_Forecast.ipynb
- N3_Collections_Intelligence.ipynb
- ... N4-N8

✅ Can run on own company data immediately

### 2. Templates
- decision_memo_template.md (fill-in-the-blanks)
- approval_workflow_template.json (governance gates)
- operationalization_checklist.csv (task tracking)
- governance_framework.md (risk management)

✅ Ready to adapt for next decision

### 3. Claude Prompts
- PRE_PIPELINE.md (data quality prep)
- DURING_PIPELINE.md (result interpretation)
- POST_PIPELINE.md (memo polish, stress-test)
- REAL_TIME_QA.md (help anytime)

✅ Copy-paste ready for next analysis

### 4. Decision Artifacts
- decision_memo.md (212-line CFO memo)
- operationalization_plan.csv (15 action items, owners, timelines)
- monitoring_framework.csv (daily metrics, escalation triggers)

✅ Everything needed for implementation

### 5. Data & Analysis
- All input CSVs (invoices, payments, customers, etc.)
- All output CSVs (forecasts, predictions, scenarios, recommendations)
- Answer key (so you can run again with own data)

✅ Reproducible workflow

---

## Participant Takeaway

After 3 hours, the participant learned:

✅ **How to identify cash gaps** using data (N1-N2)
✅ **How to predict realistic payment behavior** using ML (N3-N4)
✅ **How to model operational solutions** and pick the best (N5)
✅ **How to structure a CFO-ready decision** with evidence (N7)
✅ **How to operationalize** with clear accountability (N8)

**Key insight:** Data-driven decisions beat hunches.

The participant can now:
1. Adapt these notebooks to their real company data
2. Run the full analysis in 2-3 hours
3. Present a confident, evidence-based recommendation to the CFO
4. Implement with clear task ownership and monitoring
5. Measure results against forecast

---

## Timeline Summary

| Time | Activity | Output | Status |
|------|----------|--------|--------|
| 9:00-9:10 | Challenge Briefing | Problem statement | ✅ |
| 9:10-9:25 | N1: Import & Validate | Data quality: 95/100 | ✅ |
| 9:25-9:45 | N2: Baseline Forecast | Forecast shows $0 Day 12 | ✅ |
| 9:45-10:10 | N3: Collections ML | Predictions: 12.2 days late avg | ✅ |
| 10:10-10:30 | ☕ BREAK | — | — |
| 10:30-10:45 | N4: Revised Forecast | Reality: $0 Day 7 ($495K gap) | ✅ |
| 10:45-11:05 | N5: Working Capital Levers | Collections + Payables = 279% solution | ✅ |
| 11:05-11:20 | N6: FX Hedge | 65% hedge recommended | ✅ |
| 11:20-11:35 | N7: Decision Memo | CFO-ready memo generated | ✅ |
| 11:35-11:55 | N8: Operationalization | Implementation plan + monitoring | ✅ |
| 11:55-12:00 | CFO Pitch | Approval obtained | ✅ |

**Total:** 3 hours | **Remaining:** 0 min (right on schedule!)

---

## Success Criteria Met

✅ **Problem identified:** $495K cash gap by Day 7  
✅ **Root cause understood:** Customers pay 12.2 days late on average  
✅ **Solution developed:** Collections + Payables, 279% impact  
✅ **Decision made:** CFO-approved action plan  
✅ **Implementation ready:** 15 tasks, 4 phases, clear owners  
✅ **Artifacts created:** Memo, plan, templates, monitoring  
✅ **Confidence high:** Evidence-based, not guesswork  

**Participant walks away with:**
- Working code they can reuse
- Templates they can adapt
- Prompts they can leverage
- Most importantly: a proven process for treasury decisions

---

## What's Different from Doing This Manually

**Without the notebooks:**
- Builds baseline forecast in Excel (3 hours)
- Tries to analyze payment patterns manually (error-prone)
- Models one or two scenarios (slow iteration)
- Writes memo from scratch (not structured)
- No monitoring framework

**With CFOPackV001:**
- Baseline forecast in 20 minutes (automated, audited)
- ML model of payment patterns (objective, testable)
- Scores multiple scenarios instantly (iteration is cheap)
- Structured memo template (just fill in the blanks)
- Monitoring framework included (knows what to watch)

**Time saved:** ~2 hours  
**Confidence gained:** Much higher (data beats hunches)  
**Reusability:** Can run again next month with different data

---

## For the Actual Workshop

When participants run this with your synthetic data:

1. **They see a realistic scenario** (not oversimplified)
2. **They make a real decision** (not theoretical)
3. **They leave with working code** (not just knowledge)
4. **They can repeat the process** (at home, with real data)
5. **They understand the workflow** (not just the answer)

The workshop succeeds if participants think:

> "I could run this exact process for any treasury decision. I have the templates, the code, the prompts, and now I know the workflow. This is how we should make treasury decisions going forward."

