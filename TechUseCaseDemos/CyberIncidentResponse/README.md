# Cyber Incident War Room — Agent Swarm Simulation

Browser-first demo: a fictional critical CVE with an exploit in the wild
hits a fictional manufacturer's fleet. Seven systems vulnerable, one likely
compromised (the log evidence shows exactly why), 182,000 PII records at
risk, and a CERT-In six-hour filing clock you can watch burn on the slider.
The swarm's drafts are staged; every signature stays human. All results
pre-computed and synthetic; no network calls, no keys.

## Learning objectives

- Boring inventories are crisis assets: blast radius = SBOM × CVE join.
- Evidence, not vibes: "attempted" vs "likely compromised" is a log-level
  distinction (403s vs 200s) with a ₹-crore consequence.
- Price the downtime, unlock the decision: isolation as arithmetic.
- The filing comes before the fix: clear at T+16h, report due at T+6h.

## Run modes

- **Browser** (this folder): open `index.html`. No setup.
- **Live tier**: registered executive-education participants get the full
  scoping/sequencing pipeline and the incident swarm that drafts the CERT-In
  filing text — adaptable to an anonymized slice of their own fleet.

## Expected setup time

0 minutes (browser). Demo type: interactive simulation with a regulatory
countdown slider, evidence table and sequenced response plan.

## Files in this folder

`index.html` · `about.html` · `app.js` · `data.js` (pre-computed synthetic
results) · `style.css`

## How to run

Open `index.html` in any modern browser, or serve the folder statically.

*Everything fictional: CVE, software, hosts, IPs (TEST-NET). No real records.*
