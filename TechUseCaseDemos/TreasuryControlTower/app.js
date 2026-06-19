// Treasury Control Tower
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Treasury Control Tower - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Demo data
const currencyData = [
  { currency: 'USD', amount: 12000000, flag: '🇺🇸' },
  { currency: 'EUR', amount: 8500000, flag: '🇪🇺' },
  { currency: 'GBP', amount: 4200000, flag: '🇬🇧' },
  { currency: 'JPY', amount: 2100000000, flag: '🇯🇵' }
];

// Initialize currency display
function initCurrencyDisplay() {
  const container = document.querySelector('.currency-grid');
  container.innerHTML = currencyData.map(item => `
    <div class="currency-item">
      <span class="currency-flag">${item.flag}</span>
      <span class="currency-name">${item.currency}</span>
      <span class="currency-amount">${formatCurrency(item.currency, item.amount)}</span>
    </div>
  `).join('');
}

function formatCurrency(currency, amount) {
  if (currency === 'JPY') {
    return '¥' + (amount / 100000000).toFixed(1) + 'B';
  }
  return '$' + (amount / 1000000).toFixed(1) + 'M';
}

// Forecast chart simulation
function initForecastChart() {
  const canvas = document.getElementById('forecastChart');
  const ctx = canvas.getContext('2d');
  
  // Sample forecast data
  const data = [22, 23, 24, 25, 26, 27, 28, 29, 27, 26, 25, 24];
  const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
  
  // Draw chart
  const padding = 20;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;
  
  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i <= 4; i++) {
    const y = padding + (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }
  
  // Data line
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((value, i) => {
    const x = padding + (width / (data.length - 1)) * i;
    const y = padding + height - (value / 35) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Fill area
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(padding, padding + height);
  data.forEach((value, i) => {
    const x = padding + (width / (data.length - 1)) * i;
    const y = padding + height - (value / 35) * height;
    ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  
  // Labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px sans-serif';
  labels.forEach((label, i) => {
    const x = padding + (width / (data.length - 1)) * i;
    ctx.fillText(label, x, canvas.height - 5);
  });
}

// Scenario planning
document.getElementById('revenueChange').addEventListener('input', updateScenario);
document.getElementById('expenseChange').addEventListener('input', updateScenario);

function updateScenario() {
  const revenueChange = parseFloat(document.getElementById('revenueChange').value);
  const expenseChange = parseFloat(document.getElementById('expenseChange').value);
  
  document.getElementById('revenueValue').textContent = revenueChange + '%';
  document.getElementById('expenseValue').textContent = expenseChange + '%';
  
  // Calculate projected cash
  const baseCash = 24580000;
  const revenueImpact = baseCash * 0.01 * revenueChange;
  const expenseImpact = baseCash * 0.005 * expenseChange;
  const projectedCash = baseCash + revenueImpact - expenseImpact;
  
  document.getElementById('projectedCash').textContent = '$' + (projectedCash / 1000000).toFixed(1) + 'M';
  
  // Determine liquidity impact
  const netImpact = revenueImpact - expenseImpact;
  const impactEl = document.getElementById('liquidityImpact');
  if (netImpact > 100000) {
    impactEl.textContent = 'Positive';
    impactEl.className = 'result-value positive';
  } else if (netImpact < -100000) {
    impactEl.textContent = 'Negative';
    impactEl.className = 'result-value negative';
  } else {
    impactEl.textContent = 'Neutral';
    impactEl.className = 'result-value';
  }
}

// AI Forecast toggle
document.getElementById('aiForecast').addEventListener('change', function() {
  const chart = document.getElementById('forecastChart');
  chart.style.opacity = this.checked ? 1 : 0.5;
});

// Initialize
initCurrencyDisplay();
initForecastChart();