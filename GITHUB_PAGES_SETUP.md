# GitHub Pages Deployment Guide

## Recommended: Deploy from Branch (Simplest)

1. Go to: https://github.com/VinayaSharada/KateelLearningDemosToStudents/settings/pages

2. **Source:** Select `Deploy from a branch`

3. **Branch:** Select `main`

4. **Folder:** Select `/ (root)`

5. Click **Save**

**That's it!** Your demos will be live at:
```
https://vinayasharada.github.io/KateelLearningDemosToStudents/
```

## Alternative: GitHub Actions (For Complex Builds)

The `.github/workflows/deploy-gh-pages.yml` file is configured for GitHub Actions deployment if you need:
- Build steps before deployment
- Custom domain configuration
- Advanced deployment logic

**To use GitHub Actions:**
1. Go to Settings > Pages
2. Select "Deploy from a GitHub Actions workflow"
3. The workflow will run automatically on each push to main

## Live URLs

### Main Landing Page
```
https://vinayasharada.github.io/KateelLearningDemosToStudents/
```

### CFOWorkshop Treasury Demos
```
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/TreasuryControlTower/
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/FXHedgeSimulator/
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/CCCAnalyzer/
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/CollectionsPredictor/
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/SmartContractTreasury/
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/StablecoinManager/
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/AIHedgeOrchestrator/
https://vinayasharada.github.io/KateelLearningDemosToStudents/TechUseCaseDemos/TreasuryTransformBlueprint/
```

## Why Deploy from Branch is Recommended

For static demos (HTML/CSS/JS only):
- ✅ No build required
- ✅ Instant deployment
- ✅ Simpler setup
- ✅ GitHub manages caching
- ✅ Less maintenance

Use GitHub Actions only if you need:
- Build steps (TypeScript, React, etc.)
- Custom domain with CNAME
- Complex deployment logic