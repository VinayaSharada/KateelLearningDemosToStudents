"""
N6: FX & Hedge Decision
CFO Pack V001 - Treasury Decision Workshop

Purpose: Analyze open FX exposures and model hedging strategy
Output: hedge_recommendation.csv

Considers: Currency exposure, volatility, hedging costs, policy limits
Recommends: Hedge ratios and instruments

Estimated time: 15-20 minutes
"""

import pandas as pd
import numpy as np
import os

print("[=" * 80)
print("[N6: FX & HEDGE DECISION")
print("[=" * 80)
print()

# Load data
fx_exposure = pd.read_csv("../outputs/N1_fx_exposure.csv")
gap_analysis = pd.read_csv("../outputs/N4_gap_analysis.csv")

target_gap = gap_analysis.iloc[-1]['gap']

print(f"[CHART] FX Exposure Analysis")
print()

# ============================================================================
# EXPOSURE SUMMARY
# ============================================================================

print(f"Current Open Exposures:")
print("[-" * 80)

total_exposure = fx_exposure['notional_exposure_usd'].sum()

for idx, row in fx_exposure.iterrows():
    pct_total = (row['notional_exposure_usd'] / total_exposure) * 100
    current_hedge = row['current_hedge_ratio'] * 100

    print(f"{row['currency']} Exposure:")
    print(f"  Notional:        ${row['notional_exposure_usd']:>10,.0f} ({pct_total:5.1f}% of total)")
    print(f"  Type:            {row['transaction_type']}")
    print(f"  Current hedge:   {current_hedge:>10.0f}%")
    print(f"  Counterparty:    {row['counterparty']}")
    print()

print(f"Total FX exposure: ${total_exposure:,.0f}")
print()

# ============================================================================
# VOLATILITY & RISK ASSESSMENT
# ============================================================================

print("[[WARNING]  VOLATILITY ANALYSIS")
print()

# Assume historical volatility (in real system, would pull from market data)
volatility_assumptions = {
    'EUR': {'volatility': 0.08, 'current_rate': 1.08, 'worst_case_rate': 1.00},  # 8% volatility
    'GBP': {'volatility': 0.10, 'current_rate': 1.27, 'worst_case_rate': 1.15},
    'JPY': {'volatility': 0.12, 'current_rate': 0.0067, 'worst_case_rate': 0.0063},
    'CAD': {'volatility': 0.07, 'current_rate': 0.74, 'worst_case_rate': 0.68}
}

print("[Estimated exposure risk (worst-case 1 standard deviation move):")
print("[-" * 80)

total_exposure_at_risk = 0

for idx, row in fx_exposure.iterrows():
    currency = row['currency']
    notional = row['notional_exposure_usd']

    if currency in volatility_assumptions:
        vol = volatility_assumptions[currency]['volatility']
        exposure_at_risk = notional * vol

        total_exposure_at_risk += exposure_at_risk

        print(f"{currency}: ${exposure_at_risk:>10,.0f} (${notional:,.0f}  {vol*100:.0f}% volatility)")

print("[-" * 80)
print(f"Total exposure at risk: ${total_exposure_at_risk:,.0f}")
print()

if total_exposure_at_risk > target_gap:
    print(f"[WARNING]  FX risk (${total_exposure_at_risk:,.0f}) exceeds cash gap (${target_gap:,.0f})")
    print("[   Hedging recommended to reduce this risk")
else:
    print(f"[OK] FX risk (${total_exposure_at_risk:,.0f}) is less than cash gap")
    print("[   But hedging still recommended as prudent risk management")

print()

# ============================================================================
# HEDGING SCENARIOS
# ============================================================================

print("[[GOAL] HEDGING SCENARIOS")
print()

# Calculate hedging costs (assume ~0.5% of notional for 3-month forward)
hedging_cost_pct = 0.005

recommendations = []

for hedge_ratio in [0.50, 0.65, 0.75, 0.85]:
    hedge_amount = total_exposure * hedge_ratio
    hedge_cost_monthly = hedge_amount * hedging_cost_pct

    recommendations.append({
        'hedge_ratio': hedge_ratio,
        'hedge_amount': hedge_amount,
        'monthly_cost': hedge_cost_monthly,
        'annual_cost': hedge_cost_monthly * 12,
        'unhedged_exposure': total_exposure * (1 - hedge_ratio)
    })

    print(f"Scenario: {hedge_ratio*100:.0f}% Hedge Ratio")
    print(f"  Hedge amount:       ${hedge_amount:,.0f}")
    print(f"  Monthly cost:       ${hedge_cost_monthly:,.0f}")
    print(f"  Annual cost:        ${hedge_cost_monthly*12:,.0f}")
    print(f"  Unhedged exposure:  ${total_exposure * (1 - hedge_ratio):,.0f}")
    print()

# ============================================================================
# POLICY COMPLIANCE CHECK
# ============================================================================

print("[[LIST] POLICY COMPLIANCE")
print()

# Assume board-approved policy: 50-75% EUR hedge ratio
approved_range = (0.50, 0.75)

print(f"Board-approved hedge range: {approved_range[0]*100:.0f}% - {approved_range[1]*100:.0f}%")
print()

# Check each currency
for idx, row in fx_exposure.iterrows():
    current_hedge = row['current_hedge_ratio']

    if current_hedge < approved_range[0]:
        status = "[WARNING]  UNDER-HEDGED"
    elif current_hedge > approved_range[1]:
        status = "[WARNING]  OVER-HEDGED"
    else:
        status = "[OK] COMPLIANT"

    print(f"{row['currency']}: Current {current_hedge*100:.0f}%  {status}")

print()

# ============================================================================
# RECOMMENDATION
# ============================================================================

print("[[IDEA] HEDGE RECOMMENDATION")
print()

recommended_ratio = 0.70
recommended_scenario = [r for r in recommendations if r['hedge_ratio'] == recommended_ratio][0]

print(f"Recommend: {recommended_ratio*100:.0f}% hedge ratio")
print(f"  EUR: Increase from current to {recommended_ratio*100:.0f}%")
print(f"  Hedge amount: ${recommended_scenario['hedge_amount']:,.0f}")
print(f"  Annual cost: ${recommended_scenario['annual_cost']:,.0f}")
print()

print("[Rationale:")
print("[   {:.0f}% is within board-approved range ({:.0f}%-{:.0f}%)".format(
    recommended_ratio*100, approved_range[0]*100, approved_range[1]*100))
print(f"   Protects ~${recommended_scenario['unhedged_exposure']:,.0f} of exposure")
print(f"   Cost (${recommended_scenario['annual_cost']:,.0f}/year) is reasonable")
print(f"   Leaves some upside if EUR weakens")
print()

# ============================================================================
# APPROVAL REQUIREMENTS
# ============================================================================

print("[[OK] APPROVAL PATH")
print()

if recommended_ratio > 0.70:
    print("[This recommendation requires:")
    print("[  1. CFO approval (within existing authority)")
    print("[  2. Quarterly board review notification (>70% trigger)")
else:
    print("[This recommendation requires:")
    print("[  1. CFO approval only (within existing authority)")

print()

# ============================================================================
# EXPORT RECOMMENDATION
# ============================================================================

print("[[SAVE] Exporting hedge recommendation...")

recommendations_df = pd.DataFrame(recommendations)
export_path = "../outputs/N6_hedge_recommendation.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
recommendations_df.to_csv(export_path, index=False)

print(f"[OK] Exported: {export_path}")
print()

# ============================================================================
# KEY INSIGHTS
# ============================================================================

print("[=" * 80)
print("[[DONE] N6 COMPLETE - FX Hedge Decision")
print("[=" * 80)
print()

print("[[INFO] Key Insights:")
print(f"   Total FX exposure: ${total_exposure:,.0f}")
print(f"   Exposure at risk: ${total_exposure_at_risk:,.0f}")
print(f"   Recommended hedge: {recommended_ratio*100:.0f}%")
print(f"   Annual hedging cost: ${recommended_scenario['annual_cost']:,.0f}")
print()

print("[[GOAL] Next step: N7_Decision_Framework.py")
print("[   Synthesize all analysis into CFO-ready decision memo")
