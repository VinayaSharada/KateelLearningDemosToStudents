# Treasury Control Tower

## Overview

Browser-based hands-on exercise for treasury modernization and liquidity visibility (Session 1).

## Learning Objectives

- Explain the main treasury decision that Treasury Control Tower is designed to support.
- Use Stress Scenario, Enable AI Insights to test how different assumptions change the scenario.
- Interpret ai Insight in plain language and connect them to an action or conclusion.
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
- `demo.html`
- `index.html`
- `README.md`
- `style.css`

## How To Run

- Browser: open `demo.html`.

## How To Use The Demo

1. Choose the run mode that fits the class: Browser.
2. Review the default assumptions before changing anything.
3. Change one or two inputs, then use `Reset`.
4. Read ai Insight first, then compare any supporting metrics, charts, or AI text.
5. Capture one insight, one limitation, and one action recommendation.

## Inputs

- `Stress Scenario` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.
- `Enable AI Insights` changes one part of the scenario; increase or decrease it deliberately and watch how the output shifts.

## Buttons / Actions

- `Reset` returns the demo to a known starting state so students can begin a fresh comparison.
- `Compare Scenarios` is the main action that computes, compares, or generates the next result from the current inputs.
- `Export Results` saves the current result so learners can document evidence or compare scenarios later.

## Outputs

- `ai Insight` should be read as evidence for the decision, not just a display element. Ask what high, low, or changing values imply.

## What To Notice

- Look for cash position, forecast gap, stress scenario, and recommended action
- Observe how liquidity changes when inflows fall, outflows accelerate, or reserves are stressed
- Note that students should translate dashboard signals into a treasury decision and escalation path
- Compare the headline output with supporting views such as ai Insight before drawing a conclusion

## What you can enhance on your own

- Add editable inputs for opening cash, credit-facility limits, borrowing rate, and minimum liquidity buffer.
- Add side-by-side baseline versus stress comparison with a visible intervention date.
- Export a daily cash projection and a short treasury decision record, not just a snapshot.
- Relabel any narrative layer as `rule-based guidance` unless the logic becomes genuinely predictive.

## How to adapt this demo to your use case

- Replace the sample liquidity assumptions with your own weekly or daily cash-planning structure.
- Revalidate which stress scenarios matter most in your context: delayed collections, accelerated supplier payments, tax outflows, or emergency spending.
- Keep the demo output advisory until treasury owners confirm the assumptions, facility constraints, and escalation rules.
- If you adopt this in a course, keep the core demo unchanged and move course-specific framing into the assignment or facilitator guide.

## Related Demos or Course Context

- Course path: [Treasury Management](../../courses/treasury-management.html)
- Related demo: [Monte Carlo Company Valuation](../MonteCarloCompanyValuation/about.html)
- Related demo: [AI Hedge Orchestrator](../AIHedgeOrchestrator/about.html)
- Related demo: [CCC Analyzer](../CCCAnalyzer/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`

## Business decision

Use this demo to make the central decision in Treasury Control Tower explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.
