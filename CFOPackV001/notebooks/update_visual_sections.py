"""Idempotently add the standard exploration and outcome sections to notebooks."""

import json
import re
from pathlib import Path


BASE = Path(__file__).resolve().parent

VISUAL_LOADER = """
# Shared workshop chart helpers (local Jupyter or fresh Colab runtime).
try:
    import cfopack_visuals as workshop_viz
except ImportError:
    from types import SimpleNamespace
    from urllib.request import urlopen
    visual_url = (
        'https://raw.githubusercontent.com/VinayaSharada/'
        'KateelLearningDemosToStudents/main/CFOPackV001/notebooks/'
        'cfopack_visuals.py'
    )
    visual_namespace = {}
    exec(compile(urlopen(visual_url).read(), visual_url, 'exec'), visual_namespace)
    workshop_viz = SimpleNamespace(**visual_namespace)
workshop_viz.configure_workshop()
""".strip()

MODULES = {
    "N0.5_Bank_Reconciliation_Assistant.ipynb": {
        "anchor": "Loaded outstanding invoices",
        "explore": "workshop_viz.explore_bank(bank_statement, outstanding, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_bank(results_df, OUTPUT_DIR)",
    },
    "N1_Import_and_Validate.ipynb": {
        "anchor": "Loading data files",
        "explore": "workshop_viz.explore_n1(invoices, payments, customers, cash_flow, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_n1(invoices, payments, quality_score, OUTPUT_DIR)",
    },
    "N2_Baseline_Forecast.ipynb": {
        "anchor": "Convert date columns",
        "explore": "workshop_viz.explore_n2(validated_data, cash_flow, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_n2(cash_forecast, OUTPUT_DIR)",
    },
    "N3_Collections_Intelligence.ipynb": {
        "anchor": "Training data:",
        "explore": "workshop_viz.explore_n3(training_data, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_n3(predictions, concentration, OUTPUT_DIR)",
    },
    "N4_Revised_Forecast.ipynb": {
        "anchor": "All data loaded and ready for analysis!",
        "explore": "workshop_viz.explore_n4(baseline_forecast, predictions, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_n4(comparison, OUTPUT_DIR)",
    },
    "N5_Working_Capital_Levers.ipynb": {
        "anchor": "All data loaded and ready for analysis!",
        "explore": "workshop_viz.explore_n5(gap_analysis, predictions, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_n5(scenarios_df, target_gap, OUTPUT_DIR)",
    },
    "N6_FX_Hedge_Decision.ipynb": {
        "anchor": "All data loaded and ready for analysis!",
        "explore": "workshop_viz.explore_n6(fx_exposure, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_n6(recommendations_df, OUTPUT_DIR)",
    },
    "N7_Decision_Framework.ipynb": {
        "anchor": "All data loaded and ready for analysis!",
        "explore": "workshop_viz.explore_n7(baseline_forecast, revised_forecast, scenarios_df, OUTPUT_DIR)",
        "outcome": "workshop_viz.outcome_n7(final_gap, all_levers_impact, residual_gap, recommended_hedge, OUTPUT_DIR)",
    },
    "N8_Operationalize.ipynb": {
        "anchor": "All data loaded and ready for analysis!",
        "explore": (
            "ensure_pipeline_outputs(5)\n"
            "exploration_scenarios = pd.read_csv(f'{OUTPUT_DIR}/N5_ccc_scenarios.csv')\n"
            "exploration_gap = pd.read_csv(f'{OUTPUT_DIR}/N4_gap_analysis.csv')\n"
            "workshop_viz.explore_n8(exploration_gap, exploration_scenarios, OUTPUT_DIR)"
        ),
        "outcome": "workshop_viz.outcome_n8(tasks_df, monitoring_df, OUTPUT_DIR)",
    },
}

BORDER = re.compile(r'^\s*print\((["\'])\[(?:=|-)?\1\s*\*\s*\d+\)\s*$')
LABELS = {
    "[[DONE] ": "",
    "[[INFO] ": "",
    "[[GOAL] ": "",
    "[[CHART] ": "",
    "[[SAVE] ": "",
    "[[LOAD] ": "",
    "[[FILES] ": "",
    "[[CHECK] ": "",
    "[[LIST] ": "",
    "[[CONFIG]  ": "",
    "[[AI] ": "",
    "[[MONEY] ": "",
    "[[WARNING]  ": "Warning: ",
    "[[OK] ": "",
    "[[ERROR] ": "Error: ",
}


def source_text(cell):
    source = cell.get("source", "")
    return "".join(source) if isinstance(source, list) else source


def code_cell(source, tag):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {"tags": [tag]},
        "outputs": [],
        "source": source.splitlines(keepends=True),
    }


def markdown_cell(source, tag):
    return {
        "cell_type": "markdown",
        "metadata": {"tags": [tag]},
        "source": source,
    }


def clean_console_output(source):
    lines = [line for line in source.splitlines() if not BORDER.match(line)]
    cleaned = "\n".join(lines)
    for old, new in LABELS.items():
        cleaned = cleaned.replace(old, new)
    # Turn legacy bracket badges into plain, copy-friendly report headings.
    cleaned = re.sub(
        r'(?m)^(\s*print\((?:"|\'))\[\[([A-Z][A-Z ]+)\]\s*',
        lambda match: f"{match.group(1)}{match.group(2).title()}: ",
        cleaned,
    )
    cleaned = re.sub(
        r'(?m)^(\s*print\((?:"|\'))\[([A-Z][A-Z ]+)\]\s*',
        lambda match: f"{match.group(1)}{match.group(2).title()}: ",
        cleaned,
    )
    cleaned = re.sub(r'(?m)^(\s*print\((?:"|\'))\[', r"\1", cleaned)
    return cleaned.rstrip() + "\n"


def enhance_notebook(path, config):
    notebook = json.loads(path.read_text(encoding="utf-8"))
    notebook["cells"] = [
        cell
        for cell in notebook["cells"]
        if not set(cell.get("metadata", {}).get("tags", []))
        & {"cfopack-data-exploration", "cfopack-outcome-visuals"}
    ]

    setup_done = False
    for cell in notebook["cells"]:
        if cell.get("cell_type") != "code":
            continue
        source = clean_console_output(source_text(cell))
        if not setup_done and "GITHUB_RAW_URL" in source:
            source = re.sub(
                r"\n*# Shared workshop chart helpers.*?workshop_viz\.configure_workshop\(\)\n?",
                "",
                source,
                flags=re.DOTALL,
            )
            source = re.sub(
                r"\n*try:\n\s+import cfopack_visuals as workshop_viz.*?"
                r"workshop_viz\.configure_workshop\(\)\n?",
                "",
                source,
                flags=re.DOTALL,
            )
            source = source.rstrip() + "\n\n" + VISUAL_LOADER + "\n"
            setup_done = True
        cell["source"] = source.splitlines(keepends=True)

    anchor_index = next(
        index
        for index, cell in enumerate(notebook["cells"])
        if cell.get("cell_type") == "code" and config["anchor"] in source_text(cell)
    )
    exploration_cells = [
        markdown_cell(
            "## Data exploration\n\nStart by understanding the scale, distribution, and business meaning of the data used in this module.\n",
            "cfopack-data-exploration",
        ),
        code_cell(config["explore"] + "\n", "cfopack-data-exploration"),
    ]
    notebook["cells"][anchor_index + 1 : anchor_index + 1] = exploration_cells

    download_index = next(
        index
        for index, cell in enumerate(notebook["cells"])
        if cell.get("cell_type") == "markdown"
        and source_text(cell).lstrip().startswith("## Download")
    )
    chart_prefix = path.name.split("_", 1)[0]
    chart_export_note = (
        "\n\n<!-- cfopack-chart-exports:start -->\n"
        "### Presentation-ready charts\n\n"
        f"- `{chart_prefix}_data_overview.png` — the opening data exploration\n"
        f"- `{chart_prefix}_results_summary.png` — the final result and workshop takeaway\n\n"
        "These high-resolution PNG files are designed to paste directly into slides, "
        "documents, emails, and reports.\n"
        "<!-- cfopack-chart-exports:end -->\n"
    )
    download_source = source_text(notebook["cells"][download_index])
    download_source = re.sub(
        r"\n*<!-- cfopack-chart-exports:start -->.*?<!-- cfopack-chart-exports:end -->\n?",
        "",
        download_source,
        flags=re.DOTALL,
    ).rstrip()
    notebook["cells"][download_index]["source"] = download_source + chart_export_note
    outcome_cells = [
        markdown_cell(
            "## Results and workshop takeaway\n\nReview the outcome visually, then copy the summary table or exported PNG into a report, email, or presentation.\n",
            "cfopack-outcome-visuals",
        ),
        code_cell(config["outcome"] + "\n", "cfopack-outcome-visuals"),
    ]
    notebook["cells"][download_index:download_index] = outcome_cells
    path.write_text(json.dumps(notebook, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def export_python(notebook_path):
    notebook = json.loads(notebook_path.read_text(encoding="utf-8"))
    parts = [
        f"# Auto-exported from {notebook_path.name}. Edit the notebook, then regenerate this file.\n"
    ]
    code_number = 0
    for cell in notebook["cells"]:
        if cell.get("cell_type") != "code":
            continue
        code_number += 1
        source = source_text(cell).rstrip()
        parts.append(f"\n# %% [code cell {code_number}]\n{source}\n")
    text = "".join(parts)
    text = "\n".join(line.rstrip() for line in text.splitlines()) + "\n"
    notebook_path.with_suffix(".py").write_text(text, encoding="utf-8")


def main():
    for filename, config in MODULES.items():
        path = BASE / filename
        enhance_notebook(path, config)
        export_python(path)
        print(f"Updated {filename}")


if __name__ == "__main__":
    main()
