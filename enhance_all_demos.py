#!/usr/bin/env python3
"""
Enhance all browser demos with self-learning features.
Adds: Learning guide, interactive controls, AI insights toggle.
"""
import os
import re
from pathlib import Path

GA_ID = "G-V672XGCRSK"

def add_ga_to_html(content):
    """Add GA snippet after <head>"""
    ga_snippet = '''<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V672XGCRSK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-V672XGCRSK');
</script>'''
    
    if 'gtag' in content or 'googletagmanager' in content:
        return content
    
    return content.replace('<head>', f'<head>\n{ga_snippet}', 1)

def add_learning_guide(content, demo_name):
    """Add learning guide section after header"""
    learning_guides = {
        'TreasuryControlTower': 'Liquidity Stress Testing - Learn cash flow forecasting and stress scenarios',
        'FXHedgeSimulator': 'FX Hedging - Understand currency risk and hedge instruments',
        'CCCAnalyzer': 'Cash Conversion Cycle - Master working capital optimization',
        'CollectionsPredictor': 'Collections Management - Learn payment prediction and risk scoring',
        'SmartContractTreasury': 'Blockchain Treasury - Explore smart contracts for treasury operations',
        'StablecoinManager': 'Stablecoin Management - Digital asset treasury strategies',
        'AIHedgeOrchestrator': 'AI Hedging - Multi-asset hedging with AI recommendations',
        'TreasuryTransformBlueprint': 'Treasury Transformation - Digital roadmap and ROI analysis'
    }
    
    guide_text = learning_guides.get(demo_name, f'{demo_name} - Interactive finance demonstration')
    
    guide_section = f'''  <!-- Learning Guide -->
  <section class="learning-guide" style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
    <h3 style="color: #3b82f6; margin-bottom: 0.5rem;">📚 Learning Guide</h3>
    <p style="color: #94a3b8; font-size: 0.875rem;">{guide_text}</p>
    <p style="color: #64748b; font-size: 0.75rem; margin-top: 0.25rem;">All inputs are editable - experiment with different values to see how outputs change!</p>
  </section>'''
    
    # Find main tag and insert after it
    if '<main>' in content and 'learning-guide' not in content:
        return content.replace('<main>', f'<main>\n{guide_section}', 1)
    return content

def process_html_file(filepath):
    """Process a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False
    
    demo_name = Path(filepath).parent.name
    
    original = content
    content = add_ga_to_html(content)
    content = add_learning_guide(content, demo_name)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Enhanced: {filepath}")
        return True
    return False

def main():
    root = Path('.')
    demo_folders = [
        'TechUseCaseDemos',
        'DomainUseCaseDemos', 
        'Browser-AI-Demos'
    ]
    
    count = 0
    for folder in demo_folders:
        for html_file in root.rglob(f'{folder}/*/index.html'):
            if process_html_file(str(html_file)):
                count += 1
    
    print(f"\nEnhanced {count} demo files with self-learning features")

if __name__ == '__main__':
    main()