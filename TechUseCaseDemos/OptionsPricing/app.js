// Options Pricing Calculator - Black-Scholes Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

function normCDF(x) {
  return 0.5 * (1 + Math.erf(x / Math.sqrt(2)));
}

function blackScholes() {
  const S = parseFloat(document.getElementById('spot').value);
  const K = parseFloat(document.getElementById('strike').value);
  const T = parseFloat(document.getElementById('time').value);
  const r = parseFloat(document.getElementById('rate').value);
  const sigma = parseFloat(document.getElementById('vol').value);
  
  if (T <= 0 || sigma <= 0) return;
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  const call = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
  const put = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
  
  const deltaCall = normCDF(d1);
  const deltaPut = normCDF(d1) - 1;
  const gamma = normCDF(d1) / (S * sigma * Math.sqrt(T));
  const vega = S * Math.sqrt(T) * (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-d1 * d1 / 2);
  
  document.getElementById('output').innerHTML = `
    <div class="output-item"><strong>Call Price</strong><span>$${call.toFixed(2)}</span></div>
    <div class="output-item"><strong>Put Price</strong><span>$${put.toFixed(2)}</span></div>
    <div class="output-item"><strong>Delta (Call)</strong><span>${deltaCall.toFixed(3)}</span></div>
    <div class="output-item"><strong>Delta (Put)</strong><span>${deltaPut.toFixed(3)}</span></div>
    <div class="output-item"><strong>Gamma</strong><span>${gamma.toFixed(4)}</span></div>
    <div class="output-item"><strong>Vega</strong><span>${vega.toFixed(2)}</span></div>
  `;
}

function calculate() {
  blackScholes();
}

window.onload = calculate;