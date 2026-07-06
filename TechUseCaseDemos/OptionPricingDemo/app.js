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
const thetaValue = document.getElementById('thetaValue');
const vegaValue = document.getElementById('vegaValue');
const rhoValue = document.getElementById('rhoValue');
const payoffCanvas = document.getElementById('payoffChart');

// Update value displays
spotSlider.addEventListener('input', () => document.getElementById('spotValue').textContent = spotSlider.value);
strikeSlider.addEventListener('input', () => document.getElementById('strikeValue').textContent = strikeSlider.value);
timeSlider.addEventListener('input', () => document.getElementById('timeValue').textContent = timeSlider.value);
rateSlider.addEventListener('input', () => document.getElementById('rateValue').textContent = rateSlider.value + '%');
volSlider.addEventListener('input', () => document.getElementById('volValue').textContent = volSlider.value + ' (' + Math.round(volSlider.value * 100) + '%)');

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

// Standard normal PDF
function normPDF(x) {
  return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
}

// Black-Scholes calculation, including the full Greek suite
function blackScholes(S, K, T, r, sigma) {
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const call = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  const put = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);

  const deltaCall = normCDF(d1);
  const deltaPut = deltaCall - 1;

  const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
  const vega = S * normPDF(d1) * Math.sqrt(T) / 100; // per 1% change in volatility

  // Theta expressed per calendar day
  const thetaCall = (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2)) / 365;
  const thetaPut = (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normCDF(-d2)) / 365;

  const rhoCall = K * T * Math.exp(-r * T) * normCDF(d2) / 100; // per 1% change in rate
  const rhoPut = -K * T * Math.exp(-r * T) * normCDF(-d2) / 100;

  return {
    call: Math.max(0, call),
    put: Math.max(0, put),
    deltaCall, deltaPut, gamma, vega,
    thetaCall, thetaPut,
    rhoCall, rhoPut
  };
}

function currentInputs() {
  return {
    S: parseFloat(spotSlider.value),
    K: parseFloat(strikeSlider.value),
    T: parseFloat(timeSlider.value),
    r: parseFloat(rateSlider.value) / 100,
    sigma: parseFloat(volSlider.value)
  };
}

function drawPayoffChart(K, S, isCall) {
  if (!payoffCanvas || !payoffCanvas.getContext) return;
  const ctx = payoffCanvas.getContext('2d');
  const w = payoffCanvas.width, h = payoffCanvas.height;
  ctx.clearRect(0, 0, w, h);

  const minSpot = Math.max(1, K * 0.4);
  const maxSpot = K * 1.6;
  const points = 100;
  const payoffs = [];
  for (let i = 0; i <= points; i++) {
    const spot = minSpot + (maxSpot - minSpot) * (i / points);
    const payoff = isCall ? Math.max(0, spot - K) : Math.max(0, K - spot);
    payoffs.push({ spot, payoff });
  }
  const maxPayoff = Math.max(...payoffs.map(p => p.payoff), 1);

  const padding = 30;
  const toX = spot => padding + ((spot - minSpot) / (maxSpot - minSpot)) * (w - 2 * padding);
  const toY = payoff => h - padding - (payoff / maxPayoff) * (h - 2 * padding);

  // axes
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, h - padding);
  ctx.stroke();

  // strike marker
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(toX(K), padding);
  ctx.lineTo(toX(K), h - padding);
  ctx.stroke();
  ctx.setLineDash([]);

  // current spot marker
  if (S >= minSpot && S <= maxSpot) {
    ctx.strokeStyle = '#f0883e';
    ctx.beginPath();
    ctx.moveTo(toX(S), padding);
    ctx.lineTo(toX(S), h - padding);
    ctx.stroke();
  }

  // payoff line
  ctx.strokeStyle = '#58a6ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  payoffs.forEach((p, i) => {
    const x = toX(p.spot), y = toY(p.payoff);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = '#8b949e';
  ctx.font = '11px sans-serif';
  ctx.fillText('K = ' + K.toFixed(0), toX(K) + 4, padding + 12);
  ctx.fillText('Spot →', w - padding - 45, h - padding + 18);
  ctx.fillText('Payoff at expiry', padding, padding - 10);
}

function updateUI() {
  const { S, K, T, r, sigma } = currentInputs();
  const result = blackScholes(S, K, T, r, sigma);
  const isCall = optionType.value === 'call';

  callPrice.textContent = '$' + result.call.toFixed(2);
  putPrice.textContent = '$' + result.put.toFixed(2);
  deltaValue.textContent = isCall ? result.deltaCall.toFixed(3) : result.deltaPut.toFixed(3);
  gammaValue.textContent = result.gamma.toFixed(4);
  if (thetaValue) thetaValue.textContent = (isCall ? result.thetaCall : result.thetaPut).toFixed(3);
  if (vegaValue) vegaValue.textContent = result.vega.toFixed(3);
  if (rhoValue) rhoValue.textContent = (isCall ? result.rhoCall : result.rhoPut).toFixed(3);

  drawPayoffChart(K, S, isCall);
}

// Update on any change (sliders fire 'input', the select fires 'change')
[spotSlider, strikeSlider, timeSlider, rateSlider, volSlider].forEach(el => {
  el.addEventListener('input', updateUI);
});
optionType.addEventListener('change', updateUI);

// Initialize
updateUI();
