"""Build missing CFOPackV001 prerequisite outputs for standalone notebooks.

The workshop is designed to run N1 through N8 in sequence.  Colab users may
nevertheless open a later notebook in a fresh runtime.  ``ensure_outputs``
reconstructs only the missing upstream CSVs from the published synthetic data
so every notebook can also run independently.
"""

from pathlib import Path

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split


DEFAULT_DATA_URL = (
    "https://raw.githubusercontent.com/VinayaSharada/"
    "KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic"
)


def _read(data_url, name):
    return pd.read_csv(f"{data_url}/{name}")


def _build_n1(output_dir, data_url):
    invoices = _read(data_url, "invoices.csv")
    payments = _read(data_url, "payments.csv")
    customers = _read(data_url, "customers.csv")
    fx_exposure = _read(data_url, "fx_exposure.csv")
    cash_flow = _read(data_url, "cash_flow.csv")

    validated = invoices.merge(
        customers[["customer_id", "avg_days_late", "risk_score", "industry"]],
        on="customer_id",
        how="left",
    ).merge(
        payments[["invoice_id", "payment_date", "days_late"]],
        on="invoice_id",
        how="left",
        suffixes=("", "_actual"),
    )
    validated.rename(columns={"days_late": "actual_days_late"}, inplace=True)

    validated.to_csv(output_dir / "N1_validated_data.csv", index=False)
    customers.to_csv(output_dir / "N1_customers.csv", index=False)
    fx_exposure.to_csv(output_dir / "N1_fx_exposure.csv", index=False)
    cash_flow.to_csv(output_dir / "N1_cash_flow.csv", index=False)


def _build_n2(output_dir):
    validated = pd.read_csv(output_dir / "N1_validated_data.csv")
    cash_flow = pd.read_csv(output_dir / "N1_cash_flow.csv")
    validated["due_date"] = pd.to_datetime(validated["due_date"])
    cash_flow["date"] = pd.to_datetime(cash_flow["date"])

    forecast_start = cash_flow["date"].min()
    forecast_end = cash_flow["date"].max()
    inflows = validated[["invoice_id", "customer_id", "due_date", "amount_usd"]].copy()
    inflows.columns = ["invoice_id", "customer_id", "payment_date", "payment_amount"]
    inflows = inflows[inflows["payment_date"].between(forecast_start, forecast_end)]

    daily = []
    closing_cash = 5_000_000.0
    for day_num, row in cash_flow.reset_index(drop=True).iterrows():
        opening_cash = closing_cash
        day_inflows = inflows.loc[
            inflows["payment_date"] == row["date"], "payment_amount"
        ].sum()
        day_outflows = row["total_outflows"]
        net_change = day_inflows - day_outflows
        closing_cash = opening_cash + net_change
        daily.append(
            {
                "day": day_num + 1,
                "date": row["date"],
                "opening_cash": opening_cash,
                "inflows": day_inflows,
                "outflows": day_outflows,
                "net_change": net_change,
                "closing_cash": closing_cash,
            }
        )
    pd.DataFrame(daily).to_csv(output_dir / "N2_baseline_forecast.csv", index=False)


def _build_n3(output_dir):
    validated = pd.read_csv(output_dir / "N1_validated_data.csv")
    features = ["amount_usd", "payment_terms_days", "avg_days_late", "risk_score"]
    training = validated[validated["status"] == "paid"].dropna(
        subset=features + ["actual_days_late"]
    )
    x_train, _, y_train, _ = train_test_split(
        training[features],
        training["actual_days_late"],
        test_size=0.2,
        random_state=42,
    )
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(x_train, y_train)

    outstanding = validated[validated["status"] == "outstanding"].copy()
    predicted_days_late = model.predict(outstanding[features]).round(1)
    predictions = outstanding[["invoice_id", "customer_id", "due_date", "amount_usd"]].copy()
    predictions["predicted_days_late"] = predicted_days_late
    predictions["due_date"] = pd.to_datetime(predictions["due_date"])
    predictions["predicted_payment_date"] = predictions["due_date"] + pd.to_timedelta(
        predictions["predicted_days_late"], unit="D"
    )
    predictions.to_csv(output_dir / "N3_invoice_payment_predictions.csv", index=False)


def _build_n4(output_dir):
    baseline = pd.read_csv(output_dir / "N2_baseline_forecast.csv")
    predictions = pd.read_csv(output_dir / "N3_invoice_payment_predictions.csv")
    cash_flow = pd.read_csv(output_dir / "N1_cash_flow.csv")
    baseline["date"] = pd.to_datetime(baseline["date"])
    predictions["predicted_payment_date"] = pd.to_datetime(
        predictions["predicted_payment_date"]
    )
    cash_flow["date"] = pd.to_datetime(cash_flow["date"])

    forecast_start = cash_flow["date"].min()
    forecast_end = cash_flow["date"].max()
    inflows = predictions[["invoice_id", "predicted_payment_date", "amount_usd"]].copy()
    inflows.columns = ["invoice_id", "payment_date", "payment_amount"]
    inflows = inflows[inflows["payment_date"].between(forecast_start, forecast_end)]

    daily = []
    closing_cash = 5_000_000.0
    for day_num, row in cash_flow.reset_index(drop=True).iterrows():
        opening_cash = closing_cash
        day_inflows = inflows.loc[
            inflows["payment_date"] == row["date"], "payment_amount"
        ].sum()
        day_outflows = row["total_outflows"]
        net_change = day_inflows - day_outflows
        closing_cash = opening_cash + net_change
        daily.append(
            {
                "day": day_num + 1,
                "date": row["date"],
                "opening_cash": opening_cash,
                "inflows": day_inflows,
                "outflows": day_outflows,
                "net_change": net_change,
                "closing_cash": closing_cash,
            }
        )
    revised = pd.DataFrame(daily)
    comparison = baseline[["day", "date", "closing_cash"]].copy()
    comparison.columns = ["day", "date", "baseline_closing_cash"]
    comparison["revised_closing_cash"] = revised["closing_cash"].values
    comparison["gap"] = (
        comparison["baseline_closing_cash"] - comparison["revised_closing_cash"]
    )
    revised.to_csv(output_dir / "N4_revised_forecast.csv", index=False)
    comparison.to_csv(output_dir / "N4_gap_analysis.csv", index=False)


def _build_n5(output_dir):
    predictions = pd.read_csv(output_dir / "N3_invoice_payment_predictions.csv")
    total_ar = predictions["amount_usd"].sum()
    assumed_inventory_value = 8_000_000
    assumed_cogs = 60_000_000
    collections = (5 / 365) * total_ar
    inventory = 0.10 * assumed_inventory_value
    payables = (7 / 365) * assumed_cogs
    scenarios = [
        ("Baseline", 0, 0, 0, "No changes", None),
        ("Collections Push", 5, 0, 0, "Activate dunning + early-pay discounts", collections),
        ("Inventory Reduction", 0, 10, 0, "JIT inventory + demand forecast", inventory),
        ("Extend Payables", 0, 0, 7, "Negotiate extended terms with suppliers", payables),
        (
            "Combined (Collections + Payables)",
            5,
            0,
            7,
            "Both collections push AND payables extension",
            collections + payables,
        ),
        (
            "All Three Levers",
            5,
            10,
            7,
            "Collections + Inventory + Payables",
            collections + inventory + payables,
        ),
    ]
    columns = [
        "scenario",
        "dso_reduction",
        "dio_reduction",
        "dpo_increase",
        "description",
        "cash_impact",
    ]
    pd.DataFrame(scenarios, columns=columns).to_csv(
        output_dir / "N5_ccc_scenarios.csv", index=False
    )


def _build_n6(output_dir):
    exposure = pd.read_csv(output_dir / "N1_fx_exposure.csv")
    total_exposure = exposure["notional_amount"].sum()
    rows = []
    for hedge_ratio in [0.50, 0.65, 0.75, 0.85]:
        hedge_amount = total_exposure * hedge_ratio
        monthly_cost = hedge_amount * 0.005
        rows.append(
            {
                "hedge_ratio": hedge_ratio,
                "hedge_amount": hedge_amount,
                "monthly_cost": monthly_cost,
                "annual_cost": monthly_cost * 12,
                "unhedged_exposure": total_exposure * (1 - hedge_ratio),
            }
        )
    pd.DataFrame(rows).to_csv(output_dir / "N6_hedge_recommendation.csv", index=False)


def ensure_outputs(output_dir, through, data_url=DEFAULT_DATA_URL):
    """Create missing N1..N6 outputs through the requested module number."""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    builders = {
        1: ("N1_validated_data.csv", lambda: _build_n1(output_dir, data_url)),
        2: ("N2_baseline_forecast.csv", lambda: _build_n2(output_dir)),
        3: ("N3_invoice_payment_predictions.csv", lambda: _build_n3(output_dir)),
        4: ("N4_gap_analysis.csv", lambda: _build_n4(output_dir)),
        5: ("N5_ccc_scenarios.csv", lambda: _build_n5(output_dir)),
        6: ("N6_hedge_recommendation.csv", lambda: _build_n6(output_dir)),
    }
    for module_number in range(1, through + 1):
        filename, builder = builders[module_number]
        if not (output_dir / filename).exists():
            print(f"[SETUP] Building missing prerequisite: {filename}")
            builder()
