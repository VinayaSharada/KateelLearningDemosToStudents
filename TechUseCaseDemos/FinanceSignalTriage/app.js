const signals = [
  { source: "supplier", title: "Late deliveries and tense supplier comments", corroboration: "Delivery delay, DPO pressure, dispute trend", materiality: "High", actionability: "High", owner: "Procurement controller", sla: "24h", auto: "Escalate" },
  { source: "customer", title: "Complaint spike but stable collections", corroboration: "Returns up, DSO stable, cash collections normal", materiality: "Medium", actionability: "Medium", owner: "Customer operations", sla: "48h", auto: "Investigate" },
  { source: "employee", title: "Sales team concern about rebate promises", corroboration: "Forecast variance and rebate accrual uncertainty", materiality: "High", actionability: "Medium", owner: "FP&A lead", sla: "24h", auto: "Investigate" },
  { source: "analyst", title: "Negative market comment with no finance corroboration", corroboration: "No forecast, cash, or DSO deterioration", materiality: "Low", actionability: "Low", owner: "IR manager", sla: "Monitor weekly", auto: "Monitor" }
];

const state = { source: "all", action: "auto" };

function filtered() {
  return signals.filter((item) => state.source === "all" || item.source === state.source);
}

function renderAll() {
  const items = filtered();
  document.getElementById("signalItems").innerHTML = items.map((item) => `<div class="trace-card"><span>${item.source}</span><strong>${item.title}</strong><p>${item.corroboration}</p></div>`).join("");
  document.getElementById("triageRows").innerHTML = items.map((item) => {
    const action = state.action === "auto" ? item.auto : state.action[0].toUpperCase() + state.action.slice(1);
    return `<tr><td>${item.title}</td><td>${item.corroboration}</td><td>${item.materiality}</td><td>${item.actionability}</td><td>${item.owner}</td><td>${item.sla}</td><td>${action}</td></tr>`;
  }).join("");
  const lead = items[0] || signals[0];
  document.getElementById("ownerValue").textContent = lead.owner;
  document.getElementById("decisionValue").textContent = state.action === "auto" ? lead.auto : state.action[0].toUpperCase() + state.action.slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signalFilter").addEventListener("change", (event) => {
    state.source = event.target.value;
    renderAll();
  });
  document.getElementById("actionFilter").addEventListener("change", (event) => {
    state.action = event.target.value;
    renderAll();
  });
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.source = "all";
    state.action = "auto";
    document.getElementById("signalFilter").value = "all";
    document.getElementById("actionFilter").value = "auto";
    renderAll();
  });
  renderAll();
});
