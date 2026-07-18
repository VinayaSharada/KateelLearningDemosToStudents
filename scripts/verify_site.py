#!/usr/bin/env python3
"""Verify the static GitHub Pages site before it is deployed.

The checker intentionally uses only the Python standard library plus Node.js so
it can run both locally and in GitHub Actions without installing dependencies.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIRS = (
    ROOT / "TechUseCaseDemos",
    ROOT / "DomainUseCaseDemos",
    ROOT / "CyberSecurityDemos",
    ROOT / "TreasuryAnalytics",
    ROOT / "🤖 Browser-AI-Demos",
    ROOT / "courses",
    ROOT / "course-packs",
    ROOT / "browse",
    ROOT / "Assignments",
    ROOT / "assets",
)
TOP_LEVEL_HTML = (ROOT / "index.html", ROOT / "DEMO_INDEX.html")
URL_ATTRIBUTES = {
    "a": ("href",),
    "audio": ("src",),
    "iframe": ("src",),
    "img": ("src",),
    "link": ("href",),
    "script": ("src",),
    "source": ("src", "srcset"),
    "video": ("poster", "src"),
}
CSS_URL_RE = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)


@dataclass(frozen=True)
class Problem:
    path: Path
    line: int
    message: str

    def render(self) -> str:
        relative = self.path.relative_to(ROOT)
        return f"{relative}:{self.line}: {self.message}"


class SiteHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.references: list[tuple[int, str]] = []
        self.ids: list[tuple[int, str]] = []
        self.inline_scripts: list[tuple[int, str, bool]] = []
        self._script_line = 0
        self._script_chunks: list[str] | None = None
        self._script_is_module = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {name.lower(): value for name, value in attrs if value is not None}
        line = self.getpos()[0]

        element_id = values.get("id")
        if element_id:
            self.ids.append((line, element_id))

        for attribute in URL_ATTRIBUTES.get(tag.lower(), ()):
            raw = values.get(attribute)
            if not raw:
                continue
            if attribute == "srcset":
                for candidate in raw.split(","):
                    url = candidate.strip().split()[0] if candidate.strip() else ""
                    if url:
                        self.references.append((line, url))
            else:
                self.references.append((line, raw.strip()))

        if tag.lower() != "script" or values.get("src"):
            return
        script_type = values.get("type", "").lower()
        if script_type in {"application/ld+json", "application/json", "importmap"}:
            return
        self._script_line = line
        self._script_chunks = []
        self._script_is_module = script_type == "module"

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() != "script" or self._script_chunks is None:
            return
        code = "".join(self._script_chunks).strip()
        if code:
            self.inline_scripts.append((self._script_line, code, self._script_is_module))
        self._script_chunks = None

    def handle_data(self, data: str) -> None:
        if self._script_chunks is not None:
            self._script_chunks.append(data)


def site_files(suffix: str) -> list[Path]:
    files: set[Path] = set()
    for directory in PUBLIC_DIRS:
        if directory.exists():
            files.update(directory.rglob(f"*{suffix}"))
    if suffix == ".html":
        files.update(path for path in TOP_LEVEL_HTML if path.exists())
    return sorted(path for path in files if path.is_file())


def local_target(source: Path, raw_url: str) -> Path | None:
    url = raw_url.strip()
    if not url or url.startswith(("#", "//")):
        return None
    parsed = urlsplit(url)
    if parsed.scheme.lower() in {"data", "http", "https", "javascript", "mailto", "tel"}:
        return None
    if parsed.scheme:
        return None

    path_value = unquote(parsed.path)
    if not path_value:
        return None
    if path_value.startswith("/"):
        target = ROOT / path_value.lstrip("/")
    else:
        target = source.parent / path_value
    return target.resolve()


def target_exists(target: Path) -> bool:
    if target.is_file():
        return True
    return target.is_dir() and (target / "index.html").is_file()


def check_reference(source: Path, line: int, raw_url: str) -> Problem | None:
    target = local_target(source, raw_url)
    if target is None:
        return None
    try:
        target.relative_to(ROOT)
    except ValueError:
        return Problem(source, line, f"local URL escapes the repository: {raw_url}")
    if target_exists(target):
        return None
    return Problem(source, line, f"missing local target: {raw_url}")


def check_javascript(node: str, source: Path, code: str | None = None, line: int = 1, module: bool = False) -> Problem | None:
    temporary: Path | None = None
    check_path = source
    try:
        if code is not None:
            suffix = ".mjs" if module else ".js"
            with tempfile.NamedTemporaryFile("w", suffix=suffix, encoding="utf-8", delete=False) as handle:
                handle.write(code)
                temporary = Path(handle.name)
            check_path = temporary
        result = subprocess.run(
            [node, "--check", str(check_path)],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)

    if result.returncode == 0:
        return None
    details = result.stderr.strip().splitlines()
    summary = next(
        (item.strip() for item in details if item.strip().startswith("SyntaxError:")),
        "invalid JavaScript",
    )
    location = re.search(r":(\d+)\n", result.stderr)
    reported_line = line
    if location:
        node_line = int(location.group(1))
        reported_line = line + node_line - 1 if code is not None else node_line
    return Problem(source, reported_line, summary)


def check_html(node: str, path: Path) -> list[Problem]:
    problems: list[Problem] = []
    parser = SiteHTMLParser()
    try:
        parser.feed(path.read_text(encoding="utf-8"))
        parser.close()
    except (OSError, UnicodeError) as error:
        return [Problem(path, 1, f"could not read HTML: {error}")]

    for line, raw_url in parser.references:
        problem = check_reference(path, line, raw_url)
        if problem:
            problems.append(problem)

    id_counts = Counter(element_id for _, element_id in parser.ids)
    for element_id, count in sorted(id_counts.items()):
        if count > 1:
            first_line = next(line for line, value in parser.ids if value == element_id)
            problems.append(Problem(path, first_line, f'duplicate id "{element_id}" appears {count} times'))

    for line, code, module in parser.inline_scripts:
        problem = check_javascript(node, path, code=code, line=line, module=module)
        if problem:
            problems.append(problem)
    return problems


def check_css(path: Path) -> list[Problem]:
    problems: list[Problem] = []
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        return [Problem(path, 1, f"could not read CSS: {error}")]
    for match in CSS_URL_RE.finditer(text):
        raw_url = match.group(2).strip()
        line = text.count("\n", 0, match.start()) + 1
        problem = check_reference(path, line, raw_url)
        if problem:
            problems.append(problem)
    return problems


def check_catalog() -> list[Problem]:
    path = ROOT / "data" / "site-catalog.json"
    try:
        catalog = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as error:
        return [Problem(path, 1, f"invalid catalog: {error}")]

    problems: list[Problem] = []
    demos = catalog.get("demos", [])
    expected = catalog.get("counts", {}).get("curatedDemos")
    if expected != len(demos):
        problems.append(Problem(path, 1, f"curated demo count says {expected}, but catalog contains {len(demos)}"))

    count_markers = (
        (ROOT / "index.html", re.compile(r"data-kld-curated-demos>(\d+)<"), "curated demo", expected),
        (ROOT / "browse" / "index.html", re.compile(r"data-kld-browse-demo-count>(\d+)<"), "curated demo", expected),
        (ROOT / "README.md", re.compile(r"Curated%20Demos-(\d+)-"), "curated demo", expected),
        (
            ROOT / "index.html",
            re.compile(r"data-kld-run-modes>(\d+)<"),
            "run-mode family",
            catalog.get("counts", {}).get("runModes"),
        ),
    )
    for marker_path, pattern, label, expected_count in count_markers:
        marker_text = marker_path.read_text(encoding="utf-8")
        matches = list(pattern.finditer(marker_text))
        if not matches:
            problems.append(Problem(marker_path, 1, "could not find the curated demo count marker"))
            continue
        for match in matches:
            marker_count = int(match.group(1))
            if marker_count != expected_count:
                marker_line = marker_text.count("\n", 0, match.start()) + 1
                problems.append(
                    Problem(
                        marker_path,
                        marker_line,
                        f"{label} count says {marker_count}, but catalog says {expected_count}",
                    )
                )

    referenced_paths: list[str] = []
    for demo in demos:
        referenced_paths.extend([demo.get("aboutPath", ""), demo.get("launchPath", "")])
    for course in catalog.get("courses", []):
        referenced_paths.append(course.get("pagePath", ""))
        if course.get("catalogPath"):
            referenced_paths.append(course["catalogPath"])
        referenced_paths.extend(course.get("assignments", []))

    for raw_path in referenced_paths:
        if not raw_path:
            problems.append(Problem(path, 1, "catalog contains an empty public path"))
            continue
        target = (ROOT / raw_path).resolve()
        if not target_exists(target):
            problems.append(Problem(path, 1, f"catalog target does not exist: {raw_path}"))
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--quiet", action="store_true", help="print only failures and the final summary")
    args = parser.parse_args()

    node = shutil.which("node")
    if not node:
        print("ERROR: Node.js is required for JavaScript syntax checks.", file=sys.stderr)
        return 2

    html_files = site_files(".html")
    javascript_files = site_files(".js")
    css_files = site_files(".css")
    problems: list[Problem] = []

    for path in html_files:
        problems.extend(check_html(node, path))
    for path in javascript_files:
        problem = check_javascript(node, path)
        if problem:
            problems.append(problem)
    for path in css_files:
        problems.extend(check_css(path))
    problems.extend(check_catalog())

    for problem in sorted(problems, key=lambda item: (str(item.path), item.line, item.message)):
        print(f"ERROR: {problem.render()}")

    summary = (
        f"Checked {len(html_files)} HTML files, {len(javascript_files)} JavaScript files, "
        f"{len(css_files)} CSS files, and the generated catalog."
    )
    if problems:
        print(f"FAILED: {summary} Found {len(problems)} problem(s).")
        return 1
    if not args.quiet:
        print(f"PASS: {summary}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
