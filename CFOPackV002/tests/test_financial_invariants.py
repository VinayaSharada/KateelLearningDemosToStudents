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
        assert summary["action_metrics"]["facility_draw"] <= manifest["credit_facility"]["committed_capacity"]
        assert summary["selected"]["ending_cash"] != summary["realistic"]["ending_cash"]
        validation = pd.read_csv(output / "N1_validation_report.csv")
        assert validation.query("blocking == True and status == 'FAIL'").empty
        evidence = pd.read_csv(output / "N7_decision_evidence.csv")
        assert set(evidence["source"]).issuperset(
            {"N2_contractual_forecast.csv", "N4_realistic_forecast.csv", "N5_selected_action_forecast.csv"}
        )
        return json.loads((output / "pipeline_summary.json").read_text(encoding="utf-8"))


def main() -> None:
    results = {variant: run_variant(variant) for variant in ("base", "customer_shock", "supplier_shock", "fx_shock")}
    assert results["customer_shock"]["realistic"]["ending_cash"] <= results["base"]["realistic"]["ending_cash"]
    assert results["supplier_shock"]["realistic"]["ending_cash"] < results["base"]["realistic"]["ending_cash"]
    assert results["fx_shock"]["fx"]["adverse_loss_reduction"] > results["base"]["fx"]["adverse_loss_reduction"]
    print("PASS: all CFOPackV002 financial and scenario invariants")


if __name__ == "__main__":
    main()
