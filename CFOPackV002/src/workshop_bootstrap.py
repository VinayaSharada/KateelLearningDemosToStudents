"""Local/Colab bootstrap for CFOPackV002 participant notebooks."""

from __future__ import annotations

import sys
from pathlib import Path
from urllib.request import urlopen


REPOSITORY = "VinayaSharada/KateelLearningDemosToStudents"
# Pin workshop assets so a delivered session cannot silently change underneath it.
RELEASE_REF = "cfopack-v002-v2.0.0-alpha.1"
PACKAGE_PATH = "CFOPackV002"

PUBLIC_ASSETS = [
    "config/scenario_manifest.json",
    "data/synthetic/customers.csv",
    "data/synthetic/invoices.csv",
    "data/synthetic/payments.csv",
    "data/synthetic/operating_outflows.csv",
    "data/synthetic/supplier_payments.csv",
    "data/synthetic/fx_exposures.csv",
    "data/synthetic/inventory_options.csv",
    "src/cfopack_v002.py",
    "src/workshop_visuals.py",
]


def _local_root() -> Path | None:
    start = Path.cwd().resolve()
    candidates = [start, *start.parents]
    for candidate in candidates:
        if (candidate / "config" / "scenario_manifest.json").exists() and candidate.name == "CFOPackV002":
            return candidate
        nested = candidate / "CFOPackV002"
        if (nested / "config" / "scenario_manifest.json").exists():
            return nested
    return None


def _download_assets(target: Path) -> None:
    base = f"https://raw.githubusercontent.com/{REPOSITORY}/{RELEASE_REF}/{PACKAGE_PATH}"
    for relative in PUBLIC_ASSETS:
        destination = target / relative
        if destination.exists():
            continue
        destination.parent.mkdir(parents=True, exist_ok=True)
        url = f"{base}/{relative}"
        destination.write_bytes(urlopen(url, timeout=30).read())


def bootstrap() -> tuple[Path, Path]:
    root = _local_root()
    if root is None:
        root = Path("/content/CFOPackV002")
        _download_assets(root)
    source = root / "src"
    if str(source) not in sys.path:
        sys.path.insert(0, str(source))
    output = Path("/content/outputs") if "google.colab" in sys.modules else root / "outputs"
    output.mkdir(parents=True, exist_ok=True)
    return root, output
