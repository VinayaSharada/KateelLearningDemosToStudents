const defaults = {
  initiativeName: "AP exception routing assistant",
  initiativeOwner: "Finance transformation lead",
  cfoSponsor: "Deputy CFO",
  cioOwner: "Enterprise applications lead",
  processOwner: "AP operations manager",
  dataOwner: "ERP data steward",
  evidence: "Pilot results, control walkthrough, and reviewer sign-off evidence are documented.",
  risk: "Unsupported exception handling could bypass policy without reviewer challenge.",
  approval: "Pilot approval",
  reviewDate: "2026-08-15",
};

const modeCopy = {
  facilitator: {
    description: "Facilitator mode highlights the approval-readiness decision in 5-8 minutes.",
    task: "Review the decision record and explain whether the initiative is ready for the next approval step.",
  },
  participant: {
    description: "Participant mode gives learners 10 minutes to improve the decision record and make a governance call.",
    task: "Update the record and decide whether the initiative is approval-ready or still needs more evidence, ownership, or risk detail.",
  },
};

const stakeholderCopy = {
  cfo: {
    note: "Best for executive sponsors checking whether an initiative is documented well enough to approve responsibly.",
    customize: "Replace the sample roles and evidence with your own steering, risk, and approval structure.",
  },
  operator: {
    note: "Best for PMO, process owners, data owners, and finance transformation teams maintaining the decision trail.",
    customize: "Use the record as a reusable template for initiatives, pilots, and governance checkpoints.",
  },
  faculty: {
    note: "Best for instructors who want a repeatable decision-record artifact rather than a one-off case note.",
    customize: "Rename the fields to fit your course while keeping ownership, evidence, and approval explicit.",
  },
  student: {
    note: "Best for learners practicing how a finance decision record should look before approval.",
    customize: "Edit one field at a time and explain what makes the record stronger or weaker.",
  },
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

function getFormData() {
  return {
    initiativeName: document.getElementById("initiativeName").value.trim(),
    initiativeOwner: document.getElementById("initiativeOwner").value.trim(),
    cfoSponsor: document.getElementById("cfoSponsor").value.trim(),
    cioOwner: document.getElementById("cioOwner").value.trim(),
    processOwner: document.getElementById("processOwner").value.trim(),
    dataOwner: document.getElementById("dataOwner").value.trim(),
    evidence: document.getElementById("evidence").value.trim(),
    risk: document.getElementById("risk").value.trim(),
    approval: document.getElementById("approval").value,
    reviewDate: document.getElementById("reviewDate").value,
  };
}

function classifyRecord(data) {
  const required = [
    data.initiativeOwner,
    data.cfoSponsor,
    data.cioOwner,
    data.processOwner,
    data.dataOwner,
    data.evidence,
    data.risk,
    data.reviewDate,
  ];
  const completeness = required.filter(Boolean).length;

  if (completeness === required.length && data.approval === "Ready for steering approval") {
    return {
      readiness: "Ready for approval",
      action: "Take to steering review",
      evidenceStatus: "Evidence present",
      className: "state-ready",
    };
  }

  if (completeness >= required.length - 1) {
    return {
      readiness: "Needs review",
      action: "Close the final evidence or ownership gap",
      evidenceStatus: "Mostly complete",
      className: "state-review",
    };
  }

  return {
    readiness: "Hold record",
    action: "Complete ownership and evidence before approval",
    evidenceStatus: "Incomplete",
    className: "state-hold",
  };
}

function renderTracker() {
  const data = getFormData();
  const state = classifyRecord(data);

  const readinessValue = document.getElementById("readinessValue");
  readinessValue.textContent = state.readiness;
  readinessValue.className = `value ${state.className}`;
  document.getElementById("riskValue").textContent = data.risk || "Risk not stated";
  document.getElementById("approvalValue").textContent = data.approval;
  document.getElementById("reviewValue").textContent = data.reviewDate || "Review date missing";
  document.getElementById("ownerValue").textContent = data.initiativeOwner || "Owner missing";
  document.getElementById("sponsorValue").textContent = data.cfoSponsor || "Sponsor missing";
  document.getElementById("evidenceValue").textContent = state.evidenceStatus;
  document.getElementById("actionValue").textContent = state.action;

  document.getElementById("decisionSnapshot").innerHTML = [
    ["Initiative", data.initiativeName],
    ["Initiative owner", data.initiativeOwner],
    ["CFO sponsor", data.cfoSponsor],
    ["CIO owner", data.cioOwner],
    ["Process owner", data.processOwner],
    ["Data owner", data.dataOwner],
    ["Evidence", data.evidence],
    ["Risk", data.risk],
  ].map(([label, value]) => `
    <div class="tracker-snapshot-item">
      <span>${label}</span>
      <strong>${value || "Not provided"}</strong>
    </div>
  `).join("");

  document.getElementById("businessNote").textContent =
    `Business decision: ${state.readiness}. Finance leadership should confirm that ownership, evidence, risk, and review cadence are explicit before allowing the initiative to move forward.`;

  document.getElementById("expectedAnswer").innerHTML =
    `<p><strong>Expected answer:</strong> ${state.readiness} is appropriate because the record shows <strong>${state.evidenceStatus.toLowerCase()}</strong> and the next action is <strong>${state.action.toLowerCase()}</strong>. Approval should remain human and tied to the named owner, CFO sponsor, risk statement, and review date.</p>`;
}

function setStakeholder() {
  const key = document.getElementById("stakeholderView").value;
  document.getElementById("stakeholderNote").textContent = stakeholderCopy[key].note;
  document.getElementById("customizationNote").textContent = stakeholderCopy[key].customize;
}

function exportTracker() {
  const data = getFormData();
  const content = [
    "AI Decision Tracker Summary",
    `Stakeholder: ${document.getElementById("stakeholderView").value}`,
    `Readiness: ${document.getElementById("readinessValue").textContent}`,
    `Approval path: ${document.getElementById("approvalValue").textContent}`,
    `Review date: ${document.getElementById("reviewValue").textContent}`,
    `Initiative: ${data.initiativeName}`,
    `Initiative owner: ${data.initiativeOwner}`,
    `CFO sponsor: ${data.cfoSponsor}`,
    `CIO owner: ${data.cioOwner}`,
    `Process owner: ${data.processOwner}`,
    `Data owner: ${data.dataOwner}`,
    `Evidence: ${data.evidence}`,
    `Risk: ${data.risk}`,
  ].join("\n");
  downloadText("ai-decision-tracker-summary.txt", content);
}

function resetTracker() {
  Object.entries(defaults).forEach(([id, value]) => {
    document.getElementById(id).value = value;
  });
  document.getElementById("expectedAnswer").hidden = true;
  setMode("facilitator");
  renderTracker();
}

function setMode(mode) {
  document.getElementById("modeDescription").textContent = modeCopy[mode].description;
  document.getElementById("participantTask").textContent = modeCopy[mode].task;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("decisionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    renderTracker();
  });
  document.getElementById("facilitatorMode").addEventListener("click", () => setMode("facilitator"));
  document.getElementById("participantMode").addEventListener("click", () => setMode("participant"));
  document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
  document.getElementById("exportTracker").addEventListener("click", exportTracker);
  document.getElementById("resetTracker").addEventListener("click", resetTracker);
  document.getElementById("showExpectedAnswer").addEventListener("click", () => {
    const panel = document.getElementById("expectedAnswer");
    panel.hidden = !panel.hidden;
  });
  setStakeholder();
  resetTracker();
});
