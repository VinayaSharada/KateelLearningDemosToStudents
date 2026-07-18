// Monte Carlo Options Pricer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const spotSlider = document.getElementById('spotSlider');
const volSlider = document.getElementById('volSlider');
const rateSlider = document.getElementById('rateSlider');
const timeSlider = document.getElementById('timeSlider');
const pathsSlider = document.getElementById('pathsSlider');
const strikeSlider = document.getElementById('strikeSlider');

const callPrice = document.getElementById('callPrice');
const putPrice = document.getElementById('putPrice');
const stdError = document.getElementById('stdError');
const convergence = document.getElementById('convergence');

// Update value displays
spotSlider.addEventListener('input', () => document.getElementById('spotValue').textContent = spotSlider.value);
volSlider.addEventListener('input', () => document.getElementById('volValue').textContent = volSlider.value);
rateSlider.addEventListener('input', () => document.getElementById('rateValue').textContent = rateSlider.value);
timeSlider.addEventListener('input', () => document.getElementById('timeValue').textContent = timeSlider.value);
pathsSlider.addEventListener('input', () => document.getElementById('pathsValue').textContent = parseInt(pathsSlider.value).toLocaleString());
strikeSlider.addEventListener('input', () => document.getElementById('strikeValue').textContent = strikeSlider.value);

// Box-Muller transform for normal random numbers
function boxMuller() {
  let u;
  let v;
  let radiusSquared;
  do {
    u = 2 * Math.random() - 1;
    v = 2 * Math.random() - 1;
    radiusSquared = u * u + v * v;
  } while (radiusSquared >= 1 || radiusSquared === 0);
  const scale = Math.sqrt(-2.0 * Math.log(radiusSquared) / radiusSquared);
  return [u * scale, v * scale];
}

// Monte Carlo simulation
function monteCarloPricing() {
  const S = parseFloat(spotSlider.value);
  const K = parseFloat(strikeSlider.value);
  const T = parseFloat(timeSlider.value);
  const r = parseFloat(rateSlider.value) / 100;
  const sigma = parseFloat(volSlider.value);
  const numPaths = parseInt(pathsSlider.value);
  
  let callSum = 0, putSum = 0;
  let callSq = 0, putSq = 0;
  const dt = T;
  const drift = (r - 0.5 * sigma * sigma) * dt;
  const vol = sigma * Math.sqrt(dt);
  
  for (let i = 0; i < numPaths; i++) {
    const z = boxMuller()[0];
    const ST = S * Math.exp(drift + vol * z);
    const callPayoff = Math.max(0, ST - K);
    const putPayoff = Math.max(0, K - ST);
    callSum += callPayoff;
    putSum += putPayoff;
    callSq += callPayoff * callPayoff;
    putSq += putPayoff * putPayoff;
  }
  
  const discount = Math.exp(-r * T);
  const callPrice = discount * callSum / numPaths;
  const putPrice = discount * putSum / numPaths;
  
  const callVar = (callSq / numPaths - callPrice * callPrice) / numPaths;
  const putVar = (putSq / numPaths - putPrice * putPrice) / numPaths;
  const stdErr = discount * Math.sqrt((callVar + putVar) / 2);
  
  return { call: callPrice, put: putPrice, stdErr: stdErr };
}

function updateUI() {
  const result = monteCarloPricing();
  
  callPrice.textContent = '$' + result.call.toFixed(2);
  putPrice.textContent = '$' + result.put.toFixed(2);
  stdError.textContent = '$' + result.stdErr.toFixed(2);
  
  const numPaths = parseInt(pathsSlider.value);
  const cv = result.stdErr / (result.call + result.put) * 100;
  convergence.textContent = (100 - Math.min(5, cv)).toFixed(0) + '%';
}

// Update on any change
[spotSlider, volSlider, rateSlider, timeSlider, pathsSlider, strikeSlider].forEach(el => {
  el.addEventListener('input', updateUI);
});

// Initialize
updateUI();
