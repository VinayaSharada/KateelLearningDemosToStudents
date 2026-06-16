// QFD House of Quality - Full interactive implementation
// Renders the classic "house" shape: triangular roof, relationship matrix,
// customer importance weights, competitive assessment, and technical priorities.

class HouseOfQuality {
  constructor() {
    // Customer requirements (WHATs) with importance weights (1-5)
    this.whats = [
      { name: "Accurate predictions",   importance: 5 },
      { name: "Fast response time",     importance: 4 },
      { name: "Easy to use interface",  importance: 3 },
      { name: "Explainable results",    importance: 4 },
      { name: "Robust to outliers",     importance: 3 }
    ];

    // Technical requirements (HOWs) with improvement direction
    // direction: ▲ = higher is better, ▼ = lower is better, ◎ = target
    this.hows = [
      { name: "ML model accuracy",       direction: "▲" },
      { name: "API latency (ms)",        direction: "▼" },
      { name: "UI usability score",      direction: "▲" },
      { name: "Explainability module",   direction: "▲" },
      { name: "Anomaly detection F1",    direction: "▲" }
    ];

    // Relationship matrix: 0=none, 1=weak(△), 3=medium(○), 9=strong(●)
    this.relationships = [
      [9, 1, 0, 3, 3],   // Accurate predictions
      [3, 9, 1, 0, 1],   // Fast response time
      [0, 3, 9, 3, 0],   // Easy to use interface
      [3, 0, 3, 9, 1],   // Explainable results
      [3, 1, 0, 1, 9]    // Robust to outliers
    ];

    // Roof correlation matrix (upper triangle only)
    // ++  = strong positive,  +  = positive,  (blank) = none,
    //  -  = negative,         -- = strong negative
    // Stored as flat upper-triangle: index for pair (i,j) where i<j
    this.roofValues = [
      "+",  "",  "+", "+",    // col 0 vs 1,2,3,4
      "",   "",  "",          // col 1 vs 2,3,4
      "+",  "",               // col 2 vs 3,4
      ""                      // col 3 vs 4
    ];

    // Competitive assessment: how we compare vs competitor (1-5 scale)
    this.compUs   = [4, 3, 3, 3, 3];
    this.compThem = [3, 4, 4, 2, 2];

    // Technical targets (bottom row)
    this.targets = [">95%", "<200", ">85", "SHAP", ">0.90"];

    // Guard against re-entrant renders
    this._rendering = false;

    this.init();
  }

  // ── Helpers ────────────────────────────────────────────────────

  roofIndex(i, j) {
    if (i > j) [i, j] = [j, i];
    const n = this.hows.length;
    return (n * i) - (i * (i + 1) / 2) + (j - i - 1);
  }

  getRoof(i, j) {
    if (i === j) return null;
    return this.roofValues[this.roofIndex(i, j)] || "";
  }

  setRoof(i, j, val) {
    this.roofValues[this.roofIndex(i, j)] = val;
  }

  cycleRoof(i, j) {
    const order = ["", "+", "++", "-", "--"];
    const cur = this.getRoof(i, j);
    const idx = order.indexOf(cur);
    this.setRoof(i, j, order[(idx + 1) % order.length]);
    // Defer render so DOM replacement doesn't happen mid-click
    setTimeout(() => this.renderHoQ(), 0);
  }

  cycleRelationship(r, c) {
    const order = [0, 1, 3, 9];
    const cur = this.relationships[r][c];
    const idx = order.indexOf(cur);
    this.relationships[r][c] = order[(idx + 1) % order.length];
    // Defer render so DOM replacement doesn't happen mid-click
    setTimeout(() => { this.renderHoQ(); this.renderPriorities(); }, 0);
  }

  relSymbol(val) {
    if (val === 9) return "●";
    if (val === 3) return "○";
    if (val === 1) return "△";
    return "";
  }

  relClass(val) {
    if (val === 9) return "rel-strong";
    if (val === 3) return "rel-medium";
    if (val === 1) return "rel-weak";
    return "rel-none";
  }

  roofClass(val) {
    if (val === "++" || val === "+") return "roof-pos";
    if (val === "--" || val === "-") return "roof-neg";
    return "roof-none";
  }

  // Calculate technical importance scores
  calcTechScores() {
    const n = this.hows.length;
    const scores = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < this.whats.length; i++) {
        scores[j] += this.whats[i].importance * this.relationships[i][j];
      }
    }
    return scores;
  }

  // ── Rendering ─────────────────────────────────────────────────

  renderAll() {
    if (this._rendering) return;
    this._rendering = true;
    try {
      this.renderEditPanels();
      this.renderHoQ();
      this.renderPriorities();
    } finally {
      this._rendering = false;
    }
  }

  renderEditPanels() {
    // Customer requirements list
    const crContainer = document.getElementById("cr-list");
    crContainer.innerHTML = this.whats.map((w, i) => `
      <div class="item">
        <input type="text" value="${this._esc(w.name)}" data-idx="${i}" data-field="cr">
        <label class="imp-label">Wt
          <select data-idx="${i}" data-field="cr-imp">
            ${[1,2,3,4,5].map(v => `<option value="${v}" ${v === w.importance ? "selected" : ""}>${v}</option>`).join("")}
          </select>
        </label>
        <span class="remove-btn" data-idx="${i}" data-field="remove-cr">×</span>
      </div>
    `).join("");

    // Technical requirements list
    const trContainer = document.getElementById("tr-list");
    trContainer.innerHTML = this.hows.map((h, i) => `
      <div class="item">
        <input type="text" value="${this._esc(h.name)}" data-idx="${i}" data-field="tr">
        <label class="imp-label">Dir
          <select data-idx="${i}" data-field="tr-dir">
            ${["▲","▼","◎"].map(v => `<option value="${v}" ${v === h.direction ? "selected" : ""}>${v}</option>`).join("")}
          </select>
        </label>
        <span class="remove-btn" data-idx="${i}" data-field="remove-tr">×</span>
      </div>
    `).join("");
  }

  _esc(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  renderHoQ() {
    const nW = this.whats.length;
    const nH = this.hows.length;
    const scores = this.calcTechScores();
    const maxScore = Math.max(...scores, 1);

    // ── Roof (SVG) ──
    const cellW = 64;
    const cellH = 32;
    const roofH = nH * cellH / 2 + cellH;
    const matrixW = nH * cellW;
    const offsetX = 180; // space for left labels column

    let roofSvg = `<svg class="roof-svg" width="${offsetX + matrixW + 200}" height="${roofH + 10}" viewBox="0 0 ${offsetX + matrixW + 200} ${roofH + 10}">`;

    // Draw rotated grid cells for the roof
    for (let i = 0; i < nH; i++) {
      for (let j = i + 1; j < nH; j++) {
        const val = this.getRoof(i, j);
        const cls = this.roofClass(val);
        const cx1 = offsetX + i * cellW + cellW / 2;
        const cx2 = offsetX + j * cellW + cellW / 2;
        const midX = (cx1 + cx2) / 2;
        const midY = roofH - (j - i) * cellH / 2;
        const hw = cellW / 2;
        const hh = cellH / 2;

        roofSvg += `<polygon class="roof-cell ${cls}"
          points="${midX},${midY - hh} ${midX + hw},${midY} ${midX},${midY + hh} ${midX - hw},${midY}"
          data-ri="${i}" data-rj="${j}" />`;
        if (val) {
          roofSvg += `<text x="${midX}" y="${midY + 5}" text-anchor="middle" class="roof-label">${val}</text>`;
        }
      }
    }

    // Outline the roof triangle
    const leftX = offsetX + cellW / 2;
    const rightX = offsetX + (nH - 1) * cellW + cellW / 2;
    const peakX = (leftX + rightX) / 2;
    const baseY = roofH + cellH / 2 - 2;
    const peakY = roofH - (nH - 1) * cellH / 2 - cellH / 2;
    roofSvg += `<polygon class="roof-outline" points="${leftX},${baseY} ${peakX},${peakY} ${rightX},${baseY}" />`;

    roofSvg += `</svg>`;

    // ── Body table ──
    let html = `<div class="hoq-wrapper">`;
    html += `<div class="hoq-roof">${roofSvg}</div>`;
    html += `<div class="hoq-body-scroll"><table class="hoq-table">`;

    // Header row: direction arrows
    html += `<thead>`;
    html += `<tr class="direction-row">`;
    html += `<th class="corner-label">Improvement<br>Direction</th>`;
    html += `<th class="imp-col-header"></th>`;
    for (let j = 0; j < nH; j++) {
      html += `<th class="dir-cell">${this.hows[j].direction}</th>`;
    }
    html += `<th colspan="2" class="comp-header"></th>`;
    html += `</tr>`;

    // Header row: HOW names (vertical)
    html += `<tr class="how-header-row">`;
    html += `<th class="corner-label">Customer<br>Requirements</th>`;
    html += `<th class="imp-col-header">Weight</th>`;
    for (let j = 0; j < nH; j++) {
      html += `<th class="how-name"><div class="rotated-text">${this._esc(this.hows[j].name)}</div></th>`;
    }
    html += `<th class="comp-header">Us</th>`;
    html += `<th class="comp-header">Them</th>`;
    html += `</tr>`;
    html += `</thead>`;

    // Body rows: one per WHAT
    html += `<tbody>`;
    for (let i = 0; i < nW; i++) {
      html += `<tr>`;
      html += `<td class="what-name">${this._esc(this.whats[i].name)}</td>`;
      html += `<td class="imp-cell">${this.whats[i].importance}</td>`;
      for (let j = 0; j < nH; j++) {
        const v = this.relationships[i][j];
        html += `<td class="rel-cell ${this.relClass(v)}" data-r="${i}" data-c="${j}">${this.relSymbol(v)}</td>`;
      }
      // Competitive assessment bars
      html += `<td class="comp-cell"><div class="comp-bar us-bar" style="width:${this.compUs[i] * 20}%">${this.compUs[i]}</div></td>`;
      html += `<td class="comp-cell"><div class="comp-bar them-bar" style="width:${this.compThem[i] * 20}%">${this.compThem[i]}</div></td>`;
      html += `</tr>`;
    }
    html += `</tbody>`;

    // Footer: technical scores
    html += `<tfoot>`;

    // Absolute importance row
    html += `<tr class="score-row">`;
    html += `<td class="footer-label" colspan="2">Importance Score</td>`;
    for (let j = 0; j < nH; j++) {
      html += `<td class="score-cell">${scores[j]}</td>`;
    }
    html += `<td colspan="2"></td>`;
    html += `</tr>`;

    // Relative importance (bar)
    html += `<tr class="bar-row">`;
    html += `<td class="footer-label" colspan="2">Relative Weight</td>`;
    for (let j = 0; j < nH; j++) {
      const pct = Math.round(scores[j] / maxScore * 100);
      html += `<td class="bar-cell"><div class="importance-bar" style="height:${pct}%"></div><span class="bar-pct">${pct}%</span></td>`;
    }
    html += `<td colspan="2"></td>`;
    html += `</tr>`;

    // Technical targets row
    html += `<tr class="target-row">`;
    html += `<td class="footer-label" colspan="2">Target</td>`;
    for (let j = 0; j < nH; j++) {
      html += `<td class="target-cell">${this.targets[j] || ""}</td>`;
    }
    html += `<td colspan="2"></td>`;
    html += `</tr>`;

    html += `</tfoot></table></div></div>`;

    document.getElementById("hoq-container").innerHTML = html;
  }

  renderPriorities() {
    const scores = this.calcTechScores();
    const ranked = this.hows.map((h, i) => ({ name: h.name, score: scores[i], dir: h.direction }))
      .sort((a, b) => b.score - a.score);
    const maxScore = Math.max(...ranked.map(r => r.score), 1);

    const container = document.getElementById("priority-results");
    container.innerHTML = ranked.map((r, i) => {
      const pct = Math.round(r.score / maxScore * 100);
      const tier = i < 2 ? "top" : i < 4 ? "mid" : "low";
      return `
        <div class="priority-row ${tier}">
          <span class="priority-rank">#${i + 1}</span>
          <span class="priority-name">${this._esc(r.name)} <span class="priority-dir">${r.dir}</span></span>
          <div class="priority-bar-bg"><div class="priority-bar-fill ${tier}-fill" style="width:${pct}%"></div></div>
          <span class="priority-score">${r.score}</span>
        </div>`;
    }).join("");
  }

  // ── Event wiring ──────────────────────────────────────────────

  init() {
    this.renderAll();

    const self = this;

    // Delegate clicks on the HoQ container
    document.getElementById("hoq-container").addEventListener("click", function(e) {
      const t = e.target;

      // Roof cell click (SVG polygon)
      if (t.classList.contains("roof-cell")) {
        self.cycleRoof(+t.dataset.ri, +t.dataset.rj);
        return;
      }

      // Relationship cell click
      if (t.classList.contains("rel-cell")) {
        self.cycleRelationship(+t.dataset.r, +t.dataset.c);
        return;
      }
    });

    // Delegate clicks on edit panels (remove/add buttons)
    document.addEventListener("click", function(e) {
      const t = e.target;

      if (t.dataset.field === "remove-cr") {
        self.removeWhat(+t.dataset.idx);
        return;
      }
      if (t.dataset.field === "remove-tr") {
        self.removeHow(+t.dataset.idx);
        return;
      }
      if (t.id === "add-cr") {
        self.addWhat();
        return;
      }
      if (t.id === "add-tr") {
        self.addHow();
        return;
      }
    });

    // Input changes (name edits, weight/direction selects)
    document.addEventListener("change", function(e) {
      if (self._rendering) return; // Ignore change events fired during render

      const t = e.target;
      const idx = +t.dataset.idx;

      if (t.dataset.field === "cr" && self.whats[idx]) {
        self.whats[idx].name = t.value;
        self.renderHoQ();
        self.renderPriorities();
      }
      if (t.dataset.field === "cr-imp" && self.whats[idx]) {
        self.whats[idx].importance = +t.value;
        self.renderHoQ();
        self.renderPriorities();
      }
      if (t.dataset.field === "tr" && self.hows[idx]) {
        self.hows[idx].name = t.value;
        self.renderHoQ();
        self.renderPriorities();
      }
      if (t.dataset.field === "tr-dir" && self.hows[idx]) {
        self.hows[idx].direction = t.value;
        self.renderHoQ();
      }
    });

    // Enter key to add items
    document.getElementById("new-cr").addEventListener("keydown", function(e) {
      if (e.key === "Enter") self.addWhat();
    });
    document.getElementById("new-tr").addEventListener("keydown", function(e) {
      if (e.key === "Enter") self.addHow();
    });
  }

  // ── CRUD operations ───────────────────────────────────────────

  addWhat() {
    const input = document.getElementById("new-cr");
    const name = input.value.trim();
    if (!name) return;
    this.whats.push({ name, importance: 3 });
    this.relationships.push(new Array(this.hows.length).fill(0));
    this.compUs.push(3);
    this.compThem.push(3);
    input.value = "";
    this.renderAll();
  }

  addHow() {
    const input = document.getElementById("new-tr");
    const name = input.value.trim();
    if (!name) return;
    this.hows.push({ name, direction: "▲" });
    this.relationships.forEach(row => row.push(0));
    // Rebuild roof for new size
    const n = this.hows.length;
    const oldRoof = this.roofValues.slice();
    const oldN = n - 1;
    const newRoof = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (i < oldN && j < oldN) {
          const oldIdx = (oldN * i) - (i * (i + 1) / 2) + (j - i - 1);
          newRoof.push(oldRoof[oldIdx] || "");
        } else {
          newRoof.push("");
        }
      }
    }
    this.roofValues = newRoof;
    this.targets.push("");
    input.value = "";
    this.renderAll();
  }

  removeWhat(idx) {
    if (this.whats.length <= 1) return;
    this.whats.splice(idx, 1);
    this.relationships.splice(idx, 1);
    this.compUs.splice(idx, 1);
    this.compThem.splice(idx, 1);
    this.renderAll();
  }

  removeHow(idx) {
    if (this.hows.length <= 1) return;
    const oldN = this.hows.length;
    const oldRoof = this.roofValues.slice();
    this.hows.splice(idx, 1);
    this.relationships.forEach(row => row.splice(idx, 1));
    this.targets.splice(idx, 1);
    // Rebuild roof excluding removed column
    const n = this.hows.length;
    const newRoof = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // Map back to old indices
        const oi = i < idx ? i : i + 1;
        const oj = j < idx ? j : j + 1;
        const oldIdx = (oldN * oi) - (oi * (oi + 1) / 2) + (oj - oi - 1);
        newRoof.push(oldRoof[oldIdx] || "");
      }
    }
    this.roofValues = newRoof;
    this.renderAll();
  }
}

// ── Bootstrap ──
let app;
document.addEventListener("DOMContentLoaded", function() {
  app = new HouseOfQuality();
});
