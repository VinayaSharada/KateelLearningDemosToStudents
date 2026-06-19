// Collections Predictor
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Collections Predictor - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Scenario definitions
const scenarios = {
  current: { recovery: 87, accuracy: 87, name: 'Current Collections' },
  improved: { recovery: 92, accuracy: 92, name: 'Improved Process' },
  aggressive: { recovery: 95, accuracy: 89, name: 'Aggressive Collection' }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const totalArEl = document.getElementById('totalAr');
const predictedRecoveryEl = document.getElementById('predictedRecovery');
const accuracyEl = document.getElementById('accuracy');
const aiRecommendation = document.getElementById('aiRecommendation');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');

// Initialize
function init() {
  scenarioSelect.addEventListener('change', updateScenario);
  aiToggle.addEventListener('change', updateAIInsights);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);
  
  updateScenario();
}

function updateScenario() {
  const scenario = scenarioSelect.value;
  const scenarioData = scenarios[scenario];
  
  if (scenarioData) {
    const recovery = (45200000 * scenarioData.recovery / 100);
    totalArEl.textContent = '$' + (45200000 / 1000000).toFixed(1) + 'M';
    predictedRecoveryEl.textContent = '$' + (recovery / 1000000).toFixed(1) + 'M';
    accuracyEl.textContent = scenarioData.accuracy + '%';
  }
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see recommendations.';
    return;
  }
  
  const scenario = scenarioSelect.value;
  const scenarioData = scenarios[scenario];
  
  const recommendations = {
    current: 'Focus on INV-2024-001256 (City Council) - high amount, critical risk. Consider legal action. INV-2024-001198 (Global Solutions) needs immediate commercial call.',
    improved: 'With improved process, recovery rate increased by 5%. Prioritize invoices over 60 days old.',
    aggressive: 'Aggressive collection strategy shows 95% recovery. Deploy automated dunning workflows.',
    custom: 'Custom scenario: Adjust collection tactics based on customer risk profiles.'
  };
  
  aiRecommendation.textContent = recommendations[scenario] || recommendations.current;
}

function resetValues() {
  scenarioSelect.value = 'current';
  updateScenario();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    totalAr: totalArEl.textContent,
    predictedRecovery: predictedRecoveryEl.textContent,
    accuracy: accuracyEl.textContent,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'collections-predictor-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);