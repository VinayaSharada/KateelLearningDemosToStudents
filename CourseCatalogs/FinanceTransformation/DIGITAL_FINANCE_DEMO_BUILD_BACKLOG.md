# Digital Finance Demo Build Backlog

## Purpose

This backlog turns a digital-finance workshop plan into a reusable, browser-based demonstration roadmap for finance leaders, faculty, and learners. All demos must use fictional data, run locally without API keys, make the business decision primary, and show the owner, evidence, exception route, and human-approval boundary.

## Delivery Rule

Build reusable demo engines in this repository. Keep only local Power Automate Desktop flows, credentials, tenant configuration, and production connections outside the repository.

## Priority Summary

| Priority | Work item | Action | Typical workshop use |
| --- | --- | --- | --- |
| P0 | O2C Process Mining Workbench | Enhance | Process-mining diagnosis demo |
| P0 | Finance RPA Workbench | Build | RPA versus workflow decision demo |
| P0 | Reusable Finance Skills Studio | Build | Governed reusable-AI-skills demo |
| P0 | Month-End Close Command Center | Enhance | Agent/governance demonstration |
| P1 | Ind AS Contract Review Workbench | Enhance | NLP and judgement-boundary demo |
| P1 | Finance Signal Triage | Enhance | Sentiment and corroboration demo |
| P1 | Digital Finance Portfolio Simulator | Enhance | Transformation roadmap decision demo |
| P1 | AI Workflow Demo | Enhance | Controlled low-code fallback |
| P1 | AI Content Summarizer | Enhance | Evidence-first GenAI exercise |
| P1 | AI Governance Scorecard | Enhance | Controlled-deployment decision |
| P2 | Payment Reconciliation Workbench | Enhance | Finance-operations case |
| P2 | P2P Process Mining Workbench | Enhance | AP contrast to the O2C main demo |

---

## P0-1: O2C Process Mining Workbench

**Current asset:** `TechUseCaseDemos/O2CProcessMiningWorkbench`  
**Action:** Enhance, do not rebuild.  
**Why it matters:** This is the best entry point to the digital-finance message: diagnose actual execution before funding automation.

### Required enhancement

1. Add a clear instructor path: assumed happy path, all variants, bottleneck/cost, decision board, monitoring trigger.
2. Add a visible variant-frequency control that moves from the clean common path to all paths.
3. Add financial impact assumptions: cash delayed, cost per rework loop, and value exposed by long credit-hold or unapplied-cash queues. Label all assumptions fictional.
4. Add the `CLEAR` decision board: Clarify, Lean out, Enable, Assure, Realise.
5. Add a monitoring view with action triggers, accountable owner, evidence record, and SLA.
6. Add a process-mining market-orientation panel: representative platforms and the difference between process mining, task mining, workflow, and RPA.

### Required interaction

- Filter by customer segment, order value, exception type, and process variant.
- Click a path to see its lead time, wait time, touch-time assumption, rework count, and control status.
- Choose one intervention and see the expected metric, owner, dependency, and 30-day proof point.

### Acceptance criteria

- Demonstrable in eight minutes without login or internet.
- Event-log calculations trace to bundled fictional data.
- Shows happy path versus variants, queue time, rework, control breach, and a CFO action decision.

---

## P0-2: Finance RPA Workbench

**Current asset:** None.  
**Action:** Build new reusable demo: `TechUseCaseDemos/FinanceRPAWorkbench`.  
**Why it matters:** The library needs a distinct RPA demonstration. Process mining identifies an opportunity; low-code routing designs a workflow; RPA demonstrates controlled execution across legacy systems.

### Business scenario

A fictional AP team rekeys invoice data between an invoice inbox, legacy ERP, purchase-order record, goods-receipt record, and exception queue. The controller must decide which path is stable enough for a bot and which transactions require a person.

### Required screens

1. **Current work:** manual rekeying, handoffs, error/rework rate, and time per invoice.
2. **Bot run:** read invoice fields, validate PO/GRN/amount, write to simulated ERP, create evidence log.
3. **Exception workbench:** missing PO, missing GRN, duplicate, amount mismatch, and high-value approval.
4. **Control panel:** bot identity, segregation of duties, evidence retained, retry rule, human override, and fallback.
5. **CFO decision:** standardise first, automate stable path, keep judgement exception human-owned, or stop.

### Required data and interactions

- Bundled fictional invoice, PO, GRN, vendor, and ERP tables.
- Start/pause/reset a simulated bot run.
- Toggle a policy defect to show why bots should not automate broken policy.
- Configure materiality threshold, exception SLA, and human reviewer.
- Show straight-through-processing rate, bot exception rate, rework avoided, and exception ageing.

### Acceptance criteria

- Explicitly distinguishes RPA from low-code workflow.
- Never allows autonomous payment release, journal posting, or policy override.
- Includes instructor guide, participant task, expected answer, and reset control.

---

## P0-3: Reusable Finance Skills Studio

**Current asset:** None.  
**Action:** Build new reusable demo: `TechUseCaseDemos/ReusableFinanceSkillsStudio`.  
**Why it matters:** The summarizer demonstrates one controlled output, but the library also needs to show how finance converts one good prompt into a governed, reusable skill rather than accumulating inconsistent individual prompts.

### Business scenario

FP&A analysts prepare monthly management commentary inconsistently. The CFO wants a reusable “Finance Pack Review Skill” with permitted inputs, required evidence checks, refusal rules, output structure, reviewer, and version history.

### Required screens

1. **Ad hoc prompt versus skill:** compare two inconsistent analyst outputs with a governed skill output.
2. **Skill builder:** objective, approved inputs, source requirements, steps, output template, limits, and escalation rules.
3. **Acceptance test:** run the same fictional management-pack extract through version 1 and version 2.
4. **Review and release:** identify unsupported claims, missing data, and reviewer decision.
5. **Skill register:** owner, version, test date, approved use, prohibited use, and next review date.

### Required interaction

- Configure at least three refusal/escalation rules.
- Add or remove a required evidence source and observe the acceptance-test outcome.
- Select preparer, finance reviewer, and approval boundary.
- Export or display a one-page skill card.

### Acceptance criteria

- Makes the difference between a prompt and a reusable governed skill obvious.
- Shows that a skill drafts or analyses but does not make accountable finance judgement.
- Uses fictional management-pack data and works fully offline in a browser.

---

## P0-4: Month-End Close Command Center

**Current asset:** `TechUseCaseDemos/MonthEndCloseCommandCenter`  
**Action:** Enhance substantially.  
**Why it matters:** It is the correct vehicle for AI-agent discussion, but it needs real interactive decision logic and evidence-based approval states.

### Required enhancement

1. Add a close calendar and entity-level status view.
2. Add at least six fictional close exceptions: reconciliation, intercompany mismatch, journal support, inventory accrual, FX revaluation, and late consolidation input.
3. Add an agent trace: observe, gather evidence, draft escalation, recommend, wait for controller approval.
4. Add controls: no autonomous journal posting, materiality threshold, owner, SLA, approval status, and evidence log.
5. Add a controller decision: approve action, request more evidence, reassign, or defer with risk acceptance.

### Acceptance criteria

- Every material action requires human approval.
- Dashboard metrics include close-day status, ageing, blocked tasks, material exceptions, and evidence completeness.
- Demonstrates an agent as a coordinator and drafter, not an autonomous close operator.

---

## P1-1: Ind AS Contract Review Workbench

**Current asset:** `TechUseCaseDemos/IndASContractReviewWorkbench`  
**Action:** Enhance substantially.  
**Why it matters:** This is the document-intelligence example and must visibly separate extraction from legal or accounting judgement.

### Required enhancement

1. Add fictional contract clauses for performance obligations, variable consideration, return rights, rebate, renewal, financing component, and termination.
2. Display source clause, extracted signal, confidence, finance question, legal question, and owner.
3. Include a decision queue: cash impact, revenue/Ind AS assessment, commitment, or legal review.
4. Require finance/legal review before any accounting conclusion.
5. Add an error example where extraction misses a qualifier; participants must correct it using source text.

### Acceptance criteria

- Shows source evidence beside every extracted signal.
- Contains an explicit message: “Extraction is not accounting judgement.”
- Produces a reviewed obligation register, not an automated accounting entry.

---

## P1-2: Finance Signal Triage

**Current asset:** `TechUseCaseDemos/FinanceSignalTriage`  
**Action:** Enhance substantially.  
**Why it matters:** This is the sentiment-analysis demonstration. It must teach that soft signals are only early warnings until corroborated by financial and operational evidence.

### Required enhancement

1. Add fictional customer, supplier, employee, and analyst comments with sentiment, topic, date, and source.
2. Add corroborating metrics: DSO, returns, delivery delay, forecast variance, cash collection, and supplier dispute trend.
3. Add materiality, corroboration, and actionability scoring.
4. Add owner, SLA, escalation route, and review state.
5. Show both false-positive and missed-risk scenarios.

### Acceptance criteria

- The demo never allows sentiment alone to determine action.
- Participants can select investigate, monitor, escalate, or close with evidence.
- Shows bias/representativeness warning and a named decision owner.

---

## P1-3: Digital Finance Portfolio Simulator

**Current asset:** `TechUseCaseDemos/DigitalFinancePortfolioSimulator`  
**Action:** Enhance substantially.  
**Why it matters:** This should connect transformation choice to a board-style roadmap. It needs more than a static score display.

### Required enhancement

1. Add six fictional initiatives: close redesign, AP workflow, process mining, planning/forecasting, GenAI commentary, and contract intelligence.
2. Add value, investment, data readiness, process readiness, people resistance, control risk, dependency, and time-to-proof fields.
3. Add annual budget and change-capacity constraints across three years.
4. Allow participants to sequence, defer, stop, or scale initiatives.
5. Generate Board output: 90-day proof point, Year 1 plan, years 2-3 scale, value range, risks, and decisions required.

### Acceptance criteria

- A portfolio cannot select dependent initiatives in an invalid order.
- Results show trade-offs, not a single “correct” score.
- Uses CLEAR and includes CFO, CIO, process-owner, and data-owner viewpoints.

---

## P1-4: AI Workflow Demo

**Current asset:** `TechUseCaseDemos/AIWorkflowDemo`  
**Action:** Enhance.  
**Why it matters:** This is the browser-based fallback for low-code/no-code workflow design when a live Power Automate demo is unavailable.

### Required enhancement

1. Add four selectable finance scenarios: AP exception routing, close-status escalation, management-commentary review, and forecast-assumption challenge.
2. Add trigger, standard path, exception path, approver, evidence, SLA, escalation, and fallback fields.
3. Add a governance warning if a user creates a flow without owner, evidence, or approval boundary.
4. Add a “shadow IT versus governed build” comparison.

### Acceptance criteria

- Participants can create and test a workflow specification without logging into Power Automate.
- The output identifies which portion still requires IT or control-owner review.

---

## P1-5: AI Content Summarizer and Finance Evidence Challenge

**Current assets:** `TechUseCaseDemos/AIContentSummarizer` and `TechUseCaseDemos/FinanceEvidenceAndDataLineageChallenge`  
**Action:** Integrate and enhance, not rebuild separately.  
**Why it matters:** Together these are the strongest evidence-first GenAI exercise, but they should behave as one finance workflow.

### Required enhancement

1. Share one fictional monthly management-pack scenario and source dataset.
2. Show a draft commentary, quantitative claim citations, assumptions, unsupported claim, and reviewer sign-off.
3. Add release states: draft, evidence gap, reviewer correction, approved for internal management use, and blocked.
4. Add traceability from each material claim to source row(s).
5. Include a scenario with stale or contradictory source evidence.

### Acceptance criteria

- A CFO release cannot occur while material claims lack evidence or reviewer sign-off.
- The demo teaches fact, inference, uncertainty, and judgement as separate concepts.

---

## P1-6: AI Governance Scorecard

**Current asset:** `TechUseCaseDemos/AIGovernanceScorecard`  
**Action:** Enhance.  
**Why it matters:** It is the principal governance exercise and should make deployment decisions more operational.

### Required enhancement

1. Add deployment states: stop, remediate, pilot with conditions, controlled deployment, and scale.
2. Add control domains: source traceability, data classification, human review, approval rights, Ind AS judgement boundary, segregation of duties, logging, monitoring, and exception ownership.
3. Show responsible owner, evidence, remediation action, due date, and approval condition for every failed control.
4. Generate a CFO-CIO conditional approval memo.

### Acceptance criteria

- The scorecard produces an explainable decision, not merely a maturity score.
- Every red control has a named remediation owner and no vague “improve governance” recommendation.

---

## P2-1: Payment Reconciliation Workbench

**Current asset:** `TechUseCaseDemos/PaymentReconciliationWorkbench`  
**Action:** Enhance selectively.  
**Why it matters:** It is a strong optional operations example and can demonstrate when automation should route exceptions rather than force matching.

### Required enhancement

- Add materiality presets, close-blocking versus monitor-only status, root-cause category, and escalation outcome.
- Add a before/after view comparing manual queue work with controlled exception workbench routing.
- Add a clear handoff to RPA or low-code workflow only after matching rules are stable.

---

## P2-2: P2P Process Mining Workbench

**Current asset:** `TechUseCaseDemos/P2PProcessMiningWorkbench`  
**Action:** Enhance selectively.  
**Why it matters:** It complements the O2C demo with AP examples, but should not duplicate the main process-mining teaching sequence.

### Required enhancement

- Reuse the same visual/interaction standard as O2C.
- Add an AP-specific “remove, standardise, automate, retain human review” decision board.
- Use it as an optional follow-up or contrast, not a second full process-mining demo.

## Common Completion Checklist

Every completed demo must include:

- `README.md`, `about.html`, `index.html`, `app.js`, and `style.css`.
- `instructor-guide.md`, `participant-task.md`, and `expected-answer.md`.
- Fictional or sanitised data in a `Data/` folder.
- Browser-only core mode with no API key or sign-in.
- Reset control and deterministic default state.
- A five-to-eight-minute facilitator path and a ten-minute participant exercise.
- Visible source evidence, owner, exception route, human-approval point, and limitation statement.
- No autonomous accounting, payment, journal-posting, or approval action.
