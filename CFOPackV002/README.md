# CFOPackV002: CFO Liquidity War Room

Build and defend a 30-day cash action plan using a versioned synthetic treasury
case, chronological payment-model validation, dated liquidity actions, explicit
funding economics, and per-currency FX decisions.

## What makes V002 different

CFOPackV002 is a decision simulation rather than a notebook demonstration.
Participant choices alter the forecast, direct cost, liquidity headroom, hedge
position, approval path, and final decision paper.

- One canonical scenario manifest controls all assumptions.
- Contractual, expected, P75 and shocked cash views remain separate.
- The payment model must beat a simple benchmark on a chronological holdout.
- Working-capital actions flow back into dated cash forecasts.
- FX receivables and payables are evaluated by currency and direction.
- Facility capacity, interest, fees and approval thresholds are explicit.
- Every decision-paper value is traceable to a named output.

## Participant journey

| Module | Decision | Output |
|---|---|---|
| N0 War Room Brief | Establish the team's initial position | Decision charter |
| N1 Data Integrity | Decide whether the evidence is decision-ready | Validation report and assumptions register |
| N2 Contractual Forecast | Identify fragile receipt assumptions | Contractual 30-day forecast |
| N3 Collections Risk | Approve or reject model uses | Model card and prioritized receivables |
| N4 Realistic Forecast | Select the confidence/downside view | Realistic liquidity forecast |
| N5 Liquidity Actions | Choose the action and funding mix | Reforecasted action package |
| N6 FX and Funding | Choose hedge ratios and facility headroom | FX/funding decision table |
| N7 CFO Decision | Make and defend the recommendation | One-page CFO decision paper |
| N8 Execute and Monitor | Set owners, evidence and triggers | 30-day action plan and scorecard |

## Recommended delivery

- Full-day facilitated lab, or a 4.5-hour intensive with pre-work
- Teams of 2-4
- Primary audience: treasury managers, controllers, FP&A leaders and CFO-1
  professionals
- Final assessment: CFO decision defence

## Optional executive capstone

`extensions/TransformationInvestmentCommittee` is a separate half-day transfer
lab. Participants choose a finance-transformation investment for NOW, sequence a
conditional NEXT investment, and define the Day-90 STOP / REVISE / SCALE gate.
It replaces the earlier answer-heavy Module 6 Bridge with a participant-safe
case. Facilitator materials are distributed separately.

## Executive-ready outputs

The core engine produces traceable CSV and Markdown evidence. The export
builder in `src/executive_exports` converts a completed team output folder into
a formula-driven Excel decision model, an editable PowerPoint board pack and a
two-page PDF decision paper. These artifacts are designed for copying into the
documents and approval workflows finance teams already use.

## Quick start

### Google Colab

Open N0 from the [workshop launch page](index.html), edit the team decision
charter, and continue through N8. Each notebook can also bootstrap the public
scenario independently.

### Local Jupyter

```bash
python -m pip install -r CFOPackV002/requirements.txt
jupyter notebook CFOPackV002/notebooks/N0_War_Room_Brief.ipynb
```

### Validate the package

```bash
python CFOPackV002/data/generate_scenario.py
python CFOPackV002/tests/test_financial_invariants.py
python CFOPackV002/tests/run_notebooks.py
```

## Important limitations

- All company, invoice, payment, facility and FX data is synthetic.
- Market moves and forward costs are workshop assumptions, not live quotes.
- Model predictions are estimates and must be replaced by actual cash evidence
  during daily reforecasting.
- Generated decision papers and action plans require human review and approval.
- Using company data requires completing the documented data mapping and policy
  inputs; replacing one CSV is not sufficient.

CFOPackV001 remains available as the earlier workshop version. Its legacy
Module 6 Bridge has been retired from the participant site and replaced by the
V002 capstone.
