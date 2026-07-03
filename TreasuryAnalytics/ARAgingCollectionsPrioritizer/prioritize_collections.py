"""
AR Aging & Collections Prioritizer - scoring engine.

Reads an invoice-level AR export and produces:
  - aging_summary.csv      : portfolio-level aging buckets + DSO estimate
  - collections_priority.csv : one row per invoice, risk-scored, segmented, ranked

See ../SKILL.md for how this script is meant to be used, and
../reference/segmentation_rules.md for the segmentation thresholds.

Usage:
    python prioritize_collections.py <input.csv> [--as-of YYYY-MM-DD] [--out-dir DIR]
                                      [--weights days_past_due=0.4,amount=0.25,dispute=0.15,history=0.15,value_protect=0.05]
"""

import argparse
import csv
import os
import sys
from datetime import datetime, date


REQUIRED_COLUMNS = ["invoice_id", "invoice_date", "due_date", "amount_usd"]
CUSTOMER_COLUMNS = ["customer_id", "customer_name"]

DEFAULT_WEIGHTS = {
    "days_past_due": 0.40,
    "amount": 0.25,
    "dispute": 0.15,
    "history": 0.15,
    "value_protect": 0.05,
}

AGING_BUCKETS = [
    ("current", lambda d: d <= 0),
    ("1-30", lambda d: 0 < d <= 30),
    ("31-60", lambda d: 30 < d <= 60),
    ("61-90", lambda d: 60 < d <= 90),
    ("90+", lambda d: d > 90),
]


def parse_date(s):
    s = (s or "").strip()
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d-%m-%Y", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Could not parse date: {s!r}")


def parse_weights(spec):
    if not spec:
        return dict(DEFAULT_WEIGHTS)
    weights = {}
    for pair in spec.split(","):
        k, v = pair.split("=")
        weights[k.strip()] = float(v.strip())
    for k in DEFAULT_WEIGHTS:
        weights.setdefault(k, 0.0)
    return weights


def load_rows(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = [dict(r) for r in reader]
    if not rows:
        raise ValueError("Input file has no data rows.")

    header = set(rows[0].keys())
    missing_required = [c for c in REQUIRED_COLUMNS if c not in header]
    if missing_required:
        raise ValueError(
            f"Missing required column(s): {missing_required}. "
            f"Found columns: {sorted(header)}"
        )
    if not any(c in header for c in CUSTOMER_COLUMNS):
        raise ValueError(
            f"Need a customer identifier column: one of {CUSTOMER_COLUMNS}. "
            f"Found columns: {sorted(header)}"
        )
    return rows


def aging_bucket(days_past_due):
    for name, test in AGING_BUCKETS:
        if test(days_past_due):
            return name
    return "90+"


def normalize(value, lo, hi):
    if hi <= lo:
        return 0.0
    return max(0.0, min(1.0, (value - lo) / (hi - lo)))


def compute(rows, as_of, weights):
    customer_key = "customer_id" if "customer_id" in rows[0] else "customer_name"

    parsed = []
    for r in rows:
        try:
            invoice_date = parse_date(r["invoice_date"])
            due_date = parse_date(r["due_date"])
            amount = float(r["amount_usd"])
        except Exception as e:
            r["_parse_error"] = str(e)
            parsed.append(r)
            continue

        days_past_due = (as_of - due_date).days
        days_outstanding = (as_of - invoice_date).days
        dispute = str(r.get("dispute_flag", "")).strip().upper() in ("Y", "YES", "TRUE", "1")
        avg_late = float(r["avg_days_late_last_4_quarters"]) if r.get("avg_days_late_last_4_quarters") not in (None, "") else None
        revenue = float(r["annual_revenue_contribution_usd"]) if r.get("annual_revenue_contribution_usd") not in (None, "") else None
        credit_note = str(r.get("credit_rating_note", "")).strip()

        r["_customer_key"] = r.get(customer_key, "UNKNOWN")
        r["_invoice_date"] = invoice_date
        r["_due_date"] = due_date
        r["_amount"] = amount
        r["_days_past_due"] = days_past_due
        r["_days_outstanding"] = days_outstanding
        r["_dispute"] = dispute
        r["_avg_late"] = avg_late
        r["_revenue"] = revenue
        r["_credit_note"] = credit_note
        r["_aging_bucket"] = aging_bucket(days_past_due)
        parsed.append(r)

    valid = [r for r in parsed if "_parse_error" not in r]
    errors = [r for r in parsed if "_parse_error" in r]

    if not valid:
        raise ValueError("No rows could be parsed successfully.")

    max_amount = max(r["_amount"] for r in valid) or 1.0
    max_dpd = max(max(r["_days_past_due"], 0) for r in valid) or 1
    revenues = [r["_revenue"] for r in valid if r["_revenue"] is not None]
    revenue_q3 = sorted(revenues)[int(0.75 * (len(revenues) - 1))] if revenues else None

    for r in valid:
        dpd_score = normalize(max(r["_days_past_due"], 0), 0, max_dpd)
        amount_score = normalize(r["_amount"], 0, max_amount)
        dispute_score = 1.0 if r["_dispute"] else 0.0
        history_score = normalize(r["_avg_late"], 0, 60) if r["_avg_late"] is not None else dpd_score * 0.5
        is_top_quartile_revenue = revenue_q3 is not None and r["_revenue"] is not None and r["_revenue"] >= revenue_q3
        value_protect_score = 1.0 if is_top_quartile_revenue else 0.0

        risk_score = 100 * (
            weights["days_past_due"] * dpd_score
            + weights["amount"] * amount_score
            + weights["dispute"] * dispute_score
            + weights["history"] * history_score
            - weights["value_protect"] * value_protect_score
        )
        r["_risk_score"] = round(max(0.0, min(100.0, risk_score)), 1)
        r["_is_top_quartile_revenue"] = is_top_quartile_revenue

        distressed = r["_days_past_due"] >= 60 and (r["_dispute"] or (r["_avg_late"] or 0) >= 45) or bool(r["_credit_note"])
        strategic = (not distressed) and is_top_quartile_revenue
        habitual = (not distressed) and (not strategic) and (
            (r["_avg_late"] or 0) >= 20 or (r["_days_past_due"] >= 30 and not r["_dispute"])
        )
        if distressed:
            r["_segment"] = "Distressed / high-risk"
        elif strategic:
            r["_segment"] = "Strategic & high-value"
        elif habitual:
            r["_segment"] = "Habitually late but solvent"
        else:
            r["_segment"] = "Low-risk repetitive"

    valid.sort(key=lambda r: r["_risk_score"] * r["_amount"], reverse=True)
    for i, r in enumerate(valid, start=1):
        r["_priority_rank"] = i

    return valid, errors


def write_priority_csv(rows, path):
    fields = [
        "priority_rank", "customer", "invoice_id", "amount_usd", "days_past_due",
        "aging_bucket", "dispute_flag", "segment", "risk_score", "recommended_action",
    ]
    action_by_segment = {
        "Distressed / high-risk": "Advance payment, collateral, or reduced exposure",
        "Strategic & high-value": "Commercial escalation and coordinated resolution",
        "Habitually late but solvent": "Tighter terms, structured follow-up, selective credit limits",
        "Low-risk repetitive": "Automation and workflow reminders",
    }
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in rows:
            writer.writerow({
                "priority_rank": r["_priority_rank"],
                "customer": r["_customer_key"],
                "invoice_id": r["invoice_id"],
                "amount_usd": round(r["_amount"], 2),
                "days_past_due": r["_days_past_due"],
                "aging_bucket": r["_aging_bucket"],
                "dispute_flag": "Y" if r["_dispute"] else "N",
                "segment": r["_segment"],
                "risk_score": r["_risk_score"],
                "recommended_action": action_by_segment[r["_segment"]],
            })


def write_summary_csv(rows, as_of, path):
    total_ar = sum(r["_amount"] for r in rows)
    total_disputed = sum(r["_amount"] for r in rows if r["_dispute"])
    weighted_days = sum(r["_amount"] * max(r["_days_outstanding"], 0) for r in rows)
    dso_estimate = round(weighted_days / total_ar, 1) if total_ar else 0.0

    bucket_totals = {name: 0.0 for name, _ in AGING_BUCKETS}
    for r in rows:
        bucket_totals[r["_aging_bucket"]] += r["_amount"]

    segment_totals = {}
    for r in rows:
        s = segment_totals.setdefault(r["_segment"], {"count": 0, "amount": 0.0})
        s["count"] += 1
        s["amount"] += r["_amount"]

    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["metric", "value"])
        writer.writerow(["as_of_date", as_of.isoformat()])
        writer.writerow(["total_open_ar_usd", round(total_ar, 2)])
        writer.writerow(["dso_estimate_days", dso_estimate])
        writer.writerow(["total_disputed_usd", round(total_disputed, 2)])
        writer.writerow([])
        writer.writerow(["aging_bucket", "amount_usd", "pct_of_total"])
        for name, _ in AGING_BUCKETS:
            amt = bucket_totals[name]
            pct = round(100 * amt / total_ar, 1) if total_ar else 0.0
            writer.writerow([name, round(amt, 2), pct])
        writer.writerow([])
        writer.writerow(["segment", "customer_invoice_count", "amount_usd", "pct_of_total"])
        for seg, s in sorted(segment_totals.items(), key=lambda kv: -kv[1]["amount"]):
            pct = round(100 * s["amount"] / total_ar, 1) if total_ar else 0.0
            writer.writerow([seg, s["count"], round(s["amount"], 2), pct])

    return {
        "total_ar": total_ar,
        "dso_estimate": dso_estimate,
        "total_disputed": total_disputed,
        "bucket_totals": bucket_totals,
        "segment_totals": segment_totals,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input_file")
    ap.add_argument("--as-of", dest="as_of", default=None, help="Snapshot date YYYY-MM-DD; defaults to latest invoice_date in the file")
    ap.add_argument("--out-dir", dest="out_dir", default=".", help="Directory to write aging_summary.csv and collections_priority.csv")
    ap.add_argument("--weights", dest="weights", default=None, help="Comma-separated key=value overrides, e.g. days_past_due=0.5,amount=0.3,dispute=0.1,history=0.1,value_protect=0.0")
    args = ap.parse_args()

    rows = load_rows(args.input_file)
    weights = parse_weights(args.weights)

    if args.as_of:
        as_of = parse_date(args.as_of)
    else:
        as_of = max(parse_date(r["invoice_date"]) for r in rows)

    valid, errors = compute(rows, as_of, weights)

    os.makedirs(args.out_dir, exist_ok=True)
    priority_path = os.path.join(args.out_dir, "collections_priority.csv")
    summary_path = os.path.join(args.out_dir, "aging_summary.csv")

    write_priority_csv(valid, priority_path)
    stats = write_summary_csv(valid, as_of, summary_path)

    print(f"As-of date: {as_of.isoformat()}")
    print(f"Rows processed: {len(valid)} valid, {len(errors)} skipped due to parse errors")
    if errors:
        for r in errors[:5]:
            print(f"  SKIPPED invoice_id={r.get('invoice_id', '?')}: {r['_parse_error']}")
    print(f"Total open AR: {stats['total_ar']:.2f}")
    print(f"DSO estimate: {stats['dso_estimate']} days")
    print(f"Total disputed: {stats['total_disputed']:.2f}")
    print(f"Wrote: {summary_path}")
    print(f"Wrote: {priority_path}")


if __name__ == "__main__":
    sys.exit(main())
