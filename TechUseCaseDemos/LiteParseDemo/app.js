const sourceText = `Master Supply Agreement
Payment terms: Net 45 from invoice date.
Quarterly rebate: 2% if annual purchases exceed USD 5m.
Customer may return unsold seasonal inventory within 30 days of quarter-end.
Contract auto-renews for 12 months unless either party gives 60 days' notice.
Invoice annex: current shipment USD 420,000.`;

const extracted = [
  ["Payment terms", "Net 45 from invoice date"],
  ["Rebate", "2% quarterly rebate above annual purchase threshold"],
  ["Return rights", "Unsold seasonal inventory return allowed within 30 days"],
  ["Renewal", "Auto-renews for 12 months with 60-day notice period"],
];

const stakeholderCopy = {
  cfo: {
    note: "Best for executives who want a quick screen of which clauses deserve finance attention.",
    customize: "Replace the fictional source pack with sanitized clauses from your own document set before using the output internally.",
  },
  operator: {
    note: "Best for controllership, legal, procurement, and revenue-review teams screening contract language.",
    customize: "Use your own document pack and align the extracted headings to your review checklist.",
  },
  faculty: {
    note: "Best for instructors who want a simple extraction-versus-judgement teaching tool.",
    customize: "Swap the sample clauses to fit your course while keeping the judgement warning visible.",
  },
  student: {
    note: "Best for learners practicing how extraction can help without replacing judgement.",
    customize: "Compare the extracted clauses to the source text and explain what still needs human interpretation.",
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sourcePack").textContent = sourceText;
  document.getElementById("extractList").innerHTML = extracted.map(([label, text]) => `<div class="parse-item"><span>${label}</span><strong>${text}</strong></div>`).join("");
  document.getElementById("termsValue").textContent = "Net 45";
  document.getElementById("rebateValue").textContent = "Variable consideration risk";
  document.getElementById("returnValue").textContent = "Potential revenue constraint";
  document.getElementById("judgementValue").textContent = "Human accounting review required";
  function setStakeholder() {
    const key = document.getElementById("stakeholderView").value;
    document.getElementById("stakeholderNote").textContent = stakeholderCopy[key].note;
    document.getElementById("customizationNote").textContent = stakeholderCopy[key].customize;
  }
  document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
  document.getElementById("exportParse").addEventListener("click", () => {
    const content = [
      "Lite Parse Demo Review",
      `Stakeholder: ${document.getElementById("stakeholderView").value}`,
      `Payment terms: ${document.getElementById("termsValue").textContent}`,
      `Rebate: ${document.getElementById("rebateValue").textContent}`,
      `Return rights: ${document.getElementById("returnValue").textContent}`,
      `Judgement boundary: ${document.getElementById("judgementValue").textContent}`,
    ].join("\n");
    downloadText("lite-parse-review.txt", content);
  });
  setStakeholder();
});
