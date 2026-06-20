/* KateelLearningDemos shared navigation, rating, and usage tracking */
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
