# Secure Code Review

## Learning Objectives
- Identify common security vulnerabilities in code
- Understand static analysis for security
- Learn secure coding best practices
- Practice threat modeling for code

## How to Run
1. Open `index.html` in a browser
2. Paste code into the text area
3. Click "Review for Security Issues"
4. Review detected vulnerabilities

## Detected Vulnerability Types
- **Critical**: Hardcoded credentials, API keys
- **High**: Code injection, XSS, SQL injection
- **Medium**: Command injection, insecure permissions

## Security Patterns Checked
- Hardcoded passwords and secrets
- Use of dangerous functions (eval, innerHTML, document.write)
- SQL injection patterns
- Command injection risks
- File permission issues

## Best Practices
1. Never hardcode credentials
2. Use parameterized queries
3. Sanitize user input
4. Use secure alternatives to dangerous functions
5. Follow principle of least privilege

## Attribution
This demo is part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) by Professor Vinaya Sathyanarayana.

**Educational Use Only** - For usage guidelines, see the main repository.