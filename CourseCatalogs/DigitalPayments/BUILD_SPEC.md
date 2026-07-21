# Digital Payments Build Spec

## Purpose
This build spec defines the first-wave browser demos for the `Digital Payments` course pack in `KateelLearningDemosToStudents`. The course repo should own the teaching demos it prefers, even when adjacent supporting demos live elsewhere in the library.

## First-Wave Demos
These are the five course-owned demos to ship first:

1. `TechUseCaseDemos/PaymentJourneyRailSimulator/`
2. `TechUseCaseDemos/UPITransactionFailureSimulator/`
3. `TechUseCaseDemos/CardNetworkEconomicsSettlementSimulator/`
4. `TechUseCaseDemos/PaymentReconciliationWorkbench/`
5. `TechUseCaseDemos/CBDCDesignStudio/`

## Instructional Roles
- `Payment Journey and Rail Simulator`
  - Anchor demo for the course.
  - Teaches system participants, message flow, settlement stages, finality, fees, liquidity, and failure modes.
- `UPI Transaction and Failure Simulator`
  - Operational deep dive for Indian instant payments.
  - Focuses on push vs collect, pending states, reversals, duplicates, limits, and exception handling.
- `Card Network Economics and Settlement Simulator`
  - Teaches authorization economics, interchange, MDR, settlement lag, refunds, chargebacks, and merchant margin.
- `Payment Reconciliation Workbench`
  - Teaches day-2 operations.
  - Covers missing transactions, duplicates, fee mismatches, pending reversals, and settlement-date differences.
- `CBDC Design Studio`
  - Advanced design and policy simulator.
  - Compares retail vs wholesale, token vs account, direct vs intermediated, privacy, programmability, and limits.

## Second-Wave Demos
These stay in the roadmap but do not block the first release:

1. UPI corridor and cross-border linkage expansion
2. Fraud-Control Timing Lab
3. Cross-Border Payment Corridor Simulator
4. Digital Wallet Balance-Sheet Simulator
5. Payment Statistics Explorer
6. Programmable Money Use-Case Lab

## Existing Demos to Embed
These existing demos should be referenced in the Digital Payments course pack because they reinforce core payment themes:

- `TechUseCaseDemos/FraudPlayground/`
- `DomainUseCaseDemos/CreditCards/CreditCardTxnFraud/`
- `DomainUseCaseDemos/Compliance/MuleAccountDetection/`
- `🤖 Browser-AI-Demos/PM-Product-Demos/4-pricing-unit-economics/`
- `CyberSecurityDemos/IoTAircraftNetwork/ThreatModelingMatrix/`
- `TechUseCaseDemos/BlockchainExplorer/`
- `TechUseCaseDemos/SmartContractTreasury/`
- `DomainUseCaseDemos/SupplyChain/SupplyChainFinance/`

## UX Standards
- Every public demo must include `about.html`, `index.html`, `README.md`, and any local `app.js` / `style.css`.
- Every demo must be classroom-safe and run without API keys.
- Every demo should expose:
  - a top-line business decision
  - participant/flow visibility
  - at least one failure or edge case
  - at least one trade-off between speed, fraud, cost, liquidity, or customer friction
- Interactive controls should change both operational outputs and teaching interpretation text.
- Teacher cues should appear on the course page and the about page.

## Modeling Standards
- Use deterministic browser calculations, not hidden black-box scoring, unless the point of the lesson is model comparison.
- Make message stages and settlement stages visibly distinct.
- Separate:
  - authorization
  - clearing
  - settlement
  - reversal / refund / chargeback
- When showing modern rails, distinguish:
  - customer experience
  - legal finality
  - funding movement
  - reconciliation closure

## Data Standards
- Synthetic reference data is acceptable and preferred for browser demos.
- Any “live” mode should remain optional and clearly labeled as external.
- Official statistics, if added later, must stay separate from crypto/network telemetry.

## Course Mapping
- S01-S04: `PaymentJourneyRailSimulator`
- S05-S08: `UPITransactionFailureSimulator`
- S09: `CardNetworkEconomicsSettlementSimulator`
- S07, S09, S16, S21: `PaymentReconciliationWorkbench`
- S17-S18: `CBDCDesignStudio`

## Release Standard
The first release is complete when:

- the Digital Payments course page exists and is public
- the five first-wave demos are linked from the course page
- the existing supporting demos are also linked from the course page
- the course becomes searchable through `data/site-catalog.json`
- course pages rebuild successfully
- site verification passes with no broken local links introduced by this work
