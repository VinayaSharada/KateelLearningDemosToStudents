# Complete Testing Checklist
## Verify Everything Works Before Workshop

**Use this checklist to ensure the entire CFOPackV001 package is ready to deliver.**

---

## Pre-Workshop Testing (1 Week Before)

### Documentation Files

- [ ] **START_HERE.md** exists and is readable
  - [ ] Check file size (should be 20-50KB)
  - [ ] Open in text editor and verify formatting
  - [ ] Count Colab buttons (should be 8)

- [ ] **INSTRUCTOR_QUICK_START.md** exists and is readable
  - [ ] Check file size (should be 15-30KB)
  - [ ] Verify checklists are clear
  - [ ] Check troubleshooting section

- [ ] **NOTEBOOK_HEADERS_WITH_COLAB_BUTTONS.md** exists
  - [ ] Contains templates for all 8 notebooks
  - [ ] Has URL structure examples

- [ ] **GENERATE_PDFs_AND_POWERPOINT.md** exists
  - [ ] Has correct pandoc commands
  - [ ] Has Python script for PowerPoint

### GitHub Repository Status

- [ ] Clone repo successfully
  ```bash
  git clone https://github.com/VinayaSharada/KateelLearningDemosToStudents.git
  cd KateelLearningDemosToStudents/CFOPackV001
  ```

- [ ] All 8 notebooks exist in `notebooks/` directory
  - [ ] N1_Import_and_Validate.ipynb
  - [ ] N2_Baseline_Forecast.ipynb
  - [ ] N3_Collections_Intelligence.ipynb
  - [ ] N4_Revised_Forecast.ipynb
  - [ ] N5_Working_Capital_Levers.ipynb
  - [ ] N6_FX_Hedge_Decision.ipynb
  - [ ] N7_Decision_Framework.ipynb
  - [ ] N8_Operationalize.ipynb

- [ ] Synthetic data files exist in `data/synthetic/`
  - [ ] invoices.csv (10,000 rows: 8,000 paid + 2,000 outstanding)
  - [ ] payments.csv (8,200 rows: 8,000 invoice-linked + 200 unrelated)
  - [ ] customers.csv (148 rows across 5 industries)
  - [ ] cash_flow.csv (30 rows: 30-day outflow schedule)
  - [ ] fx_exposure.csv (4 rows: EUR, GBP, JPY, INR)

- [ ] Templates exist in `templates/`
  - [ ] decision_memo_template.md
  - [ ] operationalization_checklist.csv
  - [ ] approval_workflow_template.json
  - [ ] governance_framework.md
  - [ ] bank_reconciliation_prompt_template.txt

### Colab Links (Test Each One)

Test that each Colab button works:

#### N1: Import & Validate
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N1_Import_and_Validate.ipynb
- [ ] Notebook opens in Colab ✓
- [ ] Can read first cell ✓
- [ ] Code cells are visible ✓

#### N2: Baseline Forecast
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N2_Baseline_Forecast.ipynb
- [ ] Opens correctly ✓
- [ ] Can see all cells ✓

#### N3: Collections Intelligence
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N3_Collections_Intelligence.ipynb
- [ ] Opens correctly ✓
- [ ] Can see all cells ✓

#### N4: Revised Forecast
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N4_Revised_Forecast.ipynb
- [ ] Opens correctly ✓

#### N5: Working Capital Levers
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N5_Working_Capital_Levers.ipynb
- [ ] Opens correctly ✓

#### N6: FX Hedging
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N6_FX_Hedge_Decision.ipynb
- [ ] Opens correctly ✓

#### N7: Decision Framework
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N7_Decision_Framework.ipynb
- [ ] Opens correctly ✓

#### N8: Operationalize
- [ ] Click button: https://colab.research.google.com/github/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/notebooks/N8_Operationalize.ipynb
- [ ] Opens correctly ✓

---

## API Setup Testing (1 Week Before)

### Groq API Setup

- [ ] Create Groq account: https://console.groq.com/signup
- [ ] Get API key from dashboard
- [ ] Set environment variable: `export GROQ_API_KEY='gsk_...'`
- [ ] Test API with verification command:
  ```bash
  python -c "
  from groq import Groq
  import os
  key = os.getenv('GROQ_API_KEY')
  if key:
      print('✅ Groq API key is set')
      client = Groq(api_key=key)
      response = client.chat.completions.create(
          model='mixtral-8x7b-32768',
          messages=[{'role': 'user', 'content': 'test'}],
          max_tokens=10
      )
      print('✅ Groq API works')
  else:
      print('❌ Groq API key not set')
  "
  ```
  - [ ] Shows: `✅ Groq API is set`
  - [ ] Shows: `✅ Groq API works`

### Claude API Setup (Optional)

- [ ] Create account: https://console.anthropic.com
- [ ] Add payment method
- [ ] Get API key
- [ ] Set environment variable: `export ANTHROPIC_API_KEY='sk-ant-...'`
- [ ] Test with similar verification command

### Ollama Setup (Optional)

- [ ] Install ollama: https://ollama.ai
- [ ] Download model: `ollama pull mixtral`
- [ ] Start server: `ollama serve`
- [ ] Test connectivity:
  ```bash
  curl http://localhost:11434/api/tags
  ```
  - [ ] Should return model list

### Demo Mode

- [ ] Unset all API keys:
  ```bash
  unset GROQ_API_KEY
  unset ANTHROPIC_API_KEY
  ```
- [ ] Run any notebook without API keys
- [ ] Should auto-fallback to demo mode
- [ ] Pre-computed outputs should display

---

## Notebook Execution Testing (3-5 Days Before)

### Execute Each Notebook (Test Run)

#### N1: Import & Validate
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Data loaded successfully
  - [ ] Quality score displayed (should be 95+)
  - [ ] No errors
- [ ] Generated files:
  - [ ] N1_validated_data.csv created
  - [ ] Summary displayed

#### N2: Baseline Forecast
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Forecast generated
  - [ ] Daily cash positions shown
  - [ ] Minimum cash calculated
- [ ] Generated files:
  - [ ] N2_baseline_forecast.csv created

#### N3: Collections Intelligence
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Model trains successfully
  - [ ] Accuracy displayed
  - [ ] Feature importance shown
  - [ ] Predictions generated
  - [ ] At-risk customers listed
- [ ] Generated files:
  - [ ] N3_invoice_payment_predictions.csv created

#### N4: Revised Forecast
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Revised forecast shown
  - [ ] Gap analysis displayed
  - [ ] Crisis timeline identified

#### N5: Working Capital Levers
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Scenarios modeled
  - [ ] Impact calculated
  - [ ] Recommendation shown

#### N6: FX Hedging
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Exposure analyzed
  - [ ] Hedge scenarios shown
  - [ ] Recommendation made

#### N7: Decision Framework
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Decision memo generated
  - [ ] File N7_decision_memo.md created
  - [ ] Memo is readable and complete

#### N8: Operationalize
- [ ] Open in Colab
- [ ] Run all cells
- [ ] Check output:
  - [ ] Implementation plan generated
  - [ ] Tasks listed with owners
  - [ ] Monitoring framework defined

---

## Data Loading Testing (2-3 Days Before)

### Verify Data Loads from GitHub

```bash
# Test each file loads from GitHub URL
python -c "
import pandas as pd

files = {
    'invoices': 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic/invoices.csv',
    'payments': 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic/payments.csv',
    'customers': 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic/customers.csv',
    'cash_flow': 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic/cash_flow.csv',
    'fx_exposure': 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic/fx_exposure.csv'
}

for name, url in files.items():
    try:
        df = pd.read_csv(url)
        print(f'✅ {name}: {len(df)} rows')
    except Exception as e:
        print(f'❌ {name}: {e}')
"
```

Expected output:
```
✅ invoices: 50 rows
✅ payments: 200 rows
✅ customers: 13 rows
✅ cash_flow: 14 rows
✅ fx_exposure: 4 rows
```

---

## PDF & PowerPoint Generation Testing (2-3 Days Before)

### Generate PDFs

- [ ] Install pandoc
- [ ] Generate student PDF:
  ```bash
  pandoc START_HERE.md -o CFOPackV001_Student_Guide.pdf
  ```
  - [ ] File created
  - [ ] File size 5-10 MB
  - [ ] Opens and displays correctly

- [ ] Generate instructor PDF:
  ```bash
  pandoc INSTRUCTOR_QUICK_START.md -o CFOPackV001_Instructor_Guide.pdf
  ```
  - [ ] File created
  - [ ] File size 5-10 MB
  - [ ] Opens and displays correctly

### Generate PowerPoint

- [ ] Install python-pptx: `pip install python-pptx`
- [ ] Run generation script:
  ```bash
  python generate_presentation.py
  ```
  - [ ] File created: CFOPackV001_Workshop_Briefing.pptx
  - [ ] Opens in PowerPoint
  - [ ] Has all 14 slides
  - [ ] Text is readable
  - [ ] No corruption

---

## Day-Before Checklist

### Internet & Tech

- [ ] Test internet speed (should be >5 Mbps)
- [ ] Verify Colab access (open one notebook)
- [ ] Test projector connection
- [ ] Test audio (if using laptop speakers)
- [ ] Test wifi reliability (if using wireless)

### Materials

- [ ] Print START_HERE.md (for reference)
- [ ] Print INSTRUCTOR_QUICK_START.md (for your notes)
- [ ] Print first page of student guide (for backup)
- [ ] Have PowerPoint slides ready (or markdown on screen)
- [ ] Have backup Groq API key ready

### Backup Plans

- [ ] Demo mode pre-tested (works without API)
- [ ] Pre-computed outputs saved (for demo fallback)
- [ ] GitHub repo cloned locally (if internet fails)
- [ ] Notebooks downloaded locally (backup execution)

### Communication

- [ ] Email sent to students with START_HERE.md
- [ ] Confirmed student responses (how many set up API?)
- [ ] Have email list for follow-up

---

## Day-Of Checklist (1 Hour Before)

### 60 Minutes Before Workshop

- [ ] Arrive early
- [ ] Set up computer and projector
- [ ] Test one Colab button (click and load)
- [ ] Verify Groq API key is set
- [ ] Test first notebook cell runs successfully
- [ ] Have printed materials ready
- [ ] Have backup key ready
- [ ] Check room temperature (important for focus!)

### 30 Minutes Before Workshop

- [ ] Open presentation/slides
- [ ] Open START_HERE.md on screen
- [ ] Open first Colab notebook in browser tab
- [ ] Have 2 browser tabs open:
  1. GitHub repo
  2. First Colab notebook
- [ ] Verify all 8 Colab buttons work (quick click test)
- [ ] Welcome materials on screen/projector

### 5 Minutes Before Workshop

- [ ] All systems go
- [ ] Presentation ready
- [ ] Colab ready
- [ ] API key verified
- [ ] Demo mode as fallback
- [ ] You're ready!

---

## During-Workshop Monitoring

### Keep This Running

- [ ] Browser with Colab notebook open
- [ ] Monitor for student issues:
  - [ ] API key problems
  - [ ] Slow execution
  - [ ] Data loading errors
- [ ] Have INSTRUCTOR_QUICK_START.md troubleshooting ready
- [ ] Keep backup Groq key in case student keys fail
- [ ] Monitor timing (hit 3-hour target)

### If Things Go Wrong

- [ ] Use troubleshooting section from INSTRUCTOR_QUICK_START.md
- [ ] Switch to demo mode (instant, pre-computed)
- [ ] Use backup Groq API key
- [ ] Refer to documentation links

---

## Post-Workshop

- [ ] Collect feedback from students
- [ ] Document any issues encountered
- [ ] Note API key problems (if any)
- [ ] Plan improvements for next workshop
- [ ] Send follow-up email with links

---

## Scoring

**PASS:** All items checked  
**CAUTION:** 1-2 items not checked (but understand why)  
**FAIL:** 3+ items unchecked (needs investigation)

If CAUTION or FAIL, investigate before workshop day.

---

## Common Issues & Fixes

### "Colab button doesn't work"
**Fix:** Check GitHub username and repo name in URL are correct

### "Data doesn't load in Colab"
**Fix:** GitHub URLs are correct? Internet working? Switch to demo mode

### "API key error in notebook"
**Fix:** Verify key is set correctly? Try backup key? Switch to demo mode

### "Notebook runs slowly"
**Fix:** Normal for Phi-3. Demo mode runs instantly. Colab sometimes slow

### "Error in N3 (ML module)"
**Fix:** Most common - data/API issue. Demo mode works. Try N1-N2 first

### "I don't have all 8 notebooks"
**Fix:** Clone GitHub repo fresh? Check notebooks/ directory

### "PDFs won't generate"
**Fix:** Install pandoc? Python script installed? Try Google Docs → PDF instead

---

## Final Verification

Before you step into the workshop:

```
✅ All 8 Colab links tested and working
✅ At least one notebook runs start-to-finish
✅ API key works (Groq, Claude, or local Ollama)
✅ Demo mode works without API
✅ Synthetic data loads from GitHub
✅ PDFs generated (or Google Docs alternative)
✅ PowerPoint ready (or using markdown)
✅ INSTRUCTOR_QUICK_START.md printed/ready
✅ Materials sent to students
✅ Projector/audio tested
✅ Backup API key ready
✅ You're confident and prepared

GO TEACH!
```

---

**If you can check all boxes above, you're ready to deliver an excellent workshop.**

Good luck! 🎯
