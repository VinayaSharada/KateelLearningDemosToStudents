// Cash Conversion Cycle Optimizer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Cash Conversion Cycle Optimizer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Scenario definitions
const scenarios = {
  current: { dso: 32, dio: 45, dpo: 28, name: 'Current State' },
  industry: { dso: 45, dio: 50, dpo: 35, name: 'Industry Benchmark' },
  target: { dso: 25, dio: 35, dpo: 40, name: 'Target State' }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const dsoInput = document.getElementById('dsoImprovement');
const dpoInput = document.getElementById('dpoIncrease');
const invInput = document.getElementById('inventoryReduce');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const aiRecommendation = document.getElementById('aiRecommendation');

// Initialize
function init() {
  scenarioSelect.addEventListener('change', handleScenarioChange);
  aiToggle.addEventListener('change', updateAIInsights);
  dsoInput.addEventListener('input', updateScenarioValues);
  dpoInput.addEventListener('input', updateScenarioValues);
  invInput.addEventListener('input', updateScenarioValues);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);
  
  updateScenarioValues();
}

function handleScenarioChange() {
  const scenario = scenarioSelect.value;
  if (scenario === 'current' && scenarios.current) {
    // Reset sliders to match current state
    dsoInput.value = 0;
    dpoInput.value = 0;
    invInput.value = 0;
    document.getElementById('dsoImpValue').textContent = '0%';
    document.getElementById('dpoIncValue').textContent = '0%';
    document.getElementById('invRedValue').textContent = '0%';
  }
  updateScenarioValues();
}

function updateScenarioValues() {
  const dso = parseFloat(document.getElementById('dso').textContent);
  const invDays = parseFloat(document.getElementById('inventoryDays').textContent);
  const dpo = parseFloat(document.getElementById('dpo').textContent);
  
  const dsoImp = parseFloat(dsoInput.value) / 100;
  const dpoInc = parseFloat(dpoInput.value) / 100;
  const invRed = parseFloat(invInput.value) / 100;
  
  document.getElementById('dsoImpValue').textContent = dsoInput.value + '%';
  document.getElementById('dpoIncValue').textContent = dpoInput.value + '%';
  document.getElementById('invRedValue').textContent = invInput.value + '%';
  
  const optDso = dso * (1 + dsoImp);
  const optInv = invDays * (1 + invRed);
  const optDpo = dpo * (1 + dpoInc);
  const optimizedCcc = optDso + optInv - optDpo;
  
  document.getElementById('optimizedCcc').textContent = optimizedCcc.toFixed(1) + ' days';
  
  // Calculate cash release
  const totalSales = parseFloat(document.getElementById('totalSales').value) || 100000000;
  const dailySales = totalSales / 365;
  const cccImprovement = (dso + invDays - dpo) - optimizedCcc;
  const cashRelease = cccImprovement * dailySales;
  
  document.getElementById('cashRelease').textContent = '$' + (cashRelease / 1000).toFixed(0) + 'K';
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see recommendations.';
    return;
  }
  
  const ccc = parseFloat(document.getElementById('ccc').textContent);
  const optimizedCcc = parseFloat(document.getElementById('optimizedCcc').textContent);
  
  if (optimizedCcc < ccc - 5) {
    aiRecommendation.textContent = 'Excellent improvement! Consider implementing these changes in phases to minimize operational disruption.';
  } else if (optimizedCcc < ccc) {
    aiRecommendation.textContent = 'Good progress. Focus on the highest impact area for maximum cash release.';
  } else {
    aiRecommendation.textContent = 'Current recommendations: Prioritize collections improvement for immediate cash release.';
  }
}

function resetValues() {
  scenarioSelect.value = 'current';
  document.getElementById('totalSales').value = 100000000;
  document.getElementById('creditSales').value = 80;
  document.getElementById('cogs').value = 60000000;
  document.getElementById('accountsReceivable').value = 15000000;
  document.getElementById('accountsPayable').value = 10000000;
  document.getElementById('inventory').value = 8000000;
  dsoInput.value = 0;
  dpoInput.value = 0;
  invInput.value = 0;
  document.getElementById('dsoImpValue').textContent = '0%';
  document.getElementById('dpoIncValue').textContent = '0%';
  document.getElementById('invRedValue').textContent = '0%';
  updateScenarioValues();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    dso: document.getElementById('dso').textContent,
    inventoryDays: document.getElementById('inventoryDays').textContent,
    dpo: document.getElementById('dpo').textContent,
    ccc: document.getElementById('ccc').textContent,
    optimizedCcc: document.getElementById('optimizedCcc').textContent,
    cashRelease: document.getElementById('cashRelease').textContent,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ccc-analysis-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);