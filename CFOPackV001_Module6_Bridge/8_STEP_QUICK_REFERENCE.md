# 8-Step Decision Method: Quick Reference Card

**Print this. Keep it handy while analyzing cases.**

---

## The 8 Steps (One-Page Overview)

### **STEP 1: Import & Validate**
**Question:** What's the current state? What are the constraints?

**Action:**
- [ ] Read the case carefully
- [ ] Extract facts (company, CFO, decision, budget, timeline)
- [ ] Create maturity table (scores/5 for key dimensions)
- [ ] Identify constraints (budget, timeline, stakeholder conflicts)

**Output:**
- [ ] Current state documented
- [ ] Constraints listed
- [ ] Key assumptions noted

**Example:** Asteron is spending 14 days on close; CFO has INR 28 crore; Board wants proof point in 90 days

---

### **STEP 2: Baseline Forecast**
**Question:** How much does the current problem cost us annually?

**Action:**
- [ ] Quantify each pain point (FTE cost, time cost, risk cost, etc.)
- [ ] Add up total annual impact
- [ ] This becomes the "value at stake"

**Output:**
- [ ] Table: Pain Point → Annual Cost
- [ ] Total annual cost of doing nothing
- [ ] ROI target (value you need to capture)

**Example:** Asteron's finance dysfunction costs INR 7 crore/year

---

### **STEP 3: Collections Intelligence**
**Question:** Which option promises the biggest impact?

**Action:**
- [ ] List each option (from case exhibits)
- [ ] Extract promised benefits for each
- [ ] Estimate impact (in quantitative terms if possible)
- [ ] Rate confidence (high/medium/low) based on case evidence

**Output:**
- [ ] Table: Option → Cost, Benefit, Impact, Confidence
- [ ] Clear picture of which option moves needle most

**Example:** AP Automation: INR 12 cr, INR 0.5 cr/year savings, HIGH confidence

---

### **STEP 4: Revised Forecast**
**Question:** What does success look like for each option in 90 days?

**Action:**
- [ ] For EACH option, describe what happens Day 30, 60, 90
- [ ] What's the "proof point" that shows it worked?
- [ ] Is success visible to the Board? (Yes/Maybe/No)
- [ ] What's the adoption risk? (High/Medium/Low)

**Output:**
- [ ] For each option: timeline + proof point + visibility + adoption risk
- [ ] Clarity on which options are "quick wins" vs. "slow burns"

**Example:** AP Automation: Day 90 = 4-day cycle (vs. 8), 80% auto-match, audit trail live = visible success

---

### **STEP 5: Working Capital Levers**
**Question:** How do the options trade off against each other?

**Action:**
- [ ] Create comparison matrix:
  - Rows: Cost, Day 90 visibility, ROI timeline, adoption ease, enables next?, risk reduction, control risk
  - Columns: Each option
- [ ] Score each (High/Medium/Low or numerical)
- [ ] Identify the "winner" on key dimensions

**Output:**
- [ ] Trade-off matrix clearly shows winners and losers
- [ ] You see the strategic tension (why the decision is hard)

**Example:** AP Automation wins on cost & quick ROI; Data Foundation wins on "enables next"

---

### **STEP 6: FX Hedging Decision**
**Question:** What are the control and adoption risks? How do we mitigate?

**Action:**
- [ ] For EACH option, list control risks (governance, audit, compliance)
- [ ] List adoption risks (user resistance, change management)
- [ ] For each risk, suggest mitigation (how to reduce it)

**Output:**
- [ ] Risk table showing which options are riskier
- [ ] Mitigations for the chosen option
- [ ] Confidence in control profile

**Example:** AP Automation: Low control risk (audit trail improves); low adoption risk (users love faster processing)

---

### **STEP 7: Decision Framework**
**Question:** What's my recommendation and why?

**Action:**
- [ ] Choose ONE option based on Steps 1-6
- [ ] Write 3-sentence rationale:
  1. This option has [highest impact / lowest risk / best proof point]
  2. It costs [X] and delivers [Y] in 90 days
  3. It enables [next option] in subsequent months
- [ ] Explain why NOT the others (sequencing story)

**Output:**
- [ ] Clear recommendation
- [ ] 3-point rationale
- [ ] Sequencing plan for other options (when/why to do them later)

**Example:** Recommend AP Automation → Close Redesign (M4-6) → Data Foundation (M7-12) → Planning (M13-24)

---

### **STEP 8: Operationalize**
**Question:** How do we execute the chosen option? What's the roadmap?

**Action:**
- [ ] Break chosen option into 3 phases (4 weeks each, 12 weeks total):
  - Phase 1: Foundation / Setup
  - Phase 2: Build & Test
  - Phase 3: Scale & Optimize
- [ ] For EACH phase:
  - List 3-5 key tasks
  - Assign owner
  - Define success criteria
- [ ] Define weekly metrics to track
- [ ] List risks & mitigations
- [ ] Define success criteria at Day 90 gate

**Output:**
- [ ] 90-day implementation plan with tasks and owners
- [ ] Weekly metrics dashboard
- [ ] Risk mitigations
- [ ] Go/no-go criteria for Day 90 approval gate

**Example:** AP Automation roadmap: W1-2 setup, W3-8 pilot, W9-12 scale; metrics: cycle time, auto-match %, FTE savings, audit trail

---

---

## The Decision Framework (Visual)

```
                    STEP 1: VALIDATE
                      [Current State]
                            ↓
                    STEP 2: BASELINE
                    [Cost of Doing Nothing]
                            ↓
              STEP 3 & 4: ANALYZE OPTIONS
              [What Each Option Promises + 90-Day Outcome]
                            ↓
                    STEP 5: TRADE-OFF
                    [Cost/Benefit/Risk Matrix]
                            ↓
                    STEP 6: RISK CHECK
                [Control + Adoption Risk Assessment]
                            ↓
                    STEP 7: DECIDE
              [Choose + Sequencing Plan]
                            ↓
                    STEP 8: EXECUTE
              [90-Day Plan + Metrics + Gates]
```

---

## Common Patterns to Look For

### **Pattern 1: "Foundation First"**
- Problem: No clean data; decisions are based on guesses
- Solution: Data Foundation (expensive, long payoff, but enables everything)
- Sequencing: Data → Automation → Analytics

### **Pattern 2: "Quick Win First"**
- Problem: Team needs credibility for larger transformation
- Solution: Easy automation (AP, close, payroll) (cheap, fast payoff)
- Sequencing: Quick win → Scale → Strategic initiatives

### **Pattern 3: "Risk Reduction First"**
- Problem: High control risk; compliance concerns
- Solution: Process redesign + controls (moderate cost, control strength)
- Sequencing: Controls → Automation → Transformation

### **Pattern 4: "Capability First"**
- Problem: Team doesn't have skills for advanced analytics
- Solution: Talent/training first (investment in people)
- Sequencing: Skills → Tools → Decisions

**Key:** Most cases show Pattern 2 (quick win → foundation → strategy)

---

## Red Flags (When Your Analysis Might Be Wrong)

🚩 **You've chosen an initiative that takes 18+ months to show value**  
→ Problem: Board wants proof point in 90 days. Reconsider.

🚩 **You've ignored the case's stated constraints**  
→ Problem: You're recommending something outside budget or timeline. Re-read.

🚩 **You can't quantify the "pain cost" in Step 2**  
→ Problem: Go back to Step 1. The case must give you numbers (FTE cost, cycle time, etc.)

🚩 **Your recommendation has high adoption risk and you have no mitigation**  
→ Problem: Step 6 matters. Mitigate the risk or reconsider.

🚩 **You can't write 3 sentences explaining your recommendation**  
→ Problem: Your reasoning isn't clear. Work back through Steps 1-6.

🚩 **You don't have a Day 90 proof point**  
→ Problem: Most cases are about proving value in 90 days. What's visible at Day 90?

---

## Checklist: "Did I Do It Right?"

Before you finalize your recommendation, check:

- [ ] Step 1: I understand the current state and constraints
- [ ] Step 2: I've quantified the annual cost of the problem
- [ ] Step 3: I can explain what each option promises
- [ ] Step 4: I can describe the 90-day outcome for each option
- [ ] Step 5: I've compared options on cost/benefit/risk
- [ ] Step 6: I've identified and mitigated control risks
- [ ] Step 7: I can give 3 reasons for my recommendation
- [ ] Step 8: I have an implementation plan with metrics

**If all checked:** You're ready. Write your memo.  
**If any unchecked:** Go back to that step and flesh it out.

---

## The Memo Structure (One Page)

```
MEMORANDUM TO THE BOARD

FROM: [CFO]
RE: [Recommendation]

EXECUTIVE SUMMARY: We recommend [Option] because [reason 1], [reason 2], [reason 3].

1. SITUATION: [Quantified pain from Step 2]

2. ANALYSIS: [Options from Step 3-5; trade-off comparison]

3. RECOMMENDATION: Fund [Option] for [Cost] to achieve [Day 90 outcome]

4. CONTROL & RISK: [Mitigations from Step 6]

5. TIMELINE: [Roadmap from Step 8; weeks/phases]

6. FINANCIAL IMPACT: [ROI, payback period, enables next initiative]

SEQUENCING: [After this proves successful, fund Option B, then Option C...]
```

---

## Quick Decision Aid

**Use this table to pick your option:**

| Ask Yourself | If TRUE → Choose | If FALSE → Choose |
|--------------|------------------|-------------------|
| Is there a quick (90-day) win? | Quick Win | Foundation First |
| Is data quality blocking everything? | Data Foundation | Don't start with data |
| Is adoption risk high? | Easy win (low risk) | Can tolerate resistance |
| Do we need to prove ROI fast? | Quick automation | Strategic investment |
| Is control a major concern? | Control/redesign | Data/automation |
| Do we have budget for big change? | Strategic | Incremental |

**Most cases point to:** Quick win first → sequencing to bigger initiatives

---

## Common Metrics by Initiative Type

### **If you chose Process Automation (AP, Close, etc.):**
- Cycle time (days → days)
- Manual effort (FTE → FTE or %)
- Accuracy (error rate %)
- Audit trail (% digital)
- User satisfaction (1-5)

### **If you chose Data Foundation:**
- Data governance score (1-5)
- Reconciliation effort (hours)
- Report consistency (%)
- Dashboard adoption (users)
- Time-to-insight (days → hours)

### **If you chose Analytics/Planning:**
- Forecast accuracy (vs. actual %)
- Scenario analysis speed (days → hours)
- Decision cycle time (days)
- Finance team velocity (scenarios/month)
- Board decision speed (calendar days)

### **If you chose AI/GenAI:**
- Decision quality (peer review score)
- Time savings (analyst hours)
- Accuracy (vs. manual %)
- Adoption rate (% of team)
- Cost per decision ($/analysis)

---

## Templates You'll Need

| Template | Where to Find | Use For |
|----------|---------------|---------| 
| Current State Table | Step 1 (above) | Documenting what you know |
| Pain Cost Table | Step 2 (above) | Quantifying the problem |
| Option Analysis Table | Step 3-4 (above) | Comparing initiatives |
| Trade-off Matrix | Step 5 (above) | Showing winners/losers |
| Risk Table | Step 6 (above) | Mitigation planning |
| Implementation Roadmap | Step 8 (above) | 90-day plan |
| Memo Template | "Memo Structure" (above) | Writing recommendation |

**All templates in CASE_ANALYSIS_WORKBOOK.md, Part 2**

---

## Pro Tips

**Tip 1:** When stuck, go back to Step 2. "How much does this problem cost?" usually clarifies the decision.

**Tip 2:** Step 5 (trade-off matrix) is where the real decision happens. Fill it out completely.

**Tip 3:** Step 6 (risk) is often where good recommendations turn into great ones. Don't skip it.

**Tip 4:** Step 8 (operationalize) is where you show you can actually execute. Be specific on owners and metrics.

**Tip 5:** Your Day 90 proof point (Step 4) is your most important output. Everything else supports it.

**Tip 6:** Sequencing (in Step 7) is what separates mature finance leaders from tactical thinkers. "Which order maximizes learning and builds momentum?"

---

## From CFOPackV001 to Module 6

| Element | Module 5 | Module 6 |
|---------|----------|----------|
| **Scope** | Single decision (treasury) | Strategic sequence (digital finance) |
| **Constraint** | Budget, timeline, risk | Budget, stakeholder, Board priorities |
| **Decision Type** | "What action?" | "Which priority first?" |
| **Outcome** | 90-day plan | 90-day proof + multi-year roadmap |
| **Proof Point** | Collections improved, cash gap closed | Close faster, AP automated, data cleaner |

**Method:** Same 8 steps, different scale

---

## Print This Out

This card is designed to fit on 2-3 pages (back of a notebook, desk reference).

**Print and keep handy while:**
- [ ] Analyzing a case
- [ ] Writing your recommendation
- [ ] Presenting to others

---

**You've got this. Follow the 8 steps. The decision will be clear.** 🎯

