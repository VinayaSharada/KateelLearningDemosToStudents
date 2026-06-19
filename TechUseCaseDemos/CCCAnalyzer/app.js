// CCC Analyzer
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('CCC Analyzer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Calculate CCC components
function calculateCCC() {
  const totalSales = parseFloat(document.getElementById('totalSales').value);
  const creditSalesPct = parseFloat(document.getElementById('creditSales').value);
  const cogs = parseFloat(document.getElementById('cogs').value);
  const ar = parseFloat(document.getElementById('accountsReceivable').value);
  const ap = parseFloat(document.getElementById('accountsPayable').value);
  const inventory = parseFloat(document.getElementById('inventory').value);
  
  const creditSales = totalSales * (creditSalesPct / 100);
  
  // Calculate days
  const dso = (ar / creditSales) * 365;
  const inventoryDays = (inventory / cogs) * 365;
  const dpo = (ap / cogs) * 365;
  const ccc = dso + inventoryDays - dpo;
  
  return { dso, inventoryDays, dpo, ccc };
}

// Update display
function updateDisplay() {
  const { dso, inventoryDays, dpo, ccc } = calculateCCC();
  
  document.getElementById('dso').textContent = dso.toFixed(1);
  document.getElementById('inventoryDays').textContent = inventoryDays.toFixed(1);
  document.getElementById('dpo').textContent = dpo.toFixed(1);
  document.getElementById('ccc').textContent = ccc.toFixed(1);
  document.getElementById('yourCcc').textContent = ccc.toFixed(1) + ' days';
}

// Update scenario
function updateScenario() {
  updateDisplay();
  
  const dsoImp = parseFloat(document.getElementById('dsoImprovement').value);
  const dpoInc = parseFloat(document.getElementById('dpoIncrease').value);
  const invRed = parseFloat(document.getElementById('inventoryReduce').value);
  
  document.getElementById('dsoImpValue').textContent = dsoImp + '%';
  document.getElementById('dpoIncValue').textContent = dpoInc + '%';
  document.getElementById('invRedValue').textContent = invRed + '%';
  
  const { dso, inventoryDays, dpo, ccc } = calculateCCC();
  
  const optDso = dso * (1 + dsoImp / 100);
  const optInv = inventoryDays * (1 + invRed / 100);
  const optDpo = dpo * (1 + dpoInc / 100);
  const optimizedCcc = optDso + optInv - optDpo;
  
  document.getElementById('optimizedCcc').textContent = optimizedCcc.toFixed(1) + ' days';
  
  // Calculate cash release (simplified: daily CCC improvement * 365 * avg daily revenue)
  const cccImprovement = ccc - optimizedCcc;
  const totalSales = parseFloat(document.getElementById('totalSales').value);
  const dailyRevenue = totalSales / 365;
  const cashRelease = cccImprovement * dailyRevenue;
  
  document.getElementById('cashRelease').textContent = '$' + (cashRelease / 1000000).toFixed(2) + 'M';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', updateScenario);
  });
  
  updateScenario();
});