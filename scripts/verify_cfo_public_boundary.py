"""Ensure the public CFO footprint contains discovery plus safe runtime data."""

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIRS = [
    ROOT / "CFOPackV001",
    ROOT / "CFOPackV001_Module6_Bridge",
    ROOT / "CFOPackV002",
]
FORBIDDEN_SUFFIXES = {
    ".csv",
    ".ipynb",
    ".json",
    ".pdf",
    ".pptx",
    ".py",
    ".xlsx",
}
FORBIDDEN_PARTS = {
    "answer_key",
    "config",
    "data",
    "instructor",
    "internal",
    "notebooks",
    "reference_outputs",
    "src",
    "tests",
}
RUNTIME_ROOT = Path("CFOPackV002/runtime-data/v2.1.0")
ALLOWED_RUNTIME_FILES = {
    "README.md",
    "DATASET_MANIFEST.json",
    "customers.csv",
    "invoices.csv",
    "payments.csv",
    "operating_outflows.csv",
    "supplier_payments.csv",
    "fx_exposures.csv",
    "inventory_options.csv",
}


def main() -> None:
    violations: list[str] = []
    for directory in PUBLIC_DIRS:
        for path in directory.rglob("*"):
            if not path.is_file():
                continue
            relative = path.relative_to(ROOT)
            if relative.is_relative_to(RUNTIME_ROOT):
                nested = relative.relative_to(RUNTIME_ROOT)
                if len(nested.parts) != 1 or nested.name not in ALLOWED_RUNTIME_FILES:
                    violations.append(f"unexpected runtime-data file: {relative}")
                continue
            if path.suffix.lower() in FORBIDDEN_SUFFIXES:
                violations.append(str(relative))
                continue
            if {part.lower() for part in relative.parts} & FORBIDDEN_PARTS:
                violations.append(str(relative))
    landing = (ROOT / "CFOPackV002" / "index.html").read_text(encoding="utf-8")
    if "Registration" not in landing or "mailto:" not in landing:
        violations.append("CFOPackV002/index.html: missing registration call to action")
    runtime_files = {
        path.name for path in (ROOT / RUNTIME_ROOT).iterdir() if path.is_file()
    } if (ROOT / RUNTIME_ROOT).exists() else set()
    if runtime_files != ALLOWED_RUNTIME_FILES:
        violations.append(
            f"runtime-data allowlist mismatch: expected {sorted(ALLOWED_RUNTIME_FILES)}, "
            f"found {sorted(runtime_files)}"
        )
    if violations:
        raise AssertionError(f"Public CFO delivery material found: {violations}")
    print("PASS: public CFO footprint is discovery plus allowlisted synthetic runtime data")


if __name__ == "__main__":
    main()
