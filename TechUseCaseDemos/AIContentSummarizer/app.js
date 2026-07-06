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

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
  'that', 'these', 'those', 'it', 'its', 'as', 'if', 'then', 'than',
  'so', 'such', 'no', 'not', 'only', 'own', 'same', 'too', 'very',
  'just', 'also', 'now', 'here', 'there', 'when', 'where', 'why', 'how'
]);

function wordCount(text) {
  return (text.match(/\b\w+\b/g) || []).length;
}

// Real extractive summarization: score each sentence by the frequency of
// its non-stopword terms, then keep the top-scoring sentences in their
// original order. This is what "traditional" extractive summarization
// actually does — earlier versions of this demo just took the first three
// sentences, which isn't extractive summarization at all.
function getTraditionalSummary(content, maxSentences = 3) {
  const sentences = content
    .replace(/([.!?])\s*(?=[A-Z])/g, '$1|SPLIT|')
    .split('|SPLIT|')
    .map(s => s.trim())
    .filter(s => s.length > 20);

  if (sentences.length === 0) return { html: '<p><em>Enter at least one full sentence.</em></p>', summaryWords: 0 };

  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const freq = {};
  words.forEach(w => {
    if (!STOPWORDS.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1;
  });

  const scored = sentences.map((sentence, index) => {
    const sentWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    const score = sentWords.reduce((sum, w) => sum + (freq[w] || 0), 0);
    return { sentence, index, score };
  });

  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(maxSentences, sentences.length))
    .sort((a, b) => a.index - b.index) // restore original reading order
    .map(item => item.sentence);

  const summaryText = top.join(' ');
  return { html: `<p>${summaryText}</p>`, summaryWords: wordCount(summaryText) };
}

// AI abstractive summary (simulated — no model call happens here; this
// represents what an LLM response would look like for teaching purposes).
function getAISummary(content, prompt) {
  const keyPoints = [
    "AI has transformed industries through machine learning and automation",
    "Organizations must balance innovation with ethical governance",
    "Collaborative efforts are essential for responsible AI development"
  ];

  let html = '';
  if (prompt && prompt.toLowerCase().includes('bullet')) {
    html = '<ul>' + keyPoints.map(p => `<li>${p}</li>`).join('') + '</ul>';
  } else if (prompt && prompt.toLowerCase().includes('manager')) {
    html = `<p><strong>Key Insight:</strong> AI transformation requires strategic governance.</p><p>Three critical actions: 1) Establish AI ethics framework, 2) Invest in workforce reskilling, 3) Implement transparent deployment practices.</p>`;
  } else {
    html = `<p><strong>Executive Summary:</strong> ${content.substring(0, 200)}... <em>This demonstrates how AI can provide abstractive, contextual summaries that capture the essence beyond just extracting text.</em></p>`;
  }

  const plainText = html.replace(/<[^>]+>/g, ' ');
  return { html, summaryWords: wordCount(plainText) };
}

function renderStats(container, sourceWords, summaryWords) {
  const ratio = sourceWords > 0 ? Math.round((1 - summaryWords / sourceWords) * 100) : 0;
  const stats = document.createElement('div');
  stats.className = 'result-stats';
  stats.innerHTML = `${summaryWords} words vs. ${sourceWords} source words — ${ratio}% compression`;
  container.appendChild(stats);
}

summarizeBtn.addEventListener('click', function() {
  const content = contentInput.value;
  const useAI = aiToggle.checked;
  const customPrompt = summaryPrompt.value || '';
  const sourceWords = wordCount(content);

  const traditional = getTraditionalSummary(content);
  traditionalResult.innerHTML = traditional.html;
  renderStats(traditionalResult, sourceWords, traditional.summaryWords);

  if (useAI) {
    const ai = getAISummary(content, customPrompt);
    aiResult.innerHTML = ai.html;
    renderStats(aiResult, sourceWords, ai.summaryWords);
  }

  resultSection.classList.remove('hidden');
});

aiToggle.addEventListener('change', function() {
  promptSection.classList.toggle('hidden', !this.checked);
});

// Initialize with sample content
window.addEventListener('load', function() {
  const content = contentInput.value;
  const sourceWords = wordCount(content);

  const traditional = getTraditionalSummary(content);
  traditionalResult.innerHTML = traditional.html;
  renderStats(traditionalResult, sourceWords, traditional.summaryWords);

  const ai = getAISummary(content, '');
  aiResult.innerHTML = ai.html;
  renderStats(aiResult, sourceWords, ai.summaryWords);

  resultSection.classList.remove('hidden');
});
