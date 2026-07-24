# CFOPackV001 Instructor Presentation
## 3-Hour Treasury Workshop - Participant Briefing

**Duration:** 10 minutes (before workshop starts)  
**Audience:** Participants  
**Goal:** Set context, show what they'll accomplish, answer setup questions

---

## Slide 1: Title & Welcome

```
CFOPackV001: Treasury Decision Workshop
Data-Driven Decisions in 3 Hours

Welcome! Today you'll learn to make evidence-based treasury decisions.
```

**Speaker Notes:**
- Introduce yourself
- Thank participants for coming
- Set positive tone: "This is hands-on, not a lecture"

---

## Slide 2: The Scenario (The Problem)

```
IT'S MONDAY 9 AM...

Your CFO calls an emergency meeting:
  
"We might have a cash crisis next week.
I need an action plan by noon.
Walk me through our options."

THE QUESTION:
What's the best move?

THE CHALLENGE:
You have 3 hours and a mountain of data.
```

**Speaker Notes:**
- Read the scenario
- Pause and let it sink in
- This is a REAL situation that treasuries face
- The clock is ticking (9 AM → 12 PM)

---

## Slide 3: What You'll Accomplish

```
BY THE END OF TODAY, YOU'LL HAVE:

✓ DATA ANALYSIS
  - Loaded and validated $16.9M in customer invoices
  - Quality-checked payment history
  
✓ PREDICTIONS
  - Built ML model predicting when customers will pay
  - Identified customers paying 12+ days late (vs. on-time assumption)
  
✓ FINANCIAL MODELING
  - Current forecast shows $495K cash shortfall
  - Tested operational levers to close the gap
  
✓ CFO-READY MEMO
  - Evidence-based decision with clear recommendations
  - Implementation plan with owners and timelines
  - Governance framework with monitoring
  
✓ REAL TEMPLATES
  - Decision memo template (reuse for your decisions)
  - Implementation checklist
  - Monitoring framework
```

**Speaker Notes:**
- This isn't theoretical
- You'll have REAL ARTIFACTS you can use at work
- These templates work for any treasury decision

---

## Slide 4: The 3-Hour Timeline

```
WORKSHOP SCHEDULE

09:00-09:10  Welcome & Challenge Briefing           (10 min)
09:10-09:25  N1: Import & Validate Data            (15 min)
09:25-09:45  N2: Baseline Forecast                 (20 min)
09:45-10:10  N3: Collections Intelligence (ML)     (25 min)
10:10-10:30  ☕ BREAK & Stretch                    (20 min)
10:30-10:45  N4: Revised Forecast                  (15 min)
10:45-11:05  N5: Working Capital Levers            (20 min)
11:05-11:20  N6: FX Hedging Decision               (15 min)
11:20-11:35  N7: Decision Framework & Memo        (15 min)
11:35-11:55  N8: Operationalization Plan          (20 min)
11:55-12:00  CFO Pitch Presentation                (5 min)

TOTAL: 3 HOURS (with break)
```

**Speaker Notes:**
- Packed but manageable schedule
- Each module builds on previous
- Break happens halfway
- Everyone gets to present at the end

---

## Slide 5: What's in Each Module?

```
N1: IMPORT & VALIDATE
├─ Load 5 CSV files (invoices, payments, customers, etc.)
├─ Check data quality (is it clean?)
└─ Find issues BEFORE analysis

N2: BASELINE FORECAST  
├─ Build 14-day cash forecast
├─ Assume all customers pay on time
└─ See what "perfect case" looks like

N3: COLLECTIONS INTELLIGENCE (ML)
├─ Train model on payment history
├─ Predict which invoices will be late
└─ Identify customers paying 12 days late (not on time!)

N4: REVISED FORECAST
├─ Rebuild forecast with REALISTIC payment timing
├─ Compare: Baseline vs. Reality
└─ Discover: $495K cash gap + 5-day timeline

N5: WORKING CAPITAL LEVERS
├─ Model three operational solutions:
│  ├─ Collections (faster dunning)
│  ├─ Inventory (reduce stock)
│  └─ Payables (extend supplier terms)
└─ Pick the best combination

N6: FX HEDGING
├─ Analyze open currency exposures
├─ Recommend hedge ratio
└─ Balance cost vs. protection

N7: DECISION FRAMEWORK
├─ Synthesize all analysis
├─ Write CFO-ready memo (212 lines!)
└─ Package evidence for executive decision

N8: OPERATIONALIZATION
├─ Create 15-task implementation plan
├─ Define roles, timelines, success metrics
└─ Build monitoring dashboard & escalation rules
```

**Speaker Notes:**
- Each takes 15-25 minutes
- Each builds on the previous
- By the end, you have a complete decision package

---

## Slide 6: The Journey (The Arc)

```
START:              "We might have a cash problem"
                    (Concern, no data)

N1-N2:              "The data says there IS a problem"
                    (Validated $495K gap)

N3-N4:              "And it's worse than we thought"
                    (Hits in 5 days, not 14)

N5-N6:              "But we can fix it"
                    (Three operational solutions)

N7:                 "Here's the recommendation"
                    (CFO memo with evidence)

N8:                 "Here's how to execute"
                    (Implementation plan)

END:                "Confidence + Action Plan"
                    (Ready to present to CFO)
```

**Speaker Notes:**
- This is a NARRATIVE
- Not disconnected exercises
- Each builds toward a decision
- By the end, you're not just analyzing—you're recommending

---

## Slide 7: What You'll Learn

```
TECHNICAL SKILLS:
  ✓ Data validation & quality checks
  ✓ Time-series forecasting
  ✓ Machine learning (Random Forest model)
  ✓ Scenario modeling & trade-off analysis
  ✓ Structured decision-making

BUSINESS SKILLS:
  ✓ How to identify treasury risks
  ✓ How to quantify impact
  ✓ How to model operational solutions
  ✓ How to structure executive decisions
  ✓ How to plan implementation

PROFESSIONAL SKILLS:
  ✓ Communicating with CFOs
  ✓ Evidence-based decision-making
  ✓ Risk management & governance
  ✓ Project planning & monitoring

KEY INSIGHT:
Data + Analysis + Clear Communication = Confident Decisions
```

**Speaker Notes:**
- This isn't just coding
- This isn't just finance
- This is executive communication + analysis
- These skills transfer to ANY treasury decision

---

## Slide 8: Your Data (Synthetic but Realistic)

```
WHAT YOU'LL ANALYZE:

Invoices:              50 outstanding
  Total AR:            $16.9M
  # of Customers:      13 (across 5 industries)
  Amount Range:        $75K-$1.2M

Customers:
  Payment History:     12 months (200 paid invoices)
  Avg Days Late:       8.6 days
  Payment Variance:    High (some on-time, some 20+ days)

Cash Flows:
  14-day Outflow:      $8.18M (scheduled payments)
  Starting Cash:       $5M
  Minimum Forecast:    $0 (Cash crisis if no action)

FX Exposure:
  Total:               $5.1M
  Currencies:          EUR, GBP, JPY, CAD
  Current Hedges:      Varies 0-75% by currency
```

**Speaker Notes:**
- Realistic complexity
- Not oversimplified toy data
- Similar to real treasury situations
- Students can use this to practice

---

## Slide 9: Technology Setup (Quick Briefing)

```
NO SETUP REQUIRED IF USING DEMO MODE

THREE WAYS TO RUN NOTEBOOKS:

Option 1: Colab (EASIEST - Recommended)
  • Click "Open in Colab" button
  • No installation needed
  • Just click "Run"
  • Works in web browser

Option 2: Local Jupyter
  • Install Python, Jupyter
  • Run: jupyter notebook
  • Same notebooks, on your computer

Option 3: Demo Mode (NO SETUP AT ALL)
  • Don't set any API key
  • Pre-computed outputs
  • Instant execution

ABOUT API KEYS (Optional):
  You CAN enhance with live LLM inference:
    ✓ Groq (free, recommended)
    ✓ Claude API (if you have credits)
    ✓ Local Ollama (for privacy)
  
  BUT NOT REQUIRED - Demo mode always works.
```

**Speaker Notes:**
- Emphasize: No setup required
- Colab is easiest (just click)
- API keys are optional enhancement
- No one gets left behind

---

## Slide 10: Your Role (Participant Expectations)

```
DURING THE WORKSHOP:

DO:
  ✓ Follow along and run the notebooks
  ✓ Read the outputs and understand them
  ✓ Ask questions when stuck
  ✓ Experiment (try changing some values)
  ✓ Take notes (you'll want to remember this)

DON'T:
  ✗ Don't just click "Run All" and ignore output
  ✗ Don't panic if something looks technical
  ✗ Don't worry about coding (there's minimal coding)
  ✗ Don't hesitate to ask for help
  ✗ Don't feel like you need to understand EVERYTHING

MINDSET:
  "I'm learning a workflow and decision framework,
   not mastering machine learning."
```

**Speaker Notes:**
- Normalize questions
- Emphasize that this is collaborative
- No one will be left behind
- "Reading and understanding" is more important than coding

---

## Slide 11: What You'll Take Home

```
AFTER THE WORKSHOP:

FILES:
  ✓ 8 working Jupyter notebooks (reusable)
  ✓ Synthetic data for reference
  ✓ Your outputs from the workshop

TEMPLATES:
  ✓ Decision memo template (fill-in-the-blanks)
  ✓ Implementation plan checklist
  ✓ Monitoring framework
  ✓ Governance framework

PROCESS:
  ✓ Step-by-step decision-making workflow
  ✓ How to adapt for your own data
  ✓ When to use each tool

USE AT WORK:
  In 2-3 weeks, you can run this same analysis
  with YOUR company's real data:
  
  1. Export your invoices as CSV
  2. Export your payment history as CSV
  3. Load into notebooks
  4. Get YOUR decision memo
  5. Present to YOUR CFO
  
  Time required: ~2 hours (you've seen it before)
  Cost: Free (using Groq or local Ollama)
```

**Speaker Notes:**
- These aren't throwaway exercises
- This is a reusable toolkit
- They can practice immediately
- No one leaves empty-handed

---

## Slide 12: Questions Before We Start

```
COMMON QUESTIONS:

Q: Will this take 3 hours?
A: Yes, it's designed to use all 3 hours efficiently.
   Includes a break midway.

Q: Do I need coding skills?
A: No. You'll click "Run" and read outputs.
   Almost zero coding required.

Q: What if I get stuck?
A: Ask. That's what I'm here for.
   Plus, we have demo mode as a backup.

Q: Can I use this with real data?
A: Yes! That's the whole point.
   Instructions are included.

Q: Will I understand the ML part?
A: Yes. I'll explain it clearly.
   It's Random Forest - simple concept, powerful results.

Q: What's the tech requirement?
A: Just a web browser (for Colab).
   Or Python if you want to run locally.

Q: What if APIs don't work?
A: Demo mode auto-kicks in. No worries.

ANY OTHER QUESTIONS?
```

**Speaker Notes:**
- Address common concerns
- Reassure about tech
- Emphasize support
- Open floor for questions

---

## Slide 13: Let's Begin!

```
YOU'RE ABOUT TO:

1. Load real financial data
2. Find patterns others missed
3. Make data-driven decisions
4. Create a CFO presentation
5. Plan implementation

IN THREE HOURS.

NO PRESSURE. 😊

LET'S DO THIS.

→ Let's start with N1: Import & Validate
→ Go to Colab link (click "Open in Colab" button)
→ Run the first notebook
```

**Speaker Notes:**
- Energy and enthusiasm
- Make it feel achievable
- Preview what's coming
- Transition to first notebook

---

## Slide 14: Logistics (Last Slide)

```
QUICK LOGISTICS:

BREAK:             10:10-10:30 (20 minutes)
                   Coffee, restroom, stretch

QUESTIONS:         Anytime - don't hold back

PACING:            We'll move through notebooks together
                   No one gets left behind

OUTPUTS:           You'll generate real files
                   Download them at the end

SLIDES/MATERIALS:  Available at:
                   https://github.com/VinayaSharada/KateelLearningDemosToStudents

SUPPORT AFTER:     Happy to help adapt for your company

OK, LET'S GO!
```

**Speaker Notes:**
- Practical information
- How to get help
- Where to find materials
- Door is open after workshop too

---

## How to Create the PowerPoint

### Option 1: Manual (Google Slides)

1. Open Google Slides (docs.google.com)
2. Create new presentation
3. For each slide above:
   - Slide title (Heading 1)
   - Content (Heading 2 + bullet points)
   - Add images/diagrams as needed
4. Keep design simple (white background, dark text)
5. Add one image per slide (optional, for visual interest)

### Option 2: Convert from Markdown (Recommended)

```bash
# Install pandoc (converts markdown to many formats)
brew install pandoc  # macOS
# or: choco install pandoc  # Windows

# Convert this file to PowerPoint
pandoc INSTRUCTOR_PRESENTATION_OUTLINE.md -o CFOPackV001_Workshop_Briefing.pptx
```

### Option 3: Use Google Sheets→Slides Add-on

1. Copy this content to Google Sheets
2. Use "Slides from Sheets" add-on
3. Automatically generates slides

---

## Design Tips

### Colors
- Background: White or light gray
- Text: Dark gray or black (high contrast)
- Accents: Blue (professional) or green (positive)

### Fonts
- Title: Bold, 44pt
- Content: Regular, 24pt
- Speaker notes: 12pt

### Images (Optional - One per Slide)
- Slide 1 (Title): Data/analytics icon
- Slide 2 (Problem): Clock or calendar
- Slide 3 (Accomplishments): Checkmarks
- Slide 4 (Timeline): Timeline/calendar
- Slide 5-8 (Modules): Relevant icons (chart, ML, forecast, money, etc.)
- Slide 11 (Takeaway): Graduation cap or certificate
- Slide 13 (Begin): Rocket or arrow forward

### Layout
- Title slide: Centered text, large
- Content slides: Title on top, bullet points below
- Speaker notes: Visible in presenter view only

---

## Presenter Tips

### Before the Workshop
1. **Practice delivery:** Go through slides at least once
2. **Know your audience:** Adjust language for their level
3. **Have backup:** PDF copy + printed notes
4. **Test tech:** Make sure Colab links work

### During Presentation
1. **Go slow:** 10 minutes seems short, but it goes fast
2. **Pause after questions:** Let them ask
3. **Be enthusiastic:** They'll match your energy
4. **Tell the story:** Don't just read slides
5. **Show the scenario:** Make it real (Slide 2)

### Timing
- Intro: 2-3 min
- Slides 3-7: 4 min (what they'll do, learn, accomplish)
- Slides 8-10: 2 min (data, tech, expectations)
- Slide 11-12: 2 min (takeaway, questions)
- Slide 13: 1 min (transition to notebooks)

**Total: ~10-12 minutes**

---

## Alternative: Short 5-Minute Version

If you only have 5 minutes before starting:

**Slide 1:** Title  
**Slide 2:** The Scenario (cash crisis)  
**Slide 3:** What You'll Do (8 notebooks, 3 hours)  
**Slide 4:** Timeline (09:00-12:00 schedule)  
**Slide 5:** Let's Begin!

Just hit the key points. People are impatient to start.

---

## Making It Interactive

### During Presentation
- **Pause at Slide 3:** "What would YOU do in this situation?" (get responses)
- **Pause at Slide 5:** "Which module interests you most?" (engagement check)
- **Pause at Slide 12:** "Any concerns before we start?" (address blockers)

### Engagement
- Use real examples from your organization (if appropriate)
- Ask "What would your CFO want to see?" (ground it in reality)
- Make eye contact and move around (not standing still reading)

---

## Final Thoughts

This presentation should:
- ✅ Set clear expectations
- ✅ Show the value/outcome
- ✅ Address common concerns
- ✅ Build excitement
- ✅ Transition smoothly to first notebook

Don't oversell it. It's a technical workshop, but it's designed to be accessible.

The best thing you can say: **"This will make sense. Let's try it together."**
