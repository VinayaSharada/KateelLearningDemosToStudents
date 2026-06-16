// Zero Trust Architecture Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const userSelect = document.getElementById('userSelect');
const resourceSelect = document.getElementById('resourceSelect');
const requestAccessBtn = document.getElementById('requestAccessBtn');
const resultSection = document.getElementById('resultSection');
const decisionResult = document.getElementById('decisionResult');
const policyDetails = document.getElementById('policyDetails');

// Zero trust policies
const policies = {
  alice: {
    role: 'developer',
    clearance: 'medium',
    resources: ['api', 'fileshare'],
    admin: false
  },
  bob: {
    role: 'analyst',
    clearance: 'low',
    resources: ['api'],
    admin: false
  },
  charlie: {
    role: 'guest',
    clearance: 'none',
    resources: [],
    admin: false
  }
};

const resourcePolicies = {
  database: { minClearance: 'medium', adminOnly: false },
  api: { minClearance: 'low', adminOnly: false },
  fileshare: { minClearance: 'medium', adminOnly: false },
  admin: { minClearance: 'high', adminOnly: true }
};

requestAccessBtn.addEventListener('click', function() {
  const user = userSelect.value;
  const resource = resourceSelect.value;
  const userData = policies[user];
  const resourcePolicy = resourcePolicies[resource];
  
  let decision = 'DENIED';
  let reason = '';
  
  if (resourcePolicy.adminOnly && !userData.admin) {
    reason = 'Admin access required';
  } else if (userData.clearance === 'none') {
    reason = 'No clearance level';
  } else if (userData.resources.includes(resource)) {
    decision = 'ALLOWED';
    reason = `Access granted based on ${userData.role} role`;
  } else if (userData.clearance === 'high') {
    decision = 'ALLOWED';
    reason = 'High clearance override';
  } else {
    reason = 'Resource not in user\'s access scope';
  }
  
  // Display result
  decisionResult.className = `decision-card ${decision === 'ALLOWED' ? 'decision-allowed' : 'decision-denied'}`;
  decisionResult.innerHTML = `
    <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">
      ${decision}
    </div>
    <div>Access to <strong>${resource}</strong> for user <strong>${user}</strong></div>
  `;
  
  policyDetails.innerHTML = `
    <div><strong>Reason:</strong> ${reason}</div>
    <div><strong>User Role:</strong> ${userData.role} | <strong>Clearance:</strong> ${userData.clearance}</div>
    <div><strong>Resource Policy:</strong> Minimum clearance: ${resourcePolicy.minClearance}</div>
  `;
  
  resultSection.classList.remove('hidden');
});