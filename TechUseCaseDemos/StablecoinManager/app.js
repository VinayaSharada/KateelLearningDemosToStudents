// Stablecoin Yield Optimizer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Stablecoin Yield Optimizer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Risk profiles
const profiles = {
  conservative: { lending: 80, dex: 10, cash: 10, name: 'Conservative' },
  balanced: { lending: 60, dex: 25, cash: 15, name: 'Balanced' },
  aggressive: { lending: 40, dex: 40, cash: 20, name: 'Aggressive' }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const lendingPct = document.getElementById('lendingPct');
const dexPct = document.getElementById('dexPct');
const cashPct = document.getElementById('cashPct');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const aiRecommendation = document.getElementById('aiRecommendation');

// Initialize
function init() {
  scenarioSelect.addEventListener('change', handleScenarioChange);
  aiToggle.addEventListener('change', updateAIInsights);
  lendingPct.addEventListener('input', updateAllocations);
  dexPct.addEventListener('input', updateAllocations);
  cashPct.addEventListener('input', updateAllocations);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);
  
  updateAllocations();
}

function handleScenarioChange() {
  const scenario = scenarioSelect.value;
  if (profiles[scenario]) {
    lendingPct.value = profiles[scenario].lending;
    dexPct.value = profiles[scenario].dex;
    cashPct.value = profiles[scenario].cash;
  }
  updateAllocationLabels();
  updateAllocations();
}

function updateAllocationLabels() {
  document.getElementById('lendingPctVal').textContent = lendingPct.value + '%';
  document.getElementById('dexPctVal').textContent = dexPct.value + '%';
  document.getElementById('cashPctVal').textContent = cashPct.value + '%';
}

function updateAllocations() {
  updateAllocationLabels();
  
  const totalTvl = 42500000;
  const lending = parseFloat(lendingPct.value);
  const dex = parseFloat(dexPct.value);
  const cash = parseFloat(cashPct.value);
  
  const lendingYield = 3.2;
  const dexYield = 2.8;
  const cashYield = 0;
  
  const weightedYield = (lending * lendingYield + dex * dexYield + cash * cashYield) / 100;
  
  document.getElementById('totalYield').textContent = weightedYield.toFixed(1) + '%';
  document.getElementById('totalYieldAmount').textContent = '$' + Math.round(totalTvl * weightedYield / 100).toLocaleString();
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see recommendations.';
    return;
  }
  
  const scenario = scenarioSelect.value;
  const lending = parseFloat(lendingPct.value);
  
  const recommendations = {
    conservative: 'Conservative profile: 80% in stable lending. Lower returns but minimal risk.',
    balanced: 'Balanced profile: Optimal for most treasuries. Good risk-adjusted returns.',
    aggressive: 'Aggressive profile: Higher returns but more volatile. Monitor closely.',
    custom: lending > 70 ? 'High allocation to lending. Consider diversifying.' : 'Well-balanced allocation.'
  };
  
  aiRecommendation.textContent = recommendations[scenario] || recommendations.custom;
}

function resetValues() {
  scenarioSelect.value = 'balanced';
  lendingPct.value = 60;
  dexPct.value = 25;
  cashPct.value = 15;
  updateAllocations();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    allocations: {
      lending: lendingPct.value,
      dex: dexPct.value,
      cash: cashPct.value
    },
    totalYield: document.getElementById('totalYield').textContent,
    totalYieldAmount: document.getElementById('totalYieldAmount').textContent,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'stablecoin-yield-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);