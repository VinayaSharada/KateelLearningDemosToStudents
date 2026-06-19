// Treasury Transformation Blueprint
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Treasury Transformation Blueprint - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Organization sizes
const orgSizes = {
  small: { investment: 1000000, savings: 500000, name: 'Small Enterprise' },
  medium: { investment: 2500000, savings: 1500000, name: 'Medium Enterprise' },
  large: { investment: 5000000, savings: 3000000, name: 'Large Enterprise' }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const aiRecommendation = document.getElementById('aiRecommendation');

// Initialize
function init() {
  scenarioSelect.addEventListener('change', updateScenario);
  aiToggle.addEventListener('change', updateAIInsights);
  generateBtn.addEventListener('click', generateRoadmap);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);
  
  updateScenario();
}

function updateScenario() {
  const scenario = scenarioSelect.value;
  
  if (orgSizes[scenario]) {
    const org = orgSizes[scenario];
    document.getElementById('techInvestment').value = org.investment;
    document.getElementById('annualSavings').value = org.savings;
    document.getElementById('efficiencyGain').value = 25;
  }
  
  calculateROI();
  updateAIInsights();
}

function calculateROI() {
  const investment = parseFloat(document.getElementById('techInvestment').value) || 0;
  const savings = parseFloat(document.getElementById('annualSavings').value) || 0;
  const efficiency = parseFloat(document.getElementById('efficiencyGain').value) || 0;
  
  document.getElementById('totalInv').textContent = '$' + investment.toLocaleString();
  document.getElementById('annSavings').textContent = '$' + savings.toLocaleString();
  
  const payback = investment / savings * 12;
  document.getElementById('payback').textContent = payback.toFixed(0) + ' months';
  
  const roi = savings * 3 / investment * 100;
  document.getElementById('threeYearRoi').textContent = roi.toFixed(0) + '%';
}

function generateRoadmap() {
  alert('Transformation Roadmap Generated!\n\n' +
    'Year 1: Data integration, automation, basic analytics\n' +
    'Year 2: AI forecasting, multi-currency hedging, blockchain\n' +
    'Year 3: Real-time visibility, autonomous operations\n\n' +
    'Roadmap has been optimized for your organization size.');
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see recommendations.';
    return;
  }
  
  const scenario = scenarioSelect.value;
  const org = orgSizes[scenario] || orgSizes.medium;
  
  aiRecommendation.textContent = 
    `For ${org.name}, focus Year 1 investments on data integration and automation for quickest ROI. Target 6-month payback on cash positioning improvements.`;
}

function resetValues() {
  scenarioSelect.value = 'medium';
  document.getElementById('techInvestment').value = 2500000;
  document.getElementById('annualSavings').value = 1500000;
  document.getElementById('efficiencyGain').value = 25;
  calculateROI();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    investment: document.getElementById('techInvestment').value,
    savings: document.getElementById('annualSavings').value,
    efficiency: document.getElementById('efficiencyGain').value,
    roi: document.getElementById('threeYearRoi').textContent,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'treasury-transform-blueprint.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);