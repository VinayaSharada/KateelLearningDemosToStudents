import json
import ast
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
TARGET_DIRS = [
    ROOT / "TreasuryAnalytics",
    ROOT / "DomainUseCaseDemos",
]
EXCLUDED = {
    ROOT / "ecomm001" / "analysis.ipynb",
}
MARKER = "## Step-by-Step Explanation"


def notebook_paths():
    seen = []
    for base in TARGET_DIRS:
        if not base.exists():
            continue
        for path in sorted(base.rglob("*.ipynb")):
            if path in EXCLUDED:
                continue
            seen.append(path)
    return seen


def load_notebook(path: Path):
    raw = path.read_text(encoding="utf-8")
    stripped = raw.lstrip()
    if stripped.startswith('"cells"'):
        raw = "{\n" + raw + "\n}\n"
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        normalized = re.sub(r"\bnull\b", "None", raw)
        normalized = re.sub(r"\btrue\b", "True", normalized)
        normalized = re.sub(r"\bfalse\b", "False", normalized)
        return ast.literal_eval(normalized)


def dump_notebook(path: Path, notebook: dict):
    path.write_text(json.dumps(notebook, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def get_source_text(cell: dict) -> str:
    return "".join(cell.get("source", []))


def as_source_lines(text: str):
    if not text.endswith("\n"):
        text += "\n"
    return text.splitlines(keepends=True)


def looks_like_generated_explanation(cell: dict) -> bool:
    if cell.get("cell_type") != "markdown":
        return False
    source = get_source_text(cell)
    if source.startswith(MARKER):
        return True
    return bool(cell.get("metadata", {}).get("kld_generated_explanation"))


def unique_lines(code: str, limit: int = 4):
    lines = []
    for raw in code.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line not in lines:
            lines.append(line)
        if len(lines) >= limit:
            break
    return lines


def summarize_actions(code: str):
    lower = code.lower()
    actions = []
    interpretation = []

    if "%pip install" in lower or "pip install" in lower:
        actions.append("Installs or refreshes the package dependencies needed for the notebook run.")
        interpretation.append("A successful result here means the environment is ready; failures usually point to missing internet access or package-version conflicts.")

    if "import " in code:
        actions.append("Imports the Python libraries that support data handling, modeling, or visualization in the next steps.")
        interpretation.append("Use the imported library list to explain which tools are responsible for tables, charts, and model behavior later in the notebook.")

    if any(token in lower for token in ["read_csv", "dataframe(", "pd.dataframe", "rng.choice", "fake.", "np.random", "synthetic"]):
        actions.append("Loads or generates the dataset that the rest of the analysis depends on.")
        interpretation.append("Review the rows and columns carefully because this dataset defines what the model or analysis is allowed to learn from.")

    if any(token in lower for token in ["groupby(", "pivot", "describe()", "value_counts(", "corr(", "merge(", "join("]):
        actions.append("Aggregates, profiles, or reshapes the data so important operating patterns become visible.")
        interpretation.append("Interpret the summary output as evidence about concentration, distribution, and unusual behavior before jumping to decisions.")

    if "def " in code:
        actions.append("Defines reusable logic so the notebook can repeat the same analysis consistently across scenarios.")
        interpretation.append("A function definition does not usually produce business output yet; the important question is what inputs it expects and what output it will later generate.")

    if any(token in lower for token in ["fit(", "predict(", "predict_proba", "randomforest", "logisticregression", "xgboost", "train_test_split", "classification_report", "roc_auc"]):
        actions.append("Trains or evaluates a predictive model using the prepared feature set.")
        interpretation.append("Treat the reported metrics as decision-support quality indicators, not as proof that the model is production-ready.")

    if any(token in lower for token in ["plt.", "sns.", ".plot(", "hist(", "scatter(", "bar(", "subplots(", "imshow("]):
        actions.append("Creates a chart so learners can inspect structure, trend, dispersion, or risk visually.")
        interpretation.append("The right interpretation is usually about relative shape, outliers, and direction of movement rather than memorizing exact pixel-level detail.")

    if any(token in lower for token in ["to_csv", "to_excel", "download", "savefig", "write("]):
        actions.append("Exports an artifact so the result can be shared, reviewed, or used in a later workflow step.")
        interpretation.append("Check whether the exported file captures the right level of evidence for classroom discussion or follow-up analysis.")

    if any(token in lower for token in ["print(", "display(", ".head()", ".tail()"]):
        actions.append("Shows an immediate checkpoint so students can verify that the previous transformation worked as expected.")
        interpretation.append("Use this checkpoint to confirm that the structure, sample values, and labels still make business sense.")

    if not actions:
        actions.append("Runs a focused analysis step that transforms the current notebook state into the next working result.")
        interpretation.append("Interpret the output by asking what changed from the previous step and why that matters for the decision the notebook supports.")

    return actions[:3], interpretation[:2]


def build_explanation(cell: dict):
    code = get_source_text(cell)
    actions, interpretation = summarize_actions(code)
    lines = unique_lines(code)

    bullets = []
    for idx, action in enumerate(actions, start=1):
        bullets.append(f"{idx}. {action}")

    if lines:
        bullets.append(f"{len(bullets) + 1}. Key code cues in this cell include `{lines[0][:90]}`" + (" and related statements." if len(lines) == 1 else ", which sets the direction for the rest of the cell."))
    else:
        bullets.append(f"{len(bullets) + 1}. The cell is short, so students should focus on why this step exists in the larger workflow.")

    interpretation_lines = [f"- {item}" for item in interpretation]
    interpretation_lines.append("- Ask students what business decision would change if this output moved materially up, down, or in an unexpected direction.")

    text = (
        f"{MARKER}\n\n"
        "### What this cell is doing\n"
        + "\n".join(bullets)
        + "\n\n### How to interpret the result\n"
        + "\n".join(interpretation_lines)
        + "\n"
    )
    return {
        "cell_type": "markdown",
        "metadata": {"kld_generated_explanation": True},
        "source": as_source_lines(text),
    }


def process_notebook(path: Path):
    notebook = load_notebook(path)
    cells = notebook.get("cells", [])
    new_cells = []
    changed = False
    i = 0
    while i < len(cells):
        cell = cells[i]
        new_cells.append(cell)
        if cell.get("cell_type") == "code":
            next_cell = cells[i + 1] if i + 1 < len(cells) else None
            if next_cell and looks_like_generated_explanation(next_cell):
                i += 1
                new_cells.append(build_explanation(cell))
                changed = True
            else:
                new_cells.append(build_explanation(cell))
                changed = True
        i += 1

    if changed:
        notebook["cells"] = new_cells
        dump_notebook(path, notebook)
    return changed, len(cells), len(new_cells)


def main():
    updated = 0
    skipped = []
    for path in notebook_paths():
        try:
            changed, before, after = process_notebook(path)
            if changed:
                updated += 1
                print(f"Updated {path.relative_to(ROOT)}: {before} -> {after} cells")
        except Exception as exc:
            skipped.append((path, exc))
            print(f"Skipped {path.relative_to(ROOT)}: {type(exc).__name__}: {exc}")
    print(f"Updated {updated} notebooks")
    print(f"Skipped {len(skipped)} notebooks")


if __name__ == "__main__":
    main()
