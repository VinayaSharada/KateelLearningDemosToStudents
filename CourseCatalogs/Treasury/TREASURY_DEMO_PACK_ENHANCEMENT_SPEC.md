# Treasury Course Demo Pack Enhancement Spec

## Purpose
This spec replaces the earlier `Module 5 Pack` framing with a reusable `Treasury Course Demo Pack` model.

The goal is to improve treasury teaching assets in `KateelLearningDemosToStudents` without rewriting the repository. A demo should be implemented once, described consistently, and reused across multiple course packs through thin pack definitions.

The repository-wide baseline for demo structure, self-service guidance, and course neutrality now lives in [CourseCatalogs/DemoLibrary/DEMO_LIBRARY_STANDARDS.md](/mnt/c/Users/vsathya/todel/gitrepos/KateelLearningDemosToStudents/CourseCatalogs/DemoLibrary/DEMO_LIBRARY_STANDARDS.md). Treasury-specific enhancement work should follow that baseline rather than invent a separate treasury-only standard.

## Enhancement objective
Turn `KateelLearningDemosToStudents` into a reusable, course-neutral demo library where:

- A demo is implemented once.
- Multiple course packs can reference the same demo.
- Every demo accurately states whether it is rule-based, simulation, machine learning, GenAI, or external API backed.
- Faculty can launch a complete hands-on session from one page.
- Participants receive consistent instructions, exports, and privacy warnings.
- Classroom readiness is tested automatically.

## Phase 1: Must-have before the next treasury hands-on

| ID | Requirement | Acceptance criteria |
|---|---|---|
| TDP-01 | Create a reusable Treasury Course Demo Pack | One landing page lists the selected demos in teaching order, with timing, launch link, exercise, deliverable, and fallback instructions. |
| TDP-02 | Harden invoice payment-date notebook | A fresh Colab session runs end-to-end without API keys or manual code correction and produces the expected payment-date calendar. |
| TDP-03 | Add configurable business assumptions | Currency, as-of date, forecast horizon, and cost-of-capital rate are defined in one clearly marked configuration cell. |
| TDP-04 | Standardize INR presentation | Selected treasury demos display INR/lakh/crore, or explicitly state that values are generic currency units. No unexplained dollar figures remain. |
| TDP-05 | Correct AI terminology | Every demo displays an accurate engine badge such as `Rule-based`, `Simulation`, `Machine Learning`, `GenAI`, or `External API`. |
| TDP-06 | Fix Treasury Control Tower inconsistencies | `README.md`, `index.html`, `demo.html`, and JavaScript describe and implement the same controls. Duplicate inline/external logic is removed. |
| TDP-07 | Add participant and faculty guides | A participant worksheet and instructor runbook cover timings, tasks, outputs, discussion questions, and fallback screenshots. |
| TDP-08 | Add classroom preflight tests | All selected pages, controls, exports, and links are automatically checked before class. The invoice notebook receives an execution smoke test. |
| TDP-09 | Add data-privacy guidance | The notebook clearly warns against uploading confidential ERP data and provides sanitized sample data for classroom use. |

## Invoice-level collections prediction requirements

Enhance [invoice_level_collections_prediction.ipynb](/mnt/c/Users/vsathya/todel/gitrepos/KateelLearningDemosToStudents/TreasuryAnalytics/InvoiceLevelCollectionsPrediction/invoice_level_collections_prediction.ipynb) around the following requirements.

### Functional requirements

1. Retain the two-model design:

   - Classifier: likelihood of late payment
   - Regressor: predicted days early or late

2. Produce these invoice-level fields:

   - `invoice_id`
   - `customer_id`
   - `customer_name`
   - `invoice_amount`
   - `due_date`
   - `late_risk_probability`
   - `predicted_days_vs_due`
   - `expected_payment_date`
   - `priority_band`
   - `recommended_action`

3. Clearly calculate:

   `expected_payment_date = due_date + predicted_days_vs_due`

4. Compare two forecasts:

   - Contractual forecast using due dates
   - ML-adjusted forecast using expected payment dates

5. Display:

   - Train and test RMSE
   - Train and test MAE
   - Difference from the naive due-date baseline
   - Next 7-, 14-, and 30-day expected inflows
   - Largest predicted payment-date slippages
   - Dates with excessive cash concentration
   - Capital-buffer and economic-value estimate

6. Make these parameters editable in one cell:

```python
CURRENCY_CODE = "INR"
DISPLAY_SCALE = "crore"
AS_OF_DATE = None
FORECAST_HORIZONS = [7, 14, 30]
COST_OF_CAPITAL_RATE = 0.09
USE_SYNTHETIC_DATA = True
RANDOM_SEED = 42
```

7. Export:

   - `invoice_payment_predictions.csv`
   - `daily_inflow_due_date_baseline.csv`
   - `daily_inflow_predicted.csv`
   - `collections_action_queue.csv`
   - `collections_calendar_import.csv`
   - `model_run_summary.json`

8. The action-queue export should contain fields usable later in Power Automate:

```text
invoice_id
customer_id
customer_name
invoice_amount
due_date
expected_payment_date
predicted_days_vs_due
late_risk_probability
priority_band
recommended_action
assigned_owner
escalation_date
approval_required
```

### Model-governance requirements

The notebook must state clearly that:

- Synthetic data is used for classroom training.
- Uploading current open invoices scores them but does not retrain the model.
- A production model requires historical invoices with actual payment dates.
- Predictions have an error margin and are not payment commitments.
- Strategic-customer, dispute, and concentration considerations require human judgment.
- Model version, random seed, training timestamp, and test metrics must be included in the run summary.

## Reusable repository architecture

Keep demos in their existing domain or technology folders. Add thin course-pack definitions rather than duplicating code.

```text
course-packs/
└── <course-pack-slug>/
    ├── course.json
    ├── demo-pack.json
    ├── participant-guide.md
    ├── instructor-guide.md
    ├── extension-pack.json
    └── assets/
```

For treasury-specific implementation, the first concrete pack may live under:

```text
course-packs/
└── treasury-course-demo-pack/
```

### Example demo-pack entry

```json
{
  "demoId": "invoice-payment-date-prediction",
  "required": true,
  "sequence": 3,
  "durationMinutes": 55,
  "packTheme": "Treasury, Liquidity, and Working Capital",
  "learningObjective": "Predict when invoices will be paid and translate the forecast into a liquidity decision.",
  "participantTask": "Compare due-date and predicted-date inflows over 14 days.",
  "deliverable": "Payment calendar, funding decision, and model-risk statement",
  "fallbackAsset": "assets/invoice-prediction-completed-run.pdf"
}
```

## Central demo metadata

Give every demo a stable identity and structured metadata.

```json
{
  "id": "invoice-payment-date-prediction",
  "title": "Invoice-Level Collections Prediction",
  "engineType": "machine-learning",
  "domainTags": ["treasury", "working-capital", "collections"],
  "conceptTags": ["classification", "regression", "cash-forecasting"],
  "runModes": ["colab", "local"],
  "durationMinutes": 55,
  "requiresApiKey": false,
  "supportsOwnData": true,
  "dataSensitivity": "confidential-financial-data",
  "currencies": ["INR", "USD", "generic"],
  "readiness": "classroom-ready",
  "lastVerified": "YYYY-MM-DD",
  "courseMappings": [
    "treasury-course-demo-pack",
    "treasury-management",
    "ai-ml-workflows"
  ]
}
```

### Metadata authority rules

To avoid multiple sources of truth:

- Central demo metadata is authoritative for demo identity, title, engine type, run modes, readiness, data sensitivity, and supported currencies.
- Course-pack JSON is authoritative only for sequence, teaching objective, participant task, deliverable, duration override, and fallback asset.
- Generated HTML pages and catalog artifacts are derived outputs and must not become the primary source of truth.

The existing catalog generator already deduplicates the same demo across course pages by its path. Enhance [build_site_catalog.py](/mnt/c/Users/vsathya/todel/gitrepos/KateelLearningDemosToStudents/scripts/build_site_catalog.py) to consume structured metadata rather than infer everything from HTML.

## Extension-pack integration requirements

The Treasury Course Demo Pack output should be reusable by downstream exercises such as:

- Power Automate: create tasks for invoices entering an escalation window.
- GenAI: draft customer communications and CFO cash commentary.
- Technology selection: determine which steps need ERP rules, RPA, ML, or GenAI.
- CFO-CIO governance: assign data ownership, model ownership, approval rights, and monitoring.
- Transformation roadmap: move from Colab prototype to an ERP-integrated service.

The exported collections action queue is the key bridge between treasury forecasting and later automation or governance exercises.

## Automated quality requirements

### Browser demos

- Page loads without console errors.
- All controls can be exercised.
- Outputs change when inputs change.
- Reset works.
- Export produces a non-empty valid file.
- Internal links return successfully.
- Chrome and Edge layouts remain usable at common laptop resolutions.

### Notebooks

- Clean execution from the first cell to the last using synthetic data.
- No hidden local-file dependency.
- Fixed random seed for repeatable classroom results.
- Required exports are generated.
- No participant or confidential data is committed.
- Notebook smoke-test failure causes CI to fail.

## Phase 2 enhancements

After the immediate treasury pack work:

- Build a no-code browser front end for invoice-date prediction.
- Add model-drift and forecast-accuracy monitoring.
- Add Power Automate sample flows.
- Add an instructor dashboard for comparing participant scenarios.
- Add cohort releases or Git tags so a class can run against a stable demo version.
- Archive obsolete demo variants and eliminate duplicate implementations.
- Add accessibility and mobile-layout checks.

## Explicitly out of scope for the first enhancement session

- Blockchain, stablecoin, or smart-contract demos
- Production ERP integration
- Real customer or participant data
- Enterprise authentication
- Live GenAI or API dependencies
- Rewriting every demo in the repository

## Primary deliverables for the next implementation session

Scope the next build session to `TDP-01` through `TDP-09`, with these as the main deliverables:

- Invoice notebook hardening
- Treasury Course Demo Pack landing page
- Reusable pack metadata structure
- Participant guide
- Instructor guide
- Automated preflight and notebook smoke tests
