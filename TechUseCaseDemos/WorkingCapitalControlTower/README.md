# Working Capital Control Tower — Agent Swarm Simulation

Browser-first demo: an agent swarm turns five finance CSV exports into a
collections plan, a reconciled cash position, a 13-week forecast and a
funded borrow/invest plan — for a fictional mid-market manufacturer
(Kaveri Auto Components Ltd). All results are pre-computed and synthetic;
the page makes no network calls and needs no keys.

## Learning objectives

- Forecast quality is a funding cost: narrower prediction bands mean a
  smaller safety cushion and less standby borrowing (toggle AI on/off and
  watch peak WC draw move ₹14.9 cr → ₹12.5 cr).
- Reconciliation is an exception-queue discipline, not a matching contest.
- Governed agent design: agents decide and explain; deterministic code
  computes; humans sign.

## Run modes

- **Browser** (this folder): open `index.html`. No setup.
- **Live tier**: registered executive-education participants get the full
  Python pipeline, Streamlit control tower and multi-provider agent swarm,
  with seeded synthetic data replaceable by their own ERP exports.

## Expected setup time

0 minutes (browser). Demo type: interactive simulation with AI on/off
comparison and an animated swarm timeline.

## Files in this folder

`index.html` · `about.html` · `app.js` · `data.js` (pre-computed synthetic
results) · `style.css`

## How to run

Open `index.html` in any modern browser, or serve the folder statically.

## What you can enhance on your own

Change the toggle's framing, add your own discussion prompts, or use the
About page's adapt-to-your-data notes to scope a pilot on your own AR/bank
exports (live tier).

*All data synthetic; no real person or company records.*
