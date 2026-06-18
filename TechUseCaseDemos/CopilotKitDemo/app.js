// CopilotKit Agent Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

import { CopilotKit } from '@copilotkit/react-core';
import { CopilotKitWidget } from '@copilotkit/react-ui';

// Demo mode: Shows how CopilotKit would be used
// For full functionality, connect to a backend with LLM provider

const chatContainer = document.getElementById('chatContainer');
const queryInput = document.getElementById('queryInput');
const sendBtn = document.getElementById('sendBtn');

// Sample responses for demo purposes
const sampleResponses = {
  'black-scholes': 'Using Black-Scholes formula: C = S·N(d₁) - K·e^(-rT)·N(d₂)\nWith S=100, K=105, T=0.5, r=0.05, σ=0.2:\nCall Price ≈ $8.02\nPut Price ≈ $12.20',
  'portfolio variance': 'For 60% stocks (20% vol) and 40% bonds (5% vol):\nPortfolio Variance = 0.6²×0.2² + 0.4²×0.05²\n= 0.0144 + 0.0004 = 0.0148\nPortfolio Std Dev ≈ 12.16%',
  'risk parity': 'Risk Parity equalizes risk contribution:\n- Weight_i ∝ 1/σ_i\n- Lower volatility assets get higher weights\n- More stable than equal weighting\n- Example: 50% vol asset gets 33% weight, 20% vol gets 50% weight'
};

function addMessage(role, content) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${role}`;
  msgDiv.innerHTML = `<div class="message-content"><strong>${role === 'assistant' ? 'Assistant' : 'You'}:</strong> ${content}</div>`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getSampleResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('black-scholes') || q.includes('option price')) return sampleResponses['black-scholes'];
  if (q.includes('portfolio') && q.includes('variance')) return sampleResponses['portfolio variance'];
  if (q.includes('risk parity')) return sampleResponses['risk parity'];
  return "I can help with quantitative finance calculations, risk analysis, and portfolio optimization. Try asking about Black-Scholes, risk parity, or portfolio variance!";
}

sendBtn.addEventListener('click', () => {
  const query = queryInput.value.trim();
  if (!query) return;
  addMessage('user', query);
  queryInput.value = '';
  
  // Simulate CopilotKit agent response
  setTimeout(() => {
    addMessage('assistant', getSampleResponse(query));
  }, 500);
});

queryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

// Initialize with welcome message
window.addEventListener('load', () => {
  // Demo shows CopilotKit integration pattern
  console.log('CopilotKit Demo - For full functionality, see: https://github.com/copilotkit/copilotkit');
});