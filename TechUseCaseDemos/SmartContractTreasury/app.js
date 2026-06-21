// Smart Contract Treasury Operations
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Smart Contract Treasury Operations - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Scenario definitions
const scenarios = {
  daily: { name: 'Daily Operations', txCount: 5, avgAmount: 25000 },
  monthly: { name: 'Monthly Settlement', txCount: 1, avgAmount: 150000 },
  quarterly: { name: 'Quarterly Treasury', txCount: 1, avgAmount: 500000 }
};

// DOM Elements
const scenarioSelect = document.getElementById('scenarioSelect');
const aiToggle = document.getElementById('aiToggle');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const executeBtn = document.getElementById('executeBtn');
const aiRecommendation = document.getElementById('aiRecommendation');
const transactionsList = document.getElementById('transactionsList');

const balanceEls = {
  USDC: document.getElementById('usdcBalance'),
  USDT: document.getElementById('usdtBalance'),
  DAI: document.getElementById('daiBalance')
};

let currentBalances = {};
let txCounter = 1001;
let txQueue = [];

// Initialize
function init() {
  scenarioSelect.addEventListener('change', updateScenario);
  aiToggle.addEventListener('change', updateAIInsights);
  resetBtn.addEventListener('click', resetValues);
  exportBtn.addEventListener('click', exportResults);
  executeBtn.addEventListener('click', submitTransaction);
  transactionsList.addEventListener('click', handleQueueAction);
  
  updateScenario();
}

function updateScenario() {
  const scenario = scenarioSelect.value;
  const scenarioData = scenarios[scenario];
  
  currentBalances = {
    USDC: scenarioData.name === 'Daily Operations' ? 2500000 : 3000000,
    USDT: scenarioData.name === 'Daily Operations' ? 1800000 : 2200000,
    DAI: scenarioData.name === 'Daily Operations' ? 950000 : 1200000
  };

  txQueue = [
    {
      id: `TX-${txCounter++}`,
      recipient: scenario === 'quarterly' ? 'Custody reserve rebalance' : 'MMF gateway rebalance',
      amount: scenarioData.avgAmount,
      token: 'USDC',
      status: 'pending'
    }
  ];

  renderBalances();
  renderTransactions();
  
  updateAIInsights();
}

function updateAIInsights() {
  if (!aiToggle.checked) {
    aiRecommendation.textContent = 'Enable AI Insights to see security recommendations.';
    return;
  }
  
  const scenario = scenarioSelect.value;
  
  const recommendations = {
    daily: 'Monitor transaction frequency. Consider batch processing to reduce gas costs and queue congestion.',
    monthly: 'Review monthly settlement patterns. Optimize timing for better exchange rates and settlement liquidity.',
    quarterly: 'Large quarterly transfers require additional security verification. Recommend multi-factor approval and treasury sign-off.',
    custom: 'Ensure all transactions follow treasury policies. AI monitors for anomalies.'
  };
  
  aiRecommendation.textContent = recommendations[scenario] || recommendations.custom;
}

function resetValues() {
  scenarioSelect.value = 'daily';
  document.getElementById('recipient').value = '';
  document.getElementById('amount').value = 50000;
  document.getElementById('token').value = 'USDC';
  updateScenario();
}

function exportResults() {
  const data = {
    scenario: scenarioSelect.value,
    balances: currentBalances,
    queue: txQueue,
    aiEnabled: aiToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'smart-contract-treasury-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

function renderBalances() {
  Object.entries(currentBalances).forEach(([token, balance]) => {
    balanceEls[token].textContent = '$' + balance.toLocaleString();
  });
}

function renderTransactions() {
  if (!txQueue.length) {
    transactionsList.innerHTML = '<article class="tx-item"><div class="tx-info"><span class="tx-recipient">No queued transactions</span></div><div class="tx-amount">Queue clear</div></article>';
    return;
  }

  transactionsList.innerHTML = txQueue.map(tx => `
    <article class="tx-item ${tx.status === 'pending' ? 'pending' : ''}">
      <div class="tx-info">
        <span class="tx-id">${tx.id}</span>
        <span class="tx-recipient">${tx.recipient}</span>
      </div>
      <div class="tx-amount">$${tx.amount.toLocaleString()} ${tx.token}</div>
      <div class="tx-actions">
        ${tx.status === 'pending'
          ? `<button class="btn-approve" data-action="approve" data-id="${tx.id}">Approve</button>
             <button class="btn-reject" data-action="reject" data-id="${tx.id}">Reject</button>`
          : `<span class="status-badge">${tx.status}</span>`}
      </div>
    </article>
  `).join('');
}

function submitTransaction() {
  const recipient = document.getElementById('recipient').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const token = document.getElementById('token').value;

  if (!recipient || !amount || amount <= 0) {
    aiRecommendation.textContent = 'Enter a recipient and a valid amount before submitting a transaction.';
    return;
  }

  if (amount > currentBalances[token]) {
    aiRecommendation.textContent = `Insufficient ${token} balance for this request. Reduce the amount or choose another token.`;
    return;
  }

  txQueue.unshift({
    id: `TX-${txCounter++}`,
    recipient,
    amount,
    token,
    status: 'pending'
  });

  document.getElementById('recipient').value = '';
  document.getElementById('amount').value = 50000;
  renderTransactions();
  aiRecommendation.textContent = `Transaction submitted to the approval queue. Review whether ${recipient} should clear immediately or require escalation.`;
}

function handleQueueAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  const tx = txQueue.find(item => item.id === id);
  if (!tx || tx.status !== 'pending') return;

  if (action === 'approve') {
    currentBalances[tx.token] -= tx.amount;
    tx.status = 'approved';
    renderBalances();
    aiRecommendation.textContent = `${tx.id} approved. Treasury balance updated and settlement risk reduced through logged control.`;
  } else if (action === 'reject') {
    tx.status = 'rejected';
    aiRecommendation.textContent = `${tx.id} rejected. Explain whether the block was due to policy, fraud concern, or liquidity preservation.`;
  }

  renderTransactions();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
