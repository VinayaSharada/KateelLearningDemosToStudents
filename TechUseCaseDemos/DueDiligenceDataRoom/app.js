/* Project Anvil — browser simulation.
   All numbers are pre-computed synthetic diligence results in data.js.
   No network calls, no keys, no calculation source. */

let tab = "flags";

const cr = (x) => "₹" + (x / 1e7).toFixed(1) + " cr";
const S = DDR_DATA.summary;

const SWARM_STEPS = [
  ["Financial DD agent", "revenue quality, related parties, the EBITDA bridge"],
  ["Legal DD agent", "read the contract extracts; quoted clause 14.2"],
  ["Ops DD agent", "machine ages, capex catch-up, key-person risk"],
  ["Deal Sponsor", "argued the honest bull case; conceded what it must"],
  ["Adversarial Auditor", "attacked the thesis: three findings, one risk"],
  ["IC Chair", "ruled: renegotiate ≤" + cr(S.walk_away_price) + " or walk"],
];

const SEV_COLOR = { CRITICAL: "#c0392b", HIGH: "#e8b54d", MEDIUM: "#6b7490" };

function renderMetrics() {
  const cards = [
    ["Asking price", cr(S.asking_price), ""],
    ["Seller's story", cr(S.as_presented),
     `<div class="delta good">+${((S.as_presented - S.asking_price) / 1e7).toFixed(1)} cr vs ask</div>`],
    ["Adjusted value", cr(S.adjusted_base),
     `<div class="delta bad">${(S.gap_vs_asking / 1e7).toFixed(1)} cr vs ask</div>`],
    ["Bear case", cr(S.bear), ""],
    ["Red flags", `${DDR_DATA.findings.length}`,
     `<div class="delta bad">${DDR_DATA.findings.filter((f) => f.severity === "CRITICAL").length} critical</div>`],
  ];
  document.getElementById("metrics").innerHTML = cards.map(
    ([label, value, delta]) =>
      `<div class="metric"><div class="label">${label}</div>` +
      `<div class="value">${value}</div>${delta}</div>`).join("");
}

function renderSwarm(animate) {
  const el = document.getElementById("steps");
  el.innerHTML = SWARM_STEPS.map(
    ([name, detail], i) =>
      `<div class="step" id="st${i}"><span class="tick">✓</span>` +
      `<b>${name}</b><br>${detail}</div>`).join("");
  SWARM_STEPS.forEach((_, i) => {
    const d = document.getElementById("st" + i);
    if (animate) setTimeout(() => d.classList.add("done"), 550 * (i + 1));
    else d.classList.add("done");
  });
}

function renderPanel() {
  const p = document.getElementById("panel");

  if (tab === "flags") {
    p.innerHTML = `<h3>What diligence found (the seller's story said
      &quot;${cr(S.as_presented)}, the ask looks fair&quot;)</h3>` +
      DDR_DATA.findings.map((f) =>
        `<div class="exception" style="border-left-color:${SEV_COLOR[f.severity] || "#6b7490"}">
          <b style="color:${SEV_COLOR[f.severity] || "#6b7490"}">${f.finding_id}
          [${f.severity}]</b> ${f.title}<br>
          <span class="hint">Evidence: ${f.evidence} · Treatment:
          ${f.impact_note}${f.valuation_impact
            ? " · <b>Price impact " + cr(f.valuation_impact) + "</b>" : ""}</span>
        </div>`).join("");
  } else if (tab === "bridge") {
    p.innerHTML = `<h3>From the seller's story to a defensible price</h3>
      <div id="bridgeRows"></div>
      <p class="hint" style="margin-top:12px">The gap between the story and
      adjusted value — <b>${cr(Math.abs(S.as_presented - S.adjusted_base))}</b> —
      is the price of the diligence you just read.</p>`;
    const rows = DDR_DATA.bridge;
    const start = rows[0].value;
    let running = 0;
    const html = rows.map((r, i) => {
      const isTotal = i === 0 || i === rows.length - 1;
      running = isTotal ? r.value : running + r.value;
      if (i === 0) running = r.value;
      const w = Math.max(3, Math.round(Math.abs(running) / start * 100));
      const color = isTotal ? "#1e2761" : "#c0392b";
      return `<div style="margin-bottom:9px">
        <div style="display:flex;justify-content:space-between;font-size:13px">
          <span><b>${r.step}</b></span>
          <span>${isTotal ? cr(r.value) : cr(r.value) + " → " + cr(running)}</span></div>
        <div style="background:#edf3fe;border-radius:6px;height:14px">
          <div style="width:${w}%;background:${color};height:14px;border-radius:6px"></div>
        </div></div>`;
    }).join("");
    document.getElementById("bridgeRows").innerHTML = html;
  } else if (tab === "scenarios") {
    const max = Math.max(...DDR_DATA.scenarios.map((s) => s.value), S.asking_price);
    p.innerHTML = `<h3>Three values, one ask</h3>` +
      DDR_DATA.scenarios.map((s) => {
        const w = Math.max(3, Math.round(s.value / max * 100));
        const color = s.scenario.startsWith("As") ? "#9db8e8"
          : s.scenario.startsWith("Adjusted") ? "#e8b54d" : "#c0392b";
        return `<div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:13px">
            <span><b>${s.scenario}</b> — ${s.note}</span><span>${cr(s.value)}</span></div>
          <div style="background:#edf3fe;border-radius:6px;height:16px">
            <div style="width:${w}%;background:${color};height:16px;border-radius:6px"></div>
          </div></div>`;
      }).join("") +
      `<div class="exception" style="border-left-color:#1e2761;background:#edf3fe">
        <b style="color:#1e2761">THE COMMITTEE'S VERDICT:</b> Do not proceed at
        ${cr(S.asking_price)}. Renegotiate at most <b>${cr(S.walk_away_price)}</b>
        with conditions precedent (change-of-control consent, litigation
        escrow, key-person retention, related-party reset) — or walk.
      </div>`;
  } else {
    p.innerHTML = `<h3>Read what the legal agent read</h3>` +
      Object.entries(DDR_DATA.extracts).map(([name, text]) =>
        `<details style="margin-bottom:10px"><summary style="cursor:pointer;
          font-weight:600;color:#1e2761">${name}</summary>
          <pre style="white-space:pre-wrap;font-size:12.5px;background:#f4f5f8;
          border-radius:8px;padding:12px">${text
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre></details>`).join("") +
      `<p class="hint">Clause 14.2 is the deal's hinge: the contract behind
      44% of revenue requires consent for this very transaction.</p>`;
  }
}

document.getElementById("tabs").addEventListener("click", (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab;
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab));
  renderPanel();
});
document.getElementById("replay").addEventListener("click", () => renderSwarm(true));
document.getElementById("notice").textContent = DDR_DATA.notice;

renderMetrics();
renderSwarm(true);
renderPanel();
