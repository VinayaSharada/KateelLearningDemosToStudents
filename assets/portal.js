(function () {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function updateText(selector, value) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  var COURSE_ICONS = {
    "fitml": "⚖️",
    "cfo-office": "📊",
    "digital-payments": "💳",
    "treasury": "🏦",
    "ai-ml-workflows": "🤖",
    "risk": "⚠️",
    "quant": "💰",
    "cyber": "🔐",
    "compliance": "📋",
    "rag-nlp": "📝",
    "banking": "🏦"
  };

  function getCourseIcon(slug) {
    return COURSE_ICONS[slug] || "📚";
  }

  function highlightMatches(text, tokens) {
    if (!tokens || !tokens.length || !text) return escapeHtml(text);
    var escaped = escapeHtml(text);
    tokens.forEach(function (token) {
      if (!token || token.length < 2) return;
      var cleanToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var regex = new RegExp("(" + cleanToken + ")", "gi");
      escaped = escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
    });
    return escaped;
  }

  function renderHome(catalog) {
    updateText("[data-kld-curated-demos]", String(catalog.counts.curatedDemos));
    updateText("[data-kld-course-packs]", String(catalog.counts.coursePacks));
    updateText("[data-kld-run-modes]", String(catalog.counts.runModes));
  }

  function buildDemoCard(demo, searchTokens) {
    var courseLabel = demo.courseTitle;
    if (demo.courseTitles && demo.courseTitles.length > 1) {
      courseLabel = demo.courseTitles[0] + " + " + (demo.courseTitles.length - 1) + " more";
    }

    var titleHtml = highlightMatches(demo.title, searchTokens);
    var summaryHtml = highlightMatches(demo.summary, searchTokens);

    return [
      '<article class="demo-card demo-card-rich">',
      '<div class="demo-card-top">',
      "<div>",
      "<h3>" + titleHtml + "</h3>",
      '<p class="card-eyebrow">' + escapeHtml(courseLabel) + " • " + escapeHtml(demo.mode) + "</p>",
      "</div>",
      '<span class="level-badge">' + escapeHtml(demo.level) + "</span>",
      "</div>",
      "<p>" + summaryHtml + "</p>",
      '<div class="demo-badges"><span class="mode-badge">' + escapeHtml(demo.mode) + "</span><span class=\"mode-badge\">" + escapeHtml(demo.duration) + "</span><span class=\"mode-badge\">" + escapeHtml(demo.readiness) + "</span></div>",
      '<p class="teacher-cue"><strong>Teacher cue:</strong> ' + escapeHtml(demo.teacherCue.replace(/^Teacher cue:\s*/i, "")) + "</p>",
      '<div class="demo-actions"><a class="btn-mini" href="' + escapeHtml(demo.aboutUrl) + '">About</a><a class="btn-mini outline launch-demo" href="' + escapeHtml(demo.launchUrl) + '">Launch</a></div>',
      "</article>"
    ].join("");
  }

  function matchDemo(demo, tokens, course, level, mode) {
    if (course !== "all" && (demo.courseSlugs || [demo.courseSlug]).indexOf(course) === -1) return false;
    if (level !== "all" && demo.level !== level) return false;
    if (mode !== "all" && demo.mode !== mode) return false;

    if (!tokens.length) return true;

    var textCorpus = [
      demo.title,
      demo.summary,
      demo.courseTitle,
      (demo.courseTitles || []).join(" "),
      demo.teacherCue,
      demo.mode,
      demo.level,
      // Common abbreviations
      demo.courseSlug === "fitml" ? "fitml facct fairness xai shap lime trust ethics" : "",
      demo.courseSlug === "treasury" ? "treasury cfo cash liquidity fx hedging dso ar aging" : "",
      demo.courseSlug === "ai-ml-workflows" ? "aiml product ml workflow swarm" : "",
      demo.courseSlug === "cyber" ? "cyber security siem incident malware soc" : ""
    ].join(" ").toLowerCase();

    for (var i = 0; i < tokens.length; i++) {
      if (textCorpus.indexOf(tokens[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  function setupSearchClear(inputEl, clearBtn, onClear) {
    if (!inputEl || !clearBtn) return;
    function syncVisibility() {
      clearBtn.style.display = inputEl.value ? "inline-flex" : "none";
    }
    inputEl.addEventListener("input", syncVisibility);
    clearBtn.addEventListener("click", function () {
      inputEl.value = "";
      syncVisibility();
      inputEl.focus();
      onClear();
    });
    syncVisibility();
  }

  function renderBrowse(catalog) {
    var mount = document.querySelector("#browseDemoGrid");
    if (!mount) return;

    updateText("[data-kld-browse-demo-count]", String(catalog.demos.length));
    updateText("[data-kld-browse-course-count]", String(catalog.courses.length));

    // Parse URL search params
    var urlParams = new URLSearchParams(window.location.search);
    var initialQuery = urlParams.get("q") || "";
    var initialCourse = urlParams.get("course") || "all";
    var initialLevel = urlParams.get("level") || "all";
    var initialMode = urlParams.get("mode") || "all";

    var state = {
      search: initialQuery.trim().toLowerCase(),
      course: initialCourse,
      level: initialLevel,
      mode: initialMode
    };

    var courseSelect = document.querySelector("#browseCourse");
    var levelSelect = document.querySelector("#browseLevel");
    var modeSelect = document.querySelector("#browseMode");
    var searchInput = document.querySelector("#browseSearch");
    var searchClear = document.querySelector("#browseSearchClear");
    var empty = document.querySelector("#browseEmpty");
    var summary = document.querySelector("#browseSummary");
    var chipsMount = document.querySelector("#courseChipsMount");
    var bannerMount = document.querySelector("#courseBannerMount");

    if (searchInput) searchInput.value = initialQuery;

    // Populate course dropdown
    catalog.courses.forEach(function (course) {
      var option = document.createElement("option");
      option.value = course.slug;
      option.textContent = getCourseIcon(course.slug) + " " + course.title;
      if (course.slug === state.course) option.selected = true;
      courseSelect.appendChild(option);
    });

    // Populate level dropdown
    Array.from(new Set(catalog.demos.map(function (demo) { return demo.level; }))).sort().forEach(function (level) {
      var option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      if (level === state.level) option.selected = true;
      levelSelect.appendChild(option);
    });

    // Populate mode dropdown
    Array.from(new Set(catalog.demos.map(function (demo) { return demo.mode; }))).sort().forEach(function (mode) {
      var option = document.createElement("option");
      option.value = mode;
      option.textContent = mode;
      if (mode === state.mode) option.selected = true;
      modeSelect.appendChild(option);
    });

    // Build Course Filter Chips
    function renderChips() {
      if (!chipsMount) return;
      var chipsHtml = [
        '<div class="course-chips-container">',
        '<div class="course-chips-header">',
        '<span>Quick Course Filter (' + catalog.courses.length + ' Courses)</span>',
        state.course !== "all" || state.search ? '<a href="javascript:void(0)" id="resetAllFilters" style="color: #38bdf8; text-decoration: none;">Reset all filters</a>' : '',
        '</div>',
        '<div class="course-chips">'
      ];

      // All chip
      var isAllActive = state.course === "all" ? " active" : "";
      chipsHtml.push('<button type="button" class="course-chip' + isAllActive + '" data-course="all"><span>🌐 All Courses</span><span class="chip-count">' + catalog.demos.length + "</span></button>");

      // Course chips
      catalog.courses.forEach(function (course) {
        var isActive = state.course === course.slug ? " active" : "";
        var count = course.demos ? course.demos.length : (course.registeredDemos || 0);
        var icon = getCourseIcon(course.slug);
        chipsHtml.push(
          '<button type="button" class="course-chip' + isActive + '" data-course="' + escapeHtml(course.slug) + '">' +
          "<span>" + icon + " " + escapeHtml(course.title) + "</span>" +
          '<span class="chip-count">' + count + "</span>" +
          "</button>"
        );
      });

      chipsHtml.push("</div></div>");
      chipsMount.innerHTML = chipsHtml.join("");

      chipsMount.querySelectorAll(".course-chip").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var targetCourse = this.getAttribute("data-course");
          state.course = targetCourse;
          if (courseSelect) courseSelect.value = targetCourse;
          syncUrl();
          renderChips();
          render();
        });
      });

      var resetBtn = chipsMount.querySelector("#resetAllFilters");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          state.search = "";
          state.course = "all";
          state.level = "all";
          state.mode = "all";
          if (searchInput) searchInput.value = "";
          if (courseSelect) courseSelect.value = "all";
          if (levelSelect) levelSelect.value = "all";
          if (modeSelect) modeSelect.value = "all";
          if (searchClear) searchClear.style.display = "none";
          syncUrl();
          renderChips();
          render();
        });
      }
    }

    // Render active course banner or course-search alert
    function renderCourseBanner(demos) {
      if (!bannerMount) return;

      if (state.course !== "all") {
        var activeCourse = catalog.courses.find(function (c) { return c.slug === state.course; });
        if (activeCourse) {
          var icon = getCourseIcon(activeCourse.slug);
          var syllabusBtn = activeCourse.catalogUrl ? '<a class="btn-mini outline" href="' + escapeHtml(activeCourse.catalogUrl) + '">Syllabus / Catalog</a>' : '';
          var assignmentBtn = activeCourse.assignments && activeCourse.assignments.length ? '<a class="btn-mini outline" href="' + escapeHtml(activeCourse.assignments[0]) + '">Assignments (' + activeCourse.assignments.length + ')</a>' : '';

          bannerMount.innerHTML = [
            '<div class="course-overview-banner">',
            '<div class="course-banner-content">',
            '<h3>' + icon + ' ' + escapeHtml(activeCourse.title) + '</h3>',
            '<p>' + escapeHtml(activeCourse.subtitle || activeCourse.audience) + '</p>',
            '</div>',
            '<div class="course-banner-actions">',
            '<a class="btn-mini" href="' + escapeHtml(activeCourse.pageUrl) + '">Open Full Course Pack</a>',
            syllabusBtn,
            assignmentBtn,
            '<button type="button" class="btn-mini outline" id="clearCourseFilter">Show All Courses</button>',
            '</div>',
            '</div>'
          ].join("");

          var clearBtn = bannerMount.querySelector("#clearCourseFilter");
          if (clearBtn) {
            clearBtn.addEventListener("click", function () {
              state.course = "all";
              if (courseSelect) courseSelect.value = "all";
              syncUrl();
              renderChips();
              render();
            });
          }
          return;
        }
      }

      // Check if search matches any course directly
      if (state.search && state.search.length >= 3) {
        var matchedCourse = catalog.courses.find(function (c) {
          return c.title.toLowerCase().indexOf(state.search) !== -1 ||
                 (c.subtitle && c.subtitle.toLowerCase().indexOf(state.search) !== -1) ||
                 (c.audience && c.audience.toLowerCase().indexOf(state.search) !== -1) ||
                 (state.search === "fitml" && c.slug === "fitml");
        });

        if (matchedCourse && matchedCourse.slug !== state.course) {
          bannerMount.innerHTML = [
            '<div class="course-match-alert">',
            '<div>📚 Matched Course Pack: <strong>' + escapeHtml(matchedCourse.title) + '</strong> (' + matchedCourse.registeredDemos + ' demos)</div>',
            '<div style="display:flex; gap:0.5rem;">',
            '<button type="button" class="btn-mini" id="filterMatchedCourse">View This Course</button>',
            '<a class="btn-mini outline" href="' + escapeHtml(matchedCourse.pageUrl) + '">Open Course Pack</a>',
            '</div>',
            '</div>'
          ].join("");

          var filterBtn = bannerMount.querySelector("#filterMatchedCourse");
          if (filterBtn) {
            filterBtn.addEventListener("click", function () {
              state.course = matchedCourse.slug;
              if (courseSelect) courseSelect.value = matchedCourse.slug;
              syncUrl();
              renderChips();
              render();
            });
          }
          return;
        }
      }

      bannerMount.innerHTML = "";
    }

    function syncUrl() {
      var params = new URLSearchParams();
      if (state.search) params.set("q", state.search);
      if (state.course !== "all") params.set("course", state.course);
      if (state.level !== "all") params.set("level", state.level);
      if (state.mode !== "all") params.set("mode", state.mode);

      var newSearch = params.toString();
      var newUrl = window.location.pathname + (newSearch ? "?" + newSearch : "");
      window.history.replaceState(null, "", newUrl);
    }

    function filtered() {
      var tokens = state.search.split(/\s+/).filter(Boolean);
      return catalog.demos.filter(function (demo) {
        return matchDemo(demo, tokens, state.course, state.level, state.mode);
      });
    }

    function render() {
      var tokens = state.search.split(/\s+/).filter(Boolean);
      var demos = filtered();

      var courseName = state.course !== "all"
        ? (catalog.courses.find(function (c) { return c.slug === state.course; }) || {}).title || state.course
        : "all courses";

      var summaryText = demos.length + " curated demo" + (demos.length === 1 ? "" : "s") + " shown";
      if (state.search) summaryText += ' matching "' + state.search + '"';
      if (state.course !== "all") summaryText += ' in ' + courseName;
      summary.textContent = summaryText;

      renderCourseBanner(demos);

      if (!demos.length) {
        mount.innerHTML = "";
        empty.hidden = false;
        return;
      }
      empty.hidden = true;
      mount.innerHTML = demos.map(function (demo) {
        return buildDemoCard(demo, tokens);
      }).join("");
    }

    setupSearchClear(searchInput, searchClear, function () {
      state.search = "";
      syncUrl();
      renderChips();
      render();
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.search = searchInput.value.trim().toLowerCase();
        syncUrl();
        renderChips();
        render();
      });
    }

    if (courseSelect) {
      courseSelect.addEventListener("change", function () {
        state.course = courseSelect.value;
        syncUrl();
        renderChips();
        render();
      });
    }

    if (levelSelect) {
      levelSelect.addEventListener("change", function () {
        state.level = levelSelect.value;
        syncUrl();
        render();
      });
    }

    if (modeSelect) {
      modeSelect.addEventListener("change", function () {
        state.mode = modeSelect.value;
        syncUrl();
        render();
      });
    }

    renderChips();
    render();
  }

  function renderHomeSearch(catalog) {
    var searchInput = document.querySelector("#homeSearch");
    var mount = document.querySelector("#homeDemoGrid");
    if (!searchInput || !mount) return;

    var summary = document.querySelector("#homeSearchSummary");
    var chipsMount = document.querySelector("#homeCourseChips");
    var searchClear = document.querySelector("#homeSearchClear");
    var fullBrowseBtn = document.querySelector("#homeFullBrowseBtn");

    var state = {
      search: "",
      course: "all"
    };

    function renderChips() {
      if (!chipsMount) return;
      var html = ['<div class="course-chips">'];
      var isAllActive = state.course === "all" ? " active" : "";
      html.push('<button type="button" class="course-chip' + isAllActive + '" data-course="all"><span>🌐 All Demos</span><span class="chip-count">' + catalog.demos.length + "</span></button>");

      catalog.courses.forEach(function (course) {
        var isActive = state.course === course.slug ? " active" : "";
        var count = course.demos ? course.demos.length : (course.registeredDemos || 0);
        var icon = getCourseIcon(course.slug);
        html.push(
          '<button type="button" class="course-chip' + isActive + '" data-course="' + escapeHtml(course.slug) + '">' +
          "<span>" + icon + " " + escapeHtml(course.title) + "</span>" +
          '<span class="chip-count">' + count + "</span>" +
          "</button>"
        );
      });
      html.push("</div>");
      chipsMount.innerHTML = html.join("");

      chipsMount.querySelectorAll(".course-chip").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.course = this.getAttribute("data-course");
          renderChips();
          render();
        });
      });
    }

    function filtered() {
      var tokens = state.search.split(/\s+/).filter(Boolean);
      return catalog.demos.filter(function (demo) {
        return matchDemo(demo, tokens, state.course, "all", "all");
      });
    }

    function render() {
      var tokens = state.search.split(/\s+/).filter(Boolean);
      var demos = filtered();

      if (summary) {
        var courseName = state.course !== "all"
          ? (catalog.courses.find(function (c) { return c.slug === state.course; }) || {}).title || state.course
          : "all courses";

        if (state.search) {
          summary.textContent = 'Found ' + demos.length + ' demo' + (demos.length === 1 ? '' : 's') + ' matching "' + state.search + '" in ' + courseName;
        } else if (state.course !== "all") {
          summary.textContent = 'Showing ' + demos.length + ' demo' + (demos.length === 1 ? '' : 's') + ' in ' + courseName;
        } else {
          summary.textContent = 'Showing featured demos across ' + catalog.courses.length + ' course packs (' + catalog.demos.length + ' total)';
        }
      }

      if (fullBrowseBtn) {
        var params = new URLSearchParams();
        if (state.search) params.set("q", state.search);
        if (state.course !== "all") params.set("course", state.course);
        var searchStr = params.toString();
        fullBrowseBtn.href = "browse/index.html" + (searchStr ? "?" + searchStr : "");
        fullBrowseBtn.textContent = "Open these " + demos.length + " demos in full catalog →";
      }

      // Show top 12 results if all, or all matches if filtered
      var displayDemos = state.search || state.course !== "all" ? demos : demos.slice(0, 12);

      if (!displayDemos.length) {
        mount.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1; padding: 2rem;">No demos found matching the current search. Try another keyword or switch back to All Demos.</div>';
        return;
      }

      mount.innerHTML = displayDemos.map(function (demo) {
        return buildDemoCard(demo, tokens);
      }).join("");
    }

    setupSearchClear(searchInput, searchClear, function () {
      state.search = "";
      renderChips();
      render();
    });

    searchInput.addEventListener("input", function () {
      state.search = searchInput.value.trim().toLowerCase();
      renderChips();
      render();
    });

    renderChips();
    render();
  }

  function renderCoursePacks(catalog) {
    var mount = document.querySelector("#coursePackGrid");
    if (!mount) return;

    mount.innerHTML = catalog.courses.map(function (course) {
      var assignmentLinks = course.assignments && course.assignments.length
        ? course.assignments.map(function (url, index) {
            return '<a class="btn-mini outline" href="' + escapeHtml(url) + '">Assignment ' + (index + 1) + "</a>";
          }).join("")
        : '<span class="btn-mini outline">Assignments coming soon</span>';

      var catalogLink = course.catalogUrl
        ? '<a class="btn-mini" href="' + escapeHtml(course.catalogUrl) + '">Catalog / Syllabus</a>'
        : '<span class="btn-mini">Course page only</span>';

      var icon = getCourseIcon(course.slug);

      return [
        '<article class="info-card course-pack-card">',
        '<p class="section-kicker">Course Pack</p>',
        "<h3>" + icon + " " + escapeHtml(course.title) + "</h3>",
        "<p>" + escapeHtml(course.subtitle || course.audience) + "</p>",
        '<div class="demo-badges"><span class="mode-badge">' + escapeHtml(course.registeredDemos) + ' demos</span><span class="mode-badge">Curated</span><span class="mode-badge">' + escapeHtml(course.audience) + "</span></div>",
        '<div class="feature-grid"><div class="feature"><span>Entry</span> About → Launch</div><div class="feature"><span>Audience</span> ' + escapeHtml(course.audience) + "</div></div>",
        '<div class="demo-actions"><a class="btn-mini" href="' + escapeHtml(course.pageUrl) + '">Open course pack</a>' + catalogLink + "</div>",
        '<div class="resource-row">' + assignmentLinks + "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  ready(function () {
    if (!window.KLDCatalog || !window.KLDCatalog.loadCatalog) return;
    window.KLDCatalog.loadCatalog()
      .then(function (catalog) {
        renderHome(catalog);
        renderHomeSearch(catalog);
        renderBrowse(catalog);
        renderCoursePacks(catalog);
      })
      .catch(function (error) {
        var mounts = ["#browseSummary", "#coursePackGrid", "#homeSearchSummary"];
        mounts.forEach(function (selector) {
          var el = document.querySelector(selector);
          if (el && (selector === "#browseSummary" || selector === "#homeSearchSummary")) el.textContent = "Catalog data could not be loaded.";
          if (el && selector === "#coursePackGrid") el.innerHTML = '<div class="empty-state">Course-pack data could not be loaded right now.</div>';
        });
        console.error(error);
      });
  });
})();
