// FX Hedge Strategy Optimizer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('FX Hedge Strategy Optimizer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Market scenarios
const marketScenarios = {
  stable: { vol: 0.05, trend: 0, name: 'Stable Market' },
  volatile: { vol: 0.15, trend: 0, name: 'High Volatility' },
  trending: { vol: 0.08, trend: 0.02, name: 'Strong Trend' },
  crisis: { vol: 0.25, trend: -0.05, name: 'Market Crisis' }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const spotRateEl = document.getElementById('spotRate');
const exposureAmountEl = document.getElementById('exposureAmount');
const timeHorizonEl = document.getElementById('timeHorizon');
const naturalHedgeEl = document.getElementById('naturalHedge');
const aiRecommendation = document.getElementById('aiRecommendation');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');

let selectedInstrument = 'forward';

// Initialize
function init() {
  scenarioSelect.addEventListener('change', updateMarketConditions);
  aiToggle.addEventListener('change', updateAIInsights);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);
  
  // Instrument selection
  document.querySelectorAll('.instrument-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.instrument-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedInstrument = card.dataset.instrument;
    });
  });
  document.querySelector('.instrument-card').classList.add('selected');
  
  updateMarketConditions();
}

function updateMarketConditions() {
  const scenario = scenarioSelect.value;
  const scenarioData = marketScenarios[scenario];
  
  // Update spot rate based on scenario
  const baseRate = 0.92;
  const newRate = scenario === 'trending' ? baseRate + scenarioData.trend * 10 : baseRate;
  spotRateEl.value = newRate.toFixed(4);
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) return;
  
  const scenario = scenarioSelect.value;
  const scenarioData = marketScenarios[scenario];
  const exposure = parseFloat(exposureAmountEl.value) || 1000000;
  
  let recommendation = '';
  
  if (scenarioData.vol > 0.15) {
    recommendation = `HIGH VOLATILITY DETECTED: Recommend options-based hedging for protection. Consider 80-90% coverage with put options.`;
  } else if (scenarioData.vol > 0.10) {
    recommendation = `Moderate volatility: 75% forward contracts + 25% options for balanced approach.`;
  } else {
    recommendation = `Stable market: Forward contracts recommended. 75% hedging provides optimal cost-risk balance.`;
  }
  
  recommendation += ` Natural hedge of ${naturalHedgeEl.value}% reduces effective exposure to $${(exposure * (1 - naturalHedgeEl.value/100) / 1000000).toFixed(2)}M.`;
  
  aiRecommendation.textContent = recommendation;
}

function resetValues() {
  scenarioSelect.value = 'stable';
  spotRateEl.value = 0.92;
  exposureAmountEl.value = 1000000;
  timeHorizonEl.value = 6;
  naturalHedgeEl.value = 30;
  updateMarketConditions();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    spotRate: spotRateEl.value,
    exposure: exposureAmountEl.value,
    timeHorizon: timeHorizonEl.value,
    naturalHedge: naturalHedgeEl.value,
    instrument: selectedInstrument,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fx-hedge-strategy.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);