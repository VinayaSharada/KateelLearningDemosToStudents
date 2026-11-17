# DISCOM AT&C Loss & Smart Meter Anomaly Analytics

An interactive educational browser demo for energy analytics, smart grid operations, and MBA infrastructure finance.

## Overview

This demo simulates an 11kV electrical power distribution network, enabling students to:
- Disentangle physical technical conductor losses ($I^2R$) from non-technical commercial losses (electricity theft, meter tampering).
- Understand the official CEA/Uday formulation for **Aggregate Technical & Commercial (AT&C) losses**.
- Experience how smart meter telemetry and unsupervised anomaly detection prioritize field audit crews to recover utility revenue.

## Learning Objectives

1. Calculate Billing Efficiency, Collection Efficiency, and composite AT&C loss rates.
2. Observe how Power Factor ($\cos \phi$) and conductor resistance quadratically escalate physical heat dissipation losses.
3. Evaluate the economic trade-off between AI anomaly detection precision, false positives, and field inspection costs.

## Run Modes

| Mode | Best For | Setup Effort | Expected First Run |
|---|---|---|---|
| **Browser** (Default) | In-class presentation, interactive student labs | None (pure client-side HTML5/ES6) | Instant (< 50ms) |

## Files in This Folder

- `index.html`: Interactive launch page featuring sliders, KPI cards, canvas Sankey energy balance, DTR topology grid, and exportable audit table.
- `about.html`: In-depth teaching guide detailing mathematical formulas, engineering principles, and classroom discussion prompts.
- `app.js`: High-performance simulation logic, physical line loss modeling, and anomaly scoring.
- `style.css`: Clean, dark glassmorphism styling aligned with repository design standards.
- `synthetic_feeder_data.json`: Curated dataset of 30 distribution transformers across 3 feeder archetypes.

## Related Catalog Use Cases

- **APP-AUTH-06**: Energy Grid Load Balancing & Demand Response
- **LIB-EN01**: Constrained Energy Optimization
- **LIB-EN02**: Risk-Informed Utility Maintenance Planning

## Attribution

Created by **Professor Vinaya Sathyanarayana** for the Lead with AI Curriculum.