const invoices = [
  { id: "INV-2001", vendor: "Novaline Logistics", amount: 18000, exception: "None", owner: "Bot", stable: true },
  { id: "INV-2002", vendor: "Helix Supplies", amount: 42000, exception: "Amount mismatch", owner: "AP manager", stable: false },
  { id: "INV-2003", vendor: "Delta Components", amount: 12000, exception: "Missing GRN", owner: "Shared services lead", stable: false },
  { id: "INV-2004", vendor: "Marble Office", amount: 9000, exception: "None", owner: "Bot", stable: true },
  { id: "INV-2005", vendor: "BluePeak Services", amount: 57000, exception: "High-value approval", owner: "Controller", stable: false },
  { id: "INV-2006", vendor: "Triwest Packaging", amount: 22000, exception: "Duplicate", owner: "AP manager", stable: false }
];

const modeCopy = {
  facilitator: {
    description: "Facilitator mode highlights the stable-path versus exception-path decision in 5-8 minutes.",
    task: "Separate the invoices that a bot can process safely from those that require human judgement or approval."
  },
  participant: {
    description: "Participant mode gives learners 10 minutes to test policy defects and approval thresholds before deciding on RPA scope.",
    task: "Change the threshold or policy state, then explain whether automation should proceed, pause, or stay limited."
  }
};

const state = {
  mode: "facilitator",
  running: false,
  policyDefect: "off",
  threshold: 25000,
  reviewer: "Controller",
  sla: "24h"
};

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getDerivedRows() {
  return invoices.map((item) => {
    const policyBroken = state.policyDefect === "on";
    const requiresApproval = item.amount >= state.threshold || item.exception === "High-value approval";
    const blockedByPolicy = policyBroken && item.stable;
    const botAction = item.exception === "None" && !blockedByPolicy ? "Post to ERP and log evidence" : "Route to exception queue";
    return {
      ...item,
      requiresApproval,
      blockedByPolicy,
      botAction
    };
  });
}

function decisionSummary(rows) {
  const stable = rows.filter((item) => item.exception === "None" && !item.blockedByPolicy);
  const exceptions = rows.filter((item) => item.exception !== "None" || item.blockedByPolicy);
  if (state.policyDefect === "on") {
    return {
      decision: "Stop and standardize first",
      risk: "Policy defect makes even straight-through work unsafe to automate",
      owner: "Controller + process owner",
      approval: "Fix policy before resuming bot scope",
      exception: "All items route to human queue",
      fallback: "Manual review with evidence log"
    };
  }
  if (stable.length >= 2) {
    return {
      decision: "Automate stable path only",
      risk: `${exceptions.length} exception items still require judgement`,
      owner: "AP operations manager",
      approval: `${state.reviewer} reviews items above threshold`,
      exception: `Route exceptions to ${state.reviewer} within ${state.sla}`,
      fallback: "Pause bot and move invoice to exception workbench"
    };
  }
  return {
    decision: "Keep work human-owned",
    risk: "Too little stable volume to justify bot scope yet",
    owner: "Transformation lead",
    approval: "Reassess once rules are stable",
    exception: "Manual queue remains primary path",
    fallback: "Document exception reasons and redesign upstream"
  };
}

function renderManualQueue(rows) {
  document.getElementById("manualQueue").innerHTML = rows.map((item) => `
    <div class="trace-card">
      <span>${item.id}</span>
      <strong>${item.vendor} • USD ${item.amount.toLocaleString()}</strong>
      <p>Manual work: invoice inbox, PO check, GRN check, ERP rekey, exception follow-up</p>
    </div>
  `).join("");
}

function renderBotRun(rows) {
  const steps = state.running
    ? [
        "Read invoice fields from inbox",
        "Validate PO, GRN, and duplicate status",
        "Write stable path items to simulated ERP",
        "Create evidence log and route exceptions"
      ]
    : ["Bot idle. Start the run to show the controlled execution path."];
  document.getElementById("botRun").innerHTML = steps.map((item, index) => `
    <div class="trace-card">
      <span>${state.running ? `Step ${index + 1}` : "Status"}</span>
      <strong>${item}</strong>
      <p>${state.policyDefect === "on" ? "Policy defect enabled: the bot must pause and route even apparently stable work for review." : "Human override remains available at every step."}</p>
    </div>
  `).join("");
}

function renderExceptionRows(rows) {
  document.getElementById("exceptionRows").innerHTML = rows.map((item) => `
    <tr>
      <td>${item.id}</td>
      <td>${item.vendor}</td>
      <td>${item.amount.toLocaleString()}</td>
      <td>${item.blockedByPolicy ? "Broken policy" : item.exception}</td>
      <td>${item.botAction}</td>
      <td>${item.owner}</td>
      <td>${item.requiresApproval ? `${state.reviewer} approval` : "Bot evidence log only"}</td>
    </tr>
  `).join("");
}

function renderMetrics(rows) {
  const stable = rows.filter((item) => item.exception === "None" && !item.blockedByPolicy);
  const exceptions = rows.filter((item) => item.exception !== "None" || item.blockedByPolicy);
  document.getElementById("stpValue").textContent = `${Math.round((stable.length / rows.length) * 100)}%`;
  document.getElementById("exceptionRateValue").textContent = `${Math.round((exceptions.length / rows.length) * 100)}%`;
  document.getElementById("reworkValue").textContent = `${stable.length * 12} min`;
  document.getElementById("ageValue").textContent = state.sla;
}

function renderSummary(rows) {
  const summary = decisionSummary(rows);
  document.getElementById("decisionValue").textContent = summary.decision;
  document.getElementById("riskValue").textContent = summary.risk;
  document.getElementById("ownerValue").textContent = summary.owner;
  document.getElementById("approvalValue").textContent = summary.approval;
  document.getElementById("exceptionValue").textContent = summary.exception;
  document.getElementById("fallbackValue").textContent = summary.fallback;
  document.getElementById("expectedAnswer").innerHTML =
    `<p><strong>Expected answer:</strong> ${summary.decision}. Stable invoices can be automated only if policy is sound, the bot writes an evidence log, and every exception or threshold breach routes to a human reviewer. The bot must never release payment or override policy on its own.</p>`;
}

function renderAll() {
  const rows = getDerivedRows();
  document.getElementById("modeDescription").textContent = modeCopy[state.mode].description;
  document.getElementById("participantTask").textContent = modeCopy[state.mode].task;
  renderManualQueue(rows);
  renderBotRun(rows);
  renderExceptionRows(rows);
  renderMetrics(rows);
  renderSummary(rows);
}

function exportSummary() {
  const rows = getDerivedRows();
  const summary = decisionSummary(rows);
  const content = [
    "Finance RPA Workbench Summary",
    `Mode: ${state.mode}`,
    `Policy defect: ${state.policyDefect}`,
    `Materiality threshold: USD ${state.threshold.toLocaleString()}`,
    `Reviewer: ${state.reviewer}`,
    `SLA: ${state.sla}`,
    `Decision: ${summary.decision}`,
    `Risk: ${summary.risk}`,
    "",
    ...rows.map((item) => `${item.id} | ${item.exception} | ${item.botAction}`)
  ].join("\n");
  downloadText("finance-rpa-workbench-summary.txt", content);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("facilitatorMode").addEventListener("click", () => {
    state.mode = "facilitator";
    renderAll();
  });
  document.getElementById("participantMode").addEventListener("click", () => {
    state.mode = "participant";
    renderAll();
  });
  document.getElementById("startBot").addEventListener("click", () => {
    state.running = true;
    renderAll();
  });
  document.getElementById("pauseBot").addEventListener("click", () => {
    state.running = false;
    renderAll();
  });
  document.getElementById("policyDefect").addEventListener("change", (event) => {
    state.policyDefect = event.target.value;
    renderAll();
  });
  document.getElementById("materialityThreshold").addEventListener("change", (event) => {
    state.threshold = Number(event.target.value);
    renderAll();
  });
  document.getElementById("reviewerSelect").addEventListener("change", (event) => {
    state.reviewer = event.target.value;
    renderAll();
  });
  document.getElementById("slaSelect").addEventListener("change", (event) => {
    state.sla = event.target.value;
    renderAll();
  });
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.mode = "facilitator";
    state.running = false;
    state.policyDefect = "off";
    state.threshold = 25000;
    state.reviewer = "Controller";
    state.sla = "24h";
    document.getElementById("policyDefect").value = "off";
    document.getElementById("materialityThreshold").value = "25000";
    document.getElementById("reviewerSelect").value = "Controller";
    document.getElementById("slaSelect").value = "24h";
    document.getElementById("expectedAnswer").hidden = true;
    renderAll();
  });
  document.getElementById("exportSummary").addEventListener("click", exportSummary);
  document.getElementById("showExpectedAnswer").addEventListener("click", () => {
    const panel = document.getElementById("expectedAnswer");
    panel.hidden = !panel.hidden;
  });
  renderAll();
});
