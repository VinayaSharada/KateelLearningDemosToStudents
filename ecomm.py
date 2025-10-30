#!/usr/bin/env python3
"""
ecomm.py: In-depth Ecommerce Analytics & Automated PDF Report Generator
(Final Corrected Version)
"""

import argparse
import os
import sys
import traceback
import random
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
from mlxtend.frequent_patterns import fpgrowth, association_rules
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from tqdm import tqdm
import warnings

AUTHOR = "Vinaya Sathyanarayana"

# Suppress DeprecationWarnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

def verbose_print(msg, quiet):
    if not quiet: print(msg)

def exception_message(context, e):
    return f"[{context}] ERROR: {type(e).__name__}: {e}\n" + traceback.format_exc()

def parse_args():
    parser = argparse.ArgumentParser(description="Ecommerce Transaction Analyzer and PDF Reporter")
    parser.add_argument('--datafolder', type=str, default='.', help='Folder with CSVs from syndata.py')
    parser.add_argument('-q', '--quiet', action='store_true', help='Quiet mode')
    return parser.parse_args()

def load_data(folder, quiet):
    files = ['customers.csv', 'products.csv', 'stores.csv', 'orders.csv', 'lineitems.csv']
    dfs = {}
    for f in files:
        path = os.path.join(folder, f)
        if not os.path.exists(path):
            raise FileNotFoundError(f"File {f} missing in {folder}.")
        verbose_print(f"Loading {f}", quiet)
        dfs[f.replace('.csv', '')] = pd.read_csv(path)
    return dfs

def plot_to_buf(pltfig):
    buf = BytesIO()
    pltfig.savefig(buf, format="png", bbox_inches="tight", dpi=160)
    buf.seek(0)
    plt.close(pltfig)
    return buf

def customer_analytics(customers, orders, lineitems, quiet):
    summary, gender_buf, loc_buf, rfm, high_value, at_risk = "", None, None, None, None, None
    try:
        verbose_print("Customer Analytics: Demographics, RFM...", quiet)
        recent_dates = orders.groupby("customer_id")["order_date"].max().reset_index()
        recent_dates["Recency"] = (pd.to_datetime(orders["order_date"].max()) - pd.to_datetime(recent_dates["order_date"])).dt.days
        freq = orders.groupby("customer_id").size().reset_index(name="Frequency")
        lineitems_orders = pd.merge(lineitems, orders[["order_id", "customer_id"]], on="order_id")
        monetary = lineitems_orders.groupby("customer_id")["total_amount"].sum().reset_index(name="Monetary")
        rfm = pd.merge(pd.merge(recent_dates[["customer_id", "Recency"]], freq, on="customer_id"), monetary, on="customer_id")

        def safe_qcut(series, q=4, reverse=False):
            try:
                labels = list(range(1, q + 1))
                if reverse: labels = labels[::-1]
                return pd.qcut(series, q, labels=labels, duplicates='drop')
            except ValueError:
                return pd.Series([1] * len(series), index=series.index)

        rfm["R_Quartile"] = safe_qcut(rfm["Recency"], reverse=True)
        rfm["F_Quartile"] = safe_qcut(rfm["Frequency"])
        rfm["M_Quartile"] = safe_qcut(rfm["Monetary"])
        rfm["RFM_Score"] = rfm["R_Quartile"].astype(str) + rfm["F_Quartile"].astype(str) + rfm["M_Quartile"].astype(str)
        high_value = rfm[rfm["RFM_Score"] == '444']
        at_risk = rfm[rfm["R_Quartile"] == 1]

        plt1 = plt.figure(figsize=(6, 4)); customers['gender'].value_counts().plot(kind='barh'); plt.title("Customer Gender Distribution"); gender_buf = plot_to_buf(plt1)
        plt2 = plt.figure(figsize=(6, 4)); customers['location'].value_counts().head(10).plot(kind='bar'); plt.title("Top 10 Customer Locations"); loc_buf = plot_to_buf(plt2)
        summary = f"RFM segmentation identifies {len(high_value)} high-value and {len(at_risk)} at-risk customers."
    except Exception as e:
        summary = exception_message("Customer Analytics", e)
    return rfm, high_value, at_risk, gender_buf, loc_buf, summary

def sales_conversion_analysis(orders, lineitems, products, quiet):
    cat_buf, sales_trend_buf, rev_by_cat, monthly_sales, summary = None, None, None, None, ""
    try:
        verbose_print("Sales and Conversion Analysis...", quiet)
        merged = pd.merge(lineitems, products, on="product_id")
        merged_orders = pd.merge(orders, merged, on="order_id")
        rev_by_cat = merged_orders.groupby("category")["total_amount"].sum().sort_values(ascending=False)
        plt1 = plt.figure(figsize=(10, 4)); rev_by_cat.plot(kind='bar'); plt.title("Revenue by Product Category"); cat_buf = plot_to_buf(plt1)
        merged_orders['Month'] = pd.to_datetime(merged_orders['order_date']).dt.to_period('M').astype(str)
        monthly_sales = merged_orders.groupby("Month")["total_amount"].sum()
        plt2 = plt.figure(figsize=(10, 4)); monthly_sales.plot(); plt.title("Monthly Revenue Trend"); plt.xlabel("Month"); sales_trend_buf = plot_to_buf(plt2)
        summary = "Revenue by product category and monthly trends shown."
    except Exception as e:
        summary = exception_message("Sales Conversion Analysis", e)
    return rev_by_cat, monthly_sales, cat_buf, sales_trend_buf, summary

def product_performance(lineitems, products, quiet):
    top_buf, bot_buf, top_10, bottom_10, summary = None, None, None, None, ""
    try:
        verbose_print("Product Performance...", quiet)
        
        merged_df = pd.merge(lineitems, products, on="product_id")
        
        prod_sales_by_name = merged_df.groupby("product_name")["quantity"].sum().reset_index()

        top_10 = prod_sales_by_name.sort_values("quantity", ascending=False).head(10)
        bottom_10 = prod_sales_by_name.sort_values("quantity", ascending=True).head(10)
        
        plt1 = plt.figure(figsize=(10, 4)); top_10.set_index("product_name")["quantity"].plot(kind='bar'); plt.title("Top 10 Bestselling Products"); top_buf = plot_to_buf(plt1)
        plt2 = plt.figure(figsize=(10, 4)); bottom_10.set_index("product_name")["quantity"].plot(kind='bar'); plt.title("Bottom 10 Products"); bot_buf = plot_to_buf(plt2)
        summary = "Top 10 bestsellers and bottom 10 slow movers visualized, aggregated by product name."
    except Exception as e:
        summary = exception_message("Product Performance", e)
    return top_10, bottom_10, top_buf, bot_buf, summary

def market_basket_analysis(lineitems, products, quiet):
    mba_buf, rules, summary = None, None, ""
    try:
        verbose_print("Market Basket Analysis...", quiet)

        all_order_ids = lineitems['order_id'].unique()
        sample_size = min(50000, len(all_order_ids))
        
        if sample_size > 1:
            sampled_order_ids = random.sample(list(all_order_ids), sample_size)
            sampled_lineitems = lineitems[lineitems['order_id'].isin(sampled_order_ids)]
        else:
            return None, None, "Not enough data for Market Basket Analysis."

        verbose_print(f"  (Analyzing a sample of {sample_size} orders)", quiet)
        
        basket = sampled_lineitems.groupby(['order_id', 'product_id'])['quantity'].sum().unstack(fill_value=0)
        basket_sets = basket.map(lambda x: 1 if x > 0 else 0)
        
        frequent_itemsets = fpgrowth(basket_sets, min_support=0.0005, use_colnames=True)
        
        if not frequent_itemsets.empty:
            rules_df = association_rules(frequent_itemsets, metric="confidence", min_threshold=0)
            
            rules = rules_df.sort_values("confidence", ascending=False)
            
            if not rules.empty:
                product_names = products.set_index('product_id')['product_name']
                rules['antecedents'] = rules['antecedents'].apply(lambda x: ', '.join([product_names.get(i, i) for i in x]))
                rules['consequents'] = rules['consequents'].apply(lambda x: ', '.join([product_names.get(i, i) for i in x]))
                summary = "Frequent product bundles and association rules found from a data sample."
            else:
                summary = "No association rules found."
        else:
            summary = "No frequent product bundles found for current settings."
    except Exception as e:
        summary = exception_message("Market Basket Analysis", e)
    return rules, mba_buf, summary

# --- CHANGE 1: THIS ENTIRE FUNCTION HAS BEEN REPLACED ---
def customer_personalization(customers, products, lineitems, orders, quiet):
    recommendations, summary = {}, ""
    try:
        verbose_print("Customer Personalization...", quiet)
        if customers is None:
            return {}, "Customer data missing for personalization."

        # Merge dataframes to link lineitems to personas and product names
        merged_df = pd.merge(lineitems, orders, on='order_id')
        merged_df = pd.merge(merged_df, customers, on='customer_id')
        merged_df = pd.merge(merged_df, products, on='product_id')

        recommendations = {}
        # Find the most frequently ordered product for each persona
        for persona in merged_df['persona'].unique():
            # .mode()[0] is an efficient way to find the most frequent item
            top_product = merged_df[merged_df['persona'] == persona]['product_name'].mode()[0]
            recommendations[persona] = top_product

        summary = "Generated top product recommendation for each customer persona."
    except Exception as e:
        summary = exception_message("Customer Personalization", e)
    return recommendations, summary
# --- END OF CHANGE 1 ---

def fraud_detection(orders, lineitems, quiet):
    fraud_orders, summary = None, ""
    try:
        verbose_print("Fraud Detection (Anomaly Detection)...", quiet)
        agg = lineitems.groupby('order_id')['quantity'].sum().reset_index()
        features = agg[['quantity']]
        model = IsolationForest(contamination=0.01, random_state=42)
        agg['anomaly'] = model.fit_predict(features)
        fraud_orders = agg[agg['anomaly'] == -1]
        summary = f"{len(fraud_orders)} potentially fraudulent orders detected."
    except Exception as e:
        summary = exception_message("Fraud Detection", e)
    return fraud_orders, summary

def geo_demo_analysis(customers, orders, quiet):
    geo_buf, sales_by_loc, summary = None, None, ""
    try:
        verbose_print("Geo/Demographic Analysis...", quiet)
        merged = orders.merge(customers[['customer_id', 'location']], on='customer_id')
        sales_by_loc = merged.groupby('location').size().sort_values(ascending=False).head(10)
        plt1 = plt.figure(figsize=(10, 5)); sales_by_loc.plot(kind="barh"); plt.title("Order Volume by City"); geo_buf = plot_to_buf(plt1)
        summary = "Top 10 high-volume sales cities highlighted."
    except Exception as e:
        summary = exception_message("Geo/Demographic Analysis", e)
    return sales_by_loc, geo_buf, summary

def write_pdf(report_name, summaries, images, quiet):
    verbose_print("Generating PDF report...", quiet)
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(report_name, pagesize=letter)
    Story = []
    while len(images) < len(summaries['titles']):
        images.append(None)
    for title, text, img_buf in zip(summaries['titles'], summaries['texts'], images):
        Story.append(Paragraph(title, styles['Heading2']))
        Story.append(Spacer(1, 8))
        Story.append(Paragraph(text.replace('\n', '<br/>'), styles['Normal']))
        Story.append(Spacer(1, 16))
        if img_buf:
            Story.append(Image(img_buf, width=400, height=200))
        Story.append(PageBreak())
    doc.build(Story)

def print_table(title, df, max_rows=5):
    print(f"\n{'='*20}\n{title}")
    if df is not None and not isinstance(df,str) and not df.empty:
        print(df.head(max_rows))
    else:
        print("[No data or error]")

def main():
    args = parse_args()
    verbose_print(f"Ecommerce Analytics by {AUTHOR}", args.quiet)
    report_texts, images = [], []
    try:
        dfs = load_data(args.datafolder, args.quiet)
    except Exception as e:
        print(exception_message("Load Data", e)); sys.exit(1)

    # Customer Analytics
    rfm, high_value, at_risk, gender_buf, loc_buf, ca_summary = customer_analytics(dfs['customers'], dfs['orders'], dfs['lineitems'], args.quiet)
    print("\n[Customer Analytics]:", ca_summary); print_table("High Value Customers (Sample)", high_value); print_table("At Risk Customers (Sample)", at_risk)
    report_texts.append(ca_summary); images.append(gender_buf)

    # Sales Conversion Analysis
    rev_by_cat, monthly_sales, cat_buf, st_buf, sca_summary = sales_conversion_analysis(dfs['orders'], dfs['lineitems'], dfs['products'], args.quiet)
    print("\n[Sales Conversion]:", sca_summary); print_table("Revenue by Product Category", rev_by_cat); print_table("Monthly Sales", monthly_sales)
    report_texts.append(sca_summary); images.append(cat_buf)

    # Product Performance
    top_10, bottom_10, top_buf, bot_buf, pp_summary = product_performance(dfs['lineitems'], dfs['products'], args.quiet)
    print("\n[Product Performance]:", pp_summary); print_table("Top 10 Products", top_10); print_table("Bottom 10 Products", bottom_10)
    report_texts.append(pp_summary); images.append(top_buf)

    # Market Basket Analysis
    rules, mba_buf, mba_summary = market_basket_analysis(dfs['lineitems'], dfs['products'], args.quiet)
    print("\n[Market Basket Analysis]:", mba_summary); print_table("Association Rules (top 5)", rules)
    report_texts.append(mba_summary); images.append(mba_buf)

    # --- CHANGE 2: THE FUNCTION CALL IS UPDATED ---
    # Personalization
    recomm, pers_summary = customer_personalization(dfs['customers'], dfs['products'], dfs['lineitems'], dfs['orders'], args.quiet)
    print("\n[Personalization]:", pers_summary); print_table("Recommendations by Segment", pd.DataFrame(list(recomm.items()), columns=["Segment", "Top Product"]))
    report_texts.append(pers_summary); images.append(None)
    # --- END OF CHANGE 2 ---

    # Fraud detection
    frauds, fraud_summary = fraud_detection(dfs['orders'], dfs['lineitems'], args.quiet)
    print("\n[Fraud Detection]:", fraud_summary); print_table("Fraudulent Transactions (Sample)", frauds)
    report_texts.append(fraud_summary); images.append(None)

    # Geo demo analysis
    sales_by_loc, geo_buf, geo_summary = geo_demo_analysis(dfs['customers'], dfs['orders'], args.quiet)
    print("\n[Geo/Demographic]:", geo_summary); print_table("Top Cities by Order Volume", sales_by_loc)
    report_texts.append(geo_summary); images.append(geo_buf)

    report_titles = ["Customer Demographics & Segmentation", "Sales Trends & Categories", "Product Performance", "Market Basket Analysis", "Customer Personalization/Recommendation", "Fraud/Anomaly Detection", "Geo/Demographic Breakdown"]

    try:
        write_pdf(os.path.join(args.datafolder, "report.pdf"), {'titles': report_titles, 'texts': report_texts}, images, args.quiet)
        print("\n[INFO] Analysis Complete. Output file: report.pdf")
    except Exception as e:
        print(exception_message("PDF Generation", e))
        sys.exit(2)

if __name__ == '__main__':
    main()