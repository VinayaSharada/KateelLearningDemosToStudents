// FX Hedge Strategy Optimizer - FIXED VERSION
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

// Hedge instrument costs
const instrumentCosts = {
  forward: 0.002,
  option: 0.015,
  swap: 0.005,
  natural: 0
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
      updateAIInsights();
    });
  });
  document.querySelector('.instrument-card').classList.add('selected');
  
  // Add listeners to all inputs
  [exposureAmountEl, timeHorizonEl, naturalHedgeEl].forEach(el => {
    el.addEventListener('input', updateAIInsights);
  });
  
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

function calculateHedgeImpact(hedgePercent, instrument) {
  const exposure = parseFloat(exposureAmountEl.value) || 1000000;
  const vol = marketScenarios[scenarioSelect.value].vol;
  const cost = instrumentCosts[instrument] || 0;
  
  const hedgedAmount = exposure * hedgePercent / 100;
  const unhedgedAmount = exposure - hedgedAmount;
  
  // Simplified risk calculation
  const riskReduction = hedgedAmount * vol * 0.7;
  const hedgingCost = hedgedAmount * cost;
  
  return {
    hedgedAmount,
    unhedgedAmount,
    riskReduction,
    hedgingCost
  };
}

function updateAIInsights() {
  if (!aiToggle.checked) return;
  
  const scenario = scenarioSelect.value;
  const scenarioData = marketScenarios[scenario];
  const exposure = parseFloat(exposureAmountEl.value) || 1000000;
  const instrument = selectedInstrument;
  const cost = instrumentCosts[instrument] || 0;
  
  let recommendation = '';
  
  if (scenarioData.vol > 0.15) {
    recommendation = `HIGH VOLATILITY DETECTED: Recommend options-based hedging for protection. Consider 80-90% coverage with put options.`;
  } else if (scenarioData.vol > 0.10) {
    recommendation = `Moderate volatility: 75% forward contracts + 25% options for balanced approach.`;
  } else {
    recommendation = `Stable market: Forward contracts recommended. 75% hedging provides optimal cost-risk balance.`;
  }
  
  const effectiveExposure = exposure * (1 - naturalHedgeEl.value/100);
  recommendation += ` Natural hedge of ${naturalHedgeEl.value}% reduces effective exposure to $${(effectiveExposure/1000000).toFixed(2)}M.`;
  recommendation += ` Selected instrument (${instrument}) cost: ${(cost*100).toFixed(2)}%.`;
  
  aiRecommendation.textContent = recommendation;
}

function resetValues() {
  scenarioSelect.value = 'stable';
  spotRateEl.value = 0.92;
  exposureAmountEl.value = 1000000;
  timeHorizonEl.value = 6;
  naturalHedgeEl.value = 30;
  selectedInstrument = 'forward';
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