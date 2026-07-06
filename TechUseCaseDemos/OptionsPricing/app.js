// Options Pricing Calculator - Black-Scholes Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Standard normal CDF approximation (Math.erf is not a real JS function —
// the previous version of this file called it and silently produced NaN).
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

function normPDF(x) {
  return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
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
  const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
  const vega = S * normPDF(d1) * Math.sqrt(T) / 100;

  // Put-call parity: C - P should equal S - K*e^(-rT). Comparing the two
  // sides is a quick, independent sanity check that the priced call/put
  // pair is internally consistent — useful even outside this demo.
  const parityLeft = call - put;
  const parityRight = S - K * Math.exp(-r * T);
  const parityGap = Math.abs(parityLeft - parityRight);

  document.getElementById('output').innerHTML = `
    <div class="output-item"><strong>Call Price</strong><span>$${call.toFixed(2)}</span></div>
    <div class="output-item"><strong>Put Price</strong><span>$${put.toFixed(2)}</span></div>
    <div class="output-item"><strong>Delta (Call)</strong><span>${deltaCall.toFixed(3)}</span></div>
    <div class="output-item"><strong>Delta (Put)</strong><span>${deltaPut.toFixed(3)}</span></div>
    <div class="output-item"><strong>Gamma</strong><span>${gamma.toFixed(4)}</span></div>
    <div class="output-item"><strong>Vega</strong><span>${vega.toFixed(2)}</span></div>
    <div class="output-item parity-check"><strong>Put-Call Parity</strong><span>C - P = $${parityLeft.toFixed(2)} vs. S - Ke⁻ʳᵀ = $${parityRight.toFixed(2)} (gap $${parityGap.toFixed(4)})</span></div>
  `;
}

function calculate() {
  blackScholes();
}

window.onload = calculate;
