const evidenceRows = [
  ["Revenue growth", "Q2 revenue increased 6% year over year."],
  ["Margin", "Gross margin improved by 120 basis points."],
  ["Collections", "DSO improved by 2 days after targeted collections action."],
];
const draftClaims = [
  { claim: "Revenue momentum remained healthy across the quarter.", supported: true, source: "Revenue growth", row: "TB-18 / Sales-B", note: "Trace complete" },
  { claim: "Margin improvement reflects operating discipline and mix quality.", supported: false, source: "Margin cited, but cost-mix driver not traced", row: "No row trace for driver", note: "Inference exceeds evidence" },
  { claim: "Collections improvements eliminated working-capital risk.", supported: false, source: "No source support for eliminated risk", row: "No direct source", note: "Unsupported claim" },
];
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

function renderSummary() {
  document.getElementById("evidenceList").innerHTML = evidenceRows.map(([title, text]) => `<div class="summary-item"><span>${title}</span><strong>${text}</strong></div>`).join("");
  document.getElementById("draftSummary").innerHTML = draftClaims.map((item) => `<div class="claim-item ${item.supported ? "claim-supported" : "claim-unsupported"}"><span>Claim</span><strong>${item.claim}</strong><p>${item.source}</p></div>`).join("");
  const unsupported = draftClaims.filter((item) => !item.supported).length;
  const releaseState = document.getElementById("releaseState").value;
  const traceability = unsupported === 0 ? "Complete" : "Partial";
  document.getElementById("unsupportedCount").textContent = `${unsupported}`;
  document.getElementById("evidenceStatus").textContent = unsupported ? "Needs challenge" : "Evidence aligned";
  document.getElementById("reviewerStatus").textContent = reviewerSigned ? "Signed off" : "Pending";
  document.getElementById("traceabilityValue").textContent = traceability;
  document.getElementById("stalenessValue").textContent = unsupported ? "Reviewer challenge required" : "No stale or contradictory evidence detected";
  document.getElementById("releaseDecision").textContent = reviewerSigned && unsupported === 0 && releaseState === "internal" ? "Ready for internal release" : "Hold for review";
  document.getElementById("traceTableBody").innerHTML = draftClaims.map((item) => `<tr><td>${item.claim}</td><td>${item.row}</td><td>${item.supported ? "Supported" : "Challenge"}</td><td>${item.note}</td></tr>`).join("");
  document.getElementById("claimReview").innerHTML = `<div class="summary-item"><span>Business decision</span><strong>${unsupported ? "At least one claim is unsupported or over-inferred; the draft should not move forward unchanged." : "Claims are evidence-backed, subject to reviewer sign-off."}</strong></div>`;
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
      `Stakeholder: ${document.getElementById("stakeholderView").value}`,
      `Release state: ${document.getElementById("releaseState").value}`,
      `Unsupported claims: ${document.getElementById("unsupportedCount").textContent}`,
      `Evidence status: ${document.getElementById("evidenceStatus").textContent}`,
      `Reviewer sign-off: ${document.getElementById("reviewerStatus").textContent}`,
      `Release decision: ${document.getElementById("releaseDecision").textContent}`,
    ].join("\n");
    downloadText("ai-content-summarizer-review.txt", content);
  });
  setStakeholder();
  renderSummary();
});
