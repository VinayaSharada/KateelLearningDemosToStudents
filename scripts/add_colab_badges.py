import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
REPO = "VinayaSharada/KateelLearningDemosToStudents"
BRANCH = "main"

TARGETS = [
    ROOT / "TreasuryAnalytics",
    ROOT / "DomainUseCaseDemos",
]


def badge_cell(repo_path: str):
    url = f"https://colab.research.google.com/github/{REPO}/blob/{BRANCH}/{repo_path}"
    text = (
        f'<a href="{url}" target="_parent">'
        '<img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>'
        "</a>"
    )
    return {
        "cell_type": "markdown",
        "metadata": {"kld_colab_badge": True},
        "source": [text],
    }


def load_notebook(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_notebook(path: Path, notebook: dict):
    path.write_text(json.dumps(notebook, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def has_colab_badge(cell: dict) -> bool:
    if cell.get("cell_type") != "markdown":
        return False
    text = "".join(cell.get("source", []))
    return (
        cell.get("metadata", {}).get("kld_colab_badge")
        or "colab.research.google.com" in text
        or "Open In Colab" in text
        or "Run in Colab" in text
    )


def notebook_paths():
    paths = []
    for base in TARGETS:
        if base.exists():
            paths.extend(sorted(base.rglob("*.ipynb")))
    return paths


def main():
    updated = 0
    for path in notebook_paths():
        nb = load_notebook(path)
        cells = nb.get("cells", [])
        repo_path = path.relative_to(ROOT).as_posix()
        badge = badge_cell(repo_path)

        if cells and has_colab_badge(cells[0]):
            if cells[0].get("metadata", {}).get("kld_colab_badge"):
                cells[0] = badge
                nb["cells"] = cells
                save_notebook(path, nb)
                updated += 1
            continue

        cells.insert(0, badge)
        nb["cells"] = cells
        save_notebook(path, nb)
        updated += 1
        print(f"Added badge to {repo_path}")

    print(f"Updated {updated} notebooks")


if __name__ == "__main__":
    main()
