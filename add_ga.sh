#!/bin/bash
GA_ID="G-V672XGCRSK"
GA_CODE="<!-- Google Analytics -->
<script async src=\"https://www.googletagmanager.com/gtag/js?id=$GA_ID\"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '$GA_ID');
</script>"

find . -name "index.html" -path "*/TechUseCaseDemos/*" -o -name "index.html" -path "*/DomainUseCaseDemos/*" -o -name "index.html" -path "*/Browser-AI-Demos/*" 2>/dev/null | while read file; do
  if ! grep -q "gtag\|googletagmanager" "$file" 2>/dev/null; then
    sed -i "s|<head>|<head>\n$GA_CODE|" "$file"
    echo "Added GA to $file"
  else
    echo "Already has GA: $file"
  fi
done
