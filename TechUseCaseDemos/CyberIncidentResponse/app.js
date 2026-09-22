/* Cyber Incident War Room — browser simulation.
   All results are pre-computed synthetic data in data.js. The clock slider
   is display arithmetic only. No network calls, no keys. */

let tab = "radius";

const lakh = (x) => "₹" + (x / 1e5).toFixed(1) + " lakh";
const T = CIR_DATA.totals;

const SWARM_STEPS = [
  ["Detection agent", "SBOM × CVE join; classified exposure from log evidence"],
  ["Remediation agent", "containment first, then 2-crew patch sequencing"],
  ["Legal agent", "tracked the clocks; DRAFTED the CERT-In filing"],
  ["Comms agent", "staged the dealer note behind a forensic trigger"],
  ["Incident Commander", "briefed leadership; listed the approvals"],
];

const STATUS_COLOR = { likely_compromised: "#c0392b", attempted: "#e8b54d",
                       vulnerable: "#1e2761" };

function renderClock() {
  const h = parseFloat(document.getElementById("clock").value);
  const left = 6 - h;
  const el = document.getElementById("clockLabel");
  if (left > 0) {
    el.textContent = `T+${h.toFixed(1)}h — CERT-In filing due in ${left.toFixed(1)}h`;
    el.style.color = left < 2 ? "#c0392b" : "#1e2761";
  } else {
    el.textContent = `T+${h.toFixed(1)}h — CERT-In deadline PASSED ${(-left).toFixed(1)}h ago`;
    el.style.color = "#c0392b";
  }
}

function renderMetrics() {
  const cards = [
    ["Vulnerable systems", `${T.assets_vulnerable}`],
    ["Likely compromised", `${T.assets_compromised}`],
    ["PII records at risk", T.pii_records_at_risk.toLocaleString("en-IN")],
    ["Response cost", lakh(T.response_cost)],
    ["All systems clear", `T+${Math.round(T.hours_to_all_clear)}h`],
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

function renderPanel() {
  const p = document.getElementById("panel");

  if (tab === "radius") {
    const max = Math.max(...CIR_DATA.radius.map((a) => a.score));
    p.innerHTML = `<h3>${CIR_DATA.cve.cve_id} (CVSS ${CIR_DATA.cve.cvss},
      exploit in the wild): who runs the vulnerable package</h3>` +
      CIR_DATA.radius.map((a) => {
        const w = Math.max(4, Math.round(a.score / max * 100));
        const c = STATUS_COLOR[a.status];
        return `<div style="margin-bottom:9px">
          <div style="display:flex;justify-content:space-between;font-size:13px">
            <span><b>${a.host}</b> · ${a.service} ·
              ${a.internet ? "internet-facing" : "internal"} · v${a.version}</span>
            <span style="color:${c};font-weight:700">${a.status.replace("_", " ")}</span></div>
          <div style="background:#edf3fe;border-radius:6px;height:14px">
            <div style="width:${w}%;background:${c};height:14px;border-radius:6px"></div>
          </div></div>`;
      }).join("") +
      `<p class="hint">Scoping took seconds because the software inventory
      (SBOM) existed — the boring CMDB budget line is a crisis asset.</p>`;
  } else if (tab === "evidence") {
    p.innerHTML = `<h3>The attacker's trail (signature-matched requests)</h3>
      <table><tr><th>Time (UTC)</th><th>Host</th><th>Source IP</th>
      <th>Path</th><th>Status</th></tr>` +
      CIR_DATA.events.map((e) =>
        `<tr><td>${e.time.slice(5, 16)}</td><td>${e.host}</td><td>${e.src}</td>` +
        `<td>${e.path}</td><td style="font-weight:700;color:${e.status === 200 ? "#c0392b" : "#2e7d32"}">${e.status}</td></tr>`)
        .join("") + `</table>
      <p class="hint" style="margin-top:10px">403s are the WAF holding. The
      two 200s on the upload path, then repeated 200s on
      <code>/jolly/tmp/.cache.jsp</code>, are the webshell — the evidence that
      separates &quot;attempted&quot; from &quot;likely compromised&quot;.</p>`;
  } else if (tab === "plan") {
    p.innerHTML = `<h3>Containment first, then patch by exposure (2 crews)</h3>
      <table><tr><th>#</th><th>Host</th><th>Action</th><th>Start</th>
      <th>Hours</th><th>Downtime cost</th><th>Approval</th></tr>` +
      CIR_DATA.plan.map((r, i) =>
        `<tr><td>${i + 1}</td><td><b>${r.host}</b></td><td>${r.action}</td>` +
        `<td>T+${r.start.toFixed(0)}h</td><td>${r.hours.toFixed(0)}</td>` +
        `<td>${lakh(r.cost)}</td><td>${r.approval}</td></tr>`).join("") +
      `</table>
      <p class="hint" style="margin-top:10px">Isolation is a priced business
      decision: ${lakh(CIR_DATA.plan[0].cost)} of self-inflicted downtime vs
      ${T.pii_records_at_risk.toLocaleString("en-IN")} records. The COO decides
      a number, not a feeling.</p>`;
  } else {
    p.innerHTML = `<h3>The clocks that do not care about your meeting schedule</h3>` +
      CIR_DATA.clock.map((c) =>
        `<div class="exception" style="border-left-color:${c.status === "REQUIRED" ? "#c0392b" : c.status === "PREPARE" ? "#e8b54d" : "#6b7490"}">
          <b>${c.obligation}</b> — ${c.status}<br>
          <span class="hint">${c.trigger} · deadline <b>${c.deadline.slice(0, 16)}</b>
          · owner: ${c.owner}</span></div>`).join("") +
      `<p class="hint">The swarm drafts every filing and notification —
      <b>a human signs and files each one.</b> The filing comes before the
      fix: all systems clear only at T+${Math.round(T.hours_to_all_clear)}h,
      ten hours after the CERT-In report is due.</p>`;
  }
}

document.getElementById("clock").addEventListener("input", renderClock);
document.getElementById("tabs").addEventListener("click", (e) => {
  if (!e.target.dataset.tab) return;
  tab = e.target.dataset.tab;
  document.querySelectorAll("#tabs button").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab));
  renderPanel();
});
document.getElementById("replay").addEventListener("click", () => renderSwarm(true));
document.getElementById("notice").textContent = CIR_DATA.notice;

renderClock();
renderMetrics();
renderSwarm(true);
renderPanel();
