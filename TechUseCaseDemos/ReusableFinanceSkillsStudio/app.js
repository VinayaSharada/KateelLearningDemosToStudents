const compareRows = [
  {
    label: "Ad hoc prompt A",
    text: "Margin improved strongly, no issues noted.",
    warning: "No source citation and overconfident tone."
  },
  {
    label: "Ad hoc prompt B",
    text: "Revenue held, margin maybe improved, but one market looked weak.",
    warning: "Inconsistent scope and vague evidence trail."
  },
  {
    label: "Governed skill output",
    text: "Margin improved in the North cluster based on cited workbook rows; South cluster claim withheld because supporting variance detail is missing.",
    warning: "Release only after reviewer sign-off."
  }
];

const modeCopy = {
  facilitator: {
    description: "Facilitator mode highlights the prompt-versus-skill contrast and approval boundary in 5-8 minutes.",
    task: "Show why a governed skill is safer than individual prompting and where reviewer approval still matters."
  },
  participant: {
    description: "Participant mode gives learners 10 minutes to change refusal rules and evidence requirements before deciding on approval.",
    task: "Test whether the skill should be approved, revised, or blocked based on evidence rules and reviewer design."
  }
};

const state = {
  mode: "facilitator"
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

function outcomeSummary() {
  const sourceRule = document.getElementById("sourceRule").value;
  const refusalCount = ["refusal1", "refusal2", "refusal3"].filter((id) => document.getElementById(id).checked).length;
  const reviewer = document.getElementById("reviewerSelect").value;
  const sourceWeak = sourceRule !== "both";

  if (sourceWeak || refusalCount < 2) {
    return {
      v1: "Blocked",
      v2: "Revise before use",
      release: "Evidence gap",
      owner: "FP&A skill owner",
      approval: `${reviewer} must reject current version`,
      reviewDate: "Review in 7 days"
    };
  }
  return {
    v1: "Inconsistent draft",
    v2: "Controlled internal use",
    release: "Approved for internal management use",
    owner: "FP&A skill owner",
    approval: `${reviewer} sign-off before release`,
    reviewDate: "Quarterly review"
  };
}

function renderPromptCompare() {
  document.getElementById("promptCompare").innerHTML = compareRows.map((row) => `
    <div class="trace-card">
      <span>${row.label}</span>
      <strong>${row.text}</strong>
      <p>${row.warning}</p>
    </div>
  `).join("");
}

function renderReview() {
  const summary = outcomeSummary();
  document.getElementById("v1Outcome").textContent = summary.v1;
  document.getElementById("v2Outcome").textContent = summary.v2;
  document.getElementById("releaseValue").textContent = summary.release;
  document.getElementById("reviewDateValue").textContent = summary.reviewDate;
  document.getElementById("ownerValue").textContent = summary.owner;
  document.getElementById("approvalValue").textContent = summary.approval;
  document.getElementById("reviewLog").innerHTML = [
    "Objective set and approved inputs defined",
    "Acceptance test compared ad hoc prompt outputs with governed skill output",
    "Unsupported claim and missing source states checked",
    "Reviewer decision recorded before release"
  ].map((item) => `<div class="trace-card"><span>Review step</span><strong>${item}</strong></div>`).join("");
  document.getElementById("expectedAnswer").innerHTML =
    `<p><strong>Expected answer:</strong> ${summary.release}. A finance skill is reusable only when evidence inputs are explicit, refusal rules are strong enough, and a named reviewer approves use. The skill can draft or analyze, but accountable finance judgement remains human.</p>`;
}

function exportSkillCard() {
  const summary = outcomeSummary();
  const content = [
    "Reusable Finance Skills Studio Summary",
    `Objective: ${document.getElementById("objectiveSelect").value}`,
    `Evidence rule: ${document.getElementById("sourceRule").value}`,
    `Reviewer: ${document.getElementById("reviewerSelect").value}`,
    `Release state: ${summary.release}`,
    `Approval: ${summary.approval}`
  ].join("\n");
  downloadText("finance-skill-card.txt", content);
}

document.addEventListener("DOMContentLoaded", () => {
  const rerender = () => renderReview();
  ["objectiveSelect", "sourceRule", "reviewerSelect", "refusal1", "refusal2", "refusal3"].forEach((id) => {
    document.getElementById(id).addEventListener("change", rerender);
  });
  document.getElementById("facilitatorMode").addEventListener("click", () => {
    state.mode = "facilitator";
    document.getElementById("modeDescription").textContent = modeCopy[state.mode].description;
    document.getElementById("participantTask").textContent = modeCopy[state.mode].task;
  });
  document.getElementById("participantMode").addEventListener("click", () => {
    state.mode = "participant";
    document.getElementById("modeDescription").textContent = modeCopy[state.mode].description;
    document.getElementById("participantTask").textContent = modeCopy[state.mode].task;
  });
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.mode = "facilitator";
    document.getElementById("objectiveSelect").value = "commentary";
    document.getElementById("sourceRule").value = "both";
    document.getElementById("reviewerSelect").value = "FP&A reviewer";
    document.getElementById("refusal1").checked = true;
    document.getElementById("refusal2").checked = true;
    document.getElementById("refusal3").checked = true;
    document.getElementById("modeDescription").textContent = modeCopy[state.mode].description;
    document.getElementById("participantTask").textContent = modeCopy[state.mode].task;
    document.getElementById("expectedAnswer").hidden = true;
    renderReview();
  });
  document.getElementById("exportSkillCard").addEventListener("click", exportSkillCard);
  document.getElementById("showExpectedAnswer").addEventListener("click", () => {
    const panel = document.getElementById("expectedAnswer");
    panel.hidden = !panel.hidden;
  });
  document.getElementById("modeDescription").textContent = modeCopy[state.mode].description;
  document.getElementById("participantTask").textContent = modeCopy[state.mode].task;
  renderPromptCompare();
  renderReview();
});
