"""Consistent, exportable workshop visuals for CFOPackV001 notebooks."""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

try:
    from IPython.display import Markdown, display
except ImportError:  # Companion .py files remain usable without IPython.
    class Markdown(str):
        pass

    def display(value):
        print(value)


COLORS = {
    "primary": "#0f766e",
    "secondary": "#2563eb",
    "accent": "#d97706",
    "danger": "#b91c1c",
    "muted": "#64748b",
    "light": "#cbd5e1",
}


def configure_workshop():
    """Apply a readable style that works in Colab, Jupyter, and exported PNGs."""
    try:
        plt.style.use("seaborn-v0_8-whitegrid")
    except OSError:
        plt.style.use("default")
    plt.rcParams.update(
        {
            "figure.figsize": (11, 4.8),
            "figure.dpi": 110,
            "savefig.dpi": 180,
            "axes.titlesize": 13,
            "axes.titleweight": "bold",
            "axes.labelsize": 10,
            "font.size": 10,
            "legend.frameon": False,
            "axes.spines.top": False,
            "axes.spines.right": False,
        }
    )


def show_section(title, note=None):
    text = f"## {title}"
    if note:
        text += f"\n\n{note}"
    display(Markdown(text))


def show_summary(title, rows):
    """Display a copy-friendly two-column table and return its DataFrame."""
    show_section(title)
    frame = pd.DataFrame(rows, columns=["Metric", "Value"])
    display(frame.style.hide(axis="index"))
    return frame


def _money(value):
    sign = "-" if value < 0 else ""
    value = abs(float(value))
    if value >= 1_000_000:
        return f"{sign}${value / 1_000_000:.1f}M"
    if value >= 1_000:
        return f"{sign}${value / 1_000:.0f}K"
    return f"{sign}${value:,.0f}"


def _save(fig, output_dir, filename):
    path = Path(output_dir) / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout()
    fig.savefig(path, bbox_inches="tight", facecolor="white")
    plt.show()
    print(f"Chart saved: {path}")
    return path


def _daily_amount(frame, date_col, amount_col):
    data = frame.copy()
    data[date_col] = pd.to_datetime(data[date_col])
    return data.groupby(date_col)[amount_col].sum().sort_index()


def explore_bank(bank_statement, outstanding, output_dir):
    show_section("Explore the reconciliation data", "Understand transaction scale and the invoice pool before matching.")
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].hist(bank_statement["amount_usd"], bins=12, color=COLORS["primary"], edgecolor="white")
    axes[0].set(title="Bank transaction amounts", xlabel="Amount (USD)", ylabel="Transactions")
    top = outstanding.nlargest(10, "amount_usd").sort_values("amount_usd")
    axes[1].barh(top["invoice_id"], top["amount_usd"], color=COLORS["secondary"])
    axes[1].set(title="Ten largest outstanding invoices", xlabel="Amount (USD)")
    _save(fig, output_dir, "N0.5_data_overview.png")
    show_summary(
        "Data at a glance",
        [
            ("Bank entries", f"{len(bank_statement):,}"),
            ("Bank value", _money(bank_statement["amount_usd"].sum())),
            ("Outstanding invoices", f"{len(outstanding):,}"),
            ("Outstanding AR", _money(outstanding["amount_usd"].sum())),
        ],
    )


def outcome_bank(results, output_dir):
    show_section("What the reconciliation achieved")
    counts = results["match_confidence"].value_counts().reindex(
        ["HIGH", "MEDIUM", "LOW", "NONE"], fill_value=0
    )
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].bar(counts.index, counts.values, color=[COLORS["primary"], COLORS["accent"], COLORS["muted"], COLORS["danger"]])
    axes[0].set(title="Match decisions by confidence", ylabel="Bank entries")
    review = results["requires_manual_review"].astype(bool).value_counts().reindex([False, True], fill_value=0)
    axes[1].pie(review.values, labels=["Automatable", "Manual review"], autopct="%1.0f%%", colors=[COLORS["primary"], COLORS["accent"]])
    axes[1].set_title("Automation boundary")
    _save(fig, output_dir, "N0.5_results_summary.png")
    show_summary(
        "Reconciliation outcomes",
        [
            ("Entries processed", f"{len(results):,}"),
            ("High-confidence matches", f"{counts['HIGH']:,}"),
            ("Entries needing review", f"{review[True]:,}"),
            ("Matched value", _money(results.loc[results["match_confidence"] != "NONE", "amount_usd"].sum())),
        ],
    )


def explore_n1(invoices, payments, customers, cash_flow, output_dir):
    show_section("Explore the source data", "Review portfolio composition, payment behavior, and scheduled outflows before validation.")
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    status = invoices.groupby("status")["amount_usd"].sum().sort_values(ascending=False)
    axes[0, 0].bar(status.index, status.values, color=[COLORS["primary"], COLORS["secondary"]][: len(status)])
    axes[0, 0].set(title="Invoice value by status", ylabel="USD")
    industry = customers.groupby("industry")["avg_days_late"].mean().sort_values()
    axes[0, 1].barh(industry.index, industry.values, color=COLORS["accent"])
    axes[0, 1].set(title="Average payment delay by industry", xlabel="Days late")
    axes[1, 0].hist(payments["days_late"].dropna(), bins=20, color=COLORS["secondary"], edgecolor="white")
    axes[1, 0].set(title="Historical payment-delay distribution", xlabel="Days late", ylabel="Payments")
    axes[1, 1].plot(cash_flow["day"], cash_flow["total_outflows"], marker="o", color=COLORS["danger"])
    axes[1, 1].set(title="Scheduled 30-day outflows", xlabel="Forecast day", ylabel="USD")
    _save(fig, output_dir, "N1_data_overview.png")
    show_summary(
        "Portfolio at a glance",
        [
            ("Invoices", f"{len(invoices):,}"),
            ("Total invoice value", _money(invoices["amount_usd"].sum())),
            ("Customers", f"{len(customers):,}"),
            ("Historical payments", f"{len(payments):,}"),
            ("Average days late", f"{payments['days_late'].mean():.1f}"),
        ],
    )


def outcome_n1(invoices, payments, quality_score, output_dir):
    show_section("What validation achieved")
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    status = invoices["status"].value_counts()
    axes[0].bar(status.index, status.values, color=[COLORS["primary"], COLORS["secondary"]][: len(status)])
    axes[0].set(title="Validated invoice records", ylabel="Invoices")
    checks = pd.Series(
        {
            "Quality score": quality_score,
            "Payment links": 100 * payments["invoice_id"].isin(invoices["invoice_id"]).mean(),
            "Customer links": 100,
        }
    )
    axes[1].barh(checks.index, checks.values, color=COLORS["primary"])
    axes[1].set(title="Readiness indicators", xlabel="Percent", xlim=(0, 100))
    _save(fig, output_dir, "N1_results_summary.png")
    show_summary(
        "Validated output",
        [
            ("Data-quality score", f"{quality_score}/100"),
            ("Records ready for forecasting", f"{len(invoices):,}"),
            ("Outstanding invoices", f"{(invoices['status'] == 'outstanding').sum():,}"),
            ("Outstanding AR", _money(invoices.loc[invoices["status"] == "outstanding", "amount_usd"].sum())),
        ],
    )


def explore_n2(validated, cash_flow, output_dir):
    show_section("Explore the forecast inputs", "See when contractual receipts and operating outflows are scheduled.")
    due = _daily_amount(validated, "due_date", "amount_usd")
    cash = cash_flow.copy()
    cash["date"] = pd.to_datetime(cash["date"])
    start, end = cash["date"].min(), cash["date"].max()
    due = due[(due.index >= start) & (due.index <= end)]
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].bar(due.index, due.values, color=COLORS["primary"], width=0.8)
    axes[0].set(title="Invoices due during the forecast", xlabel="Due date", ylabel="USD")
    axes[0].tick_params(axis="x", rotation=35)
    axes[1].bar(cash["date"], cash["total_outflows"], color=COLORS["danger"], width=0.8)
    axes[1].set(title="Scheduled operating outflows", xlabel="Date", ylabel="USD")
    axes[1].tick_params(axis="x", rotation=35)
    _save(fig, output_dir, "N2_data_overview.png")
    show_summary(
        "Baseline inputs",
        [
            ("Forecast days", f"{len(cash_flow)}"),
            ("Contractual receipts", _money(due.sum())),
            ("Scheduled outflows", _money(cash_flow["total_outflows"].sum())),
            ("Starting cash assumption", "$5.0M"),
        ],
    )


def outcome_n2(forecast, output_dir):
    show_section("Baseline forecast result")
    data = forecast.copy()
    data["date"] = pd.to_datetime(data["date"])
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].plot(data["date"], data["closing_cash"], color=COLORS["primary"], linewidth=2.5)
    axes[0].axhline(1_500_000, color=COLORS["accent"], linestyle="--", label="Comfort threshold")
    axes[0].set(title="Baseline closing cash", xlabel="Date", ylabel="USD")
    axes[0].tick_params(axis="x", rotation=35)
    axes[0].legend()
    axes[1].bar(data["date"], data["inflows"], label="Inflows", color=COLORS["primary"], width=0.8)
    axes[1].bar(data["date"], -data["outflows"], label="Outflows", color=COLORS["danger"], width=0.8)
    axes[1].set(title="Daily forecast movements", xlabel="Date", ylabel="USD")
    axes[1].tick_params(axis="x", rotation=35)
    axes[1].legend()
    _save(fig, output_dir, "N2_results_summary.png")
    low = data.loc[data["closing_cash"].idxmin()]
    show_summary(
        "Baseline outcome",
        [
            ("Ending cash", _money(data.iloc[-1]["closing_cash"])),
            ("Lowest cash", _money(low["closing_cash"])),
            ("Lowest-cash day", f"Day {int(low['day'])}"),
            ("Total contractual inflows", _money(data["inflows"].sum())),
        ],
    )


def explore_n3(training, output_dir):
    show_section("Explore historical payment behavior", "The model learns delay patterns from paid invoices.")
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].hist(training["actual_days_late"], bins=24, color=COLORS["secondary"], edgecolor="white")
    axes[0].set(title="Actual payment delays", xlabel="Days late", ylabel="Paid invoices")
    sample = training.groupby("customer_id").agg(avg_delay=("actual_days_late", "mean"), risk=("risk_score", "mean"), ar=("amount_usd", "sum"))
    axes[1].scatter(sample["risk"], sample["avg_delay"], s=np.sqrt(sample["ar"]) / 7, alpha=0.6, color=COLORS["primary"])
    axes[1].set(title="Customer risk and observed delay", xlabel="Risk score", ylabel="Average days late")
    _save(fig, output_dir, "N3_data_overview.png")
    show_summary(
        "Training data",
        [
            ("Paid invoices used", f"{len(training):,}"),
            ("Average actual delay", f"{training['actual_days_late'].mean():.1f} days"),
            ("Customers represented", f"{training['customer_id'].nunique():,}"),
            ("Target range", f"{training['actual_days_late'].min():.0f}–{training['actual_days_late'].max():.0f} days"),
        ],
    )


def outcome_n3(predictions, concentration, output_dir):
    show_section("What the collections model achieved")
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].hist(predictions["predicted_days_late"], bins=20, color=COLORS["primary"], edgecolor="white")
    axes[0].axvline(7, color=COLORS["danger"], linestyle="--", label="At-risk threshold")
    axes[0].set(title="Predicted payment delays", xlabel="Days late", ylabel="Outstanding invoices")
    axes[0].legend()
    top = concentration.head(10).sort_values("amount_usd")
    axes[1].barh([f"Customer {int(x)}" for x in top.index], top["amount_usd"], color=COLORS["secondary"])
    axes[1].set(title="Largest predicted AR exposures", xlabel="USD")
    _save(fig, output_dir, "N3_results_summary.png")
    at_risk = predictions[predictions["predicted_days_late"] > 7]
    show_summary(
        "Prediction outcomes",
        [
            ("Outstanding invoices scored", f"{len(predictions):,}"),
            ("Average predicted delay", f"{predictions['predicted_days_late'].mean():.1f} days"),
            ("Invoices over 7 days late", f"{len(at_risk):,}"),
            ("At-risk AR", _money(at_risk["amount_usd"].sum())),
        ],
    )


def explore_n4(baseline, predictions, output_dir):
    show_section("Explore the forecast adjustment", "Compare the optimistic path with the delay assumptions that will move receipts.")
    base = baseline.copy()
    base["date"] = pd.to_datetime(base["date"])
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].plot(base["date"], base["closing_cash"], color=COLORS["secondary"], linewidth=2.5)
    axes[0].set(title="Optimistic baseline path", xlabel="Date", ylabel="Closing cash (USD)")
    axes[0].tick_params(axis="x", rotation=35)
    axes[1].hist(predictions["predicted_days_late"], bins=20, color=COLORS["accent"], edgecolor="white")
    axes[1].set(title="Predicted delays applied in N4", xlabel="Days late", ylabel="Invoices")
    _save(fig, output_dir, "N4_data_overview.png")
    show_summary(
        "Adjustment inputs",
        [
            ("Forecast days", f"{len(base)}"),
            ("Invoices rescheduled", f"{len(predictions):,}"),
            ("Average predicted delay", f"{predictions['predicted_days_late'].mean():.1f} days"),
            ("Baseline ending cash", _money(base.iloc[-1]["closing_cash"])),
        ],
    )


def outcome_n4(comparison, output_dir):
    show_section("Realistic forecast result")
    data = comparison.copy()
    data["date"] = pd.to_datetime(data["date"])
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].plot(data["date"], data["baseline_closing_cash"], label="Baseline", color=COLORS["secondary"], linewidth=2.3)
    axes[0].plot(data["date"], data["revised_closing_cash"], label="Revised", color=COLORS["danger"], linewidth=2.3)
    axes[0].axhline(0, color=COLORS["muted"], linewidth=1)
    axes[0].set(title="Baseline versus realistic cash", xlabel="Date", ylabel="Closing cash (USD)")
    axes[0].tick_params(axis="x", rotation=35)
    axes[0].legend()
    axes[1].fill_between(data["date"], data["gap"], color=COLORS["accent"], alpha=0.7)
    axes[1].set(title="Liquidity gap created by delays", xlabel="Date", ylabel="Gap (USD)")
    axes[1].tick_params(axis="x", rotation=35)
    _save(fig, output_dir, "N4_results_summary.png")
    low = data.loc[data["revised_closing_cash"].idxmin()]
    show_summary(
        "Revised forecast outcome",
        [
            ("Final scenario gap", _money(data.iloc[-1]["gap"])),
            ("Revised ending cash", _money(data.iloc[-1]["revised_closing_cash"])),
            ("Lowest revised cash", _money(low["revised_closing_cash"])),
            ("Lowest-cash day", f"Day {int(low['day'])}"),
        ],
    )


def explore_n5(gap_analysis, predictions, output_dir):
    show_section("Explore the working-capital challenge", "Size the liquidity gap and the receivables exposed to payment delays.")
    gap = gap_analysis.copy()
    gap["date"] = pd.to_datetime(gap["date"])
    bands = pd.cut(predictions["predicted_days_late"], [-np.inf, 7, 30, 60, np.inf], labels=["≤7 days", "8–30", "31–60", ">60"])
    exposure = predictions.groupby(bands, observed=False)["amount_usd"].sum()
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].plot(gap["date"], gap["gap"], color=COLORS["danger"], linewidth=2.5)
    axes[0].set(title="Liquidity gap to address", xlabel="Date", ylabel="USD")
    axes[0].tick_params(axis="x", rotation=35)
    axes[1].bar(exposure.index.astype(str), exposure.values, color=COLORS["accent"])
    axes[1].set(title="Outstanding AR by predicted delay", xlabel="Delay band", ylabel="USD")
    _save(fig, output_dir, "N5_data_overview.png")
    show_summary(
        "Capital challenge",
        [
            ("End-of-horizon gap", _money(gap.iloc[-1]["gap"])),
            ("Outstanding AR", _money(predictions["amount_usd"].sum())),
            ("Average predicted delay", f"{predictions['predicted_days_late'].mean():.1f} days"),
        ],
    )


def outcome_n5(scenarios, target_gap, output_dir):
    show_section("Working-capital scenario results")
    data = scenarios.dropna(subset=["cash_impact"]).copy().sort_values("cash_impact")
    data["gap_coverage"] = 100 * data["cash_impact"] / target_gap if target_gap else 100
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))
    axes[0].barh(data["scenario"], data["cash_impact"], color=COLORS["primary"])
    axes[0].set(title="Estimated cash impact", xlabel="USD")
    axes[1].barh(data["scenario"], data["gap_coverage"], color=COLORS["accent"])
    axes[1].axvline(100, color=COLORS["danger"], linestyle="--", label="Gap fully closed")
    axes[1].set(title="Share of gap closed", xlabel="Percent")
    axes[1].legend()
    _save(fig, output_dir, "N5_results_summary.png")
    best = data.loc[data["cash_impact"].idxmax()]
    show_summary(
        "Scenario outcomes",
        [
            ("Target gap", _money(target_gap)),
            ("Largest modeled impact", _money(best["cash_impact"])),
            ("Largest gap coverage", f"{best['gap_coverage']:.1f}%"),
            ("Highest-impact scenario", best["scenario"]),
        ],
    )


def explore_n6(fx_exposure, output_dir):
    show_section("Explore FX exposure", "See notional concentration and the portion already hedged before choosing a target ratio.")
    data = fx_exposure.copy()
    data["hedged"] = data["notional_amount"] * data["current_hedge_ratio"]
    data["unhedged"] = data["notional_amount"] - data["hedged"]
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].bar(data["currency"], data["notional_amount"], color=COLORS["secondary"])
    axes[0].set(title="Notional exposure by currency", ylabel="USD")
    axes[1].bar(data["currency"], data["hedged"], label="Hedged", color=COLORS["primary"])
    axes[1].bar(data["currency"], data["unhedged"], bottom=data["hedged"], label="Unhedged", color=COLORS["accent"])
    axes[1].set(title="Current hedge coverage", ylabel="USD")
    axes[1].legend()
    _save(fig, output_dir, "N6_data_overview.png")
    show_summary(
        "FX position",
        [
            ("Currencies", f"{len(data)}"),
            ("Total notional", _money(data["notional_amount"].sum())),
            ("Currently hedged", _money(data["hedged"].sum())),
            ("Currently unhedged", _money(data["unhedged"].sum())),
        ],
    )


def outcome_n6(recommendations, output_dir):
    show_section("Hedge scenario results")
    data = recommendations.copy()
    labels = (100 * data["hedge_ratio"]).round().astype(int).astype(str) + "%"
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].bar(labels, data["hedge_amount"], label="Hedged", color=COLORS["primary"])
    axes[0].bar(labels, data["unhedged_exposure"], bottom=data["hedge_amount"], label="Unhedged", color=COLORS["accent"])
    axes[0].set(title="Risk coverage by hedge ratio", xlabel="Hedge ratio", ylabel="USD")
    axes[0].legend()
    axes[1].plot(labels, data["annual_cost"], marker="o", color=COLORS["danger"], linewidth=2.3)
    axes[1].set(title="Estimated annual hedge cost", xlabel="Hedge ratio", ylabel="USD")
    _save(fig, output_dir, "N6_results_summary.png")
    rec = data.iloc[(data["hedge_ratio"] - 0.65).abs().argsort()[:1]].iloc[0]
    show_summary(
        "Recommended hedge",
        [
            ("Target ratio", f"{rec['hedge_ratio']:.0%}"),
            ("Hedge amount", _money(rec["hedge_amount"])),
            ("Unhedged exposure", _money(rec["unhedged_exposure"])),
            ("Estimated annual cost", _money(rec["annual_cost"])),
        ],
    )


def explore_n7(baseline, revised, scenarios, output_dir):
    show_section("Explore the evidence for the CFO decision", "Bring the forecast and mitigation options together before writing the memo.")
    base, rev = baseline.copy(), revised.copy()
    base["date"], rev["date"] = pd.to_datetime(base["date"]), pd.to_datetime(rev["date"])
    levers = scenarios.dropna(subset=["cash_impact"]).sort_values("cash_impact")
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))
    axes[0].plot(base["date"], base["closing_cash"], label="Baseline", color=COLORS["secondary"], linewidth=2.3)
    axes[0].plot(rev["date"], rev["closing_cash"], label="Revised", color=COLORS["danger"], linewidth=2.3)
    axes[0].set(title="Forecast evidence", xlabel="Date", ylabel="Closing cash (USD)")
    axes[0].tick_params(axis="x", rotation=35)
    axes[0].legend()
    axes[1].barh(levers["scenario"], levers["cash_impact"], color=COLORS["primary"])
    axes[1].set(title="Available operational levers", xlabel="Estimated cash impact (USD)")
    _save(fig, output_dir, "N7_data_overview.png")


def outcome_n7(final_gap, all_levers_impact, residual_gap, recommended_hedge, output_dir):
    show_section("Decision package achieved")
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
    axes[0].bar(["Forecast gap"], [final_gap], color=COLORS["danger"])
    axes[0].bar(["Operational levers"], [all_levers_impact], color=COLORS["primary"])
    axes[0].bar(["Residual funding"], [residual_gap], color=COLORS["accent"])
    axes[0].set(title="Liquidity decision bridge", ylabel="USD")
    axes[1].bar(["Hedged", "Unhedged"], [recommended_hedge["hedge_amount"], recommended_hedge["unhedged_exposure"]], color=[COLORS["primary"], COLORS["accent"]])
    axes[1].set(title=f"Recommended {recommended_hedge['hedge_ratio']:.0%} FX coverage", ylabel="USD")
    _save(fig, output_dir, "N7_results_summary.png")
    show_summary(
        "CFO decision summary",
        [
            ("Forecast gap", _money(final_gap)),
            ("All-levers impact", _money(all_levers_impact)),
            ("Residual funding need", _money(residual_gap)),
            ("Recommended FX hedge", f"{recommended_hedge['hedge_ratio']:.0%}"),
        ],
    )


def explore_n8(gap_analysis, scenarios, output_dir):
    show_section("Explore the implementation context", "Translate the forecast gap and approved levers into owned work.")
    gap = gap_analysis.copy()
    levers = scenarios.dropna(subset=["cash_impact"]).sort_values("cash_impact")
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))
    axes[0].plot(gap["day"], gap["gap"], color=COLORS["danger"], linewidth=2.5)
    axes[0].set(title="Gap requiring action", xlabel="Forecast day", ylabel="USD")
    axes[1].barh(levers["scenario"], levers["cash_impact"], color=COLORS["primary"])
    axes[1].set(title="Lever impact to operationalize", xlabel="USD")
    _save(fig, output_dir, "N8_data_overview.png")


def outcome_n8(tasks, monitoring, output_dir):
    show_section("Implementation plan achieved")
    phase_order = tasks.sort_values("phase_order")["phase"].drop_duplicates().tolist()
    phase_counts = tasks["phase"].value_counts().reindex(phase_order)
    owners = tasks["owner"].value_counts().head(8).sort_values()
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.8))
    axes[0].bar(phase_counts.index, phase_counts.values, color=COLORS["primary"])
    axes[0].set(title="Tasks by implementation phase", ylabel="Tasks")
    axes[0].tick_params(axis="x", rotation=20)
    axes[1].barh(owners.index, owners.values, color=COLORS["secondary"])
    axes[1].set(title="Ownership coverage", xlabel="Assigned tasks")
    _save(fig, output_dir, "N8_results_summary.png")
    show_summary(
        "Operational deliverables",
        [
            ("Implementation tasks", f"{len(tasks)}"),
            ("Phases", f"{tasks['phase'].nunique()}"),
            ("Named owners", f"{tasks['owner'].nunique()}"),
            ("Monitoring metrics", f"{len(monitoring)}"),
        ],
    )

