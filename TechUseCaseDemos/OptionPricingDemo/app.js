// Black-Scholes Option Pricer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const spotSlider = document.getElementById('spotSlider');
const strikeSlider = document.getElementById('strikeSlider');
const timeSlider = document.getElementById('timeSlider');
const rateSlider = document.getElementById('rateSlider');
const volSlider = document.getElementById('volSlider');
const optionType = document.getElementById('optionType');

const callPrice = document.getElementById('callPrice');
const putPrice = document.getElementById('putPrice');
const deltaValue = document.getElementById('deltaValue');
const gammaValue = document.getElementById('gammaValue');

// Update value displays
spotSlider.addEventListener('input', () => document.getElementById('spotValue').textContent = spotSlider.value);
strikeSlider.addEventListener('input', () => document.getElementById('strikeValue').textContent = strikeSlider.value);
timeSlider.addEventListener('input', () => document.getElementById('timeValue').textContent = timeSlider.value);
rateSlider.addEventListener('input', () => document.getElementById('rateValue').textContent = rateSlider.value + '%');
volSlider.addEventListener('input', () => document.getElementById('volValue').textContent = volSlider.value + ' (20%)');

// Standard normal CDF approximation
function normCDF(x) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

// Black-Scholes calculation
function blackScholes() {
  const S = parseFloat(spotSlider.value);
  const K = parseFloat(strikeSlider.value);
  const T = parseFloat(timeSlider.value);
  const r = parseFloat(rateSlider.value) / 100;
  const sigma = parseFloat(volSlider.value);
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  const call = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  const put = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
  
  const deltaCall = normCDF(d1);
  const deltaPut = deltaCall - 1;
  
  const gamma = normCDF(d1) / (S * sigma * Math.sqrt(T));
  
  return {
    call: Math.max(0, call),
    put: Math.max(0, put),
    deltaCall: deltaCall,
    deltaPut: deltaPut,
    gamma: gamma
  };
}

function updateUI() {
  const result = blackScholes();
  
  callPrice.textContent = '$' + result.call.toFixed(2);
  putPrice.textContent = '$' + result.put.toFixed(2);
  deltaValue.textContent = optionType.value === 'call' ? result.deltaCall.toFixed(3) : result.deltaPut.toFixed(3);
  gammaValue.textContent = result.gamma.toFixed(3);
}

// Update on any change
[spotSlider, strikeSlider, timeSlider, rateSlider, volSlider, optionType].forEach(el => {
  el.addEventListener('input', el.type === 'select' ? 'change' : 'input', updateUI);
});

// Initialize
updateUI();