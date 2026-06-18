// AI Data Analyzer - Traditional vs AI-powered data analysis
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const aiToggle = document.getElementById('aiToggle');
const promptSection = document.getElementById('promptSection');
const analysisPrompt = document.getElementById('analysisPrompt');
const dataInput = document.getElementById('dataInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const traditionalResult = document.getElementById('traditionalResult');
const aiResult = document.getElementById('aiResult');

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => parseFloat(v.trim()) || v.trim());
    const row = {};
    headers.forEach((h, idx) => row[h] = values[idx]);
    data.push(row);
  }
  return { headers, data };
}

// Traditional analysis (basic stats)
function getTraditionalAnalysis(csvText) {
  const { headers, data } = parseCSV(csvText);
  const numericCols = headers.filter(h => !isNaN(data[0][h]));
  
  let html = '<table><tr><th>Column</th><th>Min</th><th>Max</th><th>Avg</th></tr>';
  numericCols.forEach(col => {
    const values = data.map(r => r[col]).filter(v => !isNaN(v));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a,b) => a+b, 0) / values.length;
    html += `<tr><td>${col}</td><td>${min}</td><td>${max}</td><td>${avg.toFixed(2)}</td></tr>`;
  });
  html += '</table>';
  return html;
}

// AI analysis (simulated insights)
function getAIAnalysis(csvText, focus) {
  const { data } = parseCSV(csvText);
  
  if (focus === 'trends') {
    return `
      <ul>
        <li><strong>Upward Trend:</strong> Sales increased from 980 to 1600 (+63%)</li>
        <li><strong>Weekend Dip:</strong> Saturday/Sunday show lower sales</li>
        <li><strong>Growth Rate:</strong> Average daily increase of ~100 units</li>
      </ul>
    `;
  } else if (focus === 'anomalies') {
    return `
      <ul>
        <li><strong>Anomaly Detected:</strong> Jan 6 sales (980) below trend</li>
        <li><strong>Possible Cause:</strong> Weekend effect or data issue</li>
        <li><strong>Recommendation:</strong> Investigate Jan 6 data collection</li>
      </ul>
    `;
  } else if (focus === 'insights') {
    return `
      <ul>
        <li><strong>Conversion Correlation:</strong> Higher traffic = higher conversion</li>
        <li><strong>Revenue Opportunity:</strong> Focus on visitor-to-sale funnel</li>
        <li><strong>Scaling Insight:</strong> Linear growth suggests predictable capacity needs</li>
      </ul>
    `;
  } else {
    return `
      <ul>
        <li><strong>Projection:</strong> Sales could reach 2000 by end of next week</li>
        <li><strong>Growth Rate:</strong> 8-10% daily increase expected</li>
        <li><strong>Risk:</strong> Monitor server capacity for traffic growth</li>
      </ul>
    `;
  }
}

analyzeBtn.addEventListener('click', function() {
  const csv = dataInput.value;
  const useAI = aiToggle.checked;
  const focus = analysisPrompt.value;
  
  // Traditional result
  traditionalResult.innerHTML = getTraditionalAnalysis(csv);
  
  // AI result
  if (useAI) {
    aiResult.innerHTML = getAIAnalysis(csv, focus);
  }
  
  resultSection.classList.remove('hidden');
});

aiToggle.addEventListener('change', function() {
  promptSection.classList.toggle('hidden', !this.checked);
});