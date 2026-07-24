# Post-Workshop Takeaway

**After the workshop ends, here's what you have and what to do with it.**

---

## What You've Got

### **1. Working Notebooks (N1-N8)**
Python scripts in `/notebooks/` directory:
- `N1_Import_and_Validate.py` — Data quality checks
- `N2_Baseline_Forecast.py` — Optimistic scenario
- `N3_Collections_Intelligence.py` — ML prediction model
- `N4_Revised_Forecast.py` — Realistic cash position
- `N5_Working_Capital_Levers.py` — Options analysis
- `N6_FX_Hedge_Decision.py` — Hedging strategy
- `N7_Decision_Framework.py` — CFO-ready memo
- `N8_Operationalize.py` — Implementation plan

All runnable with your own data.

### **2. Templates**
In `/templates/` directory:
- `decision_memo_template.md` — Fill-in-the-blanks CFO memo
- `approval_workflow_template.json` — Governance gates
- `operationalization_checklist.csv` — Task tracking
- `governance_framework.md` — Risk management structure

Use as-is or customize for your company.

### **3. Claude Prompts**
In `/claude_prompts/` directory:
- `PRE_PIPELINE.md` — 5 prompts for data prep
- `DURING_PIPELINE.md` — 5 prompts for result interpretation
- `POST_PIPELINE.md` — 3 prompts for memo polish & stress test
- `REAL_TIME_QA.md` — Q&A prompts for anytime help

Copy-paste-ready. Use anytime you run your own analysis.

### **4. Synthetic Data**
In `/data/synthetic/` directory:
- Ready-to-use sample data for the workshop
- You can keep it or replace with your own

### **5. Your Workshop Outputs**
In `/outputs/` directory:
- All N1-N8 outputs from today
- Your decision memo
- Your implementation plan
- Use as reference when building your own

---

## Next Steps (The Real Work)

### **Week 1: Prepare Your Data**

**Goal:** Get your real AR/AP data into the notebook format

1. **Inventory what you have:**
   - AR aging report (invoices + due dates)
   - Payment history (how invoices actually paid)
   - Customer master (credit limits, risk ratings)
   - 14-day cash flow forecast (payables, capex, debt, payroll)
   - FX positions (optional)

2. **Create your CSVs:**
   - Use template schema in `data/README.md`
   - Export from your ERP/accounting system
   - Anonymize if needed (rename customers, round amounts)
   - Validate with N1 notebook

3. **Store in `/data/synthetic/`:**
   - Replace sample files with your files
   - Keep same filenames
   - Run N1 to check quality

### **Week 2: Run the Pipeline**

**Goal:** Build your actual forecast & decision memo

1. **Run N1-N8 in sequence**
   - ~3 hours to complete
   - Adjust parameters as needed (no code changes required)
   - Review outputs carefully (do they match your intuition?)

2. **Interpret results with Claude (optional)**
   - Use DURING_PIPELINE prompts for ambiguous findings
   - Ask: "Does this prediction make sense?"
   - Refine if model results don't align with domain knowledge

3. **Polish your memo**
   - Fill in `decision_memo_template.md`
   - Or edit the auto-generated `N7_decision_memo.md`
   - Use POST_PIPELINE prompts if needed

### **Week 3: Build the Business Case**

**Goal:** Present to your CFO/Board

1. **Create your pitch**
   - 5-min executive summary (use memo)
   - 30-min detailed presentation (N1-N8 findings)
   - Answer questions: "Why should we do this? What could go wrong?"

2. **Prepare implementation details**
   - Use `N8_operationalization_plan.csv` as template
   - Assign owners + timelines
   - Define success metrics & escalation triggers

3. **Present & get approval**
   - Decision framework is ready
   - You know your recommendation
   - You have evidence to support it

### **Week 4: Execute**

**Goal:** Implement your decision

1. **Kick off implementation**
   - Notify teams of actions
   - Set up daily monitoring
   - Brief key stakeholders

2. **Monitor & adjust**
   - Daily cash position tracking
   - Weekly collections/payables progress
   - Escalate if results diverge from forecast

3. **Measure outcomes**
   - Compare actual vs. forecast at Day 14
   - Document what worked, what didn't
   - Update process for next time

---

## Customization Guide

### **If You Want to Change N1-N8**

The notebooks are yours to modify. Common changes:

**Change forecast period:**
```python
# Currently: 14 days
# To change: find "forecast_end" in N2 and adjust
```

**Change starting cash balance:**
```python
starting_cash = 5_000_000  # Edit this number
```

**Change ML model parameters:**
```python
# N3: RandomForestRegressor(n_estimators=100, max_depth=10)
# Tune: n_estimators (more = slower), max_depth (less = simpler)
```

**Add new levers to N5:**
```python
# Scenarios currently: collections, inventory, payables
# Add your own: discount strategy, customer renegotiation, etc.
```

### **If You Want to Change Templates**

Edit and save with your company branding:
- Add company logo to decision memo
- Update governance framework to match your policy
- Customize checklist with your specific risks/controls

### **If You Want to Add Data**

Expand with additional analysis:
- Customer segmentation (VIP vs. standard vs. high-risk)
- Industry benchmarking (DSO vs. industry standard)
- Scenario modeling (recession, customer loss, etc.)
- Sensitivity analysis (what if cash worse by 20%?)

---

## Common Questions

**Q: "How do I get my data into the right format?"**  
A: See `data/README.md` for schema. Use DATA_UPLOAD_GUIDE.md for step-by-step.

**Q: "My data doesn't cover the full 14 days"**  
A: Use what you have. Forecast is most critical. Payment history helps but isn't required.

**Q: "Can I run this monthly?"**  
A: Yes! Keep the notebooks, update data each month, run end-to-end. Becomes part of close process.

**Q: "What if the memo says something politically tough?"**  
A: That's the point. Data-driven decisions often challenge assumptions. Trust the analysis.

**Q: "Can I use Claude to run the analysis for me?"**  
A: Claude can help interpret but notebooks are your source of truth. Do the analysis yourself first.

---

## Sharing With Your Team

You can:
- ✓ Share notebooks with your team (Python files)
- ✓ Share templates with your team
- ✓ Share your decision memo with your CFO
- ✓ Share this workshop with other departments (training others)
- ✗ Don't share if using real confidential data (run locally)

---

## Advanced: Building This Into Your Process

**Once you've run it once, consider:**

1. **Monthly automation:**
   - Parameterize the notebooks (args for dates, thresholds, etc.)
   - Run as part of monthly close
   - Update forecast weekly

2. **Dashboard:**
   - Visualize N2 & N4 forecasts side-by-side
   - Track actual collections vs. forecast
   - Monitor daily cash vs. danger zone

3. **Governance:**
   - Use approval workflow for all treasury decisions
   - Route memos through governance gates
   - Archive decisions for audit trail

4. **Continuous learning:**
   - Compare predicted vs. actual (N3 model accuracy)
   - Retrain model monthly with new payment data
   - Update risk scores as customer behavior changes

---

## Getting Help

**If you get stuck:**
- Notebooks are well-commented; read carefully
- `TROUBLESHOOTING.md` (instructor guide) has common issues
- Claude prompts can help interpret confusing results
- Reach out to instructor or team for domain knowledge questions

**If results don't make sense:**
- Trust the data first (check N1 output)
- Validate model predictions against your intuition (use Claude)
- Compare to your manual forecast (you probably did one?)
- Ask: "What assumption is driving this?"

---

## Remember

This workshop taught you **how to think about treasury decisions**, not just how to run code.

The artifacts (memo, plan, checklist) are valuable, but the **thinking** is most valuable.

- Start with data (not hunches)
- Predict realistically (not optimistically)
- Model options (not just one path)
- Decide systematically (evidence-based)
- Execute with controls (not ad-hoc)

Apply this to any treasury decision: FX exposure, line of credit, supplier payment strategy, customer credit policy.

---

## One More Thing

**Share your experience back.**

If you:
- ✓ Found this workshop valuable → Tell your CFO & colleagues
- ✓ Used it to make a real decision → Let us know what happened
- ✓ Found an issue or improvement → Send feedback
- ✓ Adapted it for your company → Share what you learned

This keeps the workshop fresh and helps us improve for the next group.

**Good luck! Now go close that cash gap.** 💪

