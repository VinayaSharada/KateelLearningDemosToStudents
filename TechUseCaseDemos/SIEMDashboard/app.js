// SIEM Dashboard - Security Incident and Event Management
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const alertsList = document.getElementById('alertsList');
const totalEventsEl = document.getElementById('totalEvents');
const alertsCountEl = document.getElementById('alertsCount');
const criticalCountEl = document.getElementById('criticalCount');
const resolvedCountEl = document.getElementById('resolvedCount');
const eventsTable = document.getElementById('eventsTable');
const refreshBtn = document.getElementById('refreshBtn');

// Sample data
const alertTypes = [
  { id: 1, title: 'Brute Force Attack Detected', severity: 'critical', source: '192.168.1.100', time: '2024-06-16 14:30:22' },
  { id: 2, title: 'SQL Injection Attempt', severity: 'high', source: '10.0.0.55', time: '2024-06-16 14:25:11' },
  { id: 3, title: 'Failed Login Attempts', severity: 'medium', source: '172.16.0.23', time: '2024-06-16 14:20:45' },
  { id: 4, title: 'Port Scan Detected', severity: 'medium', source: '192.168.1.88', time: '2024-06-16 14:15:33' },
  { id: 5, title: 'Suspicious File Upload', severity: 'low', source: '10.0.0.12', time: '2024-06-16 14:10:22' }
];

const events = [
  { id: 1, type: 'LOGIN', source: '192.168.1.100', dest: 'auth-server', status: 'FAILED', time: '2024-06-16 14:30:22' },
  { id: 2, type: 'HTTP', source: '10.0.0.55', dest: 'web-app', status: 'BLOCKED', time: '2024-06-16 14:25:11' },
  { id: 3, type: 'DNS', source: '172.16.0.23', dest: 'resolver', status: 'QUERY', time: '2024-06-16 14:20:45' },
  { id: 4, type: 'SSH', source: '192.168.1.88', dest: 'server-01', status: 'CONNECTED', time: '2024-06-16 14:15:33' }
];

function renderAlerts() {
  alertsList.innerHTML = '';
  let critical = 0;
  
  alertTypes.forEach(alert => {
    const div = document.createElement('div');
    div.className = `alert-item ${alert.severity}`;
    div.innerHTML = `
      <div class="alert-header">
        <span class="alert-title">${alert.title}</span>
        <span class="alert-time">${alert.time}</span>
      </div>
      <div class="alert-description">Source: ${alert.source} | Severity: ${alert.severity.toUpperCase()}</div>
    `;
    alertsList.appendChild(div);
    if (alert.severity === 'critical') critical++;
  });
  
  criticalCountEl.textContent = critical;
}

function renderEvents() {
  eventsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Source</th>
          <th>Destination</th>
          <th>Status</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        ${events.map(e => `
          <tr>
            <td>${e.type}</td>
            <td>${e.source}</td>
            <td>${e.dest}</td>
            <td>${e.status}</td>
            <td>${e.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function updateStats() {
  totalEventsEl.textContent = events.length + alertTypes.length;
  alertsCountEl.textContent = alertTypes.length;
  resolvedCountEl.textContent = Math.floor(alertTypes.length * 0.3);
}

refreshBtn.addEventListener('click', function() {
  updateStats();
  renderAlerts();
  renderEvents();
});

// Initialize
updateStats();
renderAlerts();
renderEvents();