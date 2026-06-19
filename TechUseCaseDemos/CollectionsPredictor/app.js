// Collections Predictor
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('Collections Predictor - Powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Simulated ML prediction (simplified for demo)
function predictPaymentProbability(invoice) {
  // Simple heuristic-based prediction for demo
  // In production, this would be a trained ML model
  
  const baseProb = 95;
  let adjustment = 0;
  
  // Age factor
  if (invoice.age > 90) adjustment -= 40;
  else if (invoice.age > 60) adjustment -= 25;
  else if (invoice.age > 30) adjustment -= 10;
  
  // Amount factor (higher amounts = slightly lower probability)
  if (invoice.amount > 200000) adjustment -= 5;
  
  return Math.max(10, Math.min(95, baseProb + adjustment));
}

function predictDisputeRisk(invoice) {
  // Simple heuristic for dispute risk
  let risk = 10;
  
  if (invoice.age > 60) risk += 20;
  if (invoice.age > 90) risk += 30;
  if (invoice.amount > 200000) risk += 15;
  
  return Math.min(100, risk);
}

// Initialize demo
document.addEventListener('DOMContentLoaded', function() {
  console.log('Collections Predictor initialized');
});