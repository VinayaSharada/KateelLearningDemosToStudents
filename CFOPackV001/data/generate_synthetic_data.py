"""
Generate realistic 10,000-row synthetic datasets for CFOPackV001 workshop.

Based on ecosystem review design document.
Creates customers.csv, invoices.csv, payments.csv, fx_exposure.csv, cash_flow.csv
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

np.random.seed(42)

# Configuration
INVOICES_COUNT = 10000
PAID_INVOICES = 8000
OUTSTANDING_INVOICES = 2000
CUSTOMERS_COUNT = 150
PAYMENTS_COUNT = 8200  # 8000 for paid invoices + 200 unrelated

# Output directory
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "synthetic")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Industry profiles: (avg_days_late, std_dev, industry_name)
INDUSTRIES = {
    'technology': {'avg_late': 12, 'std': 3, 'weight': 0.25},
    'manufacturing': {'avg_late': 38, 'std': 8, 'weight': 0.20},
    'retail': {'avg_late': 58, 'std': 12, 'weight': 0.25},
    'government': {'avg_late': 62, 'std': 15, 'weight': 0.15},
    'healthcare': {'avg_late': 42, 'std': 10, 'weight': 0.15},
}

# Payment terms distribution
PAYMENT_TERMS = {
    15: 0.30,  # 30% of invoices: 15 day terms
    30: 0.50,  # 50% of invoices: 30 day terms
    60: 0.20,  # 20% of invoices: 60 day terms
}

# ============================================================================
# 1. GENERATE CUSTOMERS (150 records)
# ============================================================================

def generate_customers():
    """Create 150 customer profiles with industry, payment behavior, risk score."""

    customers = []
    customer_id = 1

    # Create customers by industry
    for industry, props in INDUSTRIES.items():
        num_customers = max(1, int(CUSTOMERS_COUNT * props['weight']))

        for i in range(num_customers):
            # Gini coefficient for concentration (top 20 customers = 60% of AR)
            # Use power law: rank-based weights
            rank = i + 1
            concentration_weight = (1 / (rank ** 0.8)) * 10  # Scale factor for realism

            customers.append({
                'customer_id': customer_id,
                'customer_name': f"{industry.title()} Co. {customer_id}",
                'industry': industry.title(),
                'avg_days_late': np.random.normal(props['avg_late'], props['std']),
                'risk_score': np.random.uniform(0.3, 0.95),  # Credit risk 0-1
                'concentration_weight': concentration_weight,
            })
            customer_id += 1

    df = pd.DataFrame(customers)
    return df.iloc[:CUSTOMERS_COUNT]  # Trim to exact count


# ============================================================================
# 2. GENERATE INVOICES (10,000 records: 8000 paid + 2000 outstanding)
# ============================================================================

def generate_invoices(customers_df):
    """Create 10,000 invoices with realistic distribution and payment terms."""

    invoices = []
    invoice_id = 1

    # Date range: past 24 months
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=730)

    # Split into paid and outstanding
    # Paid invoices: from 24 months ago through 60 days ago
    # Outstanding: from 60 days ago to today

    outstanding_start = end_date - timedelta(days=60)

    # Paid invoices (8000)
    for i in range(PAID_INVOICES):
        customer = customers_df.sample(weights=customers_df['concentration_weight']).iloc[0]

        # Invoice date uniformly distributed over past 24 months
        days_ago = np.random.randint(61, 731)
        invoice_date = end_date - timedelta(days=days_ago)

        # Payment terms
        terms = int(np.random.choice(list(PAYMENT_TERMS.keys()), p=list(PAYMENT_TERMS.values())))
        due_date = invoice_date + timedelta(days=terms)

        # Amount: realistic distribution (most 10-100K, some larger)
        if np.random.random() < 0.05:  # 5% are large invoices
            amount = np.random.uniform(250000, 500000)
        elif np.random.random() < 0.15:  # 15% are medium invoices
            amount = np.random.uniform(50000, 150000)
        else:  # 80% are small invoices
            amount = np.random.uniform(5000, 50000)

        invoices.append({
            'invoice_id': f"INV-{invoice_id:06d}",
            'customer_id': int(customer['customer_id']),
            'invoice_date': invoice_date,
            'due_date': due_date,
            'amount_usd': round(amount, 2),
            'payment_terms_days': terms,
            'status': 'paid',
        })
        invoice_id += 1

    # Outstanding invoices (2000)
    for i in range(OUTSTANDING_INVOICES):
        customer = customers_df.sample(weights=customers_df['concentration_weight']).iloc[0]

        # Invoice date: from 60 days ago to today
        days_ago = np.random.randint(0, 61)
        invoice_date = end_date - timedelta(days=days_ago)

        # Payment terms
        terms = int(np.random.choice(list(PAYMENT_TERMS.keys()), p=list(PAYMENT_TERMS.values())))
        due_date = invoice_date + timedelta(days=terms)

        # Amount distribution (same as paid)
        if np.random.random() < 0.05:
            amount = np.random.uniform(250000, 500000)
        elif np.random.random() < 0.15:
            amount = np.random.uniform(50000, 150000)
        else:
            amount = np.random.uniform(5000, 50000)

        invoices.append({
            'invoice_id': f"INV-{invoice_id:06d}",
            'customer_id': int(customer['customer_id']),
            'invoice_date': invoice_date,
            'due_date': due_date,
            'amount_usd': round(amount, 2),
            'payment_terms_days': terms,
            'status': 'outstanding',
        })
        invoice_id += 1

    df = pd.DataFrame(invoices)
    return df.sort_values('invoice_date').reset_index(drop=True)


# ============================================================================
# 3. GENERATE PAYMENTS (8000+ records: paid invoices + unrelated payments)
# ============================================================================

def generate_payments(invoices_df, customers_df):
    """Create payment records with customer-consistent delays."""

    payments = []
    payment_id = 1

    end_date = datetime.now().date()

    # Map customer_id to avg_days_late for consistent behavior
    customer_behavior = customers_df.set_index('customer_id')['avg_days_late'].to_dict()

    # 1. Payments for paid invoices (8000)
    paid_invoices = invoices_df[invoices_df['status'] == 'paid']

    for _, invoice in paid_invoices.iterrows():
        customer_late = customer_behavior.get(invoice['customer_id'], 30)

        # Payment delay: customer-consistent with some noise
        days_late = max(0, int(np.random.normal(customer_late, customer_late * 0.2)))
        payment_date = invoice['due_date'] + timedelta(days=days_late)

        # Ensure payment date is in the past (for historical data)
        if payment_date > end_date:
            payment_date = end_date - timedelta(days=1)

        payments.append({
            'payment_id': payment_id,
            'invoice_id': invoice['invoice_id'],
            'customer_id': int(invoice['customer_id']),
            'payment_date': payment_date,
            'amount_paid': invoice['amount_usd'],
            'payment_type': 'invoice_payment',
            'days_late': (payment_date - invoice['due_date']).days,
        })
        payment_id += 1

    # 2. Unrelated payments (tax refunds, interest, rebates) - 200 records
    unrelated_types = ['tax_refund', 'interest_income', 'rebate', 'credit_memo', 'insurance_recovery']

    for i in range(200):
        payment_date = end_date - timedelta(days=np.random.randint(1, 365))
        amount = np.random.uniform(1000, 50000) if np.random.random() < 0.7 else np.random.uniform(50000, 200000)

        payments.append({
            'payment_id': payment_id,
            'invoice_id': None,  # Not tied to an invoice
            'customer_id': None,
            'payment_date': payment_date,
            'amount_paid': round(amount, 2),
            'payment_type': np.random.choice(unrelated_types),
            'days_late': None,
        })
        payment_id += 1

    df = pd.DataFrame(payments)
    return df.sort_values('payment_date').reset_index(drop=True)


# ============================================================================
# 4. GENERATE FX EXPOSURE (5-10 open positions)
# ============================================================================

def generate_fx_exposure():
    """Create open FX positions for hedging analysis."""

    exposures = []

    currencies = ['EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD']
    transaction_types = ['accounts_payable', 'accounts_receivable', 'intercompany', 'forecasted']

    total_exposure = 0
    target_exposure = 5_100_000  # $5.1M total open exposure

    for currency in currencies[:np.random.randint(4, 6)]:  # 4-5 currencies
        notional = target_exposure / 5 + np.random.uniform(-200000, 200000)

        exposures.append({
            'currency': currency,
            'notional_amount': round(notional, 2),
            'transaction_type': np.random.choice(transaction_types),
            'month': datetime.now().strftime('%Y-%m'),
            'current_hedge_ratio': np.random.uniform(0, 0.5),
        })
        total_exposure += notional

    df = pd.DataFrame(exposures)
    return df


# ============================================================================
# 5. GENERATE CASH FLOW (14-30 day schedule)
# ============================================================================

def generate_cash_flow():
    """Create daily cash outflow schedule."""

    cash_flows = []

    end_date = datetime.now().date()

    # Create 30-day forecast starting tomorrow
    for day in range(1, 31):
        date = end_date + timedelta(days=day)

        # Base amounts
        payables = np.random.uniform(100000, 300000) if np.random.random() < 0.7 else 0
        payroll = 500000 if day % 14 == 0 else (200000 if day % 7 == 5 else 0)  # Bi-weekly + daily
        capex = np.random.uniform(50000, 150000) if np.random.random() < 0.3 else 0
        tax = 250000 if date.day == 15 or date.day == 1 else 0
        other = np.random.uniform(20000, 80000) if np.random.random() < 0.5 else 0

        cash_flows.append({
            'day': day,
            'date': date,
            'payables_amount': round(payables, 2),
            'payroll_amount': round(payroll, 2),
            'capex_amount': round(capex, 2),
            'tax_amount': round(tax, 2),
            'other_outflows': round(other, 2),
            'total_outflows': round(payables + payroll + capex + tax + other, 2),
        })

    df = pd.DataFrame(cash_flows)
    return df


# ============================================================================
# MAIN GENERATION
# ============================================================================

def main():
    print("🔄 Generating realistic 10,000-row synthetic datasets...")
    print()

    # Generate in order
    print(f"1️⃣  Generating {CUSTOMERS_COUNT} customers...")
    customers = generate_customers()
    customers_file = os.path.join(OUTPUT_DIR, 'customers.csv')
    customers.to_csv(customers_file, index=False)
    print(f"   ✅ Saved: {customers_file}")
    print(f"   Industries: {customers['industry'].value_counts().to_dict()}")
    print()

    print(f"2️⃣  Generating {INVOICES_COUNT:,} invoices ({PAID_INVOICES:,} paid + {OUTSTANDING_INVOICES:,} outstanding)...")
    invoices = generate_invoices(customers)
    invoices_file = os.path.join(OUTPUT_DIR, 'invoices.csv')
    invoices.to_csv(invoices_file, index=False)
    print(f"   ✅ Saved: {invoices_file}")
    print(f"   Total AR: ${invoices['amount_usd'].sum():,.2f}")
    print(f"   Paid: {(invoices['status']=='paid').sum():,} | Outstanding: {(invoices['status']=='outstanding').sum():,}")
    print()

    print(f"3️⃣  Generating {PAYMENTS_COUNT:,} payment records ({PAID_INVOICES:,} invoice payments + 200 unrelated)...")
    payments = generate_payments(invoices, customers)
    payments_file = os.path.join(OUTPUT_DIR, 'payments.csv')
    payments.to_csv(payments_file, index=False)
    print(f"   ✅ Saved: {payments_file}")
    print(f"   Invoice payments: {payments[payments['payment_type']=='invoice_payment'].shape[0]:,}")
    print(f"   Unrelated payments: {payments[payments['payment_type']!='invoice_payment'].shape[0]}")
    print(f"   Avg days late: {payments['days_late'].mean():.1f} days")
    print()

    print(f"4️⃣  Generating FX exposure positions...")
    fx = generate_fx_exposure()
    fx_file = os.path.join(OUTPUT_DIR, 'fx_exposure.csv')
    fx.to_csv(fx_file, index=False)
    print(f"   ✅ Saved: {fx_file}")
    print(f"   Total exposure: ${fx['notional_amount'].sum():,.2f}")
    print(f"   Currencies: {', '.join(fx['currency'].unique())}")
    print()

    print(f"5️⃣  Generating 30-day cash flow schedule...")
    cashflow = generate_cash_flow()
    cashflow_file = os.path.join(OUTPUT_DIR, 'cash_flow.csv')
    cashflow.to_csv(cashflow_file, index=False)
    print(f"   ✅ Saved: {cashflow_file}")
    print(f"   Total 30-day outflows: ${cashflow['total_outflows'].sum():,.2f}")
    print()

    # Validation checks
    print("✅ VALIDATION CHECKS:")
    print()

    # Check 1: Outstanding invoices exist
    outstanding_count = (invoices['status'] == 'outstanding').sum()
    print(f"   ✓ Outstanding invoices: {outstanding_count:,} (needed for N3 ML)")

    # Check 2: Payment consistency
    paid_invoices_count = (invoices['status'] == 'paid').sum()
    invoice_payments = payments[payments['payment_type'] == 'invoice_payment'].shape[0]
    print(f"   ✓ Paid invoices: {paid_invoices_count:,} | Invoice payments: {invoice_payments:,}")

    # Check 3: Average days late by industry
    print(f"\n   ✓ Average days late by industry:")
    industry_late = customers.groupby('industry')['avg_days_late'].mean().sort_values()
    for industry, avg_late in industry_late.items():
        print(f"      {industry}: {avg_late:.1f} days")

    # Check 4: Customer concentration
    top_20_ar = invoices.nlargest(20, 'amount_usd')['amount_usd'].sum()
    total_ar = invoices['amount_usd'].sum()
    concentration_pct = (top_20_ar / total_ar) * 100
    print(f"\n   ✓ Customer concentration (top 20 invoices): {concentration_pct:.1f}% of AR")

    # Check 5: Unrelated payments exist
    unrelated_payments = payments[payments['payment_type'] != 'invoice_payment'].shape[0]
    print(f"   ✓ Unrelated payments (refunds, interest, etc.): {unrelated_payments}")

    print()
    print("🎉 Dataset generation complete!")
    print()
    print("All files created in:", OUTPUT_DIR)
    print()


if __name__ == '__main__':
    main()
