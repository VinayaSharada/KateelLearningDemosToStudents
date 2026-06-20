(() => {
  'use strict';

  const DEFAULTS = {
    scenario: 'base',
    initialInvestment: 500,
    baseRevenue: 300,
    growthMean: 12,
    growthVol: 10,
    ebitdaMarginMean: 22,
    ebitdaMarginVol: 5,
    taxRate: 25,
    workingCapitalPct: 12,
    capexPct: 8,
    terminalGrowth: 3.5,
    wacc: 12,
    forecastYears: 5,
    simulations: 10000,
    randomSeed: 2026,
    confidenceLow: 10,
    confidenceHigh: 90,
    npvThreshold: 0,
    valuationThreshold: 600,
    minPositiveNpvProb: 70,
    aiToggle: true
  };

  const SCENARIOS = {
    base: {
      initialInvestment: 500,
      baseRevenue: 300,
      growthMean: 12,
      growthVol: 10,
      ebitdaMarginMean: 22,
      ebitdaMarginVol: 5,
      taxRate: 25,
      workingCapitalPct: 12,
      capexPct: 8,
      terminalGrowth: 3.5,
      wacc: 12,
      forecastYears: 5,
      simulations: 10000,
      confidenceLow: 10,
      confidenceHigh: 90,
      npvThreshold: 0,
      valuationThreshold: 600,
      minPositiveNpvProb: 70
    },
    aggressive: {
      initialInvestment: 520,
      baseRevenue: 320,
      growthMean: 18,
      growthVol: 14,
      ebitdaMarginMean: 25,
      ebitdaMarginVol: 6,
      taxRate: 25,
      workingCapitalPct: 13,
      capexPct: 9,
      terminalGrowth: 4,
      wacc: 12.5,
      forecastYears: 5,
      simulations: 10000,
      confidenceLow: 10,
      confidenceHigh: 90,
      npvThreshold: 0,
      valuationThreshold: 700,
      minPositiveNpvProb: 70
    },
    marginPressure: {
      initialInvestment: 500,
      baseRevenue: 300,
      growthMean: 8,
      growthVol: 12,
      ebitdaMarginMean: 15,
      ebitdaMarginVol: 8,
      taxRate: 25,
      workingCapitalPct: 14,
      capexPct: 8,
      terminalGrowth: 3,
      wacc: 13,
      forecastYears: 5,
      simulations: 10000,
      confidenceLow: 10,
      confidenceHigh: 90,
      npvThreshold: 0,
      valuationThreshold: 550,
      minPositiveNpvProb: 70
    },
    highRate: {
      initialInvestment: 500,
      baseRevenue: 300,
      growthMean: 10,
      growthVol: 10,
      ebitdaMarginMean: 21,
      ebitdaMarginVol: 5,
      taxRate: 25,
      workingCapitalPct: 12,
      capexPct: 8,
      terminalGrowth: 2.5,
      wacc: 16,
      forecastYears: 5,
      simulations: 10000,
      confidenceLow: 10,
      confidenceHigh: 90,
      npvThreshold: 0,
      valuationThreshold: 550,
      minPositiveNpvProb: 70
    },
    turnaround: {
      initialInvestment: 360,
      baseRevenue: 240,
      growthMean: 15,
      growthVol: 18,
      ebitdaMarginMean: 14,
      ebitdaMarginVol: 10,
      taxRate: 25,
      workingCapitalPct: 15,
      capexPct: 9,
      terminalGrowth: 3,
      wacc: 14,
      forecastYears: 5,
      simulations: 10000,
      confidenceLow: 10,
      confidenceHigh: 90,
      npvThreshold: 0,
      valuationThreshold: 450,
      minPositiveNpvProb: 60
    }
  };

  const FIELD_IDS = Object.keys(DEFAULTS).filter((key) => key !== 'aiToggle');

  const els = {};
  let lastResult = null;

  function $(id) {
    return document.getElementById(id);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function pctToDecimal(value) {
    return Number(value) / 100;
  }

  function mulberry32(seed) {
    let t = seed >>> 0;
    return function random() {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randn(random) {
    let u = 0;
    let v = 0;
    while (u === 0) u = random();
    while (v === 0) v = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function formatCrore(value, digits = 1) {
    if (!Number.isFinite(value)) return '₹0 cr';
    const sign = value < 0 ? '−' : '';
    return `${sign}₹${Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })} cr`;
  }

  function formatPct(value, digits = 1) {
    return `${value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })}%`;
  }

  function readParams() {
    const params = {};
    FIELD_IDS.forEach((id) => {
      params[id] = Number($(id).value);
    });
    params.aiToggle = $('aiToggle').checked;
    return params;
  }

  function writeParams(params) {
    Object.keys(params).forEach((key) => {
      const el = $(key);
      if (el) {
        if (el.type === 'checkbox') el.checked = Boolean(params[key]);
        else el.value = params[key];
      }
    });
  }

  function applyScenario() {
    const scenario = $('scenario').value;
    if (scenario !== 'custom' && SCENARIOS[scenario]) {
      writeParams(SCENARIOS[scenario]);
    }
    runSimulation();
  }

  function simulateOne(params, random) {
    const years = Math.round(clamp(params.forecastYears, 3, 7));
    const wacc = clamp(params.wacc, 0.01, 1);
    const terminalGrowth = Math.min(params.terminalGrowth, wacc - 0.005);
    const taxRate = clamp(pctToDecimal(params.taxRate), 0, 0.8);
    const wcPct = clamp(pctToDecimal(params.workingCapitalPct), 0, 1);
    const capexPct = clamp(pctToDecimal(params.capexPct), 0, 1);
    const growthMean = pctToDecimal(params.growthMean);
    const growthVol = pctToDecimal(params.growthVol);
    const marginMean = clamp(pctToDecimal(params.ebitdaMarginMean), 0.01, 0.8);
    const marginVol = pctToDecimal(params.ebitdaMarginVol);

    let revenue = params.baseRevenue;
    let previousRevenue = revenue;
    let enterpriseValue = 0;
    const path = [];

    for (let year = 1; year <= years; year += 1) {
      const growth = growthMean + randn(random) * growthVol;
      const margin = clamp(marginMean + randn(random) * marginVol, 0.01, 0.8);
      revenue = Math.max(0, revenue * (1 + growth));
      const ebitda = revenue * margin;
      const tax = Math.max(0, ebitda * taxRate);
      const capex = revenue * capexPct;
      const nwcInvestment = (revenue - previousRevenue) * wcPct;
      const fcf = ebitda - tax - capex - nwcInvestment;
      const discountFactor = Math.pow(1 + wacc, year);
      enterpriseValue += fcf / discountFactor;

      if (year === years) {
        const terminalValue = Math.max(0, fcf * (1 + terminalGrowth) / Math.max(0.005, wacc - terminalGrowth));
        enterpriseValue += terminalValue / discountFactor;
      }

      path.push({
        year,
        revenue,
        ebitda,
        tax,
        capex,
        nwcInvestment,
        fcf
      });
      previousRevenue = revenue;
    }

    const npv = enterpriseValue - params.initialInvestment;
    return { enterpriseValue, npv, path };
  }

  function summarize(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = values.reduce((sum, value) => sum + value, 0) / n;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const percentile = (p) => {
      const index = clamp((p / 100) * (n - 1), 0, n - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      if (lower === upper) return sorted[lower];
      return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
    };
    return {
      mean,
      median,
      std: Math.sqrt(variance),
      min: sorted[0],
      max: sorted[n - 1],
      p10: percentile(10),
      p90: percentile(90),
      percentile
    };
  }

  function averagePath(paths, years) {
    const totals = Array.from({ length: years }, () => ({
      year: 0,
      revenue: 0,
      ebitda: 0,
      tax: 0,
      capex: 0,
      nwcInvestment: 0,
      fcf: 0
    }));
    paths.forEach((path) => {
      path.forEach((row, index) => {
        totals[index].year = row.year;
        Object.keys(row).forEach((key) => {
          if (key !== 'year') totals[index][key] += row[key];
        });
      });
    });
    return totals.map((row) => {
      const divisor = paths.length || 1;
      return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, key === 'year' ? value : value / divisor]));
    });
  }

  function drawChart(npvs, stats, params) {
    const canvas = $('distributionChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const pad = { left: 64, right: 28, top: 28, bottom: 48 };
    const min = Math.min(stats.min, stats.percentile(params.confidenceLow), stats.mean, params.npvThreshold);
    const max = Math.max(stats.max, stats.percentile(params.confidenceHigh), stats.mean, params.npvThreshold);
    const range = max - min || 1;
    const xFor = (value) => pad.left + ((value - min) / range) * (width - pad.left - pad.right);
    const yFor = (count, maxCount) => height - pad.bottom - (count / maxCount) * (height - pad.top - pad.bottom);

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = pad.top + (i / 4) * (height - pad.top - pad.bottom);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
    }

    const bins = 42;
    const counts = new Array(bins).fill(0);
    npvs.forEach((value) => {
      const bin = clamp(Math.floor(((value - min) / range) * bins), 0, bins - 1);
      counts[bin] += 1;
    });
    const maxCount = Math.max(...counts, 1);

    const gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.88)');
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0.62)');
    ctx.fillStyle = gradient;

    counts.forEach((count, index) => {
      const x0 = xFor(min + (index / bins) * range);
      const x1 = xFor(min + ((index + 1) / bins) * range);
      const y = yFor(count, maxCount);
      ctx.fillRect(x0, y, Math.max(1, x1 - x0 - 1), height - pad.bottom - y);
    });

    const lines = [
      { value: stats.mean, label: 'Mean', color: '#34d399' },
      { value: params.npvThreshold, label: 'Threshold', color: '#fb7185' },
      { value: stats.percentile(params.confidenceLow), label: `${params.confidenceLow}%`, color: '#38bdf8' },
      { value: stats.percentile(params.confidenceHigh), label: `${params.confidenceHigh}%`, color: '#a78bfa' }
    ];

    lines.forEach((line) => {
      const x = xFor(line.value);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, height - pad.bottom);
      ctx.stroke();
      ctx.fillStyle = line.color;
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(line.label, Math.min(x + 4, width - 70), pad.top + 14);
    });

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(formatCrore(min, 0), pad.left, height - 16);
    ctx.fillText(formatCrore(max, 0), width - pad.right - 70, height - 16);
    ctx.fillText('NPV distribution across Monte Carlo simulations', pad.left, 18);
  }

  function renderStats(stats, enterpriseStats, params) {
    $('meanEnterpriseValue').textContent = formatCrore(enterpriseStats.mean);
    $('meanEnterpriseValueSub').textContent = `P${params.confidenceLow}-${params.confidenceHigh}: ${formatCrore(enterpriseStats.percentile(params.confidenceLow))} to ${formatCrore(enterpriseStats.percentile(params.confidenceHigh))}`;
    $('meanNpv').textContent = formatCrore(stats.mean);
    $('probNpvPositive').textContent = formatPct(lastResult.probNpvAboveThreshold, 1);
    $('probValueAboveThreshold').textContent = formatPct(lastResult.probValueAboveThreshold, 1);
    $('stdDeviation').textContent = formatCrore(stats.std);
    $('cvRatio').textContent = Number.isFinite(stats.mean) && Math.abs(stats.mean) > 0.0001 ? (stats.std / Math.abs(stats.mean)).toFixed(2) : '0.00';

    $('statsTable').innerHTML = `
      <tr><td>Mean NPV</td><td>${formatCrore(stats.mean)}</td></tr>
      <tr><td>Median NPV</td><td>${formatCrore(stats.median)}</td></tr>
      <tr><td>P${params.confidenceLow} / P${params.confidenceHigh} NPV</td><td>${formatCrore(stats.percentile(params.confidenceLow))} / ${formatCrore(stats.percentile(params.confidenceHigh))}</td></tr>
      <tr><td>Minimum / Maximum NPV</td><td>${formatCrore(stats.min)} / ${formatCrore(stats.max)}</td></tr>
      <tr><td>Enterprise value P${params.confidenceLow} / P${params.confidenceHigh}</td><td>${formatCrore(enterpriseStats.percentile(params.confidenceLow))} / ${formatCrore(enterpriseStats.percentile(params.confidenceHigh))}</td></tr>
    `;
  }

  function renderPath(path) {
    $('yearTable').innerHTML = path.map((row) => `
      <tr>
        <td>${row.year}</td>
        <td>${formatCrore(row.revenue)}</td>
        <td>${formatCrore(row.ebitda)}</td>
        <td>${formatCrore(row.tax)}</td>
        <td>${formatCrore(row.capex)}</td>
        <td>${formatCrore(row.nwcInvestment)}</td>
        <td>${formatCrore(row.fcf)}</td>
      </tr>
    `).join('');
  }

  function renderInsights(stats, enterpriseStats, params) {
    const panel = $('aiInsightsPanel');
    panel.style.display = params.aiToggle ? 'block' : 'none';
    if (!params.aiToggle) return;

    const prob = lastResult.probNpvAboveThreshold;
    const cv = Number($('cvRatio').textContent);
    const terminalAdjusted = params.terminalGrowth >= params.wacc;
    const insights = [];

    if (stats.mean > params.npvThreshold && prob >= params.minPositiveNpvProb) {
      insights.push(`<p class="success"><strong>Value-creation signal:</strong> Mean NPV is positive and the probability of exceeding the NPV threshold is ${formatPct(prob, 1)}, above the minimum acceptable probability of ${formatPct(params.minPositiveNpvProb, 0)}.</p>`);
    } else if (stats.mean > params.npvThreshold && prob < params.minPositiveNpvProb) {
      insights.push(`<p class="warning"><strong>Mixed signal:</strong> Average NPV is positive, but downside scenarios are frequent enough that the probability of value creation is below the class threshold.</p>`);
    } else {
      insights.push(`<p class="warning"><strong>Caution:</strong> Mean NPV is not above the threshold. Students should discuss whether price, growth, margin, or WACC assumptions must improve before proceeding.</p>`);
    }

    if (cv > 1.5) {
      insights.push(`<p class="warning"><strong>High dispersion:</strong> The coefficient of variation is ${cv.toFixed(2)}, so the valuation is highly sensitive to assumptions. Use this as a risk discussion, not a single-point answer.</p>`);
    } else {
      insights.push(`<p><strong>Dispersion check:</strong> The coefficient of variation is ${cv.toFixed(2)}, suggesting the simulated valuation is comparatively stable under the current assumptions.</p>`);
    }

    if (terminalAdjusted) {
      insights.push(`<p class="warning"><strong>Model guardrail:</strong> Terminal growth was automatically capped below WACC to avoid an unstable terminal value formula.</p>`);
    }

    insights.push(`<p><strong>Teaching prompt:</strong> Ask students to recommend proceed / renegotiate / reject and identify the one assumption they would investigate first before making the investment decision.</p>`);

    $('aiInsights').innerHTML = insights.join('');
  }

  function runSimulation() {
    const params = readParams();
    const simulations = Math.round(clamp(params.simulations, 100, 100000));
    const years = Math.round(clamp(params.forecastYears, 3, 7));
    const random = mulberry32(Math.round(params.randomSeed));
    const npvs = new Array(simulations);
    const enterpriseValues = new Array(simulations);
    const samplePaths = [];
    const sampleEvery = Math.max(1, Math.floor(simulations / 250));

    for (let i = 0; i < simulations; i += 1) {
      const result = simulateOne(params, random);
      npvs[i] = result.npv;
      enterpriseValues[i] = result.enterpriseValue;
      if (i % sampleEvery === 0) samplePaths.push(result.path);
    }

    const npvStats = summarize(npvs);
    const enterpriseStats = summarize(enterpriseValues);
    const probNpvAboveThreshold = npvs.filter((value) => value > params.npvThreshold).length / simulations * 100;
    const probValueAboveThreshold = enterpriseValues.filter((value) => value > params.valuationThreshold).length / simulations * 100;
    const averagePathRows = averagePath(samplePaths, years);

    lastResult = {
      params,
      simulations,
      years,
      npvs,
      enterpriseValues,
      npvStats,
      enterpriseStats,
      probNpvAboveThreshold,
      probValueAboveThreshold,
      averagePathRows,
      generatedAt: new Date().toISOString()
    };

    renderStats(npvStats, enterpriseStats, params);
    renderPath(averagePathRows);
    renderInsights(npvStats, enterpriseStats, params);
    drawChart(npvs, npvStats, params);
  }

  function exportJson() {
    if (!lastResult) runSimulation();
    const payload = {
      demo: 'Monte Carlo Company Valuation',
      attribution: 'vinallcontact@gmail.com',
      generatedAt: lastResult.generatedAt,
      params: lastResult.params,
      simulations: lastResult.simulations,
      forecastYears: lastResult.years,
      stats: {
        meanEnterpriseValue: lastResult.enterpriseStats.mean,
        meanNpv: lastResult.npvStats.mean,
        medianNpv: lastResult.npvStats.median,
        stdNpv: lastResult.npvStats.std,
        pLowNpv: lastResult.npvStats.percentile(lastResult.params.confidenceLow),
        pHighNpv: lastResult.npvStats.percentile(lastResult.params.confidenceHigh),
        probabilityNpvAboveThreshold: lastResult.probNpvAboveThreshold,
        probabilityValueAboveThreshold: lastResult.probValueAboveThreshold
      },
      averagePath: lastResult.averagePathRows
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monte-carlo-company-valuation.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportCsv() {
    if (!lastResult) runSimulation();
    const rows = [
      ['metric', 'value'],
      ['demo', 'Monte Carlo Company Valuation'],
      ['attribution', 'vinallcontact@gmail.com'],
      ['generatedAt', lastResult.generatedAt],
      ['simulations', lastResult.simulations],
      ['forecastYears', lastResult.years],
      ['meanEnterpriseValue', lastResult.enterpriseStats.mean.toFixed(4)],
      ['meanNpv', lastResult.npvStats.mean.toFixed(4)],
      ['medianNpv', lastResult.npvStats.median.toFixed(4)],
      ['stdNpv', lastResult.npvStats.std.toFixed(4)],
      [`p${lastResult.params.confidenceLow}Npv`, lastResult.npvStats.percentile(lastResult.params.confidenceLow).toFixed(4)],
      [`p${lastResult.params.confidenceHigh}Npv`, lastResult.npvStats.percentile(lastResult.params.confidenceHigh).toFixed(4)],
      ['probabilityNpvAboveThreshold', lastResult.probNpvAboveThreshold.toFixed(4)],
      ['probabilityValueAboveThreshold', lastResult.probValueAboveThreshold.toFixed(4)],
      [],
      ['year', 'avgRevenue', 'avgEbitda', 'avgTax', 'avgCapex', 'avgNwcInvestment', 'avgFcf']
    ];
    lastResult.averagePathRows.forEach((row) => {
      rows.push([
        row.year,
        row.revenue.toFixed(4),
        row.ebitda.toFixed(4),
        row.tax.toFixed(4),
        row.capex.toFixed(4),
        row.nwcInvestment.toFixed(4),
        row.fcf.toFixed(4)
      ]);
    });
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monte-carlo-company-valuation.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function bindEvents() {
    FIELD_IDS.forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.addEventListener('input', runSimulation);
      el.addEventListener('change', runSimulation);
    });
    $('scenario').addEventListener('change', applyScenario);
    $('resetBtn').addEventListener('click', () => {
      writeParams(DEFAULTS);
      $('scenario').value = 'base';
      runSimulation();
    });
    $('runBtn').addEventListener('click', runSimulation);
    $('exportJsonBtn').addEventListener('click', exportJson);
    $('exportCsvBtn').addEventListener('click', exportCsv);
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    runSimulation();
  });
})();
