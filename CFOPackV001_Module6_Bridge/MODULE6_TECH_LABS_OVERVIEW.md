# Module 6: Digital Finance Technology Labs Overview

**How the 9 technology labs connect to case analysis and strategy execution**

---

## The Labs at a Glance

Nine hands-on labs teaching specific finance transformation technologies. Each is **self-contained** with data, demos, exercises, and faculty guide.

| Lab | Technology | Finance Challenge | When to Use |
|-----|------------|-------------------|------------|
| **01** | GenAI | Need CFO-ready insights fast, but must trace to source data | After deciding to invest in analytics/AI |
| **02** | AI Skills | Teams prompt repeatedly; outputs inconsistent, judgment hidden | After realizing AI quality depends on skill, not tool |
| **03** | AI Agents | Close has handoffs/exceptions; need coordination without losing control | If you recommend close redesign (Case 1 decision) |
| **04** | RPA | AP/reconciliation teams move data between systems; exceptions poorly owned | If you recommend AP automation (Case 2 decision) |
| **05** | NLP | High volume of contracts; need to surface obligations and signals | If you need to analyze unstructured data for decisions |
| **06** | Sentiment | Volume of customer/supplier/analyst commentary; distinguish signal from noise | If you recommend predictive planning or FPA |
| **07** | Controls | Want speed, but audit/risk need evidence of control and traceability | Always — controls are non-negotiable in digital transformation |
| **08** | Low-Code/No-Code | Finance teams can build approval flows quickly, but fragmented builds weaken control | If you recommend process automation without enterprise tools |
| **09** | Process Mining | Close analysis: queue time, rework, bottlenecks, waste | **Session 2 diagnostic** — run FIRST before any automation |

---

## How Labs Map to Case Decisions

### **Case 1: Asteron Digital Finance Priority**
**Recommendation: AP Workflow Automation**

→ **Use Lab 04: RPA for Finance Operations**
- Learn exactly how to automate invoice matching
- See 3-way match workflow
- Understand exception management
- Design audit trail

---

### **Case 2: Asteron AP Automation**
**Recommendation: [To be determined by case analysis]**

→ **Use Lab 04: RPA for Finance Operations** (if you choose AP)
→ **Use Lab 09: Process Mining** (to diagnose current AP process first)

---

### **Case 3: Asteron GenAI for FPA**
**Recommendation: [To be determined by case analysis]**

→ **Use Lab 01: GenAI for Finance**
- Learn how to use AI for FPA commentary
- Understand source traceability
- See proof point structure

---

### **Case 4: Vistara Technology Selection**
**Recommendation: [To be determined by case analysis]**

→ **Use relevant lab based on your recommendation**
- If data foundation: Lab 07 (Controls & governance)
- If analytics: Lab 01 (GenAI) + Lab 02 (Skills)
- If process: Lab 09 (Process Mining) + Lab 04 (RPA)

---

### **Case 5: Asteron CFO-CIO Portfolio**
**Recommendation: [To be determined by case analysis]**

→ **Use Lab 07: Data & AI Controls** (ensures governance & traceability)
→ **Use Lab 02: Reusable AI Skills** (aligns team capability with initiatives)

---

### **Case 6: Vistara Board Roadmap**
**Recommendation: [Multi-year digital finance roadmap]**

→ **Use multiple labs sequentially** based on your recommended sequencing
- Example: Lab 09 (diagnose) → Lab 04 (AP automation) → Lab 01 (analytics) → Lab 07 (controls)

---

## Lab Structure (All 9 Follow Same Pattern)

Each lab contains:

```
Lab_Name/
├── README.md — Lab overview & learning objectives
├── Faculty_Guide.md — Teaching notes, timing, facilitation tips
├── Delivery_Mode.md — How to deliver (live demo vs. guided exercise)
├── Presentation/ — Slide deck (editable)
├── Demos/ — Walkthrough videos or step-by-step instructions
├── Exercises/ — Participant activities (worksheets, challenges)
├── Data/ — Sample datasets (fictional, realistic)
└── Solutions/ — Answer keys for exercises
```

**Estimated Time per Lab:**
- Faculty prep: 1-2 hours
- Participant experience: 2-3 hours (demo + exercise)
- Post-lab debrief: 30 min

---

## Learning Flow: Cases → Labs → Strategy Execution

```
Module 6 Cases (3-4 hours)
├─ Case 1-6 Analysis
├─ Use 8-step method
├─ Identify recommendation
└─ Determine "what technology will we need?"
        ↓
Technology Labs (2-3 hours each)
├─ Pick labs matching your recommendation
├─ See tool in action
├─ Run exercises
├─ Understand operating model & controls
└─ Validate your chosen approach
        ↓
Back to Your Organization (Next Quarter)
├─ Apply the decision framework
├─ Implement technology
├─ Measure proof point
└─ Sequence next initiatives
```

---

## How to Sequence Labs for Different Strategies

### **Scenario A: "We're automating AP"**
```
1. Lab 09: Process Mining (diagnose current AP bottlenecks) — 2 hours
2. Lab 04: RPA for Finance Operations (learn automation) — 3 hours
3. Lab 07: Data & AI Controls (build audit trail) — 2 hours
Total: 7 hours
```

### **Scenario B: "We're building a data foundation"**
```
1. Lab 02: Reusable AI Skills (align team capability) — 3 hours
2. Lab 07: Data & AI Controls (governance & traceability) — 2 hours
3. Lab 01: GenAI for Finance (apply on clean data) — 3 hours
Total: 8 hours
```

### **Scenario C: "We're redesigning the close"**
```
1. Lab 09: Process Mining (understand close process) — 2 hours
2. Lab 03: AI Agents for Close (manage handoffs & exceptions) — 3 hours
3. Lab 07: Data & AI Controls (maintain approval authority) — 2 hours
Total: 7 hours
```

### **Scenario D: "We're doing multi-year transformation"**
```
Year 1, Q1: Lab 09 (Process Mining) — diagnose everything
Year 1, Q2: Lab 04 (RPA) — quick win on AP
Year 1, Q3: Lab 02 (AI Skills) + Lab 07 (Controls)
Year 2, Q1: Lab 01 (GenAI) — analytics on clean data
Year 2, Q2: Lab 03 (AI Agents) — upgrade close
Etc.
```

---

## Key Insight: "Control First, Speed Second"

**All 9 labs emphasize this pattern:**

1. **Understand current process** (Lab 09: Process Mining)
2. **Automate with controls in place** (Lab 04, 03, 08: Automation + controls)
3. **Ensure traceability** (Lab 07: Controls & governance)
4. **Build team skills** (Lab 02: Reusable skills)
5. **Apply AI/analytics** (Lab 01, 06, 05: GenAI, Sentiment, NLP)

**This differs from "just deploy a tool"** — the labs teach operating model design, not just tool features.

---

## Lab Details: What Each One Teaches

### **Lab 01: GenAI for Finance**

**Challenge:** CFO needs management commentary fast, but can't approve explanations without source traceability

**What You Learn:**
- How to use GenAI for FPA narrative generation
- Source data linking (audit trail)
- Error detection and validation
- When GenAI helps vs. when it fails

**Tools/Skills:**
- Prompt engineering for finance
- Data sourcing and validation
- Quality gates

**Exercise:**
- Write FPA narrative using GenAI
- Trace each insight to source
- Identify when output needs human review

**Time:** 3 hours (1 hr demo, 2 hrs exercise)

---

### **Lab 02: Reusable AI Skills**

**Challenge:** Teams prompt AI repeatedly; outputs are inconsistent because judgment differences are hidden

**What You Learn:**
- How to standardize prompts for repeatable analysis
- Building reusable AI skills (templates, guardrails)
- Governance of model behavior
- Quality consistency

**Tools/Skills:**
- Prompt templates
- Skill libraries
- Output validation

**Exercise:**
- Build a reusable prompt for collections analysis
- Test consistency across scenarios
- Document guardrails

**Time:** 3 hours (1 hr demo, 2 hrs exercise)

---

### **Lab 03: AI Agents for Close**

**Challenge:** Close has many handoffs and exceptions; finance wants coordination without losing approval authority

**What You Learn:**
- How AI agents coordinate workflows
- Maintaining approval gates (AI doesn't approve, it coordinates)
- Exception management
- Visibility without loss of control

**Tools/Skills:**
- Workflow orchestration
- Exception routing
- Approval gates

**Exercise:**
- Design close workflow with AI coordination
- Build exception escalation rules
- Ensure approval authority is preserved

**Time:** 3 hours (1 hr demo, 2 hrs exercise)

---

### **Lab 04: RPA for Finance Operations**

**Challenge:** AP and reconciliation teams spend time moving structured data between systems; exceptions are poorly owned

**What You Learn:**
- How RPA handles invoice-to-payment matching
- 3-way match automation (PO ↔ Invoice ↔ Receipt)
- Exception management (what RPA can't handle)
- When to use RPA vs. integrated systems

**Tools/Skills:**
- RPA workflow design
- Exception handling
- Audit trail in automated processes

**Exercise:**
- Design AP automation workflow
- Build exception routing
- Calculate time and cost savings

**Time:** 3 hours (1 hr demo, 2 hrs exercise)

---

### **Lab 05: NLP for Contracts and Obligations**

**Challenge:** Finance needs to surface commercial obligations and accounting signals from high-volume contracts

**What You Learn:**
- How NLP extracts obligations from text
- Contract risk signals
- Compliance checking
- Integration with financial planning

**Tools/Skills:**
- NLP for contract analysis
- Obligation extraction
- Signal detection

**Exercise:**
- Use NLP to extract payment terms from contracts
- Flag unusual conditions
- Link to FPA

**Time:** 2.5 hours (1 hr demo, 1.5 hrs exercise)

---

### **Lab 06: Sentiment and Early Warning**

**Challenge:** CFOs receive high-volume customer/supplier/analyst commentary; need to distinguish signals from noise

**What You Learn:**
- Sentiment analysis for financial risk
- Early warning signals
- When sentiment signals predict financial impact
- Building risk dashboards

**Tools/Skills:**
- Sentiment extraction
- Signal weighting
- Risk scoring

**Exercise:**
- Analyze customer feedback for churn risk
- Build early warning dashboard
- Link to working capital forecasting

**Time:** 2.5 hours (1 hr demo, 1.5 hrs exercise)

---

### **Lab 07: Data & AI Controls**

**Challenge:** Finance wants speed, but audit/risk need evidence of control, traceability, and exception management

**What You Learn:**
- Building control framework for AI/automation
- Data lineage and audit trail
- Exception visibility
- Compliance in automated processes
- Change management for controlled environments

**Tools/Skills:**
- Data governance
- Audit trail design
- Exception management
- Control matrices

**Exercise:**
- Build data governance for automated close
- Design audit trail
- Create control dashboard

**Time:** 2-3 hours (1 hr demo, 1-2 hrs exercise)

---

### **Lab 08: Low-Code/No-Code Automation**

**Challenge:** Finance teams can build approval flows quickly, but fragmented self-built flows weaken controls

**What You Learn:**
- Building approval workflows (Power Automate, Zapier, etc.)
- When low-code is sufficient vs. when you need RPA/enterprise tools
- Governance of citizen automation
- Integration with enterprise systems

**Tools/Skills:**
- Workflow design in low-code platforms
- Approval routing
- Exception management
- Enterprise integration

**Exercise:**
- Build a reimbursement approval workflow
- Add exception routing
- Ensure audit trail

**Time:** 2.5 hours (1 hr demo, 1.5 hrs exercise)

---

### **Lab 09: Process Mining and Flow Time**

**Challenge:** Understand where time is spent in close, AP, or reconciliation processes

**What You Learn:**
- Process mining techniques
- Identifying bottlenecks, rework, queue time
- Hidden work and exception patterns
- Data-driven process optimization
- **RUN THIS BEFORE ANY AUTOMATION**

**Tools/Skills:**
- Process discovery
- Flow time analysis
- Bottleneck identification
- Optimization targets

**Exercise:**
- Mine close process data
- Identify top bottlenecks
- Prioritize improvements

**Time:** 2 hours (1 hr demo, 1 hr exercise)

---

## Integration with CFOPackV001 & Bridge

**CFOPackV001** teaches: Decision methodology (8 steps)  
**Case Bridge** teaches: Strategic sequencing (which initiative first?)  
**Technology Labs** teach: Execution (how to implement the chosen initiative)

**Example Journey:**
1. Complete CFOPackV001 (2-3 hours) → Learn decision method
2. Analyze Module 6 case using bridge (2-3 hours) → Choose recommendation
3. Run relevant tech lab (2-3 hours) → Understand execution
4. Go implement in your organization (next quarter) → Apply at scale

---

## Faculty Facilitation Tips for Labs

**All 9 labs follow this pattern:**

1. **Opening (15 min):** Connect to case decision
   - "You recommended AP automation. Here's how to implement it."
   - "This lab shows what you need to know before green-lighting the project."

2. **Concept (30 min):** Walkthrough or live demo
   - Show the tool in action
   - Show what it can/can't do
   - Highlight control considerations

3. **Exercise (90 min):** Participants hands-on
   - Work in pairs/groups
   - Use sample data
   - Build their own example

4. **Debrief (15 min):** What they learned
   - "What was surprising?"
   - "Where would this help your company?"
   - "What control question still concerns you?"

5. **Bridge to Reality (10 min):** How to use at work
   - "This is simulated. In reality, you'd use..."
   - "Your IT/vendor would handle..."
   - "You focus on these 3 operating model questions..."

---

## Choosing Which Labs to Run

**For a 3-day workshop (full Module 6):**

**Day 1:** Cases 1-3 analysis (6 hours)
**Day 2:** Cases 4-6 analysis (6 hours)
**Day 3:** 2-3 technology labs (6 hours)

**Which labs?** Based on most common recommendations across your class cases.

---

## Success Criteria After Labs

✅ Participants understand the technology can actually work  
✅ Participants see the control/operating model implications  
✅ Participants can articulate what their company would do differently  
✅ Participants can explain to IT/business partners what's needed  
✅ Participants feel confident in their recommendation  

---

## Next Steps

1. **Analyze your case** (use bridge, 2-3 hours)
2. **Choose your recommendation**
3. **Identify needed technology** (match to labs)
4. **Run the relevant lab** (2-3 hours)
5. **Build your implementation roadmap** (use lab insights)

---

**The labs make your case recommendation real.** 🚀

