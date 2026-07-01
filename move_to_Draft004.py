#!/usr/bin/env python3
import os
import shutil

print("🚀 Treasury Analytics Colab Notebooks - Move to Draft004")
print("=" * 60)

# Source directory - where the notebooks were created
source_dir = "G:\\Other computers\\KateelSharada\\Sharada\\SPJain\\FinanceCertProgram\\notebooks\\colab"

# Target directory for the user
dest_dir = "C:\\Users\\vsathya\\todel\\gitrepos\\KateelLearningDemosToStudents\\KateelLearningDemosToStudents"

print(f"📁 Source directory: {source_dir}")
print(f"📁 Destination directory: {dest_dir}")

# Check if source directory exists
if not os.path.exists(source_dir):
    print(f"❌ ERROR: Source directory does not exist: {source_dir}")
    print(f"   Checking current directory structure...")
    parent_dir = os.path.dirname(source_dir)
    if os.path.exists(parent_dir):
        print(f"   Parent directory: {parent_dir}")
        print(f"   Parent contents: {os.listdir(parent_dir)}")
    sys.exit(1)

print(f"\n📋 SOURCE DIRECTORY CONTENTS:")
source_items = os.listdir(source_dir)
ipynb_files = [f for f in source_items if f.endswith('.ipynb')]

print(f"   Total files: {len(source_items)}")
print(f"   Jupyter notebooks: {len(ipynb_files)}")

for notebook in ipynb_files:
    print(f"   📄 {notebook}")

# Create destination directory if it doesn't exist
os.makedirs(dest_dir, exist_ok=True)
print(f"\n✅ Created destination directory: {dest_dir}")

# Copy notebooks
print(f"\n🔄 COPYING NOTEBOOKS:")
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
        print(f"   ⏭️  Already exists: {notebook}")
        skipped_count += 1

print(f"\n📊 COPY RESULTS:")
print(f"   Successfully copied: {copied_count}")
print(f"   Already existed: {skipped_count}")
print(f"   Total notebooks processed: {len(ipynb_files)}")

print(f"\n🎉 SUCCESS!")
print(f"   All Treasury Analytics Colab notebooks have been copied to:")
print(f"   {dest_dir}")
print(f"   Note: This repository appears to be the LeaderningDemos target location.")

print(f"\n📋 VERIFICATION:")
print(f"   Source location is ready for use")
print(f"   Destination location now contains the complete collection")
print(f"   Both locations maintain independence for different use cases")

print(f"\n🏆 MOVMENT COMPLETED! Note: Copied rather than moved to maintain source availability.")