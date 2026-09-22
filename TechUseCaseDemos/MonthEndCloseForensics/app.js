/* Month-End Close Forensics — browser simulation.
   Pre-computed synthetic results + the actual recorded swarm trace.
   No network calls, no keys, no calculation source. */

let tab = "variance";
let timer = null;

const lk = (x) => "₹" + (x / 1e5).toFixed(1) + " lakh";
const T = MECF_DATA.totals;
const CLS_COLOR = { APPROVED: "#2e7d32", AVOIDABLE_LEAK: "#c0392b",
                    PROCESS_GAP: "#e8b54d", UNEXPLAINED: "#6b7490" };

function renderMetrics() {
  const cards = [
    ["Flagged items", T.flagged_items],
    ["Overspend flagged", lk(T.total_overspend)],
    ["Approved (traceable)", lk(T.approved_variance)],
    ["Avoidable leak", lk(T.avoidable_leak)],
    ["Recoverable", lk(T.recoverable)],
  ];
  document.getElementById("metrics").innerHTML = cards.map(
    ([label, value]) =>
      `<div class="metric"><div class="label">${label}</div>` +
      `<div class="value">${value}</div></div>`).join("");
}

function barRow(label, value, max, color, text) {
  const w = max > 0 ? Math.max(2, Math.round(Math.abs(value) / max * 100)) : 0;
  return `<div style="margin-bottom:9px">
    <div style="display:flex;justify-content:space-between;font-size:13px">
      <span><b>${label}</b></span><span>${text}</span></div>
    <div style="background:#edf3fe;border-radius:6px;height:14px">
      <div style="width:${w}%;background:${color};height:14px;border-radius:6px"></div>
    </div></div>`;
}

function renderPanel() {
  const p = document.getElementById("panel");
  if (timer) { clearInterval(timer); timer = null; }

  if (tab === "variance") {
    const rows = MECF_DATA.variance;
    const max = Math.max(...rows.map((r) => Math.abs(r.variance)));
    p.innerHTML = `<h3>Actuals vs budget — ${MECF_DATA.month} close
      (flag: ±15% and ₹5 lakh)</h3>` +
      rows.map((r) => barRow(
        `${r.cost_center} · ${r.account}`, r.variance, max,
        r.flagged ? "#c0392b" : "#1e2761",
        `${r.variance_pct > 0 ? "+" : ""}${r.variance_pct}% (${lk(r.variance)})` +
        (r.flagged ? " ⚠" : ""))).join("") +
      `<p class="hint">Three lines breach the threshold. The same red color —
       three completely different stories, next tab.</p>`;
  } else if (tab === "findings") {
    p.innerHTML = `<h3>Root-cause attribution (deterministic drill-downs)</h3>` +
      MECF_DATA.findings.map((f) =>
        `<div class="exception" style="border-left-color:${CLS_COLOR[f.classification]}">
          <b style="color:${CLS_COLOR[f.classification]}">${f.classification}</b>
          · ${f.cost_center} / ${f.account} · ${lk(f.amount)}
          ${f.recoverable ? "(recoverable " + lk(f.recoverable) + ")" : ""}<br>
          <b>${f.root_cause}</b><br>
          <span class="hint">Evidence: ${f.evidence}<br>Action: ${f.corrective_action}</span>
        </div>`).join("") +
      `<p class="hint">✅ The freight spike is APPROVED — it traces to the
       supply-chain war room's signed expedite. A variance with a signature is
       governance working, not failing.</p>`;
  } else if (tab === "cloud") {
    p.innerHTML = `<h3>Cloud billing: the spike, the deploy, the missed discount</h3>
      <canvas id="cloudChart" width="1060" height="380" style="width:100%"></canvas>
      <p class="hint"><span style="color:#1e2761">&#9632;</span> committed
      (savings plan) &nbsp;<span style="color:#c0392b">&#9632;</span> on-demand
      (the leak) &nbsp;<span style="color:#e8b54d">&#9475;</span> deploy PR-412
      &nbsp;·· values in ₹ lakh/day. The red bars begin the day of
      the ML retraining deploy — that date × cluster join is the forensic
      move this demo teaches.</p>`;
    drawCloud(document.getElementById("cloudChart"));
  } else {
    p.innerHTML = `<h3>&#127917; Swarm Replay — the actual recorded trace of a
      live forensic run</h3>
      <div class="theater" id="theaterRoot"></div>
      <p class="hint">Nothing here is scripted: these are the real
      delegations and governed data reads of one recorded run (provider and
      model shown in the header). In the live tier you can run the swarm
      yourself and watch this happen in real time.</p>`;
    buildTheater();
    playTheater(140);
  }
}

function drawCloud(canvas) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const padL = 56, padB = 40, padT = 14, padR = 10;
  const days = MECF_DATA.cloud_daily;
  const maxV = Math.max(...days.map((d) =>
    (d.savings_plan || 0) + (d.on_demand || 0))) / 1e5;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const bw = plotW / days.length * 0.66;
  ctx.clearRect(0, 0, W, H);
  ctx.font = "11px Segoe UI";
  ctx.fillStyle = "#6b7490";
  for (let v = 0; v <= maxV; v += Math.max(1, Math.ceil(maxV / 5))) {
    const y = padT + (maxV - v) * plotH / maxV;
    ctx.strokeStyle = "#e3e7f2";
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillText(v.toFixed(0), 18, y + 4);
  }
  const deployDates = new Set(MECF_DATA.deploys
    .filter((d) => d.cluster === "ml-staging").map((d) => d.deploy_date));
  days.forEach((d, i) => {
    const x = padL + (i + 0.17) * plotW / days.length;
    const sp = (d.savings_plan || 0) / 1e5, od = (d.on_demand || 0) / 1e5;
    const ySp = padT + (maxV - sp) * plotH / maxV;
    ctx.fillStyle = "#1e2761";
    ctx.fillRect(x, ySp, bw, H - padB - ySp);
    if (od > 0) {
      const yOd = padT + (maxV - sp - od) * plotH / maxV;
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(x, yOd, bw, ySp - yOd);
    }
    if (deployDates.has(d.usage_date)) {
      ctx.strokeStyle = "#e8b54d"; ctx.setLineDash([5, 4]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 2, padT); ctx.lineTo(x - 2, H - padB);
      ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1;
      ctx.fillStyle = "#b8860b"; ctx.fillText("PR-412", x - 16, padT + 10);
    }
    if (i % 4 === 0) {
      ctx.fillStyle = "#6b7490";
      ctx.fillText(d.usage_date.slice(8), x, H - padB + 16);
    }
  });
}

/* ---------------- Swarm Theater replay (recorded trace) ---------------- */

function buildTheater() {
  const EV = MECF_DATA.swarm_events;
  const start = EV.find((e) => e.type === "run_start") || {};
  const specialists = start.specialists || [];
  const orch = start.orchestrator || "orchestrator";
  document.getElementById("theaterRoot").innerHTML = `
    <div class="th-top"><span class="th-title">Recorded run —
      ${start.provider || ""} ${start.model || ""}</span>
      <span class="th-clock" id="thClk">T+0.0s</span></div>
    <div class="th-orch" id="thag_${orch}">${orch}
      <div class="stt" id="thstt_${orch}">waiting</div></div>
    <div class="th-grid">` +
    specialists.map((s) => `
      <div class="th-agent" id="thag_${s}"><div class="nm">${s}</div>
        <div class="stt" id="thstt_${s}">idle</div>
        <div class="tls" id="thtl_${s}"></div></div>`).join("") +
    `</div>
    <div class="th-ticker" id="thTicker"></div>
    <div class="th-controls">
      <button onclick="playTheater(140)">▶ Replay</button>
      <button onclick="playTheater(35)">⚡ 4x</button>
    </div>`;
}

function thTick(html) {
  const t = document.getElementById("thTicker");
  t.insertAdjacentHTML("beforeend", html);
  t.scrollTop = t.scrollHeight;
}

function applyTheaterEvent(ev, t0) {
  const el = (id) => document.getElementById(id);
  const ts = `<span class="t">T+${(ev.ts - t0).toFixed(1)}s</span>`;
  if (ev.type === "run_start") {
    thTick(`${ts}<span class="tk-run">RUN START</span> — ${ev.request || ""}`);
  } else if (ev.type === "agent_start") {
    const a = el("thag_" + ev.agent);
    if (a) { a.classList.add("working"); a.classList.remove("doneA"); }
    const s = el("thstt_" + ev.agent); if (s) s.textContent = "thinking…";
    thTick(`${ts}<span class="tk-start">▸ ${ev.agent}</span> starts`);
  } else if (ev.type === "tool_call") {
    const s = el("thstt_" + ev.agent); if (s) s.textContent = "calling " + ev.tool;
    const tl = el("thtl_" + ev.agent);
    if (tl) { tl.insertAdjacentHTML("beforeend", `<div>→ ${ev.tool}</div>`);
      while (tl.children.length > 3) tl.removeChild(tl.firstChild); }
    thTick(`${ts}<span class="tk-tool">${ev.agent} → ${ev.tool}</span>`);
  } else if (ev.type === "agent_done") {
    const a = el("thag_" + ev.agent);
    if (a) { a.classList.remove("working"); a.classList.add("doneA"); }
    const s = el("thstt_" + ev.agent); if (s) s.textContent = "✓ done";
    thTick(`${ts}<span class="tk-done">✓ ${ev.agent}</span> reports back`);
  } else if (ev.type === "run_done") {
    thTick(`${ts}<span class="tk-run">RUN COMPLETE</span> — every number ` +
           `came from the deterministic pipeline; every signature stays human.`);
  }
  const clk = el("thClk");
  if (clk && ev.ts) clk.textContent = "T+" + (ev.ts - t0).toFixed(1) + "s";
}

function playTheater(msPerStep) {
  if (timer) clearInterval(timer);
  buildTheater();
  const EV = MECF_DATA.swarm_events;
  if (!EV.length) { thTick("No recorded trace bundled."); return; }
  const t0 = EV[0].ts;
  let i = 0;
  timer = setInterval(() => {
    if (i >= EV.length) { clearInterval(timer); timer = null; return; }
    applyTheaterEvent(EV[i], t0);
    i++;
  }, msPerStep);
}

document.getElementById("tabs").addEventListener("click", (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab;
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab));
  renderPanel();
});
document.getElementById("notice").textContent = MECF_DATA.notice;

renderMetrics();
renderPanel();
