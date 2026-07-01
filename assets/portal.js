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

  function renderHome(catalog) {
    updateText("[data-kld-curated-demos]", String(catalog.counts.curatedDemos));
    updateText("[data-kld-course-packs]", String(catalog.counts.coursePacks));
    updateText("[data-kld-run-modes]", String(catalog.counts.runModes));
  }

  function buildDemoCard(demo) {
    var courseLabel = demo.courseTitle;
    if (demo.courseTitles && demo.courseTitles.length > 1) {
      courseLabel = demo.courseTitles[0] + " + " + (demo.courseTitles.length - 1) + " more";
    }
    return [
      '<article class="demo-card demo-card-rich">',
      '<div class="demo-card-top">',
      "<div>",
      "<h3>" + escapeHtml(demo.title) + "</h3>",
      '<p class="card-eyebrow">' + escapeHtml(courseLabel) + " • " + escapeHtml(demo.mode) + "</p>",
      "</div>",
      '<span class="level-badge">' + escapeHtml(demo.level) + "</span>",
      "</div>",
      "<p>" + escapeHtml(demo.summary) + "</p>",
      '<div class="demo-badges"><span class="mode-badge">' + escapeHtml(demo.mode) + "</span><span class=\"mode-badge\">" + escapeHtml(demo.duration) + "</span><span class=\"mode-badge\">" + escapeHtml(demo.readiness) + "</span></div>",
      '<p class="teacher-cue"><strong>Teacher cue:</strong> ' + escapeHtml(demo.teacherCue.replace(/^Teacher cue:\s*/i, "")) + "</p>",
      '<div class="demo-actions"><a class="btn-mini" href="' + escapeHtml(demo.aboutUrl) + '">About</a><a class="btn-mini outline launch-demo" href="' + escapeHtml(demo.launchUrl) + '">Launch</a></div>',
      "</article>"
    ].join("");
  }

  function renderBrowse(catalog) {
    var mount = document.querySelector("#browseDemoGrid");
    if (!mount) return;

    updateText("[data-kld-browse-demo-count]", String(catalog.demos.length));
    updateText("[data-kld-browse-course-count]", String(catalog.courses.length));

    var state = {
      search: "",
      course: "all",
      level: "all",
      mode: "all"
    };

    var courseSelect = document.querySelector("#browseCourse");
    var levelSelect = document.querySelector("#browseLevel");
    var modeSelect = document.querySelector("#browseMode");
    var searchInput = document.querySelector("#browseSearch");
    var empty = document.querySelector("#browseEmpty");
    var summary = document.querySelector("#browseSummary");

    catalog.courses.forEach(function (course) {
      var option = document.createElement("option");
      option.value = course.slug;
      option.textContent = course.title;
      courseSelect.appendChild(option);
    });

    Array.from(new Set(catalog.demos.map(function (demo) { return demo.level; }))).sort().forEach(function (level) {
      var option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      levelSelect.appendChild(option);
    });

    Array.from(new Set(catalog.demos.map(function (demo) { return demo.mode; }))).sort().forEach(function (mode) {
      var option = document.createElement("option");
      option.value = mode;
      option.textContent = mode;
      modeSelect.appendChild(option);
    });

    function filtered() {
      return catalog.demos.filter(function (demo) {
        var haystack = [
          demo.title,
          demo.summary,
          demo.courseTitle,
          (demo.courseTitles || []).join(" "),
          demo.teacherCue,
          demo.mode
        ].join(" ").toLowerCase();
        if (state.search && haystack.indexOf(state.search) === -1) return false;
        if (state.course !== "all" && (demo.courseSlugs || [demo.courseSlug]).indexOf(state.course) === -1) return false;
        if (state.level !== "all" && demo.level !== state.level) return false;
        if (state.mode !== "all" && demo.mode !== state.mode) return false;
        return true;
      });
    }

    function render() {
      var demos = filtered();
      summary.textContent = demos.length + " curated demos shown";
      if (!demos.length) {
        mount.innerHTML = "";
        empty.hidden = false;
        return;
      }
      empty.hidden = true;
      mount.innerHTML = demos.map(buildDemoCard).join("");
    }

    searchInput.addEventListener("input", function () {
      state.search = searchInput.value.trim().toLowerCase();
      render();
    });
    courseSelect.addEventListener("change", function () {
      state.course = courseSelect.value;
      render();
    });
    levelSelect.addEventListener("change", function () {
      state.level = levelSelect.value;
      render();
    });
    modeSelect.addEventListener("change", function () {
      state.mode = modeSelect.value;
      render();
    });

    render();
  }

  function renderCoursePacks(catalog) {
    var mount = document.querySelector("#coursePackGrid");
    if (!mount) return;

    mount.innerHTML = catalog.courses.map(function (course) {
      var assignmentLinks = course.assignments.length
        ? course.assignments.map(function (url, index) {
            return '<a class="btn-mini outline" href="' + escapeHtml(url) + '">Assignment ' + (index + 1) + "</a>";
          }).join("")
        : '<span class="btn-mini outline">Assignments coming soon</span>';

      var catalogLink = course.catalogUrl
        ? '<a class="btn-mini" href="' + escapeHtml(course.catalogUrl) + '">Catalog / Map</a>'
        : '<span class="btn-mini">Course page only</span>';

      return [
        '<article class="info-card course-pack-card">',
        '<p class="section-kicker">Course Pack</p>',
        "<h3>" + escapeHtml(course.title) + "</h3>",
        "<p>" + escapeHtml(course.subtitle) + "</p>",
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
        renderBrowse(catalog);
        renderCoursePacks(catalog);
      })
      .catch(function (error) {
        var mounts = ["#browseSummary", "#coursePackGrid"];
        mounts.forEach(function (selector) {
          var el = document.querySelector(selector);
          if (el && selector === "#browseSummary") el.textContent = "Catalog data could not be loaded.";
          if (el && selector === "#coursePackGrid") el.innerHTML = '<div class="empty-state">Course-pack data could not be loaded right now.</div>';
        });
        console.error(error);
      });
  });
})();
