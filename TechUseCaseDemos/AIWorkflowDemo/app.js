const workflowScenarios = {
  ap: {
    owner: "AP operations manager",
    approver: "Controller approves exceptions above threshold",
    exception: "Escalate unresolved invoices to controllership",
    decision: "AI triage only",
    evidence: "Invoice image, PO match, GRN match, duplicate-check log",
    sla: "24h for material exceptions",
    fallback: "Route failed classifications to AP exception workbench",
    shadowRisk: "A local-only build could bypass payment-control evidence and release discipline.",
    governed: "Use a governed build with approval matrix, evidence log, and controller gate.",
    buildStance: "Governed build beats shadow IT because invoice exceptions cross approval and evidence boundaries.",
    note: "AI can classify invoice exceptions, but payment release must stay with finance.",
    steps: [
      ["Trigger", "Invoice exception enters queue"],
      ["Standard path", "Stable invoices validate against PO, GRN, and duplicate rules"],
      ["AI step", "Model suggests root-cause category and routing"],
      ["Exception path", "Missing data, duplicates, or threshold breaches move to the exception queue"],
      ["Approval", "Controller approves write-off, override, or release"],
    ],
  },
  close: {
    owner: "Close manager",
    approver: "Controller decides close hold or proceed",
    exception: "Escalate material late reconciliations",
    decision: "AI status support only",
    evidence: "Task completion log, reconciliation support, materiality note",
    sla: "Same day for close-blocking items",
    fallback: "Keep the close hold in manual command center review",
    shadowRisk: "An ungoverned close-status flow can hide blocked evidence and distort close readiness.",
    governed: "Use a governed workflow with materiality rules, evidence completeness, and controller approval.",
    buildStance: "Governed build required because close-status escalation touches materiality and close authority.",
    note: "The workflow is acceptable only if the close hold decision remains human.",
    steps: [
      ["Trigger", "Close task is late or unsupported"],
      ["Standard path", "Non-material delays stay in monitor-only review"],
      ["AI step", "System drafts escalation summary"],
      ["Exception path", "Evidence gaps or material exceptions route to close manager"],
      ["Approval", "Controller decides whether close can proceed"],
    ],
  },
  commentary: {
    owner: "FP&A lead",
    approver: "CFO reviewer sign-off before release",
    exception: "Unsupported claims escalate to source owner",
    decision: "Drafting support",
    evidence: "Management-pack source rows, citation trail, reviewer notes",
    sla: "48h review before management release",
    fallback: "Block release and return draft to reviewer queue",
    shadowRisk: "A local-only draft flow can circulate uncited commentary without reviewer control.",
    governed: "Use a governed build with release states, citation checks, and explicit reviewer sign-off.",
    buildStance: "Governed build required because evidence citation and reviewer sign-off must be explicit.",
    note: "AI can draft commentary, but cited evidence and reviewer sign-off are mandatory.",
    steps: [
      ["Trigger", "Management pack commentary requested"],
      ["Standard path", "Source pack and draft are both attached"],
      ["AI step", "Draft commentary generated from source pack"],
      ["Exception path", "Unsupported or stale claims route back to source owner"],
      ["Approval", "CFO reviewer signs off before circulation"],
    ],
  },
  forecast: {
    owner: "Treasury or FP&A analyst",
    approver: "Business owner confirms assumption changes",
    exception: "High-variance assumptions escalate to CFO sponsor",
    decision: "Challenge support",
    evidence: "Assumption bridge, driver log, prior forecast comparison",
    sla: "24h for material assumption challenges",
    fallback: "Hold the challenged assumption in manual review",
    shadowRisk: "An ungoverned challenge flow can overwrite business judgement without traceable evidence.",
    governed: "Use a governed build with assumption evidence, owner acknowledgement, and escalation thresholds.",
    buildStance: "Governed build preferred because assumption changes affect planning accountability.",
    note: "AI may surface assumption outliers, but forecast judgement remains with management.",
    steps: [
      ["Trigger", "Forecast submission received"],
      ["Standard path", "Routine assumptions pass with evidence attached"],
      ["AI step", "System flags assumption outliers"],
      ["Exception path", "High-variance assumptions route for evidence-based challenge"],
      ["Approval", "Business owner confirms or revises assumptions"],
    ],
  },
};

const stakeholderCopy = {
  cfo: {
    note: "Best for executives deciding which parts of a finance workflow can be accelerated without weakening approval.",
    customize: "Swap in your own workflow names, thresholds, and owners, then validate where approval authority must remain human.",
  },
  operator: {
    note: "Best for process owners, AP managers, treasury teams, and controllership building a safer workflow design.",
    customize: "Use the scenarios as a starter map, then replace the steps with your actual handoffs and escalation rules.",
  },
  faculty: {
    note: "Best for instructors who want one reusable workflow shell across multiple finance courses.",
    customize: "Keep the structure but rename the scenarios to match your course cases.",
  },
  student: {
    note: "Best for learners practicing how to separate AI assistance from approval authority.",
    customize: "Change scenarios and explain where human review must sit.",
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

function currentScenario() {
  const key = document.getElementById("workflowScenario").value;
  return workflowScenarios[key];
}

function warningText() {
  const ownerOk = document.getElementById("ownerState").value === "yes";
  const evidenceOk = document.getElementById("evidenceState").value === "yes";
  const approvalOk = document.getElementById("approvalState").value === "yes";
  if (ownerOk && evidenceOk && approvalOk) return "No immediate governance gap detected in this illustrative flow.";
  const gaps = [];
  if (!ownerOk) gaps.push("named owner");
  if (!evidenceOk) gaps.push("evidence checkpoint");
  if (!approvalOk) gaps.push("approval boundary");
  return `Governance gap: the workflow is missing ${gaps.join(", ")}. This is shadow-IT risk, not a deployable finance flow.`;
}

function renderWorkflow() {
  const scenario = currentScenario();
  document.getElementById("workflowSteps").innerHTML = scenario.steps.map(function(step) {
    const label = step[0];
    const text = step[1];
    return `
      <div class="workflow-step">
        <span>${label}</span>
        <strong>${text}</strong>
        <p>${label === "AI step" ? "Technology assists here, but it does not carry approval authority." : "This step anchors the control design."}</p>
      </div>
    `;
  }).join("");
  document.getElementById("decisionValue").textContent = scenario.decision;
  document.getElementById("ownerValue").textContent = document.getElementById("ownerState").value === "yes" ? scenario.owner : "Owner missing";
  document.getElementById("approvalValue").textContent = document.getElementById("approvalState").value === "yes" ? scenario.approver : "Approval boundary missing";
  document.getElementById("exceptionValue").textContent = scenario.exception;
  document.getElementById("buildStance").textContent = scenario.buildStance;
  document.getElementById("warningValue").textContent = warningText();
  document.getElementById("evidenceValue").textContent = document.getElementById("evidenceState").value === "yes" ? scenario.evidence : "Evidence checkpoint missing";
  document.getElementById("slaValue").textContent = scenario.sla;
  document.getElementById("fallbackValue").textContent = scenario.fallback;
  document.getElementById("shadowRisk").textContent = scenario.shadowRisk;
  document.getElementById("governedValue").textContent = scenario.governed;
  document.getElementById("workflowNote").textContent = scenario.note;
}

function setStakeholder() {
  const key = document.getElementById("stakeholderView").value;
  document.getElementById("stakeholderNote").textContent = stakeholderCopy[key].note;
  document.getElementById("customizationNote").textContent = stakeholderCopy[key].customize;
}

function exportWorkflow() {
  const key = document.getElementById("workflowScenario").value;
  const scenario = workflowScenarios[key];
  const content = [
    "AI Workflow Demo Summary",
    `Stakeholder: ${document.getElementById("stakeholderView").value}`,
    `Scenario: ${key}`,
    `Decision: ${scenario.decision}`,
    `Owner state: ${document.getElementById("ownerState").value}`,
    `Evidence state: ${document.getElementById("evidenceState").value}`,
    `Approval state: ${document.getElementById("approvalState").value}`,
    `Warning: ${warningText()}`,
    "",
    scenario.steps.map(function(step) { return `${step[0]}: ${step[1]}`; }).join("\n"),
  ].join("\n");
  downloadText("ai-workflow-summary.txt", content);
}

document.addEventListener("DOMContentLoaded", function() {
  ["workflowScenario", "ownerState", "evidenceState", "approvalState"].forEach(function(id) {
    document.getElementById(id).addEventListener("change", renderWorkflow);
  });
  document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
  document.getElementById("exportWorkflow").addEventListener("click", exportWorkflow);
  document.getElementById("resetWorkflow").addEventListener("click", function() {
    document.getElementById("workflowScenario").value = "ap";
    document.getElementById("stakeholderView").value = "cfo";
    document.getElementById("ownerState").value = "yes";
    document.getElementById("evidenceState").value = "yes";
    document.getElementById("approvalState").value = "yes";
    setStakeholder();
    renderWorkflow();
  });
  setStakeholder();
  renderWorkflow();
});
