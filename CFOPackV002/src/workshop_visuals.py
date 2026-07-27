"""Presentation-ready charts for CFOPackV002 participant notebooks."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


NAVY = "#17324D"
BLUE = "#2F6B9A"
TEAL = "#178582"
GOLD = "#D89B2B"
RED = "#B6463A"
GREEN = "#3A7D5D"
GREY = "#657786"


def configure() -> None:
    plt.rcParams.update(
        {
            "figure.figsize": (11, 5.8),
            "figure.dpi": 110,
            "savefig.dpi": 180,
            "axes.titleweight": "bold",
            "axes.titlesize": 13,
            "axes.labelsize": 10,
            "font.size": 10,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "axes.grid": True,
            "grid.alpha": 0.18,
        }
    )


def _save(fig: plt.Figure, output_dir: str | Path, filename: str) -> Path:
    path = Path(output_dir) / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight", facecolor="white")
    plt.show()
    plt.close(fig)
    print(f"Chart saved: {path}")
    return path


def data_landscape(data: dict[str, pd.DataFrame], output_dir: str | Path) -> Path:
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    invoices = data["invoices"]
    customers = data["customers"]
    outstanding = invoices.query("status == 'outstanding'").merge(
        customers[["customer_id", "industry", "segment"]], on="customer_id"
    )
    amounts = outstanding.groupby("industry")["amount_usd"].sum().sort_values()
    axes[0, 0].barh(amounts.index, amounts.values / 1e6, color=TEAL)
    axes[0, 0].set_title("Outstanding AR by industry")
    axes[0, 0].set_xlabel("USD millions")
    axes[0, 1].hist(data["payments"]["days_late"], bins=24, color=BLUE, alpha=0.85)
    axes[0, 1].axvline(data["payments"]["days_late"].median(), color=GOLD, lw=2, label="Median")
    axes[0, 1].set_title("Historical payment timing")
    axes[0, 1].set_xlabel("Days late")
    axes[0, 1].legend(frameon=False)
    segment = outstanding.groupby("segment")["amount_usd"].sum().sort_values(ascending=False)
    axes[1, 0].bar(segment.index, segment.values / 1e6, color=[NAVY, BLUE, GOLD])
    axes[1, 0].set_title("Outstanding AR by customer segment")
    axes[1, 0].set_ylabel("USD millions")
    outflows = data["operating_outflows"].copy()
    axes[1, 1].plot(outflows["day"], outflows["total_operating_outflows"] / 1e6, color=RED, lw=2)
    axes[1, 1].set_title("Scheduled operating outflows")
    axes[1, 1].set_xlabel("Forecast day")
    axes[1, 1].set_ylabel("USD millions")
    fig.suptitle("Liquidity War Room — data landscape", fontsize=16, fontweight="bold", color=NAVY)
    return _save(fig, output_dir, "N1_data_landscape.png")


def data_snapshot(
    data: dict[str, pd.DataFrame], output_dir: str | Path, module_id: str
) -> Path:
    """Give every module a compact, consistent orientation to the case data."""
    invoices = data["invoices"]
    outstanding = invoices.query("status == 'outstanding'").merge(
        data["customers"][["customer_id", "segment"]], on="customer_id"
    )
    segment = outstanding.groupby("segment")["amount_usd"].sum().sort_values()
    payments = data["payments"]
    operating = data["operating_outflows"]

    fig, axes = plt.subplots(1, 3, figsize=(13, 4.2))
    axes[0].barh(segment.index, segment.values / 1e6, color=TEAL)
    axes[0].set_title("Outstanding AR")
    axes[0].set_xlabel("USD millions")
    axes[1].hist(payments["days_late"], bins=18, color=BLUE, alpha=0.85)
    axes[1].axvline(payments["days_late"].median(), color=GOLD, lw=2)
    axes[1].set_title("Historical days late")
    axes[1].set_xlabel("Days")
    axes[2].plot(
        operating["day"],
        operating["total_operating_outflows"] / 1e6,
        color=RED,
        lw=2,
    )
    axes[2].set_title("Scheduled operating outflows")
    axes[2].set_xlabel("Forecast day")
    axes[2].set_ylabel("USD millions")
    fig.suptitle(
        f"{module_id} case orientation — receivables, behaviour and outflows",
        fontsize=14,
        fontweight="bold",
        color=NAVY,
    )
    return _save(fig, output_dir, f"{module_id}_data_context.png")


def decision_posture(
    decisions: dict, manifest: dict, output_dir: str | Path
) -> Path:
    fig, axes = plt.subplots(1, 3, figsize=(13, 4.4))
    facility = manifest["credit_facility"]
    axes[0].bar(
        ["Proposed draw", "Committed capacity"],
        [decisions["facility_draw"] / 1e6, facility["committed_capacity"] / 1e6],
        color=[GOLD, NAVY],
    )
    axes[0].set_title("Funding posture")
    axes[0].set_ylabel("USD millions")
    axes[1].bar(
        ["Inventory release", "Supplier extension"],
        [decisions["inventory_release_pct"] * 100, decisions["payables_extension_days"]],
        color=[TEAL, BLUE],
    )
    axes[1].set_title("Operating levers")
    axes[1].set_ylabel("Percent / days")
    ratios = decisions["proposed_hedge_ratios"]
    axes[2].bar(ratios.keys(), [value * 100 for value in ratios.values()], color=BLUE)
    axes[2].axhspan(
        manifest["fx_policy"]["minimum_hedge_ratio"] * 100,
        manifest["fx_policy"]["maximum_hedge_ratio"] * 100,
        color=GREEN,
        alpha=0.14,
        label="Policy range",
    )
    axes[2].set_title("Proposed hedge ratios")
    axes[2].set_ylabel("Percent")
    axes[2].legend(frameon=False)
    fig.suptitle("Initial team decision posture", fontsize=15, fontweight="bold", color=NAVY)
    return _save(fig, output_dir, "N0_decision_posture.png")


def validation_chart(
    validation: pd.DataFrame, assumptions: pd.DataFrame, output_dir: str | Path
) -> Path:
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))
    status = validation["status"].value_counts().reindex(["PASS", "WARN", "FAIL"], fill_value=0)
    axes[0].bar(status.index, status.values, color=[GREEN, GOLD, RED])
    axes[0].set_title("Integrity checks by status")
    axes[0].set_ylabel("Number of checks")
    categories = assumptions["category"].value_counts().sort_values()
    axes[1].barh(categories.index, categories.values, color=BLUE)
    axes[1].set_title("Explicit assumptions by category")
    axes[1].set_xlabel("Number of assumptions")
    fig.suptitle("Decision-readiness outcome", fontsize=15, fontweight="bold", color=NAVY)
    return _save(fig, output_dir, "N1_validation_outcome.png")


def executive_summary(
    contractual: pd.DataFrame,
    realistic: pd.DataFrame,
    selected: pd.DataFrame,
    minimum_liquidity: float,
    output_dir: str | Path,
) -> Path:
    labels = ["Contractual", "Realistic", "Selected actions"]
    minimums = [frame["closing_cash"].min() / 1e6 for frame in (contractual, realistic, selected)]
    endings = [frame["closing_cash"].iloc[-1] / 1e6 for frame in (contractual, realistic, selected)]
    x = np.arange(len(labels))
    width = 0.34
    fig, ax = plt.subplots(figsize=(11, 5.5))
    ax.bar(x - width / 2, minimums, width, label="Minimum cash", color=GOLD)
    ax.bar(x + width / 2, endings, width, label="Ending cash", color=BLUE)
    ax.axhline(minimum_liquidity / 1e6, color=RED, lw=2, label="Minimum liquidity")
    ax.set_xticks(x, labels)
    ax.set_ylabel("USD millions")
    ax.set_title("CFO decision — liquidity evidence at a glance")
    ax.legend(frameon=False)
    return _save(fig, output_dir, "N7_executive_summary.png")


def forecast_chart(
    forecast: pd.DataFrame,
    minimum_liquidity: float,
    output_dir: str | Path,
    filename: str,
    title: str,
    comparison: pd.DataFrame | None = None,
) -> Path:
    fig, ax = plt.subplots()
    ax.plot(forecast["day"], forecast["closing_cash"] / 1e6, color=BLUE, lw=2.5, label="Selected view")
    if comparison is not None:
        ax.plot(comparison["day"], comparison["closing_cash"] / 1e6, color=GREY, lw=2, ls="--", label="Comparison")
    ax.axhline(minimum_liquidity / 1e6, color=RED, lw=1.8, label="Minimum liquidity")
    ax.fill_between(
        forecast["day"],
        forecast["closing_cash"] / 1e6,
        minimum_liquidity / 1e6,
        where=forecast["closing_cash"] < minimum_liquidity,
        color=RED,
        alpha=0.15,
    )
    ax.set_title(title)
    ax.set_xlabel("Forecast day")
    ax.set_ylabel("Closing cash (USD millions)")
    ax.legend(frameon=False)
    return _save(fig, output_dir, filename)


def model_chart(
    model_card: pd.DataFrame,
    importance: pd.DataFrame,
    predictions: pd.DataFrame,
    output_dir: str | Path,
) -> Path:
    fig, axes = plt.subplots(1, 3, figsize=(14, 4.8))
    metrics = dict(zip(model_card["metric"], model_card["value"]))
    axes[0].bar(
        ["Simple baseline", "Random forest"],
        [metrics["Industry-median baseline MAE (days)"], metrics["Model MAE (days)"]],
        color=[GREY, TEAL],
    )
    axes[0].set_title("Time-holdout error")
    axes[0].set_ylabel("MAE (days; lower is better)")
    view = importance.sort_values("importance")
    axes[1].barh(view["feature"], view["importance"], color=BLUE)
    axes[1].set_title("Model feature importance")
    axes[1].set_xlabel("Share of importance")
    axes[2].scatter(
        predictions["predicted_days_late"],
        predictions["prediction_spread_days"],
        s=np.clip(predictions["amount_usd"] / 5000, 8, 80),
        alpha=0.35,
        color=GOLD,
    )
    axes[2].set_title("Prediction versus uncertainty")
    axes[2].set_xlabel("Predicted days late")
    axes[2].set_ylabel("P90-P10 spread (days)")
    fig.suptitle("Collections model — value and limitations", fontsize=15, fontweight="bold", color=NAVY)
    return _save(fig, output_dir, "N3_model_review.png")


def action_scenarios(scenarios: pd.DataFrame, minimum: float, output_dir: str | Path) -> Path:
    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    colors = [RED if value < minimum else GREEN for value in scenarios["minimum_cash"]]
    axes[0].barh(scenarios["scenario"], scenarios["minimum_cash"] / 1e6, color=colors)
    axes[0].axvline(minimum / 1e6, color=NAVY, ls="--", label="Minimum liquidity")
    axes[0].set_title("Liquidity protection")
    axes[0].set_xlabel("Minimum cash (USD millions)")
    axes[0].legend(frameon=False)
    axes[1].scatter(
        scenarios["direct_action_cost"] / 1000,
        scenarios["minimum_cash"] / 1e6,
        s=90,
        color=BLUE,
    )
    for _, row in scenarios.iterrows():
        axes[1].annotate(row["scenario"], (row["direct_action_cost"] / 1000, row["minimum_cash"] / 1e6), xytext=(4, 4), textcoords="offset points", fontsize=8)
    axes[1].set_title("Direct cost versus protected liquidity")
    axes[1].set_xlabel("Direct 30-day cost (USD thousands)")
    axes[1].set_ylabel("Minimum cash (USD millions)")
    return _save(fig, output_dir, "N5_action_scenarios.png")


def fx_chart(fx: pd.DataFrame, output_dir: str | Path) -> Path:
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    x = np.arange(len(fx))
    width = 0.35
    axes[0].bar(x - width / 2, fx["adverse_loss_before"] / 1000, width, label="Before", color=RED)
    axes[0].bar(x + width / 2, fx["adverse_loss_after"] / 1000, width, label="After", color=TEAL)
    axes[0].set_xticks(x, fx["currency"])
    axes[0].set_title("Adverse FX loss by exposure")
    axes[0].set_ylabel("USD thousands")
    axes[0].legend(frameon=False)
    axes[1].bar(fx["currency"], fx["incremental_hedge_usd"] / 1e6, color=BLUE)
    axes[1].set_title("Incremental hedge notional")
    axes[1].set_ylabel("USD millions")
    return _save(fig, output_dir, "N6_fx_decision.png")


def execution_chart(action_plan: pd.DataFrame, output_dir: str | Path) -> Path:
    fig, ax = plt.subplots(figsize=(12, 6))
    phase_order = {phase: i for i, phase in enumerate(action_plan["phase"].drop_duplicates())}
    colors = {"DECIDE": NAVY, "PREPARE": BLUE, "EXECUTE": TEAL, "CONTROL": GOLD, "REVIEW": RED}
    y = np.arange(len(action_plan))
    ax.scatter(action_plan["due_day"], y, s=90, c=[colors.get(p, GREY) for p in action_plan["phase"]])
    for idx, row in action_plan.iterrows():
        ax.text(row["due_day"] + 0.4, idx, f"{row['task']} — {row['owner']}", va="center", fontsize=8.5)
    ax.set_yticks([])
    ax.set_xlim(-1, max(action_plan["due_day"]) + 4)
    ax.set_xlabel("Due day")
    ax.set_title("30-day execution commitments")
    return _save(fig, output_dir, "N8_execution_plan.png")


configure()
