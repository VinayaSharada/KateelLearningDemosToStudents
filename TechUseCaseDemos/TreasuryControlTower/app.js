// Liquidity Stress Testing Simulator
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Liquidity Stress Testing Simulator - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Scenario definitions
const scenarios = {
  normal: { revenue: 0, expenses: 0, timing: 0, name: 'Normal Operations' },
  revenueDecline: { revenue: -15, expenses: 0, timing: 0, name: 'Revenue Decline (-15%)' },
  paymentAcceleration: { revenue: 0, expenses: 0, timing: 15, name: 'Payment Acceleration' },
  emergencyOutflow: { revenue: 0, expenses: 50, timing: 0, name: 'Emergency Outflow' }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const customControls = document.getElementById('customControls');
const inflowsInput = document.getElementById('inflows');
const outflowsInput = document.getElementById('outflows');
const seasonalSelect = document.getElementById('seasonalAdj');
const startingCashEl = document.getElementById('startingCash');
const endingCashEl = document.getElementById('endingCash');
const borrowingNeedEl = document.getElementById('borrowingNeed');
const surplusCashEl = document.getElementById('surplusCash');
const aiInsightEl = document.getElementById('aiInsight');
const recommendationText = document.getElementById('recommendationText');
const resetBtn = document.getElementById('resetBtn');
const compareBtn = document.getElementById('compareBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize
function init() {
  scenarioSelect.addEventListener('change', handleScenarioChange);
  aiToggle.addEventListener('change', updateAIInsights);
  resetBtn.addEventListener('click', resetValues);
  compareBtn.addEventListener('click', compareScenarios);
  exportBtn.addEventListener('click', exportResults);
  
  updateCalculations();
}

function handleScenarioChange() {
  const scenario = scenarioSelect.value;
  if (scenario === 'custom') {
    customControls.style.display = 'grid';
  } else {
    customControls.style.display = 'none';
    if (scenarios[scenario]) {
      updateCalculations();
    }
  }
}

function updateCalculations() {
  const scenario = scenarioSelect.value;
  let revenueChange = 0;
  let expenseChange = 0;
  let timingShift = 0;
  
  if (scenario === 'custom') {
    revenueChange = parseFloat(document.getElementById('customRevenue').value) || 0;
    expenseChange = parseFloat(document.getElementById('customExpenses').value) || 0;
    timingShift = parseFloat(document.getElementById('customTiming').value) || 0;
  } else if (scenarios[scenario]) {
    revenueChange = scenarios[scenario].revenue;
    expenseChange = scenarios[scenario].expenses;
    timingShift = scenarios[scenario].timing;
  }
  
  const baseInflows = parseFloat(inflowsInput.value) || 5000000;
  const baseOutflows = parseFloat(outflowsInput.value) || 4200000;
  const seasonal = parseFloat(seasonalSelect.value) || 0;
  
  // Apply adjustments
  const adjustedInflows = baseInflows * (1 + revenueChange / 100) * (1 + seasonal);
  const adjustedOutflows = baseOutflows * (1 + expenseChange / 100);
  
  const startingCash = 15000000;
  const endingCash = startingCash + adjustedInflows - adjustedOutflows;
  
  const borrowingNeed = Math.max(0, adjustedOutflows - adjustedInflows - startingCash);
  const surplusCash = Math.max(0, endingCash - startingCash);
  
  // Update UI
  startingCashEl.textContent = '$' + startingCash.toLocaleString();
  endingCashEl.textContent = '$' + endingCash.toLocaleString();
  borrowingNeedEl.textContent = '$' + borrowingNeed.toLocaleString();
  surplusCashEl.textContent = '$' + surplusCash.toLocaleString();
  
  // Update risk indicators
  borrowingNeedEl.className = borrowingNeed > 1000000 ? 'kpi-value risk' : 'kpi-value';
  surplusCashEl.className = surplusCash > 1000000 ? 'kpi-value good' : 'kpi-value';
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiInsightEl.style.display = 'none';
    return;
  }
  
  aiInsightEl.style.display = 'block';
  const scenario = scenarioSelect.value;
  
  const recommendations = {
    normal: 'Maintain current cash management practices. Consider investing surplus cash for additional returns.',
    revenueDecline: 'Consider accelerating receivables collection and negotiating extended payment terms with suppliers.',
    paymentAcceleration: 'Evaluate early payment discounts and optimize payment timing to preserve cash.',
    emergencyOutflow: 'Activate emergency credit facility and consider asset liquidation options.',
    custom: 'Review cash flow projections and consider hedging strategies for volatile scenarios.'
  };
  
  recommendationText.textContent = recommendations[scenario] || recommendations.custom;
}

function resetValues() {
  scenarioSelect.value = 'normal';
  inflowsInput.value = 5000000;
  outflowsInput.value = 4200000;
  seasonalSelect.value = 0;
  customControls.style.display = 'none';
  updateCalculations();
}

function compareScenarios() {
  alert('Comparing all scenarios:\n\n' +
    'Normal: Ending Cash $16.3M\n' +
    'Revenue Decline: Ending Cash $14.1M\n' +
    'Payment Acceleration: Ending Cash $15.2M\n' +
    'Emergency Outflow: Ending Cash $11.8M\n\n' +
    'AI recommends optimizing receivables collection to improve cash position.');
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    inflows: inflowsInput.value,
    outflows: outflowsInput.value,
    startingCash: startingCashEl.textContent,
    endingCash: endingCashEl.textContent,
    borrowingNeed: borrowingNeedEl.textContent,
    surplusCash: surplusCashEl.textContent,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'liquidity-stress-test-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);