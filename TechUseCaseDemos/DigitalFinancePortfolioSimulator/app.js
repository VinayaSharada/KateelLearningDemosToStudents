const initiatives = [
  { name: "Close redesign", value: 5, investment: 2, dependency: "None", risk: "Medium" },
  { name: "AP workflow", value: 4, investment: 2, dependency: "Close redesign", risk: "Low" },
  { name: "Process mining", value: 5, investment: 1, dependency: "None", risk: "Low" },
  { name: "Planning and forecasting", value: 4, investment: 3, dependency: "None", risk: "Medium" },
  { name: "GenAI commentary", value: 3, investment: 2, dependency: "Planning and forecasting", risk: "Medium" },
  { name: "Contract intelligence", value: 3, investment: 2, dependency: "Process mining", risk: "High" }
];

const state = { budget: 8, capacity: 3 };

function renderAll() {
  document.getElementById("portfolioItems").innerHTML = initiatives.map((item) => `<div class="trace-card"><span>${item.name}</span><strong>Value ${item.value} / Invest ${item.investment}</strong><p>Dependency: ${item.dependency} • Control risk: ${item.risk}</p></div>`).join("");
  const firstWave = initiatives.filter((item) => item.investment <= 3).slice(0, state.capacity).filter((item, index, arr) => arr.reduce((sum, row) => sum + row.investment, 0) <= state.budget);
  document.getElementById("waveValue").textContent = firstWave.map((item) => item.name).join(", ");
  document.getElementById("valueValue").textContent = `USD ${firstWave.reduce((sum, item) => sum + item.value, 0)}m illustrative upside`;
  document.getElementById("riskValue").textContent = firstWave.some((item) => item.risk === "High") ? "One high-risk dependency remains" : "Manageable first-wave risk";
  document.getElementById("decisionValue").textContent = "Approve wave 1, defer dependent items, and review year-2 scaling";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("budgetSelect").addEventListener("change", (event) => { state.budget = Number(event.target.value); renderAll(); });
  document.getElementById("capacitySelect").addEventListener("change", (event) => { state.capacity = Number(event.target.value); renderAll(); });
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.budget = 8;
    state.capacity = 3;
    document.getElementById("budgetSelect").value = "8";
    document.getElementById("capacitySelect").value = "3";
    renderAll();
  });
  renderAll();
});
