# PII Detector Demo

**A browser-based personally identifiable information (PII) detection system for compliance and data governance education.**

## Overview

The PII Detector is an interactive demo that teaches students how automated systems identify sensitive information in documents. It scans text and PDFs for personally identifiable information (names, emails, phone numbers, SSNs, credit card numbers, etc.) and highlights findings with confidence scores.

**Key Features:**
- ✅ **Browser-based:** Runs entirely client-side, no server required
- ✅ **Multiple inputs:** Paste text, upload PDF, or load realistic samples
- ✅ **Real-time detection:** Immediate feedback with confidence scores
- ✅ **Visual highlighting:** Color-coded entity types with confidence indicators
- ✅ **Detailed reporting:** Summary stats, entity breakdown, individual item inspection

## Learning Objectives

Students will:
1. **Understand PII:** Learn what constitutes personally identifiable information and why it matters
2. **See detection limits:** Recognize false positives, missed entities, and context sensitivity
3. **Evaluate confidence:** Understand how machines quantify certainty in detection
4. **Appreciate human review:** Learn why automated results always require human validation
5. **Design workflows:** See how PII detection fits into data governance processes

## How It Works

### Inputs
- **Text:** Paste any text (legal documents, policies, emails, etc.)
- **PDF:** Upload a single PDF file (up to 10 MB); text is extracted automatically
- **Samples:** Load realistic examples (loan applications, contracts, policies, invoices)

### Detection
The detector uses pattern matching and regex to identify:
- **Email addresses** (format: name@domain.com)
- **Phone numbers** (format: (555) 234-5678 or variations)
- **Social Security Numbers** (format: XXX-XX-XXXX with validation)
- **Credit card numbers** (Luhn validation for authenticity)
- **Street addresses** (format: number street, city, state ZIP)
- **ZIP codes** (5-digit or 5+4 format)

### Confidence Scores
Each finding includes a confidence score (0-100%):
- **95%+:** Very likely (e.g., SSN matches validation rules)
- **85-95%:** Likely (e.g., valid phone format)
- **Below 85%:** Possible but uncertain (context-dependent)

Students can adjust the threshold to filter out low-confidence findings.

### Output
- **Highlighted Text:** Original document with PII highlighted in color
- **Summary Panel:** Total count, entity types, average confidence
- **Entity List:** Detailed view of each finding with exact text and confidence
- **Entity Breakdown:** Count by type (how many names, emails, etc.)

## Architecture

```
PII Detector
├── index.html        (Interactive demo UI)
├── about.html        (Learning guide and context)
├── app.js            (Detection logic, PDF parsing, highlighting)
├── style.css         (Responsive styling)
└── README.md         (This file)
```

### Technology Stack
- **PDF.js:** For PDF text extraction
- **Vanilla JavaScript:** Pattern matching and entity detection
- **HTML5 Canvas:** For highlighting
- **CSS Grid/Flexbox:** Responsive layout

## Usage

### For Students
1. Navigate to `index.html`
2. Choose an input method:
   - Load a sample document
   - Paste text into the textarea
   - Upload a PDF file
3. Adjust confidence threshold (optional)
4. Click "🔍 Detect PII"
5. Review results: what was found? What confidence scores?
6. Read the about page for context and learning objectives

### For Teachers
Use this demo for:
- **Lecture:** Show how PII detection works in practice
- **Assignment:** "Audit this document—what did the detector find? What did it miss?"
- **Discussion:** Why is human review required? How would you design a compliance workflow?
- **Assessment:** Students manually review detector results and explain limitations

## Entity Types Detected

| Type | Pattern | Example | Confidence |
|------|---------|---------|-----------|
| **Email** | name@domain.com | john.doe@example.com | 95% |
| **Phone** | (555) 234-5678 | (415) 555-1234 | 90% |
| **SSN** | XXX-XX-XXXX (validated) | 456-78-9012 | 98% |
| **Credit Card** | XXXX XXXX XXXX XXXX (Luhn) | 4532 1234 5678 9012 | 92% |
| **Street Address** | Number Street, City, ST ZIP | 123 Oak Street, Springfield, IL 62701 | 88% |
| **ZIP Code** | XXXXX or XXXXX-XXXX | 94105 or 94105-1234 | 85% |

## Limitations

1. **Pattern-based only:** Uses regex and heuristics, not machine learning
2. **English-centric:** Optimized for US English and US formats
3. **Context-blind:** Cannot always distinguish real PII from examples or samples
4. **False positives:** "555-1234" in an example document will be flagged
5. **False negatives:** Obfuscated or partial PII may not be detected
6. **PDF limitations:** Scanned PDFs (images) or encrypted documents won't extract text
7. **Browser limits:** Large documents (100+ pages) may slow down processing
8. **No persistence:** Results are cleared on page refresh

## Real-World Applications

### 1. Pre-Publication Audit
Before releasing case studies, white papers, testimonials:
- Scan for customer names, contact info, company names
- Ensure no internal reference numbers are exposed
- Confirm no employee information is included

### 2. Third-Party Data Sharing
Before sending documents to regulators, vendors, or partners:
- Audit for PII that doesn't need to be shared
- Redact unnecessary sensitive information
- Create a clean version for distribution

### 3. Compliance Audit
Evidence for regulatory inquiries:
- Show regulators you have processes to find and review PII
- Document what was scanned, when, and what was found
- Demonstrate data protection practices

### 4. Breach Response
After a security incident:
- Quickly scan affected documents to assess exposure
- Determine what PII was compromised
- Identify customers who need notification

### 5. Data Inventory
For legacy systems or archives:
- Find where PII lives in old documents
- Understand data retention obligations
- Plan for secure disposal or archival

## Compliance Regulations

This demo is relevant to:
- **GDPR (EU):** Article 32 requires "security of processing" and data protection impact assessments
- **CCPA (California):** Requires knowledge of personal information collected and reasonable safeguards
- **HIPAA (Healthcare):** Requires procedures to identify and manage protected health information
- **SOC 2 (Service Organizations):** Requires access controls and confidentiality protections
- **PCI DSS (Payment Cards):** Requires detection and protection of cardholder data
- **Industry-specific:** Financial services, healthcare, and government have stricter data handling rules

## Discussion Questions

### For Classrooms
1. **Detection Limits:** Your detector found 47 PII items. Do all of them need to be redacted? Why or why not?
2. **Confidence & Risk:** If confidence is 75%, is that enough to redact something without human review?
3. **False Positives:** A sample PDF contains "555-1234" (a classic fake number). Should the detector flag it?
4. **Context Matters:** Is publishing a customer's name and job title in a case study "PII exposure"? Why or why not?
5. **Workflow Design:** Design a PII detection and remediation workflow for a 1,000-person company. What are the steps?

### For Discussion
- Why do regulations mandate PII detection if humans still have to review?
- What's the cost of over-detecting (too many false positives) vs. under-detecting (missing real PII)?
- How would you explain confidence scores to a non-technical stakeholder?
- What role does context play in PII detection? Can machines ever fully replace human judgment?

## Technical Details

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive, but text input may be small

### Performance
- Small documents (< 10 KB): < 100ms
- Medium documents (10-100 KB): < 500ms
- Large documents (100+ KB): 1-5 seconds
- PDF extraction: Depends on file size and complexity

### Security
- **No server communication:** All processing happens in your browser
- **No data logging:** Your text is never stored or transmitted
- **PDF parsing:** Handled locally via PDF.js library
- **Privacy:** Safe for sensitive content—nothing leaves your machine

## Code Structure

### app.js
```javascript
// PII detection patterns with confidence scores
PII_PATTERNS = {
  EMAIL: { regex: ..., confidence: 0.95 },
  PHONE: { regex: ..., confidence: 0.90 },
  SSN: { regex: ..., confidence: 0.98 },
  CREDIT_CARD: { regex: ..., confidence: 0.92 },
  ZIP_CODE: { regex: ..., confidence: 0.85 },
  STREET_ADDRESS: { regex: ..., confidence: 0.88 }
}

// Main detection function
detectPII() {
  // Extract text from input
  // Run all regex patterns
  // Filter by confidence threshold
  // Highlight entities in original text
  // Display results
}

// PDF extraction
extractTextFromPDF(file) {
  // Use PDF.js to extract text from uploaded PDF
  // Return full text for detection
}
```

## Customization

### Add New Entity Type
Edit `PII_PATTERNS` in `app.js`:
```javascript
PASSPORT: {
  regex: /[A-Z]{1,2}\d{6,9}/g,
  label: 'Passport Number',
  confidence: 0.92
}
```

### Adjust Confidence Defaults
Change the slider default or preset thresholds:
```javascript
confidenceSlider.value = 70; // Default to 70% instead of 50%
```

### Change Colors
Edit `style.css` to customize highlighting colors:
```css
.pii-entity.email {
  --highlight-bg: #yourcolor;
  --highlight-border: #yourborder;
}
```

## For Developers

### Adding to Course Pack
1. Add entry to `courses/compliance.html` ItemList schema
2. Add navigation link to course page
3. Update sitemap.xml if needed
4. Test on mobile and desktop browsers

### Future Enhancements
- Machine learning model (GLiNER2) for better accuracy
- Multi-language support
- Custom pattern editor
- Batch processing for multiple documents
- Export results to CSV/JSON
- Redaction templates (auto-blur or remove found PII)

## License & Attribution

This demo is part of [KateelLearningDemos](https://github.com/VinayaSharada/KateelLearningDemosToStudents), an open-source education platform.

**Created by:** Professor Vinaya Sathyanarayana
**Built with:** PDF.js, Vanilla JavaScript, HTML5, CSS3

## Support & Feedback

Have suggestions or found a bug? [Open an issue on GitHub](https://github.com/VinayaSharada/KateelLearningDemosToStudents/issues)

## Business decision

Use this demo to make the central decision in PII Detector Demo explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
