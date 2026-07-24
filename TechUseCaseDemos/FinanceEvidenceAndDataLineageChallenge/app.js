const scenario = window.financeManagementPackScenario;
const releaseStates = ["Draft", "Evidence gap", "Reviewer correction", "Approved for internal management use", "Blocked"];
let currentReleaseIndex = 1;
let reviewerSigned = false;

function renderClaims() {
  document.getElementById("lineageClaims").innerHTML = scenario.claims.map((item) => `
    <div class="trace-card ${item.supported ? "trace-supported" : "trace-challenge"}">
      <span>${item.status} • ${item.concept}</span>
      <strong>${item.claim}</strong>
      <p>${item.note}</p>
      <p><strong>Owner:</strong> ${item.owner}</p>
      <p><strong>Source rows:</strong> ${item.sourceRows.join(", ")}</p>
    </div>
  `).join("");
}

function renderEvidenceTable() {
  document.getElementById("evidenceTableBody").innerHTML = scenario.evidenceRows.map((row) => `
    <tr>
      <td>${row.id}</td>
      <td>${row.area}</td>
      <td>${row.concept}</td>
      <td>${row.status}</td>
      <td>${row.source}</td>
    </tr>
  `).join("");
}

function renderDecision() {
  const unsupportedClaims = scenario.claims.filter((claim) => !claim.supported);
  const staleOrConflicting = unsupportedClaims.find((claim) => claim.status === "Contradicted") || unsupportedClaims.find((claim) => claim.note.toLowerCase().includes("stale"));
  const releaseState = releaseStates[currentReleaseIndex];
  const releaseAllowed = reviewerSigned && unsupportedClaims.length === 0 && releaseState === "Approved for internal management use";

  document.getElementById("scenarioValue").textContent = scenario.scenarioName;
  document.getElementById("releaseStateValue").textContent = releaseState;
  document.getElementById("reviewerValue").textContent = scenario.reviewer;
  document.getElementById("approverValue").textContent = scenario.approver;
  document.getElementById("releaseValue").textContent = releaseAllowed ? "Ready for internal release" : "Not fit for release yet";
  document.getElementById("gapValue").textContent = unsupportedClaims.length ? unsupportedClaims[0].note : "No material gap";
  document.getElementById("signoffValue").textContent = reviewerSigned ? "Signed off" : "Pending";
  document.getElementById("conflictValue").textContent = staleOrConflicting ? `${staleOrConflicting.status}: ${staleOrConflicting.note}` : "No stale or contradictory evidence";
  document.getElementById("decisionNote").innerHTML = `
    <span>Business decision</span>
    <strong>${releaseAllowed ? "This draft can move to internal management use." : "This draft must stay in review until unsupported claims, stale evidence, and release controls are resolved."}</strong>
    <p>${scenario.staleEvidenceWarning}</p>
    <p>${scenario.contradictoryEvidenceWarning}</p>
  `;
}

function resetDemo() {
  currentReleaseIndex = 1;
  reviewerSigned = false;
  renderDecision();
}

document.addEventListener("DOMContentLoaded", () => {
  renderClaims();
  renderEvidenceTable();
  resetDemo();

  document.getElementById("lineageReleaseToggle").addEventListener("click", () => {
    currentReleaseIndex = (currentReleaseIndex + 1) % releaseStates.length;
    renderDecision();
  });

  document.getElementById("lineageSignoffToggle").addEventListener("click", () => {
    reviewerSigned = !reviewerSigned;
    renderDecision();
  });

  document.getElementById("lineageReset").addEventListener("click", resetDemo);
});
