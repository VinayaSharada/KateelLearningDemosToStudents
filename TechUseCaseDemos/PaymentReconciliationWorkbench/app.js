function makeExceptions() {
  const missing = Number(document.getElementById("missingCount").value || 0);
  const duplicates = Number(document.getElementById("duplicateCount").value || 0);
  const fee = Number(document.getElementById("feeMismatchCount").value || 0);
  const reversals = Number(document.getElementById("reversalCount").value || 0);
  const items = [];
  for (let i = 1; i <= missing; i++) items.push(["Missing transaction", `TXN-M${i}`, "Present in merchant file, absent in bank-settlement record.", "Investigate posting gap or delayed settlement ingestion."]);
  for (let i = 1; i <= duplicates; i++) items.push(["Duplicate record", `TXN-D${i}`, "Two references appear for one customer-intended payment.", "Check retry logic, idempotency, and reference matching."]);
  for (let i = 1; i <= fee; i++) items.push(["Fee discrepancy", `TXN-F${i}`, "Gateway/acquirer/net fee differs from expected schedule.", "Validate MDR rule, tax treatment, and routing path."]);
  for (let i = 1; i <= reversals; i++) items.push(["Pending reversal", `TXN-R${i}`, "Customer-facing reversal initiated but not yet reflected in all files.", "Hold closure until all ledgers agree on final liability."]);
  return items;
}

function renderRecon() {
  const exceptions = makeExceptions();
  const total = exceptions.length;
  document.getElementById("totalExceptions").textContent = String(total);
  document.getElementById("materialExceptions").textContent = String(exceptions.filter(x => x[0] !== "Fee discrepancy").length);
  document.getElementById("opsLoad").textContent = total >= 8 ? "Heavy" : total >= 4 ? "Moderate" : "Light";
  document.getElementById("closureRisk").textContent = exceptions.some(x => x[0] === "Pending reversal") ? "High" : "Managed";
  document.getElementById("exceptionTableBody").innerHTML = (exceptions.length ? exceptions : [["No exceptions", "-", "All sample files align.", "Safe to close the period."]]).map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("");
  document.getElementById("reconNote").textContent = total
    ? "The class should decide which exception changes money owed, which only changes timing, and which one should block financial close."
    : "Clean reconciliation is rare in live operations. Use this baseline first, then add exceptions and ask which team owns each one.";
}

document.getElementById("runRecon").addEventListener("click", renderRecon);
renderRecon();
