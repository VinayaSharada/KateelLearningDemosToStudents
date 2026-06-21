#!/usr/bin/env python3
"""Improve GitHub Pages navigation and About Demo separation for KateelLearningDemos."""
from __future__ import annotations

from dataclasses import dataclass
from html import escape
import json
from pathlib import Path
import posixpath
import re
from urllib.parse import quote, unquote, urlsplit

REPO_NAME = "KateelLearningDemosToStudents"
REPO_ROOT_URL = f"/{REPO_NAME}/"
GITHUB_URL = "https://github.com/VinayaSharada/KateelLearningDemosToStudents"
SITE_URL = "https://vinayasharada.github.io/KateelLearningDemosToStudents/"
SITE_NAME = "KateelLearningDemos"
DEFAULT_OG_IMAGE = "assets/seo-preview.svg"
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
MULTI_COURSE_DEMOS = {
    "TechUseCaseDemos/MonteCarloCompanyValuation": ["treasury", "ai_ml"],
}


TEACHER_GUIDES = {
    "TechUseCaseDemos/ABTestingFramework": (
        "Look for the control group, variant group, and the metric being compared.",
        "Observe how sample size and effect size change the confidence of the conclusion.",
        "Note that a visible lift is not enough; students should ask whether the result is statistically reliable."
    ),
    "TechUseCaseDemos/AICostBenefitAnalyzer": (
        "Look for the cost categories, benefit drivers, and AI adoption assumptions.",
        "Observe how the payback period changes when benefits are delayed or implementation costs rise.",
        "Note that AI business cases should separate measurable savings from strategic option value."
    ),
    "TechUseCaseDemos/AIDataAnalyzer": (
        "Look for the dataset fields, missing values, and the question the analysis is trying to answer.",
        "Observe which charts or summaries change the interpretation of the data.",
        "Note that students should state the decision supported by the analysis, not just describe the chart."
    ),
    "TechUseCaseDemos/AIDecisionTracker": (
        "Look for the decision record, owner, evidence, and follow-up status.",
        "Observe how adding assumptions or review dates improves accountability.",
        "Note that AI-supported decisions need an audit trail for trust and governance."
    ),
    "TechUseCaseDemos/AIFeatureImpact": (
        "Look for the input feature, model output, and direction of influence.",
        "Observe which features move the prediction most and whether that makes business sense.",
        "Note that feature importance is a discussion starter, not proof of causality."
    ),
    "TechUseCaseDemos/AIPRDTemplate": (
        "Look for the problem statement, user need, success metric, and AI boundary.",
        "Observe how the PRD changes when constraints, risks, and non-goals are added.",
        "Note that a good AI PRD prevents vague requests from becoming unmanaged model projects."
    ),
    "TechUseCaseDemos/AIPerformanceDashboard": (
        "Look for the KPI, baseline, target, and actual performance trend.",
        "Observe how drill-downs reveal whether a KPI issue is broad or localized.",
        "Note that dashboards should lead to action, not only monitoring."
    ),
    "TechUseCaseDemos/AIProductCanvas": (
        "Look for the user, job-to-be-done, AI capability, data source, and value metric.",
        "Observe how the canvas exposes missing pieces before building a prototype.",
        "Note that students should challenge whether AI is the simplest way to solve the user problem."
    ),
    "TechUseCaseDemos/AIROICalculator": (
        "Look for the investment cost, expected benefit, adoption rate, and time horizon.",
        "Observe how ROI changes when benefits are conservative or adoption is slower.",
        "Note that ROI should include change management, not only software cost."
    ),
    "TechUseCaseDemos/AIResourcePlanner": (
        "Look for demand, capacity, role mix, and utilization assumptions.",
        "Observe where bottlenecks appear when workload or timelines shift.",
        "Note that resource plans are hypotheses; students should identify the assumption most likely to fail."
    ),
    "TechUseCaseDemos/AITeamCollaboration": (
        "Look for task ownership, dependencies, communication signals, and blockers.",
        "Observe how AI summaries or suggestions change team coordination.",
        "Note that collaboration tools help only when humans clarify decisions and accountability."
    ),
    "TechUseCaseDemos/AIWorkflowDemo": (
        "Look for the workflow trigger, AI step, human review point, and output destination.",
        "Observe where automation saves time and where human judgment is still needed.",
        "Note that a strong AI workflow has clear handoffs and failure handling."
    ),
    "TechUseCaseDemos/BankFailurePrediction": (
        "Look for the financial indicators used to signal bank stress.",
        "Observe how changing capital, liquidity, or asset-quality inputs shifts the risk rating.",
        "Note that prediction scores must be interpreted with regulatory and business context."
    ),
    "TechUseCaseDemos/CopilotKitDemo": (
        "Look for the prompt, retrieved context, generated response, and user feedback loop.",
        "Observe how response quality changes with clearer instructions or better context.",
        "Note that copilots should be evaluated on usefulness, safety, and explainability."
    ),
    "TechUseCaseDemos/DataDriftDetector": (
        "Look for the reference distribution, current distribution, and drift signal.",
        "Observe which variables drift first and whether the drift is meaningful operationally.",
        "Note that drift does not automatically mean model failure; students should connect it to monitoring action."
    ),
    "TechUseCaseDemos/EmotionalSupportAssistant": (
        "Look for user intent, sentiment cues, safety boundaries, and referral language.",
        "Observe how the assistant responds differently to low-risk and high-risk messages.",
        "Note that supportive AI must prioritize safety, empathy, and escalation over persuasion."
    ),
    "TechUseCaseDemos/FeatureStoreDemo": (
        "Look for feature definitions, ownership, freshness, and reuse across models.",
        "Observe how feature quality affects reproducibility and model reliability.",
        "Note that feature stores are governance tools as much as engineering infrastructure."
    ),
    "TechUseCaseDemos/GreeksCalculator": (
        "Look for delta, gamma, theta, vega, and the option position being analyzed.",
        "Observe how price, volatility, and time changes affect option exposure.",
        "Note that Greeks are sensitivities; students should connect each Greek to a hedging decision."
    ),
    "TechUseCaseDemos/MLModelRegistry": (
        "Look for model version, dataset version, metrics, owner, and approval status.",
        "Observe how promotion rules prevent weak or unreviewed models from reaching production.",
        "Note that model governance depends on traceability from data to decision."
    ),
    "TechUseCaseDemos/ModelVersionComparator": (
        "Look for the baseline model, challenger model, metric comparison, and segment results.",
        "Observe whether performance gains are consistent or concentrated in a small segment.",
        "Note that a better average metric can hide fairness, stability, or operational risks."
    ),
    "TechUseCaseDemos/ProbabilisticDecisionEngine": (
        "Look for probability estimates, decision thresholds, and expected value calculations.",
        "Observe how changing risk tolerance changes the recommended action.",
        "Note that probabilistic thinking helps students separate uncertainty from indecision."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos": (
        "Look for the range of local AI capabilities and the user problem each mini-demo solves.",
        "Observe which demos run entirely in the browser and which need clearer instructions.",
        "Note that edge AI demos are useful for teaching privacy, latency, and accessibility trade-offs."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/1-local-chat-advisor": (
        "Look for the prompt, local response, and any limitations shown by the chat behavior.",
        "Observe how response quality changes with specific versus vague prompts.",
        "Note that local chat is a safe way to teach prompt design and AI boundaries."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/2-customer-support-tagger": (
        "Look for the support ticket text, predicted category, and confidence level.",
        "Observe how ambiguous tickets affect classification and routing.",
        "Note that automation should reduce triage time while preserving human review for edge cases."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/3-privacy-notebook": (
        "Look for sensitive data types, redaction behavior, and privacy risk signals.",
        "Observe what remains visible after privacy checks are applied.",
        "Note that privacy-preserving AI requires both detection and responsible data handling."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/4-whisper-voice-transcriber": (
        "Look for audio input, transcription output, and timing or speaker cues.",
        "Observe how background noise or unclear speech changes transcript quality.",
        "Note that voice AI should be evaluated for accessibility, accuracy, and consent."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/5-entity-tagger": (
        "Look for named entities, categories, and context around each extraction.",
        "Observe how abbreviations or ambiguous names affect entity recognition.",
        "Note that entity extraction is useful only when students verify the business meaning."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/6-semantic-search": (
        "Look for the query, retrieved documents, and relevance ranking.",
        "Observe whether results match meaning or only keywords.",
        "Note that semantic search teaches the difference between retrieval and understanding."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/7-opinion-quintuple-extractor": (
        "Look for opinion holder, target, sentiment, aspect, and explanation.",
        "Observe how mixed opinions are separated into structured evidence.",
        "Note that structured sentiment analysis supports better customer or stakeholder insight."
    ),
    "🤖 Browser-AI-Demos/Browser-AI-Product-Demos/semantic-game": (
        "Look for word relationships, hints, and the path students use to reason semantically.",
        "Observe how students explain connections that are not obvious from keywords.",
        "Note that semantic games make abstract NLP ideas concrete and memorable."
    ),
    "🤖 Browser-AI-Demos/PM-Product-Demos": (
        "Look for the product decision, evidence, stakeholder, and recommended next step.",
        "Observe how each mini-demo turns a product question into an interactive experiment.",
        "Note that product managers should use demos to test assumptions before committing resources."
    ),
    "🤖 Browser-AI-Demos/PM-Product-Demos/1-experimentation-metrics-simulator": (
        "Look for the experiment goal, primary metric, guardrail metric, and sample size.",
        "Observe how random variation can create false confidence in early results.",
        "Note that experimentation discipline protects teams from overreacting to noisy data."
    ),
    "🤖 Browser-AI-Demos/PM-Product-Demos/2-feature-prioritization-copilot": (
        "Look for value, effort, risk, and strategic alignment scores.",
        "Observe how changing weights changes the prioritized roadmap.",
        "Note that prioritization should make trade-offs explicit, not hide them behind a score."
    ),
    "🤖 Browser-AI-Demos/PM-Product-Demos/3-build-buy-api-workbench": (
        "Look for build, buy, and API options across cost, speed, control, and risk.",
        "Observe how the best choice changes when time-to-market or compliance matters more.",
        "Note that platform decisions should be revisited as strategy and constraints evolve."
    ),
    "🤖 Browser-AI-Demos/PM-Product-Demos/4-pricing-unit-economics": (
        "Look for price, variable cost, contribution margin, and volume assumptions.",
        "Observe how small changes in conversion or churn affect profitability.",
        "Note that unit economics connects product choices to financial sustainability."
    ),
    "🤖 Browser-AI-Demos/PM-Product-Demos/5-ai-launch-gate": (
        "Look for readiness criteria, risk checks, owner approval, and launch blockers.",
        "Observe how adding governance gates changes launch timing and confidence.",
        "Note that AI launch gates should reduce harm without becoming bureaucratic theater."
    ),
    "DomainUseCaseDemos/Banking/LoanDefaultPredictor": (
        "Look for borrower features, predicted default risk, and threshold setting.",
        "Observe how risk changes with income, debt, history, or employment assumptions.",
        "Note that credit models must be explained in terms students can connect to responsible lending."
    ),
    "TechUseCaseDemos/CreditScoringDemo": (
        "Look for score drivers, risk band, and decision recommendation.",
        "Observe how sensitive the score is to payment history and utilization changes.",
        "Note that credit scoring should include fairness, transparency, and appeal considerations."
    ),
    "TechUseCaseDemos/FraudPlayground": (
        "Look for transaction signals, anomaly score, and fraud flag.",
        "Observe how small changes in amount, location, or frequency alter the risk signal.",
        "Note that fraud detection balances false positives, false negatives, and customer friction."
    ),
    "DomainUseCaseDemos/Compliance/AlertTriage001": (
        "Look for alert severity, evidence, owner, and required response time.",
        "Observe how triage priority changes when evidence is weak or risk is high.",
        "Note that alert triage should produce a documented decision, not just a label."
    ),
    "DomainUseCaseDemos/Compliance/MuleAccountDetection": (
        "Look for transaction patterns, account age, counterparties, and behavioral flags.",
        "Observe how combining weak signals can create a stronger suspicious pattern.",
        "Note that mule detection must avoid over-reliance on any single indicator."
    ),
    "TechUseCaseDemos/AIGovernancePublicSector": (
        "Look for public value, transparency, accountability, and citizen impact criteria.",
        "Observe how governance requirements change when decisions affect public services.",
        "Note that public-sector AI must justify both effectiveness and democratic accountability."
    ),
    "TechUseCaseDemos/AIGovernanceScorecard": (
        "Look for governance dimensions, evidence, maturity level, and gaps.",
        "Observe how low scores cluster around documentation, monitoring, or accountability.",
        "Note that scorecards are useful only when gaps become concrete improvement actions."
    ),
    "TechUseCaseDemos/AIRegulatoryTracker": (
        "Look for regulation, obligation, owner, deadline, and evidence requirement.",
        "Observe how a new rule changes controls, documentation, and risk ownership.",
        "Note that regulatory tracking should convert legal text into operational tasks."
    ),
    "TechUseCaseDemos/PublicPolicyGovernance": (
        "Look for policy objective, stakeholder, risk, and control mechanism.",
        "Observe how policy choices affect equity, efficiency, and implementation burden.",
        "Note that governance analysis should include unintended consequences, not just intended outcomes."
    ),
    "CyberSecurityDemos/IoTAircraftNetwork/IntrusionDetection": (
        "Look for network events, anomaly indicators, and alert classification.",
        "Observe how normal operational patterns differ from suspicious intrusion signals.",
        "Note that intrusion detection should lead to evidence, containment, and escalation decisions."
    ),
    "CyberSecurityDemos/IoTAircraftNetwork/NetworkTrafficAnalyzer": (
        "Look for traffic volume, protocol mix, source-destination patterns, and outliers.",
        "Observe how baseline traffic changes under stress or attack-like conditions.",
        "Note that network analytics are strongest when students explain what is normal and why."
    ),
    "CyberSecurityDemos/IoTAircraftNetwork/PenTestSimulator": (
        "Look for authorized scope, test step, finding, and remediation priority.",
        "Observe how vulnerability severity changes with exploitability and business impact.",
        "Note that penetration testing is a learning exercise in responsible disclosure and defense."
    ),
    "CyberSecurityDemos/IoTAircraftNetwork/ThreatModelingMatrix": (
        "Look for assets, threats, likelihood, impact, and existing controls.",
        "Observe which risk cells move from acceptable to unacceptable after scenario changes.",
        "Note that threat modeling is about prioritizing prevention before incidents happen."
    ),
    "CyberSecurityDemos/IoTAircraftNetwork/VulnScanner": (
        "Look for scan findings, severity, affected asset, and remediation suggestion.",
        "Observe how false positives and duplicate findings affect remediation planning.",
        "Note that vulnerability management requires risk-based prioritization, not just a long list."
    ),
    "TechUseCaseDemos/Embedded_Firmware_Exploit_Wokwi": (
        "Look for firmware behavior, input boundary, and failure mode.",
        "Observe how constrained inputs can still create unsafe system behavior.",
        "Note that embedded security teaching should emphasize safe lab boundaries and defensive design."
    ),
    "TechUseCaseDemos/IoT_Ethernet_PenTest_v86": (
        "Look for network exposure, test vector, finding, and mitigation step.",
        "Observe how device connectivity expands the attack surface.",
        "Note that IoT testing should connect technical findings to operational resilience."
    ),
    "TechUseCaseDemos/MalwareSandbox": (
        "Look for observed behavior, indicators, containment status, and risk rating.",
        "Observe how behavior-based analysis differs from signature-only detection.",
        "Note that malware analysis should be conducted only in controlled learning environments."
    ),
    "TechUseCaseDemos/SecureCodeReview": (
        "Look for code pattern, vulnerability class, evidence line, and secure fix.",
        "Observe how small code choices create larger security risks.",
        "Note that secure code review teaches students to reason like both builders and defenders."
    ),
    "TechUseCaseDemos/ZeroTrustDemo": (
        "Look for identity, device, access request, policy decision, and trust signals.",
        "Observe how access changes when context, location, or risk level changes.",
        "Note that zero trust is a continuous verification model, not a single product."
    ),
    "DomainUseCaseDemos/QuantFinance/BlackScholesOption": (
        "Look for option type, underlying price, strike, volatility, rate, and time.",
        "Observe how option value responds to volatility and time to expiry.",
        "Note that Black-Scholes is a model with assumptions; students should test sensitivity before trusting the price."
    ),
    "DomainUseCaseDemos/SupplyChain/SupplyChainFinance": (
        "Look for invoice timing, buyer risk, supplier risk, and financing cost.",
        "Observe how working-capital benefits change when payment terms or discount rates shift.",
        "Note that supply-chain finance should balance liquidity gains against counterparty and reputational risk."
    ),
    "TechUseCaseDemos/BondPricingDemo": (
        "Look for coupon, maturity, yield, and present-value calculation.",
        "Observe how price moves when market yield rises or falls.",
        "Note that bond pricing teaches the inverse relationship between yields and prices."
    ),
    "TechUseCaseDemos/MonteCarloCompanyValuation": (
        "Look for the acquisition price, five-year free-cash-flow path, terminal value, WACC, and NPV distribution.",
        "Observe how growth volatility, margin volatility, WACC, and terminal growth widen or tighten the valuation range.",
        "Note that a high mean valuation can still be risky; students should compare mean NPV with downside probability and P10/P90."
    ),
    "TechUseCaseDemos/MonteCarloOptions": (
        "Look for simulated paths, payoff calculation, and convergence behavior.",
        "Observe how more simulations stabilize the estimated option value.",
        "Note that Monte Carlo is powerful, but students should question randomness, assumptions, and error."
    ),
    "TechUseCaseDemos/OptionPricingDemo": (
        "Look for intrinsic value, time value, volatility input, and option price.",
        "Observe how moneyness and time affect option valuation.",
        "Note that option pricing should be linked to hedging and risk-management decisions."
    ),
    "TechUseCaseDemos/OptionsPricing": (
        "Look for call and put values, strike, expiry, and volatility assumptions.",
        "Observe how put-call relationships and sensitivities appear across scenarios.",
        "Note that students should explain the business meaning of each option output."
    ),
    "TechUseCaseDemos/PortfolioOptimizer": (
        "Look for expected return, risk, correlation, and portfolio weights.",
        "Observe how the efficient frontier changes when risk tolerance changes.",
        "Note that optimization is only as good as the assumptions behind expected return and risk."
    ),
    "TechUseCaseDemos/WealthManagement/black-scholes": (
        "Look for option parameters and the model price output.",
        "Observe how volatility and time to expiry move the option value.",
        "Note that students should connect formula results to hedging decisions and model limits."
    ),
    "TechUseCaseDemos/WealthManagement/efficient-frontier": (
        "Look for asset return, volatility, correlation, and selected portfolio point.",
        "Observe how the frontier shifts when correlations or expected returns change.",
        "Note that diversification is valuable only when students can explain the risk trade-off."
    ),
    "TechUseCaseDemos/WealthManagement/npv-calculator": (
        "Look for cash-flow timing, discount rate, initial investment, and NPV result.",
        "Observe how the project decision changes when discount rate or future cash flows shift.",
        "Note that NPV is a decision aid; students should also discuss strategic and non-financial factors."
    ),
    "TechUseCaseDemos/AIContentSummarizer": (
        "Look for source text, summary length, key points, and missing details.",
        "Observe how summarization quality changes with document complexity.",
        "Note that summaries should be checked against the source before they are reused."
    ),
    "TechUseCaseDemos/AISummarizer001": (
        "Look for input text, generated summary, and highlighted themes.",
        "Observe where the summary preserves meaning and where it over-compresses.",
        "Note that students should compare summary usefulness against accuracy and traceability."
    ),
    "TechUseCaseDemos/LiteParseDemo": (
        "Look for parsed structure, extracted fields, and parsing failures.",
        "Observe how format variation affects extraction reliability.",
        "Note that parsing demos teach why data quality matters before AI can help."
    ),
    "TechUseCaseDemos/RAGSolutions/GraphRAG": (
        "Look for entities, relationships, graph context, and generated answer.",
        "Observe how graph connections improve answers that need relationship reasoning.",
        "Note that graph retrieval is strongest when students can trace evidence through linked concepts."
    ),
    "TechUseCaseDemos/RAGSolutions/PageIndexRAG": (
        "Look for page references, retrieved chunks, and answer grounding.",
        "Observe whether the answer cites the page that actually supports the claim.",
        "Note that page-level retrieval improves auditability but still requires citation checks."
    ),
    "TechUseCaseDemos/RAGSolutions/StandardRAG": (
        "Look for query, retrieved documents, generated answer, and citations.",
        "Observe whether retrieval improves answer grounding compared with a plain prompt.",
        "Note that RAG quality depends on retrieval relevance as much as generation quality."
    ),
    "TechUseCaseDemos/RAGSolutions/VoiceGraphRAG": (
        "Look for spoken query, graph retrieval, entities, relationships, and answer.",
        "Observe how voice input changes retrieval errors and answer clarity.",
        "Note that voice RAG should be evaluated for transcription accuracy and evidence traceability."
    ),
    "TechUseCaseDemos/RAGSolutions/VoicePageIndexRAG": (
        "Look for voice query, page references, retrieved evidence, and generated response.",
        "Observe where speech-to-text errors affect retrieval and answer quality.",
        "Note that voice-based RAG needs both citation checks and accessibility considerations."
    ),
    "TechUseCaseDemos/RAGSolutions/VoiceStandardRAG": (
        "Look for voice query, transcript, retrieved context, and generated answer.",
        "Observe whether the system retrieves relevant evidence after transcription.",
        "Note that voice RAG teaches the full pipeline: speech, retrieval, generation, and verification."
    ),
    "TechUseCaseDemos/UniversityKnowledgeAssistant": (
        "Look for student query, knowledge source, retrieved answer, and citation.",
        "Observe how answer quality changes when the knowledge base is specific versus generic.",
        "Note that knowledge assistants should help students find evidence, not replace learning."
    ),
    "TechUseCaseDemos/VoiceNotesApp001": (
        "Look for spoken note, transcript, extracted action items, and summary.",
        "Observe how background noise or unclear speech affects extraction.",
        "Note that voice notes should be checked before actions are assigned or stored."
    ),
    "DomainUseCaseDemos/RiskManagement/ContagionModel": (
        "Look for institution links, shock source, loss propagation, and systemic risk indicator.",
        "Observe how a small shock spreads through connected balance sheets.",
        "Note that contagion modeling teaches why network structure matters in financial stability."
    ),
    "DomainUseCaseDemos/RiskManagement/CounterPartyRisk": (
        "Look for exposure, probability of default, recovery rate, and expected loss.",
        "Observe how counterparty risk changes with exposure size and credit quality.",
        "Note that expected loss is a starting point for collateral, limits, and monitoring decisions."
    ),
    "TechUseCaseDemos/AIRiskCalculator": (
        "Look for risk drivers, AI-assisted score, confidence, and recommended control.",
        "Observe how scenario changes affect risk severity and priority.",
        "Note that AI risk scores should be explained with evidence and human review."
    ),
    "TechUseCaseDemos/CounterpartyRiskDemo": (
        "Look for counterparty profile, exposure, credit signal, and mitigation action.",
        "Observe how concentration and credit deterioration change risk posture.",
        "Note that counterparty risk management depends on limits, collateral, and timely escalation."
    ),
    "TechUseCaseDemos/QFDDemo": (
        "Look for customer need, importance, satisfaction, and quality-function linkage.",
        "Observe how prioritization changes when customer importance and current satisfaction differ.",
        "Note that QFD helps translate voice-of-customer into design and control choices."
    ),
    "TechUseCaseDemos/RiskParityPortfolio": (
        "Look for asset risk contribution, allocation weights, and portfolio volatility.",
        "Observe how risk parity differs from capital-weighted allocation.",
        "Note that equal risk contribution is a design choice, not a guarantee of safety."
    ),
    "TechUseCaseDemos/SIEMDashboard": (
        "Look for security events, severity, source, and response status.",
        "Observe how event clustering changes analyst priorities.",
        "Note that SIEM dashboards should support investigation, not just alert volume."
    ),
    "TechUseCaseDemos/ThreatHunter": (
        "Look for hypothesis, telemetry source, indicator, and evidence trail.",
        "Observe how a hunting query narrows from broad signals to specific activity.",
        "Note that threat hunting is disciplined curiosity backed by evidence."
    ),
    "TechUseCaseDemos/VaRCalculator": (
        "Look for portfolio returns, confidence level, time horizon, and VaR estimate.",
        "Observe how VaR changes when volatility or confidence level increases.",
        "Note that VaR summarizes tail risk but does not describe losses beyond the threshold."
    ),
    "TechUseCaseDemos/AIHedgeOrchestrator": (
        "Look for exposure, hedge instrument, hedge ratio, cost, and residual risk.",
        "Observe how the recommended hedge changes under FX, rate, or cash-flow scenarios.",
        "Note that hedging is about reducing unwanted risk, not eliminating every uncertainty."
    ),
    "TechUseCaseDemos/CCCAnalyzer": (
        "Look for receivables, inventory, payables, and cash conversion cycle components.",
        "Observe which working-capital lever most improves cash tied up in operations.",
        "Note that CCC improvements should be balanced against supplier, customer, and service impacts."
    ),
    "TechUseCaseDemos/CollectionsPredictor": (
        "Look for customer risk score, payment history, amount due, and collection priority.",
        "Observe how segmenting customers changes collection strategy.",
        "Note that collections analytics should improve cash recovery while preserving customer relationships."
    ),
    "TechUseCaseDemos/FXHedgeSimulator": (
        "Look for currency exposure, hedge choice, spot rate movement, and hedge outcome.",
        "Observe how forwards, options, or natural hedges behave under different FX scenarios.",
        "Note that hedge effectiveness should be judged against the original risk objective."
    ),
    "TechUseCaseDemos/SmartContractTreasury": (
        "Look for treasury rule, smart-contract condition, approval flow, and transaction outcome.",
        "Observe how automated controls reduce manual risk and where human override is needed.",
        "Note that smart contracts are powerful controls only when rules, audits, and exceptions are clear."
    ),
    "TechUseCaseDemos/StablecoinManager": (
        "Look for reserve level, redemption flow, peg pressure, and policy action.",
        "Observe how liquidity and confidence interact during stress scenarios.",
        "Note that stablecoin management connects treasury discipline with governance and market trust."
    ),
    "TechUseCaseDemos/TreasuryControlTower": (
        "Look for cash position, forecast gap, stress scenario, and recommended action.",
        "Observe how liquidity changes when inflows fall, outflows accelerate, or reserves are stressed.",
        "Note that students should translate dashboard signals into a treasury decision and escalation path."
    ),
    "TechUseCaseDemos/TreasuryTransformBlueprint": (
        "Look for current treasury capability, target state, roadmap step, and value driver.",
        "Observe how maturity changes when people, process, data, and technology improve together.",
        "Note that treasury transformation succeeds when strategy, governance, and operating rhythm align."
    ),
}


def teacher_guide(demo: DemoPage) -> tuple[str, str, str]:
    return TEACHER_GUIDES.get(demo.folder.as_posix(), (
        "Look for the main decision, data input, and output the demo is designed to explain.",
        "Observe how changing one assumption changes the result or recommendation.",
        "Note the limitation students should mention before applying the result in a real decision."
    ))


def demo_in_course(demo: DemoPage, course_key: str) -> bool:
    return demo.course_key == course_key or course_key in MULTI_COURSE_DEMOS.get(demo.folder.as_posix(), [])


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


def absolute_site_url(path: Path | str) -> str:
    raw = path.as_posix() if isinstance(path, Path) else str(path)
    normalized = raw.replace("\\", "/").lstrip("./")
    if normalized in {"", "index.html"}:
        return SITE_URL
    return SITE_URL.rstrip("/") + "/" + quote(normalized, safe="/-_.~")


def relative_url(from_path: Path, to_path: Path) -> str:
    if from_path == Path("index.html") and to_path == Path("index.html"):
        return "./"
    rel = posixpath.relpath(to_path.as_posix(), from_path.parent.as_posix())
    return rel if rel != "." else "./"


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


def demo_keywords(demo: DemoPage, concepts: list[str]) -> str:
    course = COURSES[demo.course_key]
    keywords = [
        demo.title,
        f"{demo.title} demo",
        f"{demo.title} about demo",
        course["title"],
        course["short"],
        demo.level,
        "browser-based demo",
        "classroom learning",
        "GitHub Pages demo",
        "no API keys",
    ]
    keywords.extend(concepts)
    return ", ".join(dict.fromkeys(keywords))


def seo_description_for_demo(demo: DemoPage, concepts: list[str], look_for: str) -> str:
    description = re.sub(r"\s+", " ", demo.description).strip()
    generic = description.lower().startswith(f"about demo learning guide for {demo.title.lower()}:")
    if not generic:
        return description
    course = COURSES[demo.course_key]
    concept_text = ", ".join(concepts[:3]).lower()
    focus = look_for.rstrip(".")
    if focus.lower().startswith("look for "):
        focus = focus[9:]
    generic_focus = "the main decision, data input, and output the demo is designed to explain"
    if focus.lower() == generic_focus:
        focus_text = "the decision, input variables, outputs, and scenario trade-offs"
    else:
        focus_text = focus.lower()
    return (
        f"{demo.title} About Demo for {course['title']}: browser-based learning activity covering "
        f"{concept_text}. Students explore {focus_text} with no cloud or API keys required."
    )


def json_ld_script(payload: dict) -> str:
    return (
        '<script type="application/ld+json">\n'
        + json.dumps(payload, indent=2, ensure_ascii=False)
        + "\n</script>"
    )


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


def course_dropdown(active: str | None = None, from_path: Path | None = None) -> str:
    from_path = from_path or Path("index.html")
    links = []
    for key in COURSE_ORDER:
        course = COURSES[key]
        active_class = " active" if key == active else ""
        links.append(
            f'<a class="dropdown-link{active_class}" href="{relative_url(from_path, Path(course["path"]))}">'
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


def common_nav(kind: str, course_key: str | None = None, demo: DemoPage | None = None, from_path: Path | None = None) -> str:
    from_path = from_path or Path("index.html")
    active_course = course_key or (demo.course_key if demo else None)
    home_url = relative_url(from_path, Path("index.html"))
    brand = f'<a class="brand" href="{home_url}">KateelLearningDemos</a>'
    landing = f'<a class="nav-link" href="{home_url}">Home</a>'
    github = f'<a class="nav-link" href="{GITHUB_URL}" target="_blank" rel="noopener">GitHub</a>'
    courses = course_dropdown(active_course, from_path)

    if kind == "landing":
        links = f"{landing}{courses}{github}"
    elif kind == "course":
        links = f"{landing}{courses}{github}"
    elif demo:
        about = f'<a class="nav-link" href="{relative_url(from_path, demo.about_path)}">About Demo</a>'
        course = f'<a class="nav-link" href="{relative_url(from_path, Path(COURSES[demo.course_key]["path"]))}">{COURSES[demo.course_key]["short"]}</a>'
        launch = f'<a class="nav-link nav-cta" href="{relative_url(from_path, demo.demo_path)}">Launch Demo</a>'
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


def ensure_assets(content: str, from_path: Path) -> str:
    css = f'  <link rel="stylesheet" href="{relative_url(from_path, Path("assets/site.css"))}">\n'
    js = f'  <script defer src="{relative_url(from_path, Path("assets/site.js"))}"></script>\n'
    if css.rstrip("\n") not in content and "</head>" in content:
        content = content.replace("</head>", css + "</head>", 1)
    if js.rstrip("\n") not in content and "</head>" in content:
        content = content.replace("</head>", js + "</head>", 1)
    return content


def replace_nav(content: str, nav: str) -> str:
    content = re.sub(r"\s*<nav[\s\S]*?</nav>", "\n" + nav, content, count=1)
    content = re.sub(r"\s*<div class=\"header\">[\s\S]*?<div class=\"container\">", "\n" + nav + "\n\n  <div class=\"container\">", content, count=1)
    if "<nav" not in content and "<body>" in content:
        content = content.replace("<body>", "<body>\n" + nav, 1)
    return content


def add_demo_context_strip(content: str, demo: DemoPage, from_path: Path) -> str:
    if "demo-context-strip" in content:
        return content
    _, observe, _ = teacher_guide(demo)
    strip = f'''
  <div class="demo-context-strip" role="note">
    <strong>About vs. Demo:</strong> You are on the interactive demo. Use the <a href="{relative_url(from_path, demo.about_path)}">About Demo</a> page for learning objectives, theory, usage steps, and assessment prompts.
    <br><strong>Teacher cue:</strong> {escape(observe)}
  </div>
'''
    return content.replace("<div class=\"container\">", strip + "  <div class=\"container\">", 1)


def normalize_relative_links(content: str, from_path: Path) -> str:
    root = Path(".").resolve()

    def replace_ref(match: re.Match[str]) -> str:
        prefix, ref, suffix = match.group(1), match.group(2), match.group(3)
        if not ref or ref.startswith(("#", "mailto:", "tel:", "data:")):
            return match.group(0)
        if urlsplit(ref).scheme in {"http", "https"}:
            return match.group(0)
        if ref.startswith("{{") or ref.endswith("}}"):
            return match.group(0)

        candidates = []
        clean_ref = ref.lstrip("/")
        if clean_ref == REPO_NAME:
            clean_ref = "index.html"
        elif clean_ref.startswith(REPO_NAME + "/"):
            clean_ref = clean_ref[len(REPO_NAME) + 1:]
        local_target = (from_path.parent / clean_ref).resolve()
        if local_target.exists():
            candidates.append(local_target)
        root_target = (root / clean_ref).resolve()
        if root_target.exists():
            candidates.append(root_target)

        if not candidates:
            return match.group(0)

        for target in candidates:
            try:
                rel = Path(unquote(target.relative_to(root).as_posix()))
            except ValueError:
                continue
            new_ref = relative_url(from_path, rel)
            if new_ref != ref:
                return f'{prefix}{new_ref}{suffix}'
        return match.group(0)

    return re.sub(r'((?:href|src)=["\'])((?:(?:\.\./|\./|/)?[^"\'<>#]+)(?:#[^"\']*)?)(["\'])', replace_ref, content)


def update_actual_demo_page(path: Path, demo: DemoPage) -> None:
    content = path.read_text(encoding="utf-8", errors="ignore")
    original = content
    content = ensure_assets(content, path)
    content = replace_nav(content, common_nav("demo", demo=demo))
    content = normalize_relative_links(content, path)
    course_href = relative_url(path, Path(COURSES[demo.course_key]["path"]))
    content = content.replace('href="../../../courses/"', f'href="{course_href}"')
    content = content.replace("Back to Courses", "View Course Path")
    if not (path.parent / "README.md").exists():
        content = content.replace('href="README.md"', f'href="{relative_url(path, Path("DEMO_INDEX.md"))}"')
        content = content.replace("Read the README.md", "Read the full demo index")
    content = add_demo_context_strip(content, demo, path)
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
    path = demo.about_path
    course = COURSES[demo.course_key]
    course_path = Path(COURSES[demo.course_key]["path"])
    readme_exists = (demo.folder / "README.md").exists()
    readme_link = f'<a class="btn btn-secondary" href="{relative_url(path, demo.folder / "README.md")}">View README</a>' if readme_exists else ""
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
    look_for, observe, note = teacher_guide(demo)
    seo_description = seo_description_for_demo(demo, concepts, look_for)
    keywords = demo_keywords(demo, concepts)
    canonical = absolute_site_url(path)
    og_image = absolute_site_url(DEFAULT_OG_IMAGE)
    launch_url = absolute_site_url(demo.demo_path)
    course_url = absolute_site_url(course_path)
    readme_url = absolute_site_url(demo.folder / "README.md") if readme_exists else ""
    structured_data = [
        {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "name": f"{demo.title} About Demo",
            "description": seo_description,
            "url": canonical,
            "isAccessibleForFree": True,
            "learningResourceType": "About Demo",
            "educationalLevel": demo.level,
            "timeRequired": demo.duration,
            "teaches": outcomes,
            "keywords": keywords,
            "inLanguage": "en",
            "about": concepts,
            "educationalUse": ["instruction", "assignment", "guided practice"],
            "provider": {
                "@type": "Person",
                "name": "Professor Vinaya Sathyanarayana",
                "email": ATTRIBUTION_EMAIL,
                "url": GITHUB_URL,
            },
            "isPartOf": {
                "@type": "Course",
                "name": course["title"],
                "url": course_url,
            },
            "hasPart": [
                {
                    "@type": "WebPage",
                    "name": f"{demo.title} launch demo",
                    "url": launch_url,
                }
            ] + (
                [
                    {
                        "@type": "CreativeWork",
                        "name": f"{demo.title} README",
                        "url": readme_url,
                    }
                ]
                if readme_exists
                else []
            ),
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": absolute_site_url("index.html")},
                {"@type": "ListItem", "position": 2, "name": "Course Packs", "item": absolute_site_url("course-packs/index.html")},
                {"@type": "ListItem", "position": 3, "name": course["title"], "item": course_url},
                {"@type": "ListItem", "position": 4, "name": demo.title, "item": canonical},
            ],
        },
    ]
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{escape(demo.title)} - About Demo - {SITE_NAME}</title>
  <meta name="description" content="{escape(seo_description)}">
  <meta name="keywords" content="{escape(keywords)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="author" content="Professor Vinaya Sathyanarayana">
  <meta name="theme-color" content="#0f766e">
  <link rel="canonical" href="{escape(canonical)}">
  <link rel="manifest" href="{relative_url(path, Path("site.webmanifest"))}">
  <meta property="og:site_name" content="{SITE_NAME}">
  <meta property="og:title" content="{escape(demo.title)} - About Demo - {SITE_NAME}">
  <meta property="og:description" content="{escape(seo_description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{escape(canonical)}">
  <meta property="og:image" content="{escape(og_image)}">
  <meta property="og:image:alt" content="{escape(demo.title)} learning demo preview">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{escape(demo.title)} - About Demo - {SITE_NAME}">
  <meta name="twitter:description" content="{escape(seo_description)}">
  <meta name="twitter:image" content="{escape(og_image)}">
  {''.join(json_ld_script(item) for item in structured_data)}
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>
  <link rel="stylesheet" href="{relative_url(path, Path("assets/site.css"))}">
  <script defer src="{relative_url(path, Path("assets/site.js"))}"></script>
</head>
<body>
{common_nav("about", demo=demo, from_path=path)}
  <main class="container">
    <section class="site-hero page-hero">
      <p class="hero-eyebrow">{course['emoji']} {course['title']} • {escape(demo.level)} • {escape(demo.duration)}</p>
      <h1>{escape(demo.title)}</h1>
      <p class="hero-subtitle">{escape(seo_description)}</p>
      <div class="pill-row" aria-label="Demo attributes">
        <span class="pill">About Demo</span>
        <span class="pill">{escape(demo.ai_mode)}</span>
        <span class="pill">No API keys</span>
        <span class="pill">Attribution: {ATTRIBUTION_EMAIL}</span>
      </div>
      <div class="cta-buttons">
        <a class="btn btn-primary launch-demo" href="{relative_url(path, demo.demo_path)}">▶ Launch actual demo</a>
        <a class="btn btn-secondary" href="{relative_url(path, course_path)}">View course path</a>
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

    <section class="section" id="observe">
      <div class="section-header">
        <p class="section-kicker">Teacher observation guide</p>
        <h2>What to look for, observe, and note</h2>
        <p>Use these prompts to turn the demo result into a guided learning conversation.</p>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <h3>What to look for</h3>
          <p>{escape(look_for)}</p>
        </article>
        <article class="info-card">
          <h3>What to observe</h3>
          <p>{escape(observe)}</p>
        </article>
        <article class="info-card">
          <h3>What to note</h3>
          <p>{escape(note)}</p>
        </article>
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
    <p><a href="{relative_url(path, Path("index.html"))}">KateelLearningDemos</a> • <a href="{relative_url(path, course_path)}">{course['title']}</a> • Attribution: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a></p>
  </footer>
</body>
</html>
'''


def render_course_page(key: str, demos: list[DemoPage]) -> str:
    course = COURSES[key]
    course_path = Path(course["path"])
    demo_cards = []
    for demo in demos:
        if not demo_in_course(demo, key):
            continue
        look_for, observe, note = teacher_guide(demo)
        demo_cards.append(f'''
<a class="demo-card" href="{relative_url(course_path, demo.about_path)}">
  <div class="demo-card-top">
    <h3>{escape(demo.title)}</h3>
    <span class="level-badge">{escape(demo.level)}</span>
  </div>
  <p>{escape(demo.description)}</p>
  <p class="teacher-cue"><strong>Teacher cue:</strong> {escape(look_for)}</p>
  <div class="demo-meta">
    <span>{escape(demo.duration)}</span>
    <span>{escape(demo.ai_mode)}</span>
  </div>
  <div class="demo-actions">
    <span class="btn-mini">Read About Demo</span>
    <a class="btn-mini outline launch-demo" href="{relative_url(course_path, demo.demo_path)}">Launch Demo</a>
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
  <link rel="stylesheet" href="{relative_url(Path(course["path"]), Path("assets/site.css"))}">
  <script defer src="{relative_url(Path(course["path"]), Path("assets/site.js"))}"></script>
</head>
<body>
{common_nav("course", course_key=key, from_path=Path(course["path"]))}
  <main class="container">
    <section class="site-hero page-hero">
      <p class="hero-eyebrow">{course['emoji']} Course path</p>
      <h1>{course['title']}</h1>
      <p class="hero-subtitle">{escape(course['description'])}</p>
      <div class="cta-buttons">
        <a class="btn btn-primary" href="#demos">Browse demos</a>
        <a class="btn btn-secondary" href="{relative_url(Path(course["path"]), Path("index.html"))}">Return to Home</a>
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
    <p><a href="{relative_url(Path(course["path"]), Path("index.html"))}">KateelLearningDemos</a> • {course['title']} • Attribution: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a></p>
  </footer>
</body>
</html>
'''


def render_index(demos: list[DemoPage]) -> str:
    course_cards = []
    for key in COURSE_ORDER:
        course = COURSES[key]
        count = sum(1 for demo in demos if demo_in_course(demo, key))
        course_cards.append(f'''
<a class="course-card" href="{relative_url(Path("index.html"), Path(course["path"]))}">
  <div class="course-card-top"><h3>{course['emoji']} {course['title']}</h3><span>{count} demos</span></div>
  <p>{escape(course['description'])}</p>
  <div class="course-meta"><span>About-first navigation</span><span>Browser-based</span></div>
</a>
''')

    featured = [d for d in demos if demo_in_course(d, "treasury") or demo_in_course(d, "ai_ml") or demo_in_course(d, "rag_nlp") or demo_in_course(d, "quant")][:12]
    featured_cards = []
    for demo in featured:
        featured_cards.append(f'''
<a class="demo-card featured-demo" href="{relative_url(Path("index.html"), demo.about_path)}">
  <div class="demo-card-top"><h3>{escape(demo.title)}</h3><span class="level-badge">{escape(demo.level)}</span></div>
  <p>{escape(demo.description)}</p>
  <div class="demo-actions"><span class="btn-mini">About Demo</span><a class="btn-mini outline launch-demo" href="{relative_url(Path("index.html"), demo.demo_path)}">Launch</a></div>
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
  <link rel="stylesheet" href="assets/site.css">
  <script defer src="assets/site.js"></script>
</head>
<body>
{common_nav("landing", from_path=Path("index.html"))}
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
        <a class="btn btn-secondary" href="DEMO_INDEX.md">Full demo index</a>
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
    <p><a href="./">KateelLearningDemos</a> • Attribution: <a href="mailto:{ATTRIBUTION_EMAIL}">{ATTRIBUTION_EMAIL}</a> • <a href="{GITHUB_URL}">GitHub repository</a></p>
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
        "1. Start at the [Home](/KateelLearningDemosToStudents/).",
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
        "1. Start at the [Home](/KateelLearningDemosToStudents/).",
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
    site_css = Path("assets/site.css")
    if not site_css.exists():
        site_css.write_text(r'''/* KateelLearningDemos shared GitHub Pages styles */
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
    site_js = Path("assets/site.js")
    if not site_js.exists():
        site_js.write_text(r'''/* KateelLearningDemos shared navigation, rating, and usage tracking */
(function () {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
  const path = window.location.pathname.replace(/\/$/, "");
  document.querySelectorAll(".nav-link, .dropdown-content a").forEach(function (link) {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("http")) {
      const linkPath = new URL(href, window.location.href).pathname.replace(/\/$/, "");
      if (path.endsWith(linkPath)) {
        link.classList.add("active");
      }
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
