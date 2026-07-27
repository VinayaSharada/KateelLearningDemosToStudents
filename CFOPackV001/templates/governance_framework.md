# Governance Framework Template

Use this to define the controls around a treasury decision before it's executed.
Fill in the brackets with your organization's actual policy — the structure
mirrors what N7-N8 assume exists when they generate a memo and implementation plan.

---

## 1. Approval Authority

| Decision Type | Threshold | Required Approver |
|---|---|---|
| Collections / dunning action | [e.g. any amount] | [e.g. Controller] |
| Payables term extension | [e.g. > $X or > N days] | [e.g. CFO] |
| Draw on credit facility | [e.g. any amount] | [e.g. CFO + Treasurer] |
| FX hedge ratio change | [e.g. outside board policy range] | [e.g. CFO + Board Risk Committee] |
| Inventory / operational change | [e.g. > $X impact] | [e.g. COO + CFO] |

---

## 2. Policy Boundaries

- **FX hedge ratio range:** [e.g. 50%-75% per open exposure, board-approved]
- **Minimum daily cash threshold:** [e.g. $1.5M — below this, credit facility activates automatically]
- **Customer churn tolerance from collections activity:** [e.g. <3%, monitored weekly]
- **Credit facility limit:** [$ amount, and what draws require pre-approval]

---

## 3. Review Cadence

- **Daily:** [e.g. cash position reporting]
- **Weekly:** [e.g. collections/payables progress vs. target]
- **Mid-point review:** [e.g. Day 7 — go/no-go on continuing the plan as-is]
- **Final review:** [e.g. Day 14/21 — sustain, adjust, or wind down]
- **Post-implementation:** [lessons-learned memo, always required]

---

## 4. Escalation Triggers

| Trigger | Escalate To | Response Time |
|---|---|---|
| [e.g. Daily cash < minimum threshold] | [e.g. CFO] | [e.g. same day] |
| [e.g. Milestone achievement < 60% of target] | [e.g. relevant VP] | [e.g. 24 hours] |
| [e.g. Customer churn > tolerance] | [e.g. Sales leadership] | [e.g. 48 hours] |
| [e.g. Model prediction diverges materially from actuals] | [e.g. Treasurer] | [e.g. next business day] |

---

## 5. Documentation & Audit Trail

- Every decision memo is archived with: date, preparer, approver signatures, final outcome
- Every approval gate (see `approval_workflow_template.json`) records who approved, when, and against what criteria
- Post-implementation reviews are retained to compare forecast vs. actual and to improve the next cycle's model/assumptions

---

## 6. Roles & Responsibilities

- **Treasurer:** Owns forecast accuracy, daily cash monitoring, and credit facility decisions
- **Controller:** Owns AR/AP integrity, collections controls, and compliance checks
- **CFO:** Final approval authority on any action above policy thresholds
- **Department leads (Sales/Procurement):** Execute customer- or supplier-facing actions within their authority; escalate anything outside it
