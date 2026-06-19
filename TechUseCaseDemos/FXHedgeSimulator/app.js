// FX Hedge Strategy Optimizer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('FX Hedge Strategy Optimizer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Scenario definitions
const scenarios = {
  stable: { vol: 8, trend: 0, name: 'Stable Market' },
  volatile: { vol: 15, trend: 0, name: 'High Volatility' },
  trending: { vol: 10, trend: 2, name: 'Strong Trend' },
  crisis: { vol: 20, trend: -3, name: 'Market Crisis' }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const spotRateInput = document.getElementById('spotRate');
const exposureInput = document.getElementById('exposureAmount');
const timeHorizonInput = document.getElementById('timeHorizon');
const naturalHedgeInput = document.getElementById('naturalHedge');
const aiRecommendation = document.getElementById('aiRecommendation');
const resetBtn = document.getElementById('resetBtn');
const compareBtn = document.getElementById('compareBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize
function init() {
  scenarioSelect.addEventListener('change', updateScenario);
  aiToggle.addEventListener('change', updateAIInsights);
  resetBtn.addEventListener('click', resetValues);
  compareBtn.addEventListener('click', compareStrategies);
  exportBtn.addEventListener('click', exportResults);
  
  updateScenario();
}

function updateScenario() {
  const scenario = scenarioSelect.value;
  const scenarioData = scenarios[scenario];
  
  if (scenarioData) {
    // Update UI based on scenario
    spotRateInput.value = scenario === 'stable' ? 0.92 : scenario === 'volatile' ? 0.91 : 0.93;
  }
  
  updateCalculations();
}

function updateCalculations() {
  const spotRate = parseFloat(spotRateInput.value);
  const exposure = parseFloat(exposureInput.value);
  const timeHorizon = parseFloat(timeHorizonInput.value);
  const naturalHedge = parseFloat(naturalHedgeInput.value) || 0;
  
  // Calculate forward rate
  const forwardRate = spotRate * (1 + 0.045 * timeHorizon / 12) / (1 + 0.035 * timeHorizon / 12);
  
  // Calculate option premium (simplified)
  const volatility = 8;
  const optionPremium = exposure * 0.015;
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see recommendations.';
    return;
  }
  
  const scenario = scenarioSelect.value;
  const exposure = parseFloat(exposureInput.value) || 1000000;
  
  const recommendations = {
    stable: `Based on stable market conditions, recommend 75% hedging with forwards for EUR ${exposure.toLocaleString()} exposure. Estimated cost: $${(exposure * 0.002).toLocaleString()}.`,
    volatile: `High volatility detected. Recommend options strategy for EUR ${exposure.toLocaleString()} exposure. Estimated cost: $${(exposure * 0.015).toLocaleString()}.`,
    trending: `Strong trend detected. Consider dynamic hedging with 60% coverage and trend-following overlay.`,
    crisis: `Market crisis conditions. Recommend maximum hedging (90%) with options for protection.`,
    custom: `For custom scenario, recommend 70-80% hedging with mix of forwards and options.`
  };
  
  aiRecommendation.textContent = recommendations[scenario] || recommendations.custom;
}

function resetValues() {
  scenarioSelect.value = 'stable';
  spotRateInput.value = 0.92;
  exposureInput.value = 1000000;
  timeHorizonInput.value = 6;
  naturalHedgeInput.value = 30;
  updateCalculations();
}

function compareStrategies() {
  alert('Strategy Comparison Results:\n\n' +
    'Hedge 50%: ±$32,500 volatility, $15,000 cost\n' +
    'Hedge 75%: ±$16,250 volatility, $22,500 cost\n' +
    'Hedge 90%: ±$6,500 volatility, $27,000 cost\n\n' +
    'AI recommends 75% hedge for optimal risk-return balance.');
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    spotRate: spotRateInput.value,
    exposure: exposureInput.value,
    timeHorizon: timeHorizonInput.value,
    naturalHedge: naturalHedgeInput.value,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fx-hedge-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);