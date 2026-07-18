#!/usr/bin/env python3
"""Install or verify the shared analytics bootstrap on public site pages.

Usage:
    python add_analytics.py
    python add_analytics.py G-XXXXXXXXXX
    python add_analytics.py --check

The migration removes legacy inline gtag snippets so page views are not counted
twice, then places assets/analytics.js first in <head>. The early placement lets
the shared script observe failures in demo scripts and resources that load later.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ANALYTICS_SCRIPT = ROOT / "assets" / "analytics.js"
PUBLIC_DIRS = (
    "TechUseCaseDemos",
    "DomainUseCaseDemos",
    "CyberSecurityDemos",
    "TreasuryAnalytics",
    "🤖 Browser-AI-Demos",
    "courses",
    "course-packs",
    "browse",
    "Assignments",
    "assets",
)
TOP_LEVEL_HTML = ("index.html", "DEMO_INDEX.html")
SHARED_SCRIPT_RE = re.compile(
    r"^[ \t]*<!--\s*Kateel demo analytics and error telemetry\s*-->[ \t]*\r?\n"
    r"^[ \t]*<script\s+src=[\"'][^\"']*assets/analytics\.js[\"']\s*></script>[ \t]*\r?\n?",
    re.IGNORECASE | re.MULTILINE,
)
LEGACY_GTAG_RE = re.compile(
    r"^[ \t]*(?:<!--\s*(?:Google tag[^>]*|Google Analytics(?: 4)?[^>]*)-->[ \t]*\r?\n[ \t]*)?"
    r"<script\b[^>]*\bsrc=[\"']https://www\.googletagmanager\.com/gtag/js\?id=[^\"']+[\"'][^>]*>[ \t]*</script>[ \t]*\r?\n"
    r"[ \t]*<script\b[^>]*>[ \t]*\r?\n?"
    r"(?:window\.)?dataLayer\s*=\s*(?:window\.)?dataLayer\s*\|\|\s*\[\]\s*;.*?"
    r"gtag\s*\(\s*[\"']config[\"']\s*,.*?</script>[ \t]*\r?\n?",
    re.IGNORECASE | re.DOTALL | re.MULTILINE,
)
REMOVAL_ARTIFACT_RE = re.compile(
    r"^[ \t]+\r?\n(?=<(?:link|meta|script|style)\b)",
    re.IGNORECASE | re.MULTILINE,
)
HEAD_RE = re.compile(r"<head(?:\s[^>]*)?>", re.IGNORECASE)
MEASUREMENT_ID_RE = re.compile(r'(var\s+MEASUREMENT_ID\s*=\s*")[^"]+(";)')


def public_html_files() -> list[Path]:
    paths: set[Path] = set()
    for relative in PUBLIC_DIRS:
        directory = ROOT / relative
        if directory.exists():
            paths.update(directory.rglob("*.html"))
    paths.update(ROOT / relative for relative in TOP_LEVEL_HTML if (ROOT / relative).exists())
    return sorted(path for path in paths if path.is_file())


def read_preserving_newlines(path: Path) -> str:
    with path.open("r", encoding="utf-8", newline="") as handle:
        return handle.read()


def write_preserving_newlines(path: Path, content: str) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        handle.write(content)


def expected_tag(path: Path, newline: str) -> str:
    relative = Path(os.path.relpath(ANALYTICS_SCRIPT, path.parent)).as_posix()
    return (
        f"{newline}  <!-- Kateel demo analytics and error telemetry -->"
        f"{newline}  <script src=\"{relative}\"></script>"
    )


def migrated_content(path: Path, original: str) -> str:
    newline = "\r\n" if "\r\n" in original else "\n"
    content = LEGACY_GTAG_RE.sub("", original)
    content = REMOVAL_ARTIFACT_RE.sub("  ", content)
    content = SHARED_SCRIPT_RE.sub("", content)
    head = HEAD_RE.search(content)
    if not head:
        raise ValueError("missing <head> element")
    return content[: head.end()] + expected_tag(path, newline) + content[head.end() :]


def update_measurement_id(measurement_id: str) -> bool:
    if not re.fullmatch(r"G-[A-Z0-9]+", measurement_id):
        raise ValueError("measurement ID must look like G-XXXXXXXXXX")
    content = read_preserving_newlines(ANALYTICS_SCRIPT)
    updated, count = MEASUREMENT_ID_RE.subn(rf"\g<1>{measurement_id}\g<2>", content, count=1)
    if count != 1:
        raise ValueError("could not find MEASUREMENT_ID in assets/analytics.js")
    if updated == content:
        return False
    write_preserving_newlines(ANALYTICS_SCRIPT, updated)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("measurement_id", nargs="?", help="optional GA4 ID to write to assets/analytics.js")
    parser.add_argument("--check", action="store_true", help="verify files without modifying them")
    args = parser.parse_args()

    if args.check and args.measurement_id:
        parser.error("measurement_id cannot be used with --check")

    changed: list[Path] = []
    problems: list[str] = []

    if args.measurement_id:
        try:
            if update_measurement_id(args.measurement_id):
                changed.append(ANALYTICS_SCRIPT)
        except ValueError as error:
            parser.error(str(error))

    pages = public_html_files()
    for path in pages:
        original = read_preserving_newlines(path)
        try:
            expected = migrated_content(path, original)
        except ValueError as error:
            problems.append(f"{path.relative_to(ROOT)}: {error}")
            continue

        if expected == original:
            continue
        if args.check:
            problems.append(f"{path.relative_to(ROOT)}: analytics bootstrap is missing or outdated")
        else:
            write_preserving_newlines(path, expected)
            changed.append(path)

    if problems:
        print("Analytics verification failed:")
        for problem in problems:
            print(f"  - {problem}")
        return 1

    if args.check:
        print(f"Analytics verification passed: {len(pages)} public HTML pages use the shared bootstrap.")
    else:
        print(f"Analytics migration complete: {len(changed)} files updated across {len(pages)} public HTML pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
