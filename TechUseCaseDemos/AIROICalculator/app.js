const defaults = {
  implementationCost: 6,
  annualBenefit: 5,
  capacityReleased: 35,
  adoptionCurve: 55,
  controlCost: 1.5,
  confidenceRange: 70,
  timeHorizon: 4,
};

const modeCopy = {
  facilitator: {
    description: "Facilitator mode highlights the business-case decision and approval logic in 5-8 minutes.",
    task: "Review the default scenario, explain payback, and decide whether the CFO should approve, phase, or hold.",
  },
  participant: {
    description: "Participant mode gives learners 10 minutes to test assumptions and make a finance recommendation.",
    task: "Change adoption or confidence assumptions and decide whether the initiative should be approved, phased, or held.",
  },
};

const displayMap = {
  implementationCost: "implementationCostValue",
  annualBenefit: "annualBenefitValue",
  capacityReleased: "capacityReleasedValue",
  adoptionCurve: "adoptionCurveValue",
  controlCost: "controlCostValue",
  confidenceRange: "confidenceRangeValue",
  timeHorizon: "timeHorizonValue",
};

const stakeholderCopy = {
  cfo: {
    note: "Best for an executive sponsor deciding whether value, risk, and payback justify funding.",
    customize: "Replace the default cost, adoption, and benefit assumptions with your own initiative economics and internal approval thresholds.",
  },
  operator: {
    note: "Best for finance transformation, controllership, FP&A, or PMO owners building the case in detail.",
    customize: "Use your own released-capacity, remediation-cost, and adoption assumptions, then compare conservative and aggressive cases.",
  },
  faculty: {
    note: "Best for instructors who want a reusable value-case sandbox across finance, AI, and transformation courses.",
    customize: "Swap the labels and assumptions to fit your case discussion while keeping the governance and payback framing intact.",
  },
  student: {
    note: "Best for learners practicing how a finance AI business case should be challenged before approval.",
    customize: "Change one assumption at a time, then explain why the recommendation changed.",
  },
};

function formatUsdMillions(value) {
  return `USD ${value.toFixed(1)}m`;
}

function formatPercent(value) {
  return `${value}%`;
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getScenario() {
  return {
    implementationCost: Number(document.getElementById("implementationCost").value),
    annualBenefit: Number(document.getElementById("annualBenefit").value),
    capacityReleased: Number(document.getElementById("capacityReleased").value),
    adoptionCurve: Number(document.getElementById("adoptionCurve").value),
    controlCost: Number(document.getElementById("controlCost").value),
    confidenceRange: Number(document.getElementById("confidenceRange").value),
    timeHorizon: Number(document.getElementById("timeHorizon").value),
  };
}

function updateDisplayValues() {
  const scenario = getScenario();
  document.getElementById(displayMap.implementationCost).textContent = formatUsdMillions(scenario.implementationCost);
  document.getElementById(displayMap.annualBenefit).textContent = formatUsdMillions(scenario.annualBenefit);
  document.getElementById(displayMap.capacityReleased).textContent = `${scenario.capacityReleased} FTE equivalent`;
  document.getElementById(displayMap.adoptionCurve).textContent = `${scenario.adoptionCurve}% in year 1`;
  document.getElementById(displayMap.controlCost).textContent = formatUsdMillions(scenario.controlCost);
  document.getElementById(displayMap.confidenceRange).textContent = formatPercent(scenario.confidenceRange);
  document.getElementById(displayMap.timeHorizon).textContent = `${scenario.timeHorizon} years`;
}

function buildYearRows(scenario) {
  const rows = [];
  let cumulative = -(scenario.implementationCost + scenario.controlCost);
  let payback = null;

  for (let year = 1; year <= scenario.timeHorizon; year++) {
    const adoption = Math.min(100, scenario.adoptionCurve + (year - 1) * 15);
    const benefit = scenario.annualBenefit * (adoption / 100);
    const ongoingControlCost = year === 1 ? scenario.controlCost : scenario.controlCost * 0.15;
    const netImpact = benefit - ongoingControlCost - (year === 1 ? scenario.implementationCost : 0);
    cumulative += benefit - ongoingControlCost;
    rows.push({
      year,
      adoption,
      benefit,
      controlCost: ongoingControlCost,
      netImpact,
      cumulative,
    });

    if (payback === null && cumulative >= 0) {
      payback = year;
    }
  }

  return { rows, payback };
}

function classifyDecision(confidenceAdjustedValue, payback, scenario) {
  if (confidenceAdjustedValue >= 4 && payback !== null && payback <= 2 && scenario.confidenceRange >= 70) {
    return {
      decision: "Approve now",
      risk: "Adoption execution",
      owner: "CFO sponsor with process owner",
      approval: "Fund after controller and CIO sign-off",
      className: "value-positive",
    };
  }

  if (confidenceAdjustedValue > 0 && scenario.confidenceRange >= 55) {
    return {
      decision: "Phase rollout",
      risk: "Benefit confidence",
      owner: "Transformation PMO",
      approval: "Approve pilot with evidence gate",
      className: "value-caution",
    };
  }

  return {
    decision: "Hold case",
    risk: "Control or value weakness",
    owner: "Finance transformation lead",
    approval: "Rework evidence before funding",
    className: "value-negative",
  };
}

function renderScenario() {
  updateDisplayValues();
  const scenario = getScenario();
  const { rows, payback } = buildYearRows(scenario);
  const totalBenefits = rows.reduce((sum, row) => sum + row.benefit, 0);
  const totalControlCost = rows.reduce((sum, row) => sum + row.controlCost, 0);
  const baseValue = totalBenefits - scenario.implementationCost - totalControlCost;
  const confidenceAdjustedValue = baseValue * (scenario.confidenceRange / 100);
  const decisionState = classifyDecision(confidenceAdjustedValue, payback, scenario);

  document.getElementById("baseValue").textContent = formatUsdMillions(baseValue);
  document.getElementById("confidenceValue").textContent = formatUsdMillions(confidenceAdjustedValue);
  document.getElementById("paybackValue").textContent = payback === null ? "Beyond horizon" : `${payback} years`;
  document.getElementById("capacityValue").textContent = `${scenario.capacityReleased} FTE`;

  const decisionValue = document.getElementById("decisionValue");
  decisionValue.textContent = decisionState.decision;
  decisionValue.className = decisionState.className;
  document.getElementById("riskValue").textContent = decisionState.risk;
  document.getElementById("ownerValue").textContent = decisionState.owner;
  document.getElementById("approvalValue").textContent = decisionState.approval;

  document.getElementById("yearTableBody").innerHTML = rows.map((row) => `
    <tr>
      <td>${row.year}</td>
      <td>${row.adoption}%</td>
      <td>${formatUsdMillions(row.benefit)}</td>
      <td>${formatUsdMillions(row.controlCost)}</td>
      <td>${formatUsdMillions(row.netImpact)}</td>
      <td>${formatUsdMillions(row.cumulative)}</td>
    </tr>
  `).join("");

  document.getElementById("businessNote").textContent =
    `Business decision: ${decisionState.decision}. Confidence-adjusted value is ${formatUsdMillions(confidenceAdjustedValue)} with ${payback === null ? "no payback inside the chosen horizon" : `payback in ${payback} years`}. Evidence still needed: benefit realization plan, control remediation, and named ownership for released capacity.`;

  document.getElementById("expectedAnswer").innerHTML =
    `<p><strong>Expected answer:</strong> ${decisionState.decision} is appropriate when the team can defend a confidence-adjusted value of <strong>${formatUsdMillions(confidenceAdjustedValue)}</strong>, explain the <strong>${payback === null ? "absence of payback in the current horizon" : `${payback}-year payback`}</strong>, and show why the main risk is <strong>${decisionState.risk}</strong>. Approval remains human and should be tied to evidence for adoption, controls, and redeployment of released capacity.</p>`;
}

function setStakeholder() {
  const key = document.getElementById("stakeholderView").value;
  document.getElementById("stakeholderNote").textContent = stakeholderCopy[key].note;
  document.getElementById("customizationNote").textContent = stakeholderCopy[key].customize;
}

function exportSummary() {
  const scenario = getScenario();
  const summary = [
    "AI ROI Calculator Summary",
    `Stakeholder: ${document.getElementById("stakeholderView").value}`,
    `Decision: ${document.getElementById("decisionValue").textContent}`,
    `Base value: ${document.getElementById("baseValue").textContent}`,
    `Confidence-adjusted value: ${document.getElementById("confidenceValue").textContent}`,
    `Payback: ${document.getElementById("paybackValue").textContent}`,
    `Primary risk: ${document.getElementById("riskValue").textContent}`,
    `Approval point: ${document.getElementById("approvalValue").textContent}`,
    "",
    "Scenario inputs",
    `Implementation cost: ${formatUsdMillions(scenario.implementationCost)}`,
    `Annual benefit: ${formatUsdMillions(scenario.annualBenefit)}`,
    `Capacity released: ${scenario.capacityReleased} FTE equivalent`,
    `Adoption in year 1: ${scenario.adoptionCurve}%`,
    `Control-remediation cost: ${formatUsdMillions(scenario.controlCost)}`,
    `Benefit confidence: ${scenario.confidenceRange}%`,
    `Time horizon: ${scenario.timeHorizon} years`,
  ].join("\n");
  downloadText("ai-roi-calculator-summary.txt", summary);
}

function setMode(mode) {
  document.getElementById("modeDescription").textContent = modeCopy[mode].description;
  document.getElementById("participantTask").textContent = modeCopy[mode].task;
}

function resetScenario() {
  Object.entries(defaults).forEach(([id, value]) => {
    document.getElementById(id).value = String(value);
  });
  document.getElementById("expectedAnswer").hidden = true;
  setMode("facilitator");
  renderScenario();
}

document.addEventListener("DOMContentLoaded", () => {
  Object.keys(defaults).forEach((id) => {
    document.getElementById(id).addEventListener("input", renderScenario);
  });
  document.getElementById("facilitatorMode").addEventListener("click", () => setMode("facilitator"));
  document.getElementById("participantMode").addEventListener("click", () => setMode("participant"));
  document.getElementById("stakeholderView").addEventListener("change", setStakeholder);
  document.getElementById("exportSummary").addEventListener("click", exportSummary);
  document.getElementById("resetScenario").addEventListener("click", resetScenario);
  document.getElementById("showExpectedAnswer").addEventListener("click", () => {
    const panel = document.getElementById("expectedAnswer");
    panel.hidden = !panel.hidden;
  });
  setStakeholder();
  resetScenario();
});
