// AI Content Summarizer - Traditional vs AI-powered summarization
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const aiToggle = document.getElementById('aiToggle');
const promptSection = document.getElementById('promptSection');
const summaryPrompt = document.getElementById('summaryPrompt');
const contentInput = document.getElementById('contentInput');
const summarizeBtn = document.getElementById('summarizeBtn');
const resultSection = document.getElementById('resultSection');
const traditionalResult = document.getElementById('traditionalResult');
const aiResult = document.getElementById('aiResult');

// Default prompts for AI summarization
const defaultPrompts = {
  bullet: "Summarize in 3 concise bullet points",
  manager: "Summarize for a busy manager - key takeaways only",
  technical: "Extract technical details and implications",
  executive: "Executive summary highlighting business impact"
};

// Traditional extractive summary (first few sentences)
function getTraditionalSummary(content) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const summary = sentences.slice(0, 3).join('. ') + '.';
  return `<p>${summary}</p>`;
}

// AI abstractive summary (simulated)
function getAISummary(content, prompt) {
  const keyPoints = [
    "AI has transformed industries through machine learning and automation",
    "Organizations must balance innovation with ethical governance",
    "Collaborative efforts are essential for responsible AI development"
  ];
  
  let summary = '';
  if (prompt && prompt.toLowerCase().includes('bullet')) {
    summary = '<ul>' + keyPoints.map(p => `<li>${p}</li>`).join('') + '</ul>';
  } else if (prompt && prompt.toLowerCase().includes('manager')) {
    summary = `<p><strong>Key Insight:</strong> AI transformation requires strategic governance.</p><p>Three critical actions: 1) Establish AI ethics framework, 2) Invest in workforce reskilling, 3) Implement transparent deployment practices.</p>`;
  } else {
    summary = `<p><strong>Executive Summary:</strong> ${content.substring(0, 200)}... <em>This demonstrates how AI can provide abstractive, contextual summaries that capture the essence beyond just extracting text.</em></p>`;
  }
  
  return summary;
}

summarizeBtn.addEventListener('click', function() {
  const content = contentInput.value;
  const useAI = aiToggle.checked;
  const customPrompt = summaryPrompt.value || '';
  
  // Traditional result
  traditionalResult.innerHTML = getTraditionalSummary(content);
  
  // AI result (only if enabled)
  if (useAI) {
    aiResult.innerHTML = getAISummary(content, customPrompt);
  }
  
  resultSection.classList.remove('hidden');
});

aiToggle.addEventListener('change', function() {
  promptSection.classList.toggle('hidden', !this.checked);
});

// Initialize with sample content
window.addEventListener('load', function() {
  traditionalResult.innerHTML = getTraditionalSummary(contentInput.value);
  aiResult.innerHTML = getAISummary(contentInput.value, '');
  resultSection.classList.remove('hidden');
});