const DEFAULTS = {
  accountCount: 1200,
  portfolioCrore: 820,
  rateShockBps: 100,
  aiEnabled: true,
  mix: {
    savings: 18,
    current: 22,
    fixed: 45,
    recurring: 15
  }
};

const ACCOUNT_TYPES = [
  {
    id: "savings",
    label: "Savings",
    rateRange: [3.0, 4.0],
    balanceFactor: 0.18,
    risk: "Low repricing risk, broad retail base"
  },
  {
    id: "current",
    label: "Current",
    rateRange: [0.1, 0.5],
    balanceFactor: 0.26,
    risk: "Operational liquidity but thin interest margin"
  },
  {
    id: "fixed",
    label: "Fixed Deposit",
    rateRange: [5.5, 7.0],
    balanceFactor: 0.42,
    risk: "Largest carry cost when rates shift upward"
  },
  {
    id: "recurring",
    label: "Recurring Deposit",
    rateRange: [5.0, 6.5],
    balanceFactor: 0.14,
    risk: "Moderate duration and steady contribution pattern"
  }
];

const state = {
  portfolio: [],
  summary: null
};

const elements = {
  accountCount: document.getElementById("accountCount"),
  portfolioCrore: document.getElementById("portfolioCrore"),
  rateShock: document.getElementById("rateShock"),
  rateShockValue: document.getElementById("rateShockValue"),
  aiToggle: document.getElementById("aiToggle"),
  mixInputs: {
    savings: document.getElementById("mixSavings"),
    current: document.getElementById("mixCurrent"),
    fixed: document.getElementById("mixFixed"),
    recurring: document.getElementById("mixRecurring")
  },
  mixLabels: {
    savings: document.getElementById("mixSavingsValue"),
    current: document.getElementById("mixCurrentValue"),
    fixed: document.getElementById("mixFixedValue"),
    recurring: document.getElementById("mixRecurringValue")
  },
  mixTotal: document.getElementById("mixTotal"),
  buildButton: document.getElementById("buildPortfolioBtn"),
  exportButton: document.getElementById("exportCsvBtn"),
  resetButton: document.getElementById("resetPortfolioBtn"),
  totalExposure: document.getElementById("totalExposure"),
  weightedRate: document.getElementById("weightedRate"),
  currentInterest: document.getElementById("currentInterest"),
  shockedInterest: document.getElementById("shockedInterest"),
  deltaInterest: document.getElementById("deltaInterest"),
  largestRisk: document.getElementById("largestRisk"),
  barChart: document.getElementById("exposureBars"),
  histogram: document.getElementById("rateHistogram"),
  tableBody: document.getElementById("accountTypeTable"),
  insight: document.getElementById("aiInsight"),
  modeStatus: document.getElementById("modeStatus")
};

function init() {
  applyDefaults();
  attachEvents();
  buildPortfolio();
}

function applyDefaults() {
  elements.accountCount.value = DEFAULTS.accountCount;
  elements.portfolioCrore.value = DEFAULTS.portfolioCrore;
  elements.rateShock.value = DEFAULTS.rateShockBps;
  elements.aiToggle.checked = DEFAULTS.aiEnabled;

  Object.entries(DEFAULTS.mix).forEach(([key, value]) => {
    elements.mixInputs[key].value = value;
  });

  syncLabels();
}

function attachEvents() {
  elements.rateShock.addEventListener("input", syncLabels);
  Object.values(elements.mixInputs).forEach((input) => {
    input.addEventListener("input", syncLabels);
  });

  elements.buildButton.addEventListener("click", buildPortfolio);
  elements.resetButton.addEventListener("click", () => {
    applyDefaults();
    buildPortfolio();
  });
  elements.exportButton.addEventListener("click", exportCsv);
  elements.aiToggle.addEventListener("change", updateInsight);
}

function syncLabels() {
  elements.rateShockValue.textContent = `${elements.rateShock.value} bps`;
  let total = 0;

  Object.entries(elements.mixInputs).forEach(([key, input]) => {
    const value = Number(input.value);
    total += value;
    elements.mixLabels[key].textContent = `${value}%`;
  });

  elements.mixTotal.textContent = `${total}%`;
  elements.mixTotal.className = total === 100 ? "status-badge" : "status-badge alert";
}

function normalizedMix() {
  const values = Object.fromEntries(
    Object.entries(elements.mixInputs).map(([key, input]) => [key, Number(input.value)])
  );
  const total = Object.values(values).reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return Object.fromEntries(Object.keys(values).map((key) => [key, 25]));
  }

  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value / total])
  );
}

function buildPortfolio() {
  syncLabels();

  const count = Number(elements.accountCount.value);
  const totalExposure = Number(elements.portfolioCrore.value) * 10000000;
  const shock = Number(elements.rateShock.value) / 10000;
  const mix = normalizedMix();

  let portfolio = [];

  ACCOUNT_TYPES.forEach((type) => {
    const typeAccounts = Math.max(1, Math.round(count * mix[type.id]));
    const typeExposure = totalExposure * mix[type.id];
    const averageBalance = typeExposure / typeAccounts;

    for (let i = 0; i < typeAccounts; i += 1) {
      const jitter = 0.72 + ((i % 9) * 0.07);
      const balance = averageBalance * jitter;
      const rateRange = type.rateRange[1] - type.rateRange[0];
      const rate = type.rateRange[0] + ((i * 17) % 100) / 100 * rateRange;

      portfolio.push({
        type: type.label,
        key: type.id,
        balance,
        rate
      });
    }
  });

  state.portfolio = portfolio;
  state.summary = summarizePortfolio(portfolio, shock);
  renderSummary();
}

function summarizePortfolio(portfolio, shock) {
  const byType = ACCOUNT_TYPES.map((type) => {
    const rows = portfolio.filter((row) => row.key === type.id);
    const exposure = rows.reduce((sum, row) => sum + row.balance, 0);
    const currentInterest = rows.reduce((sum, row) => sum + row.balance * row.rate / 100, 0);
    const shockedInterest = rows.reduce((sum, row) => sum + row.balance * (row.rate + shock * 100) / 100, 0);

    return {
      ...type,
      accounts: rows.length,
      exposure,
      currentInterest,
      shockedInterest,
      delta: shockedInterest - currentInterest,
      avgRate: rows.length ? currentInterest / exposure * 100 : 0
    };
  });

  const totalExposure = byType.reduce((sum, item) => sum + item.exposure, 0);
  const currentInterest = byType.reduce((sum, item) => sum + item.currentInterest, 0);
  const shockedInterest = byType.reduce((sum, item) => sum + item.shockedInterest, 0);
  const weightedRate = totalExposure ? currentInterest / totalExposure * 100 : 0;
  const largestRisk = byType.slice().sort((a, b) => b.delta - a.delta)[0];

  const histogram = buildHistogram(portfolio);

  return {
    byType,
    histogram,
    totalExposure,
    currentInterest,
    shockedInterest,
    deltaInterest: shockedInterest - currentInterest,
    weightedRate,
    largestRisk,
    shockBps: shock * 10000
  };
}

function buildHistogram(portfolio) {
  const bins = [
    { label: "0-1%", min: 0, max: 1 },
    { label: "1-3%", min: 1, max: 3 },
    { label: "3-5%", min: 3, max: 5 },
    { label: "5-6%", min: 5, max: 6 },
    { label: "6-7%", min: 6, max: 7.1 }
  ];

  bins.forEach((bin) => {
    bin.count = portfolio.filter((row) => row.rate >= bin.min && row.rate < bin.max).length;
  });

  const peak = Math.max(...bins.map((bin) => bin.count), 1);
  return bins.map((bin) => ({
    ...bin,
    pct: bin.count / peak * 100
  }));
}

function renderSummary() {
  const summary = state.summary;

  elements.totalExposure.textContent = formatCurrency(summary.totalExposure);
  elements.weightedRate.textContent = `${summary.weightedRate.toFixed(2)}%`;
  elements.currentInterest.textContent = formatCurrency(summary.currentInterest);
  elements.shockedInterest.textContent = formatCurrency(summary.shockedInterest);
  elements.deltaInterest.textContent = formatSignedCurrency(summary.deltaInterest);
  elements.deltaInterest.className = `metric-value ${summary.deltaInterest > 0 ? "alert" : "good"}`;
  elements.largestRisk.textContent = `${summary.largestRisk.label} (+${formatCurrency(summary.largestRisk.delta)})`;
  elements.modeStatus.textContent = `Browser variant active • ${summary.byType.reduce((sum, item) => sum + item.accounts, 0)} synthetic accounts generated locally`;

  elements.barChart.innerHTML = summary.byType.map((item) => `
    <div class="bar-row">
      <div class="bar-meta">
        <span>${item.label}</span>
        <span>${formatCurrency(item.exposure)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${item.exposure / summary.totalExposure * 100}%"></div>
      </div>
    </div>
  `).join("");

  elements.histogram.innerHTML = summary.histogram.map((bin) => `
    <div class="hist-row">
      <div class="hist-meta">
        <span>${bin.label}</span>
        <span>${bin.count} accts</span>
      </div>
      <div class="hist-track">
        <div class="hist-fill" style="width:${bin.pct}%"></div>
      </div>
    </div>
  `).join("");

  elements.tableBody.innerHTML = summary.byType.map((item) => `
    <tr>
      <td>${item.label}</td>
      <td>${item.accounts.toLocaleString()}</td>
      <td>${formatCurrency(item.exposure)}</td>
      <td>${item.avgRate.toFixed(2)}%</td>
      <td>${formatSignedCurrency(item.delta)}</td>
      <td>${item.risk}</td>
    </tr>
  `).join("");

  updateInsight();
}

function updateInsight() {
  if (!state.summary) return;

  const summary = state.summary;
  if (!elements.aiToggle.checked) {
    elements.insight.textContent = "AI interpretation is off. Use the exposure table and shock delta to explain which deposit category drives repricing risk.";
    return;
  }

  const shockDirection = Number(elements.rateShock.value) >= 0 ? "upward" : "downward";
  elements.insight.textContent =
    `${summary.largestRisk.label} is the main repricing pressure point in this browser scenario. ` +
    `A ${summary.shockBps.toFixed(0)} bps ${shockDirection} move changes annual interest by ${formatSignedCurrency(summary.deltaInterest)}, ` +
    `with the balance mix currently centered on ${summary.byType.slice().sort((a, b) => b.exposure - a.exposure)[0].label}.`;
}

function exportCsv() {
  if (!state.portfolio.length) return;

  const header = ["AccountType", "Balance", "InterestRate"];
  const rows = state.portfolio.map((row) => [
    row.type,
    row.balance.toFixed(2),
    row.rate.toFixed(2)
  ]);

  const csv = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "interest-rate-risk-browser-portfolio.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatSignedCurrency(value) {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${formatCurrency(Math.abs(value))}`;
}

document.addEventListener("DOMContentLoaded", init);
