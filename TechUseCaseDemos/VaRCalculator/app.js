// VaR Calculator - FIXED VERSION
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('VaR Calculator - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const valueSlider = document.getElementById('valueSlider');
const volSlider = document.getElementById('volSlider');
const confLevel = document.getElementById('confLevel');
const timeHorizon = document.getElementById('timeHorizon');

const parametricVaR = document.getElementById('parametricVaR');
const historicalVaR = document.getElementById('historicalVaR');
const zScore = document.getElementById('zScore');
const esValue = document.getElementById('esValue');
const valueValue = document.getElementById('valueValue');
const volValue = document.getElementById('volValue');

// Z-scores for confidence levels
const zScores = { '0.95': 1.645, '0.99': 2.326, '0.995': 2.576 };

function calculateVaR() {
  const portfolioValue = parseFloat(valueSlider.value);
  const vol = parseFloat(volSlider.value);
  const conf = parseFloat(confLevel.value);
  const days = parseInt(timeHorizon.value);
  
  const z = zScores[conf.toString()] || 1.645;
  const scaleFactor = Math.sqrt(days / 252);
  
  // Parametric VaR
  const parametric = portfolioValue * vol * z * scaleFactor;
  
  // Historical VaR (simplified - assume slightly lower)
  const historical = parametric * 0.92;
  
  // Expected Shortfall (CVaR) - average of tail
  const es = parametric * 1.25;
  
  return { parametric, historical, es, z };
}

function updateUI() {
  // Update display values
  valueValue.textContent = '$' + parseInt(valueSlider.value).toLocaleString();
  volValue.textContent = volSlider.value;
  
  const result = calculateVaR();
  
  parametricVaR.textContent = '$' + (result.parametric / 1000).toFixed(1) + 'k';
  historicalVaR.textContent = '$' + (result.historical / 1000).toFixed(1) + 'k';
  zScore.textContent = result.z.toFixed(3);
  esValue.textContent = '$' + (result.es / 1000).toFixed(1) + 'k';
}

// Add event listeners to all inputs
[valueSlider, volSlider].forEach(el => {
  el.addEventListener('input', () => {
    updateUI();
  });
});

[confLevel, timeHorizon].forEach(el => {
  el.addEventListener('change', updateUI);
});

// Initialize
updateUI();