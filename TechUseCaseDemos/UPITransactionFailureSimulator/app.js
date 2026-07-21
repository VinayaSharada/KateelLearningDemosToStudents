function fmtInr(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function simulateUpi() {
  const kind = document.getElementById("upiType").value;
  const amount = Number(document.getElementById("upiAmount").value || 0);
  const bankResponse = document.getElementById("bankResponse").value;
  const duplicate = document.getElementById("duplicateToggle").checked;
  const fraud = document.getElementById("fraudToggle").checked;
  const nearLimit = document.getElementById("limitToggle").checked;

  const states = [
    ["Initiation", kind === "push" ? "Payer starts a push payment." : "Payee sends a collect request."],
    ["PSP validation", "PSP checks credentials, velocity, and app-side controls."],
    ["NPCI routing", "Switch routes message to the counterparty PSP / bank path."],
    ["Bank action", bankResponse === "approve" ? "Beneficiary side accepts and posts the credit." : bankResponse === "timeout" ? "No definitive response arrives before timeout window." : "Beneficiary side rejects or fails validation."],
    ["Closure", "Apps, banks, and reconciliation files interpret the outcome."]
  ];

  const exceptions = [];
  let finalStatus = "Success";
  let settlementStatus = "Posted";
  let reconciliation = "No exception";
  let supportLoad = "Low";

  if (bankResponse === "timeout") {
    finalStatus = "Pending / uncertain";
    settlementStatus = "Unknown until later confirmation";
    reconciliation = "Customer may see debit uncertainty; ops must resolve late outcome";
    supportLoad = "High";
    exceptions.push(["Timeout ambiguity", "The payer may retry before the original instruction is fully resolved, creating duplicate-risk and support friction."]);
  }

  if (bankResponse === "reject") {
    finalStatus = "Failed";
    settlementStatus = "No beneficiary credit";
    reconciliation = "Failure trace required across PSP and bank logs";
    supportLoad = "Medium";
    exceptions.push(["Failed posting", "The payment attempt failed after routing, so customer communication and reversal certainty matter."]);
  }

  if (duplicate) {
    exceptions.push(["Duplicate instruction risk", "A second initiation or retry can create multiple references for one intended payment."]);
    reconciliation = "Duplicate-check and reference matching required";
    supportLoad = "High";
  }

  if (fraud) {
    exceptions.push(["Fraud review", "Velocity or mule-risk checks force extra verification or a hold before closure."]);
    finalStatus = finalStatus === "Success" ? "Held for review" : finalStatus;
    settlementStatus = finalStatus === "Held for review" ? "Delayed until review completes" : settlementStatus;
  }

  if (nearLimit) {
    exceptions.push(["Limit / threshold pressure", "The transaction is near a policy boundary, so approval, step-up checks, or fallback handling may change."]);
  }

  document.getElementById("statusValue").textContent = finalStatus;
  document.getElementById("settlementValue").textContent = settlementStatus;
  document.getElementById("exceptionValue").textContent = exceptions.length ? `${exceptions.length} exception(s)` : "Clean path";
  document.getElementById("supportValue").textContent = supportLoad;
  document.getElementById("amountValue").textContent = fmtInr(amount);

  document.getElementById("timeline").innerHTML = states.map(([step, detail], idx) => `
    <div class="state-item">
      <div class="step">Stage ${idx + 1}</div>
      <div class="status">${step}</div>
      <div class="detail">${detail}</div>
    </div>
  `).join("");

  document.getElementById("exceptions").innerHTML = (exceptions.length ? exceptions : [["No exception", "The transaction followed the happy path with minimal operational ambiguity."]]).map(([title, detail]) => `
    <div class="exception-item">
      <strong>${title}</strong>
      <div class="detail">${detail}</div>
    </div>
  `).join("");

  document.getElementById("outcomeBox").textContent =
    `${kind === "push" ? "Push" : "Collect"} flow for ${fmtInr(amount)} ended as "${finalStatus}". The teaching point is not just whether the payment succeeded, but whether all participants agree on the same state at the same time.`;
}

document.getElementById("simulateUpiBtn").addEventListener("click", simulateUpi);
simulateUpi();
