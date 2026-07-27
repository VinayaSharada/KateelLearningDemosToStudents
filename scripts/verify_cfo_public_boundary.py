"""Ensure the public CFO footprint contains discovery material only."""

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


def main() -> None:
    violations: list[str] = []
    for directory in PUBLIC_DIRS:
        for path in directory.rglob("*"):
            if not path.is_file():
                continue
            relative = path.relative_to(ROOT)
            if path.suffix.lower() in FORBIDDEN_SUFFIXES:
                violations.append(str(relative))
                continue
            if {part.lower() for part in relative.parts} & FORBIDDEN_PARTS:
                violations.append(str(relative))
    landing = (ROOT / "CFOPackV002" / "index.html").read_text(encoding="utf-8")
    if "Registration" not in landing or "mailto:" not in landing:
        violations.append("CFOPackV002/index.html: missing registration call to action")
    if violations:
        raise AssertionError(f"Public CFO delivery material found: {violations}")
    print("PASS: public CFO footprint is discovery-only")


if __name__ == "__main__":
    main()
