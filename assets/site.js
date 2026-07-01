/* KateelLearningDemos shared navigation, rating, and usage tracking */
(function () {
  var GENERIC_REPO_COPY = "This demo is part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) by Professor Vinaya Sathyanarayana.";

  var DEMO_CONTENT_OVERRIDES = {
    "AI PRD Template": {
      summary: "Browser-based AI product requirements workshop where learners turn a vague idea into a scoped PRD with user needs, AI boundaries, evaluation criteria, and rollout guardrails.",
      about: "Teams often rush from an AI idea to implementation without writing down the user problem, workflow fit, governance rules, and evaluation criteria. This demo makes that framing visible.",
      focus: "Look for the problem statement, target user, decision workflow, success metric, and explicit AI boundaries before discussing model choices.",
      observe: "Observe how the product brief changes when data constraints, compliance concerns, and human-review steps are added.",
      note: "A strong AI PRD reduces rework by turning a fuzzy concept into a testable, governable product definition.",
      labTitle: "Draft a launch-ready AI PRD",
      fields: [
        { id: "user_problem", label: "User problem", kind: "textarea", placeholder: "What problem is the user facing today?" },
        { id: "target_user", label: "Target user", kind: "text", placeholder: "Who is this product for?" },
        { id: "success_metric", label: "Success metric", kind: "text", placeholder: "What outcome will prove value?" },
        { id: "ai_boundary", label: "AI boundary", kind: "textarea", placeholder: "What should the model do, and what must stay human-led?" },
        { id: "guardrails", label: "Guardrails", kind: "textarea", placeholder: "What policy, privacy, or review rules must be enforced?" }
      ],
      checklist: ["Problem statement is specific", "Success metric is measurable", "Human oversight is explicit", "Guardrails are written down"]
    },
    "Malware Sandbox": {
      summary: "Browser-based malware triage lab where learners review suspicious sample behavior, compare detonation evidence, and decide containment urgency before escalation.",
      about: "Security teams need to distinguish noisy suspicious artifacts from high-severity malware behavior quickly enough to contain damage without burning time on false alarms.",
      focus: "Look for the execution chain, outbound behavior, privilege activity, and persistence signs before deciding severity.",
      observe: "Observe how the recommendation changes when network callbacks, credential access, or lateral-movement indicators appear together.",
      note: "The right decision is usually about containment speed and confidence, not about perfect certainty on the first pass.",
      labTitle: "Triage a suspicious sample",
      fields: [
        { id: "sample_source", label: "Sample source", kind: "text", placeholder: "Email attachment, web download, USB drop..." },
        { id: "behavior", label: "Observed behavior", kind: "textarea", placeholder: "Processes spawned, files touched, callbacks observed..." },
        { id: "affected_assets", label: "Affected assets", kind: "text", placeholder: "Which hosts, users, or segments are exposed?" },
        { id: "containment", label: "Containment plan", kind: "textarea", placeholder: "What do you isolate first?" }
      ],
      checklist: ["Execution evidence captured", "Network behavior reviewed", "Host impact understood", "Containment action chosen"]
    },
    "Model Version Comparator": {
      summary: "Browser-based model release review where learners compare a baseline and candidate model on quality, drift, fairness, and operational readiness before sign-off.",
      about: "Model upgrades are risky when teams focus only on one metric and ignore drift, fairness, monitoring cost, or rollback readiness.",
      focus: "Look for the baseline-versus-candidate trade-off across performance, stability, bias, and monitoring implications.",
      observe: "Observe whether a stronger offline metric still makes sense once you add data drift, explainability, and rollback constraints.",
      note: "A model should be release-ready, not just benchmark-ready.",
      labTitle: "Review a model upgrade",
      fields: [
        { id: "baseline_metric", label: "Baseline metric", kind: "text", placeholder: "Current production metric or KPI" },
        { id: "candidate_metric", label: "Candidate metric", kind: "text", placeholder: "New model metric or KPI" },
        { id: "risk_shift", label: "Risk shift", kind: "textarea", placeholder: "What new drift, fairness, or monitoring risks appear?" },
        { id: "rollback_plan", label: "Rollback plan", kind: "textarea", placeholder: "How would you reverse the launch if needed?" }
      ],
      checklist: ["Improvement is material", "Risk shift is understood", "Monitoring plan exists", "Rollback is realistic"]
    },
    "SIEM Dashboard": {
      summary: "Browser-based SOC decision lab where learners prioritize alerts, connect signals across hosts, and decide which incidents deserve immediate escalation.",
      about: "Security operations teams face more alerts than they can investigate fully, so prioritization quality matters as much as raw detection coverage.",
      focus: "Look for alert severity, asset criticality, correlation strength, and the attack story suggested by multiple signals together.",
      observe: "Observe how triage changes when business-critical systems show weak evidence versus when lower-priority systems show strong evidence.",
      note: "Good SIEM work connects alerts into a narrative instead of treating each event in isolation.",
      labTitle: "Prioritize a SOC queue",
      fields: [
        { id: "alert_cluster", label: "Alert cluster", kind: "textarea", placeholder: "Which alerts appear related?" },
        { id: "critical_assets", label: "Critical assets", kind: "text", placeholder: "What high-value systems are involved?" },
        { id: "confidence", label: "Analyst confidence", kind: "text", placeholder: "Low, medium, or high confidence?" },
        { id: "escalation_plan", label: "Escalation plan", kind: "textarea", placeholder: "What gets escalated, contained, or deferred?" }
      ],
      checklist: ["Correlation is explained", "Business context is used", "Escalation owner is clear", "False-positive risk is acknowledged"]
    },
    "Secure Code Review": {
      summary: "Browser-based secure-code review workshop where learners inspect risky implementation choices, explain impact, and prioritize the highest-value remediation first.",
      about: "Code review quality improves when engineers can explain exploitability, business impact, and fix priority rather than listing issues mechanically.",
      focus: "Look for trust boundaries, unsafe inputs, secrets handling, and privilege assumptions in the reviewed code path.",
      observe: "Observe which issues are merely style concerns versus which ones create realistic exploitation paths.",
      note: "The strongest review comments connect the coding mistake to attacker behavior and remediation cost.",
      labTitle: "Prioritize secure code fixes",
      fields: [
        { id: "code_surface", label: "Code surface", kind: "text", placeholder: "Auth flow, file upload, API endpoint..." },
        { id: "risk_pattern", label: "Risk pattern", kind: "textarea", placeholder: "What unsafe pattern do you see?" },
        { id: "impact", label: "Potential impact", kind: "textarea", placeholder: "What could an attacker do with it?" },
        { id: "fix_order", label: "Fix order", kind: "textarea", placeholder: "Which issue gets fixed first, and why?" }
      ],
      checklist: ["Risk is technically accurate", "Impact is explained", "Fix priority is justified", "Remediation is actionable"]
    },
    "ThreatHunter": {
      summary: "Browser-based threat-hunting planning lab where learners turn weak indicators into hypotheses, evidence requests, and investigation paths mapped to attacker behavior.",
      about: "Threat hunting is valuable when teams can move from scattered indicators to a testable hypothesis with concrete evidence requests and decision gates.",
      focus: "Look for the hunting hypothesis, evidence sources, attacker technique assumptions, and what would disprove the theory.",
      observe: "Observe how the hunt plan changes when telemetry is incomplete or the suspected technique spans multiple systems.",
      note: "A good hunt plan states what to look for and what evidence would falsify the hypothesis.",
      labTitle: "Plan a threat hunt",
      fields: [
        { id: "indicator", label: "Indicator or lead", kind: "text", placeholder: "What triggered the hunt?" },
        { id: "hypothesis", label: "Hunting hypothesis", kind: "textarea", placeholder: "What attacker behavior do you suspect?" },
        { id: "telemetry", label: "Telemetry sources", kind: "textarea", placeholder: "Which logs, detections, or endpoints will you query?" },
        { id: "next_step", label: "Next decision step", kind: "textarea", placeholder: "What proves or disproves the hypothesis?" }
      ],
      checklist: ["Hypothesis is explicit", "Evidence sources are named", "Disproof condition exists", "Next step is time-bounded"]
    },
    "Alert Triage 001": {
      summary: "Browser-based compliance-alert triage lab where learners classify suspicious activity alerts, decide escalation priority, and document disposition reasoning for auditability.",
      about: "Compliance teams need defensible triage logic that balances urgency, customer impact, and false-positive pressure without losing the audit trail.",
      focus: "Look for alert severity, customer behavior pattern, regulatory exposure, and whether the case needs escalation, monitoring, or closure.",
      observe: "Observe how the same transaction pattern can lead to different actions depending on customer history and control context.",
      note: "The triage decision matters, but the explanation behind it matters just as much for governance.",
      labTitle: "Document a compliance disposition",
      fields: [
        { id: "alert_signal", label: "Alert signal", kind: "textarea", placeholder: "What triggered the compliance alert?" },
        { id: "customer_context", label: "Customer context", kind: "textarea", placeholder: "What background information changes the interpretation?" },
        { id: "disposition", label: "Proposed disposition", kind: "text", placeholder: "Escalate, monitor, or close?" },
        { id: "rationale", label: "Disposition rationale", kind: "textarea", placeholder: "Why is this the right decision?" }
      ],
      checklist: ["Signal is summarized", "Context is considered", "Disposition is explicit", "Rationale is audit-friendly"]
    }
  };

  function repoRoot() {
    var script = document.currentScript;
    if (!script || !script.src) return new URL("./", window.location.href).toString();
    return new URL("../", script.src).toString();
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function getDemoOverride(title) {
    return DEMO_CONTENT_OVERRIDES[title] || null;
  }

  function replaceTextIfMatches(node, expected, value) {
    if (!node) return;
    var current = (node.textContent || "").trim();
    if (!expected || current === expected) {
      node.textContent = value;
    }
  }

  function buildFieldMarkup(field) {
    var base = '<label class="lab-field"><span>' + field.label + '</span>';
    if (field.kind === "textarea") {
      return base + '<textarea data-lab-field="' + field.id + '" placeholder="' + (field.placeholder || "") + '"></textarea></label>';
    }
    return base + '<input data-lab-field="' + field.id + '" type="text" placeholder="' + (field.placeholder || "") + '"></label>';
  }

  function buildChecklistMarkup(items) {
    return items.map(function (item) {
      return '<li>' + item + '</li>';
    }).join("");
  }

  function enhanceStandardDemoShell() {
    var shell = document.querySelector(".demo-shell");
    var guide = document.querySelector(".demo-standard-guide");
    var strip = document.querySelector(".demo-context-strip");
    var titleEl = shell ? shell.querySelector("h1") : null;
    if (!shell || !guide || !strip || !titleEl) return;

    var title = (titleEl.textContent || "").trim();
    var profile = getDemoOverride(title);
    if (!profile) return;

    replaceTextIfMatches(shell.querySelector(".demo-lede"), GENERIC_REPO_COPY, profile.summary);

    var aboutCard = Array.prototype.slice.call(guide.querySelectorAll(".info-card")).find(function (card) {
      return /what this demo is about/i.test(card.querySelector("h3") ? card.querySelector("h3").textContent : "");
    });
    if (aboutCard) {
      var aboutPara = aboutCard.querySelector("p");
      replaceTextIfMatches(aboutPara, GENERIC_REPO_COPY, profile.about);
    }

    var lab = document.createElement("section");
    lab.className = "demo-panel scenario-lab";
    lab.innerHTML = [
      '<div class="section-header left">',
      '<p class="section-kicker">Interactive Scenario Lab</p>',
      '<h2>' + profile.labTitle + '</h2>',
      '<p>Use this browser workspace to structure a decision, compare trade-offs, and generate a classroom-ready recommendation before moving to discussion.</p>',
      "</div>",
      '<div class="lab-grid">',
      '<div class="lab-column lab-inputs">',
      profile.fields.map(buildFieldMarkup).join(""),
      '<div class="button-row"><button type="button" class="btn btn-primary" data-lab-action="analyze">Analyze Scenario</button><button type="button" class="btn btn-secondary" data-lab-action="reset">Reset</button></div>',
      "</div>",
      '<div class="lab-column lab-outputs">',
      '<div class="lab-score"><span class="score-label">Scenario readiness</span><strong data-lab-score>0%</strong></div>',
      '<div class="mini-panel"><h3>Recommendation</h3><p data-lab-recommendation>Fill in the scenario details, then analyze the case to generate a teaching recommendation.</p></div>',
      '<div class="mini-panel"><h3>Evidence to validate next</h3><ul class="plain-list" data-lab-evidence>' + buildChecklistMarkup(profile.checklist) + '</ul></div>',
      '<div class="mini-panel"><h3>Reflection prompt</h3><p data-lab-reflection>Ask learners what assumption they trust least and what real-world check they would run next.</p></div>',
      "</div>",
      "</div>"
    ].join("");
    guide.parentNode.insertBefore(lab, guide);

    function readValues() {
      var values = {};
      lab.querySelectorAll("[data-lab-field]").forEach(function (field) {
        values[field.getAttribute("data-lab-field")] = (field.value || "").trim();
      });
      return values;
    }

    function analyze() {
      var values = readValues();
      var keys = Object.keys(values);
      var filled = keys.filter(function (key) { return values[key]; });
      var readiness = keys.length ? Math.round((filled.length / keys.length) * 100) : 0;
      var gaps = keys.filter(function (key) { return !values[key]; }).length;
      var recommendation = "The scenario is still too sparse. Add more concrete business context before taking action.";
      if (readiness >= 85) {
        recommendation = "This scenario is structured enough for a decision discussion. Move into trade-offs, controls, and rollout risk.";
      } else if (readiness >= 60) {
        recommendation = "The scenario is usable, but one or two critical assumptions still need evidence before the recommendation is reliable.";
      } else if (readiness >= 35) {
        recommendation = "You have the start of a workable case, but the decision logic is still weak. Clarify success criteria and constraints next.";
      }

      var reflection = profile.focus + " " + profile.observe;
      if (gaps === 0) {
        reflection = profile.note;
      }

      lab.querySelector("[data-lab-score]").textContent = readiness + "%";
      lab.querySelector("[data-lab-recommendation]").textContent = recommendation;
      lab.querySelector("[data-lab-reflection]").textContent = reflection;

      var evidenceEl = lab.querySelector("[data-lab-evidence]");
      evidenceEl.innerHTML = profile.checklist.map(function (item, index) {
        var strong = filled[index] ? "Strong" : "Needs work";
        return "<li><strong>" + strong + ":</strong> " + item + "</li>";
      }).join("");
    }

    lab.querySelector('[data-lab-action="analyze"]').addEventListener("click", analyze);
    lab.querySelector('[data-lab-action="reset"]').addEventListener("click", function () {
      lab.querySelectorAll("[data-lab-field]").forEach(function (field) {
        field.value = "";
      });
      lab.querySelector("[data-lab-score]").textContent = "0%";
      lab.querySelector("[data-lab-recommendation]").textContent = "Fill in the scenario details, then analyze the case to generate a teaching recommendation.";
      lab.querySelector("[data-lab-reflection]").textContent = "Ask learners what assumption they trust least and what real-world check they would run next.";
      lab.querySelector("[data-lab-evidence]").innerHTML = buildChecklistMarkup(profile.checklist);
    });
  }

  function enhanceGenericAboutPage() {
    var heroTitle = document.querySelector(".page-hero h1");
    if (!heroTitle) return;
    var title = (heroTitle.textContent || "").trim();
    var profile = getDemoOverride(title);
    if (!profile) return;

    replaceTextIfMatches(document.querySelector(".page-hero .hero-subtitle"), GENERIC_REPO_COPY, profile.summary);

    var aboutHeader = document.querySelector("#about .section-header p:last-child");
    replaceTextIfMatches(aboutHeader, GENERIC_REPO_COPY, profile.about);

    var infoCards = Array.prototype.slice.call(document.querySelectorAll("#context .info-card"));
    infoCards.forEach(function (card) {
      var heading = card.querySelector("h3");
      if (!heading) return;
      var text = heading.textContent.trim().toLowerCase();
      if (text === "core context") {
        var paragraphs = card.querySelectorAll("p");
        if (paragraphs[0]) paragraphs[0].textContent = profile.focus;
        if (paragraphs[1]) paragraphs[1].textContent = profile.observe;
      }
      if (text === "what students should note") {
        var note = card.querySelector("p");
        if (note) note.textContent = profile.note;
      }
    });
  }

  ready(function () {
    var root = repoRoot();

    document.querySelectorAll(".nav-links").forEach(function (container) {
      if (!container.querySelector('[data-kld-nav="browse"]')) {
        var browse = document.createElement("a");
        browse.className = "nav-link";
        browse.href = new URL("browse/index.html", root).toString();
        browse.textContent = "Browse Demos";
        browse.setAttribute("data-kld-nav", "browse");
        container.appendChild(browse);
      }

      if (!container.querySelector('[data-kld-nav="packs"]')) {
        var packs = document.createElement("a");
        packs.className = "nav-link";
        packs.href = new URL("course-packs/index.html", root).toString();
        packs.textContent = "Course Packs";
        packs.setAttribute("data-kld-nav", "packs");
        container.appendChild(packs);
      }

      if (!container.querySelector('[data-kld-nav="assignments"]')) {
        var assignments = document.createElement("a");
        assignments.className = "nav-link";
        assignments.href = new URL("Assignments/index.html", root).toString();
        assignments.textContent = "Assignments";
        assignments.setAttribute("data-kld-nav", "assignments");
        container.appendChild(assignments);
      }
    });

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

    enhanceStandardDemoShell();
    enhanceGenericAboutPage();
  });
})();
