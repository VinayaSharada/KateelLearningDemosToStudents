const closeItems = [
  {
    id: "rec",
    title: "Late reconciliation",
    entity: "Asteron India",
    area: "Bank reconciliation",
    value: 2.4,
    age: 3,
    owner: "Controller",
    evidence: "Missing bank recon support",
    status: "Open",
    closeImpact: "Block close",
    blocked: true
  },
  {
    id: "ic",
    title: "Intercompany mismatch",
    entity: "Asteron UK",
    area: "Intercompany",
    value: 1.7,
    age: 2,
    owner: "Close manager",
    evidence: "Counterparty mismatch explained",
    status: "Under review",
    closeImpact: "Monitor",
    blocked: false
  },
  {
    id: "journal",
    title: "Journal support gap",
    entity: "Asteron India",
    area: "Manual journal",
    value: 3.6,
    age: 1,
    owner: "Shared services",
    evidence: "Support incomplete",
    status: "Open",
    closeImpact: "Block close",
    blocked: true
  },
  {
    id: "inventory",
    title: "Inventory accrual",
    entity: "Asteron Gulf",
    area: "Inventory accrual",
    value: 1.1,
    age: 2,
    owner: "Close manager",
    evidence: "Draft estimate available",
    status: "Needs validation",
    closeImpact: "Monitor",
    blocked: false
  },
  {
    id: "fx",
    title: "FX revaluation",
    entity: "Asteron UK",
    area: "FX revaluation",
    value: 2.9,
    age: 4,
    owner: "Treasury lead",
    evidence: "Rate source missing",
    status: "Open",
    closeImpact: "Block close",
    blocked: true
  },
  {
    id: "consol",
    title: "Late consolidation input",
    entity: "Asteron Gulf",
    area: "Consolidation",
    value: 0.8,
    age: 2,
    owner: "Close manager",
    evidence: "Expected in 6 hours",
    status: "Escalated",
    closeImpact: "Monitor",
    blocked: false
  }
];

const calendarItems = [
  { entity: "Asteron India", day: "D+2", status: "At risk", note: "Three material breaks unresolved" },
  { entity: "Asteron UK", day: "D+1", status: "Watch", note: "FX and intercompany review open" },
  { entity: "Asteron Gulf", day: "D+2", status: "Watch", note: "Inventory and consolidation timing exposed" }
];

const agentTrace = [
  ["Observe", "Monitor close calendar, blocked tasks, and exception ageing."],
  ["Gather evidence", "Collect recon packs, journal support, rate sources, and owner notes."],
  ["Draft escalation", "Prepare a controller-ready summary with materiality and close impact."],
  ["Recommend", "Suggest approve, request more evidence, reassign, or defer with risk acceptance."],
  ["Wait for approval", "Do not post, release, or override policy without controller approval."]
];

const modeCopy = {
  facilitator: {
    description: "Facilitator mode highlights the close decision, evidence gaps, and approval boundary in 5-8 minutes.",
    task: "Identify the few exceptions that truly block close and explain why agent support does not replace controller approval."
  },
  participant: {
    description: "Participant mode gives learners 10 minutes to change the controller decision and justify whether close can proceed.",
    task: "Pick an approval action and classify which exceptions block close, which can be monitored, and what evidence is still missing."
  }
};

const state = {
  mode: "facilitator",
  entity: "all",
  owner: "all",
  threshold: 2,
  decision: "request"
};

function filteredItems() {
  return closeItems.filter((item) => {
    if (state.entity !== "all" && item.entity !== state.entity) return false;
    if (state.owner !== "all" && item.owner !== state.owner) return false;
    return true;
  });
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function populateEntityFilter() {
  const entities = [...new Set(closeItems.map((item) => item.entity))];
  document.getElementById("entityFilter").innerHTML =
    `<option value="all">All entities</option>${entities.map((item) => `<option value="${item}">${item}</option>`).join("")}`;
}

function closeDecisionSummary(items) {
  const threshold = state.threshold;
  const material = items.filter((item) => item.value >= threshold);
  const blocked = material.filter((item) => item.blocked);

  if (state.decision === "approve" && blocked.length === 0) {
    return {
      decision: "Proceed with close",
      risk: "Residual monitor-only exceptions remain",
      owner: "Controller",
      approval: "Controller approved monitored close",
      exception: "Track monitor-only items post-close"
    };
  }
  if (state.decision === "defer") {
    return {
      decision: "Defer with risk acceptance",
      risk: `${blocked.length} material exceptions remain unresolved`,
      owner: "Controller + CFO",
      approval: "Formal risk acceptance required",
      exception: "Escalate blocked items to CFO sponsor"
    };
  }
  if (state.decision === "reassign") {
    return {
      decision: "Reassign and hold close",
      risk: "Ownership and evidence path are not stable enough",
      owner: "Close manager",
      approval: "Controller approval after reassignment",
      exception: "Move to named owner with updated SLA"
    };
  }
  return {
    decision: "Request more evidence",
    risk: `${blocked.length} blocked exceptions cross the materiality threshold`,
    owner: "Controller",
    approval: "Evidence complete before close decision",
    exception: "Keep close blocked on material items"
  };
}

function renderCalendar(items) {
  document.getElementById("calendarGrid").innerHTML = calendarItems.map((item) => {
    const related = items.filter((row) => row.entity === item.entity && row.value >= state.threshold);
    return `<article class="calendar-card">
      <span>${item.entity}</span>
      <strong>${item.day} • ${item.status}</strong>
      <p>${item.note}</p>
      <p><strong>${related.length}</strong> material exceptions in current view</p>
    </article>`;
  }).join("");
}

function renderExceptions(items) {
  document.getElementById("exceptionRows").innerHTML = items.map((item) => `
    <tr>
      <td>${item.title}</td>
      <td>${item.entity}</td>
      <td>${item.value.toFixed(1)}</td>
      <td>${item.age}</td>
      <td>${item.evidence}</td>
      <td>${item.owner}</td>
      <td>${item.status}</td>
      <td>${item.value >= state.threshold && item.blocked ? "Block close" : item.closeImpact}</td>
    </tr>
  `).join("");
}

function renderAgentTrace(items) {
  const summary = closeDecisionSummary(items);
  document.getElementById("agentTrace").innerHTML = agentTrace.map(([label, text]) => `
    <div class="trace-card">
      <span>${label}</span>
      <strong>${text}</strong>
    </div>
  `).join("");
  document.getElementById("evidenceLog").innerHTML = items.map((item) => `
    <div class="trace-card">
      <span>${item.area}</span>
      <strong>${item.entity}: ${item.evidence}</strong>
      <p>Owner: ${item.owner} • Status: ${item.status}</p>
    </div>
  `).join("");
  document.getElementById("decisionValue").textContent = summary.decision;
  document.getElementById("riskValue").textContent = summary.risk;
  document.getElementById("ownerValue").textContent = summary.owner;
  document.getElementById("approvalValue").textContent = summary.approval;
  document.getElementById("exceptionValue").textContent = summary.exception;
}

function renderMetrics(items) {
  const material = items.filter((item) => item.value >= state.threshold);
  const blocked = material.filter((item) => item.blocked);
  const evidenceComplete = items.filter((item) => !/missing|incomplete/i.test(item.evidence)).length;
  document.getElementById("closeStatusValue").textContent = blocked.length ? "At risk" : "Proceedable";
  document.getElementById("blockedTasksValue").textContent = `${blocked.length}`;
  document.getElementById("materialExceptionsValue").textContent = `${material.length}`;
  document.getElementById("evidenceCompletenessValue").textContent = `${Math.round((evidenceComplete / items.length) * 100)}%`;
}

function renderExpectedAnswer(items) {
  const summary = closeDecisionSummary(items);
  const blocked = items.filter((item) => item.value >= state.threshold && item.blocked).map((item) => item.title).join(", ");
  document.getElementById("expectedAnswer").innerHTML =
    `<p><strong>Expected answer:</strong> ${summary.decision}. The blocked material items are <strong>${blocked || "none"}</strong>. The agent can observe, gather evidence, and draft escalation, but the controller still decides whether close proceeds and whether any risk acceptance is appropriate.</p>`;
}

function renderAll() {
  const items = filteredItems();
  renderCalendar(items);
  renderExceptions(items);
  renderAgentTrace(items);
  renderMetrics(items);
  renderExpectedAnswer(items);
  document.getElementById("modeDescription").textContent = modeCopy[state.mode].description;
  document.getElementById("participantTask").textContent = modeCopy[state.mode].task;
}

function exportSummary() {
  const items = filteredItems();
  const summary = closeDecisionSummary(items);
  const content = [
    "Month-End Close Command Center Summary",
    `Mode: ${state.mode}`,
    `Entity filter: ${state.entity}`,
    `Owner filter: ${state.owner}`,
    `Materiality threshold: USD ${state.threshold.toFixed(1)}m`,
    `Controller decision: ${state.decision}`,
    `Outcome: ${summary.decision}`,
    `Primary risk: ${summary.risk}`,
    "",
    "Visible exceptions",
    ...items.map((item) => `${item.title} | ${item.entity} | USD ${item.value.toFixed(1)}m | ${item.owner} | ${item.evidence}`)
  ].join("\n");
  downloadText("month-end-close-summary.txt", content);
}

function bindEvents() {
  document.getElementById("facilitatorMode").addEventListener("click", () => {
    state.mode = "facilitator";
    renderAll();
  });
  document.getElementById("participantMode").addEventListener("click", () => {
    state.mode = "participant";
    renderAll();
  });
  document.getElementById("entityFilter").addEventListener("change", (event) => {
    state.entity = event.target.value;
    renderAll();
  });
  document.getElementById("ownerFilter").addEventListener("change", (event) => {
    state.owner = event.target.value;
    renderAll();
  });
  document.getElementById("thresholdFilter").addEventListener("change", (event) => {
    state.threshold = Number(event.target.value);
    renderAll();
  });
  document.getElementById("approvalDecision").addEventListener("change", (event) => {
    state.decision = event.target.value;
    renderAll();
  });
  document.getElementById("exportSummary").addEventListener("click", exportSummary);
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.mode = "facilitator";
    state.entity = "all";
    state.owner = "all";
    state.threshold = 2;
    state.decision = "request";
    document.getElementById("entityFilter").value = "all";
    document.getElementById("ownerFilter").value = "all";
    document.getElementById("thresholdFilter").value = "2";
    document.getElementById("approvalDecision").value = "request";
    document.getElementById("expectedAnswer").hidden = true;
    renderAll();
  });
  document.getElementById("showExpectedAnswer").addEventListener("click", () => {
    const panel = document.getElementById("expectedAnswer");
    panel.hidden = !panel.hidden;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateEntityFilter();
  bindEvents();
  renderAll();
});
