import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const [payloadPath, outputPath, previewPath] = process.argv.slice(2);
const payload = JSON.parse(await fs.readFile(payloadPath, "utf8"));
const wb = Workbook.create();
const navy = "#17324D", blue = "#2F6B9A", teal = "#178582", gold = "#D89B2B", red = "#B6463A";

function title(sheet, text, endCol) {
  sheet.showGridLines = false;
  const range = sheet.getRange(`A1:${endCol}1`);
  range.merge();
  range.values = [[text]];
  range.format.fill = navy;
  range.format.font = { bold: true, color: "#FFFFFF", size: 18 };
  range.format.rowHeight = 30;
}

function header(range) {
  range.format.fill = blue;
  range.format.font = { bold: true, color: "#FFFFFF" };
  range.format.borders = { preset: "outside", style: "thin", color: navy };
}

const inputs = wb.worksheets.add("Inputs");
const dashboard = wb.worksheets.add("Decision Dashboard");
const contractual = wb.worksheets.add("Contractual");
const realistic = wb.worksheets.add("Realistic");
const selected = wb.worksheets.add("Selected Actions");
const actions = wb.worksheets.add("Action Scenarios");
const fx = wb.worksheets.add("FX Decision");
const plan = wb.worksheets.add("Action Plan");
const evidence = wb.worksheets.add("Evidence Register");

title(inputs, "CFOPackV002 - Inputs and Decision Charter", "D");
inputs.getRange("A3:D3").values = [["Category", "Input", "Value", "Source"]];
header(inputs.getRange("A3:D3"));
const inputRows = [
  ["Scenario", "Version", payload.summary.scenario_version, "scenario_manifest.json"],
  ["Scenario", "Opening cash", payload.manifest.opening_cash, "scenario_manifest.json"],
  ["Policy", "Minimum liquidity", payload.manifest.minimum_liquidity, "scenario_manifest.json"],
  ["Decision", "Forecast method", payload.summary.decisions.model_use, "decision_ledger.csv"],
  ["Decision", "Forecast view", payload.summary.decisions.forecast_view, "decision_ledger.csv"],
  ["Decision", "Scenario", payload.summary.decisions.scenario_variant, "decision_ledger.csv"],
  ["Decision", "Execution case", payload.summary.decisions.execution_case, "decision_ledger.csv"],
  ["Decision", "Facility draw", payload.summary.decisions.facility_draw, "decision_ledger.csv"],
  ["Control", "CFO escalation threshold", payload.summary.decisions.cfo_escalation_threshold, "decision_ledger.csv"],
];
inputs.getRange(`A4:D${3 + inputRows.length}`).values = inputRows;
inputs.getRange("C5:C6").format.numberFormat = '"$"#,##0';
inputs.getRange("C11:C12").format.numberFormat = '"$"#,##0';
inputs.getRange("A:D").format.columnWidth = 24;

function forecastSheet(sheet, name, rows) {
  title(sheet, name, "K");
  const headers = ["Day", "Date", "Receipts", "Operating outflows", "Supplier outflows", "Other outflows", "Total outflows", "Net cash flow", "Opening cash", "Closing cash", "Below minimum"];
  sheet.getRange("A3:K3").values = [headers];
  header(sheet.getRange("A3:K3"));
  const values = rows.map(r => [r.day, new Date(r.date), r.receipts, r.operating_outflows, r.supplier_outflows, r.other_outflows, null, null, null, null, null]);
  const end = 3 + values.length;
  sheet.getRange(`A4:K${end}`).values = values;
  for (let row = 4; row <= end; row++) {
    sheet.getRange(`G${row}`).formulas = [[`=SUM(D${row}:F${row})`]];
    sheet.getRange(`H${row}`).formulas = [[`=C${row}-G${row}`]];
    sheet.getRange(`I${row}`).formulas = [[row === 4 ? "='Inputs'!$C$5" : `=J${row - 1}`]];
    sheet.getRange(`J${row}`).formulas = [[`=I${row}+H${row}`]];
    sheet.getRange(`K${row}`).formulas = [[`=J${row}<'Inputs'!$C$6`]];
  }
  sheet.getRange(`B4:B${end}`).format.numberFormat = "yyyy-mm-dd";
  sheet.getRange(`C4:J${end}`).format.numberFormat = '"$"#,##0';
  sheet.getRange(`A:K`).format.columnWidth = 17;
  sheet.getRange("B:B").format.columnWidth = 14;
  sheet.freezePanes.freezeRows(3);
  const chart = sheet.charts.add("line", sheet.getRange(`A3:A${end}`));
  const series = chart.series.add("Closing cash");
  series.categoryFormula = `'${name}'!$A$4:$A$${end}`;
  series.formula = `'${name}'!$J$4:$J$${end}`;
  chart.titleText = `${name} - closing cash`;
  chart.hasLegend = false;
  chart.setPosition("M3", "U19");
}

forecastSheet(contractual, "Contractual", payload.contractual);
forecastSheet(realistic, "Realistic", payload.realistic);
forecastSheet(selected, "Selected Actions", payload.selected);

function recordsSheet(sheet, name, records) {
  const cols = Object.keys(records[0] || { note: "No records" });
  title(sheet, name, String.fromCharCode(64 + Math.min(cols.length, 26)));
  sheet.getRangeByIndexes(2, 0, 1, cols.length).values = [cols];
  header(sheet.getRangeByIndexes(2, 0, 1, cols.length));
  if (records.length) sheet.getRangeByIndexes(3, 0, records.length, cols.length).values = records.map(row => cols.map(col => row[col]));
  sheet.getUsedRange().format.autofitColumns();
  sheet.getUsedRange().format.autofitRows();
  sheet.freezePanes.freezeRows(3);
}
recordsSheet(actions, "Action Scenario Comparison", payload.action_scenarios);
recordsSheet(fx, "FX Decision and Authority", payload.fx);
recordsSheet(plan, "30-Day Action Plan", payload.action_plan);
recordsSheet(evidence, "Decision Evidence Register", payload.evidence);

title(dashboard, "CFO Liquidity Decision Dashboard", "J");
dashboard.getRange("A3:B3").values = [["Decision evidence", "Result"]];
header(dashboard.getRange("A3:B3"));
dashboard.getRange("A4:A10").values = [["Contractual ending cash"], ["Realistic minimum cash"], ["Selected minimum cash"], ["Downside execution minimum"], ["Direct action cost"], ["Facility draw"], ["FX adverse-loss reduction"]];
dashboard.getRange("B4:B10").formulas = [["='Contractual'!J33"], ["=MIN('Realistic'!J4:J33)"], ["=MIN('Selected Actions'!J4:J33)"], [`=${payload.summary.execution_stress.find(r => r.execution_case === "downside").minimum_cash}`], [`=${payload.summary.action_metrics.direct_action_cost}`], ["='Inputs'!C11"], [`=${payload.summary.fx.adverse_loss_reduction}`]];
dashboard.getRange("B4:B10").format.numberFormat = '"$"#,##0';
dashboard.getRange("A12:D12").values = [["Day", "Contractual", "Realistic", "Selected"]];
header(dashboard.getRange("A12:D12"));
for (let row = 13; row <= 42; row++) {
  const source = row - 9;
  dashboard.getRange(`A${row}:D${row}`).formulas = [[`='Contractual'!A${source}`, `='Contractual'!J${source}`, `='Realistic'!J${source}`, `='Selected Actions'!J${source}`]];
}
dashboard.getRange("B13:D42").format.numberFormat = '"$"#,##0';
const dashChart = dashboard.charts.add("line", dashboard.getRange("A12:D42"));
dashChart.titleText = "30-day liquidity views";
dashChart.setPosition("F3", "N20");
dashboard.getRange("A:A").format.columnWidth = 30;
dashboard.getRange("B:D").format.columnWidth = 18;
dashboard.showGridLines = false;

const inspect = await wb.inspect({ kind: "table", range: "Decision Dashboard!A1:J20", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 10 });
console.log(inspect.ndjson);
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "formula error scan" });
console.log(errors.ndjson);
const preview = await wb.render({ sheetName: "Decision Dashboard", range: "A1:N20", scale: 1.5 });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const file = await SpreadsheetFile.exportXlsx(wb);
await file.save(outputPath);
