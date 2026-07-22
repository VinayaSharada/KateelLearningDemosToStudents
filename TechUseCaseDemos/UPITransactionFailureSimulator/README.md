# UPI Transaction and Failure Simulator

Browser-based Digital Payments demo focused on UPI operational states:

- push vs collect
- timeout and pending states
- duplicate instructions
- reversals
- limit checks
- fraud review
- reconciliation exceptions

## Run mode

Open `index.html` in a browser or via GitHub Pages.

## What you can enhance on your own

- Add more state branches such as beneficiary-bank posting delay, issuer timeout, or duplicate reversal handling.
- Add explicit metrics for unresolved pendings, complaint volume, and analyst workload.
- Add reference-number matching or reconciliation-file views to show how operations teams investigate breaks.
- Add a facilitator mode that compares low-friction approval versus stronger fraud-control timing.

## How to adapt this demo to your use case

- Replace the classroom assumptions with the failure patterns, limits, and review paths most relevant to your institution or course.
- Confirm which exceptions are customer-visible versus back-office-only before using it for operating-model discussions.
- Use the demo with payments, operations, fraud, support, or faculty audiences by changing the discussion prompt rather than the core flow.
- Keep the simulation rule-based and transparent unless you later connect it to real operational data or risk models.
