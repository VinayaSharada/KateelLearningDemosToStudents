# Invoice-Level Collections Prediction Notebook Hub

Colab-based Treasury Management demo focused on invoice-level late-payment prediction, collections prioritization, and calendar-ready cash inflow forecasting.

## What it covers

- Customer payment history and average days beyond terms
- Invoice amount, payment terms, channel, and dispute signals
- Industry stress, regional conditions, and seasonality
- Relationship quality signals that separate strategic delay from real collections risk
- A downloadable data template so students can run the notebook on their own ERP invoice export instead of synthetic data
- A second model that predicts *when* each invoice is expected to be paid, exported as a calendar-ready daily expected-inflow feed (plus an optional Google Calendar-style import file)

## Run mode

- Primary: Google Colab
- Secondary: export and extend in your own notebook environment

## Notebook

- `invoice_level_collections_prediction.ipynb`

## Bring your own data

The notebook generates `invoice_data_template.csv` (a starter file with the exact columns it expects, pre-filled with sample rows) that students can download, fill with a real ERP export, and re-upload. Required columns are validated with a clear error if missing; optional columns (historical days-late, payment history score, dispute flag, relationship strength, seasonality) are defaulted to neutral values when absent, and the notebook reports how many rows used a default rather than silently guessing.

## Calendar output: without AI vs. with AI

Alongside the existing late-payment classifier, the notebook trains a regressor that predicts days late (or early) relative to each invoice's due date. It then builds the expected-inflow calendar **two ways** from the same invoices, so the model's contribution is visible rather than assumed:

- **Without AI** — the naive forecast: assume every invoice pays exactly on its `due_date`.
- **With AI** — `expected_payment_date = due_date + predicted_days_vs_due`, using the regressor's prediction.

Both are charted side by side, summarized as a near-term expected-inflow comparison number, and exported as separate daily-aggregate CSVs (plus a combined per-invoice CSV with both dates) — the outputs needed to drive a calendar tracker or short-term cash forecast, and to argue about whether the AI prediction is actually worth trusting.

## Model accuracy: RMSE, train vs. test

Before trusting either calendar, the notebook evaluates the days-late regressor with a table comparing RMSE and MAE across four rows: a naive "always assume the due date" baseline vs. the AI regressor, each measured on both the training set and a held-out test set. A train/test gap flags overfitting; the naive-vs-AI gap is the actual accuracy the model is contributing. A scatter plot of predicted vs. actual days late (train and test side by side, with a perfect-prediction reference line) makes the same comparison visual.

## Economic value of forecast accuracy

The RMSE improvement from the AI regressor is translated into an annual dollar figure using a standard treasury framing: tighter forecast uncertainty needs a smaller cash buffer, which frees capital that would otherwise sit idle or draw a commitment fee. The calculation (`buffer_reduction_days × avg_daily_inflow × cost_of_capital_rate`) is fully exposed with an adjustable `COST_OF_CAPITAL_RATE`, and the notebook is explicit that this is a discussion-starting estimate, not a boardroom-ready number — it depends on the RMSE-to-buffer assumption, the rate chosen, and today's portfolio being representative.

## Teaching use

Use this demo after the browser-based `Collections Predictor` when you want students to see the underlying feature engineering, synthetic data generation, model scoring, and calendar-forecast path in Python.

## Who this is for

- CFOs and aspiring CFOs
- Treasury, collections, FP&A, and finance analytics teams
- Faculty adopting the demo in multiple courses
- Students learning how invoice signals become cash forecasts

## Self-service use

- Download the template and map your own sanitized ERP invoice export into the required columns.
- Re-run the notebook on your own data and compare baseline due-date inflows with predicted-date inflows.
- Use the exported action queue, daily inflow files, and run summary as starter artifacts for your own treasury process.
