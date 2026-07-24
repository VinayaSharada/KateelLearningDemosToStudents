const workflowScenarios = {
  ap: {
    owner: "AP operations manager",
    approval: "Controller approves exceptions above threshold",
    exception: "Escalate unresolved invoices to controllership",
    decision: "AI triage only",
    buildStance: "Governed build beats shadow IT because invoice exceptions cross approval and evidence boundaries.",
    warning: "Do not release payment from an ungoverned workflow.",
    note: "AI can classify invoice exceptions, but payment release must stay with finance.",
    steps: [
      ["Trigger", "Invoice exception enters queue"],
      ["AI step", "Model suggests root-cause category and routing"],
      ["Human review", "AP analyst confirms classification"],
      ["Approval", "Controller approves write-off, override, or release"],
    ],
  },
  close: {
    owner: "Close manager",
    approval: "Controller decides close hold or proceed",
    exception: "Escalate material late reconciliations",
    decision: "AI status support only",
    buildStance: "Governed build required because close-status escalation touches materiality and close authority.",
    warning: "A close hold decision cannot be automated away.",
    note: "The workflow is acceptable only if the close hold decision remains human.",
    steps: [
      ["Trigger", "Close task is late or unsupported"],
      ["AI step", "System drafts escalation summary"],
      ["Human review", "Close manager validates severity"],
      ["Approval", "Controller decides whether close can proceed"],
    ],
  },
  commentary: {
    owner: "FP&A lead",
    approval: "CFO reviewer sign-off before release",
    exception: "Unsupported claims escalate to source owner",
    decision: "Drafting support",
    buildStance: "Governed build required because evidence citation and reviewer sign-off must be explicit.",
    warning: "Generated commentary without source review should not circulate.",
    note: "AI can draft commentary, but cited evidence and reviewer sign-off are mandatory.",
    steps: [
      ["Trigger", "Management pack commentary requested"],
      ["AI step", "Draft commentary generated from source pack"],
      ["Human review", "FP&A validates claims and tone"],
      ["Approval", "CFO reviewer signs off before circulation"],
    ],
  },
  forecast: {
    owner: "Treasury or FP&A analyst",
    approval: "Business owner confirms assumption changes",
    exception: "High-variance assumptions escalate to CFO sponsor",
    decision: "Challenge support",
    buildStance: "Governed build preferred because assumption changes affect planning accountability.",
    warning: "Forecast judgement remains with business and finance owners.",
    note: "AI may surface assumption outliers, but forecast judgement remains with management.",
    steps: [
      ["Trigger", "Forecast submission received"],
      ["AI step", "System flags assumption outliers"],
      ["Human review", "Analyst challenges assumptions with evidence"],
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

function renderWorkflow() {
  const key = document.getElementById("workflowScenario").value;
  const scenario = workflowScenarios[key];
  document.getElementById("workflowSteps").innerHTML = scenario.steps.map(([label, text]) => `
    <div class="workflow-step">
      <span>${label}</span>
      <strong>${text}</strong>
      <p>${label === "AI step" ? "Technology assists here, but it does not carry approval authority." : "This step anchors the control design."}</p>
    </div>
  `).join("");
  document.getElementById("decisionValue").textContent = scenario.decision;
  document.getElementById("ownerValue").textContent = scenario.owner;
  document.getElementById("approvalValue").textContent = scenario.approval;
  document.getElementById("exceptionValue").textContent = scenario.exception;
  document.getElementById("buildStance").textContent = scenario.buildStance;
  document.getElementById("warningValue").textContent = scenario.warning;
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
    `Owner: ${scenario.owner}`,
    `Approval: ${scenario.approval}`,
    `Exception route: ${scenario.exception}`,
    "",
    ...scenario.steps.map(([label, text]) => `${label}: ${text}`),
  ].join("\n");
  downloadText("ai-workflow-summary.txt", content);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("workflowScenario").addEventListener("change", renderWorkflow);
  document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
  document.getElementById("exportWorkflow").addEventListener("click", exportWorkflow);
  document.getElementById("resetWorkflow").addEventListener("click", () => {
    document.getElementById("workflowScenario").value = "ap";
    document.getElementById("stakeholderView").value = "cfo";
    setStakeholder();
    renderWorkflow();
  });
  setStakeholder();
  renderWorkflow();
});
