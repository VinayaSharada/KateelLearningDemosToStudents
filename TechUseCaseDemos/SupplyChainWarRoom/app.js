/* Supply-Chain War Room — browser simulation.
   All numbers are pre-computed synthetic scenario results in data.js.
   No network calls, no keys, no calculation source. */

let scenario = "port_and_foundry_crisis";
let tab = "lines";

const cr = (x) => "₹" + (x / 1e7).toFixed(2) + " cr";
const lakh = (x) => "₹" + (x / 1e5).toFixed(1) + " lakh";

const SWARM_STEPS = [
  ["Supply Chain agent", "projected 13-week stock; derived line-stop dates"],
  ["Procurement agent", "priced air uplift, alternate suppliers, accept"],
  ["Finance agent", "weighed expedite spend vs loss avoided"],
  ["Comms agent", "drafted customer + internal notes (for approval)"],
  ["Orchestrator", "assembled the brief; listed the approvals"],
];

function renderScenarioTabs() {
  const el = document.getElementById("scenarioTabs");
  el.innerHTML = SCW_DATA.order.map((k) =>
    `<button data-scn="${k}" class="${k === scenario ? "active" : ""}">` +
    `${SCW_DATA.scenarios[k].label}</button>`).join("");
}

function renderMetrics() {
  const s = SCW_DATA.scenarios[scenario];
  const t = s.totals;
  const stopped = s.products.filter((p) => p.weeks_stopped > 0);
  const first = stopped.length ? stopped.map((p) => p.first_stop).sort()[0] : "—";
  const cards = [
    ["Lines at risk", `${stopped.length} / ${s.products.length}`],
    ["Components short", `${s.components_short} / ${s.components_total}`],
    ["First line-stop", first],
    ["Do-nothing cost", cr(t.baseline_loss)],
    ["Net benefit of acting", cr(t.net_benefit)],
  ];
  document.getElementById("metrics").innerHTML = cards.map(
    ([label, value]) =>
      `<div class="metric"><div class="label">${label}</div>` +
      `<div class="value">${value}</div></div>`).join("");
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

function barRow(label, value, max, color, text) {
  const w = max > 0 ? Math.max(2, Math.round(value / max * 100)) : 0;
  return `<div style="margin-bottom:9px">
    <div style="display:flex;justify-content:space-between;font-size:13px">
      <span><b>${label}</b></span><span>${text}</span></div>
    <div style="background:#edf3fe;border-radius:6px;height:14px">
      <div style="width:${w}%;background:${color};height:14px;border-radius:6px"></div>
    </div></div>`;
}

function renderPanel() {
  const p = document.getElementById("panel");
  const s = SCW_DATA.scenarios[scenario];
  const t = s.totals;

  if (tab === "lines") {
    const max = Math.max(...s.products.map((x) => x.margin_at_risk + x.penalty), 1);
    p.innerHTML = `<h3>Margin and penalties at risk per line (unmitigated)</h3>` +
      (s.products.every((x) => x.weeks_stopped === 0)
        ? `<p>No line-stops in this scenario — a healthy 13-week position.</p>`
        : s.products.map((x) => barRow(
            x.name,
            x.margin_at_risk + x.penalty, max,
            x.weeks_stopped > 8 ? "#c0392b" : x.weeks_stopped > 0 ? "#e8b54d" : "#2e7d32",
            x.weeks_stopped ? `${cr(x.margin_at_risk + x.penalty)} · ` +
              `${x.weeks_stopped} wks · blockers: ${x.blockers}` : "no stop"))
          .join(""));
  } else if (tab === "plan") {
    p.innerHTML = `<h3>Recommended mitigation plan</h3>` +
      (s.plan.length === 0
        ? `<p>Nothing to mitigate — no shortfalls in this scenario.</p>`
        : `<table><tr><th>Component</th><th>Lever</th><th>Action</th>
           <th>Cost</th><th>Relief</th></tr>` +
          s.plan.map((r) =>
            `<tr><td>${r.component}</td><td><b>${r.option}</b></td>` +
            `<td>${r.detail}</td><td>${lakh(r.cost)}</td><td>${r.arrival || "—"}</td></tr>`)
            .join("") + `</table>
          <p class="hint" style="margin-top:12px">Expedite spend ${cr(t.expedite_spend)}
          buys ${cr(t.loss_avoided)} of protection — net benefit
          <b>${cr(t.net_benefit)}</b>. Residual exposure after the plan:
          ${cr(t.residual_loss)}${t.accepted_components.length
            ? " · accepted (no economic fix): " + t.accepted_components.join(", ")
            : ""}.</p>`);
  } else {
    p.innerHTML = `<h3>Key-account exposure (why Comms drafts the call first)</h3>` +
      (s.customers.length === 0
        ? `<p>No customer impact in this scenario.</p>`
        : `<table><tr><th>Customer</th><th>Product</th><th>Strategic</th>
           <th>Weeks hit</th><th>Revenue at risk</th><th>Penalty</th></tr>` +
          s.customers.map((c) =>
            `<tr><td>${c.customer}</td><td>${c.product}</td>` +
            `<td>${c.strategic ? "<b>YES</b>" : "no"}</td><td>${c.weeks}</td>` +
            `<td>${cr(c.revenue_at_risk)}</td><td>${lakh(c.penalty)}</td></tr>`)
            .join("") + `</table>
          <p class="hint" style="margin-top:12px">Strategic accounts carry
          2%/week penalty clauses. The swarm drafts their notification —
          a human approves and sends it.</p>`);
  }
}

document.getElementById("scenarioTabs").addEventListener("click", (e) => {
  if (!e.target.dataset.scn) return;
  scenario = e.target.dataset.scn;
  renderScenarioTabs();
  renderMetrics();
  renderPanel();
});
document.getElementById("tabs").addEventListener("click", (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab;
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab));
  renderPanel();
});
document.getElementById("replay").addEventListener("click", () => renderSwarm(true));
document.getElementById("notice").textContent = SCW_DATA.notice;

renderScenarioTabs();
renderMetrics();
renderSwarm(true);
renderPanel();
