# Treasury Course Demo Pack Instructor Guide

## Teaching purpose

This pack is designed to run a treasury learning session using shared demos without cloning or rewriting them. The core thread is:

1. See the treasury operating picture.
2. Predict cash receipt timing.
3. Prioritize collections.
4. Connect the result to working capital.
5. Convert the result into liquidity action.

## Suggested run plan

### Segment 1: Treasury Control Tower

- Time: `20 minutes`
- Teaching cue: Use this to frame treasury as a decision system, not just a dashboard.
- Watch for: Students focusing on visible alerts without explaining implications.
- Fallback: Use `assets/treasury-control-tower-fallback.md`.

### Segment 2: Invoice-Level Collections Prediction

- Time: `55 minutes`
- Teaching cue: Emphasize the difference between due-date forecasting and expected-payment-date forecasting.
- Watch for:
  - Students treating model output as a certainty
  - Confusion between scoring and retraining
  - Failure to interpret concentration risk
- Required outputs:
  - `invoice_payment_predictions.csv`
  - `daily_inflow_predicted.csv`
  - `collections_action_queue.csv`
  - `model_run_summary.json`
- Fallback: Use `assets/invoice-prediction-completed-run.md`.

### Segment 3: AR Aging and Collections Prioritizer

- Time: `35 minutes`
- Teaching cue: Push students to justify prioritization using both value and urgency.
- Watch for: Over-prioritizing invoice size without considering payment timing.
- Fallback: Use `assets/ar-aging-prioritizer-fallback.md`.

### Segment 4: Dell vs Competitors Working Capital Case

- Time: `25 minutes`
- Teaching cue: Move from invoice-level analytics to strategic working-capital interpretation.
- Watch for: Students discussing DSO in isolation without linking it to treasury actions.
- Fallback: Use `assets/dell-working-capital-fallback.md`.

### Segment 5: Liquidity Management

- Time: `30 minutes`
- Teaching cue: Tie forecast timing into buffers, funding posture, and concentration exposure.
- Watch for: Generic liquidity answers that ignore the forecast outputs produced earlier.
- Fallback: Use `assets/liquidity-management-fallback.md`.

## Discussion prompts

- Which output changed the treasury decision the most: baseline due dates or predicted payment dates?
- When should a process remain rule-based instead of becoming ML-assisted?
- What would a CFO need to know before trusting this output in a funding decision?
- Which parts of the collections workflow are good candidates for automation?

## Preflight checklist

- Confirm all pack demo links open.
- Confirm the notebook starts in a fresh Colab session.
- Confirm required exports are named as expected.
- Confirm fallback assets exist for every required demo.
- Confirm no confidential data is present in the notebook or samples.
- Confirm the classroom can proceed even if one notebook run fails.

## Extension exercises

If time permits, reuse `collections_action_queue.csv` for:

- Power Automate escalation logic
- GenAI customer communication drafting
- Technology-selection workshops
- Treasury governance and ownership mapping
