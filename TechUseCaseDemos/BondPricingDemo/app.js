// Bond Pricing Calculator Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const faceSlider = document.getElementById('faceSlider');
const couponSlider = document.getElementById('couponSlider');
const yearsSlider = document.getElementById('yearsSlider');
const ytmSlider = document.getElementById('ytmSlider');
const freqSelect = document.getElementById('freqSelect');

const priceValue = document.getElementById('priceValue');
const ytmResult = document.getElementById('ytmResult');
const durationValue = document.getElementById('durationValue');
const parValue = document.getElementById('parValue');

faceSlider.addEventListener('input', () => document.getElementById('faceValue').textContent = '$' + parseInt(faceSlider.value).toLocaleString());
couponSlider.addEventListener('input', () => document.getElementById('couponValue').textContent = (couponSlider.value * 100).toFixed(1) + '%');
yearsSlider.addEventListener('input', () => document.getElementById('yearsValue').textContent = yearsSlider.value);
ytmSlider.addEventListener('input', () => document.getElementById('ytmValue').textContent = (ytmSlider.value * 100).toFixed(1) + '%');

function calculateBondPrice(face, coupon, ytm, years, freq) {
  const cf = face * coupon / freq;
  const periods = years * freq;
  const ytmPerPeriod = ytm / freq;
  
  let price = 0;
  let duration = 0;
  for (let t = 1; t <= periods; t++) {
    const pv = cf / Math.pow(1 + ytmPerPeriod, t);
    price += pv;
    duration += t * pv;
  }
  
  // Add face value at maturity
  const facePV = face / Math.pow(1 + ytmPerPeriod, periods);
  price += facePV;
  duration += periods * facePV;
  
  // Macaulay Duration
  duration = duration / price / freq;
  
  // Check if at par
  const isAtPar = Math.abs(coupon - ytm) < 0.001;
  
  return { price, duration, isAtPar };
}

function updateUI() {
  const face = parseFloat(faceSlider.value);
  const coupon = parseFloat(couponSlider.value);
  const ytm = parseFloat(ytmSlider.value);
  const years = parseFloat(yearsSlider.value);
  const freq = parseFloat(freqSelect.value);
  
  const result = calculateBondPrice(face, coupon, ytm, years, freq);
  
  priceValue.textContent = '$' + result.price.toFixed(2);
  ytmResult.textContent = (ytm * 100).toFixed(2) + '%';
  durationValue.textContent = result.duration.toFixed(1) + ' yrs';
  parValue.textContent = result.isAtPar ? 'At Par' : (coupon > ytm ? 'Premium' : 'Discount');
}

freqSelect.addEventListener('change', updateUI);
[faceSlider, couponSlider, yearsSlider, ytmSlider].forEach(el => {
  el.addEventListener('input', updateUI);
});

updateUI();
