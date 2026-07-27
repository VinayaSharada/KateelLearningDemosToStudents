"""Shared calculation engine for the CFOPackV002 Liquidity War Room.

The notebooks deliberately keep calculations here so every participant and
instructor artifact uses the same versioned financial logic.
"""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


DATA_FILES = {
    "customers": "customers.csv",
    "invoices": "invoices.csv",
    "payments": "payments.csv",
    "operating_outflows": "operating_outflows.csv",
    "supplier_payments": "supplier_payments.csv",
    "fx_exposures": "fx_exposures.csv",
    "inventory_options": "inventory_options.csv",
}


def load_manifest(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def load_inputs(data_dir: str | Path) -> dict[str, pd.DataFrame]:
    directory = Path(data_dir)
    return {
        name: pd.read_csv(directory / filename)
        for name, filename in DATA_FILES.items()
    }


def default_decisions(manifest: dict[str, Any]) -> dict[str, Any]:
    return json.loads(json.dumps(manifest["default_participant_decisions"]))


def validate_inputs(
    data: dict[str, pd.DataFrame], manifest: dict[str, Any]
) -> pd.DataFrame:
    required = {
        "customers": {"customer_id", "industry", "segment", "risk_score", "dispute_rate_12m"},
        "invoices": {"invoice_id", "customer_id", "invoice_date", "due_date", "amount_usd", "status"},
        "payments": {"payment_id", "invoice_id", "payment_date", "amount_usd", "days_late"},
        "operating_outflows": {"day", "date", "total_operating_outflows"},
        "supplier_payments": {"supplier_payment_id", "due_date", "amount_usd", "extension_eligible"},
        "fx_exposures": {"currency", "direction", "foreign_notional", "spot_usd_per_unit"},
        "inventory_options": {"release_pct", "cash_day", "execution_cost_pct"},
    }
    checks: list[dict[str, Any]] = []

    def add(check: str, status: str, detail: str, blocking: bool = False) -> None:
        checks.append({"check": check, "status": status, "blocking": blocking, "detail": detail})

    for name, columns in required.items():
        missing = sorted(columns - set(data[name].columns))
        add(
            f"{name}: required columns",
            "PASS" if not missing else "FAIL",
            "All required columns present" if not missing else f"Missing: {', '.join(missing)}",
            bool(missing),
        )

    invoices = data["invoices"]
    payments = data["payments"]
    customers = data["customers"]
    customer_orphans = set(invoices["customer_id"]) - set(customers["customer_id"])
    invoice_orphans = set(payments["invoice_id"]) - set(invoices["invoice_id"])
    add(
        "Invoice-to-customer integrity",
        "PASS" if not customer_orphans else "FAIL",
        f"{len(customer_orphans)} undefined customer references",
        bool(customer_orphans),
    )
    add(
        "Payment-to-invoice integrity",
        "PASS" if not invoice_orphans else "FAIL",
        f"{len(invoice_orphans)} undefined invoice references",
        bool(invoice_orphans),
    )
    duplicate_invoices = int(invoices["invoice_id"].duplicated().sum())
    add(
        "Unique invoice identifiers",
        "PASS" if duplicate_invoices == 0 else "FAIL",
        f"{duplicate_invoices} duplicate invoice IDs",
        duplicate_invoices > 0,
    )
    nonpositive = int((invoices["amount_usd"] <= 0).sum())
    add(
        "Positive invoice amounts",
        "PASS" if nonpositive == 0 else "FAIL",
        f"{nonpositive} non-positive invoice amounts",
        nonpositive > 0,
    )
    horizon_rows = len(data["operating_outflows"])
    expected_days = int(manifest["forecast_horizon_days"])
    add(
        "Forecast horizon coverage",
        "PASS" if horizon_rows == expected_days else "FAIL",
        f"{horizon_rows} scheduled days; expected {expected_days}",
        horizon_rows != expected_days,
    )
    paid_without_payment = set(invoices.loc[invoices["status"].eq("paid"), "invoice_id"]) - set(
        payments["invoice_id"]
    )
    add(
        "Paid invoice evidence",
        "PASS" if not paid_without_payment else "WARN",
        f"{len(paid_without_payment)} paid invoices lack a payment record",
        False,
    )
    return pd.DataFrame(checks)


def assumptions_register(manifest: dict[str, Any]) -> pd.DataFrame:
    facility = manifest["credit_facility"]
    accounting = manifest["accounting_inputs"]
    policy = manifest["fx_policy"]
    rows = [
        ("Scenario", "As-of date", manifest["as_of_date"], "Scenario manifest", "Fixed workshop date"),
        ("Forecast", "Horizon days", manifest["forecast_horizon_days"], "Scenario manifest", "Participant may select forecast view, not horizon"),
        ("Liquidity", "Opening cash", manifest["opening_cash"], "Scenario manifest", "Available cash at start of Day 1"),
        ("Liquidity", "Minimum liquidity", manifest["minimum_liquidity"], "Policy", "Escalation threshold"),
        ("Funding", "Facility capacity", facility["committed_capacity"], "Facility term sheet", "Hard maximum"),
        ("Funding", "Annual interest rate", facility["annual_interest_rate"], "Facility term sheet", "Prorated over 30-day horizon"),
        ("Funding", "Draw fee rate", facility["draw_fee_rate"], "Facility term sheet", "One-time fee"),
        ("Working capital", "Inventory value", accounting["inventory_value"], "Illustrative balance sheet", "Replace for company-data use"),
        ("Working capital", "Accounts payable", accounting["accounts_payable"], "Illustrative balance sheet", "Cross-check only"),
        ("Working capital", "Annual COGS", accounting["annual_cogs"], "Illustrative income statement", "Cross-check only"),
        ("FX", "Minimum hedge ratio", policy["minimum_hedge_ratio"], "Board policy", "Per exposure"),
        ("FX", "Maximum hedge ratio", policy["maximum_hedge_ratio"], "Board policy", "Per exposure"),
    ]
    return pd.DataFrame(rows, columns=["category", "assumption", "value", "source", "workshop_note"])


def _model_frame(data: dict[str, pd.DataFrame]) -> pd.DataFrame:
    paid = data["invoices"].query("status == 'paid'").copy()
    paid = paid.merge(data["payments"][["invoice_id", "days_late"]], on="invoice_id", how="inner")
    paid = paid.merge(data["customers"], on="customer_id", how="left")
    paid["invoice_date"] = pd.to_datetime(paid["invoice_date"])
    return paid.sort_values("invoice_date").reset_index(drop=True)


def train_collections_model(
    data: dict[str, pd.DataFrame], seed: int
) -> tuple[Pipeline, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    frame = _model_frame(data)
    split = int(len(frame) * 0.80)
    train = frame.iloc[:split].copy()
    test = frame.iloc[split:].copy()
    numeric = [
        "amount_usd",
        "payment_terms_days",
        "risk_score",
        "dispute_rate_12m",
        "relationship_years",
    ]
    categorical = ["industry", "segment", "key_account"]
    features = numeric + categorical
    preprocessor = ColumnTransformer(
        [
            ("numeric", StandardScaler(), numeric),
            ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical),
        ]
    )
    forest = RandomForestRegressor(
        n_estimators=180,
        max_depth=11,
        min_samples_leaf=5,
        random_state=seed,
        n_jobs=-1,
    )
    pipeline = Pipeline([("preprocessor", preprocessor), ("model", forest)])
    pipeline.fit(train[features], train["days_late"])
    test_prediction = pipeline.predict(test[features])
    industry_median = train.groupby("industry")["days_late"].median()
    baseline_prediction = test["industry"].map(industry_median).fillna(train["days_late"].median())
    mae = float(mean_absolute_error(test["days_late"], test_prediction))
    baseline_mae = float(mean_absolute_error(test["days_late"], baseline_prediction))
    model_card = pd.DataFrame(
        [
            ["Training rows", len(train)],
            ["Time-holdout rows", len(test)],
            ["Model MAE (days)", mae],
            ["Industry-median baseline MAE (days)", baseline_mae],
            ["MAE improvement vs baseline", (baseline_mae - mae) / baseline_mae],
            ["Time-holdout R2", float(r2_score(test["days_late"], test_prediction))],
        ],
        columns=["metric", "value"],
    )

    transformed_names = pipeline.named_steps["preprocessor"].get_feature_names_out()
    transformed_importance = pd.DataFrame(
        {
            "transformed_feature": transformed_names,
            "importance": pipeline.named_steps["model"].feature_importances_,
        }
    )
    raw_importance = []
    for feature in numeric:
        value = transformed_importance.loc[
            transformed_importance["transformed_feature"].eq(f"numeric__{feature}"), "importance"
        ].sum()
        raw_importance.append((feature, value))
    for feature in categorical:
        value = transformed_importance.loc[
            transformed_importance["transformed_feature"].str.startswith(f"categorical__{feature}_"),
            "importance",
        ].sum()
        raw_importance.append((feature, value))
    feature_importance = pd.DataFrame(raw_importance, columns=["feature", "importance"]).sort_values(
        "importance", ascending=False
    )

    outstanding = data["invoices"].query("status == 'outstanding'").copy()
    outstanding = outstanding.merge(data["customers"], on="customer_id", how="left")
    point_prediction = pipeline.predict(outstanding[features])
    transformed = pipeline.named_steps["preprocessor"].transform(outstanding[features])
    tree_predictions = np.vstack(
        [tree.predict(transformed) for tree in pipeline.named_steps["model"].estimators_]
    )
    predictions = outstanding[
        ["invoice_id", "customer_id", "due_date", "amount_usd", "industry", "segment", "key_account"]
    ].copy()
    predictions["predicted_days_late"] = np.clip(point_prediction, -5, 90).round(1)
    predictions["p75_days_late"] = np.clip(np.quantile(tree_predictions, 0.75, axis=0), -5, 90).round(1)
    predictions["prediction_spread_days"] = (
        np.quantile(tree_predictions, 0.90, axis=0) - np.quantile(tree_predictions, 0.10, axis=0)
    ).round(1)
    predictions["priority_score"] = (
        predictions["amount_usd"]
        * np.maximum(predictions["predicted_days_late"], 0)
        * np.where(predictions["key_account"], 0.85, 1.0)
    )
    predictions = predictions.sort_values("priority_score", ascending=False).reset_index(drop=True)
    return pipeline, model_card, feature_importance, predictions


def _forecast_dates(manifest: dict[str, Any]) -> pd.DatetimeIndex:
    return pd.date_range(
        manifest["as_of_date"], periods=int(manifest["forecast_horizon_days"]), freq="D"
    )


def receipt_schedule(
    predictions: pd.DataFrame,
    manifest: dict[str, Any],
    view: str,
    additional_delay_days: int = 0,
) -> pd.DataFrame:
    delay_column = "p75_days_late" if view == "p75" else "predicted_days_late"
    receipts = predictions[["invoice_id", "customer_id", "due_date", "amount_usd", delay_column]].copy()
    receipts["due_date"] = pd.to_datetime(receipts["due_date"])
    receipts["receipt_date"] = receipts["due_date"] + pd.to_timedelta(
        receipts[delay_column] + additional_delay_days, unit="D"
    )
    receipts["receipt_date"] = receipts["receipt_date"].dt.round("D")
    receipts["receipt_amount"] = receipts["amount_usd"]
    receipts["collection_selected"] = False
    receipts["collection_discount"] = 0.0
    return receipts


def contractual_receipts(data: dict[str, pd.DataFrame]) -> pd.DataFrame:
    outstanding = data["invoices"].query("status == 'outstanding'").copy()
    outstanding["receipt_date"] = pd.to_datetime(outstanding["due_date"])
    outstanding["receipt_amount"] = outstanding["amount_usd"]
    return outstanding[["invoice_id", "customer_id", "receipt_date", "receipt_amount"]]


def build_cash_forecast(
    receipts: pd.DataFrame,
    operating_outflows: pd.DataFrame,
    supplier_payments: pd.DataFrame,
    manifest: dict[str, Any],
    extra_receipts: pd.DataFrame | None = None,
    extra_outflows: pd.DataFrame | None = None,
) -> pd.DataFrame:
    dates = _forecast_dates(manifest)
    start, end = dates.min(), dates.max()
    receipt_rows = receipts[["receipt_date", "receipt_amount"]].copy()
    receipt_rows["receipt_date"] = pd.to_datetime(receipt_rows["receipt_date"]).clip(lower=start)
    if extra_receipts is not None and len(extra_receipts):
        receipt_rows = pd.concat(
            [receipt_rows, extra_receipts[["receipt_date", "receipt_amount"]]], ignore_index=True
        )
    receipt_rows = receipt_rows[
        receipt_rows["receipt_date"].between(start, end, inclusive="both")
    ]
    inflows = receipt_rows.groupby("receipt_date")["receipt_amount"].sum()

    operating = operating_outflows.copy()
    operating["date"] = pd.to_datetime(operating["date"])
    operating_series = operating.groupby("date")["total_operating_outflows"].sum()
    suppliers = supplier_payments.copy()
    suppliers["due_date"] = pd.to_datetime(suppliers["due_date"])
    supplier_series = suppliers.groupby("due_date")["amount_usd"].sum()
    other_outflows = pd.Series(dtype=float)
    if extra_outflows is not None and len(extra_outflows):
        extra = extra_outflows.copy()
        extra["date"] = pd.to_datetime(extra["date"])
        other_outflows = extra.groupby("date")["amount_usd"].sum()

    frame = pd.DataFrame({"date": dates})
    frame["day"] = np.arange(1, len(frame) + 1)
    frame["receipts"] = frame["date"].map(inflows).fillna(0.0)
    frame["operating_outflows"] = frame["date"].map(operating_series).fillna(0.0)
    frame["supplier_outflows"] = frame["date"].map(supplier_series).fillna(0.0)
    frame["other_outflows"] = frame["date"].map(other_outflows).fillna(0.0)
    frame["total_outflows"] = frame[
        ["operating_outflows", "supplier_outflows", "other_outflows"]
    ].sum(axis=1)
    frame["net_cash_flow"] = frame["receipts"] - frame["total_outflows"]
    frame["closing_cash"] = float(manifest["opening_cash"]) + frame["net_cash_flow"].cumsum()
    frame["opening_cash"] = frame["closing_cash"].shift(1, fill_value=float(manifest["opening_cash"]))
    frame["below_minimum"] = frame["closing_cash"] < float(manifest["minimum_liquidity"])
    return frame[
        [
            "day",
            "date",
            "opening_cash",
            "receipts",
            "operating_outflows",
            "supplier_outflows",
            "other_outflows",
            "total_outflows",
            "net_cash_flow",
            "closing_cash",
            "below_minimum",
        ]
    ]


def _apply_variant_outflow(
    operating: pd.DataFrame, manifest: dict[str, Any], variant_name: str
) -> pd.DataFrame:
    variant = manifest["scenario_variants"][variant_name]
    updated = operating.copy()
    if variant["surprise_outflow_day"] is not None:
        mask = updated["day"].eq(int(variant["surprise_outflow_day"]))
        updated.loc[mask, "other_operating_outflows"] += float(variant["surprise_outflow_amount"])
        updated.loc[mask, "total_operating_outflows"] += float(variant["surprise_outflow_amount"])
    return updated


def apply_liquidity_actions(
    base_receipts: pd.DataFrame,
    data: dict[str, pd.DataFrame],
    manifest: dict[str, Any],
    decisions: dict[str, Any],
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, dict[str, float]]:
    strategy_name = decisions["collection_strategy"]
    strategy = manifest["liquidity_actions"]["collection_strategies"][strategy_name]
    receipts = base_receipts.copy().sort_values(
        ["amount_usd", "receipt_date"], ascending=[False, False]
    )
    selection_count = int(math.ceil(len(receipts) * float(strategy["portfolio_fraction"])))
    if selection_count:
        selected_index = receipts.head(selection_count).index
        expected_acceleration = int(round(strategy["acceleration_days"] * strategy["success_rate"]))
        receipts.loc[selected_index, "receipt_date"] -= pd.to_timedelta(expected_acceleration, unit="D")
        receipts.loc[selected_index, "collection_selected"] = True
        receipts.loc[selected_index, "collection_discount"] = (
            receipts.loc[selected_index, "amount_usd"]
            * float(strategy["discount_rate"])
            * float(strategy["success_rate"])
        )
        receipts.loc[selected_index, "receipt_amount"] -= receipts.loc[
            selected_index, "collection_discount"
        ]

    suppliers = data["supplier_payments"].copy()
    suppliers["due_date"] = pd.to_datetime(suppliers["due_date"])
    extension_days = int(decisions["payables_extension_days"])
    eligible = suppliers["extension_eligible"].astype(bool)
    suppliers.loc[eligible, "applied_extension_days"] = np.minimum(
        extension_days, suppliers.loc[eligible, "max_extension_days"].astype(int)
    )
    suppliers["applied_extension_days"] = suppliers["applied_extension_days"].fillna(0).astype(int)
    suppliers["original_due_date"] = suppliers["due_date"]
    suppliers["due_date"] += pd.to_timedelta(suppliers["applied_extension_days"], unit="D")

    release_pct = float(decisions["inventory_release_pct"])
    inventory_options = data["inventory_options"].copy()
    option_index = (inventory_options["release_pct"] - release_pct).abs().idxmin()
    option = inventory_options.loc[option_index]
    inventory_gross = float(manifest["accounting_inputs"]["inventory_value"]) * release_pct
    inventory_cost = inventory_gross * float(option["execution_cost_pct"])
    inventory_net = inventory_gross - inventory_cost

    requested_draw = float(decisions["facility_draw"])
    capacity = float(manifest["credit_facility"]["committed_capacity"])
    if requested_draw < 0 or requested_draw > capacity:
        raise ValueError(f"Facility draw must be between 0 and {capacity:,.0f}")
    interest = requested_draw * float(manifest["credit_facility"]["annual_interest_rate"]) * (
        int(manifest["forecast_horizon_days"]) / 365
    )
    draw_fee = requested_draw * float(manifest["credit_facility"]["draw_fee_rate"])

    dates = _forecast_dates(manifest)
    extra_receipts = pd.DataFrame(
        [
            {
                "receipt_date": dates[0],
                "receipt_amount": requested_draw,
                "source": "Credit facility draw",
            },
            {
                "receipt_date": dates[int(option["cash_day"]) - 1],
                "receipt_amount": inventory_net,
                "source": "Inventory release",
            },
        ]
    )
    extra_outflows = pd.DataFrame(
        [
            {
                "date": dates[-1],
                "amount_usd": interest + draw_fee,
                "source": "Facility interest and draw fee",
            }
        ]
    )
    metrics = {
        "collection_discount_cost": float(receipts["collection_discount"].sum()),
        "inventory_gross_release": inventory_gross,
        "inventory_execution_cost": inventory_cost,
        "inventory_net_release": inventory_net,
        "facility_draw": requested_draw,
        "facility_interest": interest,
        "facility_draw_fee": draw_fee,
        "direct_action_cost": float(receipts["collection_discount"].sum()) + inventory_cost + interest + draw_fee,
        "supplier_payments_shifted": int((suppliers["applied_extension_days"] > 0).sum()),
    }
    return receipts, suppliers, extra_receipts, extra_outflows, metrics


def forecast_metrics(forecast: pd.DataFrame, manifest: dict[str, Any]) -> dict[str, float]:
    minimum_row = forecast.loc[forecast["closing_cash"].idxmin()]
    return {
        "ending_cash": float(forecast.iloc[-1]["closing_cash"]),
        "minimum_cash": float(minimum_row["closing_cash"]),
        "minimum_cash_day": int(minimum_row["day"]),
        "days_below_minimum": int(forecast["below_minimum"].sum()),
        "total_receipts": float(forecast["receipts"].sum()),
        "total_outflows": float(forecast["total_outflows"].sum()),
        "minimum_liquidity": float(manifest["minimum_liquidity"]),
    }


def evaluate_action_scenarios(
    realistic_receipts: pd.DataFrame,
    data: dict[str, pd.DataFrame],
    manifest: dict[str, Any],
    variant_name: str,
) -> tuple[pd.DataFrame, dict[str, pd.DataFrame]]:
    candidates = [
        ("No action", "none", 0, 0.0, 0),
        ("Operations first", "targeted", 5, 0.05, 0),
        ("Balanced liquidity", "targeted", 7, 0.05, 4_000_000),
        ("Liquidity protected", "broad", 10, 0.075, 8_000_000),
    ]
    operating = _apply_variant_outflow(data["operating_outflows"], manifest, variant_name)
    rows = []
    forecasts: dict[str, pd.DataFrame] = {}
    for name, collections, extension, inventory, draw in candidates:
        decisions = {
            "collection_strategy": collections,
            "payables_extension_days": extension,
            "inventory_release_pct": inventory,
            "facility_draw": draw,
        }
        receipts, suppliers, extra_receipts, extra_outflows, costs = apply_liquidity_actions(
            realistic_receipts, data, manifest, decisions
        )
        forecast = build_cash_forecast(
            receipts,
            operating,
            suppliers,
            manifest,
            extra_receipts=extra_receipts,
            extra_outflows=extra_outflows,
        )
        forecasts[name] = forecast
        metrics = forecast_metrics(forecast, manifest)
        rows.append(
            {
                "scenario": name,
                "collection_strategy": collections,
                "payables_extension_days": extension,
                "inventory_release_pct": inventory,
                "facility_draw": draw,
                "ending_cash": metrics["ending_cash"],
                "minimum_cash": metrics["minimum_cash"],
                "minimum_cash_day": metrics["minimum_cash_day"],
                "days_below_minimum": metrics["days_below_minimum"],
                "direct_action_cost": costs["direct_action_cost"],
                "policy_buffer_at_low_point": metrics["minimum_cash"] - float(manifest["minimum_liquidity"]),
            }
        )
    return pd.DataFrame(rows), forecasts


def analyze_fx(
    fx: pd.DataFrame,
    manifest: dict[str, Any],
    proposed_ratios: dict[str, float],
    variant_name: str,
) -> pd.DataFrame:
    policy = manifest["fx_policy"]
    multiplier = float(manifest["scenario_variants"][variant_name]["fx_adverse_multiplier"])
    rows = []
    for _, exposure in fx.iterrows():
        currency = str(exposure["currency"])
        proposed = float(proposed_ratios.get(currency, exposure["current_hedge_ratio"]))
        current = float(exposure["current_hedge_ratio"])
        notional_usd = float(exposure["foreign_notional"] * exposure["spot_usd_per_unit"])
        adverse_move = float(exposure["adverse_move_pct"]) * multiplier
        loss_before = notional_usd * (1 - current) * adverse_move
        loss_after = notional_usd * (1 - proposed) * adverse_move
        incremental_hedge = max(0.0, proposed - current) * notional_usd
        hedge_cost = incremental_hedge * float(exposure["forward_cost_bps"]) / 10_000
        rows.append(
            {
                "currency": currency,
                "direction": exposure["direction"],
                "maturity_day": int(exposure["maturity_day"]),
                "notional_usd": notional_usd,
                "current_hedge_ratio": current,
                "proposed_hedge_ratio": proposed,
                "incremental_hedge_usd": incremental_hedge,
                "adverse_move_pct": adverse_move,
                "adverse_loss_before": loss_before,
                "adverse_loss_after": loss_after,
                "loss_reduction": loss_before - loss_after,
                "one_time_forward_cost": hedge_cost,
                "net_downside_benefit": loss_before - loss_after - hedge_cost,
                "within_policy": bool(
                    policy["minimum_hedge_ratio"] <= proposed <= policy["maximum_hedge_ratio"]
                ),
            }
        )
    return pd.DataFrame(rows)


def funding_summary(
    action_metrics: dict[str, float], manifest: dict[str, Any]
) -> pd.DataFrame:
    draw = action_metrics["facility_draw"]
    facility = manifest["credit_facility"]
    if draw > facility["board_notification_threshold"]:
        approval = "CFO approval + board notification"
    elif draw > facility["cfo_approval_threshold"]:
        approval = "CFO approval"
    elif draw > 0:
        approval = "Treasurer recommendation + CFO confirmation"
    else:
        approval = "No draw approval required"
    return pd.DataFrame(
        [
            ["Requested draw", draw],
            ["Committed capacity", facility["committed_capacity"]],
            ["Remaining capacity", facility["committed_capacity"] - draw],
            ["30-day interest", action_metrics["facility_interest"]],
            ["Draw fee", action_metrics["facility_draw_fee"]],
            ["Approval path", approval],
        ],
        columns=["measure", "value"],
    )


def build_action_plan(
    decisions: dict[str, Any], selected_metrics: dict[str, float], manifest: dict[str, Any]
) -> tuple[pd.DataFrame, pd.DataFrame]:
    minimum = manifest["minimum_liquidity"]
    tasks = [
        ("DECIDE", "Approve liquidity package", "CFO", 0, "Signed decision paper and authority record"),
        ("PREPARE", "Validate priority receivables", "Collections Lead", 1, "Target list approved by Sales and Controller"),
        ("PREPARE", "Confirm supplier extension eligibility", "Procurement Lead", 1, "Eligible suppliers and relationship risks documented"),
        ("EXECUTE", f"Launch {decisions['collection_strategy']} collections strategy", "Collections Lead", 2, "Daily receipts tracked against selected forecast"),
        ("EXECUTE", f"Request up to {decisions['payables_extension_days']} days supplier extension", "Procurement Lead", 3, "Agreed dates recorded in AP system"),
        ("EXECUTE", f"Release {decisions['inventory_release_pct']:.1%} of inventory value", "COO", 12, "Net cash release and service-level impact validated"),
        ("EXECUTE", f"Draw ${decisions['facility_draw']:,.0f} committed funding", "Treasurer", 1, "Draw, fee, interest, and approval evidence recorded"),
        ("CONTROL", "Reconcile forecast to actual", "Treasurer", 1, "Daily variance explained and signed off"),
        ("CONTROL", "Review customer and supplier relationship risk", "Sales + Procurement", 7, "Exceptions and mitigations documented"),
        ("REVIEW", "CFO midpoint decision", "CFO", 10, "Continue, adjust, or escalate decision recorded"),
        ("REVIEW", "30-day outcome and lessons learned", "CFO + Treasury", 30, "Forecast accuracy and action effectiveness assessed"),
    ]
    action_plan = pd.DataFrame(
        tasks, columns=["phase", "task", "owner", "due_day", "evidence_required"]
    )
    scorecard = pd.DataFrame(
        [
            ("Closing cash", f">=${minimum:,.0f}", "Daily", "Treasurer", "Escalate funding decision"),
            ("Minimum cash forecast", f">=${minimum:,.0f}", "Daily", "Treasurer", "CFO review within 4 hours"),
            ("Collections receipts vs plan", ">=90%", "Daily", "Collections Lead", "Sales VP intervention"),
            ("Supplier extensions secured", f">=80% of requested", "Twice weekly", "Procurement", "CFO authority review"),
            ("Facility headroom", ">=20% of capacity", "Daily", "Treasurer", "Board notification assessment"),
            ("Forecast variance", "<=10%", "Daily", "Controller", "Root-cause analysis"),
        ],
        columns=["metric", "target", "frequency", "owner", "escalation"],
    )
    return action_plan, scorecard


def _money(value: float) -> str:
    sign = "-" if value < 0 else ""
    return f"{sign}${abs(value):,.0f}"


def render_decision_paper(
    manifest: dict[str, Any],
    decisions: dict[str, Any],
    model_card: pd.DataFrame,
    contractual_metrics: dict[str, float],
    realistic_metrics: dict[str, float],
    selected_metrics: dict[str, float],
    action_metrics: dict[str, float],
    fx_decision: pd.DataFrame,
) -> str:
    card = dict(zip(model_card["metric"], model_card["value"]))
    fx_cost = float(fx_decision["one_time_forward_cost"].sum())
    fx_reduction = float(fx_decision["loss_reduction"].sum())
    approvals = []
    draw = action_metrics["facility_draw"]
    if draw > 0:
        approvals.append(f"Authorize a {_money(draw)} committed-facility draw.")
    if float(fx_decision["incremental_hedge_usd"].sum()) > 0:
        approvals.append("Approve the proposed per-currency hedge adjustments within board policy.")
    approvals.append("Authorize the selected collections, supplier, and inventory actions with stated controls.")
    approval_text = "\n".join(f"{i}. {text}" for i, text in enumerate(approvals, start=1))
    return f"""# CFO LIQUIDITY DECISION PAPER

**Scenario:** {manifest['title']}  
**As of:** {manifest['as_of_date']}  
**Team:** {decisions['team_name']}  
**Variant:** {manifest['scenario_variants'][decisions['scenario_variant']]['label']}  
**Decision horizon:** {manifest['forecast_horizon_days']} days

## Decision requested

{approval_text}

## Liquidity evidence

| Measure | Result |
|---|---:|
| Contractual ending cash | {_money(contractual_metrics['ending_cash'])} |
| Contractual minimum cash | {_money(contractual_metrics['minimum_cash'])} |
| {decisions['forecast_view'].upper()} realistic ending cash | {_money(realistic_metrics['ending_cash'])} |
| Realistic minimum cash | {_money(realistic_metrics['minimum_cash'])} on Day {realistic_metrics['minimum_cash_day']:.0f} |
| Selected-action ending cash | {_money(selected_metrics['ending_cash'])} |
| Selected-action minimum cash | {_money(selected_metrics['minimum_cash'])} on Day {selected_metrics['minimum_cash_day']:.0f} |
| Days below minimum after actions | {selected_metrics['days_below_minimum']:.0f} |

## Selected actions and cost

- Collections strategy: **{decisions['collection_strategy']}**
- Supplier extension request: **up to {decisions['payables_extension_days']} days**
- Inventory release: **{decisions['inventory_release_pct']:.1%}**
- Facility draw: **{_money(decisions['facility_draw'])}**
- Direct 30-day action cost: **{_money(action_metrics['direct_action_cost'])}**

## Model evidence and limitation

The payment model was tested on a chronological holdout. Its MAE is
**{card['Model MAE (days)']:.1f} days**, versus **{card['Industry-median baseline MAE (days)']:.1f} days**
for the simple industry baseline. The decision uses the **{decisions['forecast_view'].upper()}** receipt view;
predictions remain estimates and must be replaced by actual receipts during daily reforecasting.

## FX decision

- Incremental hedge notional: **{_money(float(fx_decision['incremental_hedge_usd'].sum()))}**
- One-time forward-cost assumption: **{_money(fx_cost)}**
- Adverse-loss reduction: **{_money(fx_reduction)}**
- All proposed ratios within policy: **{'Yes' if bool(fx_decision['within_policy'].all()) else 'No — exception approval required'}**

## Primary risks and controls

1. Collection acceleration may underperform; reconcile receipts daily and escalate below 90% of plan.
2. Supplier extensions can damage relationships; document eligibility, consent, and revised dates.
3. Inventory release can affect service levels; require COO sign-off and monitor availability.
4. Facility use consumes liquidity headroom; track capacity, interest, fees, and approval thresholds.
5. FX results are scenario estimates, not live market quotes; Treasury must validate executable rates.

## Recommendation

Proceed only if the selected-action forecast remains above the stated minimum-liquidity threshold
under the team's assigned scenario. Otherwise increase committed funding, reduce discretionary
outflows, or return to the CFO with an explicit policy exception.
"""


def _json_safe(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: _json_safe(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_json_safe(item) for item in value]
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    if isinstance(value, pd.Timestamp):
        return value.isoformat()
    return value


def run_pipeline(
    root: str | Path,
    output_dir: str | Path,
    decisions: dict[str, Any] | None = None,
) -> dict[str, Any]:
    root_path = Path(root)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest(root_path / "config" / "scenario_manifest.json")
    participant_decisions = default_decisions(manifest) if decisions is None else decisions
    data = load_inputs(root_path / "data" / "synthetic")
    validation = validate_inputs(data, manifest)
    if validation.loc[validation["blocking"], "status"].eq("FAIL").any():
        raise ValueError("Blocking data validation failure")

    validation.to_csv(output_path / "N1_validation_report.csv", index=False)
    assumptions_register(manifest).to_csv(output_path / "N1_assumptions_register.csv", index=False)
    (output_path / "N0_team_decisions.json").write_text(
        json.dumps(participant_decisions, indent=2), encoding="utf-8"
    )

    _, model_card, feature_importance, predictions = train_collections_model(
        data, int(manifest["random_seed"])
    )
    model_card.to_csv(output_path / "N3_model_card.csv", index=False)
    feature_importance.to_csv(output_path / "N3_feature_importance.csv", index=False)
    predictions.to_csv(output_path / "N3_collection_predictions.csv", index=False)

    variant_name = participant_decisions["scenario_variant"]
    variant = manifest["scenario_variants"][variant_name]
    operating = _apply_variant_outflow(data["operating_outflows"], manifest, variant_name)
    contractual = build_cash_forecast(
        contractual_receipts(data), operating, data["supplier_payments"], manifest
    )
    contractual.to_csv(output_path / "N2_contractual_forecast.csv", index=False)

    realistic_receipts = receipt_schedule(
        predictions,
        manifest,
        participant_decisions["forecast_view"],
        int(variant["additional_receipt_delay_days"]),
    )
    realistic = build_cash_forecast(
        realistic_receipts, operating, data["supplier_payments"], manifest
    )
    realistic.to_csv(output_path / "N4_realistic_forecast.csv", index=False)
    comparison = contractual[["day", "date", "closing_cash"]].rename(
        columns={"closing_cash": "contractual_closing_cash"}
    )
    comparison["realistic_closing_cash"] = realistic["closing_cash"]
    comparison["scenario_gap"] = (
        comparison["contractual_closing_cash"] - comparison["realistic_closing_cash"]
    )
    comparison.to_csv(output_path / "N4_forecast_comparison.csv", index=False)

    scenarios, _ = evaluate_action_scenarios(
        realistic_receipts, data, manifest, variant_name
    )
    scenarios.to_csv(output_path / "N5_action_scenarios.csv", index=False)
    selected_receipts, selected_suppliers, extra_receipts, extra_outflows, action_metrics = (
        apply_liquidity_actions(realistic_receipts, data, manifest, participant_decisions)
    )
    selected = build_cash_forecast(
        selected_receipts,
        operating,
        selected_suppliers,
        manifest,
        extra_receipts=extra_receipts,
        extra_outflows=extra_outflows,
    )
    selected.to_csv(output_path / "N5_selected_action_forecast.csv", index=False)

    fx_decision = analyze_fx(
        data["fx_exposures"],
        manifest,
        participant_decisions["proposed_hedge_ratios"],
        variant_name,
    )
    fx_decision.to_csv(output_path / "N6_fx_decision.csv", index=False)
    funding = funding_summary(action_metrics, manifest)
    funding.to_csv(output_path / "N6_funding_summary.csv", index=False)

    contractual_metrics = forecast_metrics(contractual, manifest)
    realistic_metrics = forecast_metrics(realistic, manifest)
    selected_metrics = forecast_metrics(selected, manifest)
    decision_paper = render_decision_paper(
        manifest,
        participant_decisions,
        model_card,
        contractual_metrics,
        realistic_metrics,
        selected_metrics,
        action_metrics,
        fx_decision,
    )
    (output_path / "N7_cfo_decision_paper.md").write_text(decision_paper, encoding="utf-8")
    evidence = pd.DataFrame(
        [
            ("Contractual ending cash", contractual_metrics["ending_cash"], "N2_contractual_forecast.csv"),
            ("Realistic ending cash", realistic_metrics["ending_cash"], "N4_realistic_forecast.csv"),
            ("Selected ending cash", selected_metrics["ending_cash"], "N5_selected_action_forecast.csv"),
            ("Selected minimum cash", selected_metrics["minimum_cash"], "N5_selected_action_forecast.csv"),
            ("Direct action cost", action_metrics["direct_action_cost"], "N5/N6 action calculations"),
            ("FX adverse-loss reduction", float(fx_decision["loss_reduction"].sum()), "N6_fx_decision.csv"),
        ],
        columns=["measure", "value", "source"],
    )
    evidence.to_csv(output_path / "N7_decision_evidence.csv", index=False)

    action_plan, scorecard = build_action_plan(
        participant_decisions, selected_metrics, manifest
    )
    action_plan.to_csv(output_path / "N8_action_plan.csv", index=False)
    scorecard.to_csv(output_path / "N8_monitoring_scorecard.csv", index=False)

    summary = {
        "scenario_id": manifest["scenario_id"],
        "scenario_version": manifest["version"],
        "decisions": participant_decisions,
        "model": dict(zip(model_card["metric"], model_card["value"])),
        "contractual": contractual_metrics,
        "realistic": realistic_metrics,
        "selected": selected_metrics,
        "action_metrics": action_metrics,
        "fx": {
            "incremental_hedge_usd": float(fx_decision["incremental_hedge_usd"].sum()),
            "one_time_forward_cost": float(fx_decision["one_time_forward_cost"].sum()),
            "adverse_loss_reduction": float(fx_decision["loss_reduction"].sum()),
            "within_policy": bool(fx_decision["within_policy"].all()),
        },
    }
    (output_path / "pipeline_summary.json").write_text(
        json.dumps(_json_safe(summary), indent=2), encoding="utf-8"
    )
    return summary


if __name__ == "__main__":
    package_root = Path(__file__).resolve().parents[1]
    result = run_pipeline(package_root, package_root / "outputs")
    print(json.dumps(_json_safe(result), indent=2))
