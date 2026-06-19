// Stablecoin Manager
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Stablecoin Manager - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Update allocation percentages
document.getElementById('lendingPct').addEventListener('input', function() {
  document.getElementById('lendingPctVal').textContent = this.value + '%';
  updateYields();
});

document.getElementById('dexPct').addEventListener('input', function() {
  document.getElementById('dexPctVal').textContent = this.value + '%';
  updateYields();
});

document.getElementById('cashPct').addEventListener('input', function() {
  document.getElementById('cashPctVal').textContent = this.value + '%';
  updateYields();
});

function updateYields() {
  const lendingPct = parseFloat(document.getElementById('lendingPct').value) / 100;
  const dexPct = parseFloat(document.getElementById('dexPct').value) / 100;
  const cashPct = parseFloat(document.getElementById('cashPct').value) / 100;
  
  const totalTvl = 42500000;
  
  const aaveYield = 3.2;
  const curveYield = 2.8;
  const convexYield = 4.5;
  
  const lendingYield = aaveYield * lendingPct;
  const dexYield = curveYield * dexPct;
  const convexBoostYield = convexYield * dexPct * 0.6; // Convex boost on curve
  
  const totalYield = lendingYield + dexYield + convexBoostYield;
  
  document.getElementById('aaveYield').textContent = aaveYield + '%';
  document.getElementById('curveYield').textContent = curveYield + '%';
  document.getElementById('convexYield').textContent = convexYield + '%';
  document.getElementById('totalYield').textContent = totalYield.toFixed(1) + '%';
  
  const annualYield = totalTvl * totalYield / 100;
  document.querySelector('.yield-card.total .yield-amount').textContent = '$' + (annualYield / 1000000).toFixed(2) + 'M';
}

// Initialize
updateYields();