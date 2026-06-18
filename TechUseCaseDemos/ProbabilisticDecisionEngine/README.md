# Probabilistic Decision Engine

## Learning Objectives
- Understand amortized inference for probabilistic AI
- Experience real-time probabilistic predictions
- Learn how to change assumptions and queries dynamically
- Explore healthcare decision support with uncertainty quantification

## How to Run
1. Open `index.html` in a browser
2. Adjust patient profile sliders and selectors
3. Toggle treatment options on/off
4. Try custom queries (e.g., "What if age > 60?")
5. Observe how predictions update instantly

## Key Features

### Amortized Inference (ACE)
- **Forward Pass**: Neural network predicts posterior in milliseconds
- **Real-time Updates**: Change assumptions → instant predictions
- **Multiple Queries**: Compare scenarios without retraining
- **Uncertainty Quantification**: See confidence intervals

### Interactive Controls
- **Patient Profile**: Age, biomarker level, symptom severity
- **Treatment Options**: Standard, Experimental, Combination
- **Custom Queries**: Modify predictions with natural language

## Use Cases

| Application | Benefit |
|-------------|---------|
| **Healthcare** | Treatment recommendations with uncertainty |
| **Finance** | Risk assessment with scenario analysis |
| **Robotics** | Real-time decision making under uncertainty |
| **Active Learning** | Query strategies for data labeling |

## How ACE Works

```
Traditional Inference:
  Simulator → MCMC/Sampling → Posterior (minutes/hours)

Amortized Inference (ACE):
  Neural Network → Posterior (milliseconds)
```

The amortized posterior network is trained once, then can make predictions instantly for any new query.

## Related Work

This demo is based on the **nanoACE** library from the Helsinki/Aalto/ELLIS Institute Finland research group:

- **Playground**: https://acerbilab.github.io/nanoACE/
- **GitHub**: https://github.com/acerbilab/nanoACE
- **Paper (AISTATS 2025)**: https://acerbilab.github.io/amortized-conditioning-engine/
- **Paper (NeurIPS 2025)**: https://huangdaolang.com/aline/
- **Paper (ICLR 2026)**: https://conorhassan.com/projects/artnp/

### Key Papers
1. Chang et al. (2025, AISTATS) - Amortized Conditioning Engine
2. Huang et al. (2025, NeurIPS) - ALINE: Active Learning with Neural Expressivity
3. Hassan et al. (2026, ICLR) - ARNTP: Adaptive Rejection Neural Transport

### Research Group
- **Machine and Human Intelligence Group**
- University of Helsinki & Aalto University
- ELLIS Institute Finland

## Acknowledgments

This educational demo is based on the **nanoACE** library and amortized inference research from:

- **Machine and Human Intelligence Group**, University of Helsinki & Aalto University
- **ELLIS Institute Finland**
- Key contributors: Paul Chang, Nasrulloh Loka Daolang Huang, Conor Hassan, Xinyi Wen, Yang Yang, Cen-You Li, Ulpu Remes, Ayush Bharti, Samuel Kaski

**Affiliated Papers:**
1. Chang et al. (2025, AISTATS) - Amortized Conditioning Engine
2. Huang et al. (2025, NeurIPS) - ALINE: Active Learning with Neural Expressivity
3. Hassan et al. (2026, ICLR) - ARNTP: Adaptive Rejection Neural Transport

**Note:** This is a simplified educational implementation. For production use, please refer to the official nanoACE library: https://github.com/acerbilab/nanoACE

## Attribution

This demo is part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) by Professor Vinaya Sathyanarayana.

**Educational Use Only** - For usage guidelines, see the main repository.