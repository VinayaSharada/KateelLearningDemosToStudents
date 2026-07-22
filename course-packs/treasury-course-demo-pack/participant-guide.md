# Treasury Course Demo Pack Participant Guide

## Purpose

This guide helps participants move through the treasury demo pack in teaching order and capture the expected outputs.

## Before you start

- Use the `About Demo` page before launching each demo.
- Assume all sample data is synthetic unless a page explicitly states otherwise.
- Do not upload confidential ERP, customer, or participant data.
- If a live notebook run fails, use the fallback asset listed by the instructor.

## Session flow

### 1. Treasury Control Tower

- Time: `20 minutes`
- Goal: Understand the operating picture before going deeper into forecasting and collections.
- Task: Change the controls and note which alerts or actions become more important.
- Output: A short note with the top three treasury actions you would take.

### 2. Invoice-Level Collections Prediction

- Time: `55 minutes`
- Goal: Compare due-date inflows with ML-adjusted expected-payment-date inflows.
- Task:
  - Run the notebook using synthetic data.
  - Review the 7-, 14-, and 30-day inflow views.
  - Examine the largest slippages and concentration dates.
- Output:
  - `invoice_payment_predictions.csv`
  - `collections_action_queue.csv`
  - One paragraph on model risk and forecast usefulness

### 3. AR Aging and Collections Prioritizer

- Time: `35 minutes`
- Goal: Turn receivables signals into a practical collections worklist.
- Task: Rank outreach actions and explain why the ordering makes sense.
- Output: A prioritized collections queue with reasoning.

### 4. Dell vs Competitors Working Capital Case

- Time: `25 minutes`
- Goal: Link payment timing to broader working-capital strategy.
- Task: Compare DSO sensitivity and explain cash freed if DSO improves.
- Output: A short case comparison and one treasury implication.

### 5. Liquidity Management

- Time: `30 minutes`
- Goal: Convert expected inflows into a liquidity action plan.
- Task: Explain how treasury should react if collections slip or concentrate.
- Output: A funding or buffer recommendation.

## What to watch for

- Contractual due dates are not the same as likely cash-receipt dates.
- A prediction is a planning aid, not a payment commitment.
- Large customers, disputes, and concentration risk still require human judgment.
- Automation decisions should distinguish deterministic rules from model-based scoring.

## Required deliverables

- Payment calendar
- Collections action queue
- Funding or liquidity recommendation
- Model-risk statement
- Technology or governance reflection, if extension exercises are assigned
