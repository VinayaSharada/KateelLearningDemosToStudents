# CFOPackV001: Instructor Quick Start Guide

**Everything you need to deliver the workshop**

---

## Pre-Workshop (1 Week Before)

### Send to Students

```
Subject: CFOPackV001 Treasury Workshop - Getting Ready

Hi everyone,

Here's what you need to do before the workshop:

1. READ: https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/START_HERE.md
   (Takes 5 minutes, has everything you need)

2. SETUP: Get an API key (choose one):
   - Groq (recommended, free): https://console.groq.com/signup
   - Ollama (private, free): https://ollama.ai
   - Or skip and use demo mode (works without setup)

3. TEST: Make sure your setup works
   - Run the test command in START_HERE.md
   - If it fails, demo mode will handle it

4. CHECK: Click one Colab button to make sure you can open notebooks

That's it! See you at the workshop.

[Your name]
```

---

## Day Before Workshop

### Checklist

- [ ] Test Colab links (click each button, verify notebooks load)
- [ ] Create Groq account (as backup, in case student keys fail)
- [ ] Test your Groq key with a notebook run
- [ ] Prepare slides ([INSTRUCTOR_PRESENTATION_OUTLINE.md](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/INSTRUCTOR_PRESENTATION_OUTLINE.md))
- [ ] Download/print Colab links (backup if internet fails)
- [ ] Test internet/projector/audio
- [ ] Have coffee ready ☕

### Files to Have Ready

```
Required:
├─ START_HERE.md (for troubleshooting reference)
├─ HOW_TO_GET_API_KEYS.md (for API questions)
├─ Presentation slides (PowerPoint from INSTRUCTOR_PRESENTATION_OUTLINE.md)
└─ Groq API key (backup, for shared key if student keys fail)

Optional:
├─ NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md (customization questions)
├─ WORKSHOP_WALKTHROUGH.md (full walkthrough)
└─ API_ALTERNATIVES_AND_FALLBACKS.md (alternative providers)
```

---

## 30 Minutes Before Workshop

### Setup

1. **Open in browser:**
   - GitHub repo: https://github.com/VinayaSharada/KateelLearningDemosToStudents/tree/main/CFOPackV001
   - First Colab link (N1): Ready to click and demo

2. **Test one notebook**
   - Click Colab button
   - Notebook should open
   - Run first cell to verify

3. **Have backup ready**
   - Saved HTML of notebooks (in case internet fails)
   - Pre-computed outputs ([N0.5_RECONCILIATION_RESULTS_SAMPLE.md](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/N0.5_RECONCILIATION_RESULTS_SAMPLE.md))

---

## Start of Workshop (0:00 - 0:10)

### Deliver Presentation (10 minutes)

Use [INSTRUCTOR_PRESENTATION_OUTLINE.md](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/INSTRUCTOR_PRESENTATION_OUTLINE.md):

**Slides to cover (in order):**
1. Title (1 min)
2. The Scenario (2 min) - Make it real
3. What You'll Accomplish (1 min) - Show value
4. Timeline (1 min) - Show pacing
5. What's in Each Module (1 min) - Explain flow
6. Tech Setup (1 min) - Colab emphasis
7. Let's Begin (2 min) - Energy & transition

**Key points:**
- "This is hands-on, not a lecture"
- "Data-driven beats hunches"
- "You'll leave with reusable templates"
- "Demo mode always works if APIs fail"

---

## Module Flow (0:10 - 2:55)

### Standard Module Pattern (15-25 min each)

For EACH module (N1-N8):

```
EXPLAIN (2-3 min):
  "This module does X because Y. It uses Z as input."
  
DEMO (1-2 min):
  "Watch me run the first cell..."
  "See what we get as output..."
  
YOU RUN (10-15 min):
  "Now you follow along and run each cell"
  "Read the output and understand what it means"
  "Ask questions when stuck"
  
DISCUSS (1-2 min):
  "What did you notice?"
  "What does this tell us?"
  "How does this change our thinking?"
```

### Timing Targets

| Module | Time | Notes |
|--------|------|-------|
| N1 Import & Validate | 15 min | Data quality focus |
| N2 Baseline Forecast | 20 min | Show the "problem" |
| N3 Collections Intelligence | 25 min | ML demo, most technical |
| BREAK | 20 min | Halfway point |
| N4 Revised Forecast | 15 min | Show reality vs. optimism |
| N5 Working Capital Levers | 20 min | Show solutions |
| N6 FX Hedging | 15 min | Quick decision |
| N7 Decision Framework | 15 min | Synthesize everything |
| N8 Operationalize | 20 min | Make it actionable |

**Total: 2h 45m + 20m break = 3h 5m** (leaves 5 min buffer)

---

## Handling Issues

### "API Key Doesn't Work"

**Immediate action:**
```
Option 1: Use shared Groq key
  "Here's a backup key to use: [your key]"
  
Option 2: Switch to demo mode
  "Let's run demo mode instead - pre-computed outputs"
  
Option 3: Use local Ollama
  "If you installed Ollama, it will auto-detect"
```

### "Internet is Down"

**Fallback:**
```
1. Switch to local Jupyter (if Python installed)
2. Use downloaded HTML notebooks
3. Run demo mode (pre-computed outputs)
4. Use printed materials

"We'll pause and get this working - don't worry"
```

### "Student Gets Stuck"

**Debug approach:**
```
1. Check error message (read it together)
2. If it's API key: "Let's use the shared key"
3. If it's data: "Check the file path"
4. If it's code: "Read the comments in the cell"
5. Last resort: "Skip to next module, we'll come back"

"This happens to professional data scientists too - 
 it's part of the workflow"
```

### "Student Finishes Early"

**Give them:**
```
Challenge: "Try changing the model parameters in N3"
Challenge: "What if we use a different threshold in N5?"
Challenge: "How would you adapt this for your company?"
Extension: "Read [NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md)"
```

### "I Don't Understand the Output"

**Bridge the gap:**
```
"That's the whole point of this module. Let me explain."

Then read the cell output together:
  - "See this number? That's [interpretation]"
  - "This tells us [business meaning]"
  - "It affects our decision because [impact]"
  
"Does that make sense now?"
```

---

## 10-Minute Break (1:30-1:50)

### What to Do

- Let students stretch, use restroom
- Get coffee/water
- Reset your energy
- Quick sound/tech check
- Answer individual questions if any

### Don't

- Don't extend the break (stay on schedule)
- Don't run a module during break
- Don't go silent (come back with energy)

---

## End of Workshop (2:55 - 3:00)

### CFO Pitch

**Pick one approach:**

**Option A: Individual Pitches (2 min each)**
```
"Each of you pitch the CFO on what you found"
"90 seconds - focus on the problem and solution"
```

**Option B: Group Presentation (5 min)**
```
"As a team, present your findings"
"What's the problem? What's your recommendation?"
```

**Option C: Discussion (5 min)**
```
"How would you present this to YOUR CFO?"
"What would they care about most?"
```

### Wrap Up

```
"You just did in 3 hours what takes most teams a week.

You:
✓ Analyzed $16.9M in financial data
✓ Built ML predictions
✓ Modeled scenarios
✓ Created a CFO-ready decision
✓ Planned implementation

And you have reusable notebooks to take home.

In 2-3 weeks, you can run this same analysis on 
YOUR company's real data.

That's the power of this process.

Great work today!"
```

---

## After Workshop

### Collect Feedback (2 min)

Quick survey:
```
1. On scale 1-5, how clear was the material?
2. What was most useful?
3. What would you improve?
4. Will you use this with real data?
```

### Send Follow-Up Email

```
Subject: CFOPackV001 - Resources & Next Steps

Hi everyone,

Great work today! Here's what to do next:

REFERENCE MATERIALS:
- GitHub Repo: [link]
- START_HERE.md: [link]
- All notebooks: [links]

TRY IT WITH YOUR DATA:
1. Export invoices/payments as CSV
2. Load into notebooks
3. Run the analysis
4. Get your CFO memo

QUESTIONS:
Email me anytime - I'm happy to help you adapt this
for your company's situation.

Thanks for a great workshop!

[Your name]
```

---

## Key Principles

### Do This

✅ **Explain the WHY, not just the WHAT**
- "We're doing this because..."
- "This matters because..."
- "The business impact is..."

✅ **Pause and check for understanding**
- "Does that make sense?"
- "Any questions?"
- "What did you notice?"

✅ **Connect to real work**
- "Your company probably has this same issue"
- "You could use this next week"
- "This is what your CFO actually needs"

✅ **Celebrate progress**
- "You just built an ML model"
- "That forecast took hours to build 10 years ago"
- "You're thinking like a data scientist now"

✅ **Make it safe to ask questions**
- "This is technical - questions are good"
- "I don't know either - let's figure it out"
- "That's a great question"

### Don't Do This

❌ **Don't read the code line by line**
- "We're not here to learn Python syntax"
- "The code is documented, just read it"
- "Click Run and understand the output"

❌ **Don't go too deep into math**
- "Random Forest uses decision trees"
- "Trust that it works (accuracy is 85%)"
- "Focus on using the prediction, not how it works"

❌ **Don't let perfect be the enemy of good**
- "This model isn't perfect, but it's useful"
- "Real data is messy - this handles it"
- "Good enough for decision-making wins"

❌ **Don't blame technical issues on the participant**
- "API failed? That's not your fault"
- "Internet down? Not your problem"
- "We have fallbacks - we'll move on"

---

## Energy Management

### Keep Them Engaged

**At 0:45 (mid-way through N2)**
- "We're discovering the problem now"
- Energy should be building

**At 1:30 (break time)**
- "You're halfway through - doing great!"
- "When we come back, we solve it"

**At 2:00 (after break, starting N4)**
- "Now the real fun begins - we fix the problem"
- High energy here (post-break slump)

**At 2:30 (final modules)**
- "You're in the home stretch"
- Finish strong

### Your Tone

- **0:00-0:30:** Introductory (warm, welcome)
- **0:30-1:30:** Educational (clear, thorough)
- **1:30-2:00:** Energizing (post-break boost)
- **2:00-2:55:** Problem-solving (collaborative, excited)
- **2:55-3:00:** Celebratory (proud, forward-looking)

---

## Troubleshooting Reference

### "Where is the synthetic data?"
Answer: "It's in the notebooks automatically. When the notebook runs, it loads the CSVs from GitHub."

Link: [CFOPackV001/data/synthetic](https://github.com/VinayaSharada/KateelLearningDemosToStudents/tree/main/CFOPackV001/data/synthetic)

### "Can I download the notebooks?"
Answer: "Yes, clone the repo or download as ZIP from GitHub. All code is yours to use."

Link: [GitHub Clone](https://github.com/VinayaSharada/KateelLearningDemosToStudents)

### "How do I customize this for my company?"
Answer: "Replace the CSV files with your data and re-run. It's that simple."

Details: [NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md)

### "Will this work with real data?"
Answer: "Yes, absolutely. The notebooks work with any invoice/payment CSV."

See: [START_HERE.md - Customization for Your Company](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/START_HERE.md)

### "What if I don't have an API key?"
Answer: "Demo mode works without setup. Pre-computed outputs run instantly."

Details: [HOW_TO_GET_API_KEYS.md - Option D: Demo Mode](https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/HOW_TO_GET_API_KEYS.md)

---

## Quick Reference: All Links

**For Students to Share:**
- `START_HERE.md`: Everything they need
  👉 https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/START_HERE.md

**For Your Presentation:**
- `INSTRUCTOR_PRESENTATION_OUTLINE.md`: 14 slides
  👉 https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/INSTRUCTOR_PRESENTATION_OUTLINE.md

**For Detailed Setup:**
- `HOW_TO_GET_API_KEYS.md`: All API options
  👉 https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/HOW_TO_GET_API_KEYS.md

**For Customization:**
- `NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md`: How to adapt
  👉 https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/NOTEBOOK_TEMPLATE_WITH_DOCUMENTATION.md

**For Full Overview:**
- `README.md`: Complete documentation
  👉 https://github.com/VinayaSharada/KateelLearningDemosToStudents/blob/main/CFOPackV001/README.md

---

## Success Metrics

**After the workshop:**

✅ Students can open Colab and run a notebook  
✅ Students understand the 8-module flow  
✅ Students can explain the CFO decision  
✅ Students have working notebooks to take home  
✅ Students know how to apply to real data  
✅ Students feel confident and capable  

**If any of above are missing:**
- Send follow-up email with resources
- Offer 1-on-1 help
- Point to documentation
- You're not done until they succeed

---

## Final Thoughts

**Your job is to:**
1. Build excitement for data-driven decisions
2. Explain the workflow (not the code)
3. Show them what's possible
4. Give them tools to use it

**You're not teaching:**
- Python syntax
- ML theory
- Financial accounting

**You ARE teaching:**
- How to think like a data analyst
- How to communicate with CFOs
- How to automate decisions
- How to build reusable processes

**If you get nothing else right, get THIS right:**
- Everyone leaves feeling "I could do this"
- Everyone leaves with working code
- Everyone knows how to apply it

Good luck! You've got this. 🎯

---

**Need anything?**
- Check the GitHub repo for all files
- Email if you have questions
- File issues if you find problems
- Contribute back if you improve something

**This is open source. Share and improve!**
