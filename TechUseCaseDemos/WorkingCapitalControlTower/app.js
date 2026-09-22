/* Working Capital Control Tower — browser simulation.
   All numbers are pre-computed synthetic results in data.js (rules vs ml).
   No network calls, no keys, no calculation source. */

let mode = "ml";
let tab = "collections";

const cr = (x) => "₹" + (x / 1e7).toFixed(1) + " cr";
const lakh = (x) => "₹" + (x / 1e5).toFixed(1) + " lakh";

const SWARM_STEPS = [
  ["Data Steward", "validated 8 tables against the shared contract"],
  ["Receivables agent", "predicted payment dates for 202 open invoices"],
  ["Reconciliation agent", "matched 69 bank lines; queued exceptions"],
  ["Payables agent", "priced early-payment discounts vs 9.5% funds"],
  ["Cash Forecast agent", "built the 13-week P10/P50/P90 outlook"],
  ["Treasury Planner", "sized the borrow/invest plan to the band"],
  ["CFO Brief agent", "assembled the brief — every figure computed"],
];

function renderMetrics() {
  const m = WCT_DATA[mode].metrics;
  const o = WCT_DATA[mode === "ml" ? "rules" : "ml"].metrics;
  const deltaDays = m.days_to_cash - WCT_DATA.rules.metrics.days_to_cash;
  const deltaDraw = m.peak_draw - WCT_DATA.rules.metrics.peak_draw;
  const cards = [
    ["Open receivables", cr(m.open_ar), ""],
    ["Days to cash (value-wtd)", m.days_to_cash + " d",
     mode === "ml" ? fmtDelta(deltaDays, " d vs rules", true) : ""],
    ["Auto-match rate", m.auto_match_pct + "%", ""],
    ["Recon exceptions", m.exceptions + " (" + cr(m.exception_value) + ")", ""],
    ["Peak WC line draw", cr(m.peak_draw),
     mode === "ml" ? fmtDelta(deltaDraw / 1e7, " cr vs rules", true) : ""],
  ];
  document.getElementById("metrics").innerHTML = cards.map(
    ([label, value, delta]) =>
      `<div class="metric"><div class="label">${label}</div>` +
      `<div class="value">${value}</div>${delta}</div>`).join("");
}

function fmtDelta(v, suffix, lowerIsBetter) {
  if (Math.abs(v) < 1e-9) return "";
  const good = lowerIsBetter ? v < 0 : v > 0;
  const sign = v > 0 ? "+" : "";
  return `<div class="delta ${good ? "good" : "bad"}">${sign}${v.toFixed(1)}${suffix}</div>`;
}

function renderSwarm(animate) {
  const el = document.getElementById("steps");
  el.innerHTML = SWARM_STEPS.map(
    ([name, detail], i) =>
      `<div class="step" id="st${i}"><span class="tick">✓</span>` +
      `<b>${name}</b><br>${detail}</div>`).join("");
  SWARM_STEPS.forEach((_, i) => {
    const d = document.getElementById("st" + i);
    if (animate) setTimeout(() => d.classList.add("done"), 450 * (i + 1));
    else d.classList.add("done");
  });
}

function riskChip(r) {
  const pct = Math.round(r * 100);
  const color = r > 0.6 ? "#c0392b" : r > 0.3 ? "#e8b54d" : "#2e7d32";
  return `<span class="risk" style="background:${color}">${pct}%</span>`;
}

function renderPanel() {
  const p = document.getElementById("panel");
  const d = WCT_DATA[mode];

  if (tab === "collections") {
    p.innerHTML = `<h3>Predicted payment dates &amp; collections priorities
      (${mode === "ml" ? "ML on 18 months of payer behavior" : "aging-bucket rules"})</h3>
      <table><tr><th>Customer</th><th>Invoice</th><th>Open</th><th>Due</th>
      <th>Predicted pay</th><th>Late risk</th><th>Action</th></tr>` +
      d.predictions.map((r) =>
        `<tr><td>${r.customer}</td><td>${r.invoice}</td><td>${lakh(r.open_amount)}</td>` +
        `<td>${r.due}</td><td>${r.predicted}</td><td>${riskChip(r.late_risk)}</td>` +
        `<td>${r.action}</td></tr>`).join("") + "</table>";
  } else if (tab === "recon") {
    p.innerHTML = `<h3>Reconciliation exception queue —
      ${WCT_DATA.exceptions.length} items need a human</h3>` +
      WCT_DATA.exceptions.map((e) =>
        `<div class="exception"><b>${e.kind}</b> &middot; ${e.bank_txn_id} &middot; ` +
        `${lakh(Math.abs(e.amount))}<br>${e.detail}</div>`).join("") +
      `<p class="hint">99% of credit value auto-matched via a five-rung ladder
       (exact ref &rarr; remittance advice &rarr; fuzzy ref &rarr; amount+payer
       &rarr; bundle-sum). Matching is plumbing — the exception queue is the job.</p>`;
  } else if (tab === "forecast") {
    p.innerHTML = `<h3>13-week cash outlook — cumulative net (P10 / P50 / P90)
      and weekly flows</h3>
      <canvas id="fcChart" width="1060" height="430" style="width:100%"></canvas>
      <p class="hint"><span style="color:#2e7d32">&#9632;</span> weekly inflow
      &nbsp;<span style="color:#c0392b">&#9632;</span> weekly outflow
      &nbsp;<span style="color:#9db8e8">&#9473;</span> optimistic (P10)
      &nbsp;<span style="color:#1e2761">&#9473;</span> expected (P50)
      &nbsp;<span style="color:#c0392b">&#9473;</span> conservative (P90)
      &nbsp;&middot;&nbsp; values in ₹ crore</p>`;
    drawForecast(document.getElementById("fcChart"), d.forecast);
  } else {
    p.innerHTML = `<h3>Weekly borrow / invest plan (${mode} forecast)</h3>
      <p class="hint">The plan holds a cushion sized to the P50–P90 band.
      Narrower band &rarr; smaller cushion &rarr; less standby borrowing —
      accuracy converts to interest saved (interest cost this quarter:
      ${cr(d.metrics.interest_cost)}).</p>
      <table><tr><th>Week</th><th>Action</th><th>Amount</th>
      <th>Line drawn</th><th>Cash after</th></tr>` +
      d.treasury.map((r) =>
        `<tr><td>${r.week}</td><td>${r.action}</td><td>${cr(r.amount)}</td>` +
        `<td>${cr(r.line_drawn)}</td><td>${cr(r.cash_after)}</td></tr>`).join("") +
      "</table>";
  }
}

function drawForecast(canvas, fc) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const padL = 64, padR = 16, padT = 16, padB = 44;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const cumVals = fc.flatMap((w) => [w.cum_p10, w.cum_p50, w.cum_p90]);
  const flowVals = fc.flatMap((w) => [w.inflow, -w.outflow]);
  const maxV = Math.max(...cumVals, ...flowVals) / 1e7;
  const minV = Math.min(...cumVals, ...flowVals, 0) / 1e7;
  const span = maxV - minV || 1;
  const yOf = (v) => padT + (maxV - v) * plotH / span;
  const xOf = (i) => padL + (i + 0.5) * plotW / fc.length;

  ctx.clearRect(0, 0, W, H);
  // gridlines + y labels
  ctx.font = "12px Segoe UI";
  ctx.fillStyle = "#6b7490";
  ctx.strokeStyle = "#e3e7f2";
  const step = Math.max(1, Math.ceil(span / 6));
  for (let v = Math.ceil(minV / step) * step; v <= maxV; v += step) {
    const y = yOf(v);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillText(v.toFixed(0), 8, y + 4);
  }
  // zero line
  ctx.strokeStyle = "#9aa3bd";
  ctx.beginPath(); ctx.moveTo(padL, yOf(0)); ctx.lineTo(W - padR, yOf(0)); ctx.stroke();
  // bars
  const bw = plotW / fc.length * 0.28;
  fc.forEach((w, i) => {
    const x = xOf(i);
    ctx.fillStyle = "rgba(46,125,50,0.4)";
    ctx.fillRect(x - bw, yOf(w.inflow / 1e7), bw, yOf(0) - yOf(w.inflow / 1e7));
    ctx.fillStyle = "rgba(192,57,43,0.4)";
    ctx.fillRect(x, yOf(0), bw, yOf(-w.outflow / 1e7) - yOf(0));
  });
  // cumulative lines
  const lines = [["cum_p10", "#9db8e8", 2], ["cum_p90", "#c0392b", 2],
                 ["cum_p50", "#1e2761", 3.5]];
  lines.forEach(([key, color, width]) => {
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath();
    fc.forEach((w, i) => {
      const x = xOf(i), y = yOf(w[key] / 1e7);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  });
  ctx.lineWidth = 1;
  // x labels
  ctx.fillStyle = "#6b7490";
  fc.forEach((w, i) => {
    if (i % 2 === 0) ctx.fillText(w.week.slice(5), xOf(i) - 16, H - 22);
  });
}

function setMode(m) {
  mode = m;
  document.getElementById("tMl").className = m === "ml" ? "on" : "";
  document.getElementById("tRules").className = m === "rules" ? "on" : "";
  renderMetrics();
  renderPanel();
}

document.getElementById("aiToggle").addEventListener("click", () =>
  setMode(mode === "ml" ? "rules" : "ml"));
document.getElementById("tabs").addEventListener("click", (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab;
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab));
  renderPanel();
});
document.getElementById("replay").addEventListener("click", () => renderSwarm(true));
document.getElementById("notice").textContent = WCT_DATA.notice;

renderMetrics();
renderSwarm(true);
renderPanel();
