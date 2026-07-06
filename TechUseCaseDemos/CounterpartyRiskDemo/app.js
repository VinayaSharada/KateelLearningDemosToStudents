// Counterparty Risk Calculator - CVA/DVA Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const notionalSlider = document.getElementById('notionalSlider');
const exposureSlider = document.getElementById('exposureSlider');
const pdSlider = document.getElementById('pdSlider');
const ownPdSlider = document.getElementById('ownPdSlider');
const lgdSlider = document.getElementById('lgdSlider');
const rateSlider = document.getElementById('rateSlider');

const eeValue = document.getElementById('eeValue');
const cvaValue = document.getElementById('cvaValue');
const dvaValue = document.getElementById('dvaValue');
const netBilateralValue = document.getElementById('netBilateralValue');
const adjustedValue = document.getElementById('adjustedValue');
const eeProfileCanvas = document.getElementById('eeProfileChart');

notionalSlider.addEventListener('input', () => document.getElementById('notionalValue').textContent = '$' + (notionalSlider.value/1000000).toFixed(0) + 'M');
exposureSlider.addEventListener('input', () => document.getElementById('exposureValue').textContent = (exposureSlider.value * 100).toFixed(0) + '%');
pdSlider.addEventListener('input', () => document.getElementById('pdValue').textContent = parseFloat(pdSlider.value).toFixed(1) + '%');
ownPdSlider.addEventListener('input', () => document.getElementById('ownPdValue').textContent = parseFloat(ownPdSlider.value).toFixed(1) + '%');
lgdSlider.addEventListener('input', () => document.getElementById('lgdValue').textContent = (lgdSlider.value * 100).toFixed(0) + '%');
rateSlider.addEventListener('input', () => document.getElementById('rateValue').textContent = parseFloat(rateSlider.value).toFixed(1) + '%');

function calculateCVA() {
  const notional = parseFloat(notionalSlider.value);
  const exposure = parseFloat(exposureSlider.value);
  const pd = parseFloat(pdSlider.value) / 100;
  const ownPd = parseFloat(ownPdSlider.value) / 100;
  const lgd = parseFloat(lgdSlider.value);

  // Expected Exposure (flat approximation of the profile shown in the chart)
  const ee = notional * exposure;

  // CVA = EE * counterparty PD * LGD
  const cva = ee * pd * lgd;

  // DVA = EE * own PD * LGD (symmetric formula, own default risk)
  const dva = ee * ownPd * lgd;

  // Net Bilateral CVA
  const netCVA = cva - dva;

  // Adjusted value
  const adjusted = notional - netCVA;

  return { ee, cva, dva, netCVA, adjusted };
}

function drawEeProfile(notional, exposure) {
  if (!eeProfileCanvas || !eeProfileCanvas.getContext) return;
  const ctx = eeProfileCanvas.getContext('2d');
  const w = eeProfileCanvas.width, h = eeProfileCanvas.height;
  ctx.clearRect(0, 0, w, h);

  const peakEE = notional * exposure * 1.6; // profile peaks above the flat average
  const years = 5;
  const points = 100;
  const profile = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * years;
    // Classic swap-like EE shape: rises like sqrt(t) then decays to 0 at maturity
    const shape = Math.sqrt(t / years) * (1 - t / years) * 2.3;
    profile.push({ t, ee: Math.max(0, peakEE * shape) });
  }
  const flatEE = notional * exposure;
  const maxY = Math.max(peakEE, flatEE) * 1.1;

  const padding = 32;
  const toX = t => padding + (t / years) * (w - 2 * padding);
  const toY = ee => h - padding - (ee / maxY) * (h - 2 * padding);

  // axes
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, h - padding);
  ctx.stroke();

  // flat EE reference line (the simplified number shown in the card)
  ctx.strokeStyle = 'rgba(240,136,62,0.7)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padding, toY(flatEE));
  ctx.lineTo(w - padding, toY(flatEE));
  ctx.stroke();
  ctx.setLineDash([]);

  // EE profile curve
  ctx.strokeStyle = '#58a6ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  profile.forEach((p, i) => {
    const x = toX(p.t), y = toY(p.ee);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = '#8b949e';
  ctx.font = '11px sans-serif';
  ctx.fillText('Time →  (' + years + '-year trade)', w - padding - 130, h - padding + 20);
  ctx.fillText('Expected Exposure', padding, padding - 10);
  ctx.fillStyle = 'rgba(240,136,62,0.9)';
  ctx.fillText('flat EE used above', padding + 6, toY(flatEE) - 6);
}

function updateUI() {
  const result = calculateCVA();

  eeValue.textContent = '$' + (result.ee / 1000000).toFixed(1) + 'M';
  cvaValue.textContent = '$' + (result.cva / 1000).toFixed(0) + 'K';
  dvaValue.textContent = '$' + (result.dva / 1000).toFixed(0) + 'K';
  netBilateralValue.textContent = '$' + (result.netCVA / 1000).toFixed(0) + 'K';
  adjustedValue.textContent = '$' + (result.adjusted / 1000000).toFixed(1) + 'M';

  drawEeProfile(parseFloat(notionalSlider.value), parseFloat(exposureSlider.value));
}

[notionalSlider, exposureSlider, pdSlider, ownPdSlider, lgdSlider, rateSlider].forEach(el => {
  el.addEventListener('input', updateUI);
});

updateUI();
