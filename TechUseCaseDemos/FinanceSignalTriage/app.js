const signals = [
  {
    id: "sig-1",
    source: "supplier",
    scenario: "corroborated",
    title: "Late deliveries and tense supplier comments",
    sentiment: "Negative",
    topic: "Delivery reliability",
    date: "2026-07-08",
    sourceNote: "Supplier account review call",
    corroboration: "Delivery delay up 3.2 days, dispute trend rising, DPO pressure visible.",
    metrics: "Delivery delay +3.2d; supplier disputes +18%; DPO at threshold",
    materiality: "High",
    corroborationScore: 5,
    actionability: "High",
    owner: "Procurement controller",
    sla: "24h",
    reviewState: "Open investigation",
    route: "Procurement controller -> CFO sponsor -> supplier-risk council",
    auto: "Escalate"
  },
  {
    id: "sig-2",
    source: "customer",
    scenario: "false-positive",
    title: "Complaint spike but stable collections",
    sentiment: "Negative",
    topic: "Service complaints",
    date: "2026-07-10",
    sourceNote: "Customer service escalation log",
    corroboration: "Returns rose slightly, but DSO and cash collections remain stable.",
    metrics: "Returns +2%; DSO flat; collections on plan",
    materiality: "Medium",
    corroborationScore: 2,
    actionability: "Medium",
    owner: "Customer operations lead",
    sla: "48h",
    reviewState: "Monitor only",
    route: "Customer operations lead -> service-quality review",
    auto: "Monitor"
  },
  {
    id: "sig-3",
    source: "employee",
    scenario: "missed-risk",
    title: "Sales team concern about rebate promises",
    sentiment: "Neutral",
    topic: "Commercial discipline",
    date: "2026-07-12",
    sourceNote: "Sales compensation workshop note",
    corroboration: "Forecast variance, rebate accrual uncertainty, and returns trend indicate real exposure.",
    metrics: "Forecast variance +9%; rebate accrual unresolved; returns rising",
    materiality: "High",
    corroborationScore: 4,
    actionability: "High",
    owner: "FP&A lead",
    sla: "24h",
    reviewState: "Needs escalation",
    route: "FP&A lead -> controller -> CFO sponsor",
    auto: "Investigate"
  },
  {
    id: "sig-4",
    source: "analyst",
    scenario: "false-positive",
    title: "Negative market comment with no finance corroboration",
    sentiment: "Negative",
    topic: "External perception",
    date: "2026-07-14",
    sourceNote: "Broker channel note",
    corroboration: "No forecast, cash, or DSO deterioration visible.",
    metrics: "Forecast flat; cash collections normal; DSO stable",
    materiality: "Low",
    corroborationScore: 1,
    actionability: "Low",
    owner: "IR manager",
    sla: "Weekly review",
    reviewState: "Closed with evidence",
    route: "IR manager -> investor-relations weekly watchlist",
    auto: "Close"
  }
];

const state = { source: "all", action: "auto", scenario: "all" };

function filtered() {
  return signals.filter((item) => {
    if (state.source !== "all" && item.source !== state.source) return false;
    if (state.scenario !== "all" && item.scenario !== state.scenario) return false;
    return true;
  });
}

function titleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function resolvedAction(item) {
  if (state.action !== "auto") return titleCase(state.action);
  if (item.corroborationScore >= 5 || (item.materiality === "High" && item.actionability === "High")) return "Escalate";
  if (item.corroborationScore >= 3) return "Investigate";
  if (item.corroborationScore === 2) return "Monitor";
  return "Close";
}

function renderCards(items) {
  document.getElementById("signalItems").innerHTML = items.map((item) => `
    <div class="trace-card">
      <span>${item.source} • ${item.sentiment} • ${item.date}</span>
      <strong>${item.title}</strong>
      <p>${item.sourceNote}</p>
      <p><strong>Topic:</strong> ${item.topic}</p>
      <p><strong>Metrics:</strong> ${item.metrics}</p>
    </div>
  `).join("");
}

function renderRows(items) {
  document.getElementById("triageRows").innerHTML = items.map((item) => `
    <tr>
      <td>${item.title}</td>
      <td>${item.corroboration}</td>
      <td>${item.materiality}</td>
      <td>${item.corroborationScore}/5</td>
      <td>${item.actionability}</td>
      <td>${item.owner}</td>
      <td>${item.sla}</td>
      <td>${item.reviewState}</td>
      <td>${resolvedAction(item)}</td>
    </tr>
  `).join("");
}

function renderSummary(items) {
  const lead = items[0] || signals[0];
  const corroborated = items.filter((item) => item.corroborationScore >= 3).length;
  const falsePositives = items.filter((item) => item.scenario === "false-positive").length;

  document.getElementById("ownerValue").textContent = lead.owner;
  document.getElementById("decisionValue").textContent = resolvedAction(lead);
  document.getElementById("corroboratedValue").textContent = `${corroborated} corroborated`;
  document.getElementById("falsePositiveValue").textContent = `${falsePositives} visible`;
  document.getElementById("leadCaseValue").textContent = lead.title;
  document.getElementById("routeValue").textContent = lead.route;
  document.getElementById("businessDecisionValue").textContent =
    resolvedAction(lead) === "Escalate"
      ? "Escalate because finance and operating evidence corroborate the signal."
      : resolvedAction(lead) === "Investigate"
        ? "Investigate because the signal could reflect a real risk, but evidence still needs validation."
        : resolvedAction(lead) === "Monitor"
          ? "Monitor because the signal is weakly corroborated and may be noisy."
          : "Close because sentiment alone does not justify action.";
}

function renderAll() {
  const items = filtered();
  renderCards(items);
  renderRows(items);
  renderSummary(items);
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
  document.getElementById("scenarioFilter").addEventListener("change", (event) => {
    state.scenario = event.target.value;
    renderAll();
  });
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.source = "all";
    state.action = "auto";
    state.scenario = "all";
    document.getElementById("signalFilter").value = "all";
    document.getElementById("actionFilter").value = "auto";
    document.getElementById("scenarioFilter").value = "all";
    renderAll();
  });
  renderAll();
});
