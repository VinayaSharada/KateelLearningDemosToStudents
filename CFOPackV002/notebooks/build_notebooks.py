"""Build the participant-safe CFOPackV002 notebooks from reviewed source cells."""

from __future__ import annotations

import json
from pathlib import Path


BASE = Path(__file__).resolve().parent


def markdown(source: str) -> dict:
    return {"cell_type": "markdown", "metadata": {}, "source": source.strip() + "\n"}


def code(source: str) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": source.strip() + "\n",
    }


BOOTSTRAP = r'''
from pathlib import Path
import json
import sys

# Find the public package locally. A fresh Colab runtime downloads the same
# participant-safe assets from the repository.
for candidate in [Path.cwd(), *Path.cwd().parents]:
    for source_candidate in (candidate / 'src', candidate / 'CFOPackV002' / 'src'):
        if (source_candidate / 'workshop_bootstrap.py').exists():
            sys.path.insert(0, str(source_candidate))
            break

try:
    from workshop_bootstrap import bootstrap
except ImportError:
    from urllib.request import urlopen
    bootstrap_url = (
        'https://raw.githubusercontent.com/VinayaSharada/'
        'KateelLearningDemosToStudents/cfopack-v002-v2.1.0-beta.1/CFOPackV002/src/workshop_bootstrap.py'
    )
    namespace = {}
    exec(compile(urlopen(bootstrap_url).read(), bootstrap_url, 'exec'), namespace)
    bootstrap = namespace['bootstrap']

ROOT, OUTPUT_DIR = bootstrap()
from cfopack_v002 import (
    analyze_fx,
    default_decisions,
    load_inputs,
    load_manifest,
    reveal_team_shock,
    run_pipeline,
)
import workshop_visuals as viz
import pandas as pd
try:
    from IPython.display import Markdown, display
except ImportError:
    # Keep the notebooks runnable from a minimal local Python environment as
    # well as Colab/Jupyter. Rich notebook rendering remains the default.
    def Markdown(value):
        return value

    def display(value):
        print(value)

manifest = load_manifest(ROOT / 'config' / 'scenario_manifest.json')
decision_file = OUTPUT_DIR / 'N0_team_decisions.json'
if decision_file.exists():
    DECISIONS = json.loads(decision_file.read_text(encoding='utf-8'))
else:
    DECISIONS = default_decisions(manifest)
'''


RUN_PIPELINE = "summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)\nprint(f\"Scenario {summary['scenario_version']} calculated for {DECISIONS['team_name']} (model cache: {'hit' if summary['model_cache_hit'] else 'rebuilt'})\")"


def context(module_id: str) -> dict:
    return code(
        f"""
data = load_inputs(ROOT / 'data' / 'synthetic')
viz.data_snapshot(data, OUTPUT_DIR, '{module_id}')
"""
    )


COMMON_END = """
### Before moving on

Record your interpretation in the participant workbook. Do not copy a chart
without also recording the assumption and decision it supports.
"""


NOTEBOOKS: dict[str, list[dict]] = {
    "N0_War_Room_Brief.ipynb": [
        markdown(
            """
# N0 — War Room Brief

## CFO Liquidity War Room

It is 9:00 AM. The CFO wants a defensible 30-day liquidity decision before the
end of the session. Your team must decide which assumptions to trust, which
actions to authorize, how much funding and FX protection to use, and what
evidence should trigger escalation.

### Your role

Work as a treasury decision team, not as notebook operators. Every setting below
must be defended in the final CFO review.
"""
        ),
        code(BOOTSTRAP),
        context("N0"),
        markdown(
            """
## Decision charter

Edit the values below. Stay within the policy and facility limits shown after
the cell. Different teams may use different scenario variants and reach
different defensible answers.
"""
        ),
        code(
            """
DECISIONS = {
    'team_name': 'Team Delta',
    'scenario_variant': 'base',  # surprise event is revealed later in N5
    'shock_revealed': False,
    'data_approval': 'conditional',  # approved, conditional, rejected
    'model_use': 'model',  # model or baseline
    'forecast_view': 'p75',      # expected or p75
    'execution_case': 'expected',
    'collection_strategy': 'targeted',  # none, targeted, broad
    'payables_extension_days': 5,
    'inventory_release_pct': 0.05,
    'facility_draw': 4_000_000,
    'cfo_escalation_threshold': 2_000_000,
    'collections_receipt_floor': 0.90,
    'proposed_hedge_ratios': {'EUR': 0.65, 'GBP': 0.60, 'JPY': 0.60, 'INR': 0.55},
}

print('Team decision charter')
display(pd.DataFrame([
    ('Minimum liquidity', manifest['minimum_liquidity']),
    ('Facility capacity', manifest['credit_facility']['committed_capacity']),
    ('CFO draw threshold', manifest['credit_facility']['cfo_approval_threshold']),
    ('FX policy minimum', manifest['fx_policy']['minimum_hedge_ratio']),
    ('FX policy maximum', manifest['fx_policy']['maximum_hedge_ratio']),
], columns=['constraint', 'value']))
display(pd.Series(DECISIONS, name='team choice').to_frame())
viz.decision_posture(DECISIONS, manifest, OUTPUT_DIR)
"""
        ),
        markdown(
            """
## Commit the charter

Running this cell validates the choices and creates a traceable starting point
for the remaining modules. You may revise the charter later, but document why.
"""
        ),
        code(RUN_PIPELINE),
        code(
            """
charter = f'''# TEAM DECISION CHARTER

**Team:** {DECISIONS['team_name']}  
**Scenario:** {manifest['scenario_variants'][DECISIONS['scenario_variant']]['label']}  
**Forecast view:** {DECISIONS['forecast_view'].upper()}

## Initial position

- Collections: {DECISIONS['collection_strategy']}
- Supplier extension: up to {DECISIONS['payables_extension_days']} days
- Inventory release: {DECISIONS['inventory_release_pct']:.1%}
- Facility draw: ${DECISIONS['facility_draw']:,.0f}
- Data approval: {DECISIONS['data_approval']}
- Forecast method: {DECISIONS['model_use']}
- Surprise event revealed: {DECISIONS['shock_revealed']}

## Evidence required before final approval

1. Data passes all blocking integrity checks.
2. The payment model beats a simple benchmark on a chronological holdout.
3. The selected action forecast protects minimum liquidity.
4. Funding and hedge choices stay within authority or name the exception.
'''
(OUTPUT_DIR / 'N0_team_decision_charter.md').write_text(charter, encoding='utf-8')
display(Markdown(charter))
"""
        ),
        markdown(COMMON_END),
    ],
    "N1_Data_Integrity.ipynb": [
        markdown(
            """
# N1 — Data Integrity

## Decision question

Is the available information reliable enough for a liquidity decision, and
which assumptions still require human confirmation?

### Learning objectives

- Separate blocking integrity failures from business-rule warnings.
- Explore the size, concentration, timing, and operating context of the case.
- Build an assumptions register rather than hiding illustrative inputs.
"""
        ),
        code(BOOTSTRAP),
        context("N1"),
        code(RUN_PIPELINE),
        markdown("## Explore the decision data"),
        code(
            """
data = load_inputs(ROOT / 'data' / 'synthetic')
outstanding = data['invoices'].query("status == 'outstanding'")
print(f"Outstanding AR: ${outstanding['amount_usd'].sum():,.0f} across {len(outstanding):,} invoices")
print(f"Historical payments: {len(data['payments']):,}")
print(f"Forecast outflows: ${data['operating_outflows']['total_operating_outflows'].sum():,.0f} operating + "
      f"${data['supplier_payments']['amount_usd'].sum():,.0f} suppliers")
viz.data_landscape(data, OUTPUT_DIR)
"""
        ),
        markdown("## Integrity checks and assumptions"),
        code(
            """
validation = pd.read_csv(OUTPUT_DIR / 'N1_validation_report.csv')
assumptions = pd.read_csv(OUTPUT_DIR / 'N1_assumptions_register.csv')
display(validation)
display(assumptions)
blocking_failures = validation.query("blocking == True and status == 'FAIL'")
print('Decision-ready' if blocking_failures.empty else 'STOP: resolve blocking failures')
viz.validation_chart(validation, assumptions, OUTPUT_DIR)
"""
        ),
        markdown(
            """
## Team decision

Identify the three assumptions most likely to change the CFO recommendation.
For each, name an owner and the evidence required to confirm it.
"""
        ),
        code(
            """
# Make the integrity decision operational. Selecting 'rejected' deliberately
# stops downstream analysis until the data issue is resolved.
DECISIONS['data_approval'] = 'conditional'  # approved, conditional, rejected
decision_file.write_text(json.dumps(DECISIONS, indent=2), encoding='utf-8')
print(f"Data approval recorded: {DECISIONS['data_approval']}")
if DECISIONS['data_approval'] == 'rejected':
    raise RuntimeError('Team rejected the data. Resolve the blocking issue before N2.')
summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)
"""
        ),
        markdown(COMMON_END),
    ],
    "N2_Contractual_Forecast.ipynb": [
        markdown(
            """
# N2 — Contractual Forecast

## Decision question

What does the cash position look like if every outstanding invoice follows its
contractual due date—and where is that assumption fragile?
"""
        ),
        code(BOOTSTRAP),
        context("N2"),
        code(RUN_PIPELINE),
        markdown("## Inspect the contractual cash path"),
        code(
            """
forecast = pd.read_csv(OUTPUT_DIR / 'N2_contractual_forecast.csv', parse_dates=['date'])
minimum = manifest['minimum_liquidity']
display(forecast[['day', 'date', 'receipts', 'total_outflows', 'closing_cash', 'below_minimum']])
viz.forecast_chart(forecast, minimum, OUTPUT_DIR, 'N2_contractual_forecast.png', 'Contractual 30-day cash forecast')
low = forecast.loc[forecast['closing_cash'].idxmin()]
print(f"Contractual minimum: ${low['closing_cash']:,.0f} on Day {int(low['day'])}")
"""
        ),
        markdown(
            """
## Assumption challenge

List the contractual receipts that matter most to the closing balance. What
evidence would justify treating their due dates as cash dates?
"""
        ),
        markdown(COMMON_END),
    ],
    "N3_Collections_Risk.ipynb": [
        markdown(
            """
# N3 — Collections Risk

## Decision question

Does the payment-timing model improve on a simple rule, and which receivables
deserve scarce collections attention?

The model is tested on a chronological holdout. A more complex model is useful
only if it improves a simple industry-median benchmark.
"""
        ),
        code(BOOTSTRAP),
        context("N3"),
        code(RUN_PIPELINE),
        markdown("## Model value and limitations"),
        code(
            """
model_card = pd.read_csv(OUTPUT_DIR / 'N3_model_card.csv')
importance = pd.read_csv(OUTPUT_DIR / 'N3_feature_importance.csv')
predictions = pd.read_csv(OUTPUT_DIR / 'N3_collection_predictions.csv')
display(model_card)
display(importance)
viz.model_chart(model_card, importance, predictions, OUTPUT_DIR)
"""
        ),
        markdown("## Prioritized collections view"),
        code(
            """
priority = predictions.head(20)[[
    'invoice_id', 'customer_id', 'amount_usd', 'segment', 'key_account',
    'predicted_days_late', 'p75_days_late', 'prediction_spread_days'
]]
display(priority)
print(f"Top 20 exposure: ${priority['amount_usd'].sum():,.0f}")
print('High uncertainty is a reason for human review, not automatic escalation.')
"""
        ),
        markdown(
            """
## Team decision

Would you approve the model for prioritization, forecasting, both, or neither?
State the benchmark, error level, uncertainty, and human control supporting your
choice.
"""
        ),
        code(
            """
# This choice changes N4 and every downstream receipt forecast.
DECISIONS['model_use'] = 'model'  # model or baseline
decision_file.write_text(json.dumps(DECISIONS, indent=2), encoding='utf-8')
summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)
print(f"Forecast method approved: {DECISIONS['model_use']}")
"""
        ),
        markdown(COMMON_END),
    ],
    "N4_Realistic_Forecast.ipynb": [
        markdown(
            """
# N4 — Realistic Forecast

## Decision question

How does the contractual cash view change when receipt timing reflects the
team's selected confidence level and assigned scenario?
"""
        ),
        code(BOOTSTRAP),
        context("N4"),
        code(RUN_PIPELINE),
        markdown("## Compare contractual and realistic liquidity"),
        code(
            """
contractual = pd.read_csv(OUTPUT_DIR / 'N2_contractual_forecast.csv', parse_dates=['date'])
realistic = pd.read_csv(OUTPUT_DIR / 'N4_realistic_forecast.csv', parse_dates=['date'])
comparison = pd.read_csv(OUTPUT_DIR / 'N4_forecast_comparison.csv', parse_dates=['date'])
display(comparison)
viz.forecast_chart(
    realistic,
    manifest['minimum_liquidity'],
    OUTPUT_DIR,
    'N4_realistic_vs_contractual.png',
    f"{DECISIONS['forecast_view'].upper()} realistic versus contractual cash",
    comparison=contractual,
)
largest_gap = comparison.loc[comparison['scenario_gap'].idxmax()]
print(f"Largest contractual-to-realistic gap: ${largest_gap['scenario_gap']:,.0f} on Day {int(largest_gap['day'])}")
"""
        ),
        markdown(
            """
## Team decision

Is this a forecast miss, a liquidity risk, or both? Choose the cash threshold
and day that should trigger CFO escalation, and explain why.
"""
        ),
        code(
            """
DECISIONS['forecast_view'] = 'p75'  # expected or p75
DECISIONS['cfo_escalation_threshold'] = 2_000_000
decision_file.write_text(json.dumps(DECISIONS, indent=2), encoding='utf-8')
summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)
print(f"Risk view: {DECISIONS['forecast_view'].upper()}; CFO trigger: ${DECISIONS['cfo_escalation_threshold']:,.0f}")
"""
        ),
        markdown(COMMON_END),
    ],
    "N5_Liquidity_Actions.ipynb": [
        markdown(
            """
# N5 — Liquidity Actions

## Decision question

Which combination of collections, supplier, inventory, and facility actions
protects liquidity at an acceptable direct cost and relationship risk?

All effects occur on explicit dates and flow back into the cash forecast.
"""
        ),
        code(BOOTSTRAP),
        context("N5"),
        code(RUN_PIPELINE),
        markdown("## Compare action packages"),
        code(
            """
scenarios = pd.read_csv(OUTPUT_DIR / 'N5_action_scenarios.csv')
display(scenarios)
viz.action_scenarios(scenarios, manifest['minimum_liquidity'], OUTPUT_DIR)
"""
        ),
        markdown("## Inspect your selected package"),
        code(
            """
selected = pd.read_csv(OUTPUT_DIR / 'N5_selected_action_forecast.csv', parse_dates=['date'])
realistic = pd.read_csv(OUTPUT_DIR / 'N4_realistic_forecast.csv', parse_dates=['date'])
viz.forecast_chart(
    selected,
    manifest['minimum_liquidity'],
    OUTPUT_DIR,
    'N5_selected_action_forecast.png',
    'Selected actions versus no-action realistic case',
    comparison=realistic,
)
display(selected[['day', 'receipts', 'total_outflows', 'closing_cash', 'below_minimum']])
"""
        ),
        markdown(
            """
## Freeze the initial recommendation

Record the package before opening the event envelope. The next evidence is new;
do not rewrite the original decision after seeing it.
"""
        ),
        code(
            """
initial_decision = dict(DECISIONS)
(OUTPUT_DIR / 'N5_pre_shock_decision.json').write_text(
    json.dumps(initial_decision, indent=2), encoding='utf-8'
)
print('Initial package frozen. Open the event envelope only when instructed.')
"""
        ),
        markdown("## Incoming event — revise or defend"),
        code(
            """
if not DECISIONS['shock_revealed']:
    DECISIONS['scenario_variant'] = reveal_team_shock(DECISIONS['team_name'])
    DECISIONS['shock_revealed'] = True
    decision_file.write_text(json.dumps(DECISIONS, indent=2), encoding='utf-8')

event = manifest['scenario_variants'][DECISIONS['scenario_variant']]
display(Markdown(f"### EVENT ENVELOPE: {event['label']}"))
summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)
stress = pd.read_csv(OUTPUT_DIR / 'N5_execution_stress.csv')
display(stress)
viz.execution_stress(stress, manifest['minimum_liquidity'], OUTPUT_DIR)
"""
        ),
        markdown(
            """
## Team decision

Choose the lowest-cost package you can defend. Record what must go right, what
could fail, and which fallback is pre-authorized. Edit the consequential choices
below and rerun; do not revise merely to make every metric green.
"""
        ),
        code(
            """
DECISIONS.update({
    'execution_case': 'expected',  # expected, downside, failed
    'collection_strategy': DECISIONS['collection_strategy'],
    'payables_extension_days': DECISIONS['payables_extension_days'],
    'inventory_release_pct': DECISIONS['inventory_release_pct'],
    'facility_draw': DECISIONS['facility_draw'],
})
decision_file.write_text(json.dumps(DECISIONS, indent=2), encoding='utf-8')
summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)
display(pd.read_csv(OUTPUT_DIR / 'N5_execution_stress.csv'))
print('Post-shock package recorded in the decision ledger.')
"""
        ),
        markdown(COMMON_END),
    ],
    "N6_FX_and_Funding.ipynb": [
        markdown(
            """
# N6 — FX and Funding

## Decision question

How much committed funding and per-currency hedge protection should the company
buy, given cost, remaining downside and approval authority?

Receivables and payables are evaluated separately. Forward costs are explicit
one-time scenario assumptions, not live executable quotes.
"""
        ),
        code(BOOTSTRAP),
        context("N6"),
        code(RUN_PIPELINE),
        markdown("## FX exposure and hedge economics"),
        code(
            """
fx = pd.read_csv(OUTPUT_DIR / 'N6_fx_decision.csv')
funding = pd.read_csv(OUTPUT_DIR / 'N6_funding_summary.csv')
display(fx)
viz.fx_chart(fx, OUTPUT_DIR)
display(funding)
print(f"Total adverse loss before: ${fx['adverse_loss_before'].sum():,.0f}")
print(f"Total adverse loss after:  ${fx['adverse_loss_after'].sum():,.0f}")
print(f"One-time forward cost:     ${fx['one_time_forward_cost'].sum():,.0f}")
"""
        ),
        markdown(
            """
## Team decision

For each currency, defend the proposed hedge ratio and identify the exposure
direction. Then state whether the facility draw preserves enough unused
headroom for an additional shock.
"""
        ),
        code(
            """
# Edit the funding and hedge choices, then persist the approval consequence.
DECISIONS['facility_draw'] = DECISIONS['facility_draw']
DECISIONS['proposed_hedge_ratios'] = DECISIONS['proposed_hedge_ratios']
decision_file.write_text(json.dumps(DECISIONS, indent=2), encoding='utf-8')
summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)
fx = pd.read_csv(OUTPUT_DIR / 'N6_fx_decision.csv')
display(fx[['currency', 'direction', 'signed_spot_move_pct', 'proposed_hedge_ratio',
            'within_policy', 'within_cfo_authority', 'required_approval']])
"""
        ),
        markdown(COMMON_END),
    ],
    "N7_CFO_Decision.ipynb": [
        markdown(
            """
# N7 — CFO Decision

## Decision question

What exactly are you asking the CFO to approve, what evidence supports it, and
what would make you change the recommendation?
"""
        ),
        code(BOOTSTRAP),
        context("N7"),
        code(RUN_PIPELINE),
        markdown("## Review the generated decision paper"),
        code(
            """
paper = (OUTPUT_DIR / 'N7_cfo_decision_paper.md').read_text(encoding='utf-8')
display(Markdown(paper))
evidence = pd.read_csv(OUTPUT_DIR / 'N7_decision_evidence.csv')
display(evidence)
contractual = pd.read_csv(OUTPUT_DIR / 'N2_contractual_forecast.csv')
realistic = pd.read_csv(OUTPUT_DIR / 'N4_realistic_forecast.csv')
selected = pd.read_csv(OUTPUT_DIR / 'N5_selected_action_forecast.csv')
viz.executive_summary(
    contractual, realistic, selected, manifest['minimum_liquidity'], OUTPUT_DIR
)
"""
        ),
        markdown(
            """
## CFO challenge preparation

Prepare concise answers to these questions:

1. Why should I trust the model more than a simple rule?
2. Why is this the lowest-cost defensible action package?
3. What happens if collections achieves only half the expected acceleration?
4. Why is the facility draw neither too small nor unnecessarily large?
5. Which approval or policy exception is still unresolved?

Revise the paper before presenting. The generated document is a traceable draft,
not an automatic approval recommendation.
"""
        ),
        code(
            """
CFO_DECISION = 'approve'  # approve, revise, reject
approval_record = {
    'status': CFO_DECISION,
    'team': DECISIONS['team_name'],
    'scenario': DECISIONS['scenario_variant'],
    'evidence_file': 'N7_decision_evidence.csv',
}
(OUTPUT_DIR / 'N7_cfo_approval.json').write_text(
    json.dumps(approval_record, indent=2), encoding='utf-8'
)
print(f"CFO decision recorded: {CFO_DECISION.upper()}")
"""
        ),
        markdown(COMMON_END),
    ],
    "N8_Execute_and_Monitor.ipynb": [
        markdown(
            """
# N8 — Execute and Monitor

## Decision question

Who owns each action, what evidence proves completion, and which measurable
trigger forces the team to escalate or change course?
"""
        ),
        code(BOOTSTRAP),
        context("N8"),
        code(
            """
approval_file = OUTPUT_DIR / 'N7_cfo_approval.json'
if approval_file.exists():
    approval = json.loads(approval_file.read_text(encoding='utf-8'))
else:
    approval = {'status': 'approve', 'note': 'Standalone N8 recovery default'}
if approval['status'] != 'approve':
    raise RuntimeError('Execution is blocked until the CFO decision is approved in N7.')
"""
        ),
        code(RUN_PIPELINE),
        markdown("## 30-day action plan and scorecard"),
        code(
            """
action_plan = pd.read_csv(OUTPUT_DIR / 'N8_action_plan.csv')
scorecard = pd.read_csv(OUTPUT_DIR / 'N8_monitoring_scorecard.csv')
display(action_plan)
display(scorecard)
viz.execution_chart(action_plan, OUTPUT_DIR)
"""
        ),
        markdown(
            """
## Final team commitment

Before the CFO defence, confirm:

- Every action has one accountable owner.
- Every action has observable completion evidence.
- Every trigger has a named escalation path and response time.
- Daily actual receipts and outflows will replace forecast values.
- The team has named the first decision it will revisit if the scenario worsens.

Your workshop outcome is the defended decision and executable control system—not
the fact that every notebook ran successfully.
"""
        ),
        code(
            """
DECISIONS['collections_receipt_floor'] = 0.90
decision_file.write_text(json.dumps(DECISIONS, indent=2), encoding='utf-8')
summary = run_pipeline(ROOT, OUTPUT_DIR, DECISIONS)
display(pd.read_csv(OUTPUT_DIR / 'decision_ledger.csv'))
print('Execution controls recorded and linked to the approved decision.')
"""
        ),
        markdown(COMMON_END),
    ],
}


def build() -> None:
    metadata = {
        "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
        "language_info": {"name": "python", "version": "3.12"},
    }
    for filename, cells in NOTEBOOKS.items():
        notebook = {"cells": cells, "metadata": metadata, "nbformat": 4, "nbformat_minor": 5}
        (BASE / filename).write_text(
            json.dumps(notebook, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
        )
        print(f"Built {filename}")


if __name__ == "__main__":
    build()
