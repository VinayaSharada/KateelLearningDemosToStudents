# Collections Predictor

## Overview

Browser-based collections prioritization demo where students test receivables scenarios, compare collection strategies, and examine how AI recommendations change outreach urgency, expected recovery, and working-capital impact.

## Learning Objectives

- Explain the main treasury decision that Collections Predictor is designed to support.
- Use Collection strategy, Enable AI recommendation to test how different assumptions change the scenario.
- Interpret Output Summary in plain language and connect them to an action or conclusion.
- State one limitation, risk, or governance consideration before using the result in a real decision.

## Run Modes

- Browser

## Expected Setup / Startup Time

- Starts immediately in browser with no installs, no API keys, and classroom-safe defaults.

## Demo Type

- Interactive browser demo

## Files in This Folder

- `about.html`
- `app.js`
- `index.html`
- `README.md`
- `style.css`

## How To Run

- Browser: open `index.html`.

## How To Use The Demo

1. Choose the run mode that fits the class: Browser.
2. Review the default assumptions before changing anything.
3. Change the collection strategy — the results update immediately, no button needed.
4. Read Output Summary first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Collection strategy` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Enable AI recommendation` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Reset Scenario` restores the default collections case so learners can compare strategies from a known baseline.
- `Export Result` saves the current collections recommendation and projected outcome for class discussion or follow-up analysis.

## Outputs

- Read the predicted collection outcome and recommended treatment path together, because the suggested action matters as much as the score.
- Look for recovery potential, urgency, and customer treatment differences across strategies or segments.

## What To Notice

- Look for customer risk score, payment history, amount due, and collection priority
- Observe how segmenting customers changes collection strategy
- Note that collections analytics should improve cash recovery while preserving customer relationships
- Compare the headline output with supporting views such as Output Summary before drawing a conclusion

## What you can enhance on your own

- Replace the headline scenario comparison with a larger inspectable invoice queue and visible priority drivers.
- Add editable scoring weights for overdue days, dispute status, payment history, and relationship importance.
- Add overrides for disputed invoices, strategic customers, and analyst capacity constraints.
- Export a fuller collections work queue with owner, treatment path, and escalation timing.

## How to adapt this demo to your use case

- Map your own sanitized receivables extract into invoice-level fields before changing strategy assumptions.
- Revalidate the scoring weights with collections, sales, and customer-success stakeholders so the queue reflects real trade-offs.
- Separate probability of payment, expected recovery, and treatment recommendation in your local version if different teams own those decisions.
- Use the browser demo as transparent rule-based prioritization unless you later connect it to a real trained model.

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [AI Hedge Orchestrator](../AIHedgeOrchestrator/about.html)
- Related demo: [CCC Analyzer](../CCCAnalyzer/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`
