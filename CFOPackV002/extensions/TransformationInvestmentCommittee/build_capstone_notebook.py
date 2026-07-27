"""Build the participant-safe Transformation Investment Committee notebook."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent


def markdown(value: str) -> dict:
    return {"cell_type": "markdown", "metadata": {}, "source": value.strip() + "\n"}


def code(value: str) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": value.strip() + "\n",
    }


cells = [
    markdown(
        """
# T1 — Transformation Investment Committee

Choose what to fund now, what follows next, and what evidence must be visible in
90 days. The notebook checks the mandate and prepares neutral evidence; it does
not select the answer for you.
"""
    ),
    code(
        """
from pathlib import Path
import json
import pandas as pd
import matplotlib.pyplot as plt
try:
    from IPython.display import display
except ImportError:
    def display(value):
        print(value)

ROOT = None
for candidate in [Path.cwd(), *Path.cwd().parents]:
    if (candidate / 'initiative_cards.csv').exists():
        ROOT = candidate
        break
    nested = candidate / 'CFOPackV002' / 'extensions' / 'TransformationInvestmentCommittee'
    if (nested / 'initiative_cards.csv').exists():
        ROOT = nested
        break
if ROOT is None:
    from urllib.request import urlopen
    ROOT = Path('/content/TransformationInvestmentCommittee')
    ROOT.mkdir(parents=True, exist_ok=True)
    source = ('https://raw.githubusercontent.com/VinayaSharada/'
              'KateelLearningDemosToStudents/cfopack-v002-v2.1.0-beta.1/CFOPackV002/extensions/'
              'TransformationInvestmentCommittee/initiative_cards.csv')
    (ROOT / 'initiative_cards.csv').write_bytes(urlopen(source, timeout=30).read())

OUTPUT_DIR = ROOT / 'outputs'
OUTPUT_DIR.mkdir(exist_ok=True)
options = pd.read_csv(ROOT / 'initiative_cards.csv')
display(options)
"""
    ),
    markdown("## Explore cost, benefit, confidence and Day-90 visibility"),
    code(
        """
fig, axes = plt.subplots(1, 2, figsize=(13, 5))
axes[0].scatter(options['wave1_cost_usd']/1e6, options['annual_benefit_usd']/1e6,
                s=options['benefit_confidence']*250, color='#178582', alpha=.8)
for _, row in options.iterrows():
    axes[0].annotate(row['option_id'], (row['wave1_cost_usd']/1e6, row['annual_benefit_usd']/1e6), xytext=(5,5), textcoords='offset points')
axes[0].set(xlabel='Wave-1 cost (USD millions)', ylabel='Annual benefit (USD millions)', title='Economics and confidence')
visibility = pd.crosstab(options['initiative'], options['day90_visibility'])
visibility.plot(kind='barh', stacked=True, ax=axes[1], color=['#2F6B9A','#D89B2B'])
axes[1].set(title='Day-90 evidence visibility', xlabel='Indicator')
fig.tight_layout()
fig.savefig(OUTPUT_DIR / 'T1_option_landscape.png', dpi=180, bbox_inches='tight')
plt.show()
"""
    ),
    markdown("## Make the portfolio decision"),
    code(
        """
NOW_OPTION = 'TC-01'
NEXT_OPTION = 'TC-03'
WAVE1_BUDGET = 8_000_000

if NOW_OPTION == NEXT_OPTION:
    raise ValueError('NOW and NEXT must be different initiatives.')
selected = options[options['option_id'].isin([NOW_OPTION, NEXT_OPTION])].copy()
if len(selected) != 2:
    raise ValueError('Choose valid option IDs from the initiative cards.')
now = options.set_index('option_id').loc[NOW_OPTION]
next_option = options.set_index('option_id').loc[NEXT_OPTION]
if now['wave1_cost_usd'] > WAVE1_BUDGET:
    raise ValueError('The NOW investment exceeds the Wave-1 mandate.')

decision = {
    'now': NOW_OPTION,
    'next': NEXT_OPTION,
    'now_cost_usd': float(now['wave1_cost_usd']),
    'now_annual_benefit_usd': float(now['annual_benefit_usd']),
    'now_benefit_confidence': float(now['benefit_confidence']),
    'day90_metric': now['day90_metric'],
    'baseline': float(now['current_metric']),
    'target': float(now['target_metric']),
}
(OUTPUT_DIR / 'T1_portfolio_decision.json').write_text(json.dumps(decision, indent=2), encoding='utf-8')
display(pd.DataFrame([now, next_option], index=['NOW', 'NEXT']))
print(f"Uncommitted Wave-1 capacity: ${WAVE1_BUDGET-now['wave1_cost_usd']:,.0f}")
"""
    ),
    markdown("## Define the gate — the team owns these judgments"),
    code(
        """
EVIDENCE_OWNER = 'Finance Transformation Director'
EVIDENCE_SOURCE = 'Controlled process dashboard and signed reconciliation'
STOP_CONDITION = 'Control exceptions remain unresolved at Day 60'
REVISE_CONDITION = 'Day-60 trajectory is below 75% of the target improvement'
SCALE_CONDITION = 'Target met with no material control exception at Day 90'

tracker = pd.DataFrame([
    [now['initiative'], 'NOW', now['day90_metric'], now['current_metric'], now['target_metric'], EVIDENCE_OWNER, EVIDENCE_SOURCE, 30, 'Observe'],
    [now['initiative'], 'NOW', now['day90_metric'], now['current_metric'], now['target_metric'], EVIDENCE_OWNER, EVIDENCE_SOURCE, 60, 'Stop / revise review'],
    [now['initiative'], 'NOW', now['day90_metric'], now['current_metric'], now['target_metric'], EVIDENCE_OWNER, EVIDENCE_SOURCE, 90, 'Stop / revise / scale'],
], columns=['initiative','phase','metric','baseline','target','owner','evidence_source','review_day','gate_response'])
tracker.to_csv(OUTPUT_DIR / 'T1_benefits_realization.csv', index=False)
display(tracker)
"""
    ),
    markdown("## Generate the Board memo draft"),
    code(
        """
payback = now['wave1_cost_usd'] / now['annual_benefit_usd']
memo = f'''# BOARD INVESTMENT DECISION

## Decision requested

Authorize **{now['initiative']}** for **${now['wave1_cost_usd']:,.0f}** as the
NOW investment. Designate **{next_option['initiative']}** as NEXT, conditional on
the Day-90 evidence gate.

## Evidence

- Expected annual benefit: ${now['annual_benefit_usd']:,.0f}
- Benefit confidence: {now['benefit_confidence']:.0%}
- Simple payback: {payback:.1f} years before risk adjustment
- Day-90 proof point: {now['day90_metric']} moves from {now['current_metric']} to {now['target_metric']}

## Gate

- Owner: {EVIDENCE_OWNER}
- Evidence: {EVIDENCE_SOURCE}
- STOP: {STOP_CONDITION}
- REVISE: {REVISE_CONDITION}
- SCALE: {SCALE_CONDITION}

## Board defence still required

The team must explain the sequencing logic, strongest rejected alternative,
dependency risk, and what is deliberately not funded. This generated draft is
evidence scaffolding, not an automatic recommendation.
'''
(OUTPUT_DIR / 'T1_board_memo.md').write_text(memo, encoding='utf-8')
print(memo)
"""
    ),
]


notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.12"},
    },
    "nbformat": 4,
    "nbformat_minor": 5,
}
(ROOT / "T1_Transformation_Investment_Committee.ipynb").write_text(
    json.dumps(notebook, indent=1) + "\n", encoding="utf-8"
)
print("Built T1_Transformation_Investment_Committee.ipynb")
