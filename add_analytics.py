#!/usr/bin/env python3
"""
Add Google Analytics to all demo HTML files
Usage: python add_analytics.py G-XXXXXXXXXX
"""
import sys
import os
from pathlib import Path

GA_ID = sys.argv[1] if len(sys.argv) > 1 else "G-XXXXXXXXXX"
GA_CODE = f'''<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', '{GA_ID}');
</script>
'''

def add_analytics_to_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'gtag' in content or 'googletagmanager' in content:
        print(f"  ✓ Already has GA: {filepath}")
        return
    
    # Insert after <head> tag
    if '<head>' in content:
        content = content.replace('<head>', f'<head>\n{GA_CODE}')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Added GA: {filepath}")

def main():
    root = Path('.')
    html_files = list(root.rglob('index.html'))
    print(f"Found {len(html_files)} HTML files to update...")
    
    for html_file in html_files:
        add_analytics_to_file(html_file)
    
    print("\nDone! Don't forget to replace G-XXXXXXXXXX with your actual GA4 Measurement ID")

if __name__ == '__main__':
    main()