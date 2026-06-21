import html
import json
import os
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "data" / "site-catalog.json"
COURSES_DIR = ROOT / "courses"
ASSIGNMENTS_INDEX = ROOT / "Assignments" / "index.html"
SITE_URL = "https://vinayasharada.github.io/KateelLearningDemosToStudents/"
REPO_URL = "https://github.com/VinayaSharada/KateelLearningDemosToStudents"
SITE_NAME = "KateelLearningDemos"
AUTHOR_NAME = "Professor Vinaya Sathyanarayana"
AUTHOR_EMAIL = "vinallcontact@gmail.com"
DEFAULT_OG_IMAGE = "assets/seo-preview.svg"


COURSE_META = {
    "treasury": {
        "eyebrow": "Course Pack",
        "prompt": "Ask students to compare two hedge or liquidity responses and justify which one better balances risk, cost, and operational realism.",
        "outcomes": [
            "Explain how treasury analytics supports short-horizon cash and hedge decisions.",
            "Compare FX, stablecoin, smart-contract, and working-capital trade-offs across scenarios.",
            "Use dashboard, simulation, and scenario outputs to defend a treasury action.",
            "Separate raw metrics from managerial judgment when AI suggestions are present.",
        ],
    },
    "ai-ml-workflows": {
        "eyebrow": "Course Pack",
        "prompt": "Have students toggle AI on and off, then explain not just what changed in the answer, but what changed in the workflow and oversight burden.",
        "outcomes": [
            "Distinguish descriptive, predictive, and generative AI workflows.",
            "Compare human-only, analytics-first, and AI-assisted decisions.",
            "Evaluate usefulness, explainability, and governance signals in AI outputs.",
            "Design a workflow with clear human checkpoints rather than blind automation.",
        ],
    },
    "risk": {
        "eyebrow": "Course Pack",
        "prompt": "Ask students to identify which risk signal matters most, which control follows from it, and what false comfort the dashboard might create.",
        "outcomes": [
            "Interpret financial, cyber, and model-risk signals in a structured way.",
            "Compare baseline and stress outcomes rather than isolated single numbers.",
            "Connect risk metrics to controls, limits, and escalation actions.",
            "Recognize where polished outputs can still hide uncertainty or blind spots.",
        ],
    },
    "quant": {
        "eyebrow": "Course Pack",
        "prompt": "Ask students to defend a pricing, allocation, or valuation decision using both the chart and the assumptions behind the chart.",
        "outcomes": [
            "Interpret quantitative finance outputs without detaching them from assumptions.",
            "Compare pricing, simulation, optimization, and financing models across use cases.",
            "Explain how parameter changes propagate through risk, value, and sensitivity outputs.",
            "Translate quantitative outputs into managerial or investment recommendations.",
        ],
    },
    "cyber": {
        "eyebrow": "Course Pack",
        "prompt": "Have students explain which observed signal is most actionable, which control they would recommend next, and what evidence they still need.",
        "outcomes": [
            "Interpret security events, threat models, and scan outputs in context.",
            "Connect observed risk to detection, prioritization, and remediation choices.",
            "Compare static indicators with scenario-driven security reasoning.",
            "Recognize the difference between activity, evidence, and confirmed compromise.",
        ],
    },
    "compliance": {
        "eyebrow": "Course Pack",
        "prompt": "Ask students to identify the governance or regulatory decision behind the output, not just the signal itself.",
        "outcomes": [
            "Interpret governance, policy, AML, and model-monitoring outputs responsibly.",
            "Connect signal detection to control design and escalation choices.",
            "Distinguish detection, decision, accountability, and documentation layers.",
            "Use demo outputs to discuss oversight rather than just automation quality.",
        ],
    },
    "rag-nlp": {
        "eyebrow": "Course Pack",
        "prompt": "Ask students to compare answer quality, evidence quality, and interaction quality rather than treating them as the same thing.",
        "outcomes": [
            "Compare retrieval, summarization, voice, and assistant-style NLP interactions.",
            "Evaluate answer quality together with evidence quality and grounding.",
            "Recognize where interface smoothness can hide weak retrieval or poor citations.",
            "Use prompt, retrieval, and evidence changes to explain output differences.",
        ],
    },
    "banking": {
        "eyebrow": "Course Pack",
        "prompt": "Ask students to explain what action a branch, risk, or lending team should actually take after seeing the output.",
        "outcomes": [
            "Interpret customer, fraud, lending, and banking-risk analytics in business terms.",
            "Connect model outputs to threshold, policy, or operational decisions.",
            "Compare signal quality with decision usefulness rather than accuracy alone.",
            "Explain how banking constraints shape what a good recommendation looks like.",
        ],
    },
}


ASSIGNMENT_META = [
    {
        "folder": "Session03_CreditRisk",
        "title": "Credit Risk & Lending Decisions",
        "summary": "Move from model outputs to lending rationale, thresholds, and documented approval logic.",
        "course_slug": "banking",
    },
    {
        "folder": "Session04_FraudDetection",
        "title": "Fraud Detection",
        "summary": "Use transaction and anomaly signals to compare detection, triage, and escalation choices.",
        "course_slug": "banking",
    },
    {
        "folder": "Session05_Segmentation",
        "title": "Customer Segmentation",
        "summary": "Translate clustering and customer groups into operational actions and segment strategy.",
        "course_slug": "banking",
    },
    {
        "folder": "Session10_WealthManagement",
        "title": "Wealth Management",
        "summary": "Connect portfolio or suitability analytics to recommendation quality and client communication.",
        "course_slug": "quant",
    },
    {
        "folder": "Session13_ModelGovernance",
        "title": "Model Governance",
        "summary": "Interpret post-deployment monitoring signals and recommend governance follow-up actions.",
        "course_slug": "compliance",
    },
    {
        "folder": "Session14_ResponsibleAI",
        "title": "Responsible AI",
        "summary": "Examine fairness, accountability, and explainability trade-offs in model-driven decisions.",
        "course_slug": "compliance",
    },
]


def load_catalog():
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def href(from_file: Path, repo_rel: str) -> str:
    return Path(os.path.relpath(ROOT / repo_rel, from_file.parent)).as_posix()


def canonical_url(repo_rel: str) -> str:
    normalized = repo_rel.replace("\\", "/").lstrip("./")
    if normalized in {"", "index.html"}:
        return SITE_URL
    return SITE_URL.rstrip("/") + "/" + quote(normalized, safe="/-_.~")


def json_ld_script(payload: dict) -> str:
    return (
        '<script type="application/ld+json">\n'
        + json.dumps(payload, indent=2, ensure_ascii=False)
        + "\n</script>"
    )


def seo_meta_block(
    *,
    title: str,
    description: str,
    repo_rel: str,
    page_type: str,
    keywords: str,
    json_ld_payloads: list[dict],
) -> str:
    canonical = canonical_url(repo_rel)
    og_image = canonical_url(DEFAULT_OG_IMAGE)
    tags = [
        f'  <title>{esc(title)}</title>',
        f'  <meta name="description" content="{esc(description)}">',
        f'  <meta name="keywords" content="{esc(keywords)}">',
        '  <meta name="robots" content="index,follow,max-image-preview:large">',
        f'  <meta name="author" content="{esc(AUTHOR_NAME)}">',
        '  <meta name="theme-color" content="#0f766e">',
        f'  <link rel="canonical" href="{esc(canonical)}">',
        '  <link rel="manifest" href="../site.webmanifest">' if repo_rel.startswith(("courses/", "Assignments/")) else '  <link rel="manifest" href="site.webmanifest">',
        f'  <meta property="og:site_name" content="{esc(SITE_NAME)}">',
        f'  <meta property="og:title" content="{esc(title)}">',
        f'  <meta property="og:description" content="{esc(description)}">',
        f'  <meta property="og:type" content="{esc(page_type)}">',
        f'  <meta property="og:url" content="{esc(canonical)}">',
        f'  <meta property="og:image" content="{esc(og_image)}">',
        '  <meta property="og:image:alt" content="KateelLearningDemos educational demo library preview">',
        '  <meta name="twitter:card" content="summary_large_image">',
        f'  <meta name="twitter:title" content="{esc(title)}">',
        f'  <meta name="twitter:description" content="{esc(description)}">',
        f'  <meta name="twitter:image" content="{esc(og_image)}">',
    ]
    tags.extend(json_ld_script(payload) for payload in json_ld_payloads)
    return "\n".join(tags)


def common_nav(current_slug: str | None, base_prefix: str) -> str:
    def course_link(slug: str, label: str, icon: str) -> str:
        active = ' active' if current_slug == slug else ''
        return f'<a class="dropdown-link{active}" href="{base_prefix}courses/{slug if slug != "treasury" else "treasury-management"}.html"><span>{icon}</span>{label}</a>'

    slug_to_file = {
        "treasury": "treasury-management.html",
        "ai-ml-workflows": "ai-ml-workflows.html",
        "risk": "risk-management.html",
        "quant": "quant-finance.html",
        "cyber": "cybersecurity.html",
        "compliance": "compliance.html",
        "rag-nlp": "rag-nlp.html",
        "banking": "banking.html",
    }

    course_links = "\n      ".join(
        [
            f'<a class="dropdown-link{" active" if current_slug == slug else ""}" href="{base_prefix}courses/{slug_to_file[slug]}"><span>{icon}</span>{label}</a>'
            for slug, label, icon in [
                ("treasury", "Treasury", "🏦"),
                ("ai-ml-workflows", "AI/ML", "🤖"),
                ("risk", "Risk", "⚠️"),
                ("quant", "Quant", "💰"),
                ("cyber", "Cyber", "🔐"),
                ("compliance", "Compliance", "📋"),
                ("rag-nlp", "RAG/NLP", "📝"),
                ("banking", "Banking", "🏦"),
            ]
        ]
    )

    return f"""<nav class="site-nav" aria-label="Main navigation">
  <div class="nav-inner">
    <a class="brand" href="{base_prefix}index.html">KateelLearningDemos</a>
    <div class="nav-links">
      <a class="nav-link" href="{base_prefix}index.html">Home</a>
      <a class="nav-link" href="{base_prefix}browse/index.html" data-kld-nav="browse">Browse Demos</a>
      <a class="nav-link" href="{base_prefix}course-packs/index.html" data-kld-nav="packs">Course Packs</a>
      <a class="nav-link" href="{base_prefix}Assignments/index.html" data-kld-nav="assignments">Assignments</a>
      <details class="nav-dropdown">
        <summary class="nav-link">Courses</summary>
        <div class="dropdown-content" role="menu">
      {course_links}
        </div>
      </details>
      <a class="nav-link" href="https://github.com/VinayaSharada/KateelLearningDemosToStudents" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
</nav>"""


def card_for_demo(course_file: Path, demo: dict) -> str:
    about_href = href(course_file, demo["aboutPath"])
    launch_href = href(course_file, demo["launchPath"])
    cue = demo["teacherCue"].replace("Teacher cue: ", "")
    surface = demo["surface"]
    return f"""
<a class="demo-card" href="{esc(about_href)}">
  <div class="demo-card-top">
    <h3>{esc(demo["title"])}</h3>
    <span class="level-badge">{esc(demo["level"])}</span>
  </div>
  <p>{esc(demo["summary"])}</p>
  <p class="teacher-cue"><strong>Teacher cue:</strong> {esc(cue)}</p>
  <div class="demo-badges">
    <span class="mode-badge">{esc(demo["mode"])}</span>
    <span class="mode-badge">{esc(demo["duration"])}</span>
    <span class="mode-badge">{esc(demo["readiness"])}</span>
  </div>
  <div class="demo-meta">
    <span>{esc(surface)}</span>
    <span>{esc(demo["courseTitle"])}</span>
  </div>
  <div class="demo-actions">
    <span class="btn-mini">Read About Demo</span>
    <a class="btn-mini outline launch-demo" href="{esc(launch_href)}">Launch Demo</a>
  </div>
</a>"""


def render_course(course: dict) -> str:
    meta = COURSE_META[course["slug"]]
    page_file = ROOT / course["pagePath"]
    demo_cards = "\n".join(card_for_demo(page_file, demo) for demo in course["demos"])
    description = course["subtitle"]
    repo_rel = course["pagePath"]
    course_url = canonical_url(repo_rel)
    demo_list = [
        {
            "@type": "ListItem",
            "position": index,
            "name": demo["title"],
            "url": canonical_url(demo["aboutPath"]),
        }
        for index, demo in enumerate(course["demos"], start=1)
    ]
    seo_block = seo_meta_block(
        title=f'{course["title"]} Course Pack - {SITE_NAME}',
        description=description,
        repo_rel=repo_rel,
        page_type="website",
        keywords=(
            f'{course["title"]}, {course["audience"]}, classroom demos, browser-based learning, '
            'AI education, finance demos, GitHub Pages demos, no API key demos'
        ),
        json_ld_payloads=[
            {
                "@context": "https://schema.org",
                "@type": "Course",
                "name": course["title"],
                "description": description,
                "provider": {
                    "@type": "Person",
                    "name": AUTHOR_NAME,
                    "email": AUTHOR_EMAIL,
                    "url": REPO_URL,
                },
                "educationalCredentialAwarded": "Course Pack",
                "educationalLevel": "Higher Education",
                "teaches": meta["outcomes"],
                "url": course_url,
                "hasCourseInstance": {
                    "@type": "CourseInstance",
                    "courseMode": "Browser-based",
                    "inLanguage": "en",
                },
            },
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": f'{course["title"]} demos',
                "itemListElement": demo_list,
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": canonical_url("index.html")},
                    {"@type": "ListItem", "position": 2, "name": "Course Packs", "item": canonical_url("course-packs/index.html")},
                    {"@type": "ListItem", "position": 3, "name": course["title"], "item": course_url},
                ],
            },
        ],
    )
    assignment_links = (
        "".join(
            f'<a class="btn-mini outline" href="../{esc(path)}">{esc(Path(path).parent.name)}</a>'
            for path in course.get("assignments", [])
        )
        if course.get("assignments")
        else '<span class="btn-mini outline">Assignments coming soon</span>'
    )
    catalog_link = (
        f'<a class="btn-mini" href="../{esc(course["catalogPath"])}">Catalog / Map</a>'
        if course.get("catalogPath")
        else '<span class="btn-mini">Course page only</span>'
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
{seo_block}
  <link rel="stylesheet" href="../assets/site.css">
  <script defer src="../assets/site.js"></script>
</head>
<body>
{common_nav(course["slug"], "../")}
  <main class="container">
    <section class="site-hero page-hero">
      <p class="hero-eyebrow">{esc(meta["eyebrow"])}</p>
      <h1>{esc(course["title"])}</h1>
      <p class="hero-subtitle">{esc(course["subtitle"])}</p>
      <div class="pill-row">
        <span class="pill">{esc(course["registeredDemos"])} curated demos</span>
        <span class="pill">About → Launch workflow</span>
        <span class="pill">Assignments connected</span>
      </div>
      <div class="cta-buttons">
        <a class="btn btn-primary" href="#demos">Browse demos</a>
        <a class="btn btn-secondary" href="../Assignments/index.html">View assignments</a>
      </div>
    </section>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">{esc(course["registeredDemos"])}</div><div class="stat-label">Curated demos</div></div>
      <div class="stat-card"><div class="stat-value">{len(course.get("assignments", []))}</div><div class="stat-label">Linked assignments</div></div>
      <div class="stat-card"><div class="stat-value">1</div><div class="stat-label">Run-mode families</div></div>
      <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">API keys required</div></div>
    </div>

    <section class="section" id="start">
      <div class="section-header">
        <p class="section-kicker">Teaching flow</p>
        <h2>Start from the pack, not the folder tree</h2>
        <p>This course pack collects the curated public demos for this theme and links them to the right supporting course and assignment resources.</p>
      </div>
      <div class="learning-path">
        <div><strong>1 Open a demo unit</strong><p>Use the About page for context, expectations, and teaching prompts.</p></div>
        <div><strong>2 Launch when ready</strong><p>Move into the interactive demo only after the setup and run mode make sense for the class.</p></div>
        <div><strong>3 Extend with assignments</strong><p>Use the linked assignment scaffold when you want written analysis, reflection, or grading.</p></div>
      </div>
    </section>

    <section class="section" id="outcomes">
      <div class="section-header">
        <p class="section-kicker">Learning outcomes</p>
        <h2>What this course pack builds</h2>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <h3>Core outcomes</h3>
          <ul>
            {''.join(f'<li>{esc(item)}</li>' for item in meta["outcomes"])}
          </ul>
        </article>
        <article class="info-card">
          <h3>Audience fit</h3>
          <p>{esc(course["audience"])}</p>
          <div class="demo-badges"><span class="mode-badge">Curated public pack</span><span class="mode-badge">Classroom ready</span></div>
        </article>
        <article class="info-card highlight-card">
          <h3>Faculty prompt</h3>
          <p>{esc(meta["prompt"])}</p>
        </article>
      </div>
    </section>

    <section class="section" id="resources">
      <div class="section-header">
        <p class="section-kicker">Support resources</p>
        <h2>Use the pack with catalogs and assignments</h2>
        <p>Course pages, assignments, and catalog documents should reinforce each other rather than living as separate navigation systems.</p>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <h3>Course references</h3>
          <div class="resource-row">{catalog_link}</div>
        </article>
        <article class="info-card">
          <h3>Assignments</h3>
          <div class="resource-row">{assignment_links}</div>
        </article>
        <article class="info-card">
          <h3>Platform path</h3>
          <div class="resource-row">
            <a class="btn-mini" href="../browse/index.html">Browse Demos</a>
            <a class="btn-mini outline" href="../course-packs/index.html">All Course Packs</a>
          </div>
        </article>
      </div>
    </section>

    <section class="section" id="demos">
      <div class="section-header">
        <p class="section-kicker">Demo catalog</p>
        <h2>Demos in this course pack</h2>
        <p>Every card leads to an About page first, then to the launch surface. Run-mode and readiness badges are shown directly on the card.</p>
      </div>
      <div class="demo-grid">
{demo_cards}
      </div>
    </section>

    <section class="section attribution-card" id="attribution">
      <h2>Attribution</h2>
      <p>Created by <strong>Professor Vinaya Sathyanarayana</strong>. Attribution email: <a href="mailto:vinallcontact@gmail.com">vinallcontact@gmail.com</a>. Please notify usage and retain attribution in course materials.</p>
    </section>
  </main>
  <footer class="site-footer">
    <p><a href="../index.html">KateelLearningDemos</a> • {esc(course["title"])} • <a href="../Assignments/index.html">Assignments</a></p>
  </footer>
</body>
</html>
"""


def render_assignments_index(catalog: dict) -> str:
    course_lookup = {course["slug"]: course["title"] for course in catalog["courses"]}
    assignment_items = []
    cards = []
    for position, item in enumerate(ASSIGNMENT_META, start=1):
        folder = item["folder"]
        readme_path = f"Assignments/{folder}/README.md"
        assignment_items.append(
            {
                "@type": "ListItem",
                "position": position,
                "name": folder.replace("Session", "Session ").replace("_", " - "),
                "url": canonical_url(readme_path),
            }
        )
        cards.append(
            f"""
<article class="info-card course-pack-card">
  <p class="section-kicker">Assignment</p>
  <h3>{esc(folder.replace("Session", "Session ").replace("_", " — "))}</h3>
  <p>{esc(item["summary"])}</p>
  <div class="demo-badges">
    <span class="mode-badge">{esc(item["title"])}</span>
    <span class="mode-badge">{esc(course_lookup[item["course_slug"]])}</span>
  </div>
  <div class="demo-actions">
    <a class="btn-mini" href="{esc(folder)}/README.md">Open assignment</a>
    <a class="btn-mini outline" href="../courses/{esc(catalog['courses'][[c['slug'] for c in catalog['courses']].index(item['course_slug'])]['pagePath'].split('/')[-1])}">Open course pack</a>
  </div>
</article>"""
        )
    seo_block = seo_meta_block(
        title=f"Assignments - {SITE_NAME}",
        description="Assignment scaffolds that connect curated demos to graded or reflective coursework.",
        repo_rel="Assignments/index.html",
        page_type="website",
        keywords=(
            "assignments, classroom assessment, learning demos, finance assignments, "
            "AI education assignments, GitHub Pages teaching resources"
        ),
        json_ld_payloads=[
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "KateelLearningDemos Assignments",
                "description": "Assignment scaffolds that connect curated demos to graded or reflective coursework.",
                "url": canonical_url("Assignments/index.html"),
                "isPartOf": canonical_url("index.html"),
            },
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Assignment packs",
                "itemListElement": assignment_items,
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": canonical_url("index.html")},
                    {"@type": "ListItem", "position": 2, "name": "Assignments", "item": canonical_url("Assignments/index.html")},
                ],
            },
        ],
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
{seo_block}
  <link rel="stylesheet" href="../assets/site.css">
  <script defer src="../assets/site.js"></script>
</head>
<body>
{common_nav(None, "../")}
  <main class="container">
    <section class="site-hero page-hero">
      <p class="hero-eyebrow">Teaching Extensions</p>
      <h1>Assignments</h1>
      <p class="hero-subtitle">Assignments convert the demo experience into written analysis, graded reflection, or mini-project work. They are the bridge between public demo interaction and classroom assessment.</p>
      <div class="pill-row">
        <span class="pill">{len(ASSIGNMENT_META)} assignment packs</span>
        <span class="pill">Linked to curated course packs</span>
        <span class="pill">Use after About → Launch</span>
      </div>
    </section>

    <section class="section">
      <div class="learning-path">
        <div><strong>1 Run the demo</strong><p>Use the course pack and About page to frame the activity before opening the assignment.</p></div>
        <div><strong>2 Produce evidence</strong><p>Capture outputs, screenshots, observations, or exported files that support the write-up.</p></div>
        <div><strong>3 Submit analysis</strong><p>Use the assignment scaffold to turn interaction into explanation, critique, and recommendation.</p></div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <p class="section-kicker">Assignment catalog</p>
        <h2>Current assignment scaffolds</h2>
        <p>These are the formal teaching extensions currently present in the repo. They complement the curated course-pack and demo surfaces.</p>
      </div>
      <div class="card-grid">
        {''.join(cards)}
      </div>
    </section>

    <section class="section attribution-card">
      <h2>How this fits the Pages UX</h2>
      <p>Home → Course Pack → About Demo → Launch Demo → Assignment is now a visible public teaching flow instead of an implicit repo-only pattern.</p>
    </section>
  </main>
  <footer class="site-footer">
    <p><a href="../index.html">KateelLearningDemos</a> • Assignments • <a href="../course-packs/index.html">Course Packs</a></p>
  </footer>
</body>
</html>
"""


def main():
    catalog = load_catalog()
    for course in catalog["courses"]:
        page_file = ROOT / course["pagePath"]
        page_file.write_text(render_course(course), encoding="utf-8")

    ASSIGNMENTS_INDEX.write_text(render_assignments_index(catalog), encoding="utf-8")
    print(f"Rendered {len(catalog['courses'])} course pages and Assignments/index.html")


if __name__ == "__main__":
    main()
