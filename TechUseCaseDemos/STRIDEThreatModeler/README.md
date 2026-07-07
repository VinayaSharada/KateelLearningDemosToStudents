# STRIDE Threat Modeler

Interactive browser-based threat modeling using STRIDE methodology. Build data flow diagrams and automatically identify security threats.

## Files in This Folder

- `index.html` - Main demo application
- `about.html` - Learning guide and context
- `app.js` - Core threat modeling engine and DFD editor
- `threatCatalog.json` - 20+ pre-built STRIDE threat rules
- `style.css` - Styling for demo interface
- `README.md` - This file

## Quick Start

1. Open `index.html` in a modern web browser
2. Click "Add Entity" and place elements on the canvas (User, API, Database, etc.)
3. Configure security properties for each entity (authentication, encryption, validation)
4. Add data flows between entities using "Add Data Flow"
5. Click "Analyze Threats" to auto-generate STRIDE threats
6. Review threat descriptions, severity levels, and mitigations

## What is STRIDE?

STRIDE is a systematic threat modeling methodology that identifies six categories of security threats:

| Category | Focus | Examples |
|----------|-------|----------|
| **Spoofing** | Identity attacks | Fake credentials, impersonation, DNS spoofing |
| **Tampering** | Data modification | SQL injection, man-in-the-middle, data corruption |
| **Repudiation** | Denial of actions | Lack of audit logs, no digital signatures |
| **Information Disclosure** | Privacy leaks | Unencrypted transmission, debug output, weak access control |
| **Denial of Service** | Availability attacks | DoS floods, resource exhaustion, unpatched vulnerabilities |
| **Elevation of Privilege** | Unauthorized access | Weak authorization, privilege escalation, insecure deserialization |

## Demo Features

### DFD Editor
- **Visual canvas** - Drag-and-drop entity placement with grid snapping
- **Entity types** - External Actor, External System, Process, Data Store
- **Data flows** - Label connections with protocol and security properties
- **Interactive controls** - Edit entity names, toggle security properties

### Threat Analysis Engine
- **20+ threat rules** - Pre-built STRIDE threat catalog
- **Auto-generation** - Identifies threats based on architecture patterns
- **Risk severity** - Critical, High, Medium ratings
- **Mitigations** - Concrete steps to prevent each threat
- **CWE mapping** - Links to Common Weakness Enumeration

### Export Options
- **JSON export** - Full DFD model and threat list for archiving
- **Markdown export** - Formatted report for documentation

## Threat Catalog

The demo includes threat rules across all STRIDE categories:

### Spoofing (S001-S003)
- Unencrypted communication enables identity spoofing
- Missing authentication allows impersonation
- Weak credential storage enables brute force

### Tampering (T001-T004)
- Unencrypted transit allows data modification
- No integrity checking hides tampering
- Unvalidated input enables injection
- SQL queries without parameterization enable SQLi

### Repudiation (R001-R002)
- Missing audit logs allow action denial
- Non-repudiation failures hide origin

### Information Disclosure (I001-I004)
- Sensitive data exposure in transit
- Unencrypted data at rest
- Debug information exposure
- Insufficient access controls

### Denial of Service (D001-D003)
- No rate limiting enables request flooding
- Unbounded resources enable exhaustion
- Missing DDoS protection

### Elevation of Privilege (E001-E004)
- Missing authorization checks
- Weak password policies
- Insecure deserialization
- Overly permissive roles

## Learning Objectives

Students should be able to:
- Apply STRIDE methodology systematically to system architectures
- Design data flow diagrams with appropriate security markings
- Identify threat patterns from architecture decisions
- Map threats to specific mitigations and controls
- Prioritize threats by severity and business impact
- Iterate designs to reduce threat surface area

## Example Scenarios

### Scenario 1: E-Commerce System
DFD: Customer → Web App → Payment Gateway → Bank

**Key threats identified:**
- Unencrypted customer data in transit
- Payment API without mutual authentication
- Database without input validation

**Mitigations:**
- Enable TLS 1.2+ for all flows
- Implement OAuth 2.0 for API authentication
- Add SQL injection prevention (parameterized queries)

### Scenario 2: Healthcare Portal
DFD: Patient → Mobile App → API Gateway → EHR Database → Audit Log

**Key threats identified:**
- HIPAA-regulated data without encryption at rest
- API without rate limiting (DoS vulnerability)
- Insufficient audit logging for compliance

**Mitigations:**
- AES-256 encryption for PHI at rest
- Implement rate limiting and throttling
- Comprehensive audit trail with immutable logs

## Classroom Activities

### Activity 1: Threat Awareness (30 min)
1. Load the sample DFD (User → Web API → Database)
2. Have students predict threats before analyzing
3. Run analysis and compare predictions to actual findings
4. Discuss why each threat applies

### Activity 2: Design-Driven Security (45 min)
1. Provide a system description (e.g., "social media platform")
2. Students design the DFD from scratch
3. Analyze threats and identify top 5 critical risks
4. Propose mitigations and re-analyze

### Activity 3: Mitigation Challenge (45 min)
1. Provide a vulnerable DFD (all unencrypted, no auth, no validation)
2. Ask students to fix threats without redesigning
3. Each fix must have a specific security property change
4. Grade based on thoroughness of mitigations

## Technical Details

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires JavaScript enabled, no external dependencies

### Architecture
- **Canvas-based DFD rendering** - Uses HTML5 Canvas for visual layout
- **Rule-based threat engine** - Trigger patterns match architecture features
- **JSON data model** - DFD and threats serialize as JSON
- **Local storage** - Models persist in browser (no cloud required)

### Performance
- Handles 20-30 entities efficiently
- Threat analysis completes in <100ms
- Real-time visual updates on canvas

## Pedagogical Approach

This demo follows a **learn-by-doing** pattern:

1. **Conceptual foundation** - About page explains STRIDE categories
2. **Interactive exploration** - Build and modify DFDs visually
3. **Immediate feedback** - Threats auto-generate on demand
4. **Guided discovery** - Pre-built examples show patterns
5. **Self-assessment** - Export results for reflection

Students internalize threat patterns through hands-on iteration, not passive viewing.

## Integration with Other Tools

### Export for Further Analysis
- JSON export can be imported into other threat modeling tools
- Markdown export creates documentation-ready reports
- Models can be versioned in Git for tracking threat evolution

### Curriculum Alignment
- **Security Engineering** - Understand threat modeling processes
- **Risk Management** - Quantify and prioritize threats
- **Software Architecture** - Design with security properties in mind
- **Compliance** - Map threats to regulatory requirements (HIPAA, PCI-DSS, etc.)

## Future Enhancements

Potential additions (not in MVP):
- PlantUML C4 diagram import
- DREAD/CVSS risk scoring
- Threat remediation tracking
- Integration with OWASP Top 10 and CWE mappings
- Multi-user collaboration features
- Threat model versioning

## References

- **Microsoft Threat Modeling Tool** - https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool
- **OWASP Threat Modeling** - https://owasp.org/www-community/Threat_Modeling
- **Adam Shostack's STRIDE** - https://www.amazon.com/Threat-Modeling-Design-Security-Buildings/dp/1118809998
- **OWASP pytm** - https://github.com/OWASP/pytm
- **Threagile** - https://github.com/Threagile/threagile

## License

Part of KateelLearningDemosToStudents. Created by Professor Vinaya Sathyanarayana.

For attribution and reuse, contact vinallcontact@gmail.com
