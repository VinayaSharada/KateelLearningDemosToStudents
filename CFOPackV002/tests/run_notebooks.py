"""Execute every CFOPackV002 participant notebook in a clean copied package."""

from __future__ import annotations

import contextlib
import io
import json
import os
import shutil
import sys
import tempfile
import traceback
from pathlib import Path


SOURCE = Path(__file__).resolve().parents[1]
ORDER = [
    "N0_War_Room_Brief.ipynb",
    "N1_Data_Integrity.ipynb",
    "N2_Contractual_Forecast.ipynb",
    "N3_Collections_Risk.ipynb",
    "N4_Realistic_Forecast.ipynb",
    "N5_Liquidity_Actions.ipynb",
    "N6_FX_and_Funding.ipynb",
    "N7_CFO_Decision.ipynb",
    "N8_Execute_and_Monitor.ipynb",
]


def execute(path: Path) -> None:
    notebook = json.loads(path.read_text(encoding="utf-8"))
    namespace = {"__name__": "__main__"}
    capture = io.StringIO()
    with contextlib.redirect_stdout(capture), contextlib.redirect_stderr(capture):
        for cell_number, cell in enumerate(notebook["cells"], start=1):
            if cell.get("cell_type") != "code":
                continue
            source = cell.get("source", "")
            if isinstance(source, list):
                source = "".join(source)
            try:
                exec(compile(source, f"{path.name}:cell-{cell_number}", "exec"), namespace)
            except Exception:
                print(capture.getvalue()[-5000:])
                print(f"FAIL: {path.name}, cell {cell_number}")
                traceback.print_exc()
                raise


def main() -> None:
    os.environ.setdefault("MPLBACKEND", "Agg")

    # First prove that every module can recover from a fresh runtime without
    # relying on state produced by N0 or an earlier notebook.
    for name in ORDER:
        with tempfile.TemporaryDirectory(prefix="cfopackv002-independent-") as directory:
            root = Path(directory) / "CFOPackV002"
            shutil.copytree(
                SOURCE,
                root,
                ignore=shutil.ignore_patterns("outputs", "__pycache__", "*.pyc"),
            )
            old_cwd = Path.cwd()
            os.chdir(root / "notebooks")
            try:
                execute(root / "notebooks" / name)
            finally:
                os.chdir(old_cwd)
        print(f"PASS independent: {name}")

    # Then prove that the intended workshop journey works end to end and that
    # the promised handoff artifacts are actually produced.
    with tempfile.TemporaryDirectory(prefix="cfopackv002-notebooks-") as directory:
        root = Path(directory) / "CFOPackV002"
        shutil.copytree(SOURCE, root, ignore=shutil.ignore_patterns("outputs", "__pycache__", "*.pyc"))
        old_cwd = Path.cwd()
        os.chdir(root / "notebooks")
        try:
            for name in ORDER:
                execute(root / "notebooks" / name)
                print(f"PASS: {name}")
        finally:
            os.chdir(old_cwd)

        expected = [
            "N0_team_decision_charter.md",
            "N0_data_context.png",
            "N0_decision_posture.png",
            "N1_validation_report.csv",
            "N1_data_landscape.png",
            "N1_validation_outcome.png",
            "N2_contractual_forecast.csv",
            "N2_contractual_forecast.png",
            "N3_model_card.csv",
            "N3_model_review.png",
            "N4_realistic_forecast.csv",
            "N4_realistic_vs_contractual.png",
            "N5_action_scenarios.csv",
            "N5_action_scenarios.png",
            "N5_selected_action_forecast.png",
            "N6_fx_decision.csv",
            "N6_fx_decision.png",
            "N7_cfo_decision_paper.md",
            "N7_executive_summary.png",
            "N8_action_plan.csv",
            "N8_execution_plan.png",
        ]
        missing = [name for name in expected if not (root / "outputs" / name).exists()]
        if missing:
            raise AssertionError(f"Missing notebook outputs: {missing}")
    print("PASS: sequential clean-package notebook execution")


if __name__ == "__main__":
    main()
