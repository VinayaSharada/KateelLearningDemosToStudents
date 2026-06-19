#!/bin/bash
# Add Google Analytics to all demo HTML files
GA_ID="G-V672XGCRSK"

for file in $(find . -name "index.html" \( -path "*/TechUseCaseDemos/*" -o -path "*/DomainUseCaseDemos/*" \) 2>/dev/null | grep -v node_modules); do
  if ! grep -q "gtag\|googletagmanager" "$file" 2>/dev/null; then
    # Add GA after <head>
    sed -i '1,/<head>/{/<head>/a\
<!-- Google Analytics -->\
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V672XGCRSK"></script>\
<script>\
  window.dataLayer = window.dataLayer || [];\
  function gtag(){dataLayer.push(arguments);}\
  gtag('\''js'\'', new Date());\
  gtag('\''config'\'', '\''G-V672XGCRSK'\'');\
<\/script>
}' "$file"
    echo "Added GA to $file"
  else
    echo "Already has GA: $file"
  fi
done