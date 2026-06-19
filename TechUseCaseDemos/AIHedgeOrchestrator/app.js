// Multi-Asset Hedge Optimizer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Multi-Asset Hedge Optimizer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Market conditions
const conditions = {
  normal: { name: 'Normal Markets', vol: 10 },
  volatile: { name: 'High Volatility', vol: 20 },
  crisis: { name: 'Market Crisis', vol: 30 }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const optimizeBtn = document.getElementById('optimizeBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const aiRecommendation = document.getElementById('aiRecommendation');

// Initialize
function init() {
  scenarioSelect.addEventListener('change', updateScenario);
  aiToggle.addEventListener('change', updateAIInsights);
  optimizeBtn.addEventListener('click', optimizeHedges);
  exportBtn.addEventListener('click', exportResults);
  resetBtn.addEventListener('click', resetValues);
  
  updateAIInsights();
}

function updateScenario() {
  updateAIInsights();
}

function optimizeHedges() {
  const scenario = scenarioSelect.value;
  const vol = conditions[scenario]?.vol || 10;
  
  // Calculate hedge ratios based on volatility
  const eurHedge = Math.min(95, 70 + vol * 0.5).toFixed(0);
  const gbpHedge = Math.min(85, 65 + vol * 0.4).toFixed(0);
  const jpyHedge = Math.min(75, 55 + vol * 0.3).toFixed(0);
  const commodityHedge = Math.min(60, 40 + vol * 0.2).toFixed(0);
  
  document.getElementById('eurHedge').textContent = eurHedge + '%';
  document.getElementById('gbpHedge').textContent = gbpHedge + '%';
  document.getElementById('jpyHedge').textContent = jpyHedge + '%';
  document.getElementById('commodityHedge').textContent = commodityHedge + '%';
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see recommendations.';
    return;
  }
  
  const scenario = scenarioSelect.value;
  const condition = conditions[scenario];
  
  const recommendations = {
    normal: 'For normal markets, recommend 75-85% hedging for major currencies. Use forwards for known exposures and options for tail risk.',
    volatile: 'High volatility detected. Increase hedge ratios to 85-95%. Add options overlay for protection against sudden moves.',
    crisis: 'Market crisis conditions. Recommend maximum hedging (90-95%) with options for all exposures. Consider reducing net exposure.',
    custom: 'Adjust hedge ratios based on correlation analysis. AI recommends dynamic hedging strategy.'
  };
  
  aiRecommendation.textContent = recommendations[scenario] || recommendations.custom;
}

function resetValues() {
  scenarioSelect.value = 'normal';
  document.getElementById('eurExposure').value = 5000000;
  document.getElementById('gbpExposure').value = 3000000;
  document.getElementById('jpyExposure').value = 200000000;
  document.getElementById('commodityExposure').value = 1500000;
  optimizeHedges();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    exposures: {
      eur: document.getElementById('eurExposure').value,
      gbp: document.getElementById('gbpExposure').value,
      jpy: document.getElementById('jpyExposure').value,
      commodity: document.getElementById('commodityExposure').value
    },
    hedgeRatios: {
      eur: document.getElementById('eurHedge').textContent,
      gbp: document.getElementById('gbpHedge').textContent,
      jpy: document.getElementById('jpyHedge').textContent,
      commodity: document.getElementById('commodityHedge').textContent
    },
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-hedge-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);