/* Kaveri Enterprise Flash — capstone browser simulation.
   All content is pre-computed synthetic data in data.js.
   No network calls, no keys, no calculation source. */

let tab = "flash";

const cr = (x) => "₹" + (x / 1e7).toFixed(1) + " cr";
const L = KFR_DATA.snapshot.lenses;

const SWARM_STEPS = [
  ["Working Capital reporter", "read the CFO brief; 3 facts, 1 decision"],
  ["Supply Chain reporter", "read the war-room brief"],
  ["Project Anvil reporter", "read the IC memo"],
  ["Cyber reporter", "read the incident brief"],
  ["Chief of Staff", "wrote the Monday note; found the couplings"],
];

const STATUS_COLOR = { OK: "#2e7d32", ATTENTION: "#e8b54d", CRITICAL: "#c0392b",
                       "DECISION PENDING": "#1e2761" };

function lensStatus(key) {
  const h = L[key].headline;
  if (key === "working_capital")
    return h.recon_exceptions > 5 || h.peak_wc_draw > 10e7 ? "ATTENTION" : "OK";
  if (key === "supply_chain")
    return h.lines_at_risk >= Math.max(1, Math.floor(h.lines_total / 2))
      ? "CRITICAL" : h.lines_at_risk ? "ATTENTION" : "OK";
  if (key === "deal") return h.gap_vs_asking < 0 ? "DECISION PENDING" : "OK";
  return h.assets_compromised > 0 ? "CRITICAL" : h.assets_attempted ? "ATTENTION" : "OK";
}

function renderMetrics() {
  const tiles = [
    ["working_capital", "Working Capital", (h) => [cr(h.peak_wc_draw), "peak WC line need"]],
    ["supply_chain", "Supply Chain", (h) => [`${h.lines_at_risk}/${h.lines_total}`, "lines exposed"]],
    ["deal", "Project Anvil", (h) => [cr(h.gap_vs_asking), "adjusted value vs ask"]],
    ["cyber", "Cyber", (h) => [h.pii_records_at_risk.toLocaleString("en-IN"), "PII records at risk"]],
  ];
  document.getElementById("metrics").innerHTML = tiles.map(([key, label, fmt]) => {
    const st = lensStatus(key);
    const [big, small] = fmt(L[key].headline);
    return `<div class="metric"><div class="label">${label} ·
      <span style="color:${STATUS_COLOR[st]};font-weight:700">${st}</span></div>
      <div class="value">${big}</div>
      <div class="delta" style="color:#6b7490">${small}</div></div>`;
  }).join("") +
    `<div class="metric"><div class="label">Decisions pending</div>
     <div class="value">${KFR_DATA.snapshot.decisions.length}</div>
     <div class="delta" style="color:#6b7490">all awaiting human signature</div></div>`;
}

function renderSwarm(animate) {
  const el = document.getElementById("steps");
  el.innerHTML = SWARM_STEPS.map(
    ([name, detail], i) =>
      `<div class="step" id="st${i}"><span class="tick">✓</span>` +
      `<b>${name}</b><br>${detail}</div>`).join("");
  SWARM_STEPS.forEach((_, i) => {
    const d = document.getElementById("st" + i);
    if (animate) setTimeout(() => d.classList.add("done"), 500 * (i + 1));
    else d.classList.add("done");
  });
}

// minimal markdown rendering for the flash (headings, bold, tables, bullets)
function mdToHtml(md) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const lines = md.split("\n");
  let html = "", inTable = false;
  for (const raw of lines) {
    const line = esc(raw);
    const bolded = line.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
                       .replace(/\*(.+?)\*/g, "<i>$1</i>")
                       .replace(/\*\*/g, "");  // bold spans that wrap lines
    if (/^\|[\s-|]+\|$/.test(line.trim())) continue;
    if (line.trim().startsWith("|")) {
      const cells = bolded.trim().slice(1, -1).split("|").map((c) => c.trim());
      if (!inTable) { html += "<table>"; inTable = true;
        html += "<tr>" + cells.map((c) => `<th>${c}</th>`).join("") + "</tr>"; }
      else html += "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>";
      continue;
    }
    if (inTable) { html += "</table>"; inTable = false; }
    if (line.startsWith("## ")) html += `<h3 style="margin-top:18px">${bolded.slice(3)}</h3>`;
    else if (line.startsWith("# ")) html += `<h3>${bolded.slice(2)}</h3>`;
    else if (line.trim().startsWith("- ")) html += `<div style="margin:3px 0 3px 14px">• ${bolded.trim().slice(2)}</div>`;
    else if (line.trim()) html += `<p style="margin:6px 0">${bolded}</p>`;
  }
  if (inTable) html += "</table>";
  return html;
}

const COUPLINGS = [
  ["Cyber × dealer revenue × collections",
   "The compromised dealer portal carries the same dealer relationships the ₹64 cr collections push depends on. One incident threatens both continuity and cash conversion."],
  ["Supply-chain expedite × the WC line",
   "The ₹0.6 cr expedite draws on the same working-capital line the treasurer sized at ₹12.5 cr peak. Funding mitigation protects revenue and consumes scarce liquidity at once."],
  ["Project Anvil × leadership bandwidth",
   "An acquisition needing customer consent, litigation protection and key-person retention competes for the exact senior attention the incident and the disruption are consuming this week."],
  ["Data quality × every cash decision",
   "Nine reconciliation exceptions blur DSO and available liquidity — the borrowing decision and the collections priorities both inherit that avoidable uncertainty."],
];

function renderPanel() {
  const p = document.getElementById("panel");
  if (tab === "flash") {
    p.innerHTML = mdToHtml(KFR_DATA.flash_md);
  } else if (tab === "compound") {
    p.innerHTML = `<h3>The insight no single function produces</h3>` +
      COUPLINGS.map(([h, b], i) =>
        `<div class="exception" style="border-left-color:#1e2761;background:#edf3fe">
          <b style="color:#1e2761">${i + 1}. ${h}</b><br>
          <span style="font-size:13px">${b}</span></div>`).join("") +
      `<p class="hint">Each lens produced a locally correct plan. The
      couplings above appear only where the lenses join — the view the CEO's
      chair provides, assembled in seconds. (These four were surfaced by an
      actual Chief-of-Staff swarm run in the live tier.)</p>`;
  } else {
    p.innerHTML = `<h3>${KFR_DATA.snapshot.decisions.length} decisions awaiting
      a human signature</h3>
      <table><tr><th>#</th><th>Lens</th><th>Decision needed</th></tr>` +
      KFR_DATA.snapshot.decisions.map((d, i) =>
        `<tr><td>${i + 1}</td><td><b>${d.lens.replace("_", " ")}</b></td>` +
        `<td>${d.decision}</td></tr>`).join("") + `</table>
      <p class="hint" style="margin-top:10px">Aggregated automatically from
      the APPROVALS / CONDITIONS sections of every lens's deterministic
      brief. Agent-prepared, human-decided — that ratio (16:0) is the
      operating model.</p>`;
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
document.getElementById("notice").textContent = KFR_DATA.notice;

renderMetrics();
renderSwarm(true);
renderPanel();
