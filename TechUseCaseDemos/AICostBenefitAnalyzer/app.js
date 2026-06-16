// AI Cost-Benefit Analyzer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultsSection');
const recommendation = document.getElementById('recommendation');

const DISCOUNT_RATE = 0.1; // 10% discount rate

calculateBtn.addEventListener('click', function() {
  const data = {
    dataCost: parseFloat(document.getElementById('dataCost').value),
    computeCost: parseFloat(document.getElementById('computeCost').value),
    personnelCost: parseFloat(document.getElementById('personnelCost').value) * parseFloat(document.getElementById('personnelRate').value),
    volume: parseFloat(document.getElementById('expectedVolume').value),
    valuePerTx: parseFloat(document.getElementById('valuePerTransaction').value),
    efficiency: parseFloat(document.getElementById('efficiencyGain').value) / 100
  };
  
  const totalCost = data.dataCost + data.computeCost + data.personnelCost;
  const annualValue = data.volume * 12 * data.valuePerTx * data.efficiency;
  
  // 3-year NPV calculation
  let npv = -totalCost;
  for (let year = 1; year <= 3; year++) {
    npv += annualValue / Math.pow(1 + DISCOUNT_RATE, year);
  }
  
  const roi = ((npv + totalCost) / totalCost) * 100;
  const paybackMonths = (totalCost / annualValue) * 12;
  
  // Update UI
  document.getElementById('totalCost').textContent = '$' + totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 });
  document.getElementById('annualValue').textContent = '$' + annualValue.toLocaleString('en-US', { maximumFractionDigits: 0 });
  document.getElementById('npv').textContent = '$' + npv.toLocaleString('en-US', { maximumFractionDigits: 0 });
  document.getElementById('roi').textContent = roi.toFixed(1) + '%';
  document.getElementById('payback').textContent = paybackMonths.toFixed(1) + ' months';
  
  resultsSection.classList.remove('hidden');
  
  // Recommendation
  recommendation.classList.remove('hidden');
  if (roi > 100 && paybackMonths < 12) {
    recommendation.innerHTML = '<strong>Recommendation:</strong> Strong investment. Positive ROI with payback within first year.';
    recommendation.style.borderLeftColor = '#4caf50';
  } else if (roi > 50) {
    recommendation.innerHTML = '<strong>Recommendation:</strong> Viable investment. Positive ROI over 3 years.';
    recommendation.style.borderLeftColor = '#ff9800';
  } else {
    recommendation.innerHTML = '<strong>Recommendation:</strong> Consider optimization. ROI is marginal.';
    recommendation.style.borderLeftColor = '#f44336';
  }
});