# Clustering Demo 002 — K-Means and DBSCAN Comparison

**Repository:** [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents)
**Author:** Professor Vinaya Sathyanarayana
**Section:** `TechUseCaseDemos/Clustering/`

A lightweight, self-contained clustering demo that generates synthetic 2D cluster
data and compares K-Means against DBSCAN — highlighting where each algorithm
succeeds and where it fails.

---

## What This Demo Does

| Step | Detail |
|------|--------|
| Data generation | 300 points in 3 well-separated Gaussian clusters |
| K-Means | Assigns all points; fast; assumes spherical clusters |
| DBSCAN | Density-based; finds clusters without specifying `k`; handles noise |
| PCA | Verifies 2D representation explains most variance |

---

## Files

| File | Purpose |
|------|---------|
| `fulldemo.py` | Main demo — generates data, runs both algorithms, prints metrics |
| `main.py` | Entry-point wrapper |
| `syndata.py` | Standalone data generator for external use |
| `requirements.txt` | Python dependencies |

---

## Setup & Run

```bash
cd TechUseCaseDemos/Clustering/demo002
pip install -r requirements.txt
python fulldemo.py
```

---

## Expected Output

```
KMeans clustering accuracy: ~0.98
PCA 2D explained variance: ~0.99
DBSCAN found 3 clusters.
Clustering demo complete.
```

---

## Student Extensions

1. Try DBSCAN with `eps=0.3` and `eps=1.0` — observe how cluster membership and noise points change.
2. Add **Agglomerative Clustering** with Ward linkage and compare the dendrogram to K-Means boundaries.
3. Introduce elongated clusters (use `np.random.randn(100, 2) @ [[3, 1], [0, 0.5]]`) and see how K-Means breaks down while DBSCAN adapts.

---

## Attribution

If you use this demo in a course or project, see [ATTRIBUTION.md](../../../ATTRIBUTION.md).

## Business decision

Use this demo or hub to make the central decision in Clustering Demo 002 — K-Means and DBSCAN Comparison explicit, understand the main trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
