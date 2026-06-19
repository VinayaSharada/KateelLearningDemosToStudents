// FX Hedge Simulator
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('FX Hedge Simulator - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Black-Scholes Option Pricing
function blackScholesPut(S, K, T, r, sigma) {
  // S = Spot price
  // K = Strike price
  // T = Time to maturity (in years)
  // r = Risk-free rate
  // sigma = Volatility
  
  if (T <= 0) return Math.max(K - S, 0);
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  // Cumulative normal distribution approximation
  const N = (x) => 0.5 * (1 + erf(x / Math.sqrt(2)));
  
  const put = K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
  return put;
}

// Error function approximation
function erf(x) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

// Forward Rate Calculation
function calculateForwardRate(spot, usdRate, eurRate, timeMonths) {
  const T = timeMonths / 12;
  return spot * (1 + (usdRate / 100) * T) / (1 + (eurRate / 100) * T);
}

// Update calculations
function updateCalculations() {
  // Get input values
  const spotRate = parseFloat(document.getElementById('spotRate').value);
  const exposureAmount = parseFloat(document.getElementById('exposureAmount').value);
  const timeHorizon = parseFloat(document.getElementById('timeHorizon').value);
  const usdRate = parseFloat(document.getElementById('usdRate').value);
  const eurRate = parseFloat(document.getElementById('eurRate').value);
  const strikePrice = parseFloat(document.getElementById('strikePrice').value);
  const volatility = parseFloat(document.getElementById('volatility').value) / 100;
  const riskFreeRate = parseFloat(document.getElementById('riskFreeRate').value) / 100;
  
  // Calculate forward rate
  const forwardRate = calculateForwardRate(spotRate, usdRate, eurRate, timeHorizon);
  const forwardCost = exposureAmount * forwardRate;
  
  // Calculate option price
  const T = timeHorizon / 12;
  const optionPrice = blackScholesPut(spotRate, strikePrice, T, riskFreeRate, volatility);
  const optionPremium = exposureAmount * optionPrice;
  const optionPV = optionPremium; // Simplified
  
  // Update UI
  document.getElementById('forwardRate').textContent = forwardRate.toFixed(4);
  document.getElementById('forwardCost').textContent = '$' + (forwardCost / 1000000).toFixed(2) + 'M';
  document.getElementById('optionPremium').textContent = '$' + (optionPremium / 1000).toFixed(0);
  document.getElementById('optionPV').textContent = '$' + (optionPV / 1000).toFixed(0);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to all inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', updateCalculations);
  });
  
  // Initial calculation
  updateCalculations();
});