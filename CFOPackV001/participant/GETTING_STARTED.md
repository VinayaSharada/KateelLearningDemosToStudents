# Getting Started with CFOPackV001

**Read this before the workshop (5 minutes)**

---

## Welcome!

CFOPackV001 is a hands-on workshop where you'll build a **real treasury decision** using data analysis, machine learning, and structured thinking.

**You'll learn:**
1. How to identify cash gaps using data
2. How to predict payment behavior with ML
3. How to model operational levers (collections, payables, inventory)
4. How to write a CFO-ready decision memo
5. How to build an implementation plan

**You'll take home:**
- Working Python notebooks (your own to adapt)
- Templates (decision memo, governance checklist, approval workflow)
- Claude prompts (for interpreting results)
- A repeatable process you can use at your company

---

## The Business Challenge

It's Monday 9:00 AM.

Your CFO says: *"We're forecasting tight liquidity next week. Walk me through our cash position and tell me what we should do. I need a recommendation by noon."*

**The problem:**
- Your baseline forecast shows $2.3M on Day 14
- But payment history suggests invoices will be 8-10 days LATE
- That means real cash could be $1.8M (a $500K gap)
- This puts you below your $1.5M comfort zone

**What do we do?**
- Collections push (aggressive dunning)?
- Extend payables to suppliers?
- Reduce inventory?
- All three?
- Or just use the credit facility?

**By the end of this workshop, you'll have a CFO-ready answer.**

---

## How It Works

### **8 Integrated Notebooks (N1-N8), Plus an Optional N0.5**

Each notebook produces an output that feeds the next one. You're building a data pipeline.

| Notebook | What You Do | Time | Output |
|----------|------------|------|--------|
| **N0.5** *(optional)* | Reconcile bank statement to invoices using a local LLM | 30-40 min | Matched reconciliation |
| **N1** | Load & validate data | 15 min | Cleaned dataset |
| **N2** | Build baseline forecast (optimistic) | 20 min | Baseline cash position |
| **N3** | Train ML model to predict late payments | 25 min | Invoice payment predictions |
| **N4** | Rebuild forecast with realistic dates | 20 min | Revised cash position + gap |
| **N5** | Model working capital levers | 25 min | Options analysis |
| **N6** | Analyze FX hedging strategy | 20 min | Hedge recommendation |
| **N7** | Build CFO decision memo | 25 min | Memo ready to present |
| **N8** | Create implementation plan | 20 min | Action plan + checklist |

**Total: 3 hours (3h 50min if your session includes N0.5)**

---

## Tools You'll Use

### **Python & Jupyter**
- Each notebook runs independently (but outputs flow together)
- No advanced Python knowledge needed (lots of comments)
- Run locally or use Google Colab (free, no installation)

### **Data Files (Provided)**
- `invoices.csv` — 10,000 invoices (8,000 paid + 2,000 outstanding), $546.9M total AR
- `payments.csv` — 8,200 historical payment records
- `customers.csv` — 148 customers across 5 industries
- `fx_exposure.csv` — FX positions
- `cash_flow.csv` — 14-day cash outflow schedule

All data is **fully synthetic** (realistic but not real).

### **Optional: Claude**
- Before workshop: Data quality exploration
- During workshop: Interpret results, clarify concepts
- After workshop: Polish memo, stress-test plan

(Claude is optional. You can run pure notebooks or hybrid.)

---

## Team Formation

- **Team size:** 2-3 people per team (workshop groups run 3-6 participants, split into 2-3 teams)
- **How teams form:** The instructor assigns you to a team at the start of the session — you don't need to arrange this beforehand
- **Roles rotate within your team** every 2 hours (see below), so everyone gets time in each seat

## Roles (Rotate Every 2 Hours)

### **Treasurer/Operator**
- Drives the forecasting & collections analysis
- "What's our actual cash position?"
- Focus: N1-N4 (data & forecasting)

### **Controller/Risk**  
- Challenges assumptions
- Raises controls & governance questions
- "Are we comfortable with this risk?"
- Focus: N5-N6 (levers & compliance)

### **CFO Spokesperson**
- Maintains decision record
- "Can we actually execute this?"
- Prepares memo
- Focus: N7-N8 (decision & operationalization)

---

## Success Looks Like

By the end of 3 hours, you'll have:

✅ **Data Summary** — "We have 500 invoices worth $X, historically paid Y days late"  
✅ **Forecast** — "Our cash drops to $1.8M on Day 14 (not $2.3M as baseline assumed)"  
✅ **Predictions** — "These 40 invoices are highest risk; these customers pay slowest"  
✅ **Levers** — "Collections + Payables can recover $380K (closes 76% of gap)"  
✅ **Decision** — "We recommend aggressive collections + supplier term extension"  
✅ **Action Plan** — "Here's who does what, when, how we monitor, and when to escalate"  

**Then you pitch it to your CFO in 5 minutes.** ⏱️

---

## What to Bring

- **Laptop** with Python 3.8+ installed (or use Google Colab)
- **Jupyter** or JupyterLab (or use Colab in browser)
- **Required libraries:** pandas, numpy, scikit-learn (minimal; we'll help install)
- **Optional:** Claude API access (free tier works) or ChatGPT Plus

No other software needed.

---

## Before You Arrive

**Read this document** (5 min) ✓  

**Check your setup:**
- Can you run a Jupyter notebook? 
- Do you have Python 3.8+?
- Missing something? Setup guide is in `notebooks/SETUP.md`

**Optional: Familiarize yourself with the challenge**
- What does "liquidity gap" mean in your company?
- How do you currently forecast cash?
- Who approves treasury decisions?

---

## During the Workshop

**Be active:**
- Ask questions when confused
- Challenge assumptions ("Is that realistic?")
- Discuss with your team

**Use Claude if stuck:**
- Prompts provided for each notebook
- Optional, not required
- Great for interpretive questions ("Does this make sense?")

**Keep moving:**
- We're time-boxed (3 hours total)
- If you're ahead, help others or dig deeper
- If behind, ask instructor for a buddy

---

## After the Workshop

**Immediately after:**
- You get all outputs (notebooks, memo, plan, templates)
- You get the template files (can customize)
- You get Claude prompts (can reuse anytime)

**Take-home plan:**
1. Share findings with your CFO
2. Download your notebooks & adapt to real data
3. Run end-to-end with your actual AR/AP data
4. Build the workflow into your monthly process

**Questions?** Ask instructor anytime during workshop.

---

## FAQ

**Q: Do I need to be a data scientist?**  
A: No. Python experience helpful but not required. We'll walk through code.

**Q: Will this work with my real data?**  
A: Yes! Notebooks are designed to work with your own CSVs. See DATA_UPLOAD_GUIDE.md.

**Q: What if something breaks?**  
A: Happens. Instructor will help. Worst case: read the output and discuss conceptually.

**Q: Can I use this at my company?**  
A: Yes. Templates and prompts are yours to use. Notebooks are Python (portable).

**Q: Is this a forecasting tool or a learning workshop?**  
A: Both. You learn the process, you build real artifacts, you take them home.

---

## Key Principles

1. **Data First** — Always start with data, not assumptions
2. **Predict Realistically** — Don't assume everything goes to plan
3. **Model Options** — Explore multiple levers before deciding
4. **Decide Systematically** — Use evidence, not intuition
5. **Execute with Controls** — Build monitoring & escalation into the plan

---

## Questions Before We Start?

If you're confused about:
- **The challenge:** "What are we actually solving?"
- **The tools:** "Do I need to install something?"
- **The time:** "Can we extend this?"
- **Your role:** "What should I focus on?"

Ask instructor before 9:00 AM on workshop day.

**See you in the workshop!**

---

## Quick Reference

| Need | Look Here |
|------|-----------|
| Setup instructions | `notebooks/SETUP.md` |
| Data schema | `data/README.md` |
| Using Claude | `claude_prompts/README.md` |
| Bringing real data | `participant/DATA_UPLOAD_GUIDE.md` |
| Taking it home | `participant/POST_WORKSHOP_TAKEAWAY.md` |
| Templates | `templates/` (decision memo, checklist, governance) |

