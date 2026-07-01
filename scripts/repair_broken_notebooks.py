import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def lines(text: str):
    if not text.endswith("\n"):
        text += "\n"
    return text.splitlines(keepends=True)


def md(text: str):
    return {"cell_type": "markdown", "metadata": {}, "source": lines(text)}


def code(text: str):
    return {"cell_type": "code", "execution_count": None, "metadata": {}, "outputs": [], "source": lines(text)}


def notebook(cells, title):
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python", "version": "3.10"},
            "colab": {"name": title, "provenance": [], "collapsed_sections": []},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def write(rel_path: str, nb: dict):
    path = ROOT / rel_path
    path.write_text(json.dumps(nb, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Repaired {rel_path}")


def treasury_cash_fragmentation():
    return notebook([
        md(
            "# Cash Fragmentation Analysis Fundamentals\n\n"
            "This notebook introduces fragmentation analysis for treasury operations using synthetic transaction data.\n\n"
            "## Learning goals\n"
            "- Measure how fragmented cash activity is across recipients, currencies, payment types, and internal teams.\n"
            "- Interpret fragmentation metrics as signals for consolidation opportunity.\n"
            "- Visualize when fragmentation peaks during the operating day.\n"
        ),
        code(
            "import numpy as np\n"
            "import pandas as pd\n"
            "import matplotlib.pyplot as plt\n"
            "import seaborn as sns\n\n"
            "rng = np.random.default_rng(42)\n"
            "print('Treasury cash fragmentation environment ready')\n"
        ),
        code(
            "n = 1200\n"
            "timestamps = pd.date_range('2025-01-01', periods=n, freq='H')\n"
            "df = pd.DataFrame({\n"
            "    'timestamp': timestamps,\n"
            "    'recipient_bank': rng.choice(['Bank A', 'Bank B', 'Bank C', 'Bank D', 'Bank E'], size=n, p=[0.25, 0.22, 0.18, 0.18, 0.17]),\n"
            "    'payment_type': rng.choice(['Wire', 'ACH', 'Card Settlement', 'Payroll', 'Tax'], size=n),\n"
            "    'currency': rng.choice(['INR', 'USD', 'EUR', 'SGD'], size=n, p=[0.62, 0.18, 0.12, 0.08]),\n"
            "    'department': rng.choice(['AP', 'Treasury', 'Payroll', 'Shared Services'], size=n),\n"
            "    'customer_segment': rng.choice(['Enterprise', 'Mid-Market', 'SME'], size=n, p=[0.35, 0.4, 0.25]),\n"
            "    'amount': np.round(rng.lognormal(mean=11.2, sigma=0.75, size=n), 2),\n"
            "    'risk_score': np.round(rng.uniform(0.05, 0.95, size=n), 3)\n"
            "})\n"
            "df.head()\n"
        ),
        code(
            "unique_recipients = df['recipient_bank'].nunique()\n"
            "unique_types = df['payment_type'].nunique()\n"
            "currency_fragmentation = df['currency'].nunique()\n"
            "department_fragmentation = df['department'].nunique()\n"
            "fragmentation_score = (unique_recipients + unique_types + currency_fragmentation + department_fragmentation) / 4\n\n"
            "risk_by_segment = df.groupby('customer_segment')['risk_score'].mean().round(3)\n"
            "currency_analysis = df.groupby('currency').agg(amount_sum=('amount', 'sum'), transaction_count=('amount', 'count'), avg_risk=('risk_score', 'mean')).round(2)\n"
            "df['hour'] = df['timestamp'].dt.hour\n"
            "hourly_volume = df.groupby('hour')['amount'].sum().round(2)\n\n"
            "print(f'Unique recipient banks: {unique_recipients}')\n"
            "print(f'Payment types: {unique_types}')\n"
            "print(f'Currencies involved: {currency_fragmentation}')\n"
            "print(f'Departments involved: {department_fragmentation}')\n"
            "print(f'Overall fragmentation score: {fragmentation_score:.2f}')\n\n"
            "print('Risk Score by Segment:')\n"
            "print(risk_by_segment)\n\n"
            "print('Currency-Based Fragmentation Patterns:')\n"
            "print(currency_analysis)\n"
        ),
        code(
            "fig, axes = plt.subplots(1, 2, figsize=(14, 5))\n"
            "currency_analysis['transaction_count'].plot(kind='bar', ax=axes[0], color='#0ea5e9')\n"
            "axes[0].set_title('Transactions by Currency')\n"
            "axes[0].set_ylabel('Count')\n\n"
            "hourly_volume.plot(ax=axes[1], color='#1d4ed8', linewidth=2)\n"
            "axes[1].set_title('Hourly Treasury Volume')\n"
            "axes[1].set_ylabel('Amount')\n"
            "axes[1].set_xlabel('Hour of Day')\n\n"
            "plt.tight_layout()\n"
            "plt.show()\n\n"
            "print('Fragmentation analysis complete')\n"
        ),
    ], "Cash Fragmentation Analysis Fundamentals")


def treasury_forecasting():
    return notebook([
        md(
            "# Predictive Analytics and Time Series Forecasting\n\n"
            "This notebook uses synthetic treasury cash-flow data to demonstrate trend, seasonality, and short-horizon forecasting.\n"
        ),
        code(
            "import numpy as np\n"
            "import pandas as pd\n"
            "import matplotlib.pyplot as plt\n"
            "from sklearn.linear_model import LinearRegression\n"
            "from sklearn.metrics import mean_absolute_error\n\n"
            "rng = np.random.default_rng(42)\n"
        ),
        code(
            "n_samples = 365\n"
            "dates = pd.date_range('2024-01-01', periods=n_samples, freq='D')\n"
            "base_flow = 1_000_000 + rng.normal(0, 20_000, n_samples)\n"
            "seasonal = 50_000 * np.sin(2 * np.pi * np.arange(n_samples) / 30)\n"
            "trend = np.arange(n_samples) * 100\n"
            "noise = rng.normal(0, 15_000, n_samples)\n"
            "cash_flow = base_flow + seasonal + trend + noise\n"
            "df = pd.DataFrame({'date': dates, 'cash_flow': np.round(cash_flow, 2)})\n"
            "df['day_index'] = np.arange(len(df))\n"
            "df['is_weekend'] = df['date'].dt.dayofweek >= 5\n"
            "df.head()\n"
        ),
        code(
            "train = df.iloc[:-30].copy()\n"
            "test = df.iloc[-30:].copy()\n"
            "model = LinearRegression()\n"
            "model.fit(train[['day_index']], train['cash_flow'])\n"
            "test['forecast'] = model.predict(test[['day_index']])\n"
            "mae = mean_absolute_error(test['cash_flow'], test['forecast'])\n\n"
            "print(f'Train rows: {len(train)} | Test rows: {len(test)}')\n"
            "print(f'Mean absolute error: ₹{mae:,.0f}')\n"
            "print(f'Weekend vs weekday average: ₹{df[df[\"is_weekend\"]][\"cash_flow\"].mean():,.0f} vs ₹{df[~df[\"is_weekend\"]][\"cash_flow\"].mean():,.0f}')\n"
            "test[['date', 'cash_flow', 'forecast']].head()\n"
        ),
        code(
            "plt.figure(figsize=(13, 5))\n"
            "plt.plot(df['date'], df['cash_flow'], label='Actual cash flow', color='#0ea5e9')\n"
            "plt.plot(test['date'], test['forecast'], label='Forecast', color='#ef4444', linewidth=2)\n"
            "plt.title('Treasury Cash Flow Forecast')\n"
            "plt.xlabel('Date')\n"
            "plt.ylabel('Cash Flow')\n"
            "plt.legend()\n"
            "plt.tight_layout()\n"
            "plt.show()\n"
        ),
    ], "Predictive Analytics and Time Series Forecasting")


def treasury_anomaly():
    return notebook([
        md(
            "# Real-Time Anomaly Detection with Neural Networks\n\n"
            "This teaching notebook demonstrates a simplified treasury anomaly workflow using synthetic payments and an unsupervised detector."
        ),
        code(
            "import numpy as np\n"
            "import pandas as pd\n"
            "import matplotlib.pyplot as plt\n"
            "from sklearn.ensemble import IsolationForest\n"
            "from sklearn.preprocessing import StandardScaler\n\n"
            "rng = np.random.default_rng(42)\n"
        ),
        code(
            "n = 900\n"
            "timestamps = pd.date_range('2025-01-01', periods=n, freq='H')\n"
            "amount = rng.lognormal(mean=10.8, sigma=0.55, size=n)\n"
            "channel = rng.choice(['Supplier Payment', 'Payroll', 'Intercompany', 'FX Settlement'], size=n)\n"
            "is_fraud = np.zeros(n, dtype=int)\n"
            "anomaly_idx = rng.choice(np.arange(n), size=18, replace=False)\n"
            "amount[anomaly_idx] *= rng.choice([0.15, 4.5], size=18)\n"
            "is_fraud[anomaly_idx] = 1\n"
            "df = pd.DataFrame({'timestamp': timestamps, 'amount': np.round(amount, 2), 'channel': channel, 'is_fraud': is_fraud})\n"
            "df.head()\n"
        ),
        code(
            "scaler = StandardScaler()\n"
            "amount_scaled = scaler.fit_transform(df[['amount']].values)\n"
            "detector = IsolationForest(contamination=0.02, random_state=42)\n"
            "pred = detector.fit_predict(amount_scaled)\n"
            "df['is_anomaly_detection'] = pred == -1\n\n"
            "print(f'Known injected anomalies: {df[\"is_fraud\"].sum()}')\n"
            "print(f'Detected anomalies: {df[\"is_anomaly_detection\"].sum()}')\n"
            "print(f'Fraud volume: ₹{df[df[\"is_fraud\"]][\"amount\"].sum():,.0f}')\n"
            "df.loc[df['is_anomaly_detection'], ['timestamp', 'amount', 'channel']].head(10)\n"
        ),
        code(
            "plt.figure(figsize=(13, 5))\n"
            "plt.plot(df['timestamp'], df['amount'], color='#0ea5e9', alpha=0.8, label='Transactions')\n"
            "subset = df[df['is_anomaly_detection']]\n"
            "plt.scatter(subset['timestamp'], subset['amount'], color='red', s=40, label='Detected anomalies')\n"
            "plt.title('Treasury Transaction Anomaly Detection')\n"
            "plt.xlabel('Timestamp')\n"
            "plt.ylabel('Amount')\n"
            "plt.legend()\n"
            "plt.tight_layout()\n"
            "plt.show()\n"
        ),
    ], "Real-time Anomaly Detection with Neural Networks")


def treasury_dashboard():
    return notebook([
        md(
            "# Comprehensive Dashboard Creation and Visualization\n\n"
            "This notebook creates a teaching dashboard from synthetic treasury metrics so students can connect liquidity, portfolio value, risk, and compliance on one page."
        ),
        code(
            "import numpy as np\n"
            "import pandas as pd\n"
            "import plotly.graph_objects as go\n\n"
            "rng = np.random.default_rng(42)\n"
        ),
        code(
            "def generate_dashboard_data(n_periods=120):\n"
            "    dates = pd.date_range('2025-01-01', periods=n_periods, freq='D')\n"
            "    dashboard_df = pd.DataFrame({\n"
            "        'date': dates,\n"
            "        'total_cash_flow': rng.normal(9_500_000, 1_200_000, n_periods).cumsum() / 3,\n"
            "        'portfolio_value': rng.normal(250_000_000, 7_000_000, n_periods).cumsum() / 8,\n"
            "        'overall_risk_score': np.clip(rng.normal(0.48, 0.12, n_periods), 0.05, 0.95),\n"
            "        'compliance_score': np.clip(rng.normal(0.88, 0.05, n_periods), 0.6, 0.99),\n"
            "    })\n"
            "    return dashboard_df\n\n"
            "dashboard_df = generate_dashboard_data()\n"
            "print(f'Average compliance score: {dashboard_df[\"compliance_score\"].mean():.2f}')\n"
            "dashboard_df.head()\n"
        ),
        code(
            "fig = go.Figure()\n"
            "fig.add_trace(go.Scatter(x=dashboard_df['date'], y=dashboard_df['total_cash_flow'], name='Total Cash Flow'))\n"
            "fig.add_trace(go.Scatter(x=dashboard_df['date'], y=dashboard_df['portfolio_value'], name='Portfolio Value', yaxis='y2'))\n"
            "fig.add_trace(go.Scatter(x=dashboard_df['date'], y=dashboard_df['overall_risk_score'], name='Risk Score', yaxis='y3'))\n"
            "fig.add_trace(go.Scatter(x=dashboard_df['date'], y=dashboard_df['compliance_score'], name='Compliance Score', yaxis='y4'))\n"
            "fig.update_layout(\n"
            "    title='Treasury Analytics Comprehensive Dashboard',\n"
            "    xaxis_title='Date',\n"
            "    yaxis=dict(title='Cash Flow'),\n"
            "    yaxis2=dict(title='Portfolio Value', overlaying='y', side='right'),\n"
            "    yaxis3=dict(title='Risk Score', overlaying='y', side='left', position=0.05),\n"
            "    yaxis4=dict(title='Compliance Score', overlaying='y', side='right', position=0.95),\n"
            "    hovermode='x unified',\n"
            "    height=700,\n"
            ")\n"
            "fig.show()\n"
        ),
        code(
            "summary_metrics = {\n"
            "    'total_cash_flow': dashboard_df['total_cash_flow'].sum(),\n"
            "    'avg_portfolio_value': dashboard_df['portfolio_value'].mean(),\n"
            "    'avg_risk_score': dashboard_df['overall_risk_score'].mean(),\n"
            "    'overall_compliance': dashboard_df['compliance_score'].mean(),\n"
            "}\n\n"
            "print('Key Performance Indicators:')\n"
            "for metric, value in summary_metrics.items():\n"
            "    print(metric, round(value, 2))\n"
        ),
    ], "Comprehensive Dashboard Creation and Visualization")


def treasury_deployment():
    return notebook([
        md(
            "# Advanced Features and Model Deployment\n\n"
            "This notebook simulates a treasury model registry and shows how teams can compare performance, compliance, and deployment readiness before promoting a model."
        ),
        code(
            "import json\n"
            "import numpy as np\n"
            "import pandas as pd\n"
            "import matplotlib.pyplot as plt\n"
            "import seaborn as sns\n\n"
            "rng = np.random.default_rng(42)\n"
        ),
        code(
            "dates = pd.date_range('2025-01-01', periods=180, freq='D')\n"
            "versions = rng.choice(['v1.0', 'v1.1', 'v2.0', 'v2.1'], size=len(dates))\n"
            "statuses = rng.choice(['active', 'testing', 'deprecated'], size=len(dates), p=[0.5, 0.35, 0.15])\n"
            "df = pd.DataFrame({\n"
            "    'date': dates,\n"
            "    'model_version': versions,\n"
            "    'deployment_status': statuses,\n"
            "    'performance_score': np.clip(rng.normal(0.83, 0.06, len(dates)), 0.55, 0.98),\n"
            "    'compliance_score': np.clip(rng.normal(0.9, 0.04, len(dates)), 0.7, 0.99),\n"
            "    'liquidity_ratio': np.clip(rng.normal(0.78, 0.08, len(dates)), 0.4, 0.98),\n"
            "    'risk_score': np.clip(rng.normal(0.42, 0.1, len(dates)), 0.1, 0.85),\n"
            "})\n"
            "df['deployment_readiness'] = df['performance_score'] * 0.4 + df['compliance_score'] * 0.3 + df['liquidity_ratio'] * 0.3\n"
            "df.head()\n"
        ),
        code(
            "model_performance = df.groupby('model_version').agg(\n"
            "    performance_mean=('performance_score', 'mean'),\n"
            "    performance_std=('performance_score', 'std'),\n"
            "    active_days=('deployment_status', lambda x: (x == 'active').sum()),\n"
            ").round(3)\n"
            "deployment_analysis = df['deployment_status'].value_counts().to_dict()\n\n"
            "print('Model Performance Overview:')\n"
            "print(model_performance)\n"
            "print('\\nDeployment Status Counts:')\n"
            "print(deployment_analysis)\n"
        ),
        code(
            "fig, axes = plt.subplots(2, 2, figsize=(14, 10))\n"
            "df.groupby('model_version')['performance_score'].mean().plot(kind='bar', ax=axes[0,0], color='skyblue')\n"
            "axes[0,0].set_title('Performance by Model Version')\n"
            "df['deployment_status'].value_counts().plot(kind='pie', ax=axes[0,1], autopct='%1.1f%%')\n"
            "axes[0,1].set_ylabel('')\n"
            "axes[0,1].set_title('Deployment Status Distribution')\n"
            "df = df.sort_values('date')\n"
            "df['deployment_readiness'].rolling(window=30).mean().plot(ax=axes[1,0], color='green')\n"
            "axes[1,0].set_title('30-day Deployment Readiness')\n"
            "sns.heatmap(df[['performance_score', 'compliance_score', 'liquidity_ratio', 'risk_score']].corr(), annot=True, cmap='coolwarm', ax=axes[1,1])\n"
            "axes[1,1].set_title('Metric Correlations')\n"
            "plt.tight_layout()\n"
            "plt.show()\n"
        ),
        code(
            "deployment_report = {\n"
            "    'generated_at': str(df['date'].max().date()),\n"
            "    'active_models': int((df['deployment_status'] == 'active').sum()),\n"
            "    'average_readiness': round(float(df['deployment_readiness'].mean()), 3),\n"
            "    'recommendation': 'Promote models above readiness threshold 0.82 only after governance review',\n"
            "}\n"
            "print(json.dumps(deployment_report, indent=2))\n"
        ),
    ], "Advanced Features and Model Deployment")


def treasury_workflow():
    return notebook([
        md(
            "# Entire Practical Demo Workflow\n\n"
            "This end-to-end treasury notebook shows the full workflow from data generation through processing, analysis, visualization, and management reporting."
        ),
        code(
            "import numpy as np\n"
            "import pandas as pd\n"
            "import plotly.graph_objects as go\n"
            "from datetime import datetime\n\n"
            "rng = np.random.default_rng(42)\n"
        ),
        code(
            "def initialize_treasury_analytics():\n"
            "    return {\n"
            "        'environment': 'production',\n"
            "        'data_sources': ['internal_transactions', 'external_market_data', 'regulatory_feeds'],\n"
            "        'analysis_types': ['cash_flow', 'risk', 'compliance', 'forecasting'],\n"
            "        'workflow_stages': ['ingestion', 'processing', 'analysis', 'visualization', 'deployment'],\n"
            "    }\n\n"
            "def generate_comprehensive_treasury_data(n_samples=365):\n"
            "    dates = pd.date_range('2024-01-01', periods=n_samples, freq='D')\n"
            "    return pd.DataFrame({\n"
            "        'date': dates,\n"
            "        'total_cash_flow': rng.normal(9_500_000, 1_000_000, n_samples),\n"
            "        'portfolio_value': rng.normal(250_000_000, 8_000_000, n_samples),\n"
            "        'risk_score': np.clip(rng.normal(0.45, 0.12, n_samples), 0.05, 0.98),\n"
            "        'compliance_score': np.clip(rng.normal(0.9, 0.04, n_samples), 0.65, 0.99),\n"
            "        'liquidity_ratio': np.clip(rng.normal(0.78, 0.1, n_samples), 0.35, 0.99),\n"
            "    })\n\n"
            "config = initialize_treasury_analytics()\n"
            "demo_df = generate_comprehensive_treasury_data()\n"
            "print(config)\n"
            "demo_df.head()\n"
        ),
        code(
            "def process_treasury_data(df):\n"
            "    df_clean = df.copy().sort_values('date')\n"
            "    df_clean['daily_change'] = df_clean['total_cash_flow'].pct_change().fillna(0)\n"
            "    df_clean['portfolio_growth'] = df_clean['portfolio_value'].pct_change().fillna(0)\n"
            "    df_clean['risk_category'] = pd.cut(df_clean['risk_score'], bins=[0, 0.3, 0.6, 1.0], labels=['Low', 'Medium', 'High'])\n"
            "    df_clean['liquidity_health'] = (df_clean['liquidity_ratio'] * 0.4) + (df_clean['compliance_score'] * 0.3) + ((1 - df_clean['risk_score']) * 0.3)\n"
            "    return df_clean\n\n"
            "processed_df = process_treasury_data(demo_df)\n"
            "processed_df[['date', 'total_cash_flow', 'daily_change', 'risk_category', 'liquidity_health']].head()\n"
        ),
        code(
            "cash_stats = {\n"
            "    'total_volume': processed_df['total_cash_flow'].sum(),\n"
            "    'average_daily': processed_df['total_cash_flow'].mean(),\n"
            "    'volatility': processed_df['total_cash_flow'].std(),\n"
            "    'growth_rate': processed_df['daily_change'].mean(),\n"
            "}\n"
            "portfolio_stats = {\n"
            "    'current_value': processed_df['portfolio_value'].iloc[-1],\n"
            "    'peak_value': processed_df['portfolio_value'].max(),\n"
            "    'trough_value': processed_df['portfolio_value'].min(),\n"
            "}\n"
            "risk_stats = {\n"
            "    'average_risk': processed_df['risk_score'].mean(),\n"
            "    'high_risk_days': int((processed_df['risk_score'] > 0.7).sum()),\n"
            "    'risk_trend': processed_df['risk_score'].corr(processed_df['liquidity_ratio']),\n"
            "}\n"
            "print(cash_stats)\n"
            "print(portfolio_stats)\n"
            "print(risk_stats)\n"
        ),
        code(
            "fig = go.Figure()\n"
            "fig.add_trace(go.Scatter(x=processed_df['date'], y=processed_df['total_cash_flow'], name='Total Cash Flow'))\n"
            "fig.add_trace(go.Scatter(x=processed_df['date'], y=processed_df['portfolio_value'] / 1_000_000, name='Portfolio Value (Millions)', yaxis='y2'))\n"
            "fig.update_layout(\n"
            "    title='Complete Treasury Analytics Dashboard - End-to-End Workflow Demo',\n"
            "    xaxis_title='Date',\n"
            "    yaxis=dict(title='Cash Flow'),\n"
            "    yaxis2=dict(title='Portfolio Value (Millions)', overlaying='y', side='right'),\n"
            "    hovermode='x unified',\n"
            "    height=600,\n"
            ")\n"
            "fig.show()\n"
        ),
        code(
            "report = {\n"
            "    'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),\n"
            "    'executive_summary': {\n"
            "        'total_cash_flow': f\"₹{cash_stats['total_volume']:,.0f}\",\n"
            "        'portfolio_current_value': f\"₹{portfolio_stats['current_value']:,.0f}\",\n"
            "        'average_risk': round(float(risk_stats['average_risk']), 3),\n"
            "    },\n"
            "    'recommendations': [\n"
            "        'Implement cash consolidation strategy',\n"
            "        'Enhance risk monitoring systems',\n"
            "        'Review liquidity-health outliers weekly',\n"
            "    ],\n"
            "}\n"
            "print(report)\n"
        ),
    ], "Entire Practical Demo Workflow")


def banking_customer_segmentation():
    return notebook([
        md(
            "# Bank Customer Segmentation Analysis\n\n"
            "This notebook demonstrates customer segmentation for banking using synthetic customer data, K-Means clustering, and RFM-style business interpretation."
        ),
        code(
            "import numpy as np\n"
            "import pandas as pd\n"
            "import matplotlib.pyplot as plt\n"
            "from sklearn.cluster import KMeans\n"
            "from sklearn.preprocessing import StandardScaler\n\n"
            "rng = np.random.default_rng(42)\n"
        ),
        code(
            "n = 1500\n"
            "df = pd.DataFrame({\n"
            "    'age': rng.integers(21, 70, size=n),\n"
            "    'annual_income': rng.normal(950_000, 420_000, size=n).clip(150_000, 3_000_000),\n"
            "    'account_balance': rng.normal(420_000, 260_000, size=n).clip(10_000, 2_500_000),\n"
            "    'monthly_txn_count': rng.integers(2, 45, size=n),\n"
            "    'credit_score': rng.normal(690, 60, size=n).clip(450, 850),\n"
            "    'days_since_last_txn': rng.integers(1, 180, size=n),\n"
            "    'is_churned': rng.choice([0, 1], size=n, p=[0.86, 0.14]),\n"
            "})\n"
            "df.head()\n"
        ),
        code(
            "features = ['annual_income', 'account_balance', 'monthly_txn_count', 'credit_score', 'days_since_last_txn']\n"
            "scaler = StandardScaler()\n"
            "X = scaler.fit_transform(df[features])\n"
            "model = KMeans(n_clusters=4, random_state=42, n_init=10)\n"
            "df['cluster'] = model.fit_predict(X)\n"
            "cluster_summary = df.groupby('cluster')[features + ['is_churned']].mean().round(2)\n"
            "cluster_summary\n"
        ),
        code(
            "rfm_score = (\n"
            "    (1 / (1 + df['days_since_last_txn'])) * 0.35\n"
            "    + (df['monthly_txn_count'] / df['monthly_txn_count'].max()) * 0.3\n"
            "    + (df['account_balance'] / df['account_balance'].max()) * 0.35\n"
            ")\n"
            "df['rfm_score'] = rfm_score.round(3)\n"
            "df['rfm_segment'] = pd.qcut(df['rfm_score'], q=4, labels=['Low Value', 'Developing', 'Loyal', 'Premier'])\n"
            "df[['cluster', 'rfm_segment', 'annual_income', 'account_balance', 'monthly_txn_count', 'credit_score']].head()\n"
        ),
        code(
            "fig, axes = plt.subplots(1, 2, figsize=(14, 5))\n"
            "scatter = axes[0].scatter(df['annual_income'], df['account_balance'], c=df['cluster'], cmap='viridis', alpha=0.5)\n"
            "axes[0].set_title('Income vs Balance by Cluster')\n"
            "axes[0].set_xlabel('Annual Income')\n"
            "axes[0].set_ylabel('Account Balance')\n"
            "plt.colorbar(scatter, ax=axes[0])\n"
            "df['rfm_segment'].value_counts().plot(kind='bar', ax=axes[1], color='#60a5fa')\n"
            "axes[1].set_title('RFM Segment Distribution')\n"
            "axes[1].set_xlabel('Segment')\n"
            "axes[1].set_ylabel('Customers')\n"
            "plt.tight_layout()\n"
            "plt.show()\n"
        ),
    ], "Bank Customer Segmentation Analysis")


def main():
    write("TreasuryAnalytics/Colab_Notebooks/02_cash_fragmentation_analysis_fundamentals.ipynb", treasury_cash_fragmentation())
    write("TreasuryAnalytics/Colab_Notebooks/03_predictive_analytics_and_time_series_forecasting.ipynb", treasury_forecasting())
    write("TreasuryAnalytics/Colab_Notebooks/04_real_time_anomaly_detection_with_neural_networks.ipynb", treasury_anomaly())
    write("TreasuryAnalytics/Colab_Notebooks/05_comprehensive_dashboard_creation_and_visualization.ipynb", treasury_dashboard())
    write("TreasuryAnalytics/Colab_Notebooks/06_advanced_features_and_model_deployment.ipynb", treasury_deployment())
    write("TreasuryAnalytics/Colab_Notebooks/07_entire_practical_demo_workflow.ipynb", treasury_workflow())
    write("DomainUseCaseDemos/Banking/CustSeg/customer_segmentation.ipynb", banking_customer_segmentation())


if __name__ == "__main__":
    main()
