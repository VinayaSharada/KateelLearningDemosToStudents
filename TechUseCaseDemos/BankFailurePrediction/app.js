// Bank Failure Prediction Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Simple logistic regression model (simplified for demo)
function predictFailure() {
  const illiq = parseFloat(document.getElementById('illiqRatio').value);
  const deposit = parseFloat(document.getElementById('depositLoss').value);
  const chargeOffs = parseFloat(document.getElementById('chargeOffs').value);
  
  // Simple heuristic model (demonstration purposes)
  const score = (illiq * 0.5) + (deposit * 0.3) + (chargeOffs * 0.2);
  
  const resultDiv = document.getElementById('prediction');
  const probDiv = document.getElementById('probability');
  const resultSection = document.getElementById('result');
  
  resultSection.classList.remove('hidden');
  
  if (score > 0.6) {
    resultDiv.innerHTML = '<h3 style="color: #ff6b6b;">⚠️ HIGH RISK OF FAILURE</h3>';
    probDiv.innerHTML = '<p>Failure Probability: ' + (score * 100).toFixed(1) + '%</p>';
  } else if (score > 0.4) {
    resultDiv.innerHTML = '<h3 style="color: #ffd93d;">⚠️ MODERATE RISK</h3>';
    probDiv.innerHTML = '<p>Failure Probability: ' + (score * 100).toFixed(1) + '%</p>';
  } else {
    resultDiv.innerHTML = '<h3 style="color: #6bcb77;">✅ LOW RISK</h3>';
    probDiv.innerHTML = '<p>Failure Probability: ' + (score * 100).toFixed(1) + '%</p>';
  }
}

// Update slider values
document.querySelectorAll('input[type="range"]').forEach(function(input) {
  input.addEventListener('input', function() {
    const val = document.getElementById(this.id.replace('Ratio', 'Value').replace('Loss', 'Value').replace('chargeOffs', 'chargeOffValue'));
    if (val) val.textContent = this.value;
  });
});