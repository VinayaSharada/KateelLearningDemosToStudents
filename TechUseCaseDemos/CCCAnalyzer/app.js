// Cash Conversion Cycle Optimizer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('CCC Analyzer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Scenario definitions
const scenarios = {
  current: { name: 'Current State', dso: 45.6, invDays: 48.7, dpo: 36.5 },
  industry: { name: 'Industry Benchmark', dso: 40, invDays: 45, dpo: 40 },
  target: { name: 'Target State', dso: 35, invDays: 40, dpo: 45 }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const totalSalesEl = document.getElementById('totalSales');
const creditSalesEl = document.getElementById('creditSales');
const cogsEl = document.getElementById('cogs');
const arEl = document.getElementById('accountsReceivable');
const apEl = document.getElementById('accountsPayable');
const inventoryEl = document.getElementById('inventory');
const dsoEl = document.getElementById('dso');
const inventoryDaysEl = document.getElementById('inventoryDays');
const dpoEl = document.getElementById('dpo');
const cccEl = document.getElementById('ccc');
const dsoImpEl = document.getElementById('dsoImprovement');
const dpoIncEl = document.getElementById('dpoIncrease');
const invRedEl = document.getElementById('inventoryReduce');
const dsoImpVal = document.getElementById('dsoImpValue');
const dpoIncVal = document.getElementById('dpoIncValue');
const invRedVal = document.getElementById('invRedValue');
const optimizedCccEl = document.getElementById('optimizedCcc');
const cashReleaseEl = document.getElementById('cashRelease');
const cccImpEl = document.getElementById('cccImprovement');
const aiRecommendation = document.getElementById('aiRecommendation');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize
function init() {
  const inputs = [scenarioSelect, totalSalesEl, creditSalesEl, cogsEl, arEl, apEl, inventoryEl,
                  dsoImpEl, dpoIncEl, invRedEl];
  inputs.forEach(el => el.addEventListener('input', updateCalculations));
  
  aiToggle.addEventListener('change', updateAIInsights);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);
  
  updateCalculations();
}

function updateCalculations() {
  const scenario = scenarioSelect.value;
  
  // Get base values
  const totalSales = parseFloat(totalSalesEl.value) || 100000000;
  const creditSales = parseFloat(creditSalesEl.value) || 80;
  const cogs = parseFloat(cogsEl.value) || 60000000;
  const ar = parseFloat(arEl.value) || 15000000;
  const ap = parseFloat(apEl.value) || 10000000;
  const inventory = parseFloat(inventoryEl.value) || 8000000;
  
  // Calculate CCC components
  const creditSalesAmt = totalSales * creditSales / 100;
  const dso = creditSalesAmt > 0 ? (ar / creditSalesAmt) * 365 : 0;
  const inventoryDays = cogs > 0 ? (inventory / cogs) * 365 : 0;
  const dpo = cogs > 0 ? (ap / cogs) * 365 : 0;
  const ccc = dso + inventoryDays - dpo;
  
  // Update UI
  dsoEl.textContent = dso.toFixed(1);
  inventoryDaysEl.textContent = inventoryDays.toFixed(1);
  dpoEl.textContent = dpo.toFixed(1);
  cccEl.textContent = ccc.toFixed(1) + ' days';
  
  // Apply optimizations
  const dsoImp = parseFloat(dsoImpEl.value) / 100;
  const dpoInc = parseFloat(dpoIncEl.value) / 100;
  const invRed = parseFloat(invRedEl.value) / 100;
  
  dsoImpVal.textContent = dsoImpEl.value + '%';
  dpoIncVal.textContent = dpoIncEl.value + '%';
  invRedVal.textContent = invRedEl.value + '%';
  
  const optDso = dso * (1 - dsoImp);
  const optInv = inventoryDays * (1 - invRed);
  const optDpo = dpo * (1 + dpoInc);
  const optCcc = optDso + optInv - optDpo;
  
  optimizedCccEl.textContent = optCcc.toFixed(1) + ' days';
  
  // Calculate cash release (simplified)
  const cccImprovement = ccc - optCcc;
  const cashRelease = (cccImprovement / 365) * (cogs / 1000000);
  
  cashReleaseEl.textContent = '$' + cashRelease.toFixed(1) + 'M';
  cccImprovementEl.textContent = cccImprovement.toFixed(1) + ' days';
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) return;
  
  const ccc = parseFloat(cccEl.textContent);
  const optCcc = parseFloat(optimizedCccEl.textContent);
  const improvement = ccc - optCcc;
  
  let recommendation = '';
  
  if (improvement > 10) {
    recommendation = `Excellent! ${improvement.toFixed(1)} day CCC improvement possible. Prioritize inventory reduction.`;
  } else if (improvement > 5) {
    recommendation = `Good potential: ${improvement.toFixed(1)} day improvement. Focus on receivables management.`;
  } else if (improvement > 0) {
    recommendation = `Modest improvement: ${improvement.toFixed(1)} days. Consider supplier negotiations.`;
  } else {
    recommendation = 'No improvement in current settings. Try increasing DPO or reducing inventory.';
  }
  
  aiRecommendation.textContent = recommendation;
}

function resetValues() {
  scenarioSelect.value = 'current';
  totalSalesEl.value = 100000000;
  creditSalesEl.value = 80;
  cogsEl.value = 60000000;
  arEl.value = 15000000;
  apEl.value = 10000000;
  inventoryEl.value = 8000000;
  dsoImpEl.value = 0;
  dpoIncEl.value = 0;
  invRedEl.value = 0;
  updateCalculations();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    financials: {
      totalSales: totalSalesEl.value,
      creditSales: creditSalesEl.value,
      cogs: cogsEl.value,
      accountsReceivable: arEl.value,
      accountsPayable: apEl.value,
      inventory: inventoryEl.value
    },
    ccc: {
      dso: dsoEl.textContent,
      inventoryDays: inventoryDaysEl.textContent,
      dpo: dpoEl.textContent,
      ccc: cccEl.textContent
    },
    optimization: {
      dsoImprovement: dsoImpEl.value,
      dpoIncrease: dpoIncEl.value,
      inventoryReduction: invRedEl.value,
      optimizedCcc: optimizedCccEl.textContent,
      cashRelease: cashReleaseEl.textContent
    },
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ccc-analysis.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);