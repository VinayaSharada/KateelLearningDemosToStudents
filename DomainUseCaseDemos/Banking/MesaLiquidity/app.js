// Mesa Liquidity Data Generator - Browser-based synthetic financial data
// Author: vinallcontact@gmail.com

class MesaLiquidityGenerator {
  constructor() {
    this.customers = [];
    this.accounts = [];
    this.transactions = [];
    this.metrics = [];
    this.aiEnabled = false;
    this.charts = {};
    this.init();
  }

  init() {
    const self = this;
    document.getElementById('numCustomers').addEventListener('input', function(e) {
      document.getElementById('customersDisplay').textContent = e.target.value;
    });
    
    document.getElementById('numTransactions').addEventListener('input', function(e) {
      document.getElementById('transactionsDisplay').textContent = e.target.value;
    });

    document.getElementById('aiToggle').addEventListener('change', function(e) {
      self.aiEnabled = e.target.checked;
      self.updateAIInsights();
    });

    document.querySelectorAll('.tab').forEach(function(tab) {
      tab.addEventListener('click', function() { self.switchTab(tab.dataset.tab); });
    });

    this.updateAIInsights();
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelector('.tab[data-tab="' + tabName + '"]').classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
    document.getElementById(tabName + '-tab').classList.add('active');
    
    if (tabName === 'customers' && this.customers.length > 0) {
      this.renderSegmentChart();
    } else if (tabName === 'metrics' && this.metrics.length > 0) {
      this.renderRiskChart();
    }
  }

  generateData() {
    var numCustomers = parseInt(document.getElementById('numCustomers').value);
    var numTransactions = parseInt(document.getElementById('numTransactions').value);
    
    this.customers = this.generateCustomers(numCustomers);
    this.accounts = this.generateAccounts(this.customers);
    this.transactions = this.generateTransactions(this.accounts, numTransactions);
    this.metrics = this.generateLiquidityMetrics(this.accounts, this.transactions);
    
    this.updateKPIs();
    this.updateTables();
    this.updateAIInsights();
  }

  generateCustomers(count) {
    var customers = [];
    var segments = ['retail', 'corporate', 'sme', 'hni'];
    var segmentWeights = [0.6, 0.2, 0.15, 0.05];
    var i, segment, j;
    
    for (i = 0; i < count; i++) {
      segment = this.weightedRandom(segments, segmentWeights);
      customers.push({
        customer_id: 'CUST_' + String(i + 1).padStart(6, '0'),
        name: this.fakeName(),
        segment: segment,
        annual_income: this.logNormal(11, 0.8),
        risk_score: Math.max(300, Math.min(850, this.normal(500, 100))),
        kyc_status: Math.random() < 0.85 ? 'verified' : (Math.random() < 0.95 ? 'pending' : 'incomplete'),
        is_active: Math.random() < 0.9
      });
    }
    return customers;
  }

  generateAccounts(customers) {
    var accounts = [];
    var accountTypes = ['savings', 'current', 'fixed_deposit', 'loan', 'credit_card'];
    var currencies = ['INR', 'USD', 'EUR', 'GBP'];
    var currencyWeights = [0.8, 0.1, 0.05, 0.05];
    var segmentMultiplier, multiplier, numAccounts, accountType, minBal, maxBal;
    var accountCounter = 1;
    var i, j;

    for (i = 0; i < customers.length; i++) {
      segmentMultiplier = { retail: 1, sme: 2, corporate: 3, hni: 4 };
      multiplier = segmentMultiplier[customers[i].segment] || 1;
      numAccounts = Math.max(1, Math.min(6, Math.round(this.poisson(2 * multiplier)));

      for (j = 0; j < numAccounts; j++) {
        accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
        minBal = this.getMinBalance(accountType);
        maxBal = this.getMaxBalance(accountType);
        
        accounts.push({
          account_id: 'ACC_' + String(accountCounter).padStart(8, '0'),
          customer_id: customers[i].customer_id,
          account_type: accountType,
          currency: this.weightedRandom(currencies, currencyWeights),
          current_balance: this.uniform(minBal, maxBal),
          is_active: Math.random() < 0.95
        });
        accountCounter++;
      }
    }
    return accounts;
  }

  generateTransactions(accounts, count) {
    var transactions = [];
    var txnTypes = ['deposit', 'withdrawal', 'transfer', 'payment', 'interest'];
    var channels = ['atm', 'branch', 'online', 'mobile', 'pos'];
    var activeAccounts = accounts.filter(function(a) { return a.is_active; });
    var account, txnType;
    var i;

    for (i = 0; i < count; i++) {
      account = activeAccounts[Math.floor(Math.random() * activeAccounts.length)];
      txnType = txnTypes[Math.floor(Math.random() * txnTypes.length)];
      
      transactions.push({
        transaction_id: 'TXN_' + String(i + 1).padStart(10, '0'),
        account_id: account.account_id,
        transaction_type: txnType,
        transaction_date: this.randomDate(),
        amount: this.uniform(100, 50000),
        currency: account.currency,
        channel: channels[Math.floor(Math.random() * channels.length)],
        status: Math.random() < 0.9 ? 'completed' : (Math.random() < 0.95 ? 'pending' : 'failed')
      });
    }
    
    transactions.sort(function(a, b) { return new Date(a.transaction_date) - new Date(b.transaction_date); });
    return transactions;
  }

  generateLiquidityMetrics(accounts, transactions) {
    var self = this;
    return accounts.map(function(account) {
      var accountTxns = transactions.filter(function(t) { return t.account_id === account.account_id; });
      
      return {
        account_id: account.account_id,
        current_balance: account.current_balance,
        available_balance: account.current_balance * (0.9 + Math.random() * 0.1),
        avg_daily_balance: account.current_balance,
        transaction_velocity: accountTxns.length / 90,
        liquidity_ratio: (account.current_balance * 0.95) / account.current_balance,
        liquidity_risk_score: self.normal(50, 15),
        stress_test_survival_days: self.uniform(30, 180)
      };
    });
  }

  updateKPIs() {
    var avgBalance, avgRatio, avgVelocity;
    
    document.getElementById('customersCount').textContent = this.customers.length;
    document.getElementById('accountsCount').textContent = this.accounts.length;
    document.getElementById('transactionsCount').textContent = this.transactions.length;
    document.getElementById('totalValue').textContent = '₹' + this.transactions.reduce((s, t) => s + t.amount, 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
    
    avgBalance = this.metrics.reduce((s, m) => s + m.avg_daily_balance, 0) / this.metrics.length;
    avgRatio = this.metrics.reduce((s, m) => s + m.liquidity_ratio, 0) / this.metrics.length;
    avgVelocity = this.metrics.reduce((s, m) => s + m.transaction_velocity, 0) / this.metrics.length;
    
    document.getElementById('avgBalance').textContent = '₹' + Math.round(avgBalance).toLocaleString();
    document.getElementById('liquidityRatio').textContent = Math.round(avgRatio * 100) + '%';
    document.getElementById('velocity').textContent = avgVelocity.toFixed(2);
  }

  updateTables() {
    var custTbody = document.querySelector('#customersTable tbody');
    custTbody.innerHTML = this.customers.slice(0, 100).map(function(c) { 
      return '<tr><td>' + c.customer_id + '</td><td>' + c.name + '</td><td>' + c.segment + '</td><td>₹' + Math.round(c.annual_income).toLocaleString() + '</td><td>' + c.kyc_status + '</td></tr>';
    }).join('');

    var acctTbody = document.querySelector('#accountsTable tbody');
    acctTbody.innerHTML = this.accounts.slice(0, 100).map(function(a) { 
      return '<tr><td>' + a.account_id + '</td><td>' + a.account_type + '</td><td>' + a.currency + '</td><td>₹' + Math.round(a.current_balance).toLocaleString() + '</td><td>₹' + Math.round(a.current_balance * 0.95).toLocaleString() + '</td></tr>';
    }).join('');

    var txnTbody = document.querySelector('#transactionsTable tbody');
    txnTbody.innerHTML = this.transactions.slice(0, 100).map(function(t) { 
      return '<tr><td>' + t.transaction_id + '</td><td>' + t.transaction_type + '</td><td>₹' + Math.round(t.amount).toLocaleString() + '</td><td>' + t.channel + '</td><td>' + t.status + '</td></tr>';
    }).join('');

    var mtrcTbody = document.querySelector('#metricsTable tbody');
    mtrcTbody.innerHTML = this.metrics.slice(0, 100).map(function(m) { 
      return '<tr><td>' + m.account_id + '</td><td>' + Math.round(m.liquidity_ratio * 100) + '%</td><td>' + Math.round(m.liquidity_risk_score) + '</td><td>' + Math.round(m.stress_test_survival_days) + '</td></tr>';
    }).join('');
  }

  renderSegmentChart() {
    var segmentCounts = {};
    this.customers.forEach(function(c) {
      segmentCounts[c.segment] = (segmentCounts[c.segment] || 0) + 1;
    });

    if (this.charts.segment) this.charts.segment.destroy();

    this.charts.segment = new Chart(document.getElementById('segmentChart'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(segmentCounts),
        datasets: [{
          data: Object.values(segmentCounts),
          backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#e2e8f0' } } }
      }
    });
  }

  renderRiskChart() {
    var riskBins = { low: 0, medium: 0, high: 0 };
    this.metrics.forEach(function(m) {
      if (m.liquidity_risk_score < 35) riskBins.low++;
      else if (m.liquidity_risk_score < 65) riskBins.medium++;
      else riskBins.high++;
    });

    if (this.charts.risk) this.charts.risk.destroy();

    this.charts.risk = new Chart(document.getElementById('riskChart'), {
      type: 'bar',
      data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [{
          label: 'Accounts',
          data: [riskBins.low, riskBins.medium, riskBins.high],
          backgroundColor: ['#10b981', '#fbbf24', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } } },
        plugins: { legend: { display: false } }
      }
    });
  }

  updateAIInsights() {
    var aiInsightEl = document.getElementById('aiInsight');
    var recommendationEl = document.getElementById('recommendationText');

    if (!this.aiEnabled || this.customers.length === 0) {
      aiInsightEl.style.display = 'none';
      return;
    }

    aiInsightEl.style.display = 'block';

    var highRiskCount = this.metrics.filter(function(m) { return m.liquidity_risk_score > 65; }).length;
    var highRiskPct = (highRiskCount / this.metrics.length * 100).toFixed(1);
    
    var recommendations = [
      'AI Analysis: ' + highRiskPct + '% of accounts show high liquidity risk. Focus on corporate and HNI segments.',
      'Recommendation: Implement dynamic cash pooling for high-velocity accounts to optimize liquidity.',
      'Insight: Consider sweep accounts for savings accounts to automatically invest surplus funds.',
      'Alert: Monitor credit card accounts closely - they show highest transaction volatility.'
    ];

    recommendationEl.textContent = recommendations[Math.floor(Math.random() * recommendations.length)];
  }

  runMonteCarlo() {
    if (this.transactions.length === 0) {
      alert('Please generate data first before running Monte Carlo simulation.');
      return;
    }

    var initialCash = 15000000;
    var numSimulations = 100;
    var forecastDays = 30;
    var dailyFlows = {};
    var flows, meanFlow, stdFlow;
    var simResults = [];
    var sim, day, cash;

    this.transactions.forEach(function(t) {
      var date = t.transaction_date.split('T')[0];
      dailyFlows[date] = (dailyFlows[date] || 0) + (t.transaction_type === 'deposit' ? t.amount : -t.amount);
    });

    flows = Object.values(dailyFlows);
    meanFlow = flows.reduce((s, v) => s + v, 0) / flows.length;
    stdFlow = Math.sqrt(flows.reduce((s, v) => s + Math.pow(v - meanFlow, 2), 0) / flows.length);

    for (sim = 0; sim < numSimulations; sim++) {
      cash = initialCash;
      for (day = 0; day < forecastDays; day++) {
        cash += this.normal(meanFlow, stdFlow);
      }
      simResults.push(cash);
    }

    var var5 = this.percentile(simResults, 5);
    var var95 = this.percentile(simResults, 95);
    var meanFinal = simResults.reduce((s, v) => s + v, 0) / simResults.length;

    alert('📊 Monte Carlo Forecast (30 days):\nMean final cash: ₹' + Math.round(meanFinal).toLocaleString() + '\n5% VaR (worst case): ₹' + Math.round(var5).toLocaleString() + '\n95% confidence: ₹' + Math.round(var95).toLocaleString() + '\n\nAI Suggestion: Maintain minimum buffer of ₹' + Math.round(initialCash - var5).toLocaleString() + ' for crisis scenarios.');
  }

  exportData() {
    if (this.customers.length === 0) {
      alert('Please generate data first.');
      return;
    }

    var csv = '=== CUSTOMERS ===\n';
    csv += ['customer_id', 'name', 'segment', 'annual_income', 'risk_score', 'kyc_status', 'is_active'].join(',') + '\n';
    csv += this.customers.map(function(c) { 
      return [c.customer_id, c.name, c.segment, c.annual_income, c.risk_score, c.kyc_status, c.is_active].join(',');
    }).join('\n');
    csv += '\n\n=== ACCOUNTS ===\n';
    csv += ['account_id', 'customer_id', 'account_type', 'currency', 'current_balance', 'is_active'].join(',') + '\n';
    csv += this.accounts.map(function(a) { 
      return [a.account_id, a.customer_id, a.account_type, a.currency, a.current_balance, a.is_active].join(',');
    }).join('\n');

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'mesa_liquidity_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  weightedRandom(items, weights) {
    var total = weights.reduce((s, w) => s + w, 0);
    var r = Math.random() * total;
    var i;
    for (i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  normal(mean, std) {
    var u1 = Math.random();
    var u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * std + mean;
  }

  logNormal(mean, std) {
    var normal = this.normal(mean, std);
    return Math.exp(normal);
  }

  poisson(lambda) {
    var L = Math.exp(-lambda);
    var k = 0;
    var p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
  }

  uniform(min, max) {
    return Math.random() * (max - min) + min;
  }

  randomDate() {
    var start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    var end = new Date();
    return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
  }

  percentile(arr, p) {
    var sorted = arr.slice().sort((a, b) => a - b);
    return sorted[Math.floor(p / 100 * (sorted.length - 1))];
  }

  fakeName() {
    var first = ['Raj', 'Priya', 'Amit', 'Neha', 'Suresh', 'Kavita', 'Rohan', 'Anita', 'Vikram', 'Pooja'];
    var last = ['Sharma', 'Patel', 'Kumar', 'Desai', 'Reddy', 'Menon', 'Singh', 'Iyer', 'Gupta', 'Mehta'];
    return first[Math.floor(Math.random() * first.length)] + ' ' + last[Math.floor(Math.random() * last.length)];
  }

  getMinBalance(type) {
    var ranges = { savings: 1000, current: 5000, fixed_deposit: 10000, loan: -1000000, credit_card: -100000 };
    return ranges[type] || 1000;
  }

  getMaxBalance(type) {
    var ranges = { savings: 500000, current: 10000000, fixed_deposit: 5000000, loan: -10000, credit_card: 50000 };
    return ranges[type] || 100000;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  window.mesaApp = new MesaLiquidityGenerator();
});

function generateData() { window.mesaApp.generateData(); }
function resetData() { location.reload(); }
function runMonteCarlo() { window.mesaApp.runMonteCarlo(); }
function exportData() { window.mesaApp.exportData(); }