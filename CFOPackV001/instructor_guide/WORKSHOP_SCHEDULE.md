# CFOPackV001 Workshop Schedule

**Duration:** 3 hours  
**Format:** In-person or virtual (Jupyter notebooks + optional Claude)  
**Group size:** 3-6 participants (2-3 teams of 2-3 people)  
**Equipment:** Laptops, Python 3.8+, Jupyter (or Google Colab)

---

## Timeline & Activities

### **9:00-9:10 (10 min) — Welcome & Challenge Briefing**

**Instructor:**
- Welcome participants
- Explain the business challenge (treasury liquidity decision)
- Show the "you are here" map: data → forecast → prediction → decision → action plan

**Participant:**
- Read GETTING_STARTED.md (5 min, beforehand)
- Ask clarifying questions (2-3 min)
- Get into assigned teams (teams of 2-3, rotating roles)

**Deliverable:** Problem statement understood

---

### **9:10-9:25 (15 min) — N1: Import & Validate Data**

**What they'll do:**
- Load synthetic CSVs (invoices, payments, customers, FX, cash flow)
- Run data quality checks
- Summarize dataset characteristics

**Instructor tips:**
- Walk them through loading the data (first 5 min)
- Let them read the output (data summary, quality score)
- Pause: "What surprised you about the data?" (2 min)

**Optional Claude help:**
- If confused about data quality: use PRE_PIPELINE prompt "Data Quality Exploration"
- If unsure about next steps: ask "What should we do with this data?"

**Deliverable:** validated_data.csv + understanding that data needs cleaning/validation

---

### **9:25-9:45 (20 min) — N2: Baseline Forecast**

**What they'll do:**
- Build 14-day cash forecast assuming all invoices pay on time
- See cash position over 14 days
- Identify minimum cash point

**Instructor tips:**
- "Notice the assumption: ALL invoices pay on time"
- "Is this realistic?" (let them challenge)
- "What if we're wrong about payment dates?"
- Pause: "Should we trust this forecast?" (2 min)

**Optional Claude help:**
- If confused: use DURING_PIPELINE prompt "After N2: Baseline Forecast Interpretation"

**Deliverable:** daily_cash_baseline.csv + realization that baseline is optimistic

---

### **9:45-10:10 (25 min) — N3: Collections Intelligence (ML Model)**

**What they'll do:**
- Train ML model on historical payment data
- Predict which invoices will be late (and by how many days)
- Identify at-risk customers

**Instructor tips:**
- "This is the 'aha moment': payments don't happen on time"
- Walk through feature importance (what drives late payments?)
- Show predictions: "This invoice will be 12 days late"
- Challenge: "Do these predictions make sense?" (customer knowledge check)

**Optional Claude help:**
- If model results seem wrong: use DURING_PIPELINE prompt "After N3: Collections ML Interpretation"
- If unsure about model accuracy: ask Claude to explain

**Deliverable:** invoice_payment_predictions.csv + understanding that reality differs from assumption

---

### **☕ 10:10-10:30 (20 min) — BREAK**

**During break (optional):**
- Teams can ask Claude quick questions ("Is our data OK?" "Does this prediction make sense?")
- Instructor circulates: "How are you feeling about the analysis so far?"

**Instructor prep:**
- Check that everyone is on track
- Pull aside any struggling team to help

---

### **10:30-10:45 (15 min) — N4: Revised Forecast**

**What they'll do:**
- Rebuild cash forecast using predicted payment dates
- Compare to baseline
- Quantify the gap

**Instructor tips:**
- "Remember when we assumed all invoices pay on time?"
- "Now we're using realistic predictions"
- Pause: "How much lower is our actual cash?" (gap analysis)
- "Is this a problem?" (requires action or acceptable?)

**Optional Claude help:**
- If unsure about gap: use DURING_PIPELINE prompt "After N4: Revised Forecast Gap Assessment"

**Deliverable:** daily_cash_revised.csv + realization of material cash gap

---

### **10:45-11:05 (20 min) — N5: Working Capital Levers**

**What they'll do:**
- Model 3 operational levers: collections, inventory, payables
- Calculate cash impact of each lever
- Identify "best combination"

**Instructor tips:**
- "We've identified the problem. Now what do we do?"
- Walk through each lever: impact, timeline, risk
- "Which lever is fastest? Which is safest? Which closes the gap?"
- Pause: "Which combination would you choose?" (team decision, 2-3 min)

**Optional Claude help:**
- If stuck on lever choice: use DURING_PIPELINE prompt "After N5: CCC Lever Feasibility Assessment"

**Deliverable:** ccc_scenarios.csv + decision on which levers to recommend

---

### **11:05-11:20 (15 min) — N6: FX & Hedge Decision**

**What they'll do:**
- Analyze open FX exposures
- Model hedging strategies
- Recommend hedge ratios

**Instructor tips:**
- "While we solve the liquidity gap, we also manage FX risk"
- Show: "What's our exposure? What's the cost of hedging?"
- "Policy says 50-75% hedge. What do we recommend?"
- Pause: "Is this required or optional?" (good question: optional given cash focus)

**Optional Claude help:**
- If unsure about hedge policy: use DURING_PIPELINE prompt "After N6: FX & Hedge Policy Compliance Check"

**Deliverable:** hedge_recommendation.csv + understanding of FX risk management

---

### **11:20-11:35 (15 min) — N7: Decision Memo**

**What they'll do:**
- Synthesize all analysis into decision memo (CFO-ready)
- Generate memo narrative
- Review structure and compelling argument

**Instructor tips:**
- "This is your CEO pitch in written form"
- Show generated memo
- Pause: "Is this persuasive?" "Would your CFO approve this?"
- Read key sections aloud (2-3 min)

**Optional Claude help:**
- If unsure about memo: use POST_PIPELINE prompt "After N7: Decision Memo Polish"
- Ask Claude: "Would a CFO buy this recommendation?"

**Deliverable:** decision_memo.md ready to present to CFO

---

### **11:35-11:55 (20 min) — N8: Operationalize**

**What they'll do:**
- Create implementation plan with task owners and timeline
- Define monitoring metrics and escalation triggers
- Build operational controls

**Instructor tips:**
- "The decision is only half the battle. Execution is hard."
- "Who does what? By when? How do we know if it's working?"
- Walk through timeline: Pre-Launch → Launch → Scale → Close
- Pause: "What could go wrong?" (identify risks, 3 min)

**Optional Claude help:**
- If unsure about controls: use POST_PIPELINE prompt "After N8: Operationalization Stress Test"

**Deliverable:** operationalization_plan.csv + implementation readiness

---

### **11:55-12:00 (5 min) — Wrap-Up & Take-Home**

**Instructor:**
- Recap: Problem → Analysis → Decision → Execution
- Reinforce: "You can do this with your real data"
- Answer final questions
- Remind: Notebooks, templates, and prompts are yours to use

**Participant:**
- Receive POST_WORKSHOP_TAKEAWAY.md
- Ask: "How do I adapt this for our company?"
- Commit to: "We will build this for our September forecast"

**Deliverable:** Team ready to execute at home with own data

---

## Role Rotation (Recommended)

**First 2 hours (N1-N4):** 
- Treasurer/Operator: Primary voice for collections/AR analysis
- Controller/Risk: Challenges assumptions, raises controls issues
- CFO Spokesperson: Maintains decision record, asks "can we execute?"

**Final hour (N5-N8):**
- Rotate roles so everyone gets CFO/decision experience
- Each person presents one section to the group

---

## Claude Integration Points

**Recommended Use (Not Mandatory):**

| Notebook | When | Prompt | Purpose |
|----------|------|--------|---------|
| N1 | If data looks messy | PRE_PIPELINE: Data Quality | Validate data or identify cleaning needs |
| N2 | If forecast seems off | DURING: Baseline Interpretation | Sanity-check forecast assumptions |
| N3 | If predictions surprise | DURING: Collections ML Interpretation | Validate model makes business sense |
| N4 | If gap unclear | DURING: Revised Forecast Gap | Assess materiality of gap |
| N5 | If stuck on choice | DURING: CCC Lever Assessment | Help with lever decision |
| N6 | If unsure on hedging | DURING: FX Hedge Compliance | Check policy alignment |
| N7 | If memo weak | POST: Decision Memo Polish | Strengthen narrative |
| N8 | If risks unclear | POST: Operationalization Stress Test | Identify execution risks |
| Any | Stuck anytime | REAL_TIME_QA | Get quick clarification |

**Instructor option:** Designate one person as "Claude operator" to explore prompts while others move forward (parallel tracks).

---

## Facilitation Tips

### **Keep It Moving**
- Strict time box each notebook (use timer if needed)
- If running behind, skip N6 (FX is optional in 3-hour format)
- Key outputs to hit: Gap identified, levers modeled, memo drafted, plan outlined

### **Make It Conversational**
- After each notebook: "What do you notice?" "Does this surprise you?" "Would you recommend this?"
- Avoid: Standing and lecturing the output
- Preferred: "Turn to your partner: Does this make sense?"

### **Handle Struggles**
- If tech fails (Jupyter crash): Pivot to "What would you do?" conversation
- If someone falls behind: Buddy system (team member walks them through)
- If consensus stalls: "Let's go with plan A for now and revisit at Day 7 mid-point"

### **Build Ownership**
- "You built this forecast, you own the recommendation"
- "Your team will execute this plan"
- "This is how treasury works in the real world"

---

## Success Metrics

By end of workshop, teams should be able to:

✓ **Understand the data:** What was surprising?  
✓ **Build forecasts:** What's the cash gap?  
✓ **Use ML:** Which invoices are risky?  
✓ **Model levers:** How do we close the gap?  
✓ **Make decisions:** What should we recommend to the CFO?  
✓ **Execute:** How do we actually do this?  

If teams can answer all 6 questions, workshop succeeded.

---

## Post-Workshop Follow-Up

**Day 1 after workshop:**
- Email teams their outputs (memo, plan, checklist)
- Remind: "These are yours to use with real data"

**Week 1:**
- Check in: "Have you shared findings with your CFO?"
- Offer: "Help adapting to your data? Ping us."

**Month 1:**
- Follow-up: "Did you implement? What worked?"
- Collect feedback: "What would improve the workshop?"

---

## Troubleshooting Common Issues

**Q: "The model predictions don't match our intuition"**  
A: "That's a feature! The model sees patterns you might miss. Compare to your payment history."

**Q: "Collections will damage relationships"**  
A: "Great point. That's why we limit it to bottom-tier accounts and pair with payables extension."

**Q: "We don't have CFO support for this"**  
A: "That's the point of the memo. Use it to build the business case."

**Q: "Our data looks different"**  
A: "Even better. Use this workshop as a template. Your real analysis will be more valuable."

