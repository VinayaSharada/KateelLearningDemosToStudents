# Executive Export Builder

Builds three decision-native artifacts from a completed V002 output directory:

- `CFO_Liquidity_Decision_Model.xlsx`
- `CFO_Liquidity_Board_Pack.pptx`
- `CFO_Liquidity_Decision_Paper.pdf`

The Excel and PowerPoint builders require the configured `@oai/artifact-tool`
runtime. Set `CFOPACK_ARTIFACT_NODE_MODULES` and, when necessary,
`CFOPACK_NODE` to the approved runtime paths. The facilitator can generate the
pack after receiving a team's output folder; participant calculations and
source CSV/Markdown exports remain available in Colab.

```bash
python CFOPackV002/src/executive_exports/build_exports.py \
  path/to/team/outputs path/to/team/executive_pack
```

Every artifact carries the scenario version and is generated from the team
decision ledger and named evidence files.
