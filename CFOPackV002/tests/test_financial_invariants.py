"""Financial and scenario invariants for the public CFOPackV002 engine."""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from cfopack_v002 import default_decisions, load_manifest, run_pipeline  # noqa: E402


def assert_forecast_reconciles(path: Path, opening_cash: float) -> None:
    frame = pd.read_csv(path)
    expected = opening_cash + frame["net_cash_flow"].cumsum()
    if not np.allclose(frame["closing_cash"], expected, atol=0.01):
        raise AssertionError(f"Forecast does not reconcile: {path.name}")
    if not np.allclose(frame["opening_cash"].iloc[1:], frame["closing_cash"].iloc[:-1], atol=0.01):
        raise AssertionError(f"Opening/closing roll-forward fails: {path.name}")


def run_variant(variant: str) -> dict:
    manifest = load_manifest(ROOT / "config" / "scenario_manifest.json")
    decisions = default_decisions(manifest)
    decisions["scenario_variant"] = variant
    decisions["shock_revealed"] = variant != "base"
    with tempfile.TemporaryDirectory(prefix=f"cfopackv002-{variant}-") as directory:
        output = Path(directory)
        summary = run_pipeline(ROOT, output, decisions)
        for filename in (
            "N2_contractual_forecast.csv",
            "N4_realistic_forecast.csv",
            "N5_selected_action_forecast.csv",
        ):
            assert_forecast_reconciles(output / filename, float(manifest["opening_cash"]))

        model = summary["model"]
        assert model["Model MAE (days)"] < model["Industry-median baseline MAE (days)"]
        assert model["MAE improvement vs baseline"] > 0.05
        assert summary["fx"]["within_policy"] is True
        assert summary["fx"]["within_cfo_authority"] is True
        assert summary["action_metrics"]["facility_draw"] <= manifest["credit_facility"]["committed_capacity"]
        assert summary["selected"]["ending_cash"] != summary["realistic"]["ending_cash"]
        validation = pd.read_csv(output / "N1_validation_report.csv")
        assert validation.query("blocking == True and status == 'FAIL'").empty
        evidence = pd.read_csv(output / "N7_decision_evidence.csv")
        assert set(evidence["source"]).issuperset(
            {"N2_contractual_forecast.csv", "N4_realistic_forecast.csv", "N5_selected_action_forecast.csv"}
        )
        fx = pd.read_csv(output / "N6_fx_decision.csv")
        assert (fx.loc[fx["direction"].eq("receivable"), "signed_spot_move_pct"] < 0).all()
        assert (fx.loc[fx["direction"].eq("payable"), "signed_spot_move_pct"] > 0).all()
        stress = pd.read_csv(output / "N5_execution_stress.csv").set_index("execution_case")
        assert stress.loc["expected", "minimum_cash"] >= stress.loc["downside", "minimum_cash"]
        assert stress.loc["downside", "minimum_cash"] >= stress.loc["failed", "minimum_cash"]
        ledger = pd.read_csv(output / "decision_ledger.csv")
        assert {"data_approval", "model_use", "execution_case"}.issubset(set(ledger["decision"]))
        return json.loads((output / "pipeline_summary.json").read_text(encoding="utf-8"))


def main() -> None:
    results = {variant: run_variant(variant) for variant in ("base", "customer_shock", "supplier_shock", "fx_shock")}
    assert results["customer_shock"]["realistic"]["ending_cash"] <= results["base"]["realistic"]["ending_cash"]
    assert results["supplier_shock"]["realistic"]["ending_cash"] < results["base"]["realistic"]["ending_cash"]
    assert results["fx_shock"]["fx"]["adverse_loss_reduction"] > results["base"]["fx"]["adverse_loss_reduction"]

    manifest = load_manifest(ROOT / "config" / "scenario_manifest.json")
    invalid = default_decisions(manifest)
    invalid["payables_extension_days"] = 99
    try:
        with tempfile.TemporaryDirectory(prefix="cfopackv002-invalid-") as directory:
            run_pipeline(ROOT, Path(directory), invalid)
    except ValueError as error:
        assert "payables_extension_days" in str(error)
    else:
        raise AssertionError("Invalid participant decision was not rejected")

    authority = default_decisions(manifest)
    authority["proposed_hedge_ratios"] = {currency: 0.80 for currency in authority["proposed_hedge_ratios"]}
    with tempfile.TemporaryDirectory(prefix="cfopackv002-authority-") as directory:
        authority_summary = run_pipeline(ROOT, Path(directory), authority)
    assert authority_summary["fx"]["within_cfo_authority"] is False
    print("PASS: all CFOPackV002 financial and scenario invariants")


if __name__ == "__main__":
    main()
