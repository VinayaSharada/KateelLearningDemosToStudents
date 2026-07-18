let threatCatalog = null;
let dfdModel = {
  entities: [],
  dataFlows: [],
  boundaries: [],
  nextId: 1
};
let threats = [];

const canvas = document.getElementById('dfdCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 20;
const ENTITY_SIZE = 60;
const ENTITY_TYPES = {
  external_actor: { label: 'External Actor', color: '#FF6B6B', icon: '👤' },
  external_system: { label: 'External System', color: '#FFA500', icon: '🔗' },
  process: { label: 'Process', color: '#4ECDC4', icon: '⚙️' },
  data_store: { label: 'Data Store', color: '#45B7D1', icon: '💾' }
};

let draggedEntity = null;
let selectedEntity = null;
let mode = 'select'; // select, entity, dataflow

document.addEventListener('DOMContentLoaded', async () => {
  const resp = await fetch('threatCatalog.json');
  threatCatalog = await resp.json();
  setupUI();
  drawCanvas();
  loadSampleDFD();
});

function setupUI() {
  document.getElementById('entityTypeSelect').addEventListener('change', e => {
    document.getElementById('entityTypeSelect').dataset.type = e.target.value;
  });

  document.getElementById('addEntity').addEventListener('click', () => {
    mode = 'add-entity';
    document.body.style.cursor = 'crosshair';
  });

  document.getElementById('addDataFlow').addEventListener('click', () => {
    mode = 'add-dataflow';
  });

  document.getElementById('analyzeThreat').addEventListener('click', analyzeThreats);
  document.getElementById('exportJSON').addEventListener('click', exportJSON);
  document.getElementById('exportMarkdown').addEventListener('click', exportMarkdown);
  document.getElementById('resetDFD').addEventListener('click', resetDFD);
  document.getElementById('clearThreats').addEventListener('click', clearThreats);

  canvas.addEventListener('click', canvasClick);
  canvas.addEventListener('mousemove', canvasMouseMove);
  canvas.addEventListener('mousedown', canvasMouseDown);
  canvas.addEventListener('mouseup', canvasMouseUp);
}

function canvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (mode === 'add-entity') {
    const type = document.getElementById('entityTypeSelect').value;
    addEntity(x, y, type, `${ENTITY_TYPES[type].label} ${dfdModel.entities.length + 1}`);
    mode = 'select';
    document.body.style.cursor = 'default';
  } else if (mode === 'select') {
    selectedEntity = findEntityAt(x, y);
    drawCanvas();
  }
}

function canvasMouseDown(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  draggedEntity = findEntityAt(x, y);
}

function canvasMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (draggedEntity) {
    draggedEntity.x = x;
    draggedEntity.y = y;
    drawCanvas();
  }
}

function canvasMouseUp() {
  draggedEntity = null;
}

function findEntityAt(x, y) {
  for (let entity of dfdModel.entities) {
    const dist = Math.sqrt((entity.x - x) ** 2 + (entity.y - y) ** 2);
    if (dist < ENTITY_SIZE / 2) {
      return entity;
    }
  }
  return null;
}

function addEntity(x, y, type, name) {
  dfdModel.entities.push({
    id: `entity_${dfdModel.nextId++}`,
    name: name,
    type: type,
    x: x,
    y: y,
    trustBoundary: false,
    authentication: false,
    encryption: false,
    inputValidation: false,
    auditLogging: false,
    authorization: false
  });
  drawCanvas();
}

function drawCanvas() {
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i <= canvas.height; i += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Draw data flows first (so they appear behind entities)
  dfdModel.dataFlows.forEach(flow => {
    const from = dfdModel.entities.find(e => e.id === flow.from);
    const to = dfdModel.entities.find(e => e.id === flow.to);
    if (from && to) {
      drawDataFlow(from, to, flow);
    }
  });

  // Draw entities
  dfdModel.entities.forEach(entity => {
    drawEntity(entity, entity === selectedEntity);
  });

  updateEntityList();
  updateDataFlowList();
}

function drawEntity(entity, selected) {
  const typeColor = ENTITY_TYPES[entity.type].color;
  ctx.fillStyle = selected ? '#dbeafe' : typeColor;
  ctx.strokeStyle = selected ? '#0284c7' : '#333';
  ctx.lineWidth = selected ? 3 : 2;

  ctx.beginPath();
  ctx.arc(entity.x, entity.y, ENTITY_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Draw icon
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#333';
  ctx.fillText(ENTITY_TYPES[entity.type].icon, entity.x, entity.y - 10);

  // Draw name
  ctx.font = '11px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(entity.name, entity.x, entity.y + 20);
}

function drawDataFlow(from, to, flow) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist;
  const uy = dy / dist;

  const startX = from.x + ux * (ENTITY_SIZE / 2);
  const startY = from.y + uy * (ENTITY_SIZE / 2);
  const endX = to.x - ux * (ENTITY_SIZE / 2);
  const endY = to.y - uy * (ENTITY_SIZE / 2);

  // Draw arrow
  ctx.strokeStyle = flow.encryption ? '#10b981' : '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw arrowhead
  const headlen = 15;
  const angle = Math.atan2(dy, dx);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  // Draw label
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  ctx.font = '10px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText(flow.label, midX, midY - 8);
  ctx.font = '9px Arial';
  ctx.fillStyle = '#666';
  ctx.fillText(flow.protocol || 'unknown', midX, midY + 4);
}

function updateEntityList() {
  const list = document.getElementById('entityList');
  list.innerHTML = '';
  dfdModel.entities.forEach(entity => {
    const div = document.createElement('div');
    div.className = 'entity-item';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span>${entity.name} (${entity.type})</span>
        <button onclick="editEntity('${entity.id}')" class="btn-small">Edit</button>
      </div>
      <div style="margin-top:8px;">
        <label><input type="checkbox" ${entity.authentication ? 'checked' : ''} onchange="updateEntity('${entity.id}', 'authentication', this.checked)"> Authentication</label>
        <label><input type="checkbox" ${entity.encryption ? 'checked' : ''} onchange="updateEntity('${entity.id}', 'encryption', this.checked)"> Encryption</label>
        <label><input type="checkbox" ${entity.inputValidation ? 'checked' : ''} onchange="updateEntity('${entity.id}', 'inputValidation', this.checked)"> Input Validation</label>
        <label><input type="checkbox" ${entity.auditLogging ? 'checked' : ''} onchange="updateEntity('${entity.id}', 'auditLogging', this.checked)"> Audit Logging</label>
      </div>
    `;
    list.appendChild(div);
  });
}

function updateEntity(id, prop, value) {
  const entity = dfdModel.entities.find(e => e.id === id);
  if (entity) {
    entity[prop] = value;
    drawCanvas();
  }
}

function updateDataFlowList() {
  const list = document.getElementById('dataFlowList');
  list.innerHTML = '';
  dfdModel.dataFlows.forEach((flow, index) => {
    const fromName = dfdModel.entities.find(e => e.id === flow.from)?.name || 'Unknown';
    const toName = dfdModel.entities.find(e => e.id === flow.to)?.name || 'Unknown';
    const div = document.createElement('div');
    div.className = 'dataflow-item';
    div.innerHTML = `
      <div style="margin-bottom:8px;"><strong>${fromName} → ${toName}</strong></div>
      <div>
        <label>Label: <input type="text" value="${flow.label}" onchange="updateDataFlow(${index}, 'label', this.value)" style="width:100px;"></label>
        <label>Protocol: <select onchange="updateDataFlow(${index}, 'protocol', this.value)">
          ${['HTTP', 'HTTPS', 'SMTP', 'FTP', 'SSH', 'gRPC', 'unencrypted'].map(p => `<option ${flow.protocol === p ? 'selected' : ''}>${p}</option>`).join('')}
        </select></label>
      </div>
      <div style="margin-top:6px;">
        <label><input type="checkbox" ${flow.encryption ? 'checked' : ''} onchange="updateDataFlow(${index}, 'encryption', this.checked)"> Encrypted</label>
        <label><input type="checkbox" ${flow.trustBoundary ? 'checked' : ''} onchange="updateDataFlow(${index}, 'trustBoundary', this.checked)"> Crosses Trust Boundary</label>
        <label><input type="checkbox" ${flow.sensitive ? 'checked' : ''} onchange="updateDataFlow(${index}, 'sensitive', this.checked)"> Sensitive Data</label>
      </div>
      <button onclick="deleteDataFlow(${index})" class="btn-small" style="margin-top:6px;">Delete</button>
    `;
    list.appendChild(div);
  });
}

function updateDataFlow(index, prop, value) {
  dfdModel.dataFlows[index][prop] = value;
  drawCanvas();
}

function deleteDataFlow(index) {
  dfdModel.dataFlows.splice(index, 1);
  drawCanvas();
}

function editEntity(id) {
  const entity = dfdModel.entities.find(e => e.id === id);
  if (entity) {
    const newName = prompt('Entity name:', entity.name);
    if (newName) {
      entity.name = newName;
      drawCanvas();
    }
  }
}

function addDataFlowFromUI() {
  if (dfdModel.entities.length < 2) {
    alert('Need at least 2 entities to create a data flow');
    return;
  }

  const fromSelect = document.getElementById('dataFlowFrom');
  const toSelect = document.getElementById('dataFlowTo');

  if (!fromSelect.value || !toSelect.value) {
    alert('Select both from and to entities');
    return;
  }

  dfdModel.dataFlows.push({
    from: fromSelect.value,
    to: toSelect.value,
    label: document.getElementById('dataFlowLabel').value || 'Data',
    protocol: 'HTTPS',
    encryption: false,
    trustBoundary: false,
    sensitive: false
  });

  document.getElementById('dataFlowLabel').value = '';
  drawCanvas();
}

function analyzeThreats() {
  threats = [];

  dfdModel.dataFlows.forEach(flow => {
    const from = dfdModel.entities.find(e => e.id === flow.from);
    const to = dfdModel.entities.find(e => e.id === flow.to);

    threatCatalog.threats.forEach(threat => {
      const triggered = checkThreatTriggers(threat, flow, from, to);
      if (triggered) {
        threats.push({
          ...threat,
          dataFlow: `${from.name} → ${to.name}`,
          dreadScore: calculateDREAD(threat),
          affectedEntity: to.name
        });
      }
    });
  });

  // Also check entity-level threats
  dfdModel.entities.forEach(entity => {
    threatCatalog.threats.forEach(threat => {
      if (threat.triggers.entityType && threat.id.startsWith('E')) {
        const triggered = checkEntityThreats(threat, entity);
        if (triggered && !threats.find(t => t.id === threat.id && t.affectedEntity === entity.name)) {
          threats.push({
            ...threat,
            affectedEntity: entity.name,
            dreadScore: calculateDREAD(threat)
          });
        }
      }
    });
  });

  displayThreats();
}

function checkThreatTriggers(threat, flow, from, to) {
  const triggers = threat.triggers;

  if (triggers.dataFlowProtocol && triggers.dataFlowProtocol.includes(flow.protocol)) {
    return true;
  }

  if (!triggers.encryption && !flow.encryption && flow.protocol !== 'HTTPS' && flow.protocol !== 'SSH') {
    if (threat.category === 'Tampering' || threat.category === 'Information Disclosure') {
      return true;
    }
  }

  if (triggers.authentication === false && !from.authentication) {
    if (threat.category === 'Spoofing') return true;
  }

  if (triggers.trustBoundary && flow.trustBoundary && !flow.encryption) {
    if (threat.category === 'Tampering' || threat.category === 'Information Disclosure') {
      return true;
    }
  }

  if (triggers.dataFlowSensitive && flow.sensitive && !flow.encryption) {
    return true;
  }

  return false;
}

function checkEntityThreats(threat, entity) {
  const triggers = threat.triggers;

  if (triggers.entityType && !Array.isArray(triggers.entityType)) {
    if (triggers.entityType === entity.type) {
      if (triggers.inputValidation === false && !entity.inputValidation) return true;
      if (triggers.auditLogging === false && !entity.auditLogging) return true;
      if (triggers.authorization === false && !entity.authorization) return true;
    }
  }

  return false;
}

function calculateDREAD(threat) {
  const weights = threatCatalog.riskMatrixDREAD;
  let score = 0;

  if (threat.severity === 'Critical') score += 8;
  else if (threat.severity === 'High') score += 6;
  else if (threat.severity === 'Medium') score += 4;
  else score += 2;

  return score;
}

function displayThreats() {
  const container = document.getElementById('threatResults');
  container.innerHTML = '';

  if (threats.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#666;">No threats detected. Your DFD looks secure!</p>';
    return;
  }

  // Group by STRIDE category
  const byCategory = {};
  threats.forEach(threat => {
    if (!byCategory[threat.category]) byCategory[threat.category] = [];
    byCategory[threat.category].push(threat);
  });

  Object.keys(byCategory).sort().forEach(category => {
    const categoryThreats = byCategory[category];
    const div = document.createElement('div');
    div.className = 'threat-group';
    div.innerHTML = `<h3>${category} (${categoryThreats.length})</h3>`;

    categoryThreats.forEach(threat => {
      const threatDiv = document.createElement('div');
      threatDiv.className = `threat-item severity-${threat.severity.toLowerCase()}`;
      threatDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between;">
          <strong>${threat.title}</strong>
          <span class="severity-badge">${threat.severity}</span>
        </div>
        <p style="margin:6px 0; font-size:13px;">${threat.description}</p>
        <p style="margin:6px 0; font-size:12px; color:#666;"><strong>Affected:</strong> ${threat.affectedEntity}</p>
        <p style="margin:6px 0; font-size:12px; color:#666;"><strong>Mitigation:</strong> ${threat.mitigation}</p>
        <p style="margin:6px 0; font-size:12px; color:#666;"><strong>CWE:</strong> ${threat.cwe.join(', ')}</p>
      `;
      div.appendChild(threatDiv);
    });

    container.appendChild(div);
  });

  // Summary stats
  const stats = document.getElementById('threatStats');
  const critical = threats.filter(t => t.severity === 'Critical').length;
  const high = threats.filter(t => t.severity === 'High').length;
  stats.innerHTML = `
    <div class="stat-box"><span class="stat-value">${threats.length}</span><span class="stat-label">Total Threats</span></div>
    <div class="stat-box critical"><span class="stat-value">${critical}</span><span class="stat-label">Critical</span></div>
    <div class="stat-box high"><span class="stat-value">${high}</span><span class="stat-label">High</span></div>
  `;
}

function exportJSON() {
  const export_data = {
    model: dfdModel,
    threats: threats,
    timestamp: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(export_data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stride-dfd-${Date.now()}.json`;
  a.click();
}

function exportMarkdown() {
  let md = '# STRIDE Threat Model\n\n';
  md += `Generated: ${new Date().toLocaleString()}\n\n`;

  md += '## Data Flow Diagram\n\n';
  dfdModel.entities.forEach(e => {
    md += `- **${e.name}** (${e.type})\n`;
  });

  md += '\n## Data Flows\n\n';
  dfdModel.dataFlows.forEach(f => {
    const from = dfdModel.entities.find(e => e.id === f.from)?.name;
    const to = dfdModel.entities.find(e => e.id === f.to)?.name;
    md += `- ${from} → ${to}: ${f.label} (${f.protocol})\n`;
  });

  md += '\n## Identified Threats\n\n';
  const byCategory = {};
  threats.forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  });

  Object.keys(byCategory).sort().forEach(cat => {
    md += `### ${cat}\n\n`;
    byCategory[cat].forEach(t => {
      md += `#### ${t.title}\n`;
      md += `- **Severity:** ${t.severity}\n`;
      md += `- **Affected:** ${t.affectedEntity}\n`;
      md += `- **Description:** ${t.description}\n`;
      md += `- **Mitigation:** ${t.mitigation}\n`;
      md += `- **CWE:** ${t.cwe.join(', ')}\n\n`;
    });
  });

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stride-dfd-${Date.now()}.md`;
  a.click();
}

function clearThreats() {
  threats = [];
  document.getElementById('threatResults').innerHTML = '';
  document.getElementById('threatStats').innerHTML = '';
}

function resetDFD() {
  if (confirm('Clear all entities and data flows?')) {
    dfdModel = { entities: [], dataFlows: [], boundaries: [], nextId: 1 };
    threats = [];
    drawCanvas();
    clearThreats();
  }
}

function loadSampleDFD() {
  dfdModel.entities = [
    { id: 'entity_1', name: 'User', type: 'external_actor', x: 100, y: 150, authentication: false, encryption: false, inputValidation: false, auditLogging: false, authorization: false, trustBoundary: false },
    { id: 'entity_2', name: 'Web API', type: 'process', x: 300, y: 150, authentication: false, encryption: false, inputValidation: false, auditLogging: false, authorization: false, trustBoundary: false },
    { id: 'entity_3', name: 'Database', type: 'data_store', x: 500, y: 150, authentication: false, encryption: false, inputValidation: false, auditLogging: false, authorization: false, trustBoundary: false }
  ];

  dfdModel.dataFlows = [
    { from: 'entity_1', to: 'entity_2', label: 'Login Credentials', protocol: 'HTTP', encryption: false, trustBoundary: true, sensitive: true },
    { from: 'entity_2', to: 'entity_3', label: 'Query', protocol: 'HTTPS', encryption: false, trustBoundary: false, sensitive: false }
  ];

  dfdModel.nextId = 4;
  drawCanvas();
}

// Populate data flow selects
function updateDataFlowSelects() {
  const fromSelect = document.getElementById('dataFlowFrom');
  const toSelect = document.getElementById('dataFlowTo');
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  dfdModel.entities.forEach(e => {
    const opt1 = document.createElement('option');
    opt1.value = e.id;
    opt1.textContent = e.name;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = e.id;
    opt2.textContent = e.name;
    toSelect.appendChild(opt2);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('addDataFlow').addEventListener('click', () => {
      updateDataFlowSelects();
      document.getElementById('dataFlowModal').style.display = 'block';
    });

    document.getElementById('dataFlowConfirm').addEventListener('click', () => {
      addDataFlowFromUI();
      document.getElementById('dataFlowModal').style.display = 'none';
    });

    document.getElementById('dataFlowCancel').addEventListener('click', () => {
      document.getElementById('dataFlowModal').style.display = 'none';
    });
  }, 500);
});
