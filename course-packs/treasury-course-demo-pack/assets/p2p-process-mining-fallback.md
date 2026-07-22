# P2P Process Mining Workbench Fallback

Use this fallback when the live browser demo cannot be projected.

## What to show

- Start from the assumed AP happy path: `Invoice received -> Three-way match -> Approval requested -> Approved -> Payment ready`
- Explain that the fictional Asteron event log reveals actual variants including missing PO, missing GRN, duplicate review, approval delays, and one control breach.
- Highlight the core teaching metrics: lead time, wait time, touch time, rework, straight-through-processing rate, and exception ageing.

## Decision framing

- Eliminate or standardize upstream causes of repeated PO and GRN exceptions.
- Enable workflow only for the stable path.
- Retain human review for duplicate or control-sensitive exceptions.
- Monitor trigger breaches after launch rather than treating process mining as a one-off diagnosis.
