import json
from datetime import date
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "data" / "site-catalog.json"
SITE_URL = "https://vinayasharada.github.io/KateelLearningDemosToStudents/"
ROBOTS_PATH = ROOT / "robots.txt"
SITEMAP_PATH = ROOT / "sitemap.xml"
MANIFEST_PATH = ROOT / "site.webmanifest"


def load_catalog() -> dict:
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def absolute_url(repo_rel: str) -> str:
    normalized = repo_rel.replace("\\", "/").lstrip("./")
    if normalized in {"", "index.html"}:
        return SITE_URL
    return SITE_URL.rstrip("/") + "/" + quote(normalized, safe="/-_.~")


def build_url_entries(catalog: dict) -> list[str]:
    priority_map = {
        "index.html": "1.0",
        "browse/index.html": "0.95",
        "course-packs/index.html": "0.95",
        "Assignments/index.html": "0.85",
    }
    paths = [
        "index.html",
        "browse/index.html",
        "course-packs/index.html",
        "Assignments/index.html",
    ]
    for course in catalog["courses"]:
        paths.append(course["pagePath"])
        for demo in course["demos"]:
            paths.append(demo["aboutPath"])
            paths.append(demo["launchPath"])

    seen = set()
    ordered_paths = []
    for path in paths:
        normalized = path.replace("\\", "/")
        if normalized not in seen:
            seen.add(normalized)
            ordered_paths.append(normalized)

    today = date.today().isoformat()
    entries = []
    for path in ordered_paths:
        priority = priority_map.get(path, "0.7" if path.endswith("/about.html") else "0.6")
        entries.append(
            "  <url>\n"
            f"    <loc>{absolute_url(path)}</loc>\n"
            f"    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>{'weekly' if path.endswith('index.html') or path == 'index.html' else 'monthly'}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            "  </url>"
        )
    return entries


def write_robots() -> None:
    ROBOTS_PATH.write_text(
        "\n".join(
            [
                "User-agent: *",
                "Allow: /",
                "",
                f"Sitemap: {SITE_URL}sitemap.xml",
                "",
            ]
        ),
        encoding="utf-8",
    )


def write_sitemap(catalog: dict) -> None:
    entries = build_url_entries(catalog)
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )
    SITEMAP_PATH.write_text(xml, encoding="utf-8")


def write_manifest(catalog: dict) -> None:
    manifest = {
        "name": "KateelLearningDemos",
        "short_name": "KateelDemos",
        "description": "Browser-based AI, finance, risk, and analytics learning demos for students and faculty.",
        "start_url": "/KateelLearningDemosToStudents/",
        "scope": "/KateelLearningDemosToStudents/",
        "display": "standalone",
        "background_color": "#f5f7fb",
        "theme_color": "#0f766e",
        "categories": ["education", "finance", "artificial intelligence", "machine learning"],
        "lang": "en",
        "icons": [],
        "shortcuts": [
            {
                "name": "Browse Demos",
                "url": "/KateelLearningDemosToStudents/browse/index.html",
                "description": f'Browse {catalog["counts"]["curatedDemos"]} curated demos',
            },
            {
                "name": "Course Packs",
                "url": "/KateelLearningDemosToStudents/course-packs/index.html",
                "description": f'Open {catalog["counts"]["coursePacks"]} curated course packs',
            },
        ],
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def main() -> None:
    catalog = load_catalog()
    write_robots()
    write_sitemap(catalog)
    write_manifest(catalog)
    print("Generated robots.txt, sitemap.xml, and site.webmanifest")


if __name__ == "__main__":
    main()
