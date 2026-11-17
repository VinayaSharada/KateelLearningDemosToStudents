// DISCOM AT&C Loss & Smart Meter Anomaly Analytics Engine
let allDTRs = [];
let currentFeeder = 'all';
let technicalR = 1.0; // Multiplier
let powerFactor = 0.92;
let theftRate = 15; // Percent
let aiSensitivity = 0.75; // 0 to 1

// DOM Elements
const feederSelect = document.getElementById('feederSelect');
const rSlider = document.getElementById('rSlider');
const rVal = document.getElementById('rVal');
const pfSlider = document.getElementById('pfSlider');
const pfVal = document.getElementById('pfVal');
const theftSlider = document.getElementById('theftSlider');
const theftVal = document.getElementById('theftVal');
const sensSlider = document.getElementById('sensSlider');
const sensVal = document.getElementById('sensVal');

const btnSimulate = document.getElementById('btnSimulate');
const btnTheft = document.getElementById('btnTheft');
const btnTriage = document.getElementById('btnTriage');
const btnReset = document.getElementById('btnReset');
const btnExport = document.getElementById('btnExport');

const dtrGrid = document.getElementById('dtrGrid');
const auditTableBody = document.getElementById('auditTableBody');
const energyCanvas = document.getElementById('energyCanvas');

// Load Data
async function init() {
  try {
    const res = await fetch('synthetic_feeder_data.json');
    allDTRs = await res.json();
  } catch (e) {
    console.error("Failed to load local JSON, using fallback dataset", e);
    allDTRs = generateFallbackData();
  }
  setupEvents();
  recalculate();
}

function generateFallbackData() {
  const arr = [];
  const feeders = ["Feeder-11kV-NorthUrban", "Feeder-11kV-IndustrialEast", "Feeder-11kV-AgriSouth"];
  for (let i = 1; i <= 30; i++) {
    arr.push({
      dtr_id: `DTR-${String(i).padStart(3, '0')}`,
      feeder: feeders[(i - 1) % 3],
      capacity_kva: 250,
      input_kwh: 55000 + (i * 800),
      billed_kwh: 50000 + (i * 700),
      line_resistance_ohms: 0.8 + (i % 5) * 0.2,
      avg_power_factor: 0.94,
      collection_efficiency: 0.94,
      avg_tariff_inr: 7.5,
      is_tampered: [4, 11, 18, 23, 29].includes(i),
      tamper_type: [4, 11, 18, 23, 29].includes(i) ? "Bypassed Meter" : "None"
    });
  }
  return arr;
}

function setupEvents() {
  feederSelect.addEventListener('change', (e) => {
    currentFeeder = e.target.value;
    recalculate();
  });

  rSlider.addEventListener('input', (e) => {
    technicalR = parseFloat(e.target.value);
    rVal.textContent = technicalR.toFixed(1) + 'x';
    recalculate();
  });

  pfSlider.addEventListener('input', (e) => {
    powerFactor = parseFloat(e.target.value);
    pfVal.textContent = powerFactor.toFixed(2);
    recalculate();
  });

  theftSlider.addEventListener('input', (e) => {
    theftRate = parseInt(e.target.value);
    theftVal.textContent = theftRate + '%';
    recalculate();
  });

  sensSlider.addEventListener('input', (e) => {
    aiSensitivity = parseFloat(e.target.value);
    sensVal.textContent = aiSensitivity.toFixed(2);
    recalculate();
  });

  btnSimulate.addEventListener('click', () => {
    recalculate();
    flashStatus("Billing Cycle Simulated!");
  });

  btnTheft.addEventListener('click', () => {
    theftSlider.value = 35;
    theftRate = 35;
    theftVal.textContent = '35%';
    recalculate();
    flashStatus("Electricity Theft Injected (+35%)!");
  });

  btnTriage.addEventListener('click', () => {
    sensSlider.value = 0.90;
    aiSensitivity = 0.90;
    sensVal.textContent = '0.90';
    recalculate();
    flashStatus("AI Anomaly Triage Activated at High Sensitivity!");
  });

  btnReset.addEventListener('click', () => {
    currentFeeder = 'all';
    feederSelect.value = 'all';
    technicalR = 1.0;
    rSlider.value = 1.0;
    rVal.textContent = '1.0x';
    powerFactor = 0.92;
    pfSlider.value = 0.92;
    pfVal.textContent = '0.92';
    theftRate = 15;
    theftSlider.value = 15;
    theftVal.textContent = '15%';
    aiSensitivity = 0.75;
    sensSlider.value = 0.75;
    sensVal.textContent = '0.75';
    recalculate();
    flashStatus("Reset to Classroom Defaults");
  });

  btnExport.addEventListener('click', exportCSV);
}

function flashStatus(msg) {
  const el = document.getElementById('statusMsg');
  if (el) {
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 3000);
  }
}

function recalculate() {
  let filtered = allDTRs;
  if (currentFeeder !== 'all') {
    filtered = allDTRs.filter(d => d.feeder === currentFeeder);
  }

  let totalInputKWh = 0;
  let totalTechnicalLossKWh = 0;
  let totalBilledKWh = 0;
  let totalCollectedINR = 0;
  let totalBilledINR = 0;
  let recoverableTheftINR = 0;

  const processedDTRs = filtered.map((d, idx) => {
    // Technical losses: I^2 * R * t
    // Reactive penalty increases current if powerFactor < 0.95: I ~ 1 / pf
    const pfPenalty = Math.pow(0.95 / Math.min(0.99, Math.max(0.70, powerFactor)), 1.5);
    const techLossRatio = 0.045 * technicalR * (d.line_resistance_ohms / 1.0) * pfPenalty;
    const techLossKWh = d.input_kwh * techLossRatio;

    // Commercial / Theft losses
    let isStolen = d.is_tampered;
    let actualTheftRatio = 0;
    if (isStolen || ((idx * 7) % 100 < theftRate)) {
      isStolen = true;
      actualTheftRatio = 0.20 + ((idx * 3) % 25) / 100;
    }

    const unmeteredTheftKWh = isStolen ? (d.input_kwh - techLossKWh) * actualTheftRatio : 0;
    const billedKWh = Math.max(0, d.input_kwh - techLossKWh - unmeteredTheftKWh);
    const billedINR = billedKWh * d.avg_tariff_inr;
    const collectedINR = billedINR * d.collection_efficiency;
    const theftLossINR = unmeteredTheftKWh * d.avg_tariff_inr;

    // Anomaly Detection Score
    // Unsupervised Multi-factor Heuristic: deviation from expected technical loss & consumption ratio
    const expectedBilledRatio = 1.0 - techLossRatio;
    const actualBilledRatio = billedKWh / d.input_kwh;
    const anomalyDelta = (expectedBilledRatio - actualBilledRatio);
    const anomalyScore = Math.min(1.0, Math.max(0, (anomalyDelta * 3.5) + (isStolen ? 0.25 : 0)));
    const isFlagged = anomalyScore >= (1.05 - aiSensitivity);

    if (isFlagged && isStolen) {
      recoverableTheftINR += theftLossINR * 0.85; // 85% recovery on audit
    }

    totalInputKWh += d.input_kwh;
    totalTechnicalLossKWh += techLossKWh;
    totalBilledKWh += billedKWh;
    totalBilledINR += billedINR;
    totalCollectedINR += collectedINR;

    return {
      ...d,
      techLossKWh,
      unmeteredTheftKWh,
      billedKWh,
      billedINR,
      collectedINR,
      theftLossINR,
      anomalyScore,
      isFlagged,
      isStolen
    };
  });

  const billingEfficiency = totalInputKWh > 0 ? (totalBilledKWh / totalInputKWh) : 0;
  const collectionEfficiency = totalBilledINR > 0 ? (totalCollectedINR / totalBilledINR) : 0;
  const atcLossRate = (1.0 - (billingEfficiency * collectionEfficiency)) * 100;

  updateKPIs({
    totalInputKWh,
    totalBilledKWh,
    billingEfficiency,
    collectionEfficiency,
    atcLossRate,
    totalBilledINR,
    recoverableTheftINR
  });

  drawEnergyBalance(totalInputKWh, totalTechnicalLossKWh, totalBilledKWh, totalInputKWh - totalTechnicalLossKWh - totalBilledKWh);
  renderDTRGrid(processedDTRs);
  renderAuditTable(processedDTRs);
}

function updateKPIs(kpi) {
  document.getElementById('kpiInput').textContent = (kpi.totalInputKWh / 1000).toFixed(1) + ' MWh';
  document.getElementById('kpiBilled').textContent = (kpi.totalBilledKWh / 1000).toFixed(1) + ' MWh';
  document.getElementById('kpiBillingEff').textContent = (kpi.billingEfficiency * 100).toFixed(1) + '%';
  document.getElementById('kpiCollEff').textContent = (kpi.collectionEfficiency * 100).toFixed(1) + '%';
  
  const atcEl = document.getElementById('kpiATC');
  atcEl.textContent = kpi.atcLossRate.toFixed(1) + '%';
  atcEl.className = 'kpi-value ' + (kpi.atcLossRate > 20 ? 'badge-danger' : kpi.atcLossRate > 12 ? 'badge-warning' : 'badge-success');

  document.getElementById('kpiRecoverable').textContent = '₹' + (kpi.recoverableTheftINR / 100000).toFixed(2) + ' Lakh';
}

function drawEnergyBalance(input, techLoss, billed, theft) {
  if (!energyCanvas) return;
  const ctx = energyCanvas.getContext('2d');
  const w = energyCanvas.width = energyCanvas.offsetWidth;
  const h = energyCanvas.height = energyCanvas.offsetHeight;

  ctx.clearRect(0, 0, w, h);

  if (input <= 0) return;

  // Visual Horizontal Flow Diagram
  const startX = 40;
  const startY = h / 2;
  const barHeight = 44;

  // Left: Total Input Energy Block
  ctx.fillStyle = '#71d7ff';
  ctx.fillRect(startX, startY - barHeight/2, 110, barHeight);
  ctx.fillStyle = '#04101e';
  ctx.font = 'bold 12px Segoe UI, sans-serif';
  ctx.fillText('INPUT 100%', startX + 15, startY + 4);

  // Split into 3 streams:
  const techP = (techLoss / input);
  const billedP = (billed / input);
  const theftP = Math.max(0, theft / input);

  const destX = w - 180;
  const destW = 140;

  // 1. Technical Loss Stream (Top)
  const y1 = startY - 60;
  ctx.strokeStyle = 'rgba(255, 209, 102, 0.4)';
  ctx.lineWidth = Math.max(4, techP * 80);
  ctx.beginPath();
  ctx.moveTo(startX + 110, startY);
  ctx.bezierCurveTo(startX + 220, startY, destX - 80, y1, destX, y1);
  ctx.stroke();

  ctx.fillStyle = '#ffd166';
  ctx.fillRect(destX, y1 - 16, destW, 32);
  ctx.fillStyle = '#2b1c00';
  ctx.font = 'bold 11px Segoe UI, sans-serif';
  ctx.fillText(`Technical: ${(techP * 100).toFixed(1)}%`, destX + 10, y1 + 4);

  // 2. Billed Consumption Stream (Middle)
  const y2 = startY;
  ctx.strokeStyle = 'rgba(122, 229, 130, 0.5)';
  ctx.lineWidth = Math.max(6, billedP * 80);
  ctx.beginPath();
  ctx.moveTo(startX + 110, startY);
  ctx.lineTo(destX, y2);
  ctx.stroke();

  ctx.fillStyle = '#7ae582';
  ctx.fillRect(destX, y2 - 16, destW, 32);
  ctx.fillStyle = '#04240a';
  ctx.font = 'bold 11px Segoe UI, sans-serif';
  ctx.fillText(`Billed Sales: ${(billedP * 100).toFixed(1)}%`, destX + 10, y2 + 4);

  // 3. Theft & Commercial Loss Stream (Bottom)
  const y3 = startY + 60;
  ctx.strokeStyle = 'rgba(239, 71, 111, 0.5)';
  ctx.lineWidth = Math.max(4, theftP * 80);
  ctx.beginPath();
  ctx.moveTo(startX + 110, startY);
  ctx.bezierCurveTo(startX + 220, startY, destX - 80, y3, destX, y3);
  ctx.stroke();

  ctx.fillStyle = '#ef476f';
  ctx.fillRect(destX, y3 - 16, destW, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Segoe UI, sans-serif';
  ctx.fillText(`Commercial/Theft: ${(theftP * 100).toFixed(1)}%`, destX + 10, y3 + 4);
}

function renderDTRGrid(dtrs) {
  dtrGrid.innerHTML = '';
  dtrs.forEach(d => {
    const el = document.createElement('div');
    el.className = 'dtr-box ' + (d.isStolen ? 'tampered ' : '') + (d.isFlagged ? 'flagged' : '');
    el.innerHTML = `
      <div class="dtr-name">${d.dtr_id}</div>
      <div class="dtr-loss">${d.capacity_kva} kVA</div>
      <div style="font-size: 0.72rem; margin-top: 4px; font-weight: 700; color: ${d.isFlagged ? '#ffd166' : '#7ae582'}">
        ${d.isFlagged ? '⚠️ AI Flagged' : '✓ Normal'}
      </div>
    `;
    el.title = `${d.dtr_id} (${d.feeder}): Input ${d.input_kwh.toFixed(0)} kWh, Billed ${d.billedKWh.toFixed(0)} kWh, Anomaly Score: ${d.anomalyScore.toFixed(2)}`;
    dtrGrid.appendChild(el);
  });
}

function renderAuditTable(dtrs) {
  auditTableBody.innerHTML = '';
  // Sort by anomaly score descending
  const sorted = [...dtrs].sort((a, b) => b.anomalyScore - a.anomalyScore);

  sorted.slice(0, 15).forEach((d, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${d.dtr_id}</strong></td>
      <td>${d.feeder.replace('Feeder-11kV-', '')}</td>
      <td>${d.input_kwh.toFixed(0)}</td>
      <td>${d.billedKWh.toFixed(0)}</td>
      <td>${((d.techLossKWh / d.input_kwh) * 100).toFixed(1)}%</td>
      <td><strong>${(d.anomalyScore * 100).toFixed(0)}%</strong></td>
      <td>${d.isFlagged ? '<span class="tag-theft">Priority Audit</span>' : '<span class="tag-normal">Clear</span>'}</td>
      <td>₹${(d.theftLossINR).toFixed(0)}</td>
    `;
    auditTableBody.appendChild(tr);
  });
}

function exportCSV() {
  let filtered = allDTRs;
  if (currentFeeder !== 'all') {
    filtered = allDTRs.filter(d => d.feeder === currentFeeder);
  }

  const headers = ["DTR_ID", "Feeder", "Capacity_kVA", "Input_kWh", "Billed_kWh", "Technical_Loss_Pct", "Anomaly_Score", "Audit_Status", "Theft_Loss_INR"];
  const rows = filtered.map(d => {
    const techLossRatio = 0.045 * technicalR * (d.line_resistance_ohms / 1.0);
    const techLossKWh = d.input_kwh * techLossRatio;
    const billedKWh = Math.max(0, d.input_kwh - techLossKWh - (d.is_tampered ? d.input_kwh * 0.3 : 0));
    const theftINR = d.is_tampered ? (d.input_kwh * 0.3 * d.avg_tariff_inr) : 0;
    return [
      d.dtr_id,
      d.feeder,
      d.capacity_kva,
      d.input_kwh.toFixed(1),
      billedKWh.toFixed(1),
      (techLossRatio * 100).toFixed(1),
      d.is_tampered ? "0.92" : "0.15",
      d.is_tampered ? "HIGH_PRIORITY_INSPECT" : "NORMAL",
      theftINR.toFixed(2)
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `DISCOM_Feeder_Audit_Work_Order_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.addEventListener('DOMContentLoaded', init);