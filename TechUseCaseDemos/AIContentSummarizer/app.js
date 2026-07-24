const scenario = window.financeManagementPackScenario;
let reviewerSigned = false;

const stakeholderCopy = {
  cfo: {
    note: "Best for executive reviewers deciding whether a finance narrative is safe enough to circulate.",
    customize: "Replace the sample evidence and claims with your own cited narrative and reviewer checklist before using the output internally.",
  },
  operator: {
    note: "Best for FP&A, investor relations, and finance-review teams preparing management-pack commentary.",
    customize: "Use the evidence-versus-claim pattern on your own narrative and mark unsupported statements before sign-off.",
  },
  faculty: {
    note: "Best for instructors who want one reusable narrative-review shell across finance and governance courses.",
    customize: "Swap the sample narrative and evidence to fit your own case while keeping the review logic intact.",
  },
  student: {
    note: "Best for learners practicing how to challenge unsupported finance narrative.",
    customize: "Review one statement at a time and explain what evidence is missing.",
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

function getEvidenceById(id) {
  return scenario.evidenceRows.find((row) => row.id === id);
}

function getReleaseDecision(releaseState, unsupportedCount) {
  if (releaseState === "blocked") return "Blocked";
  if (releaseState === "gap" || unsupportedCount > 0) return "Hold for review";
  if (releaseState === "corrected" && !reviewerSigned) return "Await reviewer sign-off";
  if (releaseState === "internal" && reviewerSigned && unsupportedCount === 0) return "Ready for internal release";
  if (releaseState === "draft") return "Draft only";
  return "Hold for review";
}

function renderSummary() {
  document.getElementById("scenarioName").textContent = scenario.scenarioName;
  document.getElementById("contradictionWarning").textContent = scenario.contradictoryEvidenceWarning;
  document.getElementById("reviewerName").textContent = scenario.reviewer;

  document.getElementById("evidenceList").innerHTML = scenario.evidenceRows.map((row) => `
    <div class="summary-item">
      <span>${row.area} • ${row.concept}</span>
      <strong>${row.value}</strong>
      <p>${row.source} • ${row.status}</p>
    </div>
  `).join("");

  document.getElementById("draftSummary").innerHTML = scenario.claims.map((item) => `
    <div class="claim-item ${item.supported ? "claim-supported" : "claim-unsupported"}">
      <span>${item.concept}</span>
      <strong>${item.claim}</strong>
      <p>${item.note}</p>
    </div>
  `).join("");

  const unsupported = scenario.claims.filter((item) => !item.supported).length;
  const releaseState = document.getElementById("releaseState").value;
  const traceability = unsupported === 0 ? "Complete" : "Partial";
  const staleOrContradictory = scenario.claims.some((item) => item.status === "Contradicted" || item.note.toLowerCase().includes("stale"));
  const releaseDecision = getReleaseDecision(releaseState, unsupported);

  document.getElementById("unsupportedCount").textContent = `${unsupported}`;
  document.getElementById("evidenceStatus").textContent = unsupported ? "Needs challenge" : "Evidence aligned";
  document.getElementById("reviewerStatus").textContent = reviewerSigned ? "Signed off" : "Pending";
  document.getElementById("traceabilityValue").textContent = traceability;
  document.getElementById("stalenessValue").textContent = staleOrContradictory ? "Stale or contradictory evidence requires challenge" : "No stale or contradictory evidence detected";
  document.getElementById("releaseDecision").textContent = releaseDecision;

  document.getElementById("traceTableBody").innerHTML = scenario.claims.map((item) => {
    const rows = item.sourceRows.map((rowId) => {
      const evidenceRow = getEvidenceById(rowId);
      return evidenceRow ? evidenceRow.source : rowId;
    }).join("; ");
    return `<tr><td>${item.claim}</td><td>${rows}</td><td>${item.status}</td><td>${item.note}</td></tr>`;
  }).join("");

  document.getElementById("claimReview").innerHTML = `
    <div class="summary-item">
      <span>Business decision</span>
      <strong>${unsupported ? "At least one material claim is unsupported, stale, or contradicted; the draft should not move forward unchanged." : "Claims are evidence-backed, subject to reviewer sign-off."}</strong>
      <p>${scenario.staleEvidenceWarning}</p>
    </div>
  `;
}

function setStakeholder() {
  const key = document.getElementById("stakeholderView").value;
  document.getElementById("stakeholderNote").textContent = stakeholderCopy[key].note;
  document.getElementById("customizationNote").textContent = stakeholderCopy[key].customize;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reviewToggle").addEventListener("click", () => {
    reviewerSigned = !reviewerSigned;
    renderSummary();
  });
  document.getElementById("releaseState").addEventListener("change", renderSummary);
  document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
  document.getElementById("exportSummary").addEventListener("click", () => {
    const content = [
      "AI Content Summarizer Review",
      `Scenario: ${scenario.scenarioName}`,
      `Stakeholder: ${document.getElementById("stakeholderView").value}`,
      `Release state: ${document.getElementById("releaseState").value}`,
      `Unsupported claims: ${document.getElementById("unsupportedCount").textContent}`,
      `Evidence status: ${document.getElementById("evidenceStatus").textContent}`,
      `Reviewer sign-off: ${document.getElementById("reviewerStatus").textContent}`,
      `Release decision: ${document.getElementById("releaseDecision").textContent}`,
      `Contradiction note: ${scenario.contradictoryEvidenceWarning}`,
    ].join("\n");
    downloadText("ai-content-summarizer-review.txt", content);
  });
  setStakeholder();
  renderSummary();
});
