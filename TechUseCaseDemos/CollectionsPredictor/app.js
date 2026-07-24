// Collections Predictor - Enhanced UX with reordering and custom weights
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Collections Predictor - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Invoice data with base probabilities
const invoices = [
  { id: 'INV-2024-001256', customer: 'City Council', amount: 2400000, days: 94, baseProb: 41, riskLevel: 'critical' },
  { id: 'INV-2024-001198', customer: 'Global Solutions', amount: 1100000, days: 73, baseProb: 54, riskLevel: 'high' },
  { id: 'INV-2024-001305', customer: 'Metro Retail', amount: 640000, days: 38, baseProb: 83, riskLevel: 'low' }
];

const TOTAL_AR = 45200000;

// Scenario definitions - base weights for different strategies
const scenarios = {
  current: { riskWeight: 30, speedWeight: 30, relationshipWeight: 40, recovery: 87, accuracy: 87, name: 'Current Process' },
  improved: { riskWeight: 50, speedWeight: 40, relationshipWeight: 30, recovery: 92, accuracy: 92, name: 'Improved Process' },
  aggressive: { riskWeight: 70, speedWeight: 60, relationshipWeight: 20, recovery: 95, accuracy: 89, name: 'Aggressive Collection' }
};

let currentScenario = 'current';
let customWeights = { risk: 50, speed: 50, relationship: 50 };

// DOM Elements
const strategyBtns = document.querySelectorAll('.strategy-btn');
const customWeightsPanel = document.getElementById('customWeightsPanel');
const riskSlider = document.getElementById('riskSlider');
const speedSlider = document.getElementById('speedSlider');
const relationshipSlider = document.getElementById('relationshipSlider');
const riskValue = document.getElementById('riskValue');
const speedValue = document.getElementById('speedValue');
const relationshipValue = document.getElementById('relationshipValue');
const aiToggle = document.getElementById('aiToggle');
const totalArEl = document.getElementById('totalAr');
const overdueAmountEl = document.getElementById('overdueAmount');
const criticalCountEl = document.getElementById('criticalCount');
const predictedRecoveryEl = document.getElementById('predictedRecovery');
const recoveryChangeEl = document.getElementById('recoveryChange');
const recoveryRateEl = document.getElementById('recoveryRate');
const accuracyEl = document.getElementById('accuracy');
const aiRecommendation = document.getElementById('aiRecommendation');
const invoiceTable = document.getElementById('invoiceTable');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize
function init() {
  // Strategy button listeners
  strategyBtns.forEach(btn => {
    btn.addEventListener('click', () => selectStrategy(btn.dataset.strategy));
  });

  // Slider listeners
  riskSlider.addEventListener('input', updateCustomWeights);
  speedSlider.addEventListener('input', updateCustomWeights);
  relationshipSlider.addEventListener('input', updateCustomWeights);

  // Other listeners
  aiToggle.addEventListener('change', updateAIInsights);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);

  // Initial render
  updateUI();
}

// Select a strategy
function selectStrategy(strategy) {
  currentScenario = strategy;

  // Update button states
  strategyBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.strategy === strategy);
  });

  // Show/hide custom weights panel
  if (strategy === 'custom') {
    customWeightsPanel.classList.remove('hidden');
  } else {
    customWeightsPanel.classList.add('hidden');
    // Load preset weights
    const preset = scenarios[strategy];
    if (preset) {
      riskSlider.value = preset.riskWeight;
      speedSlider.value = preset.speedWeight;
      relationshipSlider.value = preset.relationshipWeight;
      updateCustomWeights();
    }
  }

  updateUI();
}

// Update custom weights from sliders
function updateCustomWeights() {
  customWeights.risk = parseInt(riskSlider.value);
  customWeights.speed = parseInt(speedSlider.value);
  customWeights.relationship = parseInt(relationshipSlider.value);

  riskValue.textContent = customWeights.risk + '%';
  speedValue.textContent = customWeights.speed + '%';
  relationshipValue.textContent = customWeights.relationship + '%';

  updateUI();
}

// Calculate collection probability based on strategy
function calculateProbability(invoice, weights) {
  let prob = invoice.baseProb;

  // Risk weight: critical invoices get higher probability
  if (invoice.riskLevel === 'critical') {
    prob += (weights.risk / 100) * 20;
  } else if (invoice.riskLevel === 'high') {
    prob += (weights.risk / 100) * 10;
  }

  // Speed weight: older invoices get higher probability
  if (invoice.days > 80) {
    prob += (weights.speed / 100) * 15;
  } else if (invoice.days > 60) {
    prob += (weights.speed / 100) * 10;
  }

  // Relationship weight: reduces probability (gentler approach)
  prob -= (weights.relationship / 100) * 15;

  return Math.min(Math.max(prob, 20), 95); // Clamp between 20-95%
}

// Get weights for current scenario
function getCurrentWeights() {
  if (currentScenario === 'custom') {
    return customWeights;
  }
  const preset = scenarios[currentScenario];
  return { risk: preset.riskWeight, speed: preset.speedWeight, relationship: preset.relationshipWeight };
}

// Update invoice table with current strategy
function updateInvoiceTable() {
  const weights = getCurrentWeights();

  invoiceTable.innerHTML = invoices.map(inv => {
    const prob = calculateProbability(inv, weights);
    return `
      <tr data-invoice="${inv.id}" data-amount="${inv.amount}" data-days="${inv.days}">
        <td class="mono">${inv.id}</td>
        <td>${inv.customer}</td>
        <td>$${(inv.amount / 1000000).toFixed(1)}M</td>
        <td class="overdue">${inv.days}</td>
        <td><span class="prob-bar"><span class="prob-fill" style="width: ${prob}%"></span></span></td>
        <td><span class="risk ${inv.riskLevel}">${inv.riskLevel.charAt(0).toUpperCase() + inv.riskLevel.slice(1)}</span></td>
      </tr>
    `;
  }).join('');
}

// Update all summary metrics
function updateSummaryMetrics() {
  const weights = getCurrentWeights();

  // Total AR
  totalArEl.textContent = '$45.2M';

  // Overdue >60 days
  const overdue60 = invoices.filter(inv => inv.days > 60).reduce((sum, inv) => sum + inv.amount, 0);
  overdueAmountEl.textContent = '$' + (overdue60 / 1000000).toFixed(1) + 'M';

  // Critical count
  const criticalCount = invoices.filter(inv => inv.riskLevel === 'critical').length;
  criticalCountEl.textContent = criticalCount;

  // Expected recovery
  let recoveryPct;
  if (currentScenario === 'custom') {
    // Map weights to recovery percentage:
    // Base is 80%, risk adds up to 15%, relationship reduces by up to 10%
    const riskBoost = (weights.risk / 100) * 15;
    const relationshipCost = (weights.relationship / 100) * 10;
    recoveryPct = 80 + riskBoost - relationshipCost;
    recoveryPct = Math.min(Math.max(recoveryPct, 70), 95);
  } else {
    recoveryPct = scenarios[currentScenario].recovery;
  }

  const recovery = TOTAL_AR * (recoveryPct / 100);
  predictedRecoveryEl.textContent = '$' + (recovery / 1000000).toFixed(1) + 'M';

  // Recovery change vs baseline (87% is current process baseline)
  const baseline = TOTAL_AR * 0.87;
  const change = recovery - baseline;
  const changeText = change > 0 ? '+' : '';
  const changeColor = change > 0 ? 'color: #4ade80;' : 'color: #f87171;';
  recoveryChangeEl.textContent = changeText + '$' + (Math.abs(change) / 1000000).toFixed(1) + 'M vs baseline';
  recoveryChangeEl.style.cssText = changeColor;

  // Recovery rate
  recoveryRateEl.textContent = Math.round(recoveryPct) + '%';

  // Accuracy
  let accuracy;
  if (currentScenario === 'custom') {
    // Accuracy is inversely affected by high relationship focus (gentle approach = less predictable)
    accuracy = 88 + (weights.risk / 100) * 4 - (weights.relationship / 100) * 3;
    accuracy = Math.min(Math.max(accuracy, 82), 92);
  } else {
    accuracy = scenarios[currentScenario].accuracy;
  }
  accuracyEl.textContent = Math.round(accuracy) + '%';
}

// Update AI recommendation
function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI guidance to see recommendations.';
    return;
  }

  const weights = getCurrentWeights();

  const recommendations = {
    current: 'Focus on INV-2024-001256 (City Council) first—high amount and critical risk. Then contact Global Solutions to discuss payment options.',
    improved: 'With improved process, prioritize invoices over 60 days old. City Council should be contacted immediately with legal notice. Global Solutions needs a commercial call.',
    aggressive: 'Deploy automated dunning workflows for all overdue invoices. Escalate City Council and Global Solutions to legal team immediately. Expected recovery: 95%.',
    custom: `Custom strategy active. Your focus: ${weights.risk}% risk + ${weights.speed}% speed + ${weights.relationship}% relationships. Prioritize City Council and Global Solutions based on your weighting.`
  };

  aiRecommendation.textContent = recommendations[currentScenario] || recommendations.current;
}

// Main update function
function updateUI() {
  updateInvoiceTable();
  updateSummaryMetrics();
  updateAIInsights();
}

// Reset to baseline
function resetValues() {
  currentScenario = 'current';
  riskSlider.value = 50;
  speedSlider.value = 50;
  relationshipSlider.value = 50;
  customWeights = { risk: 50, speed: 50, relationship: 50 };
  customWeightsPanel.classList.add('hidden');

  strategyBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.strategy === 'current');
  });

  updateUI();
}

// Export scenario results
function exportResults() {
  const weights = getCurrentWeights();
  const recoveryRate = currentScenario === 'custom'
    ? 70 + (weights.risk / 100) * 15 - (weights.relationship / 100) * 10
    : scenarios[currentScenario].recovery;

  const data = {
    scenario: currentScenario,
    strategy: currentScenario === 'custom'
      ? { risk: weights.risk, speed: weights.speed, relationship: weights.relationship }
      : scenarios[currentScenario].name,
    totalAr: totalArEl.textContent,
    expectedRecovery: predictedRecoveryEl.textContent,
    recoveryRate: recoveryRate + '%',
    accuracy: accuracyEl.textContent,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `collections-predictor-${currentScenario}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);