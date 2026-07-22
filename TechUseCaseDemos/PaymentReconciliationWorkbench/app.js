const defaults = {
  materialityThreshold: 500000,
  missingCount: 2,
  duplicateCount: 1,
  feeMismatchCount: 2,
  reversalCount: 1,
  settlementLagCount: 1,
};

const modeCopy = {
  facilitator: {
    description: "Facilitator mode highlights the decision path, evidence, and approval logic in 5-8 minutes.",
    task: "Show the default queue, identify the material exception, and explain whether the controller should allow close.",
  },
  participant: {
    description: "Participant mode gives learners 10 minutes to classify the break, assign ownership, and decide whether close should be blocked.",
    task: "Change the scenario, decide whether close can proceed, and state the owner, SLA, escalation path, and approval condition.",
  },
};

const stakeholderCopy = {
  cfo: {
    note: "Best for executives deciding whether close can proceed and whether the exception queue is materially risky.",
    customize: "Replace the illustrative counts and materiality threshold with your own payment-control tolerance and close policy.",
  },
  operator: {
    note: "Best for controller, payments operations, treasury, or reconciliations teams who need a reusable exception discussion aid.",
    customize: "Map the exception classes and owners to your bank, gateway, network, and ERP environment.",
  },
  faculty: {
    note: "Best for instructors who want a reusable reconciliation shell across payments, treasury, and controls courses.",
    customize: "Keep the structure and substitute local terminology, file sources, and escalation standards.",
  },
  student: {
    note: "Best for learners practicing how finance turns mismatches into a close decision.",
    customize: "Change one input at a time and explain why risk and escalation changed.",
  },
};

let currentMode = "facilitator";

function formatInr(value) {
  return `INR ${Number(value).toLocaleString("en-IN")}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function pushExceptions(items, count, config) {
  for (let i = 1; i <= count; i++) {
    items.push({
      className: config.className,
      reference: `${config.prefix}${i}`,
      unmatchedValue: config.baseValue + i * config.stepValue,
      ageingDays: config.ageingDays + i,
      rootCause: config.rootCause,
      owner: config.owner,
      mismatch: config.mismatch,
      action: config.action,
      blocksClose: config.blocksClose,
      sla: config.sla,
      escalation: config.escalation,
    });
  }
}

function makeExceptions() {
  const missing = Number(document.getElementById("missingCount").value || 0);
  const duplicates = Number(document.getElementById("duplicateCount").value || 0);
  const fee = Number(document.getElementById("feeMismatchCount").value || 0);
  const reversals = Number(document.getElementById("reversalCount").value || 0);
  const settlementLag = Number(document.getElementById("settlementLagCount").value || 0);
  const items = [];

  pushExceptions(items, missing, {
    className: "Missing transaction",
    prefix: "TXN-M",
    baseValue: 220000,
    stepValue: 80000,
    ageingDays: 2,
    rootCause: "Posting gap between merchant and bank settlement files",
    owner: "Payment Operations",
    mismatch: "Present in merchant file, absent in bank-settlement record.",
    action: "Investigate settlement ingestion and hold close if cash or liability is unclear.",
    blocksClose: true,
    sla: "4 hours",
    escalation: "Escalate to controller if still unresolved by close cutoff.",
  });
  pushExceptions(items, duplicates, {
    className: "Duplicate record",
    prefix: "TXN-D",
    baseValue: 140000,
    stepValue: 50000,
    ageingDays: 1,
    rootCause: "Retry logic or idempotency failure",
    owner: "Gateway Operations",
    mismatch: "Two references appear for one customer-intended payment.",
    action: "Confirm economic exposure and reverse duplicate booking path.",
    blocksClose: false,
    sla: "1 business day",
    escalation: "Escalate only if customer impact or ledger duplication remains unresolved.",
  });
  pushExceptions(items, fee, {
    className: "Fee discrepancy",
    prefix: "TXN-F",
    baseValue: 45000,
    stepValue: 15000,
    ageingDays: 3,
    rootCause: "Incorrect MDR, routing, or tax treatment",
    owner: "Finance Controls",
    mismatch: "Gateway/acquirer/net fee differs from expected schedule.",
    action: "Validate fee schedule and accrue difference if below materiality threshold.",
    blocksClose: false,
    sla: "2 business days",
    escalation: "Escalate if cumulative fee variance becomes material.",
  });
  pushExceptions(items, reversals, {
    className: "Pending reversal",
    prefix: "TXN-R",
    baseValue: 300000,
    stepValue: 110000,
    ageingDays: 4,
    rootCause: "Customer-facing reversal not reflected across all ledgers",
    owner: "Card Operations",
    mismatch: "Customer-facing reversal initiated but not yet reflected in all files.",
    action: "Hold closure until ledgers agree on final liability and customer position.",
    blocksClose: true,
    sla: "Same day",
    escalation: "Escalate immediately to controller and product ops.",
  });
  pushExceptions(items, settlementLag, {
    className: "Settlement-date difference",
    prefix: "TXN-S",
    baseValue: 260000,
    stepValue: 70000,
    ageingDays: 5,
    rootCause: "Cutoff or posting-date mismatch across institutions",
    owner: "Banking Operations",
    mismatch: "Settlement date differs across bank, network, and merchant records.",
    action: "Validate cutoff logic and assess whether the period-close view is misstated.",
    blocksClose: true,
    sla: "4 hours",
    escalation: "Escalate when close-period cash or liability is misstated.",
  });

  return items;
}

function determineRootCause(exceptions) {
  if (!exceptions.length) return "No active root cause";
  const counts = exceptions.reduce((acc, item) => {
    acc[item.rootCause] = (acc[item.rootCause] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function renderRecon() {
  const exceptions = makeExceptions();
  const threshold = Number(document.getElementById("materialityThreshold").value || 0);
  const total = exceptions.length;
  const unmatchedValue = exceptions.reduce((sum, item) => sum + item.unmatchedValue, 0);
  const agedExceptions = exceptions.filter(item => item.ageingDays >= 4).length;
  const materialCount = exceptions.filter(item => item.unmatchedValue >= threshold || item.blocksClose).length;
  const closeBlocked = exceptions.some(item => item.blocksClose && item.unmatchedValue >= threshold * 0.6) || unmatchedValue >= threshold;
  const topException = exceptions.slice().sort((a, b) => b.unmatchedValue - a.unmatchedValue)[0];
  const rootCause = determineRootCause(exceptions);

  document.getElementById("totalExceptions").textContent = String(total);
  document.getElementById("unmatchedValue").textContent = formatInr(unmatchedValue);
  document.getElementById("agedExceptions").textContent = `${agedExceptions} aged / ${materialCount} material`;
  document.getElementById("closureRisk").textContent = closeBlocked ? "High" : total ? "Managed" : "Low";
  document.getElementById("closureRisk").className = `value ${closeBlocked ? "severity-high" : "severity-managed"}`;
  document.getElementById("approvalState").textContent = closeBlocked ? "Controller hold" : "Controller review";
  document.getElementById("rootCause").textContent = rootCause;
  document.getElementById("ownerName").textContent = topException ? topException.owner : "Finance Controls";
  document.getElementById("slaValue").textContent = topException ? topException.sla : "No action";
  document.getElementById("escalationOutcome").textContent = closeBlocked ? "Escalate before close" : total ? "Monitor and evidence" : "Safe to close";

  const rows = exceptions.length ? exceptions : [{
    className: "No exceptions",
    reference: "-",
    unmatchedValue: 0,
    ageingDays: 0,
    rootCause: "No active issue",
    owner: "Finance Controls",
    mismatch: "All fictional files align.",
    action: "Safe to close the period after routine controller review.",
  }];

  document.getElementById("exceptionTableBody").innerHTML = rows.map(item => `
    <tr>
      <td>${escapeHtml(item.className)}</td>
      <td>${escapeHtml(item.reference)}</td>
      <td>${escapeHtml(formatInr(item.unmatchedValue))}</td>
      <td>${escapeHtml(item.ageingDays)} days</td>
      <td>${escapeHtml(item.rootCause)}</td>
      <td>${escapeHtml(item.owner)}</td>
      <td>${escapeHtml(item.mismatch)}</td>
      <td>${escapeHtml(item.action)}</td>
    </tr>
  `).join("");

  document.getElementById("reconNote").textContent = total
    ? `Business decision: ${closeBlocked ? "close should pause until material exceptions are evidenced and approved." : "close may proceed only after controller review confirms the remaining exceptions are immaterial or provisioned."} Evidence required: bank, gateway, network, and merchant file alignment for the highest-value breaks.`
    : "Business decision: close may proceed. Even with a clean run, the controller approval point remains human.";

  document.getElementById("expectedAnswer").innerHTML = total
    ? `<p><strong>Expected answer:</strong> ${closeBlocked ? "Do not allow close yet." : "Close may proceed after review."} The key break is <strong>${escapeHtml(topException.className)}</strong>, driven by <strong>${escapeHtml(rootCause)}</strong>. The owner is <strong>${escapeHtml(topException.owner)}</strong>, the SLA is <strong>${escapeHtml(topException.sla)}</strong>, and the escalation outcome is <strong>${closeBlocked ? "controller escalation before close" : "document and monitor"}</strong>.</p>`
    : "<p><strong>Expected answer:</strong> No material exceptions remain. Controller review can document the clean state and allow close.</p>";
}

function setStakeholder() {
  const key = document.getElementById("stakeholderView").value;
  document.getElementById("stakeholderNote").textContent = stakeholderCopy[key].note;
  document.getElementById("customizationNote").textContent = stakeholderCopy[key].customize;
}

function exportRecon() {
  const content = [
    "Payment Reconciliation Workbench Summary",
    `Stakeholder: ${document.getElementById("stakeholderView").value}`,
    `Total exceptions: ${document.getElementById("totalExceptions").textContent}`,
    `Unmatched value: ${document.getElementById("unmatchedValue").textContent}`,
    `Close risk: ${document.getElementById("closureRisk").textContent}`,
    `Approval: ${document.getElementById("approvalState").textContent}`,
    `Root cause: ${document.getElementById("rootCause").textContent}`,
    `Owner: ${document.getElementById("ownerName").textContent}`,
    `SLA: ${document.getElementById("slaValue").textContent}`,
    `Escalation: ${document.getElementById("escalationOutcome").textContent}`,
  ].join("\n");
  downloadText("payment-reconciliation-summary.txt", content);
}

function setMode(mode) {
  currentMode = mode;
  document.getElementById("modeDescription").textContent = modeCopy[mode].description;
  document.getElementById("participantTask").textContent = modeCopy[mode].task;
}

function resetRecon() {
  Object.entries(defaults).forEach(([id, value]) => {
    document.getElementById(id).value = String(value);
  });
  document.getElementById("expectedAnswer").hidden = true;
  setMode("facilitator");
  renderRecon();
}

document.getElementById("runRecon").addEventListener("click", renderRecon);
document.getElementById("resetRecon").addEventListener("click", resetRecon);
document.getElementById("facilitatorMode").addEventListener("click", () => setMode("facilitator"));
document.getElementById("participantMode").addEventListener("click", () => setMode("participant"));
document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
document.getElementById("exportRecon").addEventListener("click", exportRecon);
document.getElementById("showExpectedAnswer").addEventListener("click", () => {
  const panel = document.getElementById("expectedAnswer");
  panel.hidden = !panel.hidden;
});

setStakeholder();
resetRecon();
