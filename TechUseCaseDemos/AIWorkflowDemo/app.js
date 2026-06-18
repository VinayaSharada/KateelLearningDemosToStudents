// AI Workflow Demo - Learning Resource Recommender
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const workflowSelect = document.getElementById('workflowSelect');
const queryInput = document.getElementById('queryInput');
const searchBtn = document.getElementById('searchBtn');
const promptSection = document.getElementById('promptSection');
const promptInput = document.getElementById('promptInput');
const customPromptBtn = document.getElementById('customPromptBtn');
const resultsGrid = document.getElementById('resultsGrid');
const resultsTitle = document.getElementById('resultsTitle');

// Sample resources
const resources = [
  { id: 1, title: 'Introduction to Machine Learning', type: 'video', duration: '12m', tags: ['ml', 'beginner'], relevance: 0.95 },
  { id: 2, title: 'Deep Learning Fundamentals', type: 'article', pages: 24, tags: ['dl', 'intermediate'], relevance: 0.88 },
  { id: 3, title: 'Neural Networks Explained', type: 'video', duration: '18m', tags: ['nn', 'beginner'], relevance: 0.92 },
  { id: 4, title: 'Python for Data Science', type: 'book', pages: 320, tags: ['python', 'datascience'], relevance: 0.85 },
  { id: 5, title: 'Statistics for ML', type: 'article', pages: 12, tags: ['stats', 'math'], relevance: 0.78 },
  { id: 6, title: 'AI Ethics Guide', type: 'guide', pages: 45, tags: ['ethics', 'responsible'], relevance: 0.72 }
];

// AI-powered recommendation logic
function getAIRecommendations(query, customPrompt) {
  const lowerQuery = query.toLowerCase();
  let filtered = [...resources];
  
  // Simulate AI understanding of natural language
  if (lowerQuery.includes('beginner') || lowerQuery.includes('simple')) {
    filtered = filtered.filter(r => r.tags.includes('beginner'));
  }
  if (lowerQuery.includes('machine learning') || lowerQuery.includes('ml')) {
    filtered = filtered.filter(r => r.tags.some(t => t.includes('ml') || t.includes('nn')));
  }
  if (lowerQuery.includes('data science')) {
    filtered = filtered.filter(r => r.tags.includes('datascience') || r.tags.includes('python'));
  }
  
  // Simulate prompt-based filtering
  if (customPrompt && customPrompt.toLowerCase().includes('interactive')) {
    filtered = filtered.filter(r => r.type === 'video');
  }
  
  return filtered.sort((a, b) => b.relevance - a.relevance).slice(0, 4);
}

// Traditional recommendation logic
function getTraditionalRecommendations(query) {
  const lowerQuery = query.toLowerCase();
  return resources.filter(r => 
    r.title.toLowerCase().includes(lowerQuery) || 
    r.tags.some(t => t.includes(lowerQuery.split(' ')[0]))
  ).slice(0, 4);
}

function renderResults(resources, isAI) {
  resultsGrid.innerHTML = '';
  resultsTitle.textContent = isAI ? 'AI-Personalized Recommendations' : 'Keyword Search Results';
  
  resources.forEach(r => {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
      <h3>${r.title}</h3>
      <p>${r.type === 'video' ? `🎬 ${r.duration} video` : r.type === 'book' ? `📚 ${r.pages} pages` : `📄 ${r.pages || 'Article'} pages`}</p>
      <div class="resource-meta">Relevance: ${(r.relevance * 100).toFixed(0)}%</div>
    `;
    resultsGrid.appendChild(card);
  });
}

searchBtn.addEventListener('click', function() {
  const query = queryInput.value.trim();
  if (!query) return;
  
  const isAI = workflowSelect.value === 'ai';
  let results;
  
  if (isAI) {
    const customPrompt = promptInput.value.trim();
    results = getAIRecommendations(query, customPrompt);
  } else {
    results = getTraditionalRecommendations(query);
  }
  
  renderResults(results, isAI);
});

workflowSelect.addEventListener('change', function() {
  promptSection.classList.toggle('hidden', this.value !== 'ai');
});

customPromptBtn.addEventListener('click', function() {
  const query = queryInput.value.trim();
  if (!query) return;
  const customPrompt = promptInput.value.trim();
  const results = getAIRecommendations(query, customPrompt);
  renderResults(results, true);
});

// Initialize
promptSection.classList.add('hidden');