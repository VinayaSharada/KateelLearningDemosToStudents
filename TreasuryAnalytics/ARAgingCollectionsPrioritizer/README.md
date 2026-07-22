# AR Aging & Collections Prioritizer Notebook Hub

Colab-based Treasury Management demo that reproduces the AR Aging & Collections Prioritizer Claude Skill (Session 3) as a transparent, cell-by-cell notebook.

## What it covers

- Deterministic AR aging buckets and a DSO estimate from invoice-level data
- A weighted, inspectable risk score per invoice (no black-box model)
- The four-segment "Receivables Strategy by Customer Type" framework, shown side by side with its source rules
- A risk-ranked collections worklist and a CFO-facing "top N accounts" cash number
- A live re-weighting exercise showing how the worklist reorders under a different risk policy
- An optional, clearly separated scale-testing section (50K–100K synthetic rows, timed)

## Source of truth

`prioritize_collections.py` and `sample_ar_aging.csv` in this folder are copied verbatim from the `ar-aging-collections-prioritizer` Claude Skill's `scripts/` and `sample_data/` folders. The notebook imports and calls these functions directly rather than reimplementing the scoring/segmentation logic in pandas, so the Skill and the notebook can never silently drift apart.

## Run mode

- Primary: Google Colab
- Secondary: run locally with `pandas` and `matplotlib` installed

## Notebook

- `ar_aging_collections_prioritizer.ipynb`

## Teaching use

Use this demo alongside or after the Session 3 chat-based Skill demo, when you want participants to see the aging math, the risk-scoring weights, and the segmentation rules computed directly in front of them instead of only consuming a chat response.

## Who this is for

- CFOs and aspiring CFOs
- Treasury, controllership, and collections teams
- Faculty adopting the demo in multiple courses
- Students learning how collections signals become action

## Self-service use

- Start with the sample data and inspect the logic end to end.
- Map your own sanitized AR export to the same structure.
- Use the notebook-generated `ar_aging_data_template.csv` as a starter mapping file for bring-your-own-data scoring.
- Re-run the notebook and use the resulting worklist and top-account cash view inside your own organization.
