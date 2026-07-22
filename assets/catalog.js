(function () {
  function rootFromScript() {
    var script = document.currentScript;
    if (!script || !script.src) {
      return new URL("../", window.location.href).toString();
    }
    return new URL("../", script.src).toString();
  }

  var repoRoot = rootFromScript();
  var dataUrl = new URL("data/site-catalog.json", repoRoot).toString();

  var coursePacks = [
    {
      slug: "cfo-office",
      title: "CFO Office",
      path: "courses/cfo-office.html",
      audience: "CFOs, controllership, treasury, finance transformation",
      catalogPath: "CourseCatalogs/FinanceTransformation/CFO_DEMO_STANDARDS.md",
      assignmentPaths: []
    },
    {
      slug: "digital-payments",
      title: "Digital Payments",
      path: "courses/digital-payments.html",
      audience: "payment rails, UPI, cards, reconciliation, CBDC, wallet operations",
      catalogPath: "CourseCatalogs/DigitalPayments/BUILD_SPEC.md",
      assignmentPaths: []
    },
    {
      slug: "treasury",
      title: "Treasury Management",
      path: "courses/treasury-management.html",
      audience: "CFO workshops, treasury, liquidity, hedging",
      catalogPath: null,
      assignmentPaths: []
    },
    {
      slug: "ai-ml-workflows",
      title: "AI/ML Workflows",
      path: "courses/ai-ml-workflows.html",
      audience: "AI product, governance, workflow design",
      catalogPath: "CourseCatalogs/Management_of_AI_Products_Catalog.md",
      assignmentPaths: []
    },
    {
      slug: "risk",
      title: "Risk Management",
      path: "courses/risk-management.html",
      audience: "market, counterparty, operational, cyber risk",
      catalogPath: null,
      assignmentPaths: []
    },
    {
      slug: "quant",
      title: "Quant Finance",
      path: "courses/quant-finance.html",
      audience: "options, VaR, portfolio, valuation",
      catalogPath: "CourseCatalogs/AI_ML_Financial_Services_Catalog.md",
      assignmentPaths: ["Assignments/Session10_WealthManagement/README.md"]
    },
    {
      slug: "cyber",
      title: "Cybersecurity",
      path: "courses/cybersecurity.html",
      audience: "IoT, network, malware, threat modeling",
      catalogPath: "CourseCatalogs/Cyber_Security_Catalog.md",
      assignmentPaths: []
    },
    {
      slug: "compliance",
      title: "Compliance & Governance",
      path: "courses/compliance.html",
      audience: "AI governance, AML, regulation, model risk",
      catalogPath: "CourseCatalogs/Public_Policy_Governance_Catalog.md",
      assignmentPaths: ["Assignments/Session13_ModelGovernance/README.md", "Assignments/Session14_ResponsibleAI/README.md"]
    },
    {
      slug: "rag-nlp",
      title: "RAG & NLP",
      path: "courses/rag-nlp.html",
      audience: "retrieval, summarization, voice, knowledge assistants",
      catalogPath: "CourseCatalogs/NLP/README.md",
      assignmentPaths: []
    },
    {
      slug: "banking",
      title: "Banking & Finance",
      path: "courses/banking.html",
      audience: "banking analytics, fraud, lending, customer risk",
      catalogPath: "COURSE_COMPANION_MAP.md",
      assignmentPaths: [
        "Assignments/Session03_CreditRisk/README.md",
        "Assignments/Session04_FraudDetection/README.md",
        "Assignments/Session05_Segmentation/README.md"
      ]
    }
  ];

  function toAbsolute(path) {
    return new URL(path, repoRoot).toString();
  }

  function inferMode(text) {
    var value = (text || "").toLowerCase();
    if (value.indexOf("browser slm") !== -1 || value.indexOf("local ai") !== -1) return "Browser AI";
    if (value.indexOf("colab") !== -1 && value.indexOf("browser") !== -1) return "Multi-Mode";
    if (value.indexOf("colab") !== -1 && value.indexOf("local") !== -1) return "Multi-Mode";
    if (value.indexOf("multi-mode") !== -1) return "Multi-Mode";
    if (value.indexOf("colab") !== -1) return "Colab";
    if (value.indexOf("local python") !== -1) return "Local";
    if (value.indexOf("browser") !== -1) return "Browser";
    if (value.indexOf("local analytics") !== -1) return "Browser";
    if (value.indexOf("no external api") !== -1) return "Browser";
    return "Browser";
  }

  function parseCoursePage(meta, html, pageUrl) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    var subtitle = (doc.querySelector(".hero-subtitle") || {}).textContent || "";
    var statValues = Array.prototype.slice.call(doc.querySelectorAll(".stat-card .stat-value")).map(function (el) {
      return el.textContent.trim();
    });
    var registeredDemos = statValues[0] || "0";

    var demos = Array.prototype.slice.call(doc.querySelectorAll(".demo-card")).map(function (card) {
      var aboutLink = card.getAttribute("href") || "";
      var launchLink = "";
      var launchEl = card.querySelector(".launch-demo");
      if (launchEl) launchLink = launchEl.getAttribute("href") || "";
      var title = ((card.querySelector("h3") || {}).textContent || "").trim();
      var level = ((card.querySelector(".level-badge") || {}).textContent || "").trim();
      var paragraphs = card.querySelectorAll("p");
      var summary = paragraphs[0] ? paragraphs[0].textContent.trim() : "";
      var teacherCue = ((card.querySelector(".teacher-cue") || {}).textContent || "").replace(/\s+/g, " ").trim();
      var badgeSpans = Array.prototype.slice.call(card.querySelectorAll(".demo-badges .mode-badge")).map(function (el) {
        return el.textContent.trim();
      });
      var metaSpans = Array.prototype.slice.call(card.querySelectorAll(".demo-meta span")).map(function (el) {
        return el.textContent.trim();
      });
      var mode = badgeSpans[0] || inferMode(summary + " " + metaSpans.join(" "));

      return {
        title: title,
        level: level || "Unspecified",
        summary: summary,
        teacherCue: teacherCue,
        duration: badgeSpans[1] || "20-30 min",
        surface: metaSpans[0] || "Browser-based",
        mode: mode,
        courseSlug: meta.slug,
        courseTitle: meta.title,
        courseSlugs: [meta.slug],
        courseTitles: [meta.title],
        aboutUrl: new URL(aboutLink, pageUrl).toString(),
        launchUrl: launchLink ? new URL(launchLink, pageUrl).toString() : "",
        readiness: badgeSpans[2] || "Classroom Ready"
      };
    });

    return {
      slug: meta.slug,
      title: meta.title,
      audience: meta.audience,
      subtitle: subtitle.trim(),
      pageUrl: pageUrl,
      registeredDemos: registeredDemos,
      catalogUrl: meta.catalogPath ? toAbsolute(meta.catalogPath) : "",
      assignments: meta.assignmentPaths.map(toAbsolute),
      demos: demos
    };
  }

  var cachePromise = null;

  function absolutizeCatalog(payload) {
    var courses = payload.courses.map(function (course) {
      return {
        slug: course.slug,
        title: course.title,
        audience: course.audience,
        subtitle: course.subtitle,
        pageUrl: toAbsolute(course.pagePath),
        registeredDemos: course.registeredDemos,
        catalogUrl: course.catalogPath ? toAbsolute(course.catalogPath) : "",
        assignments: (course.assignments || []).map(toAbsolute),
        demos: course.demos.map(function (demo) {
          return {
            title: demo.title,
            level: demo.level,
            summary: demo.summary,
            teacherCue: demo.teacherCue,
            duration: demo.duration,
            surface: demo.surface,
            mode: demo.mode,
            courseSlug: demo.courseSlug,
            courseTitle: demo.courseTitle,
            courseSlugs: demo.courseSlugs || [demo.courseSlug],
            courseTitles: demo.courseTitles || [demo.courseTitle],
            aboutUrl: toAbsolute(demo.aboutPath),
            launchUrl: toAbsolute(demo.launchPath),
            readiness: demo.readiness
          };
        })
      };
    });

    var demos = payload.demos.map(function (demo) {
      return {
        title: demo.title,
        level: demo.level,
        summary: demo.summary,
        teacherCue: demo.teacherCue,
        duration: demo.duration,
        surface: demo.surface,
        mode: demo.mode,
        courseSlug: demo.courseSlug,
        courseTitle: demo.courseTitle,
        courseSlugs: demo.courseSlugs || [demo.courseSlug],
        courseTitles: demo.courseTitles || [demo.courseTitle],
        aboutUrl: toAbsolute(demo.aboutPath),
        launchUrl: toAbsolute(demo.launchPath),
        readiness: demo.readiness
      };
    });

    return {
      repoRoot: repoRoot,
      courses: courses,
      demos: demos,
      counts: payload.counts,
      modeCounts: payload.modeCounts,
      source: "json"
    };
  }

  function scrapeCatalog() {
    return Promise.all(
      coursePacks.map(function (meta) {
        var pageUrl = toAbsolute(meta.path);
        return fetch(pageUrl)
          .then(function (response) {
            if (!response.ok) throw new Error("Failed to load " + meta.path);
            return response.text();
          })
          .then(function (html) {
            return parseCoursePage(meta, html, pageUrl);
          });
      })
    ).then(function (courses) {
      var dedupe = {};
      courses.forEach(function (course) {
        course.demos.forEach(function (demo) {
          var existing = dedupe[demo.aboutUrl];
          if (!existing) {
            dedupe[demo.aboutUrl] = demo;
            return;
          }
          demo.courseSlugs.forEach(function (slug) {
            if (existing.courseSlugs.indexOf(slug) === -1) existing.courseSlugs.push(slug);
          });
          demo.courseTitles.forEach(function (title) {
            if (existing.courseTitles.indexOf(title) === -1) existing.courseTitles.push(title);
          });
        });
      });

      var demos = Object.keys(dedupe).map(function (key) {
        return dedupe[key];
      }).sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });

      var modeCounts = {};
      demos.forEach(function (demo) {
        modeCounts[demo.mode] = (modeCounts[demo.mode] || 0) + 1;
      });

      return {
        repoRoot: repoRoot,
        courses: courses,
        demos: demos,
        counts: {
          coursePacks: courses.length,
          curatedDemos: demos.length,
          runModes: Object.keys(modeCounts).length
        },
        modeCounts: modeCounts,
        source: "scrape"
      };
    });
  }

  function loadCatalog() {
    if (cachePromise) return cachePromise;

    cachePromise = fetch(dataUrl)
      .then(function (response) {
        if (!response.ok) throw new Error("Catalog JSON not found");
        return response.json();
      })
      .then(absolutizeCatalog)
      .catch(function () {
        return scrapeCatalog();
      });

    return cachePromise;
  }

  window.KLDCatalog = {
    repoRoot: repoRoot,
    dataUrl: dataUrl,
    coursePacks: coursePacks.slice(),
    loadCatalog: loadCatalog
  };
})();
