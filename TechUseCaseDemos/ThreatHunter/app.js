// AI Threat Hunter - ML-powered security log analysis
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');

const totalLogsEl = document.getElementById('totalLogs');
const anomaliesFoundEl = document.getElementById('anomaliesFound');
const riskScoreEl = document.getElementById('riskScore');
const anomaliesList = document.getElementById('anomaliesList');

let fileContent = '';

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    fileContent = e.dataTransfer.files[0].text();
    analyzeBtn.disabled = false;
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    fileContent = e.target.files[0].text();
    analyzeBtn.disabled = false;
  }
});

// Simulated anomaly detection
const anomalyPatterns = [
  { pattern: /Failed login/i, severity: 'high', type: 'Authentication', desc: 'Multiple failed login attempts detected' },
  { pattern: /unauthorized access/i, severity: 'high', type: 'Access', desc: 'Unauthorized access attempt blocked' },
  { pattern: /port scan/i, severity: 'medium', type: 'Network', desc: 'Port scanning activity detected' },
  { pattern: /malware/i, severity: 'high', type: 'Malware', desc: 'Potential malware signature detected' },
  { pattern: /exploit/i, severity: 'medium', type: 'Exploit', desc: 'Exploit attempt identified' },
  { pattern: /data exfil/i, severity: 'high', type: 'Data Loss', desc: 'Potential data exfiltration detected' }
];

analyzeBtn.addEventListener('click', function() {
  const lines = fileContent.split('\n').filter(l => l.trim());
  const anomalies = [];
  
  lines.forEach(line => {
    anomalyPatterns.forEach(p => {
      if (p.pattern.test(line)) {
        anomalies.push({
          type: p.severity,
          title: p.type,
          desc: p.desc,
          line: line.substring(0, 80)
        });
      }
    });
  });
  
  // Update stats
  totalLogsEl.textContent = lines.length;
  anomaliesFoundEl.textContent = anomalies.length;
  riskScoreEl.textContent = Math.min(100, Math.round(anomalies.length * 15)) + '%';
  
  // Render anomalies
  anomaliesList.innerHTML = '';
  anomalies.slice(0, 10).forEach(a => {
    const div = document.createElement('div');
    div.className = `anomaly-item ${a.type}`;
    div.innerHTML = `
      <div class="anomaly-title">${a.title}</div>
      <div class="anomaly-details">${a.desc}<br/>${a.line}</div>
    `;
    anomaliesList.appendChild(div);
  });
  
  resultsSection.classList.remove('hidden');
});