// Smart Contract Treasury Operations
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Smart Contract Treasury Operations - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Scenario definitions
const scenarios = {
  daily: { name: 'Daily Operations', txCount: 5, avgAmount: 25000 },
  monthly: { name: 'Monthly Settlement', txCount: 1, avgAmount: 150000 },
  quarterly: { name: 'Quarterly Treasury', txCount: 1, avgAmount: 500000 }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const aiRecommendation = document.getElementById('aiRecommendation');

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
  
  // Update balances based on scenario
  const usdcBalance = scenarioData.name === 'Daily Operations' ? 2500000 : 3000000;
  const usdtBalance = scenarioData.name === 'Daily Operations' ? 1800000 : 2200000;
  const daiBalance = scenarioData.name === 'Daily Operations' ? 950000 : 1200000;
  
  document.getElementById('usdcBalance').textContent = '$' + usdcBalance.toLocaleString();
  document.getElementById('usdtBalance').textContent = '$' + usdtBalance.toLocaleString();
  document.getElementById('daiBalance').textContent = '$' + daiBalance.toLocaleString();
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see security recommendations.';
    return;
  }
  
  const scenario = scenarioSelect.value;
  
  const recommendations = {
    daily: 'Monitor transaction frequency. Consider batch processing to reduce gas costs.',
    monthly: 'Review monthly settlement patterns. Optimize timing for better exchange rates.',
    quarterly: 'Large quarterly transfers require additional security verification. Recommend multi-factor approval.',
    custom: 'Ensure all transactions follow treasury policies. AI monitors for anomalies.'
  };
  
  aiRecommendation.textContent = recommendations[scenario] || recommendations.custom;
}

function resetValues() {
  scenarioSelect.value = 'daily';
  document.getElementById('recipient').value = '';
  document.getElementById('amount').value = 50000;
  document.getElementById('token').value = 'USDC';
  updateScenario();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    balances: {
      usdc: document.getElementById('usdcBalance').textContent,
      usdt: document.getElementById('usdtBalance').textContent,
      dai: document.getElementById('daiBalance').textContent
    },
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'smart-contract-treasury-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);