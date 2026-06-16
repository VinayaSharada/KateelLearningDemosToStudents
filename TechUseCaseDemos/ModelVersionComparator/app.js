// Model Version Comparator
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const compareBtn = document.getElementById('compareBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsBody = document.getElementById('resultsBody');
const recommendation = document.getElementById('recommendation');

compareBtn.addEventListener('click', function() {
  const modelA = {
    name: document.getElementById('modelAName').value,
    version: document.getElementById('modelAVersion').value,
    accuracy: parseFloat(document.getElementById('modelAAccuracy').value),
    precision: parseFloat(document.getElementById('modelAPrecision').value),
    recall: parseFloat(document.getElementById('modelARecall').value),
    latency: parseFloat(document.getElementById('modelALatency').value)
  };
  
  const modelB = {
    name: document.getElementById('modelBName').value,
    version: document.getElementById('modelBVersion').value,
    accuracy: parseFloat(document.getElementById('modelBAccuracy').value),
    precision: parseFloat(document.getElementById('modelBPrecision').value),
    recall: parseFloat(document.getElementById('modelBRecall').value),
    latency: parseFloat(document.getElementById('modelBLatency').value)
  };
  
  renderComparison(modelA, modelB);
  resultsSection.classList.remove('hidden');
});

function renderComparison(a, b) {
  const metrics = [
    { name: 'Accuracy', key: 'accuracy', higherBetter: true },
    { name: 'Precision', key: 'precision', higherBetter: true },
    { name: 'Recall', key: 'recall', higherBetter: true },
    { name: 'Latency (ms)', key: 'latency', higherBetter: false }
  ];
  
  resultsBody.innerHTML = '';
  let improvements = 0;
  
  metrics.forEach(metric => {
    const valA = a[metric.key];
    const valB = b[metric.key];
    const diff = valB - valA;
    const changeClass = (metric.higherBetter && diff > 0) || (!metric.higherBetter && diff < 0) ? 'improve' : diff > 0 ? 'decline' : 'improve';
    const changeText = metric.higherBetter ? 
      `${((diff / valA) * 100).toFixed(1)}%` : 
      `${((diff / valA) * 100).toFixed(1)}%`;
    
    if (changeClass === 'improve') improvements++;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${metric.name}</td>
      <td>${valA.toFixed(3)}</td>
      <td>${valB.toFixed(3)}</td>
      <td class="${changeClass}">${changeText}</td>
    `;
    resultsBody.appendChild(row);
  });
  
  recommendation.classList.remove('hidden');
  if (improvements >= 3) {
    recommendation.innerHTML = `<strong>Recommendation:</strong> Model B shows significant improvements. Consider promoting to production with proper validation.`;
    recommendation.style.borderLeftColor = '#4caf50';
  } else if (improvements >= 2) {
    recommendation.innerHTML = `<strong>Recommendation:</strong> Model B shows moderate improvements. Run A/B tests before full rollout.`;
    recommendation.style.borderLeftColor = '#ff9800';
  } else {
    recommendation.innerHTML = `<strong>Recommendation:</strong> Model B shows limited improvements. Consider further optimization or keeping Model A.`;
    recommendation.style.borderLeftColor = '#f44336';
  }
}