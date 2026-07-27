# Auto-exported from N8_Operationalize.ipynb. Edit the notebook, then regenerate this file.

# %% [code cell 1]
# ==============================================================================
# SETUP: Imports and Configuration
# ==============================================================================
# This cell imports all required libraries and configures data sources.
# No changes needed unless you want to use your own data.

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
import os
import sys
warnings.filterwarnings('ignore', category=DeprecationWarning)
warnings.filterwarnings('ignore', category=FutureWarning)

# Colab starts in /content; local Jupyter starts in this notebooks folder.
OUTPUT_DIR = '/content/outputs' if 'google.colab' in sys.modules else '../outputs'
os.makedirs(OUTPUT_DIR, exist_ok=True)
# CONFIGURATION: Choose your data source
USE_GITHUB_DATA = True
# Set to False if you want to upload your own data
GITHUB_RAW_URL = 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/data/synthetic'

def ensure_pipeline_outputs(through):
    try:
        from cfopack_pipeline import ensure_outputs as build_outputs
    except ImportError:
        from urllib.request import urlopen
        helper_url = 'https://raw.githubusercontent.com/VinayaSharada/KateelLearningDemosToStudents/main/CFOPackV001/notebooks/cfopack_pipeline.py'
        namespace = {}
        exec(compile(urlopen(helper_url).read(), helper_url, 'exec'), namespace)
        build_outputs = namespace['ensure_outputs']
    build_outputs(OUTPUT_DIR, through, GITHUB_RAW_URL)

print('✓ Imports successful')
print(f"✓ Data source: {'GitHub (synthetic)' if USE_GITHUB_DATA else 'Manual upload'}")

# %% [code cell 2]
# ==============================================================================
# DATA LOADING: GitHub or Manual Upload
# ==============================================================================
# Define two data loading methods and use whichever matches your choice above.

def load_data_from_github():
    """Load synthetic data directly from GitHub repository.

    Advantages:
    - No API key required
    - Pre-validated and consistent with reference outputs
    - Fast (uses GitHub CDN)

    Returns: dict with keys 'invoices', 'payments', 'customers'
    """
    try:
        print('Loading data from GitHub...')
        invoices = pd.read_csv(f'{GITHUB_RAW_URL}/invoices.csv')
        payments = pd.read_csv(f'{GITHUB_RAW_URL}/payments.csv')
        customers = pd.read_csv(f'{GITHUB_RAW_URL}/customers.csv')

        print(f'✓ Loaded {len(invoices):,} invoices')
        print(f'✓ Loaded {len(payments):,} payments')
        print(f'✓ Loaded {len(customers):,} customers')
        return {'invoices': invoices, 'payments': payments, 'customers': customers}
    except Exception as e:
        print(f'✗ Error: {e}')
        print('  Try Option 2: Manual upload')
        return None

def load_data_from_upload():
    """Load data from files you upload manually.

    In Colab: Click Files panel → Upload → Select CSVs
    In Jupyter: Put CSVs in the same folder as this notebook

    Required files: invoices.csv, payments.csv, customers.csv
    See data/README.md for required columns.
    """
    try:
        print('Loading data from uploaded files...')
        invoices = pd.read_csv('invoices.csv')
        payments = pd.read_csv('payments.csv')
        customers = pd.read_csv('customers.csv')

        print(f'✓ Loaded {len(invoices):,} invoices')
        print(f'✓ Loaded {len(payments):,} payments')
        print(f'✓ Loaded {len(customers):,} customers')
        return {'invoices': invoices, 'payments': payments, 'customers': customers}
    except FileNotFoundError as e:
        print(f'✗ File not found: {e}')
        return None

# Execute data loading based on configuration above
if USE_GITHUB_DATA:
    data = load_data_from_github()
else:
    data = load_data_from_upload()

if data is None:
    print('\n⚠ Data loading failed. Check error above.')
else:
    invoices = data['invoices']
    payments = data['payments']
    customers = data['customers']
    print('\n✓ All data loaded and ready for analysis!')

# %% [code cell 3]
ensure_pipeline_outputs(5)
# Define taskstasks = []
# PHASE 1: PRE-LAUNCH (Day 0-1)tasks.append({    'phase': 'PRE-LAUNCH',    'phase_order': 1,    'task': 'CFO Approval & Team Notification',    'owner': 'CFO',    'start_day': 0,    'end_day': 0,    'priority': 'High',    'description': 'CFO signs decision memo; brief sales, procurement, accounting leads',    'success_criteria': 'Memo signed; teams understand plan & timeline'})tasks.append({    'phase': 'PRE-LAUNCH',    'phase_order': 1,    'task': 'Identify Target Invoices for Collections',    'owner': 'Accounting/Collections',    'start_day': 0,    'end_day': 1,    'priority': 'High',    'description': 'Filter outstanding invoices >30 days overdue; identify key accounts to exempt',    'success_criteria': '40-50 invoices identified; $2M+ in target AR'})tasks.append({    'phase': 'PRE-LAUNCH',    'phase_order': 1,    'task': 'Prepare Supplier Contact List',    'owner': 'Procurement',    'start_day': 0,    'end_day': 1,    'priority': 'High',    'description': 'Identify 3 key suppliers; document current terms & contact info',    'success_criteria': 'List complete with decision maker contacts'})
# PHASE 2: LAUNCH (Day 1-7)tasks.append({    'phase': 'LAUNCH',    'phase_order': 2,    'task': 'Activate Dunning Automation (Dry Run)',    'owner': 'Treasurer/IT',    'start_day': 1,    'end_day': 1,    'priority': 'High',    'description': 'Test dunning automation on 5 sample invoices; validate customer communication',    'success_criteria': 'Process tested; no errors; communication templates approved'})tasks.append({    'phase': 'LAUNCH',    'phase_order': 2,    'task': 'Go-Live: Collections Campaign',    'owner': 'Collections Lead',    'start_day': 1,    'end_day': 7,    'priority': 'High',    'description': 'Launch automated dunning on 40-50 invoices; make targeted calls to top 5 customers',    'success_criteria': f'Achieve ${day7_collections_target:,.0f}+ collected by Day 7'})tasks.append({    'phase': 'LAUNCH',    'phase_order': 2,    'task': 'Supplier Negotiations - Initial Outreach',    'owner': 'Procurement Lead',    'start_day': 1,    'end_day': 2,    'priority': 'High',    'description': 'Soft outreach to 3 key suppliers; gauge openness to term extension',    'success_criteria': 'Initial positive response from 2+ suppliers'})tasks.append({    'phase': 'LAUNCH',    'phase_order': 2,    'task': 'Daily Monitoring Setup',    'owner': 'Treasurer',    'start_day': 1,    'end_day': 1,    'priority': 'High',    'description': 'Build cash position dashboard; set up daily reporting to CFO',    'success_criteria': 'Dashboard live; daily email sent to CFO with key metrics'})
# PHASE 3: SCALE (Day 7-14)tasks.append({    'phase': 'SCALE',    'phase_order': 3,    'task': 'Mid-Point Review & Go/No-Go Decision',    'owner': 'CFO + Treasurer',    'start_day': 7,    'end_day': 7,    'priority': 'High',    'description': 'Review Day 7 results; decide on continuing, adjusting, or escalating',    'success_criteria': 'Decision documented; team alignment on next steps'})tasks.append({    'phase': 'SCALE',    'phase_order': 3,    'task': 'Supplier Negotiations - Formal Offers',    'owner': 'Procurement Lead',    'start_day': 7,    'end_day': 14,    'priority': 'High',    'description': 'Present formal term extension proposals; negotiate final terms',    'success_criteria': 'Secure 2-3 agreements on extended terms'})tasks.append({    'phase': 'SCALE',    'phase_order': 3,    'task': 'Optimize Collections Strategy',    'owner': 'Collections Lead',    'start_day': 7,    'end_day': 14,    'priority': 'Medium',    'description': 'Adjust outreach based on early results; focus on highest-impact invoices',    'success_criteria': 'Adjust tactics to improve collection rate'})tasks.append({    'phase': 'SCALE',    'phase_order': 3,    'task': 'Monitor Customer Satisfaction',    'owner': 'Sales Lead',    'start_day': 7,    'end_day': 14,    'priority': 'Medium',    'description': 'Track customer complaints; identify accounts at churn risk',    'success_criteria': 'Churn rate < 3%; escalate if higher'})
# PHASE 4: CLOSE (Day 14+)tasks.append({    'phase': 'CLOSE',    'phase_order': 4,    'task': 'Final Results Assessment',    'owner': 'Treasurer',    'start_day': 14,    'end_day': 14,    'priority': 'High',    'description': 'Calculate actual cash impact; compare to forecast',    'success_criteria': 'Results documented vs. plan'})tasks.append({    'phase': 'CLOSE',    'phase_order': 4,    'task': 'CFO Decision: Sustain, Adjust, or Wind Down',    'owner': 'CFO',    'start_day': 14,    'end_day': 14,    'priority': 'High',    'description': 'Decide whether to keep operational changes, modify, or revert',    'success_criteria': 'Decision documented and communicated'})tasks.append({    'phase': 'CLOSE',    'phase_order': 4,    'task': 'Post-Implementation Review & Lessons Learned',    'owner': 'Treasury + CFO',    'start_day': 15,    'end_day': 15,    'priority': 'Medium',    'description': 'Document what worked, what didn\'t, what to do differently next time',    'success_criteria': 'Lessons learned memo completed'})
# Read the approved scenario values produced earlier in the pipeline.
scenarios_df = pd.read_csv(f'{OUTPUT_DIR}/N5_ccc_scenarios.csv')
gap_analysis = pd.read_csv(f'{OUTPUT_DIR}/N4_gap_analysis.csv')
forecast_gap = max(0, gap_analysis.iloc[-1]['gap'])
collections_impact = float(scenarios_df.loc[
    scenarios_df['scenario'] == 'Collections Push', 'cash_impact'
].iloc[0])
day7_collections_target = 0.60 * collections_impact

# Build the implementation plan as structured workshop data
task_rows = [
    ('PRE-LAUNCH', 1, 'CFO Approval & Team Notification', 'CFO', 0, 0, 'High', 'CFO signs decision memo; brief sales, procurement, accounting leads', 'Memo signed; teams understand plan & timeline'),
    ('PRE-LAUNCH', 1, 'Identify Target Invoices for Collections', 'Accounting/Collections', 0, 1, 'High', 'Filter outstanding invoices >30 days overdue; identify key accounts to exempt', '40-50 invoices identified; $2M+ in target AR'),
    ('PRE-LAUNCH', 1, 'Prepare Supplier Contact List', 'Procurement', 0, 1, 'High', 'Identify 3 key suppliers; document current terms & contact info', 'List complete with decision maker contacts'),
    ('LAUNCH', 2, 'Activate Dunning Automation (Dry Run)', 'Treasurer/IT', 1, 1, 'High', 'Test dunning automation on 5 sample invoices; validate customer communication', 'Process tested; no errors; communication templates approved'),
    ('LAUNCH', 2, 'Go-Live: Collections Campaign', 'Collections Lead', 1, 7, 'High', 'Launch automated dunning on 40-50 invoices; make targeted calls to top 5 customers', f'Achieve ${day7_collections_target:,.0f}+ collected by Day 7'),
    ('LAUNCH', 2, 'Supplier Negotiations - Initial Outreach', 'Procurement Lead', 1, 2, 'High', 'Soft outreach to 3 key suppliers; gauge openness to term extension', 'Initial positive response from 2+ suppliers'),
    ('LAUNCH', 2, 'Daily Monitoring Setup', 'Treasurer', 1, 1, 'High', 'Build cash position dashboard; set up daily reporting to CFO', 'Dashboard live; daily email sent to CFO with key metrics'),
    ('SCALE', 3, 'Mid-Point Review & Go/No-Go Decision', 'CFO + Treasurer', 7, 7, 'High', 'Review Day 7 results; decide on continuing, adjusting, or escalating', 'Decision documented; team alignment on next steps'),
    ('SCALE', 3, 'Supplier Negotiations - Formal Offers', 'Procurement Lead', 7, 14, 'High', 'Present formal term extension proposals; negotiate final terms', 'Secure 2-3 agreements on extended terms'),
    ('SCALE', 3, 'Optimize Collections Strategy', 'Collections Lead', 7, 14, 'Medium', 'Adjust outreach based on early results; focus on highest-impact invoices', 'Adjust tactics to improve collection rate'),
    ('SCALE', 3, 'Monitor Customer Satisfaction', 'Sales Lead', 7, 14, 'Medium', 'Track customer complaints; identify accounts at churn risk', 'Churn rate < 3%; escalate if higher'),
    ('CLOSE', 4, 'Final Results Assessment', 'Treasurer', 14, 14, 'High', 'Calculate actual cash impact; compare to forecast', 'Results documented vs. plan'),
    ('CLOSE', 4, 'CFO Decision: Sustain, Adjust, or Wind Down', 'CFO', 14, 14, 'High', 'Decide whether to keep operational changes, modify, or revert', 'Decision documented and communicated'),
    ('CLOSE', 4, 'Post-Implementation Review & Lessons Learned', 'Treasury + CFO', 15, 15, 'Medium', 'Document what worked, what did not, and what to change next time', 'Lessons learned memo completed'),
]
task_columns = [
    'phase', 'phase_order', 'task', 'owner', 'start_day', 'end_day',
    'priority', 'description', 'success_criteria'
]
tasks_df = pd.DataFrame(task_rows, columns=task_columns)

# %% [code cell 4]
print("[[LIST] IMPLEMENTATION PLAN SUMMARY")
print()

for phase in tasks_df['phase'].unique():
    phase_tasks = tasks_df[tasks_df['phase'] == phase]
    print(f"\n{phase} (Days {int(phase_tasks['start_day'].min())}-{int(phase_tasks['end_day'].max())}):")
    print(f"  {len(phase_tasks)} tasks")
    for idx, task in phase_tasks.iterrows():
        print(f"   {task['task']}")
        print(f"    Owner: {task['owner']}")
        print(f"    Success: {task['success_criteria']}")
    print()

# %% [code cell 5]
print("[[CHART] MONITORING & ESCALATION")
print()

monitoring_metrics = [
    {
        'metric': 'Daily Cash Position',
        'target': '>$1.5M',
        'frequency': 'Daily',
        'owner': 'Treasurer',
        'escalation': 'If <$1.5M: activate credit facility'
    },
    {
        'metric': 'Collections Achievement',
        'target': f'${day7_collections_target:,.0f} by Day 7',
        'frequency': 'Daily',
        'owner': 'Collections Lead',
        'escalation': 'If <60% of target: escalate to sales VP'
    },
    {
        'metric': 'Payables Negotiation Status',
        'target': '2-3 agreements by Day 14',
        'frequency': 'Daily',
        'owner': 'Procurement',
        'escalation': 'If stalled: escalate to CFO for authority increase'
    },
    {
        'metric': 'Customer Churn Rate',
        'target': '<3%',
        'frequency': 'Weekly',
        'owner': 'Sales',
        'escalation': 'If >3%: reduce collection intensity on key accounts'
    }
]

monitoring_df = pd.DataFrame(monitoring_metrics)

for idx, row in monitoring_df.iterrows():
    print(f"{row['metric']}:")
    print(f"  Target: {row['target']}")
    print(f"  Frequency: {row['frequency']}")
    print(f"  Owner: {row['owner']}")
    print(f"  Escalation: {row['escalation']}")
    print()

# %% [code cell 6]
print("[[CONFIG]  OPERATIONAL CONTROLS")
print()

controls = [
    {
        'control': 'Dunning Automation Approval Gate',
        'description': 'No automated dunning without human review + customer approval',
        'owner': 'Collections Lead',
        'frequency': 'Per-customer'
    },
    {
        'control': 'Collections Exception Handling',
        'description': 'Key accounts require VP-level approval before aggressive tactics',
        'owner': 'Sales VP',
        'frequency': 'Per-exception'
    },
    {
        'control': 'Supplier Communication Log',
        'description': 'All supplier interactions documented; professional tone maintained',
        'owner': 'Procurement',
        'frequency': 'Per-interaction'
    },
    {
        'control': 'Daily Reconciliation',
        'description': 'Cash forecast vs. actual; >$50K variance investigation required',
        'owner': 'Treasurer',
        'frequency': 'Daily'
    }
]

for control in controls:
    print(f"✓ {control['control']}")
    print(f"  What: {control['description']}")
    print(f"  Owner: {control['owner']}")
    print(f"  Frequency: {control['frequency']}")
    print()

# %% [code cell 7]
print("[[SAVE] Exporting operational plan...")

export_path = f"{OUTPUT_DIR}/N8_operationalization_plan.csv"
os.makedirs(os.path.dirname(export_path), exist_ok=True)
tasks_df.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")

export_path = f"{OUTPUT_DIR}/N8_monitoring_framework.csv"
monitoring_df.to_csv(export_path, index=False)
print(f"[OK] Exported: {export_path}")
print()

# %% [code cell 8]
print("[=" * 80)
print("[[DONE] N8 COMPLETE - Implementation Plan Built")
print("[=" * 80)
print()
print("[[INFO] Implementation Summary:")
print(f"   {len(tasks_df)} core tasks across {tasks_df['phase'].nunique()} phases")
print(f"   Pre-Launch (1 day): Prepare teams & process")
print(f"   Launch (7 days): Collections campaign + supplier outreach")
print(f"   Scale (7 days): Finalize agreements & optimize")
print(f"   Close (1+ days): Review results & decide next steps")
print()
print("[[GOAL] Key Deliverables:")
print(f"   Collections: Target ${day7_collections_target:,.0f} collected by Day 7")
print(f"   Payables: Secure 2-3 agreements by Day 14")
print(f"   Monitoring: Daily cash position reporting to CFO")
print(f"   Controls: Approval gates + reconciliation")
print()
print("[[DONE] WORKSHOP COMPLETE")
print()
print("[[INFO] What you learned:")
print("[  1. How to identify liquidity gaps using data analysis")
print("[  2. How to predict payment behavior using ML")
print("[  3. How to model operational levers (collections, payables, inventory)")
print("[  4. How to build a CFO-ready decision memo")
print("[  5. How to create an implementation plan with monitoring & controls")
print()
print("[ Take-home:")
print("[   All notebooks are reusable for your own company data")
print("[   Templates (decision memo, governance, checklist) are in /templates/")
print("[   Claude prompts (for interpretation) are in /claude_prompts/")
print("[   Adapt to your business context and run with your data")
print()
