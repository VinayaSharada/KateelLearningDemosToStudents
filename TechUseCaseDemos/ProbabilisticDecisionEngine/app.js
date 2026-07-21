// Probabilistic Decision Engine - Amortized Inference Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const ageSlider = document.getElementById('ageSlider');
const biomarkerSlider = document.getElementById('biomarkerSlider');
const symptomSelect = document.getElementById('symptomSelect');
const treatmentA = document.getElementById('treatmentA');
const treatmentB = document.getElementById('treatmentB');
const treatmentC = document.getElementById('treatmentC');
const queryInput = document.getElementById('queryInput');

const recoveryBar = document.getElementById('recoveryBar');
const recoveryValue = document.getElementById('recoveryValue');
const riskBar = document.getElementById('riskBar');
const riskValue = document.getElementById('riskValue');
const recommendationText = document.getElementById('recommendationText');

// Update value displays
ageSlider.addEventListener('input', () => document.getElementById('ageValue').textContent = ageSlider.value);
biomarkerSlider.addEventListener('input', () => document.getElementById('biomarkerValue').textContent = biomarkerSlider.value);
symptomSelect.addEventListener('change', () => document.getElementById('symptomValue').textContent = symptomSelect.value);

// Amortized inference simulation
function computePredictions() {
  const age = parseInt(ageSlider.value);
  const biomarker = parseFloat(biomarkerSlider.value);
  const symptom = symptomSelect.value;
  
  // Simulate amortized neural network inference
  // In real ACE, this would be a learned amortized posterior
  const baseRecovery = 0.4 + (0.5 * (1 - biomarker)) + (0.1 * (1 - age/100));
  const symptomModifier = symptom === 'high' ? -0.15 : symptom === 'low' ? 0.1 : 0;
  const ageModifier = (40 - age) / 100;
  
  let recoveryProb = Math.max(0.1, Math.min(0.95, baseRecovery + symptomModifier + ageModifier));
  let riskProb = 1 - recoveryProb;
  
  // Apply treatment modifiers
  if (treatmentB.checked) {
    recoveryProb += 0.15;
    riskProb -= 0.15;
  }
  if (treatmentC.checked) {
    recoveryProb += 0.05;
    riskProb -= 0.05;
  }
  
  // Custom query modification
  const query = queryInput.value.toLowerCase();
  if (query.includes('age') && query.includes('>')) {
    const thresholdMatch = query.match(/\d+/);
    const threshold = parseInt((thresholdMatch && thresholdMatch[0]) || '60');
    if (age > threshold) {
      recoveryProb -= 0.1;
    }
  }
  
  return {
    recovery: Math.max(0.1, Math.min(0.95, recoveryProb)),
    risk: Math.max(0.05, Math.min(0.9, riskProb))
  };
}

function updateUI() {
  const { recovery, risk } = computePredictions();
  
  // Update bars
  recoveryBar.style.width = `${recovery * 100}%`;
  recoveryValue.textContent = `${Math.round(recovery * 100)}%`;
  riskBar.style.width = `${risk * 100}%`;
  riskValue.textContent = `${Math.round(risk * 100)}%`;
  
  // Update recommendation
  if (recovery > 0.75) {
    recommendationText.textContent = 'Standard Treatment recommended';
    recommendationText.style.color = '#58a6ff';
  } else if (recovery > 0.5) {
    recommendationText.textContent = 'Consider Experimental Therapy';
    recommendationText.style.color = '#ffd93d';
  } else {
    recommendationText.textContent = 'Combination Approach suggested';
    recommendationText.style.color = '#ff6b6b';
  }
}

// Update on any change
[ageSlider, biomarkerSlider, symptomSelect, treatmentA, treatmentB, treatmentC, queryInput].forEach(el => {
  const eventName = el.type === 'checkbox' ? 'change' : 'input';
  el.addEventListener(eventName, updateUI);
});

// Initialize
updateUI();
