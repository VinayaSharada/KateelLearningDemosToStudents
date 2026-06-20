#!/usr/bin/env python3
"""Improve GitHub Pages navigation and About Demo separation for KateelLearningDemos."""
from __future__ import annotations

from dataclasses import dataclass
from html import escape
from pathlib import Path
import re

REPO_NAME = "KateelLearningDemosToStudents"
REPO_ROOT_URL = f"/{REPO_NAME}/"
GITHUB_URL = "https://github.com/VinayaSharada/KateelLearningDemosToStudents"
ATTRIBUTION_EMAIL = "vinallcontact@gmail.com"
GA_ID = "G-V672XGCRSK"
DEMO_ROOTS = [
    Path("TechUseCaseDemos"),
    Path("DomainUseCaseDemos"),
    Path("CyberSecurityDemos"),
    Path("🤖 Browser-AI-Demos"),
]

COURSE_ORDER = [
    "treasury",
    "ai_ml",
    "risk",
    "quant",
    "cyber",
    "compliance",
    "rag_nlp",
    "banking",
]

COURSES = {
    "treasury": {
        "emoji": "🏦",
        "title": "Treasury Management",
        "short": "Treasury",
        "path": "courses/treasury-management.html",
        "description": "Liquidity, working capital, FX hedging, cash conversion cycle, digital treasury, and AI-enabled treasury transformation for CFO aspirants.",
        "outcomes": [
            "Explain how liquidity dashboards support cash decision-making.",
            "Compare hedging choices under currency, rate, and cash-flow scenarios.",
            "Use working-capital metrics to recommend treasury actions.",
            "Evaluate when AI support improves judgment without replacing accountability.",
        ],
        "faculty_prompt": "Ask students to run a stress scenario, export or screenshot results, then defend the treasury action in a 90-second board memo.",
    },
    "ai_ml": {
        "emoji": "🤖",
        "title": "AI/ML Workflows",
        "short": "AI/ML",
        "path": "courses/ai-ml-workflows.html",
        "description": "Hands-on AI product, model, workflow, governance, and decision-support demos for finance and business learners.",
        "outcomes": [
            "Distinguish descriptive, predictive, and generative AI use cases.",
            "Compare human, statistical, and AI-assisted decisions.",
            "Evaluate model outputs for usefulness, bias, and explainability.",
            "Design an AI workflow with clear human oversight.",
        ],
        "faculty_prompt": "Have students toggle AI on/off and document what changed in the recommendation, not just the final answer.",
    },
    "risk": {
        "emoji": "⚠️",
        "title": "Risk Management",
        "short": "Risk",
        "path": "courses/risk-management.html",
        "description": "Credit, market, counterparty, systemic, and cyber-risk modeling demos for finance and analytics courses.",
        "outcomes": [
            "Interpret risk indicators and scenario outputs.",
            "Explain trade-offs between risk appetite, capital, and return.",
            "Use simple models to compare mitigation strategies.",
            "Identify model limitations and governance controls.",
        ],
        "faculty_prompt": "Ask learners to identify the risk owner, the decision threshold, and the control that would trigger escalation.",
    },
    "quant": {
        "emoji": "💰",
        "title": "Quant Finance",
        "short": "Quant",
        "path": "courses/quant-finance.html",
        "description": "Derivatives, portfolio optimization, fixed income, VaR, Greeks, and supply-chain finance models for applied finance education.",
        "outcomes": [
            "Connect quantitative formulas to business decisions.",
            "Interpret option, portfolio, and fixed-income sensitivities.",
            "Use simulation to reason about uncertainty and convergence.",
            "Explain risk-return trade-offs in plain language.",
        ],
        "faculty_prompt": "Use a before/after discussion: what does the number mean for an investment, hedge, or funding decision?",
    },
    "cyber": {
        "emoji": "🔐",
        "title": "Cybersecurity",
        "short": "Cyber",
        "path": "courses/cybersecurity.html",
        "description": "IoT, network, threat-modeling, malware, vulnerability, and secure-code demos for responsible security learning.",
        "outcomes": [
            "Map threats to assets, controls, and evidence.",
            "Interpret security alerts without jumping to conclusions.",
            "Practice safe, lab-based vulnerability analysis.",
            "Explain security controls in business-risk terms.",
        ],
        "faculty_prompt": "Frame each activity as defender thinking: asset, threat, control, evidence, and response.",
    },
    "compliance": {
        "emoji": "📋",
        "title": "Compliance & Governance",
        "short": "Compliance",
        "path": "courses/compliance.html",
        "description": "AI governance, regulatory tracking, public-sector governance, alert triage, and AML pattern demos.",
        "outcomes": [
            "Translate regulatory expectations into operational controls.",
            "Prioritize alerts using risk, evidence, and escalation logic.",
            "Assess AI governance using scorecards and accountability roles.",
            "Connect compliance evidence to audit-ready documentation.",
        ],
        "faculty_prompt": "Ask students to produce a one-page control note: risk, evidence, owner, escalation, and residual risk.",
    },
    "rag_nlp": {
        "emoji": "📝",
        "title": "RAG & NLP",
        "short": "RAG/NLP",
        "path": "courses/rag-nlp.html",
        "description": "Retrieval-augmented generation, document QA, summarization, voice notes, and knowledge-assistant demos.",
        "outcomes": [
            "Explain retrieval, generation, and grounding in RAG systems.",
            "Evaluate answer quality using evidence and hallucination checks.",
            "Compare text, voice, graph, and page-index retrieval patterns.",
            "Design prompts and retrieval workflows for learning use cases.",
        ],
        "faculty_prompt": "Require learners to cite the retrieved evidence before accepting any generated answer.",
    },
    "banking": {
        "emoji": "🏦",
        "title": "Banking & Finance",
        "short": "Banking",
        "path": "courses/banking.html",
        "description": "Banking, credit, customer, fraud, and financial-services analytics demos for applied business education.",
        "outcomes": [
            "Interpret banking analytics in customer, credit, and fraud contexts.",
            "Explain model-based decisions with business constraints.",
            "Evaluate segmentation, prediction, and risk outputs responsibly.",
            "Connect analytics results to operational actions.",
        ],
        "faculty_prompt": "Use the demo result as the starting point for a customer, risk, or branch-manager decision discussion.",
    },
}

TREASURY_NAMES = {
    "TreasuryControlTower",
    "FXHedgeSimulator",
    "CCCAnalyzer",
    "CollectionsPredictor",
    "SmartContractTreasury",
    "StablecoinManager",
    "AIHedgeOrchestrator",
    "TreasuryTransformBlueprint",
}
RISK_NAMES = {
    "CounterpartyRiskDemo",
    "VaRCalculator",
    "RiskParityPortfolio",
    "QFDDemo",
    "ThreatHunter",
    "SIEMDashboard",
    "ContagionModel",
    "CounterPartyRisk",
    "AIRiskCalculator",
}
QUANT_NAMES = {
    "BondPricingDemo",
    "MonteCarloOptions",
    "OptionPricingDemo",
    "OptionsPricing",
    "PortfolioOptimizer",
    "npv-calculator",
    "efficient-frontier",
    "black-scholes",
    "BlackScholesOption",
    "SupplyChainFinance",
}
CYBER_NAMES = {
    "IoTAircraftNetwork",
    "IntrusionDetection",
    "ThreatModelingMatrix",
    "VulnScanner",
    "NetworkTrafficAnalyzer",
    "PenTestSimulator",
    "MalwareSandbox",
    "SecureCodeReview",
    "ZeroTrustDemo",
    "Embedded_Firmware_Exploit_Wokwi",
    "IoT_Ethernet_PenTest_v86",
}
COMPLIANCE_NAMES = {
    "AlertTriage001",
    "MuleAccountDetection",
    "AIGovernanceScorecard",
    "AIGovernancePublicSector",
    "AIRegulatoryTracker",
    "PublicPolicyGovernance",
}
RAG_NLP_NAMES = {
    "StandardRAG",
    "GraphRAG",
    "PageIndexRAG",
    "VoiceStandardRAG",
    "VoiceGraphRAG",
    "VoicePageIndexRAG",
    "AIContentSummarizer",
    "AISummarizer001",
    "VoiceNotesApp001",
    "UniversityKnowledgeAssistant",
    "LiteParseDemo",
}
BANKING_NAMES = {"LoanDefaultPredictor", "CreditScoringDemo", "FraudPlayground"}


@dataclass(frozen=True)
class DemoPage:
    folder: Path
    title: str
    description: str
    course_key: str
    level: str
    ai_mode: str
    duration: str
    demo_path: Path
    about_path: Path

    @property
    def demo_url(self) -> str:
        return repo_url(self.demo_path)

    @property
    def about_url(self) -> str:
        return repo_url(self.about_path)

    @property
    def course_url(self) -> str:
        return REPO_ROOT_URL + COURSES[self.course_key]["path"]

    @property
    def folder_name(self) -> str:
        return self.folder.name


def repo_url(path: Path) -> str:
    return REPO_ROOT_URL + path.as_posix()


def humanize(name: str) -> str:
    value = name.replace("_", " ").replace("-", " ")
    value = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", value)
    value = re.sub(r"AI([A-Z])", r"AI \1", value)
    value = re.sub(r"ML([A-Z])", r"ML \1", value)
    value = re.sub(r"RAG([A-Z])", r"RAG \1", value)
    value = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", value)
    value = re.sub(r"\s+", " ", value).strip()
    if value.lower().endswith(" demo") and len(value.split()) > 1:
        return value[:-5]
    return value


def title_from_html(content: str, fallback: str) -> str:
    match = re.search(r"<title>(.*?)</title>", content, re.I | re.S)
    if not match:
        return humanize(fallback)
    title = re.sub(r"\s+", " ", match.group(1)).strip()
    title = title.replace(" - KateelLearningDemos", "").replace(" — KateelLearningDemos", "")
    title = title.replace("KateelLearningDemos", "").split("|")[0].strip(" -—|")
    return humanize(title)


def description_from_html(content: str, title: str, course_key: str) -> str:
    match = re.search(r"<meta\s+name=[\"']description[\"']\s+content=[\"'](.*?)[\"']", content, re.I | re.S)
    if match:
        desc = re.sub(r"\s+", " ", match.group(1)).strip()
        lower = desc.lower()
        if desc and not lower.startswith(f"interactive demo for {title.lower()}") and not lower.startswith("interactive demo for "):
            return desc
    course_title = COURSES[course_key]["title"].lower()
    return f"About Demo learning guide for {title}: a browser-based {course_title} learning activity with no cloud or API keys required."


def infer_course(folder: Path) -> str:
    parts = set(folder.parts)
    name = folder.name
    rel = folder.as_posix()
    if name in TREASURY_NAMES or "Treasury" in rel:
        return "treasury"
    if "Compliance" in parts or name in COMPLIANCE_NAMES:
        return "compliance"
    if "QuantFinance" in parts or "WealthManagement" in parts or name in QUANT_NAMES:
        return "quant"
    if "RiskManagement" in parts or name in RISK_NAMES:
        return "risk"
    if "CyberSecurityDemos" in parts or name in CYBER_NAMES:
        return "cyber"
    if "Banking" in parts or name in BANKING_NAMES:
        return "banking"
    if "RAGSolutions" in parts or "RAG" in name or name in RAG_NLP_NAMES:
        return "rag_nlp"
    if "Browser-AI-Demos" in parts or "PM-Product-Demos" in parts:
        return "ai_ml"
    return "ai_ml"


def infer_level(name: str, course_key: str) -> str:
    lower = name.lower()
    if any(word in lower for word in ["var", "monte", "portfolio", "governance", "smart contract", "stablecoin", "malware", "pen"]):
        return "Advanced"
    if any(word in lower for word in ["rag", "ai", "risk", "fraud", "counterparty", "option", "greek", "forecast", "classifier", "cluster"]):
        return "Intermediate"
    if course_key in {"treasury", "banking"}:
        return "Beginner to Intermediate"
    return "All Levels"


def infer_ai_mode(folder: Path, course_key: str) -> str:
    rel = folder.as_posix()
    if "Browser-AI-Demos" in rel:
        return "Browser SLM / local AI"
    if course_key == "rag_nlp":
        return "Browser-first RAG"
    if course_key in {"treasury", "quant", "risk", "banking"}:
        return "Local analytics + optional AI toggle"
    return "No external API required"


def infer_duration(folder: Path) -> str:
    name = folder.name.lower()
    if any(word in name for word in ["rag", "university", "voice", "graph", "portfolio", "monte"]):
        return "35-45 min"
    if any(word in name for word in ["treasury", "hedge", "risk", "governance", "compliance"]):
        return "30-40 min"
    return "20-30 min"


def discover_demos() -> list[DemoPage]:
    demos: list[DemoPage] = []
    for root in DEMO_ROOTS:
        if not root.exists():
            continue
        for html_path in sorted(root.rglob("*.html")):
            if html_path.name not in {"index.html", "demo.html"}:
                continue
            if html_path.name == "index.html" and html_path.parent == root:
                continue
            folder = html_path.parent
            demo_path = folder / "demo.html" if (folder / "demo.html").exists() else folder / "index.html"
            title = title_from_html(demo_path.read_text(encoding="utf-8", errors="ignore") if demo_path.exists() else "", folder.name)
            course_key = infer_course(folder)
            demos.append(
                DemoPage(
                    folder=folder,
                    title=title,
                    description=description_from_html(
                        demo_path.read_text(encoding="utf-8", errors="ignore") if demo_path.exists() else "",
                        title,
                        course_key,
                    ),
                    course_key=course_key,
                    level=infer_level(folder.name, course_key),
                    ai_mode=infer_ai_mode(folder, course_key),
                    duration=infer_duration(folder),
                    demo_path=demo_path,
                    about_path=folder / "about.html",
                )
            )
    # De-duplicate by folder, preferring demo.html as the demo path.
    by_folder: dict[Path, DemoPage] = {}
    for demo in demos:
        existing = by_folder.get(demo.folder)
        if existing is None or demo.demo_path.name == "demo.html":
            by_folder[demo.folder] = demo
    return sorted(by_folder.values(), key=lambda d: (d.course_key, d.folder.as_posix()))


def course_dropdown(active: str | None = None) -> str:
    links = []
    for key in COURSE_ORDER:
        course = COURSES[key]
        active_class = " active" if key == active else ""
        links.append(
            f'<a class="dropdown-link{active_class}" href="{REPO_ROOT_URL}{course["path"]}">'
            f'<span>{course["emoji"]}</span>{course["short"]}</a>'
        )
    return f"""
<details class="nav-dropdown">
  <summary class="nav-link">Courses</summary>
  <div class="dropdown-content" role="menu">
    {''.join(links)}
  </div>
</details>
""".strip()


def common_nav(kind: str, course_key: str | None = None, demo: DemoPage | None = None) -> str:
    active_course = course_key or (demo.course_key if demo else None)
    brand = f'<a class="brand" href="{REPO_ROOT_URL}">KateelLearningDemos</a>'
    landing = f'<a class="nav-link" href="{REPO_ROOT_URL}">Landing</a>'
    github = f'<a class="nav-link" href="{GITHUB_URL}" target="_blank" rel="noopener">GitHub</a>'
    courses = course_dropdown(active_course)

    if kind == "landing":
        links = f"{landing}{courses}{github}"
    elif kind == "course":
        links = f"{landing}{courses}{github}"
    elif demo:
        about = f'<a class="nav-link" href="{demo.about_url}">About Demo</a>'
        course = f'<a class="nav-link" href="{demo.course_url}">{COURSES[demo.course_key]["short"]}</a>'
        launch = f'<a class="nav-link nav-cta" href="{demo.demo_url}">Launch Demo</a>'
        links = f"{landing}{courses}{about}{course}{github}{launch}"
    else:
        links = f"{landing}{courses}{github}"

    links = links.replace("</a><a", "</a>\n      <a").replace("</details><a", "</details>\n      <a").replace("</a><details", "</a>\n      <details")

    return f"""
<nav class="site-nav" aria-label="Main navigation">
  <div class="nav-inner">
    {brand}
    <div class="nav-links">
      {links}
    </div>
  </div>
</nav>
""".strip()


def ensure_assets(content: str) -> str:
    css = f'  <link rel="stylesheet" href="{REPO_ROOT_URL}assets/site.css">\n'
    js = f'  <script defer src="{REPO_ROOT_URL}assets/site.js"></script>\n'
    if css not in content and "</head>" in content:
        content = content.replace("</head>", css + "</head>", 1)
    if js not in content and "</head>" in content:
        content = content.replace("</head>", js + "</head>", 1)
    return content


def replace_nav(content: str, nav: str) -> str:
    content = re.sub(r"\s*<nav[\s\S]*?</nav>", "\n" + nav, content, count=1)
    content = re.sub(r"\s*<div class=\"header\">[\s\S]*?<div class=\"container\">", "\n" + nav + "\n\n  <div class=\"container\">", content, count=1)
    if "<nav" not in content and "<body>" in content:
        content = content.replace("<body>", "<body>\n" + nav, 1)
    return content


def add_demo_context_strip(content: str, demo: DemoPage) -> str:
    if "demo-context-strip" in content:
        return content
    strip = f'''
  <div class="demo-context-strip" role="note">
    <strong>About vs. Demo:</strong> You are on the interactive demo. Use the <a href="{demo.about_url}">About Demo</a> page for learning objectives, theory, usage steps, and assessment prompts.
  </div>
'''
    return content.replace("<div class=\"container\">", strip + "  <div class=\"container\">", 1)


def update_actual_demo_page(path: Path, demo: DemoPage) -> None:
    content = path.read_text(encoding="utf-8", errors="ignore")
    original = content
    content = ensure_assets(content)
    content = replace_nav(content, common_nav("demo", demo=demo))
    if not (path.parent / "README.md").exists():
        content = content.replace('href="README.md"', f'href="{repo_url(Path("DEMO_INDEX.md"))}"')
        content = content.replace("Read the README.md", "Read the full demo index")
    content = add_demo_context_strip(content, demo)
    if content != original:
        path.write_text(content, encoding="utf-8")


def rating_widget(demo: DemoPage) -> str:
    demo_id = demo.folder.as_posix().replace("/", "_").replace(" ", "_")
    return f'''
<div class="demo-rating" data-demo-id="{escape(demo_id)}" data-demo-title="{escape(demo.title)}" aria-label="Rate this demo">
  <div class="rating-title">Rate this About Demo page</div>
  <div class="rating-stars" role="radiogroup" aria-label="Star rating">
    <span role="radio" aria-label="1 star" data-value="1">★</span>
    <span role="radio" aria-label="2 stars" data-value="2">★</span>
    <span role="radio" aria-label="3 stars" data-value="3">★</span>
    <span role="radio" aria-label="4 stars" data-value="4">★</span>
    <span role="radio" aria-label="5 stars" data-value="5">★</span>
  </div>
  <div class="rating-info"><span class="average">0.0</span> <span class="count">(0 ratings)</span></div>
  <p class="rating-help">Local to this browser. Ratings help faculty see which demos students find most useful.</p>
</div>
'''


def render_about_page(demo: DemoPage) -> str:
    course = COURSES[demo.course_key]
    readme_exists = (demo.folder / "README.md").exists()
    readme_link = f'<a class="btn btn-secondary" href="{repo_url(demo.folder / "README.md")}">View README</a>' if readme_exists else ""
    outcomes = [
        f"Understand the core {course['title'].lower()} concept behind {demo.title}.",
        "Identify the decision, data input, and output that matter in the activity.",
        "Compare a baseline result with an AI-assisted or scenario-adjusted result.",
        "Explain one limitation or governance consideration before using the output.",
    ]
    concepts = {
        "treasury": ["Liquidity forecasting", "Scenario planning", "Working-capital trade-offs", "Treasury governance"],
        "ai_ml": ["AI workflow design", "Model-assisted decisions", "Human oversight", "Prompt and output evaluation"],
        "risk": ["Risk appetite", "Scenario analysis", "Model limitations", "Escalation thresholds"],
        "quant": ["Risk-return trade-off", "Sensitivity analysis", "Simulation", "Valuation logic"],
        "cyber": ["Threat modeling", "Evidence-based triage", "Defensive controls", "Responsible lab practice"],
        "compliance": ["Control design", "Regulatory evidence", "Alert prioritization", "AI accountability"],
        "rag_nlp": ["Retrieval", "Grounding", "Summarization", "Hallucination checks"],
        "banking": ["Credit analytics", "Customer segmentation", "Fraud signals", "Operational action"],
    }.get(demo.course_key, ["Decision support", "Scenario analysis", "Human oversight", "Evidence-based action"])
    steps = [
        "Read this About Demo page first and note the learning objective.",
        "Launch the actual demo and change at least two inputs or scenarios.",
        "Toggle AI support on/off where available and compare what changed.",
        "Record one insight, one limitation, and one follow-up question.",
    ]
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(demo.title)} - About Demo - KateelLearningDemos</title>
  <meta name="description" content="{escape(demo.description)}">
  <meta property="og:title" content="{escape(demo.title)} - About Demo - KateelLearningDemos">
  <meta property="og:description" content="{escape(demo.description)}">
  <meta property="og:type" content="website">
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>
  <link rel="stylesheet" href="{REPO_ROOT_URL}assets/site.css">
  <script defer src="{REPO_ROOT_URL}assets/site.js"></script>
</head>
<body>
{common_nav("about", demo=demo)}
  <main class="container">
    <section class="site-hero page-hero">
      <p class="hero-eyebrow">{course['emoji']} {course['title']} • {escape(demo.level)} • {escape(demo.duration)}</p>
      <h1>{escape(demo.title)}</h1>
      <p class="hero-subtitle">{escape(demo.description)}</p>
      <div class="pill-row" aria-label="Demo attributes">
        <span class="pill">About Demo</span>
        <span class="pill">{escape(demo.ai_mode)}</span>
        <span class="pill">No API keys</span>
        <span class="pill">Attribution: {ATTRIBUTION_EMAIL}</span>
      </div>
      <div class="cta-buttons">
        <a class="btn btn-primary launch-demo" href="{demo.demo_url}">▶ Launch actual demo</a>
        <a class="btn btn-secondary" href="{demo.course_url}">View course path</a>
        {readme_link}
      </div>
    </section>

    <section class="learning-path" aria-label="How to use this demo">
      <div>
        <strong>1. About Demo</strong>
        <p>Read the learning goal, concepts, and usage steps on this page.</p>
      </div>
      <div>
        <strong>2. Launch Demo</strong>
        <p>Open the interactive app separately and experiment with inputs or scenarios.</p>
      </div>
      <div>
        <strong>3. Reflect</strong>
        <p>Record one insight, one limitation, and one action recommendation.</p>
      </div>
    </section>

    <section class="section" id="learning">
      <div class="section-header">
        <p class="section-kicker">Learning design</p>
        <h2>What students should learn</h2>
        <p>This page is the teaching guide; the linked demo is the hands-on practice environment.</p>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <h3>Learning outcomes</h3>
          <ul>
            {''.join(f'<li>{escape(item)}</li>' for item in outcomes)}
          </ul>
        </article>
        <article class="info-card">
          <h3>Concepts covered</h3>
          <div class="feature-grid">
            {''.join(f'<div class="feature"><span>●</span>{escape(item)}</div>' for item in concepts)}
          </div>
        </article>
      </div>
    </section>

    <section class="section" id="usage">
      <div class="section-header">
        <p class="section-kicker">Classroom flow</p>
        <h2>Suggested 20-minute activity</h2>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <h3>Before the demo</h3>
          <ol>
            <li>Ask students what decision the demo is supporting.</li>
            <li>Predict what will happen when one input changes.</li>
            <li>Clarify that AI output is support, not final authority.</li>
          </ol>
        </article>
        <article class="info-card">
          <h3>During the demo</h3>
          <ol>
            {''.join(f'<li>{escape(step)}</li>' for step in steps[1:])}
          </ol>
        </article>
        <article class="info-card">
          <h3>After the demo</h3>
          <ul>
            <li>Share one screenshot or exported result.</li>
            <li>Explain the decision logic in plain language.</li>
            <li>Rate this About Demo page to help improve the catalog.</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section" id="faculty">
      <div class="section-header">
        <p class="section-kicker">Faculty guide</p>
        <h2>Prompt for discussion or assessment</h2>
      </div>
      <div class="info-card highlight-card">
        <p>{escape(course['faculty_prompt'])}</p>
      </div>
    </section>

    <section class="section" id="rate">
      <div class="section-header">
        <p class="section-kicker">Feedback</p>
        <h2>Help make this resource better</h2>
      </div>
      {rating_widget(demo)}
    </section>

    <section class="section attribution-card" id="attribution">
      <h2>Attribution & reuse</h2>
      <p>Created by <strong>Professor Vinaya Sathyanarayana</strong> as part of <a href="{GITHUB_URL}">KateelLearningDemosToStudents</a>. Please retain attribution and notify usage at <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a>.</p>
    </section>
  </main>
  <footer class="site-footer">
    <p><a href="{REPO_ROOT_URL}">KateelLearningDemos</a> • <a href="{demo.course_url}">{course['title']}</a> • Attribution: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a></p>
  </footer>
</body>
</html>
'''


def render_course_page(key: str, demos: list[DemoPage]) -> str:
    course = COURSES[key]
    demo_cards = []
    for demo in demos:
        demo_cards.append(f'''
<a class="demo-card" href="{demo.about_url}">
  <div class="demo-card-top">
    <h3>{escape(demo.title)}</h3>
    <span class="level-badge">{escape(demo.level)}</span>
  </div>
  <p>{escape(demo.description)}</p>
  <div class="demo-meta">
    <span>{escape(demo.duration)}</span>
    <span>{escape(demo.ai_mode)}</span>
  </div>
  <div class="demo-actions">
    <span class="btn-mini">Read About Demo</span>
    <a class="btn-mini outline launch-demo" href="{demo.demo_url}">Launch Demo</a>
  </div>
</a>
''')
    if not demo_cards:
        demo_cards.append('<p class="empty-state">No browser demo pages are registered for this course yet.</p>')

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{course['title']} - KateelLearningDemos</title>
  <meta name="description" content="{escape(course['description'])}">
  <meta property="og:title" content="{course['title']} - KateelLearningDemos">
  <meta property="og:description" content="{escape(course['description'])}">
  <meta property="og:type" content="website">
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>
  <link rel="stylesheet" href="{REPO_ROOT_URL}assets/site.css">
  <script defer src="{REPO_ROOT_URL}assets/site.js"></script>
</head>
<body>
{common_nav("course", course_key=key)}
  <main class="container">
    <section class="site-hero page-hero">
      <p class="hero-eyebrow">{course['emoji']} Course path</p>
      <h1>{course['title']}</h1>
      <p class="hero-subtitle">{escape(course['description'])}</p>
      <div class="cta-buttons">
        <a class="btn btn-primary" href="#demos">Browse demos</a>
        <a class="btn btn-secondary" href="{REPO_ROOT_URL}">Return to landing</a>
      </div>
    </section>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">{len(demos)}</div><div class="stat-label">Registered demos</div></div>
      <div class="stat-card"><div class="stat-value">100%</div><div class="stat-label">Browser-first</div></div>
      <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">API keys required</div></div>
      <div class="stat-card"><div class="stat-value">3</div><div class="stat-label">Step learning path</div></div>
    </div>

    <section class="section" id="start">
      <div class="section-header">
        <p class="section-kicker">How to teach with this course</p>
        <h2>About Demo first, actual demo second</h2>
        <p>Every demo card opens the About Demo page. From there, students can launch the interactive app when they are ready to practice.</p>
      </div>
      <div class="learning-path">
        <div><strong>1 Read</strong><p>Understand the objective, concepts, and expected output.</p></div>
        <div><strong>2 Practice</strong><p>Launch the actual demo and change inputs or scenarios.</p></div>
        <div><strong>3 Reflect</strong><p>Explain the insight, limitation, and next action.</p></div>
      </div>
    </section>

    <section class="section" id="outcomes">
      <div class="section-header">
        <p class="section-kicker">Learning outcomes</p>
        <h2>What this course builds</h2>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <h3>Core outcomes</h3>
          <ul>
            {''.join(f'<li>{escape(item)}</li>' for item in course['outcomes'])}
          </ul>
        </article>
        <article class="info-card highlight-card">
          <h3>Faculty prompt</h3>
          <p>{escape(course['faculty_prompt'])}</p>
        </article>
      </div>
    </section>

    <section class="section" id="demos">
      <div class="section-header">
        <p class="section-kicker">Demo catalog</p>
        <h2>Demos in this course</h2>
        <p>Open an About Demo page for context, then launch the actual interactive demo.</p>
      </div>
      <div class="demo-grid">
        {''.join(demo_cards)}
      </div>
    </section>

    <section class="section attribution-card" id="attribution">
      <h2>Attribution</h2>
      <p>Created by <strong>Professor Vinaya Sathyanarayana</strong>. Attribution email: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a>. Please notify usage and retain attribution in course materials.</p>
    </section>
  </main>
  <footer class="site-footer">
    <p><a href="{REPO_ROOT_URL}">KateelLearningDemos</a> • {course['title']} • Attribution: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a></p>
  </footer>
</body>
</html>
'''


def render_index(demos: list[DemoPage]) -> str:
    course_cards = []
    for key in COURSE_ORDER:
        course = COURSES[key]
        count = sum(1 for demo in demos if demo.course_key == key)
        course_cards.append(f'''
<a class="course-card" href="{REPO_ROOT_URL}{course['path']}">
  <div class="course-card-top"><h3>{course['emoji']} {course['title']}</h3><span>{count} demos</span></div>
  <p>{escape(course['description'])}</p>
  <div class="course-meta"><span>About-first navigation</span><span>Browser-based</span></div>
</a>
''')

    featured = [d for d in demos if d.course_key in {"treasury", "ai_ml", "rag_nlp", "quant"}][:12]
    featured_cards = []
    for demo in featured:
        featured_cards.append(f'''
<a class="demo-card featured-demo" href="{demo.about_url}">
  <div class="demo-card-top"><h3>{escape(demo.title)}</h3><span class="level-badge">{escape(demo.level)}</span></div>
  <p>{escape(demo.description)}</p>
  <div class="demo-actions"><span class="btn-mini">About Demo</span><a class="btn-mini outline launch-demo" href="{demo.demo_url}">Launch</a></div>
</a>
''')

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>KateelLearningDemos - About-first AI/ML Learning Platform</title>
  <meta name="description" content="A highly usable GitHub Pages learning platform for browser-based AI/ML demos. Start with About Demo pages, then launch actual interactive demos.">
  <meta property="og:title" content="KateelLearningDemos - About-first AI/ML Learning Platform">
  <meta property="og:description" content="Start with About Demo pages, then launch actual interactive demos. No cloud or API keys required.">
  <meta property="og:type" content="website">
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>
  <link rel="stylesheet" href="{REPO_ROOT_URL}assets/site.css">
  <script defer src="{REPO_ROOT_URL}assets/site.js"></script>
</head>
<body>
{common_nav("landing")}
  <main class="container">
    <section class="site-hero landing-hero">
      <p class="hero-eyebrow">Browser-based AI/ML demos for students, faculty & practitioners</p>
      <h1>Kateel Learning Demos</h1>
      <p class="hero-subtitle">A cleaner, about-first GitHub Pages experience: read the learning guide, launch the interactive demo, then reflect on the result. Zero cloud setup. Zero API keys. Built for classroom use.</p>
      <div class="pill-row">
        <span class="pill">94+ demos</span>
        <span class="pill">8 course paths</span>
        <span class="pill">No API keys</span>
        <span class="pill">Attribution: {ATTRIBUTION_EMAIL}</span>
      </div>
      <div class="cta-buttons">
        <a class="btn btn-primary" href="#courses">Explore courses</a>
        <a class="btn btn-secondary" href="{REPO_ROOT_URL}DEMO_INDEX.md">Full demo index</a>
        <a class="btn btn-soft" href="{GITHUB_URL}" target="_blank" rel="noopener">Star on GitHub</a>
      </div>
    </section>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">94+</div><div class="stat-label">Interactive demos</div></div>
      <div class="stat-card"><div class="stat-value">8</div><div class="stat-label">Course paths</div></div>
      <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">API keys required</div></div>
      <div class="stat-card"><div class="stat-value">3</div><div class="stat-label">Step learning flow</div></div>
    </div>

    <section class="section" id="flow">
      <div class="section-header">
        <p class="section-kicker">New navigation model</p>
        <h2>About Demo is separate from the actual demo</h2>
        <p>This distinction helps students understand the concept before experimenting and helps faculty assign consistent reflection work.</p>
      </div>
      <div class="learning-path">
        <div><strong>1 About Demo</strong><p>Learning objectives, concepts, usage steps, faculty prompts, and rating.</p></div>
        <div><strong>2 Launch Demo</strong><p>Open the actual interactive app in a clean environment.</p></div>
        <div><strong>3 Reflect</strong><p>Explain insight, limitation, and action recommendation.</p></div>
      </div>
    </section>

    <section class="section" id="courses">
      <div class="section-header">
        <p class="section-kicker">Course catalog</p>
        <h2>Start by learning domain</h2>
        <p>Each course page uses the same About Demo → Launch Demo flow.</p>
      </div>
      <div class="course-grid">
        {''.join(course_cards)}
      </div>
    </section>

    <section class="section" id="featured">
      <div class="section-header">
        <p class="section-kicker">Featured starting points</p>
        <h2>High-value demos for first use</h2>
        <p>Use these when introducing the platform to a new class, workshop, or faculty cohort.</p>
      </div>
      <div class="demo-grid">
        {''.join(featured_cards)}
      </div>
    </section>

    <section class="section" id="faculty">
      <div class="section-header">
        <p class="section-kicker">Faculty quick start</p>
        <h2>Make the demos highly used in class</h2>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <h3>Before class</h3>
          <ol><li>Pick one course path.</li><li>Select 2-3 demos aligned to the session outcome.</li><li>Open the About Demo pages and copy the faculty prompt.</li></ol>
        </article>
        <article class="info-card">
          <h3>During class</h3>
          <ol><li>Read the objective together.</li><li>Launch the actual demo.</li><li>Ask students to toggle AI or change a scenario.</li></ol>
        </article>
        <article class="info-card">
          <h3>After class</h3>
          <ol><li>Collect one insight and one limitation.</li><li>Ask students to rate the About Demo page.</li><li>Notify usage to {ATTRIBUTION_EMAIL}.</li></ol>
        </article>
      </div>
    </section>

    <section class="section attribution-card" id="attribution">
      <h2>Attribution & impact tracking</h2>
      <p>Created by <strong>Professor Vinaya Sathyanarayana</strong>. Attribution email: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a>. Google Analytics is enabled for Pages usage tracking; localStorage ratings stay local to each browser.</p>
    </section>
  </main>
  <footer class="site-footer">
    <p><a href="{REPO_ROOT_URL}">KateelLearningDemos</a> • Attribution: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a> • <a href="{GITHUB_URL}">GitHub repository</a></p>
  </footer>
</body>
</html>
'''


def render_demo_index_md(demos: list[DemoPage]) -> str:
    lines = [
        "# KateelLearningDemos - Full Demo Index",
        "",
        "**Attribution:** vinallcontact@gmail.com",
        "",
        "## Navigation model",
        "",
        "- **About Demo** pages explain the learning objective, concepts, usage steps, faculty prompt, and rating widget.",
        "- **Launch Demo** links open the actual interactive app separately.",
        "- Course pages use the same About Demo → Launch Demo flow.",
        "",
    ]
    for key in COURSE_ORDER:
        course = COURSES[key]
        course_demos = [d for d in demos if d.course_key == key]
        lines.extend([
            f"## {course['emoji']} {course['title']} ({len(course_demos)} demos)",
            "",
            course["description"],
            "",
            "| Demo | About Demo | Launch Demo | Level |",
            "|------|------------|-------------|-------|",
        ])
        for demo in course_demos:
            lines.append(
                f"| {demo.title} | [About Demo]({demo.about_url}) | [Launch Demo]({demo.demo_url}) | {demo.level} |"
            )
        lines.append("")
    lines.extend([
        "## Getting started",
        "",
        "1. Start at the [Landing Page](/KateelLearningDemosToStudents/).",
        "2. Open an About Demo page before launching the actual demo.",
        "3. Toggle AI or change scenarios where available.",
        "4. Record one insight, one limitation, and one action recommendation.",
        "5. Rate the About Demo page to help improve the catalog.",
        "",
        "## Attribution",
        "",
        "Created by **Professor Vinaya Sathyanarayana**. Attribution: vinallcontact@gmail.com.",
        "",
    ])
    return "\n".join(lines)


def render_courses_readme() -> str:
    rows = []
    for key in COURSE_ORDER:
        course = COURSES[key]
        rows.append(f"- [{course['emoji']} {course['title']}]({course['path']}) — {course['description']}")
    return "\n".join([
        "# KateelLearningDemos Courses",
        "",
        "This directory contains course-specific GitHub Pages that use a consistent About Demo → Launch Demo flow.",
        "",
        "## Available course pages",
        "",
        *rows,
        "",
        "## How to use",
        "",
        "1. Start at the [Landing Page](/KateelLearningDemosToStudents/).",
        "2. Open a course page and read the learning outcomes.",
        "3. Open an About Demo page for context, theory, and faculty prompts.",
        "4. Launch the actual demo only when students are ready to practice.",
        "5. Ask students to rate the About Demo page and submit one reflection.",
        "",
        "## Attribution",
        "",
        "**Professor Vinaya Sathyanarayana**  ",
        "Attribution Email: vinallcontact@gmail.com  ",
        "Three-tier AI Philosophy: Browser SLMs → Backend SLMs → External APIs",
        "",
    ])


def write_assets() -> None:
    Path("assets").mkdir(exist_ok=True)
    Path("assets/site.css").write_text(r'''/* KateelLearningDemos shared GitHub Pages styles */
:root {
  --bg-0: #070816;
  --bg-1: #0f172a;
  --bg-2: #111827;
  --card: rgba(255, 255, 255, 0.065);
  --card-strong: rgba(255, 255, 255, 0.095);
  --border: rgba(255, 255, 255, 0.12);
  --text: #e5e7eb;
  --muted: #9ca3af;
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --accent: #ec4899;
  --gold: #fbbf24;
  --success: #4ade80;
  --danger: #fb7185;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  --radius: 22px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 15% 0%, rgba(59, 130, 246, 0.22), transparent 34rem),
    radial-gradient(circle at 85% 10%, rgba(236, 72, 153, 0.18), transparent 30rem),
    linear-gradient(135deg, var(--bg-0), var(--bg-1) 48%, #17102b);
  line-height: 1.65;
}

a { color: inherit; }
a:hover { color: #fff; }
code { color: #bfdbfe; background: rgba(59, 130, 246, 0.16); padding: 0.12rem 0.35rem; border-radius: 0.4rem; }

.container {
  width: min(1400px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 0 0 4rem;
}

.site-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(7, 8, 22, 0.78);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(18px);
}

.nav-inner {
  width: min(1400px, calc(100% - 2rem));
  margin: 0 auto;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  font-weight: 900;
  letter-spacing: -0.03em;
  background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.nav-link,
.dropdown-content a {
  color: var(--muted);
  text-decoration: none;
  border-radius: 999px;
  padding: 0.55rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.nav-link:hover,
.nav-link.active,
.dropdown-content a:hover,
.dropdown-content a.active {
  color: #fff;
  background: rgba(59, 130, 246, 0.16);
}

.nav-cta {
  color: #fff !important;
  background: linear-gradient(135deg, var(--primary), var(--secondary)) !important;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.28);
}

.nav-dropdown { position: relative; }
.nav-dropdown summary {
  list-style: none;
  cursor: pointer;
}
.nav-dropdown summary::-webkit-details-marker { display: none; }
.dropdown-content {
  position: absolute;
  right: 0;
  top: calc(100% + 0.65rem);
  min-width: 220px;
  padding: 0.55rem;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.site-hero {
  position: relative;
  text-align: center;
  padding: clamp(3rem, 7vw, 6.5rem) 0 3rem;
  overflow: hidden;
}

.site-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.2), transparent 65%);
}

.hero-eyebrow,
.section-kicker {
  color: #93c5fd;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 900;
  font-size: 0.78rem;
  margin: 0 0 0.75rem;
}

.site-hero h1 {
  margin: 0;
  font-size: clamp(2.35rem, 7vw, 5.8rem);
  line-height: 0.95;
  letter-spacing: -0.07em;
  background: linear-gradient(90deg, #fff, #93c5fd 35%, #c4b5fd 65%, #f9a8d4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  max-width: 920px;
  margin: 1.25rem auto 0;
  color: var(--muted);
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
}

.pill-row,
.cta-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.pill,
.level-badge,
.btn-mini {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.06);
  color: #dbeafe;
  border-radius: 999px;
  padding: 0.42rem 0.72rem;
  font-size: 0.82rem;
  font-weight: 800;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.9rem 1.35rem;
  font-weight: 900;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn:hover { transform: translateY(-2px); }
.btn-primary {
  color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 18px 45px rgba(59, 130, 246, 0.32);
}
.btn-secondary,
.btn-soft {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border);
}
.btn-soft { color: #bfdbfe; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin: 2rem 0 4rem;
}

.stat-card,
.info-card,
.demo-card,
.course-card,
.attribution-card {
  border: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.035));
  border-radius: var(--radius);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.22);
}

.stat-card {
  text-align: center;
  padding: 1.35rem;
}

.stat-value {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 950;
  letter-spacing: -0.04em;
  background: linear-gradient(90deg, #60a5fa, #f9a8d4);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label { color: var(--muted); font-weight: 700; }

.section {
  margin: 4.5rem 0;
  scroll-margin-top: 90px;
}

.section-header {
  text-align: center;
  max-width: 850px;
  margin: 0 auto 2rem;
}

.section-header h2 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  letter-spacing: -0.04em;
}

.section-header p:not(.section-kicker) { color: var(--muted); }

.course-grid,
.card-grid,
.demo-grid {
  display: grid;
  gap: 1.2rem;
}

.course-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.demo-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }

.course-card,
.demo-card {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 1.35rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.course-card:hover,
.demo-card:hover {
  transform: translateY(-6px);
  border-color: rgba(96, 165, 250, 0.45);
  box-shadow: 0 24px 70px rgba(59, 130, 246, 0.22);
}

.course-card-top,
.demo-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.course-card h3,
.demo-card h3,
.info-card h3 {
  margin: 0 0 0.55rem;
  color: #fff;
  letter-spacing: -0.02em;
}

.course-card p,
.demo-card p,
.info-card p,
.info-card li,
.attribution-card p {
  color: var(--muted);
}

.course-meta,
.demo-meta,
.demo-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1rem;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 700;
}

.btn-mini { text-decoration: none; }
.btn-mini.outline { color: #bfdbfe; border-color: rgba(96, 165, 250, 0.35); }

.learning-path {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.learning-path > div {
  padding: 1.2rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.055);
}

.learning-path strong {
  display: block;
  color: #fff;
  margin-bottom: 0.35rem;
}

.learning-path p { margin: 0; color: var(--muted); }

.info-card { padding: 1.4rem; }
.info-card ul,
.info-card ol { margin: 0.75rem 0 0 1.25rem; padding: 0; }
.highlight-card {
  border-color: rgba(251, 191, 36, 0.35);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(255, 255, 255, 0.04));
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.feature {
  padding: 0.8rem;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.1);
  color: #dbeafe;
  font-weight: 750;
}

.feature span { color: var(--gold); }

.demo-context-strip {
  margin: 1rem 0 0;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(96, 165, 250, 0.35);
  border-radius: 16px;
  background: rgba(59, 130, 246, 0.1);
  color: #dbeafe;
}

.demo-rating {
  max-width: 620px;
  margin: 0 auto;
  padding: 1.4rem;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.06);
}

.rating-title { font-weight: 900; color: #fff; margin-bottom: 0.5rem; }
.rating-stars { font-size: 2rem; letter-spacing: 0.1rem; cursor: pointer; user-select: none; }
.rating-stars span {
  color: rgba(148, 163, 184, 0.55);
  transition: transform 0.15s ease, color 0.15s ease;
}
.rating-stars span:hover,
.rating-stars span.active {
  color: var(--gold);
  transform: scale(1.18);
}
.rating-info { color: var(--muted); margin-top: 0.5rem; }
.rating-info .average { color: var(--gold); font-weight: 900; }
.rating-help { color: var(--muted); font-size: 0.9rem; margin: 0.7rem 0 0; }

.attribution-card {
  padding: 1.5rem;
  text-align: center;
}

.site-footer {
  border-top: 1px solid var(--border);
  padding: 2rem 1rem 3rem;
  text-align: center;
  color: var(--muted);
}

.site-footer a { color: #93c5fd; text-decoration: none; font-weight: 800; }

.empty-state {
  grid-column: 1 / -1;
  padding: 2rem;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}

@media (max-width: 1050px) {
  .course-grid,
  .card-grid,
  .demo-grid,
  .stats-grid,
  .learning-path {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .nav-inner { align-items: flex-start; flex-direction: column; padding: 0.8rem 0; }
  .nav-links { justify-content: flex-start; }
}

@media (max-width: 680px) {
  .container,
  .nav-inner { width: min(100% - 1rem, 1400px); }
  .course-grid,
  .card-grid,
  .demo-grid,
  .stats-grid,
  .learning-path,
  .feature-grid { grid-template-columns: 1fr; }
  .site-hero h1 { letter-spacing: -0.05em; }
  .dropdown-content { left: 0; right: auto; }
}
''', encoding="utf-8")
    Path("assets/site.js").write_text(r'''/* KateelLearningDemos shared navigation, rating, and usage tracking */
(function () {
  const REPO_ROOT = "/KateelLearningDemosToStudents/";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    const path = window.location.pathname.replace(/\/$/, "");
    document.querySelectorAll(".nav-link, .dropdown-content a").forEach(function (link) {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("http") && path.endsWith(href.replace(/\/$/, ""))) {
        link.classList.add("active");
      }
    });

    document.querySelectorAll(".launch-demo").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.gtag) {
          window.gtag("event", "launch_demo", {
            event_category: "demo_navigation",
            event_label: link.href,
            transport_type: "beacon"
          });
        }
      });
    });

    document.querySelectorAll(".demo-rating").forEach(function (widget) {
      const demoId = widget.getAttribute("data-demo-id") || "unknown_demo";
      const key = "kld_rating_" + demoId;
      const stars = Array.from(widget.querySelectorAll(".rating-stars span"));
      const averageEl = widget.querySelector(".average");
      const countEl = widget.querySelector(".count");
      const stored = Number(localStorage.getItem(key) || 0);
      const counts = JSON.parse(localStorage.getItem("kld_rating_counts") || "{}");
      const count = Number(counts[demoId] || 0);

      function render(value) {
        stars.forEach(function (star, index) {
          const active = index < value;
          star.classList.toggle("active", active);
          star.setAttribute("aria-checked", String(active));
        });
        if (averageEl) averageEl.textContent = value ? value.toFixed(1) : "0.0";
        if (countEl) countEl.textContent = "(" + count + " " + (count === 1 ? "rating" : "ratings") + ")";
      }

      stars.forEach(function (star) {
        star.setAttribute("tabindex", "0");
        star.addEventListener("click", submitRating);
        star.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            submitRating.call(star);
          }
        });
        star.addEventListener("mouseenter", function () {
          const value = Number(star.getAttribute("data-value"));
          stars.forEach(function (item, index) {
            item.classList.toggle("active", index < value);
          });
        });
        star.addEventListener("mouseleave", function () {
          render(stored);
        });
      });

      function submitRating() {
        const value = Number(this.getAttribute("data-value"));
        localStorage.setItem(key, String(value));
        counts[demoId] = count + 1;
        localStorage.setItem("kld_rating_counts", JSON.stringify(counts));
        render(value);
        let thanks = widget.querySelector(".rating-thanks");
        if (!thanks) {
          thanks = document.createElement("p");
          thanks.className = "rating-thanks";
          thanks.style.color = "#4ade80";
          thanks.style.marginTop = "0.75rem";
          thanks.style.fontWeight = "800";
          widget.appendChild(thanks);
        }
        thanks.textContent = "Thank you — your local rating was saved.";
        setTimeout(function () {
          if (thanks) thanks.textContent = "";
        }, 2200);
      }

      render(stored);
    });
  });
})();
''', encoding="utf-8")


def main() -> None:
    demos = discover_demos()
    write_assets()
    updated_pages = 0

    for demo in demos:
        demo.about_path.write_text(render_about_page(demo), encoding="utf-8")
        for candidate in sorted({demo.demo_path, demo.folder / "index.html"}):
            if candidate.exists():
                update_actual_demo_page(candidate, demo)
                updated_pages += 1

    for key in COURSE_ORDER:
        course_demos = [demo for demo in demos if demo.course_key == key]
        Path(COURSES[key]["path"]).write_text(render_course_page(key, course_demos), encoding="utf-8")

    Path("index.html").write_text(render_index(demos), encoding="utf-8")
    Path("DEMO_INDEX.md").write_text(render_demo_index_md(demos), encoding="utf-8")
    Path("courses/README.md").write_text(render_courses_readme(), encoding="utf-8")

    print(f"Generated/updated {len(demos)} About Demo pages")
    print(f"Updated {updated_pages} actual/demo-guide pages")
    print("Updated landing page, course pages, demo index, and course README")


if __name__ == "__main__":
    main()
