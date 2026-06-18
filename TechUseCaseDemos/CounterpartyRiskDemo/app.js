// Counterparty Risk Calculator - CVA/DVA Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const notionalSlider = document.getElementById('notionalSlider');
const exposureSlider = document.getElementById('exposureSlider');
const pdSlider = document.getElementById('pdSlider');
const lgdSlider = document.getElementById('lgdSlider');
const rateSlider = document.getElementById('rateSlider');

const eeValue = document.getElementById('eeValue');
const cvaValue = document.getElementById('cvaValue');
const dvaValue = document.getElementById('dvaValue');
const adjustedValue = document.getElementById('adjustedValue');

notionalSlider.addEventListener('input', () => document.getElementById('notionalValue').textContent = '$' + (notionalSlider.value/1000000).toFixed(0) + 'M');
exposureSlider.addEventListener('input', () => document.getElementById('exposureValue').textContent = (exposureSlider.value * 100).toFixed(0) + '%');
pdSlider.addEventListener('input', () => document.getElementById('pdValue').textContent = pdSlider.value.toFixed(1) + '%');
lgdSlider.addEventListener('input', () => document.getElementById('lgdValue').textContent = (lgdSlider.value * 100).toFixed(0) + '%');
rateSlider.addEventListener('input', () => document.getElementById('rateValue').textContent = rateSlider.value.toFixed(1) + '%');

function calculateCVA() {
  const notional = parseFloat(notionalSlider.value);
  const exposure = parseFloat(exposureSlider.value);
  const pd = parseFloat(pdSlider.value) / 100;
  const lgd = parseFloat(lgdSlider.value);
  const rate = parseFloat(rateSlider.value) / 100;
  
  // Expected Exposure
  const ee = notional * exposure;
  
  // CVA = EE * PD * LGD (simplified)
  const cva = ee * pd * lgd;
  
  // DVA (own credit risk - simplified as 0 for this demo)
  const dva = 0;
  
  // Net CVA
  const netCVA = cva - dva;
  
  // Adjusted value
  const adjusted = notional - netCVA;
  
  return { ee, cva, dva, adjusted };
}

function updateUI() {
  const result = calculateCVA();
  
  eeValue.textContent = '$' + (result.ee / 1000000).toFixed(1) + 'M';
  cvaValue.textContent = '$' + (result.cva / 1000).toFixed(0) + 'K';
  dvaValue.textContent = '$' + (result.dva / 1000).toFixed(0) + 'K';
  adjustedValue.textContent = '$' + (result.adjusted / 1000000).toFixed(1) + 'M';
}

[notionalSlider, exposureSlider, pdSlider, lgdSlider, rateSlider].forEach(el => {
  el.addEventListener('input', updateUI);
});

updateUI();