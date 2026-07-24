const scorecardItems = [
  {
    id: "traceability",
    title: "Source traceability",
    why: "Finance must trace generated output back to source evidence.",
    owner: "Data owner",
    defaultValue: 4,
    evidence: "Source-to-output mapping and cited evidence log",
  },
  {
    id: "dataClassification",
    title: "Data classification",
    why: "Sensitive finance data should be classified before model access is approved.",
    owner: "Data owner",
    defaultValue: 3,
    evidence: "Data classification and access rule",
  },
  {
    id: "approvalRights",
    title: "Approval rights",
    why: "The workflow must make CFO and controller approvals explicit.",
    owner: "CFO sponsor",
    defaultValue: 3,
    evidence: "Approval matrix and sign-off path",
  },
  {
    id: "humanReview",
    title: "Human-in-the-loop",
    why: "A recommendation is not the same as a finance decision.",
    owner: "Process owner",
    defaultValue: 4,
    evidence: "Reviewer checkpoint before release",
  },
  {
    id: "judgementBoundary",
    title: "Ind AS or accounting judgement boundary",
    why: "Accounting judgement must remain with finance and controllership.",
    owner: "Controller",
    defaultValue: 2,
    evidence: "Documented judgement boundary and escalation rule",
  },
  {
    id: "segregation",
    title: "Segregation of duties",
    why: "The same actor should not generate, approve, and post outcomes.",
    owner: "Controls lead",
    defaultValue: 3,
    evidence: "Role separation design",
  },
  {
    id: "auditEvidence",
    title: "Audit evidence",
    why: "The use case must retain evidence for internal and external review.",
    owner: "Audit liaison",
    defaultValue: 2,
    evidence: "Evidence pack and retention trail",
  },
  {
    id: "loggingMonitoring",
    title: "Logging and monitoring",
    why: "Controlled deployment needs logs, monitoring, and post-release trigger ownership.",
    owner: "Technology owner",
    defaultValue: 2,
    evidence: "Monitoring dashboard and trigger log",
  },
  {
    id: "exceptionOwnership",
    title: "Exception ownership",
    why: "Every exception needs a named owner and escalation route.",
    owner: "Operations lead",
    defaultValue: 3,
    evidence: "Exception register and SLA",
  },
];

const modeCopy = {
  facilitator: {
    description: "Facilitator mode highlights the control decision and approval logic in 5-8 minutes.",
    task: "Review the weakest controls and decide whether deployment should proceed.",
  },
  participant: {
    description: "Participant mode gives learners 10 minutes to test governance assumptions and make a deployment call.",
    task: "Change the control ratings and decide whether the use case is deployment-ready, pilot-only, or needs remediation first.",
  },
};

const stakeholderCopy = {
  cfo: {
    note: "Best for executive sponsors deciding whether deployment is safe enough for broader rollout.",
    customize: "Replace the illustrative ratings with your own policy, approval, and evidence thresholds before using the decision output internally.",
  },
  operator: {
    note: "Best for controllership, audit, compliance, data, and process owners coordinating remediation work.",
    customize: "Use the control list as a working checklist, then rename owners and evidence items to match your governance model.",
  },
  faculty: {
    note: "Best for instructors who want one governance sandbox that works across finance, compliance, and AI courses.",
    customize: "Keep the control categories, but substitute local terminology or course-specific evidence rules.",
  },
  student: {
    note: "Best for learners practicing how deployment readiness should be challenged before approval.",
    customize: "Change one control area at a time and explain why the decision moved.",
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

function getStateClass(score) {
  if (score >= 4.2) return "state-good";
  if (score >= 3) return "state-medium";
  return "state-poor";
}

function buildScorecard() {
  const root = document.getElementById("scorecardGrid");
  root.innerHTML = scorecardItems.map((item) => `
    <div class="gov-item">
      <h4>${item.title}</h4>
      <p>${item.why}</p>
      <label for="${item.id}">Rating</label>
      <input id="${item.id}" type="range" min="1" max="5" step="1" value="${item.defaultValue}">
      <div class="gov-rating-row">
        <span>Weak</span>
        <strong id="${item.id}Value">${item.defaultValue}/5</strong>
        <span>Strong</span>
      </div>
    </div>
  `).join("");
}

function getRatings() {
  return scorecardItems.map((item) => ({
    ...item,
    rating: Number(document.getElementById(item.id).value),
  }));
}

function classifyDecision(overallScore, weakItems) {
  if (overallScore >= 4.6 && weakItems.length === 0) {
    return {
      decision: "Scale",
      approval: "Scale approval with routine monitoring",
      exception: "Continuous monitoring only",
      className: "state-good",
    };
  }
  if (overallScore >= 4 && weakItems.length === 0) {
    return {
      decision: "Controlled deployment",
      approval: "CFO and controller sign-off",
      exception: "Routine monitoring only",
      className: "state-good",
    };
  }
  if (overallScore >= 3) {
    return {
      decision: "Pilot only",
      approval: "Pilot approval with remediation gate",
      exception: "Track exceptions weekly",
      className: "state-medium",
    };
  }
  if (overallScore >= 2.2) {
    return {
      decision: "Remediate before pilot",
      approval: "Do not pilot until named fixes are complete",
      exception: "Escalate failed controls to CFO sponsor and CIO owner",
      className: "state-poor",
    };
  }
  return {
    decision: "Stop",
    approval: "Do not deploy broadly yet",
    exception: "Escalate control gaps to CFO sponsor",
    className: "state-poor",
  };
}

function renderScorecard() {
  const ratings = getRatings();
  ratings.forEach((item) => {
    document.getElementById(`${item.id}Value`).textContent = `${item.rating}/5`;
  });

  const overallScore = ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;
  const weakItems = ratings.filter((item) => item.rating <= 2);
  const mainGap = ratings.slice().sort((a, b) => a.rating - b.rating)[0];
  const decisionState = classifyDecision(overallScore, weakItems);

  document.getElementById("overallScore").textContent = `${overallScore.toFixed(1)}/5`;
  document.getElementById("overallScore").className = `value ${decisionState.className}`;
  document.getElementById("weakCount").textContent = weakItems.length ? `${weakItems.length} weak` : "None";

  const decisionValue = document.getElementById("decisionValue");
  decisionValue.textContent = decisionState.decision;
  decisionValue.className = `value ${decisionState.className}`;
  document.getElementById("approvalValue").textContent = decisionState.approval;
  document.getElementById("mainGap").textContent = mainGap.title;
  document.getElementById("ownerValue").textContent = mainGap.owner;
  document.getElementById("evidenceValue").textContent = mainGap.evidence;
  document.getElementById("exceptionValue").textContent = decisionState.exception;

  document.getElementById("detailTableBody").innerHTML = ratings.map((item) => `
    <tr>
      <td>${item.title}</td>
      <td>${item.rating}/5</td>
      <td>${item.why}</td>
      <td>${item.owner}</td>
    </tr>
  `).join("");

  document.getElementById("businessNote").textContent =
    `Business decision: ${decisionState.decision}. The main gap is ${mainGap.title.toLowerCase()}, owned by ${mainGap.owner}. Approval should depend on clear evidence for ${mainGap.evidence.toLowerCase()}.`;

  document.getElementById("expectedAnswer").innerHTML =
    `<p><strong>Expected answer:</strong> ${decisionState.decision} is appropriate because the overall governance score is <strong>${overallScore.toFixed(1)}/5</strong>. The main control gap is <strong>${mainGap.title}</strong>, owned by <strong>${mainGap.owner}</strong>. Approval remains human and should require <strong>${mainGap.evidence}</strong> before broader deployment.</p>`;
}

function setStakeholder() {
  const key = document.getElementById("stakeholderView").value;
  document.getElementById("stakeholderNote").textContent = stakeholderCopy[key].note;
  document.getElementById("customizationNote").textContent = stakeholderCopy[key].customize;
}

function exportScorecard() {
  const ratings = getRatings();
  const content = [
    "AI Governance Scorecard Summary",
    `Stakeholder: ${document.getElementById("stakeholderView").value}`,
    `Decision: ${document.getElementById("decisionValue").textContent}`,
    `Overall score: ${document.getElementById("overallScore").textContent}`,
    `Weak controls: ${document.getElementById("weakCount").textContent}`,
    `Main gap: ${document.getElementById("mainGap").textContent}`,
    `Owner: ${document.getElementById("ownerValue").textContent}`,
    `Evidence needed: ${document.getElementById("evidenceValue").textContent}`,
    "",
    "Ratings",
    ...ratings.map((item) => `${item.title}: ${item.rating}/5`),
  ].join("\n");
  downloadText("ai-governance-scorecard-summary.txt", content);
}

function resetScorecard() {
  scorecardItems.forEach((item) => {
    document.getElementById(item.id).value = String(item.defaultValue);
  });
  document.getElementById("expectedAnswer").hidden = true;
  setMode("facilitator");
  renderScorecard();
}

function setMode(mode) {
  document.getElementById("modeDescription").textContent = modeCopy[mode].description;
  document.getElementById("participantTask").textContent = modeCopy[mode].task;
}

document.addEventListener("DOMContentLoaded", () => {
  buildScorecard();
  scorecardItems.forEach((item) => {
    document.getElementById(item.id).addEventListener("input", renderScorecard);
  });
  document.getElementById("facilitatorMode").addEventListener("click", () => setMode("facilitator"));
  document.getElementById("participantMode").addEventListener("click", () => setMode("participant"));
  document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
  document.getElementById("exportScorecard").addEventListener("click", exportScorecard);
  document.getElementById("resetScorecard").addEventListener("click", resetScorecard);
  document.getElementById("showExpectedAnswer").addEventListener("click", () => {
    const panel = document.getElementById("expectedAnswer");
    panel.hidden = !panel.hidden;
  });
  setStakeholder();
  resetScorecard();
});
