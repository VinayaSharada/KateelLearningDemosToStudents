#!/bin/bash
# Add learning guide to all demos

for file in $(find . -name "index.html" \( -path "*/TechUseCaseDemos/*" -o -path "*/DomainUseCaseDemos/*" \) 2>/dev/null | grep -v node_modules); do
  if ! grep -q "learning-guide" "$file" 2>/dev/null; then
    # Add learning guide after <main>
    sed -i '/<main>/a\
  <!-- Learning Guide -->\
  <section class="learning-guide" style="background: rgba(59, 130, 246, 0.1); border: 1px solid #3b82f6; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">\
    <h3 style="color: #3b82f6; margin-bottom: 0.5rem;">📚 Learning Guide</h3>\
    <p style="color: #94a3b8; font-size: 0.875rem;">Interactive finance demonstration - All inputs are editable!</p>\
    <p style="color: #64748b; font-size: 0.75rem; margin-top: 0.25rem;">Experiment with different values to see how outputs change.</p>\
  </section>' "$file"
    echo "Added learning guide to $file"
  else
    echo "Already has guide: $file"
  fi
done