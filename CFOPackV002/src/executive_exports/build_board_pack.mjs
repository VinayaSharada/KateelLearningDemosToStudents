import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const [payloadPath, outputPath, previewDir] = process.argv.slice(2);
const p = JSON.parse(await fs.readFile(payloadPath, "utf8"));
await fs.mkdir(previewDir, { recursive: true });
const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const C = { navy: "#17324D", blue: "#2F6B9A", teal: "#178582", gold: "#D89B2B", red: "#B6463A", pale: "#EEF3F6", grey: "#657786" };

function box(slide, name, left, top, width, height, fill = C.pale) {
  return slide.shapes.add({ geometry: "roundRect", name, position: { left, top, width, height }, fill, line: { style: "solid", fill: "#D8E1E7", width: 1 }, borderRadius: "rounded-xl" });
}
function txt(slide, name, value, left, top, width, height, size = 24, color = C.navy, bold = false) {
  const shape = slide.shapes.add({ geometry: "textbox", name, position: { left, top, width, height }, fill: "none", line: { style: "solid", fill: "none", width: 0 } });
  shape.text = value;
  shape.text.style = { fontSize: size, color, bold };
  return shape;
}
function footer(slide, n) { txt(slide, `footer-${n}`, `${p.summary.scenario_version}  |  CFO Liquidity War Room  |  ${n}`, 820, 680, 400, 22, 13, C.grey); }
function money(v) { const sign = v < 0 ? "-" : ""; return `${sign}$${Math.abs(v / 1e6).toFixed(2)}M`; }

// Slide 1 - adapted from Codex Grid slide 21: sparse decision with two evidence anchors.
{
  const s = deck.slides.add(); s.background.fill = "#FFFFFF";
  txt(s, "eyebrow", "CFO DECISION", 42, 36, 420, 28, 16, C.teal, true);
  txt(s, "decision-title", "Protect 30-day liquidity\nwithout hiding the cost", 42, 92, 1050, 190, 54, C.navy, true);
  box(s, "bottom-field", 0, 390, 1280, 330, "#F5F7F8");
  box(s, "evidence-marker", 450, 455, 26, 26, C.teal);
  txt(s, "evidence-head", "Decision requested", 450, 508, 330, 34, 24, C.navy, true);
  txt(s, "evidence-body", `${money(p.summary.decisions.facility_draw)} facility draw plus ${p.summary.decisions.collection_strategy} collections and dated operating actions.`, 450, 548, 330, 100, 18, C.grey);
  box(s, "takeaway-marker", 860, 455, 26, 26, C.gold);
  txt(s, "takeaway-head", "Evidence standard", 860, 508, 330, 34, 24, C.navy, true);
  txt(s, "takeaway-body", `${p.summary.decisions.forecast_view.toUpperCase()} ${p.summary.decisions.model_use} forecast; ${p.summary.decisions.scenario_variant.replaceAll("_", " ")} event; downside execution tested.`, 860, 548, 330, 100, 18, C.grey);
  footer(s, 1);
}

// Slide 2 - adapted from slide 62: four metric fields.
{
  const s = deck.slides.add(); s.background.fill = "#FFFFFF";
  txt(s, "metrics-title", "The contractual view masks the liquidity trough", 42, 36, 1120, 70, 38, C.navy, true);
  const metrics = [
    [money(p.summary.contractual.ending_cash), "Contractual ending cash"],
    [money(p.summary.realistic.minimum_cash), "Realistic minimum cash"],
    [money(p.summary.selected.minimum_cash), "Selected minimum cash"],
    [money(p.summary.execution_stress.find(r => r.execution_case === "downside").minimum_cash), "Downside execution minimum"],
  ];
  metrics.forEach((m, i) => { const left = 42 + i * 309; box(s, `metric-${i}`, left, 190, 270, 300); txt(s, `metric-value-${i}`, m[0], left + 24, 225, 225, 88, 48, i === 1 ? C.red : C.navy, true); txt(s, `metric-label-${i}`, m[1], left + 24, 390, 220, 62, 18, C.grey); });
  box(s, "metric-band", 0, 570, 1280, 150, "#F5F7F8");
  txt(s, "metric-note", `Minimum-liquidity policy: ${money(p.manifest.minimum_liquidity)}. The recommendation must remain defensible when operating actions only partly execute.`, 60, 610, 1100, 55, 22, C.navy, true);
  footer(s, 2);
}

// Slide 3 - adapted from slide 64: evidence chart plus two decision statistics.
{
  const s = deck.slides.add(); s.background.fill = "#FFFFFF";
  txt(s, "chart-title", "Selected actions restore headroom after the event", 42, 36, 1120, 70, 38, C.navy, true);
  box(s, "chart-field", 42, 120, 590, 535);
  s.charts.add("line", { position: { left: 70, top: 155, width: 535, height: 445 }, categories: p.selected.map(r => String(r.day)), series: [{ name: "Selected cash", values: p.selected.map(r => r.closing_cash), fill: C.blue }, { name: "Minimum liquidity", values: p.selected.map(() => p.manifest.minimum_liquidity), fill: C.red }], hasLegend: true, yAxis: { majorGridlines: { style: "solid", fill: "#D8E1E7", width: 1 } } });
  txt(s, "chart-evidence", `The ${p.summary.decisions.scenario_variant.replaceAll("_", " ")} event is applied after the initial package is frozen.`, 675, 160, 520, 105, 24, C.navy, true);
  txt(s, "stat-min", money(p.summary.selected.minimum_cash), 680, 395, 230, 80, 48, C.teal, true);
  txt(s, "stat-min-label", "Selected minimum cash", 680, 490, 220, 55, 18, C.grey);
  txt(s, "stat-cost", money(p.summary.action_metrics.direct_action_cost), 980, 395, 230, 80, 48, C.gold, true);
  txt(s, "stat-cost-label", "Direct 30-day cost", 980, 490, 220, 55, 18, C.grey);
  footer(s, 3);
}

// Slide 4 - adapted from slide 66: three evidence columns.
{
  const s = deck.slides.add(); s.background.fill = "#FFFFFF";
  txt(s, "actions-title", "The package balances operations, funding and FX authority", 42, 36, 1160, 70, 38, C.navy, true);
  const cols = [
    ["Operating actions", `${p.summary.decisions.collection_strategy} collections\n${p.summary.decisions.payables_extension_days}-day supplier request\n${(p.summary.decisions.inventory_release_pct * 100).toFixed(1)}% inventory release`],
    ["Funding", `${money(p.summary.decisions.facility_draw)} draw\n${money(p.manifest.credit_facility.committed_capacity - p.summary.decisions.facility_draw)} unused capacity\nFees and interest included`],
    ["FX governance", `${money(p.summary.fx.incremental_hedge_usd)} incremental hedge\n${money(p.summary.fx.adverse_loss_reduction)} downside reduced\n${p.summary.fx.within_cfo_authority ? "Within CFO authority" : "Board approval required"}`],
  ];
  cols.forEach((c, i) => { const left = 42 + i * 411; box(s, `action-field-${i}`, left, 150, 374, 245, i === 0 ? "#EAF5F4" : i === 1 ? "#EDF2F7" : "#FBF3E3"); txt(s, `action-head-${i}`, c[0], left, 430, 360, 38, 24, C.navy, true); txt(s, `action-body-${i}`, c[1], left, 480, 360, 135, 19, C.grey); });
  footer(s, 4);
}

// Slide 5 - adapted from slide 79: three controlled next steps.
{
  const s = deck.slides.add(); s.background.fill = "#FFFFFF";
  txt(s, "gate-title", "Approve with evidence gates, not optimism", 42, 36, 1120, 70, 38, C.navy, true);
  const gates = [
    ["Day 1", "Authorize and evidence", "Record facility, hedge and action authority before execution."],
    ["Day 10", "Continue or revise", `Escalate if forecast cash falls below ${money(p.summary.decisions.cfo_escalation_threshold)}.`],
    ["Day 30", "Close the loop", "Compare forecast with actual, action achievement and residual risk."],
  ];
  gates.forEach((g, i) => { const left = 42 + i * 411; box(s, `gate-marker-${i}`, left, 350, 32, 32, i === 1 ? C.gold : C.teal); txt(s, `gate-day-${i}`, g[0], left, 410, 360, 36, 22, C.teal, true); txt(s, `gate-head-${i}`, g[1], left, 455, 360, 42, 25, C.navy, true); txt(s, `gate-body-${i}`, g[2], left, 510, 350, 100, 18, C.grey); });
  footer(s, 5);
}

for (const [i, slide] of deck.slides.items.entries()) {
  const png = await deck.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(`${previewDir}/slide-${String(i + 1).padStart(2, "0")}.png`, new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(`${previewDir}/slide-${String(i + 1).padStart(2, "0")}.layout.json`, await layout.text());
}
const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(`${previewDir}/montage.webp`, new Uint8Array(await montage.arrayBuffer()));
const inspect = await deck.inspect({ kind: "slide,textbox,shape,chart", maxChars: 8000 });
console.log(inspect.ndjson);
const file = await PresentationFile.exportPptx(deck);
await file.save(outputPath);
