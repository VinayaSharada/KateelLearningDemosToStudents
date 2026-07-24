const clauses = [
  {
    clause: "Performance obligation",
    source: "Customer purchases hardware bundle with 24 months of support and quarterly update services.",
    signal: "Hardware and support are likely separate obligations.",
    confidence: "High",
    finance: "Should hardware and support be separated for revenue timing?",
    legal: "Is support separately enforceable and separately priced?",
    queue: "Revenue / Ind AS assessment",
    owner: "Controller"
  },
  {
    clause: "Variable consideration",
    source: "Quarter-end rebate of 4% applies when annual volume exceeds 12,000 units.",
    signal: "Volume rebate may constrain recognized revenue.",
    confidence: "Medium",
    finance: "What rebate estimate should be constrained in revenue?",
    legal: "Is the rebate formula binding and free of dispute rights?",
    queue: "Cash impact + revenue review",
    owner: "FP&A + legal"
  },
  {
    clause: "Return rights",
    source: "Distributor may return unused stock within 45 days if packaging remains intact.",
    signal: "Return rights affect revenue timing and reserve needs.",
    confidence: "High",
    finance: "Does the return window change revenue timing or reserve treatment?",
    legal: "Are return conditions narrow enough to enforce?",
    queue: "Revenue / Ind AS assessment",
    owner: "Revenue accounting"
  },
  {
    clause: "Renewal clause",
    source: "Agreement renews automatically for one year unless either party gives 60 days' notice after the first year only.",
    signal: "Auto-renewal applies immediately to the initial term.",
    confidence: "Low",
    finance: "Does the renewal option affect contract term or financing assessment?",
    legal: "Does the qualifier limit renewal only after the first year?",
    queue: "Legal review",
    owner: "Legal counsel",
    hasQualifierError: true
  },
  {
    clause: "Financing component",
    source: "Customer pays 14 months after delivery for a material portion of the contract value.",
    signal: "A significant financing component may exist.",
    confidence: "Medium",
    finance: "Does payment timing require financing-component analysis?",
    legal: "Are deferred-payment terms explicit and enforceable?",
    queue: "Cash impact + revenue review",
    owner: "Treasury + controller"
  },
  {
    clause: "Termination right",
    source: "Customer may terminate for non-performance, but supplier retains rights to completed milestone fees.",
    signal: "Termination rights may affect enforceable commitment.",
    confidence: "Medium",
    finance: "How does termination affect remaining obligation assessment?",
    legal: "Are milestone fees enforceable after termination?",
    queue: "Commitment / legal review",
    owner: "Legal counsel"
  }
];

let qualifierFixed = false;

function viewClause(clause) {
  if (!clause.hasQualifierError || qualifierFixed) return clause;
  return clause;
}

function signalText(clause) {
  if (!clause.hasQualifierError || qualifierFixed) return clause.signal;
  return "Auto-renewal applies immediately to the initial term.";
}

function correctedSignal(clause) {
  if (!clause.hasQualifierError) return clause.signal;
  return qualifierFixed
    ? "Auto-renewal applies only after the first year, subject to notice."
    : clause.signal;
}

function confidenceValue(clause) {
  if (!clause.hasQualifierError) return clause.confidence;
  return qualifierFixed ? "Corrected by finance/legal review" : clause.confidence;
}

function renderAll() {
  document.getElementById("contractItems").innerHTML = clauses.map((item) => `
    <div class="trace-card">
      <span>${item.clause} • ${confidenceValue(item)}</span>
      <strong>${correctedSignal(item)}</strong>
      <p><strong>Source clause:</strong> ${item.source}</p>
      <p><strong>Finance question:</strong> ${item.finance}</p>
      <p><strong>Legal question:</strong> ${item.legal}</p>
    </div>
  `).join("");

  document.getElementById("contractRows").innerHTML = clauses.map((item) => `
    <tr>
      <td>${item.clause}</td>
      <td>${item.source}</td>
      <td>${correctedSignal(item)}</td>
      <td>${confidenceValue(item)}</td>
      <td>${item.finance}</td>
      <td>${item.legal}</td>
      <td>${item.queue}</td>
      <td>${item.owner}</td>
    </tr>
  `).join("");

  document.getElementById("qualifierValue").textContent = qualifierFixed
    ? "Qualifier corrected: renewal applies only after year one"
    : "One extracted clause still misses the renewal qualifier";
  document.getElementById("reviewStateValue").textContent = qualifierFixed
    ? "Finance and legal review completed for the error example"
    : "Open - renewal qualifier requires human correction";
  document.getElementById("registerValue").textContent = qualifierFixed
    ? "Reviewed obligation register ready for human accounting conclusion"
    : "Awaiting finance/legal correction before obligation register is complete";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fixQualifier").addEventListener("click", () => {
    qualifierFixed = !qualifierFixed;
    renderAll();
  });
  renderAll();
});
