import html
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "data" / "site-catalog.json"

COURSE_PACKS = [
    {
        "slug": "treasury",
        "title": "Treasury Management",
        "path": "courses/treasury-management.html",
        "audience": "CFO workshops, treasury, liquidity, hedging",
        "catalogPath": None,
        "assignmentPaths": [],
    },
    {
        "slug": "ai-ml-workflows",
        "title": "AI/ML Workflows",
        "path": "courses/ai-ml-workflows.html",
        "audience": "AI product, governance, workflow design",
        "catalogPath": "CourseCatalogs/Management_of_AI_Products_Catalog.md",
        "assignmentPaths": [],
    },
    {
        "slug": "risk",
        "title": "Risk Management",
        "path": "courses/risk-management.html",
        "audience": "market, counterparty, operational, cyber risk",
        "catalogPath": None,
        "assignmentPaths": [],
    },
    {
        "slug": "quant",
        "title": "Quant Finance",
        "path": "courses/quant-finance.html",
        "audience": "options, VaR, portfolio, valuation",
        "catalogPath": "CourseCatalogs/AI_ML_Financial_Services_Catalog.md",
        "assignmentPaths": ["Assignments/Session10_WealthManagement/README.md"],
    },
    {
        "slug": "cyber",
        "title": "Cybersecurity",
        "path": "courses/cybersecurity.html",
        "audience": "IoT, network, malware, threat modeling",
        "catalogPath": "CourseCatalogs/Cyber_Security_Catalog.md",
        "assignmentPaths": [],
    },
    {
        "slug": "compliance",
        "title": "Compliance & Governance",
        "path": "courses/compliance.html",
        "audience": "AI governance, AML, regulation, model risk",
        "catalogPath": "CourseCatalogs/Public_Policy_Governance_Catalog.md",
        "assignmentPaths": [
            "Assignments/Session13_ModelGovernance/README.md",
            "Assignments/Session14_ResponsibleAI/README.md",
        ],
    },
    {
        "slug": "rag-nlp",
        "title": "RAG & NLP",
        "path": "courses/rag-nlp.html",
        "audience": "retrieval, summarization, voice, knowledge assistants",
        "catalogPath": "CourseCatalogs/NLP/README.md",
        "assignmentPaths": [],
    },
    {
        "slug": "banking",
        "title": "Banking & Finance",
        "path": "courses/banking.html",
        "audience": "banking analytics, fraud, lending, customer risk",
        "catalogPath": "COURSE_COMPANION_MAP.md",
        "assignmentPaths": [
            "Assignments/Session03_CreditRisk/README.md",
            "Assignments/Session04_FraudDetection/README.md",
            "Assignments/Session05_Segmentation/README.md",
        ],
    },
]


CARD_RE = re.compile(
    r'<a class="demo-card(?: featured-demo)?" href="(?P<about>[^"]+)">(?P<body>.*?)'
    r'<a class="btn-mini outline launch-demo" href="(?P<launch>[^"]+)">(?:Launch Demo|Launch)</a>',
    re.S,
)
TAG_RE = re.compile(r"<[^>]+>")


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(TAG_RE.sub("", text))).strip()


def find_first(pattern: str, text: str, default: str = "") -> str:
    match = re.search(pattern, text, re.S)
    return clean(match.group(1)) if match else default


def find_first_raw(pattern: str, text: str, default: str = "") -> str:
    match = re.search(pattern, text, re.S)
    return match.group(1) if match else default


def find_all(pattern: str, text: str):
    return [clean(match) for match in re.findall(pattern, text, re.S)]


def infer_mode(summary: str, surface: str, explicit_mode: str = "") -> str:
    if explicit_mode:
        return explicit_mode
    value = f"{summary} {surface}".lower()
    if "browser slm" in value or "local ai" in value:
        return "Browser AI"
    if "multi-mode" in value:
        return "Multi-Mode"
    if "colab" in value and "browser" in value:
        return "Multi-Mode"
    if "colab" in value and "local" in value:
        return "Multi-Mode"
    if "colab" in value:
        return "Colab"
    if "local python" in value:
        return "Local"
    if "browser" in value or "local analytics" in value or "no external api" in value:
        return "Browser"
    return "Browser"


def parse_course(course_meta):
    page_path = ROOT / course_meta["path"]
    raw = page_path.read_text(encoding="utf-8")
    subtitle = find_first(r'<p class="hero-subtitle">(.*?)</p>', raw)
    registered_demos = find_first(r'<div class="stat-value">(.*?)</div>', raw, "0")

    demos = []
    for match in CARD_RE.finditer(raw):
        body = match.group("body")
        paragraphs = re.findall(r"<p(?: class=\"[^\"]+\")?>(.*?)</p>", body, re.S)
        summary = clean(paragraphs[0]) if paragraphs else ""
        teacher_cue = find_first(r'<p class="teacher-cue">(.*?)</p>', body)
        badges = find_all(r'<span class="mode-badge">(.*?)</span>', find_first_raw(r'<div class="demo-badges">(.*?)</div>', body))
        spans = find_all(r"<span>(.*?)</span>", find_first_raw(r'<div class="demo-meta">(.*?)</div>', body))
        explicit_mode = badges[0] if badges else ""
        duration = badges[1] if len(badges) > 1 else "20-30 min"
        surface = spans[0] if spans else "Browser-based"
        demo = {
            "title": find_first(r"<h3>(.*?)</h3>", body),
            "level": find_first(r'<span class="level-badge">(.*?)</span>', body, "Unspecified"),
            "summary": summary,
            "teacherCue": teacher_cue,
            "duration": duration,
            "surface": surface,
            "mode": infer_mode(summary, surface, explicit_mode),
            "courseSlug": course_meta["slug"],
            "courseTitle": course_meta["title"],
            "aboutPath": str((page_path.parent / match.group("about")).resolve().relative_to(ROOT)).replace("\\", "/"),
            "launchPath": str((page_path.parent / match.group("launch")).resolve().relative_to(ROOT)).replace("\\", "/"),
            "readiness": badges[2] if len(badges) > 2 else "Classroom Ready",
        }
        demos.append(demo)

    return {
        "slug": course_meta["slug"],
        "title": course_meta["title"],
        "audience": course_meta["audience"],
        "subtitle": subtitle,
        "pagePath": course_meta["path"],
        "registeredDemos": registered_demos,
        "catalogPath": course_meta["catalogPath"],
        "assignments": course_meta["assignmentPaths"],
        "demos": demos,
    }


def main():
    courses = [parse_course(meta) for meta in COURSE_PACKS]

    dedupe = {}
    for course in courses:
      for demo in course["demos"]:
          dedupe[demo["aboutPath"]] = demo

    demos = sorted(dedupe.values(), key=lambda item: item["title"].lower())
    mode_counts = {}
    for demo in demos:
        mode_counts[demo["mode"]] = mode_counts.get(demo["mode"], 0) + 1

    payload = {
        "schemaVersion": 1,
        "generatedFrom": "scripts/build_site_catalog.py",
        "courses": courses,
        "demos": demos,
        "counts": {
            "coursePacks": len(courses),
            "curatedDemos": len(demos),
            "runModes": len(mode_counts),
        },
        "modeCounts": mode_counts,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT} with {len(demos)} curated demos across {len(courses)} course packs.")


if __name__ == "__main__":
    main()
