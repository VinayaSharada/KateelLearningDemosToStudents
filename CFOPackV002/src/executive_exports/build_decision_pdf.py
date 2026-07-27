"""Create a polished two-page CFO decision paper PDF from an export payload."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
output = Path(sys.argv[2])
summary = payload["summary"]
manifest = payload["manifest"]
styles = getSampleStyleSheet()
navy, teal, gold, red = colors.HexColor("#17324D"), colors.HexColor("#178582"), colors.HexColor("#D89B2B"), colors.HexColor("#B6463A")
styles.add(ParagraphStyle(name="CFO_Title", parent=styles["Title"], textColor=navy, fontSize=22, leading=26, spaceAfter=8))
styles.add(ParagraphStyle(name="CFO_H2", parent=styles["Heading2"], textColor=navy, fontSize=12, leading=15, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name="CFO_Body", parent=styles["BodyText"], fontSize=9, leading=12, textColor=colors.HexColor("#283747")))
styles.add(ParagraphStyle(name="CFO_Small", parent=styles["BodyText"], fontSize=7.5, leading=9.5, textColor=colors.HexColor("#657786")))


def money(value: float) -> str:
    sign = "-" if value < 0 else ""
    return f"{sign}${abs(value):,.0f}"


def decorate(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(navy)
    canvas.rect(0, A4[1] - 13 * mm, A4[0], 13 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(16 * mm, A4[1] - 8.5 * mm, "CFOPackV002 | CFO Liquidity War Room")
    canvas.setFillColor(colors.HexColor("#657786"))
    canvas.setFont("Helvetica", 7)
    canvas.drawRightString(A4[0] - 16 * mm, 9 * mm, f"Page {doc.page} | {summary['scenario_version']}")
    canvas.restoreState()


doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=16*mm, leftMargin=16*mm, topMargin=20*mm, bottomMargin=16*mm)
story = [
    Paragraph("CFO Liquidity Decision Paper", styles["CFO_Title"]),
    Paragraph(f"Team: {summary['decisions']['team_name']} | Event: {summary['decisions']['scenario_variant'].replace('_', ' ')} | Horizon: {manifest['forecast_horizon_days']} days", styles["CFO_Small"]),
    Spacer(1, 3*mm),
    Paragraph("Decision requested", styles["CFO_H2"]),
    Paragraph(
        f"Authorize a {money(summary['decisions']['facility_draw'])} committed-facility draw, "
        f"the {summary['decisions']['collection_strategy']} collections strategy, a supplier extension of up to "
        f"{summary['decisions']['payables_extension_days']} days, an inventory release of "
        f"{summary['decisions']['inventory_release_pct']:.1%}, and the proposed per-currency hedge adjustments "
        "subject to the authority and monitoring gates below.",
        styles["CFO_Body"],
    ),
]
downside = next(row for row in summary["execution_stress"] if row["execution_case"] == "downside")
metrics = [
    ["Measure", "Result"],
    ["Contractual ending cash", money(summary["contractual"]["ending_cash"])],
    ["Realistic minimum cash", money(summary["realistic"]["minimum_cash"])],
    ["Selected minimum cash", money(summary["selected"]["minimum_cash"])],
    ["Partial-execution minimum", money(downside["minimum_cash"])],
    ["Direct action cost", money(summary["action_metrics"]["direct_action_cost"])],
    ["FX adverse-loss reduction", money(summary["fx"]["adverse_loss_reduction"])],
]
table = Table(metrics, colWidths=[105*mm, 55*mm])
table.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), navy), ("TEXTCOLOR", (0,0), (-1,0), colors.white), ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"), ("ALIGN", (1,1), (1,-1), "RIGHT"), ("GRID", (0,0), (-1,-1), .25, colors.HexColor("#D8E1E7")), ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#F5F7F8")]), ("FONTSIZE", (0,0), (-1,-1), 8.5), ("TOPPADDING", (0,0), (-1,-1), 5), ("BOTTOMPADDING", (0,0), (-1,-1), 5)]))
story.extend([Paragraph("Liquidity evidence", styles["CFO_H2"]), table, Paragraph("Model and assumption basis", styles["CFO_H2"]), Paragraph(f"Data approval is {summary['decisions']['data_approval']}. Receipt timing uses the {summary['decisions']['model_use']} method and {summary['decisions']['forecast_view'].upper()} view. Model MAE is {summary['model']['Model MAE (days)']:.1f} days versus {summary['model']['Industry-median baseline MAE (days)']:.1f} days for the simple benchmark. Predictions remain estimates and are replaced by actual receipts during daily reforecasting.", styles["CFO_Body"]), Paragraph("Authority", styles["CFO_H2"]), Paragraph(f"All hedge ratios within policy: {'Yes' if summary['fx']['within_policy'] else 'No'}. Within CFO aggregate hedge authority: {'Yes' if summary['fx']['within_cfo_authority'] else 'No - Board approval required'}. Unused facility capacity after the proposed draw is {money(manifest['credit_facility']['committed_capacity'] - summary['decisions']['facility_draw'])}.", styles["CFO_Body"]), PageBreak(), Paragraph("Execution and evidence gates", styles["CFO_Title"])])
gate_text = ParagraphStyle(
    name="CFO_Table",
    parent=styles["BodyText"],
    fontSize=7.5,
    leading=9.5,
)
gate_rows = [
    [Paragraph("<b>Gate</b>", gate_text), Paragraph("<b>Evidence</b>", gate_text), Paragraph("<b>Response</b>", gate_text)],
    [Paragraph("Daily", gate_text), Paragraph(f"Cash forecast above {money(summary['decisions']['cfo_escalation_threshold'])}; collections at or above {summary['decisions']['collections_receipt_floor']:.0%} of plan", gate_text), Paragraph("Escalate within four hours if breached", gate_text)],
    [Paragraph("Day 10", gate_text), Paragraph("Actual receipts, supplier agreements, inventory cash and facility evidence reconciled", gate_text), Paragraph("Continue, revise or seek additional authority", gate_text)],
    [Paragraph("Day 30", gate_text), Paragraph("Forecast error, action achievement, direct cost and residual exposure", gate_text), Paragraph("Close actions and record lessons", gate_text)],
]
gate_table = Table(gate_rows, colWidths=[24*mm, 98*mm, 48*mm])
gate_table.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), teal), ("TEXTCOLOR", (0,0), (-1,0), colors.white), ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"), ("VALIGN", (0,0), (-1,-1), "TOP"), ("GRID", (0,0), (-1,-1), .25, colors.HexColor("#D8E1E7")), ("FONTSIZE", (0,0), (-1,-1), 8), ("TOPPADDING", (0,0), (-1,-1), 6), ("BOTTOMPADDING", (0,0), (-1,-1), 6)]))
story.extend([gate_table, Paragraph("Material risks", styles["CFO_H2"]), Paragraph("1. Collection acceleration may underperform; use the partial and failed execution cases. 2. Supplier extensions require consent and relationship review. 3. Inventory release requires COO service-level sign-off. 4. Facility use consumes headroom and may trigger higher authority. 5. FX inputs are illustrative and require executable market validation.", styles["CFO_Body"]), Paragraph("Evidence register", styles["CFO_H2"]), Paragraph("The attached workbook contains the decision charter, formula-driven cash bridges, action scenarios, FX authority table, action plan and named evidence sources. This paper is not an autonomous approval; the CFO decision record controls execution.", styles["CFO_Body"])])
doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
print(output)
