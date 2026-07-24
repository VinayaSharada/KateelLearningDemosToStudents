const initiatives = [
  { id: "close", name: "Close redesign", value: 5, investment: 2, dataReadiness: 3, processReadiness: 4, resistance: 3, controlRisk: 3, dependency: "None", proof: "Close-day backlog reduced by 20%", year2Scale: "Entity-by-entity rollout", stage: "year1" },
  { id: "ap", name: "AP workflow", value: 4, investment: 2, dataReadiness: 4, processReadiness: 3, resistance: 2, controlRisk: 2, dependency: "close", proof: "Exception SLA achieved in pilot shared-services team", year2Scale: "Extend to non-PO and high-volume invoices", stage: "defer" },
  { id: "mining", name: "Process mining", value: 5, investment: 1, dataReadiness: 4, processReadiness: 4, resistance: 2, controlRisk: 1, dependency: "None", proof: "Top three variants and delays traced to owned causes", year2Scale: "Expand beyond O2C into P2P and close", stage: "year1" },
  { id: "planning", name: "Planning and forecasting", value: 4, investment: 3, dataReadiness: 3, processReadiness: 3, resistance: 4, controlRisk: 3, dependency: "None", proof: "Forecast cycle time reduced with clearer ownership", year2Scale: "Embed business-unit adoption and variance challenge", stage: "year1" },
  { id: "genai", name: "GenAI commentary", value: 3, investment: 2, dataReadiness: 2, processReadiness: 3, resistance: 3, controlRisk: 4, dependency: "planning", proof: "Cited commentary draft accepted for internal use only", year2Scale: "Controlled reuse across FP&A and IR", stage: "defer" },
  { id: "contract", name: "Contract intelligence", value: 3, investment: 2, dataReadiness: 2, processReadiness: 2, resistance: 3, controlRisk: 4, dependency: "mining", proof: "Reviewed obligation register produced from pilot case set", year2Scale: "Broaden to complex contract families", stage: "stop" }
];

const viewpointCopy = {
  cfo: "CFO view emphasizes value range, control risk, and 90-day proof before broad scaling.",
  cio: "CIO view emphasizes dependency order, data readiness, and execution capacity across years.",
  process: "Process-owner view emphasizes whether initiatives are redesigning work or automating instability.",
  data: "Data-owner view emphasizes evidence quality, reuse limits, and the cost of weak lineage."
};

const state = { budget: 8, capacity: 3, viewpoint: "cfo" };

function getStageLabel(stage) {
  if (stage === "year1") return "Year 1";
  if (stage === "scale") return "Years 2-3 scale";
  if (stage === "defer") return "Defer";
  return "Stop";
}

function scoreInitiative(item) {
  return item.value + item.dataReadiness + item.processReadiness - item.resistance - item.controlRisk;
}

function dependencyValid(item, selectedIds) {
  return item.dependency === "None" || selectedIds.indexOf(item.dependency) !== -1;
}

function renderItems() {
  document.getElementById("portfolioItems").innerHTML = initiatives.map((item) => `
    <div class="trace-card">
      <span>${item.name}</span>
      <strong>Value ${item.value} • Invest USD ${item.investment}m • ${getStageLabel(item.stage)}</strong>
      <p>Dependency: ${item.dependency}</p>
      <p>Data readiness ${item.dataReadiness}/5 • Process readiness ${item.processReadiness}/5 • Resistance ${item.resistance}/5 • Control risk ${item.controlRisk}/5</p>
      <label for="stage-${item.id}">Portfolio action</label>
      <select id="stage-${item.id}" data-id="${item.id}">
        <option value="year1"${item.stage === "year1" ? " selected" : ""}>Year 1</option>
        <option value="scale"${item.stage === "scale" ? " selected" : ""}>Years 2-3 scale</option>
        <option value="defer"${item.stage === "defer" ? " selected" : ""}>Defer</option>
        <option value="stop"${item.stage === "stop" ? " selected" : ""}>Stop</option>
      </select>
    </div>
  `).join("");

  initiatives.forEach((item) => {
    document.getElementById(`stage-${item.id}`).addEventListener("change", (event) => {
      item.stage = event.target.value;
      renderSummary();
    });
  });
}

function renderSummary() {
  const year1 = initiatives.filter((item) => item.stage === "year1");
  const scale = initiatives.filter((item) => item.stage === "scale");
  const selectedIds = year1.map((item) => item.id);
  const invalidDependencies = year1.filter((item) => !dependencyValid(item, selectedIds));
  const budgetUsed = year1.reduce((sum, item) => sum + item.investment, 0);
  const capacityUsed = year1.length;
  const valueLow = year1.reduce((sum, item) => sum + Math.max(1, item.value - 1), 0);
  const valueHigh = year1.reduce((sum, item) => sum + item.value + 1, 0);
  const topWave = year1
    .slice()
    .sort((a, b) => scoreInitiative(b) - scoreInitiative(a))
    .slice(0, state.capacity)
    .map((item) => item.name);

  document.getElementById("viewpointNote").textContent = viewpointCopy[state.viewpoint];
  document.getElementById("dependencyValue").textContent = invalidDependencies.length
    ? `Invalid order: ${invalidDependencies.map((item) => item.name).join(", ")}`
    : "Dependencies are in a valid order for the selected Year 1 plan.";
  document.getElementById("budgetUsedValue").textContent = `USD ${budgetUsed}m of USD ${state.budget}m`;
  document.getElementById("waveValue").textContent = topWave.length ? topWave.join(", ") : "No Year 1 wave selected";
  document.getElementById("year1Value").textContent = year1.length ? year1.map((item) => item.name).join(", ") : "No Year 1 initiatives";
  document.getElementById("scaleValue").textContent = scale.length ? scale.map((item) => `${item.name}: ${item.year2Scale}`).join(" | ") : "No initiatives marked for later scaling";
  document.getElementById("valueValue").textContent = `USD ${valueLow}m - ${valueHigh}m illustrative 3-year range`;
  document.getElementById("riskValue").textContent = invalidDependencies.length
    ? "A dependent initiative is being funded before its prerequisite."
    : budgetUsed > state.budget || capacityUsed > state.capacity
      ? "Year 1 plan exceeds budget or change capacity."
      : year1.some((item) => item.controlRisk >= 4)
        ? "At least one selected initiative carries high control risk."
        : "Trade-offs are manageable but still require sponsor discipline.";
  document.getElementById("decisionValue").textContent = invalidDependencies.length
    ? "Re-sequence dependent initiatives before board approval."
    : budgetUsed > state.budget || capacityUsed > state.capacity
      ? "Trim Year 1 scope or add capacity before approval."
      : "Approve the first wave, defer dependent items, and review scale gates annually.";
  document.getElementById("proofValue").textContent = topWave.length
    ? (initiatives.find((item) => item.name === topWave[0]).proof)
    : "Select a Year 1 initiative to surface the 90-day proof point.";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("budgetSelect").addEventListener("change", (event) => {
    state.budget = Number(event.target.value);
    renderSummary();
  });
  document.getElementById("capacitySelect").addEventListener("change", (event) => {
    state.capacity = Number(event.target.value);
    renderSummary();
  });
  document.getElementById("viewpointSelect").addEventListener("change", (event) => {
    state.viewpoint = event.target.value;
    renderSummary();
  });
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.budget = 8;
    state.capacity = 3;
    state.viewpoint = "cfo";
    document.getElementById("budgetSelect").value = "8";
    document.getElementById("capacitySelect").value = "3";
    document.getElementById("viewpointSelect").value = "cfo";
    initiatives.forEach((item) => {
      if (item.id === "close" || item.id === "mining" || item.id === "planning") item.stage = "year1";
      else if (item.id === "ap" || item.id === "genai") item.stage = "defer";
      else item.stage = "stop";
    });
    renderItems();
    renderSummary();
  });
  renderItems();
  renderSummary();
});
