// Compliance Alert Triage System
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const addBtn = document.getElementById('addBtn');
const alertsList = document.getElementById('alertsList');

let alerts = JSON.parse(localStorage.getItem('complianceAlerts') || '[]');

function getPriorityScore(alert) {
  // Higher score = higher priority
  let score = 0;
  
  // Severity weights
  if (alert.severity === 'high') score += 100;
  else if (alert.severity === 'medium') score += 50;
  else score += 20;
  
  // Days until deadline (sooner = higher priority)
  const today = new Date();
  const deadline = new Date(alert.deadline);
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  if (daysLeft < 7) score += 50;
  else if (daysLeft < 30) score += 20;
  else if (daysLeft < 90) score += 5;
  
  // Regulation weights
  if (alert.regulation === 'GDPR') score += 30;
  else if (alert.regulation === 'CCPA') score += 25;
  else if (alert.regulation === 'SOX') score += 20;
  
  return score;
}

function renderAlerts() {
  alerts.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
  alertsList.innerHTML = '';
  
  alerts.forEach(alert => {
    const today = new Date();
    const deadline = new Date(alert.deadline);
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    
    let daysClass = 'days-normal';
    if (daysLeft < 7) daysClass = 'days-urgent';
    else if (daysLeft < 30) daysClass = 'days-warning';
    
    const card = document.createElement('div');
    card.className = `alert-card ${alert.severity}`;
    card.innerHTML = `
      <div class="alert-header">
        <span class="alert-name">${alert.name}</span>
        <span class="alert-meta">${alert.regulation} • ${alert.severity}</span>
      </div>
      <div class="alert-deadline">
        Deadline: ${deadline.toDateString()} (${daysLeft} days)
        <span class="${daysClass}">${daysLeft < 7 ? '⚠ URGENT' : daysLeft < 30 ? '⚠ SOON' : ''}</span>
      </div>
    `;
    alertsList.appendChild(card);
  });
  
  localStorage.setItem('complianceAlerts', JSON.stringify(alerts));
}

addBtn.addEventListener('click', function() {
  const name = document.getElementById('alertName').value;
  const regulation = document.getElementById('regulation').value;
  const severity = document.getElementById('severity').value;
  const deadline = document.getElementById('deadline').value;
  
  if (!name || !deadline) return;
  
  alerts.push({ name, regulation, severity, deadline });
  renderAlerts();
  
  // Clear form
  document.getElementById('alertName').value = '';
  document.getElementById('deadline').value = '';
});

// Initialize with sample data
window.addEventListener('load', function() {
  if (alerts.length === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    alerts = [
      { name: 'GDPR Article 30 Record Keeping', regulation: 'GDPR', severity: 'high', deadline: tomorrow.toISOString().split('T')[0] },
      { name: 'SOX Section 404 Compliance', regulation: 'SOX', severity: 'medium', deadline: nextMonth.toISOString().split('T')[0] }
    ];
  }
  renderAlerts();
});