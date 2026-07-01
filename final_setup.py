#!/usr/bin/env python3
import os
import shutil
import sys

print("🚀 Treasury Analytics Colab Notebooks - GitHub Repository Setup")
print("=" * 60)

# Source directory - using the exact path we know works
source_dir = "G:\\Other computers\\KateelSharada\\Sharada\\SPJain\\FinanceCertProgram\\notebooks\\colab"

# Destination directory for the KateelLearningDemosToStudents repository
dest_dir = r"C:\Users\vsathya\todel\gitrepos\KateelLearningDemosToStudents\TreasuryAnalytics"

print(f"📁 Source directory: {source_dir}")
print(f"📁 Destination directory: {dest_dir}")

# Check if source directory exists and list its contents
if not os.path.exists(source_dir):
    print(f"❌ ERROR: Source directory does not exist: {source_dir}")
    sys.exit(1)

print(f"\n📋 CONTENTS OF SOURCE DIRECTORY:")
source_items = os.listdir(source_dir)
for i, item in enumerate(source_items, 1):
    full_path = os.path.join(source_dir, item)
    if os.path.isfile(full_path):
        size = os.path.getsize(full_path)
        print(f"   {i}. 📄 {item} ({size:,} bytes)")
    else:
        print(f"   {i}. 📁 {item}/")

# Filter for IPYNB files (notebooks)
ipynb_files = [f for f in source_items if f.endswith('.ipynb')]
print(f"\n📊 SUMMARY:")
print(f"   Total files: {len(source_items)}")
print(f"   Jupyter notebooks: {len(ipynb_files)}")
print(f"   Non-notebook files: {len(source_items) - len(ipynb_files)}")

# Create destination directory if it doesn't exist
os.makedirs(dest_dir, exist_ok=True)
print(f"\n✅ Created/check destination directory: {dest_dir}")

# Copy IPYNB files to destination
print(f"\n🔄 COPYING NOTEBOOKS TO DESTINATION:")
copied_count = 0
skipped_count = 0

for notebook in ipynb_files:
    source_file = os.path.join(source_dir, notebook)
    dest_file = os.path.join(dest_dir, notebook)
    
    if not os.path.exists(dest_file):
        try:
            shutil.copy2(source_file, dest_file)
            print(f"   ✅ Copied: {notebook}")
            copied_count += 1
        except Exception as e:
            print(f"   ❌ ERROR copying {notebook}: {e}")
            sys.exit(1)
    else:
        print(f"   ⏭️  Skipped (already exists): {notebook}")
        skipped_count += 1

print(f"\n📊 COPY RESULTS:")
print(f"   Successfully copied: {copied_count}")
print(f"   Already existed: {skipped_count}")
print(f"   Total notebooks processed: {len(ipynb_files)}")

print(f"\n🎉 SUCCESS!")
print(f"   All Treasury Analytics Colab notebooks are now available in the KateelLearningDemosToStudents repository.")
print(f"   Location: {dest_dir}")
print(f"   Note: The repository already exists and is ready for participant use.")

print(f"\n📋 NEXT STEPS FOR PARTICIPANTS:")
print(f"   1. Access the repository: KateelLearningDemosToStudents/TreasuryAnalytics/")
print(f"   2. Open notebooks in Google Colab using 'File > Open' > '.ipynb'")
print(f"   3. Follow the step-by-step instructions in each notebook")
print(f"   4. Complete exercises and demonstrations")
print(f"   5. Export results and documentation as required")

print(f"\n🏆 The Treasury Analytics Colab notebook collection is now ready for immediate participant use!")