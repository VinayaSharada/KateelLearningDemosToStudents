// CCC Analyzer - Working Capital Optimization with Three Levers
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('CCC Analyzer - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// DOM Elements - Baseline Display
const salesDisplay = document.getElementById('salesDisplay');
const creditDisplay = document.getElementById('creditDisplay');
const cogsDisplay = document.getElementById('cogsDisplay');
const arDisplay = document.getElementById('arDisplay');
const invDisplay = document.getElementById('invDisplay');
const apDisplay = document.getElementById('apDisplay');

// DOM Elements - CCC Baseline
const dsoBaseline = document.getElementById('dsoBaseline');
const dioBaseline = document.getElementById('dioBaseline');
const dpoBaseline = document.getElementById('dpoBaseline');
const cccBaseline = document.getElementById('cccBaseline');

// DOM Elements - Current Values in Levers
const dsoCurrent = document.getElementById('dsoCurrent');
const dioCurrent = document.getElementById('dioCurrent');
const dpoCurrent = document.getElementById('dpoCurrent');

// DOM Elements - Inputs
const totalSalesEl = document.getElementById('totalSales');
const creditSalesEl = document.getElementById('creditSales');
const cogsEl = document.getElementById('cogs');
const arEl = document.getElementById('accountsReceivable');
const apEl = document.getElementById('accountsPayable');
const inventoryEl = document.getElementById('inventory');

// DOM Elements - Levers
const dsoLever = document.getElementById('dsoLever');
const dioLever = document.getElementById('dioLever');
const dpoLever = document.getElementById('dpoLever');
const dsoPct = document.getElementById('dsoPct');
const dioPct = document.getElementById('dioPct');
const dpoPct = document.getElementById('dpoPct');

// DOM Elements - Impact
const optimizedCcc = document.getElementById('optimizedCcc');
const cashRelease = document.getElementById('cashRelease');
const cccChange = document.getElementById('cccChange');
const costSaved = document.getElementById('costSaved');

// DOM Elements - Guidance & Risks
const aiToggle = document.getElementById('aiToggle');
const risksContainer = document.getElementById('risksContainer');
const guidanceBox = document.getElementById('guidanceBox');
const guidanceSection = document.getElementById('guidanceSection');

// DOM Elements - Actions
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');

// State
let baselineMetrics = {};

// Initialize
function init() {
  // Input listeners
  [totalSalesEl, creditSalesEl, cogsEl, arEl, apEl, inventoryEl].forEach(el => {
    el.addEventListener('input', updateAll);
  });

  // Lever listeners
  [dsoLever, dioLever, dpoLever].forEach(el => {
    el.addEventListener('input', updateAll);
  });

  // AI toggle
  aiToggle.addEventListener('change', updateAll);

  // Button listeners
  resetBtn.addEventListener('click', resetToDefaults);
  exportBtn.addEventListener('click', exportAnalysis);

  updateAll();
}

function updateAll() {
  updateBaseline();
  updateImpact();
  updateGuidance();
}

function updateBaseline() {
  const totalSales = parseFloat(totalSalesEl.value) || 100000000;
  const creditSales = parseFloat(creditSalesEl.value) || 80;
  const cogs = parseFloat(cogsEl.value) || 60000000;
  const ar = parseFloat(arEl.value) || 15000000;
  const ap = parseFloat(apEl.value) || 10000000;
  const inventory = parseFloat(inventoryEl.value) || 8000000;

  // Update display
  salesDisplay.textContent = '$' + (totalSales / 1000000).toFixed(1) + 'M';
  creditDisplay.textContent = creditSales + '%';
  cogsDisplay.textContent = '$' + (cogs / 1000000).toFixed(1) + 'M';
  arDisplay.textContent = '$' + (ar / 1000000).toFixed(1) + 'M';
  invDisplay.textContent = '$' + (inventory / 1000000).toFixed(1) + 'M';
  apDisplay.textContent = '$' + (ap / 1000000).toFixed(1) + 'M';

  // Calculate baseline metrics
  const creditSalesAmt = totalSales * creditSales / 100;
  const dso = creditSalesAmt > 0 ? (ar / creditSalesAmt) * 365 : 0;
  const dio = cogs > 0 ? (inventory / cogs) * 365 : 0;
  const dpo = cogs > 0 ? (ap / cogs) * 365 : 0;
  const ccc = dso + dio - dpo;

  baselineMetrics = { dso, dio, dpo, ccc, cogs };

  // Update baseline display
  dsoBaseline.textContent = dso.toFixed(1);
  dioBaseline.textContent = dio.toFixed(1);
  dpoBaseline.textContent = dpo.toFixed(1);
  cccBaseline.textContent = ccc.toFixed(1);

  // Update lever current values
  dsoCurrent.textContent = dso.toFixed(1) + ' days';
  dioCurrent.textContent = dio.toFixed(1) + ' days';
  dpoCurrent.textContent = dpo.toFixed(1) + ' days';
}

function updateImpact() {
  if (baselineMetrics.ccc === undefined || baselineMetrics.ccc === null) return;

  const dsoReduction = parseFloat(dsoLever.value) || 0;
  const dioReduction = parseFloat(dioLever.value) || 0;
  const dpoIncrease = parseFloat(dpoLever.value) || 0;

  // Update lever labels
  dsoPct.textContent = dsoReduction + '%';
  dioPct.textContent = dioReduction + '%';
  dpoPct.textContent = dpoIncrease + '%';

  // Calculate optimized metrics
  const optimizedDso = baselineMetrics.dso * (1 - dsoReduction / 100);
  const optimizedDio = baselineMetrics.dio * (1 - dioReduction / 100);
  const optimizedDpo = baselineMetrics.dpo * (1 + dpoIncrease / 100);
  const optimizedCccValue = optimizedDso + optimizedDio - optimizedDpo;

  // Calculate improvement
  const cccImprovement = baselineMetrics.ccc - optimizedCccValue;
  const daysSaved = Math.max(0, cccImprovement);

  // Calculate cash release
  const cashReleaseValue = (daysSaved / 365) * baselineMetrics.cogs;
  const carryCost = cashReleaseValue * 0.06; // 6% annual carrying cost

  // Update impact display
  optimizedCcc.textContent = Math.max(0, optimizedCccValue).toFixed(1) + ' days';
  cashRelease.textContent = '$' + (cashReleaseValue / 1000000).toFixed(1) + 'M';
  costSaved.textContent = '$' + (carryCost / 1000).toFixed(0) + 'K/year';

  // Update CCC change
  if (cccImprovement > 0) {
    cccChange.textContent = `↓ ${cccImprovement.toFixed(1)} days (better)`;
    cccChange.style.color = '#4ade80';
  } else if (cccImprovement < 0) {
    cccChange.textContent = `↑ ${Math.abs(cccImprovement).toFixed(1)} days (worse)`;
    cccChange.style.color = '#ef4444';
  } else {
    cccChange.textContent = 'No change';
    cccChange.style.color = '#94a3b8';
  }

  updateRisks(dsoReduction, dioReduction, dpoIncrease);
}

function updateRisks(dsoReduction, dioReduction, dpoIncrease) {
  const risks = [];

  if (dsoReduction > 0) {
    risks.push({
      title: 'Collection Speed Risk',
      text: 'Faster collections may reduce customer satisfaction or force stricter credit policies that lose business.'
    });
  }

  if (dioReduction > 0) {
    risks.push({
      title: 'Inventory Risk',
      text: 'Lower inventory increases stockout risk and reduces ability to respond to demand spikes.'
    });
  }

  if (dpoIncrease > 0) {
    risks.push({
      title: 'Supplier Risk',
      text: 'Extended payment terms may strain supplier relationships and reduce future credit access or discounts.'
    });
  }

  if (risks.length === 0) {
    risks.push({
      title: 'Baseline Position',
      text: 'No levers adjusted yet. Start by moving one slider to see the potential improvements and tradeoffs.'
    });
  }

  // Render risks
  risksContainer.innerHTML = risks.map(risk => `
    <div class="risk-item">
      <div class="risk-title">⚠️ ${risk.title}</div>
      <div class="risk-text">${risk.text}</div>
    </div>
  `).join('');
}

function updateGuidance() {
  if (!aiToggle.checked) {
    guidanceSection.style.display = 'none';
    return;
  }

  guidanceSection.style.display = 'block';

  const dsoReduction = parseFloat(dsoLever.value) || 0;
  const dioReduction = parseFloat(dioLever.value) || 0;
  const dpoIncrease = parseFloat(dpoLever.value) || 0;
  const totalAdjustment = dsoReduction + dioReduction + dpoIncrease;

  let guidance = '';

  if (totalAdjustment === 0) {
    guidance = '💡 <strong>Start somewhere:</strong> Try adjusting one lever to see how it affects your CCC. For example, move the DSO slider left to see the impact of faster collections.';
  } else if (dsoReduction > 15 || dioReduction > 15 || dpoIncrease > 15) {
    guidance = '⚡ <strong>Aggressive strategy:</strong> You\'re pushing hard on one lever. This can be effective but watch for operational friction. Consider balancing across all three levers for smoother implementation.';
  } else if (dsoReduction > 0 && dioReduction > 0 && dpoIncrease > 0) {
    guidance = '✅ <strong>Balanced approach:</strong> You\'re improving all three areas. This is realistic—most CFOs improve CCC by working on collections, inventory, and payables simultaneously. Sequence implementation by easiest win first.';
  } else if (dsoReduction > 0 && dpoIncrease > 0) {
    guidance = '📊 <strong>Classic strategy:</strong> Collecting faster AND extending payables is a common working capital play. Make sure supplier relationships can handle it—this is where cash improvement often stalls.';
  } else if (dioReduction > 0 && dpoIncrease > 0) {
    guidance = '🎯 <strong>Lean approach:</strong> Inventory reduction plus stretched payables is low-risk. Less friction with customers (no collections push) and you\'re building supplier partnerships.';
  } else if (dsoReduction > 0) {
    guidance = '⏱️ <strong>Collections focus:</strong> You\'re betting on collections improvement. This is fast (weeks/months) but customer-intensive. Pair with better credit policy, not just dunning.';
  } else if (dioReduction > 0) {
    guidance = '📦 <strong>Inventory focus:</strong> You\'re targeting inventory reduction. This is operational (weeks/months) but requires supply-chain partnership. JIT or forecast improvements are typical tactics.';
  } else if (dpoIncrease > 0) {
    guidance = '💼 <strong>Payables focus:</strong> You\'re extending payment terms. This is negotiation-driven (months) and can damage supplier goodwill if pushed too hard. Use for strategic suppliers, not commodities.';
  }

  guidanceBox.innerHTML = guidance;
}

function resetToDefaults() {
  totalSalesEl.value = 100000000;
  creditSalesEl.value = 80;
  cogsEl.value = 60000000;
  arEl.value = 15000000;
  apEl.value = 10000000;
  inventoryEl.value = 8000000;
  dsoLever.value = 0;
  dioLever.value = 0;
  dpoLever.value = 0;
  updateAll();
}

function exportAnalysis() {
  const dsoReduction = parseFloat(dsoLever.value) || 0;
  const dioReduction = parseFloat(dioLever.value) || 0;
  const dpoIncrease = parseFloat(dpoLever.value) || 0;

  const data = {
    baseline: baselineMetrics,
    adjustments: { dsoReduction, dioReduction, dpoIncrease },
    inputs: {
      totalSales: parseFloat(totalSalesEl.value),
      creditSales: parseFloat(creditSalesEl.value),
      cogs: parseFloat(cogsEl.value),
      ar: parseFloat(arEl.value),
      ap: parseFloat(apEl.value),
      inventory: parseFloat(inventoryEl.value)
    },
    results: {
      optimizedCcc: document.getElementById('optimizedCcc').textContent,
      cashRelease: document.getElementById('cashRelease').textContent,
      costSaved: document.getElementById('costSaved').textContent
    },
    timestamp: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ccc-analysis-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);
