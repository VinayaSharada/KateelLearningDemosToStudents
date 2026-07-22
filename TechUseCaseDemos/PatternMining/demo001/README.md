# Pattern Mining Demo 001 — Frequent Itemset Mining Fundamentals

**Repository:** [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents)
**Author:** Professor Vinaya Sathyanarayana
**Section:** `TechUseCaseDemos/PatternMining/`

An from-scratch implementation of frequent itemset mining using pure Python — no
external ML library required. Builds intuition for support, confidence, and lift
before introducing optimised algorithms like Apriori and FP-Growth in `demo002`.

---

## What This Demo Does

| Step | Detail |
|------|--------|
| Data generation | 1,000 synthetic market-basket transactions, 20 items with Dirichlet-distributed popularity |
| Single-item mining | Counts item frequency, filters by `min_support` |
| Pair mining | Counts all 2-item co-occurrences above `min_support` |
| Output | Top frequent items and pairs printed to console |

---

## Files

| File | Purpose |
|------|---------|
| `frequentitems.py` | Main demo — generates transactions, mines frequent items and pairs |
| `syntheticdata.py` | Standalone transaction generator |
| `requirements.txt` | Python dependencies |

---

## Setup & Run

```bash
cd TechUseCaseDemos/PatternMining/demo001
pip install -r requirements.txt
python frequentitems.py
```

---

## Expected Output

```
Frequent items: ~18
Frequent pairs: ~12
Top items: [('item_3', 0.09), ('item_7', 0.08), ...]
Frequent items demo complete.
```

---

## How This Connects to Other Demos

- [`PatternMining/demo002`](../demo002/) — Apriori and FP-Growth using `mlxtend` on richer datasets
- [`DomainUseCaseDemos/Banking/Marketing001`](../../DomainUseCaseDemos/Banking/Marketing001/) — association rules for upsell/cross-sell
- [`DomainUseCaseDemos/Insurance/ClaimFraud001`](../../DomainUseCaseDemos/Insurance/ClaimFraud001/) — Apriori on fraud claim attributes

---

## Student Extensions

1. Add **confidence** calculation: `support(A∪B) / support(A)` for each frequent pair.
2. Add **lift**: `confidence(A→B) / support(B)` — values > 1 indicate positive association.
3. Introduce a strong synthetic association (item_1 always co-occurs with item_2) and verify the algorithm detects it.
4. Compare runtime vs `mlxtend.frequent_patterns.apriori` on the same dataset.

---

## Attribution

If you use this demo in a course or project, see [ATTRIBUTION.md](../../../ATTRIBUTION.md).

## Business decision

Use this demo or hub to make the central decision in Pattern Mining Demo 001 — Frequent Itemset Mining Fundamentals explicit, understand the main trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
