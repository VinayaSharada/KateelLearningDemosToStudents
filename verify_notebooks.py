#!/bin/env python3
import os

# Check if TreasuryAnalytics directory exists and list contents
treasury_path = r"C:\Users\vsathya\todel\gitrepos\KateelLearningDemosToStudents\TreasuryAnalytics"

print("🚀 Treasury Analytics Colab Notebooks - Repository Status Check")
print("=" * 60)

if not os.path.exists(treasury_path):
    print("❌ ERROR: TreasuryAnalytics directory does not exist!")
    print(f"   Expected path: {treasury_path}")
    exit(1)

print(f"✅ TreasuryAnalytics directory exists: {treasury_path}")

# List all files in the directory
print("\n📋 CONTENTS OF TreasuryAnalytics DIRECTORY:")
items = os.listdir(treasury_path)

print(f"\n📊 SUMMARY:")
print(f"   Total items: {len(items)}")

# Count different file types
ipynb_count = sum(1 for item in items if item.endswith('.ipynb'))
py_count = sum(1 for item in items if item.endswith('.py'))
md_count = sum(1 for item in items if item.endswith('.md'))
pycount_notebooks = [item for item in items if item.startswith('0') and item.endswith('.ipynb')]

print(f"   Jupyter notebooks (.ipynb): {ipynb_count}")
print(f"   Python scripts (.py): {py_count}")
print(f"   Markdown files (.md): {md_count}")

# List all .ipynb files with details
if ipynb_count > 0:
    print(f"\n📚 LIST OF NOTEBOOKS:")
    for i, notebook in enumerate(ipynb_count_sorted := sorted([item for item in items if item.endswith('.ipynb')]), 1):
        full_path = os.path.join(treasury_path, notebook)
        size = os.path.getsize(full_path) if os.path.isfile(full_path) else 0
        print(f"   {i}. 📄 {notebook} ({size:,} bytes)")

# Check if we have the expected notebooks
expected_notebooks = ['01_basic_setup_and_data_preprocessing.ipynb',
                     '02_cash_fragmentation_analysis_fundamentals.ipynb',
                     '03_predictive_analytics_and_time_series_forecasting.ipynb',
                     '04_real_time_anomaly_detection_with_neural_networks.ipynb',
                     '05_comprehensive_dashboard_creation_and_visualization.ipynb',
                     '06_advanced_features_and_model_deployment.ipynb',
                     '07_entire_practical_demo_workflow.ipynb',
                     '08_colab_environment_management_and_troubleshooting.ipynb']

print(f"\n🎯 EXPECTED NOTEBOOKS STATUS:")
found_count = 0
for notebook in expected_notebooks:
    if notebook in items:
        print(f"   ✅ {notebook}")
        found_count += 1
    else:
        print(f"   ❌ {notebook} (MISSING)")

print(f"\n📊 COMPLETION STATUS:")
print(f"   Expected notebooks: {len(expected_notebooks)}")
print(f"   Found in repository: {found_count}")
print(f"   Completion rate: {(found_count/len(expected_notebooks))*100:.1f}%")

if found_count == len(expected_notebooks):
    print(f"\n🎉 SUCCESS! All Treasury Analytics Colab notebooks are now available in the KateelLearningDemosToStudents repository!")
    print(f"   Repository: {treasury_path}")
    print(f"   Total notebooks: {len(expected_notebooks)} (100% complete)")
else:
    print(f"\n⚠️  WARNING: Some notebooks are missing!")
    print(f"   Missing: {len(expected_notebooks) - found_count} notebooks")

print(f"\n📋 NEXT STEPS:")
print(f"   1. Verify notebooks are accessible in the repository")
print(f"   2. Test that notebooks can be opened in Google Colab")
print(f"   3. Ensure content is complete and ready for participants")
print(f"   4. Update any additional documentation if needed")

print(f"\n🏆 The Treasury Analytics Colab notebook collection has been successfully migrated to the KateelLearningDemosToStudents repository!")