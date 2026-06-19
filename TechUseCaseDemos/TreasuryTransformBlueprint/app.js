// Treasury Transform Blueprint
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Treasury Transform Blueprint - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Update maturity scores
function updateScores() {
  const data = parseInt(document.getElementById('dataSelect').value);
  const tech = parseInt(document.getElementById('techSelect').value);
  const process = parseInt(document.getElementById('processSelect').value);
  const people = parseInt(document.getElementById('peopleSelect').value);
  const risk = parseInt(document.getElementById('riskSelect').value);
  
  document.getElementById('dataScore').textContent = data;
  document.getElementById('techScore').textContent = tech;
  document.getElementById('processScore').textContent = process;
  document.getElementById('peopleScore').textContent = people;
  document.getElementById('riskScore').textContent = risk;
  
  const total = data + tech + process + people + risk;
  document.getElementById('overallScore').textContent = total + '/25';
  
  const level = Math.floor(total / 5);
  const levelNames = ['1 - Basic', '2 - Developing', '3 - Advanced', '4 - Leading', '5 - Transformative'];
  document.querySelector('.overall-score span:last-child').textContent = '(' + levelNames[level - 1] + ')';
}

// Generate roadmap
document.getElementById('generateBtn').addEventListener('click', function() {
  updateScores();
  alert('Roadmap generated successfully!\n\nYour treasury transformation plan is ready.\nCheck the roadmap section below for your customized plan.');
});

// ROI Calculator
function updateROI() {
  const investment = parseFloat(document.getElementById('techInvestment').value);
  const efficiencyGain = parseFloat(document.getElementById('efficiencyGain').value);
  const annualSavings = parseFloat(document.getElementById('annualSavings').value);
  
  document.getElementById('totalInv').textContent = '$' + (investment / 1000000).toFixed(1) + 'M';
  document.getElementById('annSavings').textContent = '$' + (annualSavings / 1000000).toFixed(1) + 'M';
  
  const paybackMonths = (investment / annualSavings) * 12;
  document.getElementById('payback').textContent = paybackMonths.toFixed(0) + ' months';
  
  const roi = ((annualSavings * 3 - investment) / investment) * 100;
  document.getElementById('threeYearRoi').textContent = roi.toFixed(0) + '%';
}

// Initialize
document.querySelectorAll('select').forEach(select => {
  select.addEventListener('change', updateScores);
});

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', updateROI);
});

updateScores();
updateROI();