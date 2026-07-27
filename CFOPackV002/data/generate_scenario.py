"""Generate the deterministic CFOPackV002 synthetic workshop scenario."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "config" / "scenario_manifest.json"
OUTPUT_DIR = ROOT / "data" / "synthetic"


INDUSTRIES = {
    "Technology": 4,
    "Manufacturing": 12,
    "Healthcare": 17,
    "Retail": 23,
    "Government": 31,
}
SEGMENT_MULTIPLIER = {"Strategic": 2.4, "Core": 1.25, "Standard": 0.65}


def _load_manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def generate_customers(rng: np.random.Generator, count: int = 160) -> pd.DataFrame:
    industries = rng.choice(list(INDUSTRIES), count, p=[0.23, 0.25, 0.18, 0.22, 0.12])
    segments = rng.choice(list(SEGMENT_MULTIPLIER), count, p=[0.12, 0.38, 0.50])
    risk_score = np.clip(rng.beta(2.2, 3.0, count), 0.05, 0.98)
    dispute_rate = np.clip(0.01 + risk_score * 0.16 + rng.normal(0, 0.025, count), 0, 0.30)
    relationship_years = np.clip(rng.gamma(2.2, 2.1, count), 0.2, 18)
    key_account = segments == "Strategic"
    return pd.DataFrame(
        {
            "customer_id": [f"CUS-{i:04d}" for i in range(1, count + 1)],
            "customer_name": [f"Workshop Customer {i:03d}" for i in range(1, count + 1)],
            "industry": industries,
            "segment": segments,
            "risk_score": risk_score.round(4),
            "dispute_rate_12m": dispute_rate.round(4),
            "relationship_years": relationship_years.round(1),
            "key_account": key_account,
        }
    )


def _weighted_customer_ids(
    rng: np.random.Generator, customers: pd.DataFrame, size: int
) -> np.ndarray:
    weights = customers["segment"].map(SEGMENT_MULTIPLIER).to_numpy(dtype=float)
    weights *= np.linspace(1.5, 0.7, len(customers))
    weights /= weights.sum()
    return rng.choice(customers["customer_id"], size=size, p=weights)


def generate_invoices_and_payments(
    rng: np.random.Generator, customers: pd.DataFrame, as_of: pd.Timestamp
) -> tuple[pd.DataFrame, pd.DataFrame]:
    historical_count = 4800
    outstanding_count = 650
    customer_lookup = customers.set_index("customer_id")

    historical_customer_ids = _weighted_customer_ids(rng, customers, historical_count)
    historical_dates = as_of - pd.to_timedelta(rng.integers(90, 540, historical_count), unit="D")
    historical_terms = rng.choice([15, 30, 45, 60], historical_count, p=[0.08, 0.50, 0.30, 0.12])
    historical_amounts = np.clip(rng.lognormal(10.65, 0.75, historical_count), 4000, 750000)

    historical_rows = []
    payment_rows = []
    for idx in range(historical_count):
        customer_id = historical_customer_ids[idx]
        customer = customer_lookup.loc[customer_id]
        due_date = pd.Timestamp(historical_dates[idx]) + pd.Timedelta(days=int(historical_terms[idx]))
        latent_delay = (
            INDUSTRIES[customer["industry"]]
            + 20 * float(customer["risk_score"])
            + 24 * float(customer["dispute_rate_12m"])
            - 0.55 * float(customer["relationship_years"])
        )
        days_late = int(np.clip(np.rint(rng.normal(latent_delay, 8.5)), -5, 75))
        invoice_id = f"HIST-{idx + 1:06d}"
        historical_rows.append(
            {
                "invoice_id": invoice_id,
                "customer_id": customer_id,
                "invoice_date": pd.Timestamp(historical_dates[idx]).date().isoformat(),
                "due_date": due_date.date().isoformat(),
                "amount_usd": round(float(historical_amounts[idx]), 2),
                "payment_terms_days": int(historical_terms[idx]),
                "status": "paid",
            }
        )
        payment_rows.append(
            {
                "payment_id": f"PAY-{idx + 1:06d}",
                "invoice_id": invoice_id,
                "payment_date": (due_date + pd.Timedelta(days=days_late)).date().isoformat(),
                "amount_usd": round(float(historical_amounts[idx]), 2),
                "days_late": days_late,
            }
        )

    outstanding_customer_ids = _weighted_customer_ids(rng, customers, outstanding_count)
    outstanding_dates = as_of - pd.to_timedelta(rng.integers(5, 75, outstanding_count), unit="D")
    outstanding_terms = rng.choice([15, 30, 45, 60], outstanding_count, p=[0.08, 0.50, 0.30, 0.12])
    outstanding_amounts = np.clip(rng.lognormal(10.75, 0.82, outstanding_count), 5000, 900000)
    outstanding_rows = []
    for idx in range(outstanding_count):
        due_date = pd.Timestamp(outstanding_dates[idx]) + pd.Timedelta(days=int(outstanding_terms[idx]))
        outstanding_rows.append(
            {
                "invoice_id": f"OPEN-{idx + 1:05d}",
                "customer_id": outstanding_customer_ids[idx],
                "invoice_date": pd.Timestamp(outstanding_dates[idx]).date().isoformat(),
                "due_date": due_date.date().isoformat(),
                "amount_usd": round(float(outstanding_amounts[idx]), 2),
                "payment_terms_days": int(outstanding_terms[idx]),
                "status": "outstanding",
            }
        )

    invoices = pd.DataFrame(historical_rows + outstanding_rows).sort_values("invoice_id")
    payments = pd.DataFrame(payment_rows).sort_values("payment_date")
    return invoices.reset_index(drop=True), payments.reset_index(drop=True)


def generate_operating_outflows(
    rng: np.random.Generator, as_of: pd.Timestamp, days: int
) -> pd.DataFrame:
    rows = []
    for day in range(1, days + 1):
        payroll = 1_600_000 if day in (15, 30) else 0
        tax = 1_100_000 if day == 20 else 0
        capex = 700_000 if day in (9, 24) else 0
        # Maintain a meaningful liquidity squeeze: contractual receipts cover the
        # horizon, while delayed receipts require an explicit action/funding mix.
        other = max(300_000, rng.normal(600_000, 100_000))
        rows.append(
            {
                "day": day,
                "date": (as_of + pd.Timedelta(days=day - 1)).date().isoformat(),
                "payroll": round(payroll, 2),
                "tax": round(tax, 2),
                "capex": round(capex, 2),
                "other_operating_outflows": round(float(other), 2),
                "total_operating_outflows": round(payroll + tax + capex + float(other), 2),
            }
        )
    return pd.DataFrame(rows)


def generate_supplier_payments(
    rng: np.random.Generator, as_of: pd.Timestamp, count: int = 72
) -> pd.DataFrame:
    amounts = np.clip(rng.lognormal(11.15, 0.65, count), 18000, 620000)
    due_days = rng.integers(1, 31, count)
    eligible = rng.random(count) < 0.68
    max_extension = np.where(eligible, rng.choice([3, 5, 7, 10], count), 0)
    relationship_risk = rng.choice(["Low", "Medium", "High"], count, p=[0.35, 0.50, 0.15])
    return pd.DataFrame(
        {
            "supplier_payment_id": [f"SUP-{i:04d}" for i in range(1, count + 1)],
            "supplier_id": [f"VEND-{i:03d}" for i in rng.integers(1, 31, count)],
            "due_date": [(as_of + pd.Timedelta(days=int(day - 1))).date().isoformat() for day in due_days],
            "amount_usd": amounts.round(2),
            "extension_eligible": eligible,
            "max_extension_days": max_extension.astype(int),
            "relationship_risk": relationship_risk,
        }
    ).sort_values(["due_date", "amount_usd"], ascending=[True, False])


def generate_fx_exposures() -> pd.DataFrame:
    return pd.DataFrame(
        [
            ["FX-001", "EUR", "receivable", 1900000, 1.09, 18, 0.42, 0.075, 34],
            ["FX-002", "GBP", "payable", 1250000, 1.27, 24, 0.35, 0.090, 39],
            ["FX-003", "JPY", "receivable", 260000000, 0.0068, 27, 0.20, 0.105, 31],
            ["FX-004", "INR", "receivable", 145000000, 0.0120, 12, 0.33, 0.065, 28],
        ],
        columns=[
            "exposure_id",
            "currency",
            "direction",
            "foreign_notional",
            "spot_usd_per_unit",
            "maturity_day",
            "current_hedge_ratio",
            "adverse_move_pct",
            "forward_cost_bps",
        ],
    )


def generate_inventory_options() -> pd.DataFrame:
    return pd.DataFrame(
        [
            ["INVOPT-1", 0.025, 8, 0.08, "Low"],
            ["INVOPT-2", 0.050, 12, 0.12, "Medium"],
            ["INVOPT-3", 0.075, 18, 0.18, "Medium-High"],
            ["INVOPT-4", 0.100, 24, 0.25, "High"],
        ],
        columns=["option_id", "release_pct", "cash_day", "execution_cost_pct", "operational_risk"],
    )


def main() -> None:
    manifest = _load_manifest()
    rng = np.random.default_rng(manifest["random_seed"])
    as_of = pd.Timestamp(manifest["as_of_date"])
    days = int(manifest["forecast_horizon_days"])
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    customers = generate_customers(rng)
    invoices, payments = generate_invoices_and_payments(rng, customers, as_of)
    outputs = {
        "customers.csv": customers,
        "invoices.csv": invoices,
        "payments.csv": payments,
        "operating_outflows.csv": generate_operating_outflows(rng, as_of, days),
        "supplier_payments.csv": generate_supplier_payments(rng, as_of),
        "fx_exposures.csv": generate_fx_exposures(),
        "inventory_options.csv": generate_inventory_options(),
    }
    for filename, frame in outputs.items():
        frame.to_csv(OUTPUT_DIR / filename, index=False)
        print(f"Wrote {filename}: {len(frame):,} rows")


if __name__ == "__main__":
    main()
