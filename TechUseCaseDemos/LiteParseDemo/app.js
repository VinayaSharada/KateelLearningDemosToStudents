// LiteParse RAG Demo
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

// Demo document content (simulating LiteParse output)
const sampleDocument = `# Financial Report 2024

## Executive Summary
This report outlines the financial performance of our company in 2024.

### Key Metrics
- Revenue: $10M
- Profit Margin: 15%
- Customer Growth: 25%

## Investment Recommendations
Based on the analysis, we recommend increasing investment in AI technologies.

### Risk Factors
- Market volatility
- Regulatory changes
- Technology adoption rates

## Conclusion
The company is well-positioned for future growth.`;

document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const markdownOutput = document.getElementById('markdownOutput');
  const questionInput = document.getElementById('questionInput');
  const askButton = document.getElementById('askButton');
  const answerOutput = document.getElementById('answerOutput');

  // Sample document is loaded by default
  markdownOutput.textContent = sampleDocument;

  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#00d9ff';
  });
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#444';
  });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#444';
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFile(fileInput.files[0]);
    }
  });

  askButton.addEventListener('click', () => {
    const question = questionInput.value.trim();
    if (question) {
      answerOutput.style.display = 'block';
      answerOutput.innerHTML = `<strong>Answer:</strong> This is a demo response. In production, LiteParse would extract text from your PDF and a Q&A model would answer based on the content.`;
    }
  });

  function handleFile(file) {
    if (file.type === 'application/pdf') {
      markdownOutput.textContent = `Processing ${file.name}...\n\n[In production, LiteParse would convert this PDF to markdown using the command:]\n\nlit parse ${file.name} --format markdown\n\n[Or using Python:]\n\nfrom liteparse import LiteParse\nlp = LiteParse(output_format="markdown")\nresult = lp.parse("${file.name}")`;
    } else {
      markdownOutput.textContent = 'Please upload a valid PDF file.';
    }
  }
});