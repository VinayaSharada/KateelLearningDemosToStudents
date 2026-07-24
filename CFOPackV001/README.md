# CFOPackV001: Treasury Decision Workshop

**Complete, integrated Jupyter notebook workshop for data-driven treasury decision-making**

---

## Overview

CFOPackV001 is a 3-4 hour hands-on workshop where participants learn to build **evidence-based treasury decisions** using data analysis, machine learning, and structured decision frameworks.

### The Scenario

> "It's Monday 9 AM. Your CFO calls an emergency meeting. Treasury forecasts a liquidity squeeze over the next two weeks. You need to give her an action plan by noon."

### The Outcome

By the end of the workshop, participants will have:
- Analyzed real cash position data
- Built ML predictions for payment behavior
- Modeled operational solutions
- Created a CFO-ready decision memo
- Designed an implementation plan with governance

### The Deliverables

- 8 integrated Jupyter notebooks
- Decision memo (executive summary + evidence)
- Implementation plan (15 tasks, 4 phases)
- Monitoring framework (daily metrics + escalation)
- Templates for reuse on real data

---

## Workshop Structure

### Option A: Full 3-4 Hour Workshop (N1-N8)

```
09:00-09:10  Welcome & Challenge Briefing                (10 min)
09:10-09:25  N1: Import & Validate Data                  (15 min)
09:25-09:45  N2: Baseline Forecast                       (20 min)
09:45-10:10  N3: Collections Intelligence (ML)           (25 min)
10:10-10:30  ☕ BREAK                                    (20 min)
10:30-10:45  N4: Revised Forecast                        (15 min)
10:45-11:05  N5: Working Capital Levers                  (20 min)
11:05-11:20  N6: FX Hedge Decision                       (15 min)
11:20-11:35  N7: Decision Framework & Memo              (15 min)
11:35-11:55  N8: Operationalization Plan                (20 min)
11:55-12:00  CFO Pitch Presentation                      (5 min)

TOTAL: 3 hours (with break)
```

### Option B: Extended 4-5 Hour Workshop (N0.5 + N1-N8)

Add N0.5 at the beginning to demonstrate data preparation:

```
09:00-09:10  Welcome & Challenge Briefing
09:10-09:50  N0.5: Bank Reconciliation Demo              (40 min) ← NEW
             [Shows how to clean/match messy data before analysis]
09:50-12:00  N1-N8: Full decision pipeline               (3 hours)

TOTAL: 3h 50min (with break)
```

---

## Modules

### N0.5: Bank Reconciliation Assistant (OPTIONAL)

**Purpose:** Data preparation + local LLM demonstration  
**Duration:** 30-40 min  
**Key Learning:** Prompt engineering, local models, data privacy

Automates matching bank statement entries to invoices using Phi-3 LLM running locally (no external API calls).

**Demonstrates:**
- ✓ What LLMs do well (fuzzy matching, categorization)
- ✗ Where they struggle (ambiguity, partial payments)
- → Why data quality is critical
- → Privacy benefits of local models
- → Practical reconciliation workflow

**Included:**
- Notebook: `notebooks/N0.5_Bank_Reconciliation_Assistant.py`
- Synthetic data: 25 bank entries + 12 invoices
- Prompt template: `templates/bank_reconciliation_prompt_template.txt`
- Results sample: `N0.5_RECONCILIATION_RESULTS_SAMPLE.md`
- Facilitation guide: `instructor_guide/N0.5_FACILITATION_GUIDE.md`

**Use when:** Teaching data preparation, LLM practical applications, data privacy

---

### N1: Import & Validate (15 min)

**Objective:** Load and assess data quality

Load 5 CSV files:
- Invoices (50 outstanding, $16.9M total)
- Payments (200 historical records)
- Customers (13 unique, 5 industries)
- Cash flows (14-day outflow schedule)
- FX exposures ($5.1M open positions)

**Output:** Data quality score (95/100 - GOOD)

**Key insight:** "Data is clean, but payment history shows customers don't pay on time."

---

### N2: Baseline Forecast (20 min)

**Objective:** Build optimistic cash forecast

Forecast 14-day cash position assuming all invoices pay on contractual due dates.

**Finding:**
```
Starting cash:      $5.0M
Day 7 minimum:      $1.7M
Day 12 minimum:     $0 (CRISIS!)
Day 14 closing:     $495K
```

**Key insight:** "Forecast looks OK only if everyone pays on time."

---

### N3: Collections Intelligence (25 min)

**Objective:** Use ML to predict realistic payment behavior

Train Random Forest model on 12 months of historical payment data.

**Model Performance:**
- Accuracy: ±1.32 days (mean absolute error)
- Feature importance: Amount (53%), Risk Score (24%), History (18%)

**Prediction:**
```
Outstanding invoices will pay AVERAGE 12.2 days LATE
(not on time, like the baseline assumed)
```

**Key insight:** "Customers will actually pay 12 days late. That changes everything."

---

### N4: Revised Forecast (15 min)

**Objective:** Rebuild forecast using predicted payment dates

Recalculate cash position with realistic payment timing.

**Finding:**
```
Baseline (optimistic):  $495K on Day 14
Revised (realistic):    $0 on Day 7
Cash gap:              $495K (MATERIAL)
Timeline:              FIVE DAYS (next Friday)
```

**Key insight:** "Inaction will cause a liquidity crisis in one week."

---

### N5: Working Capital Levers (20 min)

**Objective:** Model solutions to close the gap

Analyze three operational levers:

1. **Collections** (reduce DSO)
   - Impact: +$233K
   - Timeline: 1-2 weeks
   - Feasibility: Medium

2. **Inventory** (reduce DIO)
   - Impact: +$150K
   - Timeline: 4-8 weeks
   - Feasibility: Hard

3. **Payables** (increase DPO)
   - Impact: +$1.15M
   - Timeline: 2-3 weeks
   - Feasibility: Medium

**Recommendation:**
```
Collections + Payables (in parallel)
Total impact: $1.38M (closes 279% of gap)
Timeline: 2-3 weeks
Rationale: Both independent, over-delivers on target
```

**Key insight:** "We can close the gap with operational moves in 2-3 weeks."

---

### N6: FX & Hedge Decision (15 min)

**Objective:** Manage currency risk alongside liquidity fix

Analyze $5.1M open FX exposure (EUR $2.5M, GBP $1.2M, JPY $800K, CAD $600K).

**Recommendation:**
```
Increase EUR hedge from 50% to 65%
Annual cost: $198,900
Complies with board policy (50-75% range)
```

**Key insight:** "Also need to manage currency risk while fixing liquidity."

---

### N7: Decision Framework (15 min)

**Objective:** Synthesize all analysis into CFO-ready memo

Generate 212-line decision memo including:
- Executive summary (problem, recommendation, impact)
- Evidence (data, analysis, models)
- Risk mitigation table
- Approval gates + timeline
- Appendices with supporting data

**Output:** `decision_memo.md` (ready to present to CFO)

**Key insight:** "We have an evidence-based case for the CFO."

---

### N8: Operationalization (20 min)

**Objective:** Create implementation plan with governance

Generate:
- **Implementation plan** (14 tasks across 4 phases)
- **Monitoring framework** (daily/weekly metrics)
- **Escalation triggers** (what causes immediate action)
- **Operational controls** (approval gates, documentation)

**Output:** 
- `operationalization_plan.csv` (task details)
- `monitoring_framework.csv` (metrics dashboard)

**Key insight:** "We know exactly who does what, when, and how we'll measure success."

---

## Files & Structure

```
CFOPackV001/
├── README.md (this file)
├── WORKSHOP_WALKTHROUGH.md              # Full 3-hr participant experience
├── N0.5_README.md                       # Optional bank reconciliation module
├── N0.5_RECONCILIATION_RESULTS_SAMPLE.md # Sample N0.5 output & analysis
├── TEST_RESULTS.md                      # End-to-end testing verification
│
├── notebooks/
│   ├── N0.5_Bank_Reconciliation_Assistant.py  [OPTIONAL]
│   ├── N1_Import_and_Validate.py
│   ├── N2_Baseline_Forecast.py
│   ├── N3_Collections_Intelligence.py
│   ├── N4_Revised_Forecast.py
│   ├── N5_Working_Capital_Levers.py
│   ├── N6_FX_Hedge_Decision.py
│   ├── N7_Decision_Framework.py
│   └── N8_Operationalize.py
│
├── data/
│   ├── synthetic/
│   │   ├── invoices.csv (50 outstanding, $16.9M AR)
│   │   ├── payments.csv (200 historical records)
│   │   ├── customers.csv (13 customers, 5 industries)
│   │   ├── cash_flow.csv (14-day outflows)
│   │   ├── fx_exposure.csv ($5.1M open positions)
│   │   └── bank_statement.csv (25 entries, for N0.5) [NEW]
│   │
│   └── answer_keys/
│       └── [Expected outputs for validation]
│
├── templates/
│   ├── decision_memo_template.md
│   ├── approval_workflow_template.json
│   ├── operationalization_checklist.csv
│   ├── governance_framework.md
│   └── bank_reconciliation_prompt_template.txt [NEW, for N0.5]
│
├── claude_prompts/
│   ├── PRE_PIPELINE.md (data prep with Claude)
│   ├── DURING_PIPELINE.md (interpretation help during N2-N6)
│   ├── POST_PIPELINE.md (memo polish, stress test)
│   └── REAL_TIME_QA.md (anytime help)
│
├── instructor_guide/
│   ├── GETTING_STARTED.md (overview for instructors)
│   ├── FACILITATION_TIPS.md (how to guide a group)
│   ├── TROUBLESHOOTING.md (common issues)
│   ├── N0.5_FACILITATION_GUIDE.md [NEW]
│   │
│   └── answer_keys/ (expected outputs per notebook)
│       ├── N1_validation.csv
│       ├── N2_baseline.csv
│       ├── ... etc
│       └── N8_implementation_plan.csv
│
├── participant_guide/
│   ├── GETTING_STARTED.md (5-min orientation)
│   ├── DATA_UPLOAD_GUIDE.md (bring real data)
│   └── POST_WORKSHOP.md (what to do at home)
│
└── outputs/
    └── [Generated by notebooks during execution]
        ├── N1_validated_data.csv
        ├── N2_baseline_forecast.csv
        ├── N3_invoice_payment_predictions.csv
        ├── N4_gap_analysis.csv
        ├── N5_ccc_scenarios.csv
        ├── N6_hedge_recommendation.csv
        ├── N7_decision_memo.md
        ├── N8_operationalization_plan.csv
        ├── N8_monitoring_framework.csv
        └── N0.5_reconciliation_results.csv [if using N0.5]
```

---

## Quick Start

### For Instructors

**Option 1: Demo Mode (10 minutes)**
```bash
1. Open WORKSHOP_WALKTHROUGH.md
2. Walk through the full 3-hour experience
3. Show participant outcomes
4. No technical setup required
```

**Option 2: Full Workshop (3+ hours)**
```bash
1. Have Colab/Jupyter ready
2. Give participants access to notebooks (or run on their machines)
3. Walk through N1-N8 step by step
4. Optional: Include N0.5 at the beginning
5. End with participant presenting CFO pitch
```

### For Participants

**In Colab:**
```
1. Open notebooks/N1_Import_and_Validate.py
2. Click "Open in Colab"
3. Run cells in sequence
4. Download outputs as needed
5. Use templates/ for your own decisions
```

**Locally:**
```
1. Install: pip install pandas numpy scikit-learn
2. Download all notebooks and data/synthetic CSVs
3. Run: jupyter notebook notebooks/N1_Import_and_Validate.py
4. Continue through N8
```

---

## What Makes This Workshop Effective

### ✅ Real Problem
- Not theoretical: actual liquidity crisis scenario
- Recognizable to any CFO or treasurer
- Shows real treasury workflows

### ✅ Data-Driven
- Students manipulate real data (50 invoices, 200 payment records)
- See how analysis changes with assumptions
- Learn when intuition misleads vs. when data confirms

### ✅ ML in Action
- Build a prediction model (N3)
- See it discover patterns human analysts miss
- Understand both capability AND limitation

### ✅ Business Integration
- Decision memo is what CFO actually reads
- Implementation plan is what operations actually executes
- Governance frameworks are real risk controls

### ✅ Practical Takeaway
- Participants get working notebooks they can adapt
- Templates for decision frameworks
- Claude prompts for interpretation help
- Can run again at home with real company data

---

## Optional: N0.5 Bank Reconciliation Module

**When to include N0.5:**
- Teaching data preparation workflow
- Demonstrating prompt engineering
- Showing local LLM usage (privacy benefits)
- Illustrating why clean data is critical before analysis

**Why include it:**
- Shows a real treasury task (matching bank to invoices)
- Uses local Phi-3 model (no external API calls)
- Teaches reconciliation automation (70-80% auto-matching)
- Demonstrates LLM limitations and where humans excel
- Completes the picture: raw data → clean data → analysis

**See:** N0.5_README.md for full module details

---

## Workshop Outcomes

**Participants learn:**

1. **Data Analysis Skills**
   - Import/validate data (schema, quality checks)
   - Build forecasts (time-series logic)
   - Recognize patterns (payment behavior)

2. **ML Skills**
   - Feature engineering (amount, customer risk, history)
   - Model training (Random Forest)
   - Prediction & interpretation

3. **Decision-Making Skills**
   - Structure decisions (evidence + tradeoffs)
   - Model scenarios (different levers)
   - Synthesize analysis (decision memo)

4. **Operational Skills**
   - Plan implementation (4 phases, 14 tasks)
   - Define metrics (monitoring framework)
   - Build governance (approval gates, controls)

5. **Technology Skills**
   - Jupyter notebooks
   - Python (pandas, scikit-learn)
   - Optional: Local LLM usage (Phi-3 in N0.5)
   - Optional: Claude API integration (prompts in templates)

---

## How to Adapt for Your Organization

### Scenario 1: Different Treasury Problem
- Use the same notebook structure
- Replace synthetic data with your problem
- Adjust N3 model features (or skip if no prediction needed)
- Follow the same pipeline to decision + implementation

### Scenario 2: Using Real Company Data
1. Export your invoices/payments as CSVs
2. Adjust file paths in notebooks
3. Run N1 to validate your data quality
4. Continue through N8 with your numbers
5. Your outputs = real decision framework for CFO

### Scenario 3: Extended 2-Day Workshop
- Day 1: N0.5 (bank reconciliation prep) + N1-N4 (analysis)
- Day 2: N5-N8 (solutions + decision) + real company case study
- Deep-dive on prompt engineering, ML interpretation, governance

### Scenario 4: Self-Paced Learning
- Participants download all files
- Work through notebooks at their own pace
- Use Claude (via prompts/ templates) to interpret results
- Optional: Weekly sync to discuss findings

---

## Support & Resources

### Included in Package
- `claude_prompts/`: Ready-to-use Claude prompts for interpretation
- `templates/`: Decision memo, approval workflow, operationalization templates
- `instructor_guide/`: Facilitation tips, troubleshooting, assessment questions
- `participant_guide/`: Getting started, data upload, post-workshop steps
- `TEST_RESULTS.md`: Proof of end-to-end execution
- `WORKSHOP_WALKTHROUGH.md`: Complete participant experience simulation

### To Use Claude During Workshop
- Pre-pipeline: Use `PRE_PIPELINE.md` prompts to prep data
- During analysis: Use `DURING_PIPELINE.md` prompts to interpret N2-N6 outputs
- After analysis: Use `POST_PIPELINE.md` prompts to polish memo and stress-test
- Anytime: Use `REAL_TIME_QA.md` for participant questions

---

## Testing & Validation

This package has been:
- ✅ End-to-end tested with synthetic data (all 8 notebooks execute successfully)
- ✅ Validated with 25 bank entries and 12 invoices (N0.5)
- ✅ Reviewed for data privacy (local LLM, no external calls)
- ✅ Documented with facilitation guides and troubleshooting
- ✅ Ready for immediate classroom use

See `TEST_RESULTS.md` for detailed test results.

---

## Version & Status

**Package:** CFOPackV001 (Complete Treasury Decision Workshop)  
**Version:** 1.0 (Production Ready)  
**Last Updated:** 2024-08-26  
**Status:** ✅ Ready for Workshop Delivery  

---

## Next Steps

1. **For instructors:** Review WORKSHOP_WALKTHROUGH.md (5 min read)
2. **For participants:** Read participant_guide/GETTING_STARTED.md
3. **Optional:** Work through N0.5 for data preparation demo
4. **Main workshop:** Run N1-N8 in sequence (3 hours)
5. **Follow-up:** Use templates + prompts for real company decisions

---

## Questions?

- **How long does this take?** 3 hours (N1-N8) or 3h 50min (with N0.5)
- **Do I need coding skills?** No, participants just run notebooks (no coding required)
- **Can I use real data?** Yes, replace CSVs and follow the same pipeline
- **Is Claude API required?** No (optional), comes with optional prompts in templates/
- **What about data privacy?** Core workshops runs locally; N0.5 uses local Phi-3 model; Claude integration is optional

---

**Built with:** Jupyter Notebooks, Python (pandas, scikit-learn), Synthetic treasury data  
**For:** Treasury teams, CFOs, students, finance professionals  
**By:** Claude Code + LearningDemos Project
