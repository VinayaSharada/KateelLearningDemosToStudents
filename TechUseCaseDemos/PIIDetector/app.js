// PII Detector - In-browser PII detection with pattern matching
// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Sample documents
const SAMPLES = {
  loan: `LOAN APPLICATION FORM

Applicant Information:
Name: John Michael Thompson
Date of Birth: March 15, 1985
Social Security Number: 456-78-9012
Email: john.thompson@email.com
Phone: (555) 234-5678

Employment History:
Employer: Acme Corporation, 123 Business Ave, New York, NY 10001
Position: Senior Software Engineer
Start Date: January 2020
Annual Salary: $125,000

Loan Details:
Loan Amount: $250,000
Purpose: Home Purchase
Property Address: 456 Oak Street, Springfield, IL 62701

Co-Applicant:
Name: Sarah Elizabeth Thompson
Phone: (555) 234-5679
Email: sarah.e.thompson@email.com

Bank References:
Chase Bank Account: 1234567890
Routing Number: 021000021

Next of Kin:
Name: Robert Thompson
Relationship: Father
Phone: (555) 345-6789
Address: 789 Maple Drive, Chicago, IL 60601`,

  contract: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on January 1, 2024, between:

EMPLOYER: TechCorp Industries, Inc.
Address: 1000 Innovation Drive, San Francisco, CA 94105
Represented by: Margaret Chen, CEO
Email: mchen@techcorp.com
Phone: (415) 555-0123

EMPLOYEE: David Nathaniel Rodriguez
Address: 234 Sunset Boulevard, San Francisco, CA 94102
Date of Birth: July 22, 1992
Social Security Number: 123-45-6789
Email: d.rodriguez@email.com
Personal Phone: (415) 555-9876
Mobile: (415) 555-9877

COMPENSATION:
- Base Salary: $180,000 per annum
- Stock Options: 10,000 shares
- Health Insurance: Premium Coverage
- 401(k) Match: 6%

CONFIDENTIALITY:
Employee agrees to maintain confidentiality regarding:
- Client lists including Smith & Associates (Contact: John Smith, (212) 555-4444)
- Technology details and trade secrets
- Financial information

Emergency Contact:
Name: Michelle Rodriguez
Relationship: Spouse
Phone: (415) 555-8765
Email: michelle.r@email.com`,

  policy: `PRIVACY POLICY - Acme Financial Services

Last Updated: January 2024

1. INFORMATION WE COLLECT
We collect personally identifiable information including:
- Full names and contact information
- Email addresses (john.doe@example.com, jane.smith@company.com)
- Phone numbers (1-800-555-0199, ext. 2345)
- Social Security Numbers for verification
- Date of birth and government-issued ID numbers
- Payment card information

2. HOW WE USE YOUR INFORMATION
We may share your data with:
- Service providers (Stripe Processing, Austin, TX)
- Regulatory authorities
- Our affiliated companies
- Third-party vendors

3. DATA RETENTION
Customer data: Jennifer Martinez (ID: 98765432)
Retention period: 7 years from last transaction
Archive location: Secure servers in Dallas, TX 75201

Contact person: Robert Washington
Email: r.washington@acmefinancial.com
Phone: (214) 555-6789

4. YOUR RIGHTS
Individuals in California (90210) can request data deletion.
EU residents under GDPR can contact: gdpr@acmefinancial.com

CEO: Lisa Anderson
Board Chair: Thomas Jefferson III
Address: 5000 Commerce Avenue, Chicago, IL 60601`,

  invoice: `INVOICE #INV-2024-001234

Invoice Date: January 15, 2024
Due Date: February 15, 2024

BILL TO:
Customer Name: Patricia Elizabeth Williams
Email: p.williams@businesscorp.com
Phone: (512) 555-1234
Address: 789 Corporate Plaza, Suite 500, Austin, TX 78701
Company: Williams & Associates LLC

SHIPPING TO:
Same as above
Contact: Patricia Williams (Mobile: (512) 555-1235)

INVOICE DETAILS:
Invoice #: INV-2024-001234
PO Number: PO-2024-5678
Project: Website Redesign Project

ITEMS:
1. Web Design Services - 40 hours @ $150/hr = $6,000
2. Development & Integration - 60 hours @ $175/hr = $10,500
3. Testing & QA - 20 hours @ $125/hr = $2,500
4. Hosting Setup & SSL - 1 month @ $500/mo = $500

Subtotal: $19,500
Tax (8.5%): $1,658
Total Due: $21,158

PAYMENT METHOD:
Credit Card ending in: 4532123456789012
Name on Card: Patricia E. Williams
Billing Zip: 78701
Expiry: 12/26

NOTES:
Invoice authorized by: Thomas J. Bennett
Finance Manager
Email: t.bennett@waa.com
Phone: (512) 555-9999
SSN (for verification): 234-56-7890`
};

// PII detection patterns
const PII_PATTERNS = {
  EMAIL: {
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    label: 'Email Address',
    confidence: 0.95
  },
  PHONE: {
    regex: /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    label: 'Phone Number',
    confidence: 0.90
  },
  SSN: {
    regex: /\b(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}\b/g,
    label: 'Social Security Number',
    confidence: 0.98
  },
  CREDIT_CARD: {
    regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    label: 'Credit Card Number',
    confidence: 0.92
  },
  ZIP_CODE: {
    regex: /\b\d{5}(?:-\d{4})?\b/g,
    label: 'ZIP Code',
    confidence: 0.85
  },
  STREET_ADDRESS: {
    regex: /\b\d+\s+[A-Za-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Circle|Court|Ct|Place|Pl|Suite|Ste),?\s+[^,\n]+,?\s+[A-Z]{2}\s+\d{5}\b/gi,
    label: 'Street Address',
    confidence: 0.88
  }
};

// DOM elements
const textInput = document.getElementById('textInput');
const pdfInput = document.getElementById('pdfInput');
const detectBtn = document.getElementById('detectBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const processingStatus = document.getElementById('processingStatus');
const confidenceSlider = document.getElementById('confidenceSlider');
const confidenceValue = document.getElementById('confidenceValue');
const sampleSelector = document.getElementById('sampleSelector');
const sampleSelect = document.getElementById('sampleSelect');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const cancelSampleBtn = document.getElementById('cancelSampleBtn');

// Results panels
const summaryPanel = document.getElementById('summaryPanel');
const highlightedText = document.getElementById('highlightedText');
const entityList = document.getElementById('entityList');
const noResults = document.getElementById('noResults');
const showConfidenceCheckbox = document.getElementById('showConfidence');
const highlightOnlyCheckbox = document.getElementById('highlightOnly');

// Event listeners
detectBtn.addEventListener('click', detectPII);
clearBtn.addEventListener('click', () => {
  textInput.value = '';
  pdfInput.value = '';
  resetResults();
});

sampleBtn.addEventListener('click', () => {
  sampleSelector.style.display = sampleSelector.style.display === 'none' ? 'block' : 'none';
});

loadSampleBtn.addEventListener('click', () => {
  const sample = SAMPLES[sampleSelect.value];
  textInput.value = sample;
  sampleSelector.style.display = 'none';
});

cancelSampleBtn.addEventListener('click', () => {
  sampleSelector.style.display = 'none';
});

confidenceSlider.addEventListener('input', (e) => {
  confidenceValue.textContent = e.target.value + '%';
});

pdfInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    document.getElementById('pdfStatus').textContent = '❌ File too large (max 10 MB)';
    return;
  }

  processingStatus.textContent = '📄 Extracting text from PDF...';
  try {
    const text = await extractTextFromPDF(file);
    textInput.value = text;
    document.getElementById('pdfStatus').textContent = `✅ Extracted ${Math.round(text.length / 100)} lines`;
    processingStatus.textContent = '';
  } catch (error) {
    document.getElementById('pdfStatus').textContent = `❌ Error: ${error.message}`;
    processingStatus.textContent = '';
  }
});

async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const pdf = await pdfjsLib.getDocument(e.target.result).promise;
        let fullText = '';

        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        resolve(fullText);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function detectPII() {
  const text = textInput.value.trim();
  if (!text) {
    alert('Please enter text or upload a PDF');
    return;
  }

  processingStatus.textContent = '🔍 Detecting PII...';
  resetResults();

  const threshold = parseInt(confidenceSlider.value) / 100;
  const detections = [];

  // Run pattern-based detection
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    let match;
    pattern.regex.lastIndex = 0;

    while ((match = pattern.regex.exec(text)) !== null) {
      detections.push({
        type,
        label: pattern.label,
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        confidence: pattern.confidence
      });
    }
  }

  // Filter by confidence threshold
  const filtered = detections.filter(d => d.confidence >= threshold);

  if (filtered.length === 0) {
    showNoResults();
    processingStatus.textContent = '';
    return;
  }

  // Sort by position for highlighting
  filtered.sort((a, b) => a.start - b.start);

  // Display results
  if (!highlightOnlyCheckbox.checked) {
    displaySummary(filtered);
    displayEntityList(filtered);
  }

  displayHighlightedText(text, filtered);

  processingStatus.textContent = '';
}

function displaySummary(detections) {
  summaryPanel.style.display = 'block';

  // Total count
  document.getElementById('totalCount').textContent = detections.length;

  // Entity type count
  const types = new Set(detections.map(d => d.type));
  document.getElementById('typeCount').textContent = types.size;

  // Average confidence
  const avgConf = (detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100).toFixed(0);
  document.getElementById('avgConfidence').textContent = avgConf + '%';

  // Entity breakdown by type
  const breakdown = {};
  detections.forEach(d => {
    if (!breakdown[d.label]) breakdown[d.label] = 0;
    breakdown[d.label]++;
  });

  const breakdownHTML = Object.entries(breakdown)
    .map(([label, count]) => {
      const typeEntry = Object.entries(PII_PATTERNS).find(([_, p]) => p.label === label);
      const type = typeEntry ? typeEntry[0] : undefined;
      const emoji = getTypeEmoji(type);
      return `<div class="breakdown-item">
        <span>${emoji} ${label}</span>
        <span class="count">${count}</span>
      </div>`;
    })
    .join('');

  document.getElementById('entityBreakdown').innerHTML = breakdownHTML;
}

function displayHighlightedText(text, detections) {
  highlightedText.style.display = 'block';
  let html = '';
  let lastEnd = 0;

  detections.forEach(d => {
    // Add text before this detection
    html += escapeHtml(text.substring(lastEnd, d.start));

    // Add highlighted entity
    const confClass = d.confidence > 0.9 ? 'high-conf' : 'medium-conf';
    const confText = showConfidenceCheckbox.checked ? ` (${(d.confidence * 100).toFixed(0)}%)` : '';
    html += `<span class="pii-entity ${d.type.toLowerCase()} ${confClass}" title="${d.label}${confText}">
      ${escapeHtml(d.text)}
    </span>`;

    lastEnd = d.end;
  });

  // Add remaining text
  html += escapeHtml(text.substring(lastEnd));

  document.getElementById('textDisplay').innerHTML = `<p>${html.replace(/\n/g, '<br>')}</p>`;
}

function displayEntityList(detections) {
  entityList.style.display = 'block';
  const html = detections.map((d, i) => {
    const confPercent = (d.confidence * 100).toFixed(0);
    const confClass = d.confidence > 0.9 ? 'high-conf' : 'medium-conf';
    return `<div class="entity-item">
      <div class="entity-header">
        <span class="entity-type ${d.type.toLowerCase()}">${getTypeEmoji(d.type)} ${d.label}</span>
        <span class="confidence ${confClass}">${confPercent}% confident</span>
      </div>
      <div class="entity-text">"${escapeHtml(d.text)}"</div>
    </div>`;
  }).join('');

  document.getElementById('entityItems').innerHTML = html;
}

function showNoResults() {
  noResults.style.display = 'block';
}

function resetResults() {
  summaryPanel.style.display = 'none';
  highlightedText.style.display = 'none';
  entityList.style.display = 'none';
  noResults.style.display = 'none';
}

function getTypeEmoji(type) {
  const emojis = {
    EMAIL: '✉️',
    PHONE: '☎️',
    SSN: '🔒',
    CREDIT_CARD: '💳',
    ZIP_CODE: '📮',
    STREET_ADDRESS: '🏠'
  };
  return emojis[type] || '📌';
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize
console.log('PII Detector ready. Patterns loaded:', Object.keys(PII_PATTERNS).length);
