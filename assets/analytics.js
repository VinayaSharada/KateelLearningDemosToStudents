/* Kateel Learning Demos: GA4 usage and client-side health telemetry. */
(function (window, document) {
  "use strict";

  var MEASUREMENT_ID = "G-V672XGCRSK";
  var PRODUCTION_HOST = "vinayasharada.github.io";
  var REPOSITORY_PATH = "/KateelLearningDemosToStudents/";
  var MAX_ERROR_EVENTS = 10;
  var reportedErrors = Object.create(null);
  var errorEventCount = 0;
  var localDebugEvents = [];
  var localDebugErrors = [];

  var isProduction =
    window.location.hostname.toLowerCase() === PRODUCTION_HOST &&
    (window.location.pathname === REPOSITORY_PATH.slice(0, -1) ||
      window.location.pathname.indexOf(REPOSITORY_PATH) === 0);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  if (!isProduction) {
    // Keep local development and automated browser checks out of production data.
    window["ga-disable-" + MEASUREMENT_ID] = true;
  } else {
    var loader = document.createElement("script");
    loader.async = true;
    loader.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    loader.setAttribute("data-kld-google-tag", MEASUREMENT_ID);
    document.head.appendChild(loader);

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  document.documentElement.setAttribute("data-kld-analytics", isProduction ? "enabled" : "local-disabled");

  function truncate(value, maximum) {
    var text = String(value == null ? "" : value);
    return text.length > maximum ? text.slice(0, maximum - 1) + "…" : text;
  }

  function scrubText(value, maximum) {
    return truncate(value, maximum || 100)
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
      .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "[id]")
      .replace(/\b(?:\d[\s-]?){6,}\b/g, "[number]")
      .replace(/https?:\/\/[^\s?#]+[^\s]*/gi, "[url]")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cleanPathname(pathname) {
    var path = pathname || "/";
    try {
      path = decodeURIComponent(path);
    } catch (_error) {
      // Keep the encoded path if it contains malformed escape sequences.
    }

    if (path === REPOSITORY_PATH.slice(0, -1)) path = REPOSITORY_PATH;
    if (path.indexOf(REPOSITORY_PATH) === 0) path = path.slice(REPOSITORY_PATH.length);
    path = path.replace(/^\/+/, "");
    if (!path) return "index.html";
    if (path.charAt(path.length - 1) === "/") path += "index.html";
    return truncate(path, 100);
  }

  function cleanSource(value) {
    if (!value) return "unknown";
    if (/^(?:inline-script|promise|unknown)$/.test(String(value))) return String(value);
    try {
      var parsed = new URL(String(value), window.location.href);
      var path = parsed.pathname
        .replace(/\b[0-9a-f]{8}-[0-9a-f-]{27,}\b/gi, "[id]")
        .replace(/\/(?:\d{4,}|[A-Za-z0-9_-]{32,})(?=\/|$)/g, "/[id]");
      var sameHost = parsed.hostname === window.location.hostname;
      return scrubText((sameHost ? "" : parsed.hostname) + path, 100) || "unknown";
    } catch (_error) {
      return scrubText(String(value).split(/[?#]/)[0], 100) || "unknown";
    }
  }

  function pageMetadata() {
    var demoId = cleanPathname(window.location.pathname);
    var lowerPath = demoId.toLowerCase();
    var firstSegment = demoId.split("/")[0] || "site";
    var pageKind = "site";

    if (demoId === "index.html") pageKind = "landing";
    else if (lowerPath === "browse/index.html" || lowerPath === "demo_index.html") pageKind = "catalog";
    else if (/(^|\/)about(?:-demo)?\.html$/.test(lowerPath)) pageKind = "about";
    else if (
      /^(techusecasedemos|domainusecasedemos|cybersecuritydemos|treasuryanalytics|🤖 browser-ai-demos|courses|course-packs|assignments)\//i.test(
        demoId
      )
    ) {
      pageKind = "demo";
    }

    var title = (document.title || demoId.split("/").slice(-2, -1)[0] || "Untitled demo")
      .replace(/\s*[|–—-]\s*Kateel(?: Learning Demos?)?.*$/i, "")
      .trim();

    return {
      demo_id: demoId,
      demo_name: scrubText(title, 100),
      demo_category: scrubText(firstSegment, 100),
      page_kind: pageKind
    };
  }

  function sendEvent(name, parameters) {
    var payload = parameters || {};
    if (typeof window.gtag === "function") window.gtag("event", name, payload);
    if (!isProduction) {
      localDebugEvents.push(name);
      document.documentElement.setAttribute("data-kld-analytics-events", localDebugEvents.slice(-20).join(","));
    }
  }

  function withPageMetadata(parameters) {
    var metadata = pageMetadata();
    var payload = {};
    Object.keys(parameters || {}).forEach(function (key) {
      payload[key] = parameters[key];
    });
    Object.keys(metadata).forEach(function (key) {
      payload[key] = metadata[key];
    });
    return payload;
  }

  function reportException(type, description, source, fatal) {
    var cleanDescription = scrubText(description || "Unknown client-side exception", 100);
    var cleanErrorSource = cleanSource(source);
    var key = [type, cleanDescription, cleanErrorSource].join("|");
    if (reportedErrors[key] || errorEventCount >= MAX_ERROR_EVENTS) return;

    reportedErrors[key] = true;
    errorEventCount += 1;
    if (!isProduction) {
      var debugError = scrubText(type, 40) + ":" + cleanErrorSource;
      localDebugErrors.push(debugError);
      document.documentElement.setAttribute("data-kld-last-error", debugError);
      document.documentElement.setAttribute("data-kld-analytics-errors", localDebugErrors.slice(-10).join(","));
    }
    sendEvent(
      "exception",
      withPageMetadata({
        description: cleanDescription,
        fatal: Boolean(fatal),
        error_type: scrubText(type, 40),
        error_source: cleanErrorSource
      })
    );
  }

  window.addEventListener(
    "error",
    function (event) {
      var target = event.target;
      if (target && target !== window) {
        var tag = String(target.tagName || "resource").toLowerCase();
        var source = target.currentSrc || target.src || target.href || "unknown";
        reportException(
          "resource_error",
          "Failed to load " + tag + " resource",
          source,
          tag === "script" || tag === "link"
        );
        return;
      }

      var errorName = event.error && event.error.name ? event.error.name : "JavaScript error";
      var message = event.message && event.message !== "Script error." ? ": " + event.message : "";
      reportException(
        "javascript_error",
        errorName + message,
        event.filename || "inline-script",
        errorName === "SyntaxError"
      );
    },
    true
  );

  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    var description = "Unhandled promise rejection";
    if (reason instanceof Error) {
      description = (reason.name || "Error") + (reason.message ? ": " + reason.message : "");
    }
    reportException("promise_rejection", description, "promise", false);
  });

  if (typeof window.fetch === "function") {
    var nativeFetch = window.fetch;
    window.fetch = function () {
      var input = arguments[0];
      var source = input && input.url ? input.url : input;
      return nativeFetch.apply(this, arguments).then(
        function (response) {
          if (!response.ok) {
            reportException(
              "network_error",
              "HTTP " + response.status + " response",
              response.url || source,
              response.status === 404 || response.status >= 500
            );
          }
          return response;
        },
        function (error) {
          reportException(
            "network_error",
            error instanceof Error ? error.name + ": " + error.message : "Fetch request failed",
            source,
            false
          );
          throw error;
        }
      );
    };
  }

  if (window.XMLHttpRequest && window.XMLHttpRequest.prototype) {
    var nativeOpen = window.XMLHttpRequest.prototype.open;
    var nativeSend = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.open = function (method, url) {
      this.__kldRequestUrl = url;
      return nativeOpen.apply(this, arguments);
    };

    window.XMLHttpRequest.prototype.send = function () {
      var request = this;
      request.addEventListener("loadend", function () {
        if ((request.status === 0 && request.readyState === 4) || request.status >= 400) {
          reportException(
            "network_error",
            request.status ? "HTTP " + request.status + " response" : "XHR request failed",
            request.responseURL || request.__kldRequestUrl,
            request.status === 404 || request.status >= 500
          );
        }
      });
      return nativeSend.apply(this, arguments);
    };
  }

  function closestElement(target, selector) {
    return target && target.closest ? target.closest(selector) : null;
  }

  function actionName(control) {
    return scrubText(
      control.getAttribute("data-analytics-label") ||
        control.getAttribute("aria-label") ||
        control.id ||
        control.getAttribute("name") ||
        control.textContent ||
        control.tagName,
      80
    );
  }

  function installInteractionTracking() {
    var metadata = pageMetadata();
    if (metadata.page_kind === "demo") sendEvent("demo_view", metadata);

    document.addEventListener(
      "click",
      function (event) {
        var launch = closestElement(event.target, ".launch-demo");
        if (launch) {
          sendEvent(
            "demo_launch",
            withPageMetadata({
              target_demo_id: cleanSource(launch.href || launch.getAttribute("href")),
              action_name: actionName(launch)
            })
          );
          return;
        }

        var rating = closestElement(event.target, ".demo-rating [data-value]");
        if (rating) {
          sendEvent(
            "demo_rating",
            withPageMetadata({ rating_value: Number(rating.getAttribute("data-value")) || 0 })
          );
          return;
        }

        if (metadata.page_kind !== "demo") return;
        var control = closestElement(
          event.target,
          "button, [role='button'], input[type='button'], input[type='submit'], input[type='reset']"
        );
        if (!control || control.disabled || control.getAttribute("aria-disabled") === "true") return;

        sendEvent(
          "demo_action",
          withPageMetadata({
            action_name: actionName(control),
            action_type: String(control.tagName || "control").toLowerCase()
          })
        );
      },
      true
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installInteractionTracking, { once: true });
  } else {
    installInteractionTracking();
  }

  window.addEventListener(
    "load",
    function () {
      var metadata = pageMetadata();
      if (metadata.page_kind === "demo") sendEvent("demo_ready", metadata);
    },
    { once: true }
  );

  window.KateelAnalytics = {
    enabled: isProduction,
    measurementId: MEASUREMENT_ID,
    pageMetadata: pageMetadata,
    reportException: reportException,
    track: function (name, parameters) {
      sendEvent(name, withPageMetadata(parameters || {}));
    }
  };
})(window, document);
