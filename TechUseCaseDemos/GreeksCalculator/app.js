// Options Greeks Calculator
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const spotSlider = document.getElementById('spotSlider');
const strikeSlider = document.getElementById('strikeSlider');
const timeSlider = document.getElementById('timeSlider');
const volSlider = document.getElementById('volSlider');
const rateSlider = document.getElementById('rateSlider');
const optionType = document.getElementById('optionType');

const deltaValue = document.getElementById('deltaValue');
const gammaValue = document.getElementById('gammaValue');
const vegaValue = document.getElementById('vegaValue');
const thetaValue = document.getElementById('thetaValue');

spotSlider.addEventListener('input', () => document.getElementById('spotValue').textContent = spotSlider.value);
strikeSlider.addEventListener('input', () => document.getElementById('strikeValue').textContent = strikeSlider.value);
timeSlider.addEventListener('input', () => document.getElementById('timeValue').textContent = timeSlider.value);
volSlider.addEventListener('input', () => document.getElementById('volValue').textContent = volSlider.value);
rateSlider.addEventListener('input', () => document.getElementById('rateValue').textContent = rateSlider.value);

function normCDF(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  return 0.5 * (1.0 + sign * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)));
}

function normPDF(x) {
  return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
}

function calculateGreeks() {
  const S = parseFloat(spotSlider.value);
  const K = parseFloat(strikeSlider.value);
  const T = parseFloat(timeSlider.value);
  const r = parseFloat(rateSlider.value) / 100;
  const sigma = parseFloat(volSlider.value);
  const isCall = optionType.value === 'call';
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  const N_d1 = normCDF(d1);
  const N_d2 = normCDF(d2);
  const n_d1 = normPDF(d1);
  
  // Delta
  const delta = isCall ? N_d1 : N_d1 - 1;
  
  // Gamma (same for call and put)
  const gamma = n_d1 / (S * sigma * Math.sqrt(T));
  
  // Vega (same for call and put)
  const vega = S * Math.sqrt(T) * n_d1 / 100;
  
  // Theta (per day)
  const theta = isCall 
    ? -(S * n_d1 * sigma / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * N_d2) / 365
    : -(-S * n_d1 * sigma / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * N_d2) / 365;
  
  return { delta, gamma, vega, theta };
}

function updateUI() {
  const greeks = calculateGreeks();
  
  deltaValue.textContent = greeks.delta.toFixed(3);
  gammaValue.textContent = greeks.gamma.toFixed(3);
  vegaValue.textContent = greeks.vega.toFixed(4);
  thetaValue.textContent = greeks.theta.toFixed(4);
}

[spotSlider, strikeSlider, timeSlider, volSlider, rateSlider, optionType].forEach(el => {
  el.addEventListener('input', el.type === 'select' ? 'change' : 'input', updateUI);
});

updateUI();