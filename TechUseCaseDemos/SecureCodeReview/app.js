// Secure Code Review - Static analysis for security vulnerabilities
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const codeInput = document.getElementById('codeInput');
const reviewBtn = document.getElementById('reviewBtn');
const resultsSection = document.getElementById('resultsSection');

const totalIssuesEl = document.getElementById('totalIssues');
const criticalCountEl = document.getElementById('criticalCount');
const highCountEl = document.getElementById('highCount');
const issuesList = document.getElementById('issuesList');

// Security patterns to detect
const securityPatterns = [
  { pattern: /password\s*=\s*['"][^'"]+['"]/i, severity: 'critical', title: 'Hardcoded Password', desc: 'Password is hardcoded in source code' },
  { pattern: /api_key\s*=\s*['"][^'"]+['"]/i, severity: 'critical', title: 'Hardcoded API Key', desc: 'API key is hardcoded in source code' },
  { pattern: /eval\s*\(/i, severity: 'high', title: 'Code Injection Risk', desc: 'Use of eval() can lead to code injection' },
  { pattern: /innerHTML\s*=/i, severity: 'high', title: 'XSS Risk', desc: 'innerHTML can lead to XSS vulnerabilities' },
  { pattern: /document\.write\s*\(/i, severity: 'high', title: 'XSS Risk', desc: 'document.write can lead to XSS vulnerabilities' },
  { pattern: /SELECT\s+.*\s+FROM/i, severity: 'high', title: 'SQL Injection Risk', desc: 'Direct SQL query may be vulnerable to injection' },
  { pattern: /exec\s*\(/i, severity: 'medium', title: 'Command Injection Risk', desc: 'exec() can be dangerous with user input' },
  { pattern: /shell_exec\s*\(/i, severity: 'medium', title: 'Shell Command Risk', desc: 'shell_exec can be dangerous' },
  { pattern: /chmod\s+0777/i, severity: 'medium', title: 'Overly Permissive Permissions', desc: 'chmod 0777 gives full permissions to everyone' }
];

reviewBtn.addEventListener('click', function() {
  const code = codeInput.value;
  const issues = [];
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    securityPatterns.forEach(p => {
      if (p.pattern.test(line)) {
        issues.push({
          severity: p.severity,
          title: p.title,
          desc: p.desc,
          line: index + 1,
          content: line.trim().substring(0, 60)
        });
      }
    });
  });
  
  // Update stats
  totalIssuesEl.textContent = issues.length;
  criticalCountEl.textContent = issues.filter(i => i.severity === 'critical').length;
  highCountEl.textContent = issues.filter(i => i.severity === 'high').length;
  
  // Render issues
  issuesList.innerHTML = '';
  issues.forEach(issue => {
    const div = document.createElement('div');
    div.className = `issue-item ${issue.severity}`;
    div.innerHTML = `
      <div class="issue-title">${issue.title} (${issue.severity.toUpperCase()})</div>
      <div class="issue-desc">${issue.desc}</div>
      <div class="issue-line">Line ${issue.line}: ${issue.content}</div>
    `;
    issuesList.appendChild(div);
  });
  
  resultsSection.classList.remove('hidden');
});