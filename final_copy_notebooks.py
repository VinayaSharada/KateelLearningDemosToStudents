#!/usr/bin/env python3
import os
import shutil
import json

print("🚀 Treasury Analytics Colab Notebooks - GitHub Repository Setup")
print("=" * 60)

# Source directory
source_dir = r"G:\\Other computers\\KateelSharada\\Sharada\\SPJain\\FinanceCertProgram\\notebooks\\colab"

# Destination directory
dest_dir = r"C:\\Users\\vsathya\\todel\\gitrepos\\KateelLearningDemosToStudents\\TreasuryAnalytics"

# Create destination directory if it doesn't exist
os.makedirs(dest_dir, exist_ok=True)

# Check if source directory exists
if not os.path.exists(source_dir):
    print(f"❌ Source directory not found: {source_dir}")
    print(f"   Current directory: {os.getcwd()}")
    # List parent directories
    parent = os.path.dirname(source_dir)
    print(f"   Parent directory contents: {os.listdir(parent)}")
    sys.exit(1)

# List all files in source directory
source_files = os.listdir(source_dir)
ipynb_files = [f for f in source_files if f.endswith('.ipynb')]

print(f"📚 Found {len(ipynb_files)} notebooks in source directory:")
for f in ipynb_files:
    print(f"   📄 {f}")

# Check which files exist in destination
dest_exists = os.path.exists(dest_dir)
if dest_exists:
    existing_files = os.listdir(dest_dir)
    print(f"\n📁 Destination directory exists with {len(existing_files)} files:")
    for f in existing_files:
        print(f"   📄 {f}")
else:
    print(f"\n📁 Destination directory does not exist yet")

# Copy missing files
new_files = []
for notebook in ipynb_files:
    source_file = os.path.join(source_dir, notebook)
    dest_file = os.path.join(dest_dir, notebook)
    
    if not os.path.exists(dest_file):
        try:
            shutil.copy2(source_file, dest_file)
            new_files.append(notebook)
            print(f"✅ Copied: {notebook}")
        except Exception as e:
            print(f"❌ Error copying {notebook}: {e}")
    else:
        print(f"⏭️  Already exists: {notebook}")

print(f"\n📊 Summary:")
print(f"   Total notebooks available: {len(ipynb_files)}")
print(f"   Successfully copied: {len(new_files)}")
print(f"   Already existed: {len(ipynb_files) - len(new_files)}")
print(f"   Destination: {dest_dir}")

print(f"\n🎯 All notebooks are now available in the KateelLearningDemosToStudents repository!")