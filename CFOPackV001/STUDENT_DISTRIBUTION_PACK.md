# CFOPackV001: Student Distribution Pack

**Everything you need for the treasury decision-making workshop**

---

## Welcome!

You're about to take a **3-hour workshop** on making **data-driven treasury decisions**. This pack contains everything you need.

---

## What is CFOPackV001?

A hands-on workshop where you'll:

1. **Analyze real treasury data** (50 customer invoices, $16.9M in accounts receivable)
2. **Build ML predictions** (forecast payment timing using Random Forest)
3. **Model solutions** (test different operational levers)
4. **Create a CFO decision memo** (evidence-based recommendations)
5. **Plan implementation** (15 tasks, 4 phases, with monitoring)

**Time:** 3 hours  
**Difficulty:** Intermediate (no coding required)  
**Outcome:** Working notebooks + templates you can reuse for real decisions

---

## Before the Workshop

### Pre-Workshop Checklist (15 minutes)

- [ ] **Read:** This entire pack (5 min)
- [ ] **Get API Key:** Choose option below and get your key (3-5 min)
- [ ] **Test Setup:** Run verification script (5 min)
- [ ] **Check Tech:** Make sure you can run Jupyter/Colab (2 min)

### Tech Requirements

**Option 1: Google Colab (Easiest)**
- Requires: Google account (free)
- Requires: Internet connection
- Requires: Nothing else
- Time: Click a button, you're ready

**Option 2: Local Jupyter**
- Requires: Python 3.8+
- Requires: Jupyter installed
- Requires: pandas, scikit-learn, requests
- Time: 10 min setup

**Option 3: Cloud IDE (GitHub Codespaces)**
- Requires: GitHub account
- Requires: Internet
- Requires: Nothing else locally
- Time: Click a button, you're ready

---

## How to Get Started

### Step 1: Choose Your API Option

**OPTION A: Groq (Recommended) ⭐**
- **Best for:** Most people (free, fast, easy)
- **Cost:** $0
- **Time:** 3 minutes
- **Instructions:** See "GET YOUR API KEY" section below
- **Limit:** 9,000 requests/day (you'll use ~70)

**OPTION B: Claude API**
- **Best for:** If you already have credits
- **Cost:** ~$1-5 for workshop
- **Time:** 5 minutes

**OPTION C: Local Ollama (Private)**
- **Best for:** If you want zero external API calls
- **Cost:** $0
- **Time:** 20 minutes
- **Requires:** Your machine

**OPTION D: Demo Mode (Just Works)**
- **Best for:** If you don't want to set anything up
- **Cost:** $0
- **Time:** 0 minutes
- **Note:** Pre-computed outputs, instant execution

---

## Get Your API Key

### If You Chose Groq:

**Step 1:** Visit https://console.groq.com/signup

**Step 2:** Sign up (3 minutes)
- Enter your email
- Verify email
- Set password
- Accept terms

**Step 3:** Create API key
- Click "API Keys" in left menu
- Click "Create New API Key"
- Name it "CFOPackV001"
- Copy the key (starts with `gsk_`)
- **Save it somewhere safe**

**Step 4:** Set in your environment

```bash
# macOS/Linux:
export GROQ_API_KEY='your_key_here'

# Windows PowerShell:
$env:GROQ_API_KEY='your_key_here'

# Windows CMD:
set GROQ_API_KEY=your_key_here
```

### If You Chose Claude:

**Full instructions:** See HOW_TO_GET_API_KEYS.md

**Quick:**
1. Go to https://console.anthropic.com
2. Sign up
3. Add payment method
4. Create API key
5. Set: `export ANTHROPIC_API_KEY='your_key'`

### If You Chose Ollama:

**Full instructions:** See HOW_TO_GET_API_KEYS.md

**Quick:**
```bash
# Install
curl -fsSL https://ollama.ai/install.sh | sh

# Download model
ollama pull mixtral

# Start server (keep running during workshop)
ollama serve
```

### If You Chose Demo Mode:

**Don't do anything.** Notebooks auto-fallback when no API key is set.

---

## Access the Notebooks

### Method 1: Colab (Easiest - Click & Run)

Click the button below to open each notebook:

**[Open N1 in Colab](https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N1_Import_and_Validate.ipynb)**

```
What happens:
1. Notebook opens in Google Colab
2. You click "Run" on each cell
3. It executes in the cloud
4. You see results instantly
5. No installation needed
```

### Method 2: GitHub (Read & Clone)

```bash
# Clone the repo
git clone https://github.com/VinayaSharada/KateelLearningDemosToStudents.git
cd KateelLearningDemosToStudents/CFOPackV001

# Install requirements
pip install pandas numpy scikit-learn requests

# Start Jupyter
jupyter notebook notebooks/
```

### Method 3: Local (Python IDE)

```bash
# If using VSCode, PyCharm, etc.
# Just open the notebook file and run
# Python should auto-detect and ask to install Jupyter

# Or use command line:
jupyter notebook notebooks/N1_Import_and_Validate.ipynb
```

---

## What You'll Learn

### N1: Import & Validate (15 min)
Learn how to:
- Load financial data from CSV
- Validate data quality
- Spot data issues before analysis

**Key Insight:** "Your data is only as good as its quality"

### N2: Baseline Forecast (20 min)
Learn how to:
- Build a cash forecast
- Spot timing risks
- Identify optimization opportunities

**Key Insight:** "Optimistic assumptions hide real problems"

### N3: Collections Intelligence (25 min)
Learn how to:
- Train ML models on historical data
- Predict payment behavior
- Find customer patterns

**Key Insight:** "Customers won't pay when you think they will"

### N4: Revised Forecast (15 min)
Learn how to:
- Update forecasts with realistic assumptions
- Measure impact of insights
- Identify gaps

**Key Insight:** "Reality is different from assumptions"

### N5: Working Capital Levers (20 min)
Learn how to:
- Model different operational solutions
- Compare trade-offs
- Prioritize by impact

**Key Insight:** "You can solve this with operational moves, not borrowing"

### N6: FX Hedging (15 min)
Learn how to:
- Manage currency risk
- Stay within policy
- Balance cost vs. protection

**Key Insight:** "Risk management is a trade-off, not a cost"

### N7: Decision Framework (15 min)
Learn how to:
- Synthesize analysis into clear recommendations
- Structure a memo for executives
- Present evidence-based decisions

**Key Insight:** "Your analysis only matters if you communicate it well"

### N8: Operationalization (20 min)
Learn how to:
- Plan implementation in phases
- Define success metrics
- Build monitoring/controls

**Key Insight:** "Analysis without execution is just a report"

---

## Pre-Workshop Verification

**Test your setup (5 minutes):**

```bash
# Test if Groq key works (if you chose Groq):
python -c "
from groq import Groq
import os

key = os.getenv('GROQ_API_KEY')
if key:
    print('✅ API key found')
    client = Groq(api_key=key)
    response = client.chat.completions.create(
        model='mixtral-8x7b-32768',
        messages=[{'role': 'user', 'content': 'hi'}],
        max_tokens=10
    )
    print('✅ API works! You are ready for the workshop.')
else:
    print('❌ API key not set. Run: export GROQ_API_KEY=your_key')
"
```

**Or just run a notebook:**

```bash
jupyter notebook notebooks/N1_Import_and_Validate.ipynb
# Click "Run" on first cell
# If it succeeds → you're ready
```

---

## During the Workshop

### Timeline

| Time | Activity | Duration |
|------|----------|----------|
| 0:00 | Welcome & Challenge | 10 min |
| 0:10 | N1: Import & Validate | 15 min |
| 0:25 | N2: Baseline Forecast | 20 min |
| 0:45 | N3: Collections Intelligence | 25 min |
| 1:10 | ☕ BREAK | 20 min |
| 1:30 | N4: Revised Forecast | 15 min |
| 1:45 | N5: Working Capital Levers | 20 min |
| 2:05 | N6: FX Hedging | 15 min |
| 2:20 | N7: Decision Framework | 15 min |
| 2:35 | N8: Operationalization | 20 min |
| 2:55 | CFO Pitch | 5 min |

### Pro Tips

1. **Read the notebook comments:** They explain WHAT, WHY, and HOW
2. **Don't just click Run:** Read the output and understand what's happening
3. **Ask questions:** If something confuses you, the instructor is there
4. **Take notes:** You'll want to remember this for your own work
5. **Try modifications:** Change some input data and re-run, see what changes

---

## Files You'll Need

The workshop uses synthetic data that's already provided:

```
CFOPackV001/data/synthetic/
├── invoices.csv          (50 outstanding invoices, $16.9M)
├── payments.csv          (200 historical payment records)
├── customers.csv         (13 customers, 5 industries)
├── cash_flow.csv         (14-day outflow schedule)
└── fx_exposure.csv       ($5.1M open FX positions)
```

**You don't need to download anything** - notebooks load them automatically.

---

## How to Use AI/Claude During the Workshop (Optional)

Some notebooks include optional prompts you can use with Claude to help interpret results.

**Examples:**

After N3 (Collections Intelligence):
```
Prompt: "Analyze these payment predictions and identify the top 3 risks"
[paste prediction results]

Claude can help you understand patterns you might have missed.
```

After N7 (Decision Framework):
```
Prompt: "Review this CFO memo and suggest improvements"
[paste memo text]

Claude can help you make it clearer and more persuasive.
```

**Files with prompts:**
- `claude_prompts/PRE_PIPELINE.md` - Before N1
- `claude_prompts/DURING_PIPELINE.md` - During N2-N6
- `claude_prompts/POST_PIPELINE.md` - After N7-N8

These are optional - the workshop works fine without them.

---

## After the Workshop

### What You Get

1. **Working notebooks** - Reusable for your own data
2. **Templates** - Decision memo, approval workflow, implementation checklist
3. **Synthetic data** - Reference dataset for examples
4. **Process understanding** - How to approach treasury decisions

### How to Use Later

**For your company:**

```
1. Get your real data (invoices, payments, cash flows, etc.)
2. Export as CSVs matching the format
3. Run notebooks with your data
4. Get your own decision memo, forecasts, recommendations
5. Present to your CFO (using the memo template)
6. Execute the implementation plan
```

**Time required:**
- First time: ~4 hours (including setup)
- Subsequent times: ~2 hours

**Cost:**
- If using Groq API: ~$0.01 per run
- If using Ollama local: $0
- If using demo mode: $0

### Customization

All notebooks are designed to be customized:

```
Each notebook has a "CUSTOMIZATION" section showing:
- Which parameters you can change
- How to modify the analysis
- What output changes if you adjust inputs
```

---

## Troubleshooting

### "API Key not found"

**Solution:**
```bash
# Make sure you set it correctly
export GROQ_API_KEY='your_key_here'

# Verify it's set
echo $GROQ_API_KEY

# Should print your key (first few chars)
```

### "ModuleNotFoundError"

**Solution:**
```bash
pip install pandas numpy scikit-learn groq
```

### "Notebook runs very slowly"

**Possible causes:**
1. Using Ollama (normal, takes 5-15 sec per response)
2. API rate limiting (wait a few seconds)
3. Poor internet connection

**Solution:**
- Try demo mode (instant, no API)
- Or switch API providers

### "I want to use my real company data"

**Instructions:**

```
1. Export your invoices as CSV with columns:
   invoice_id, customer_id, amount_usd, due_date, ...

2. Export your payments as CSV with columns:
   payment_id, invoice_id, amount_paid, payment_date, ...

3. In notebook, change:
   invoices = pd.read_csv('../data/synthetic/invoices.csv')
   
   To:
   invoices = pd.read_csv('your_invoices.csv')

4. Run notebook normally with your data

5. Get your own decision memo/forecasts
```

---

## Files Reference

### Main Files

| File | Purpose |
|------|---------|
| **N1_Import_and_Validate.py** | Load and assess data quality |
| **N2_Baseline_Forecast.py** | Optimistic cash forecast |
| **N3_Collections_Intelligence.py** | ML payment predictions |
| **N4_Revised_Forecast.py** | Realistic cash forecast |
| **N5_Working_Capital_Levers.py** | Scenario analysis |
| **N6_FX_Hedge_Decision.py** | Currency risk analysis |
| **N7_Decision_Framework.py** | Create CFO memo |
| **N8_Operationalize.py** | Implementation plan |

### Supporting Documents

| File | Purpose |
|------|---------|
| **README.md** | Overview of entire workshop |
| **HOW_TO_GET_API_KEYS.md** | Detailed API setup |
| **WORKSHOP_WALKTHROUGH.md** | What you'll see during workshop |
| **API_ALTERNATIVES_AND_FALLBACKS.md** | All API provider options |
| **IMPLEMENTATION_GUIDE_MULTI_API.md** | How notebooks work with multiple APIs |

### Templates (Use After Workshop)

| File | Purpose |
|------|---------|
| **templates/decision_memo_template.md** | Fill-in-the-blanks for your memo |
| **templates/approval_workflow_template.json** | Governance/approval process |
| **templates/operationalization_checklist.csv** | Task tracking |
| **templates/governance_framework.md** | Risk management |

---

## Contact & Support

### If You Have Questions

1. **Before workshop:**
   - Check HOW_TO_GET_API_KEYS.md
   - Check TROUBLESHOOTING section above
   - Email instructor

2. **During workshop:**
   - Ask instructor directly
   - Check notebook comments for guidance
   - Demo mode always available as fallback

3. **After workshop:**
   - Refer to notebook comments
   - Check templates for guidance
   - Contact instructor for complex questions

---

## Quick Reference

### API Setup (Choose One)

```bash
# GROQ (Recommended)
export GROQ_API_KEY='gsk_...'

# Claude
export ANTHROPIC_API_KEY='sk-ant-...'

# Local Ollama (no key needed)
ollama serve

# Demo mode (no setup needed)
# (just run, auto-fallbacks)
```

### Run Notebooks

```bash
# Colab (click link, click Run)
# No installation needed

# Local
jupyter notebook CFOPackV001/notebooks/
```

### Verify Setup

```bash
# Test API
python test_api_setup.py

# Should see: ✅ Groq API working
```

---

## Key Takeaways

After this workshop, you'll understand:

✅ How data quality impacts analysis  
✅ Why assumptions matter (baseline vs. realistic)  
✅ How to use ML for predictions  
✅ How to model trade-offs  
✅ How to structure CFO-ready decisions  
✅ How to plan implementation  
✅ How to measure success  

And you'll have **reusable templates and code** to apply this to your own treasury decisions.

---

## One More Thing

**This workshop teaches you to fish, not to give you fish.**

You'll learn:
- HOW to structure treasury analysis
- WHY each step matters
- WHEN to adjust the approach

So you can apply this to ANY treasury decision - not just this one scenario.

---

**Ready? Let's start!**

Next steps:
1. Choose your API option (3-5 min)
2. Get your API key
3. Click "Open in Colab" button
4. Start with N1: Import & Validate
5. Follow along with your instructor

See you at the workshop!

---

**Questions before we start?**
- Check HOW_TO_GET_API_KEYS.md
- Check TROUBLESHOOTING above
- Ask your instructor

Good luck! 🎯
