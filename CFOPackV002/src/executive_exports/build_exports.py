"""Build native CFO artifacts from a completed CFOPackV002 output directory."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import pandas as pd


HERE = Path(__file__).resolve().parent
PACKAGE_ROOT = HERE.parents[1]


def records(path: Path) -> list[dict]:
    return pd.read_csv(path).where(pd.notna, None).to_dict(orient="records")


def payload(output_dir: Path) -> dict:
    return {
        "summary": json.loads((output_dir / "pipeline_summary.json").read_text(encoding="utf-8")),
        "manifest": json.loads((PACKAGE_ROOT / "config" / "scenario_manifest.json").read_text(encoding="utf-8")),
        "contractual": records(output_dir / "N2_contractual_forecast.csv"),
        "realistic": records(output_dir / "N4_realistic_forecast.csv"),
        "selected": records(output_dir / "N5_selected_action_forecast.csv"),
        "action_scenarios": records(output_dir / "N5_action_scenarios.csv"),
        "fx": records(output_dir / "N6_fx_decision.csv"),
        "action_plan": records(output_dir / "N8_action_plan.csv"),
        "evidence": records(output_dir / "N7_decision_evidence.csv"),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--node", default=os.environ.get("CFOPACK_NODE", "node"))
    parser.add_argument("--node-modules", default=os.environ.get("CFOPACK_ARTIFACT_NODE_MODULES"))
    args = parser.parse_args()
    args.destination.mkdir(parents=True, exist_ok=True)

    scratch_root = os.environ.get("CFOPACK_EXPORT_SCRATCH")
    with tempfile.TemporaryDirectory(
        prefix="cfopackv002-exports-",
        dir=scratch_root,
    ) as directory:
        work = Path(directory)
        payload_path = work / "payload.json"
        payload_path.write_text(json.dumps(payload(args.output_dir), indent=2, default=str), encoding="utf-8")

        windows_node = str(args.node).lower().endswith(".exe")

        def node_arg(path: Path) -> str:
            if not windows_node:
                return str(path)
            return subprocess.check_output(
                ["wslpath", "-w", str(path)], text=True
            ).strip()

        subprocess.run(
            [
                os.environ.get("CFOPACK_PYTHON", "python3"),
                str(HERE / "build_decision_pdf.py"),
                str(payload_path),
                str(args.destination / "CFO_Liquidity_Decision_Paper.pdf"),
            ],
            check=True,
        )

        if not args.node_modules:
            raise RuntimeError(
                "Set CFOPACK_ARTIFACT_NODE_MODULES to the configured node_modules directory "
                "to build the Excel and PowerPoint artifacts. The PDF was created."
            )
        for script in ("build_workbook.mjs", "build_board_pack.mjs"):
            shutil.copy2(HERE / script, work / script)
        modules_link = work / "node_modules"
        modules_target = Path(args.node_modules).resolve()
        if windows_node:
            subprocess.run(
                [
                    "cmd.exe",
                    "/c",
                    "mklink",
                    "/J",
                    node_arg(modules_link),
                    node_arg(modules_target),
                ],
                check=True,
                capture_output=True,
                text=True,
            )
        else:
            modules_link.symlink_to(modules_target, target_is_directory=True)
        workbook_path = args.destination / "CFO_Liquidity_Decision_Model.xlsx"
        workbook_preview = args.destination / "CFO_Liquidity_Decision_Model_preview.png"
        workbook_result = subprocess.run(
            [
                args.node,
                node_arg(work / "build_workbook.mjs"),
                node_arg(payload_path),
                node_arg(workbook_path),
                node_arg(workbook_preview),
            ],
            check=False,
        )
        if workbook_result.returncode and not (
            workbook_path.exists() and workbook_preview.exists()
        ):
            raise subprocess.CalledProcessError(workbook_result.returncode, workbook_result.args)

        board_pack_path = args.destination / "CFO_Liquidity_Board_Pack.pptx"
        board_preview = args.destination / "board_pack_preview"
        board_result = subprocess.run(
            [
                args.node,
                node_arg(work / "build_board_pack.mjs"),
                node_arg(payload_path),
                node_arg(board_pack_path),
                node_arg(board_preview),
            ],
            check=False,
        )
        if board_result.returncode and not board_pack_path.exists():
            raise subprocess.CalledProcessError(board_result.returncode, board_result.args)
    print(args.destination)


if __name__ == "__main__":
    main()
