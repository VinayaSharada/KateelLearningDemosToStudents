#!/usr/bin/env python3
import os
import sys
import shutil

print("🚀 Treasury Analytics Colab Notebooks - GitHub Repository Setup")
print("=" * 60)

# Source directory
source_dir = "G:\\Other computers\\KateelSharada\\Sharada\\SPJain\\FinanceCertProgram\\notebooks\\colab"

# Destination directory
dest_dir = "C:\\Users\\vsathya\\todel\\gitrepos\\KateelLearningDemosToStudents\\TreasuryAnalytics"

# Create destination directory if it doesn't exist
os.makedirs(dest_dir, exist_ok=True)

# Notebooks status
notebooks = [
    "01_basic_setup_and_data_preprocessing.ipynb",
    "02_cash_fragmentation_analysis_fundamentals.ipynb",
    "03_predictive_analytics_and_time_series_forecasting.ipynb",
    "04_real_time_anomaly_detection_with_neural_networks.ipynb",
    "05_comprehensive_dashboard_creation_and_visualization.ipynb",
    "06_advanced_features_and_model_deployment.ipynb",
    "07_entire_practical_demo_workflow.ipynb",
    "08_colab_environment_management_and_troubleshooting.ipynb"
]

# Copy each notebook to destination
for notebook in notebooks:
    source_file = os.path.join(source_dir, notebook)
    dest_file = os.path.join(dest_dir, notebook)
    
    if os.path.exists(source_file):
        shutil.copy2(source_file, dest_file)
        print(f"✅ Copied: {notebook}")
    else:
        print(f"❌ Missing: {notebook}")

print(f"\n📊 Summary:")
print(f"   Total notebooks to copy: {len(notebooks)}")
print(f"   Successfully copied: {len([n for n in notebooks if os.path.exists(os.path.join(dest_dir, n))])}")
print(f"   Destination: {dest_dir}")

print(f"\n🎯 All notebooks are now available in the KateelLearningDemosToStudents repository!")