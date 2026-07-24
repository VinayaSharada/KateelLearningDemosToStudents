const HAPPY_PATH = [
  "Invoice received",
  "Three-way match",
  "Approval requested",
  "Approved",
  "Payment ready"
];

const ACTIVITY_TOUCH_HOURS = {
  "Invoice received": 0.3,
  "Three-way match": 1.2,
  "PO missing review": 1.4,
  "PO exception routed": 0.7,
  "PO confirmed": 0.6,
  "GRN chase": 0.9,
  "GRN posted": 0.5,
  "Duplicate review": 1.8,
  "Duplicate review reopened": 1.2,
  "Duplicate cleared": 1.0,
  "Approval requested": 0.2,
  "Approval escalated": 0.4,
  "Approved": 0.3,
  "Payment ready": 0.4,
  "Evidence completed": 0.6
};

const STAGE_ORDER = {
  "Invoice received": 0,
  "PO missing review": 1,
  "PO exception routed": 1,
  "PO confirmed": 1,
  "Three-way match": 2,
  "GRN chase": 2,
  "GRN posted": 2,
  "Duplicate review": 3,
  "Duplicate review reopened": 3,
  "Duplicate cleared": 3,
  "Approval requested": 4,
  "Approval escalated": 4,
  "Approved": 5,
  "Payment ready": 6,
  "Evidence completed": 6
};

const STEP_COPY = [
  { id: "assumed", label: "Clarify", question: "How does a compliant invoice become payment-ready?" },
  { id: "variants", label: "Lean out", question: "What paths did the designed process fail to show?" },
  { id: "friction", label: "Lean out", question: "Where does wait time and rework leak AP capacity?" },
  { id: "decision", label: "Enable / Assure", question: "What should be removed, enabled, or retained as human judgement in AP?" },
  { id: "monitor", label: "Realise", question: "How will we know the AP change holds after launch?" }
];

const NUMBER = new Intl.NumberFormat("en-IN");

const state = {
  rows: [],
  cases: [],
  filters: {
    entity: "all",
    segment: "all",
    amount: "all",
    exception: "all",
    variant: "all",
    status: "all",
    coverage: 40,
    mode: "instructor"
  },
  selectedDecision: 0
};

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => {
    const parts = line.split(",");
    const item = {};
    headers.forEach((header, index) => {
      item[header] = parts[index];
    });
    item.amount_inr = Number(item.amount_inr);
    item.timestamp = new Date(item.timestamp);
    return item;
  });
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function toHours(ms) {
  return ms / (1000 * 60 * 60);
}

function formatHours(hours) {
  return `${hours.toFixed(1)} h`;
}

function formatDays(hours) {
  return `${(hours / 24).toFixed(1)} d`;
}

function formatInr(value) {
  return `INR ${NUMBER.format(Math.round(value))}`;
}

function buildCases(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    if (!grouped.has(row.case_id)) grouped.set(row.case_id, []);
    grouped.get(row.case_id).push(row);
  });

  return Array.from(grouped.values()).map((events) => {
    events.sort((a, b) => a.timestamp - b.timestamp);
    const sequence = events.map((event) => event.activity);
    const variant = sequence.join(" -> ");
    const first = events[0];
    const last = events[events.length - 1];
    const leadHours = toHours(last.timestamp - first.timestamp);
    const touchHours = sequence.reduce((sum, activity) => sum + (ACTIVITY_TOUCH_HOURS[activity] || 0.5), 0);
    const waitHours = Math.max(0, leadHours - touchHours);
    const repeatedCount = sequence.length - new Set(sequence).size;
    const firstExceptionEvent = events.find((event) => event.exception_type !== "None");
    const exceptionType = firstExceptionEvent ? firstExceptionEvent.exception_type : "None";
    const supplierName = (first.detail || "").replace(/^Invoice from /, "").trim();
    const supplierSegment = first.amount_inr > 500000 ? "Strategic vendors" : "Routine suppliers";
    const firstException = events.find((event) => event.exception_type !== "None");
    const exceptionAgeHours = firstException ? toHours(last.timestamp - firstException.timestamp) : 0;
    const highValue = first.amount_inr > 500000;
    const firstPass = exceptionType === "None" && repeatedCount === 0;
    const stp = variant === HAPPY_PATH.join(" -> ");
    const controlViolation = sequence.indexOf("Payment ready") !== -1 &&
      sequence.indexOf("Evidence completed") !== -1 &&
      sequence.indexOf("Payment ready") < sequence.indexOf("Evidence completed");

    return {
      caseId: first.case_id,
      entity: first.entity,
      supplierName,
      supplierSegment,
      amount: first.amount_inr,
      events,
      sequence,
      variant,
      leadHours,
      touchHours,
      waitHours,
      repeatedCount,
      exceptionType,
      exceptionAgeHours,
      currentOwner: last.owner,
      status: last.invoice_status,
      highValue,
      firstPass,
      stp,
      controlViolation,
      evidenceStatus: controlViolation ? "Completed after payment-ready release" : (exceptionType === "None" ? "Complete" : "Needs review"),
      handoffs: Math.max(0, events.length - 1)
    };
  });
}

function amountMatches(amount, filter) {
  if (filter === "all") return true;
  if (filter === "lt250") return amount < 250000;
  if (filter === "250to500") return amount >= 250000 && amount <= 500000;
  return amount > 500000;
}

function filteredCases() {
  return state.cases.filter((item) => {
    if (state.filters.entity !== "all" && item.entity !== state.filters.entity) return false;
    if (state.filters.segment !== "all" && item.supplierSegment !== state.filters.segment) return false;
    if (!amountMatches(item.amount, state.filters.amount)) return false;
    if (state.filters.exception !== "all" && item.exceptionType !== state.filters.exception) return false;
    if (state.filters.variant !== "all" && item.variant !== state.filters.variant) return false;
    if (state.filters.status !== "all" && item.status !== state.filters.status) return false;
    return true;
  });
}

function populateFilters() {
  const entityFilter = document.getElementById("entityFilter");
  const segmentFilter = document.getElementById("segmentFilter");
  const exceptionFilter = document.getElementById("exceptionFilter");
  const variantFilter = document.getElementById("variantFilter");
  const statusFilter = document.getElementById("statusFilter");
  const entities = [...new Set(state.cases.map((item) => item.entity))];
  const segments = [...new Set(state.cases.map((item) => item.supplierSegment))];
  const exceptions = [...new Set(state.cases.map((item) => item.exceptionType))];
  const variants = variantStats(state.cases).map((item) => item.variant);
  const statuses = [...new Set(state.cases.map((item) => item.status))];

  entityFilter.innerHTML = `<option value="all">All entities</option>${entities.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
  segmentFilter.innerHTML = `<option value="all">All supplier segments</option>${segments.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
  exceptionFilter.innerHTML = `<option value="all">All exception types</option>${exceptions.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
  variantFilter.innerHTML = `<option value="all">All variants</option>${variants.map((value, index) => `<option value="${value}">Variant ${index + 1}</option>`).join("")}`;
  statusFilter.innerHTML = `<option value="all">All statuses</option>${statuses.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
}

function renderHappyPath() {
  const mount = document.getElementById("happyPath");
  mount.innerHTML = HAPPY_PATH.map((activity, index) => {
    const arrow = index < HAPPY_PATH.length - 1 ? `<span class="path-arrow">→</span>` : "";
    return `<span class="path-node">${activity}</span>${arrow}`;
  }).join("");
}

function renderSteps() {
  document.getElementById("stepStrip").innerHTML = STEP_COPY.map((step, index) => {
    const active = state.filters.mode === "instructor" && index === state.selectedDecision ? "active" : "";
    return `<button class="step-pill ${active}" data-step="${index}" type="button">${step.label}: ${step.question}</button>`;
  }).join("");
}

function variantStats(cases) {
  const counts = new Map();
  cases.forEach((item) => {
    const entry = counts.get(item.variant) || { variant: item.variant, cases: 0, items: [] };
    entry.cases += 1;
    entry.items.push(item);
    counts.set(item.variant, entry);
  });
  return [...counts.values()].sort((a, b) => b.cases - a.cases);
}

function visibleVariants(cases) {
  const variants = variantStats(cases);
  const targetShare = state.filters.coverage / 100;
  const total = cases.length || 1;
  let running = 0;
  const selected = [];
  variants.forEach((variant) => {
    if (running / total < targetShare || selected.length === 0 || state.filters.coverage === 100) {
      selected.push(variant);
      running += variant.cases;
    }
  });
  return selected;
}

function transitionStats(cases, variants) {
  const allowed = new Set(variants.map((item) => item.variant));
  const counts = new Map();
  const nodeCounts = new Map();
  cases.filter((item) => allowed.has(item.variant)).forEach((item) => {
    item.events.forEach((event) => {
      nodeCounts.set(event.activity, (nodeCounts.get(event.activity) || 0) + 1);
    });
    for (let index = 0; index < item.events.length - 1; index += 1) {
      const current = item.events[index];
      const next = item.events[index + 1];
      const key = `${current.activity}|||${next.activity}`;
      const bucket = counts.get(key) || { from: current.activity, to: next.activity, count: 0, hours: [] };
      bucket.count += 1;
      bucket.hours.push(toHours(next.timestamp - current.timestamp));
      counts.set(key, bucket);
    }
  });
  return {
    edges: [...counts.values()],
    nodes: [...nodeCounts.entries()].map(([activity, count]) => ({ activity, count }))
  };
}

function nodePositions(nodes) {
  const grouped = {};
  nodes.forEach((node) => {
    const stage = Object.prototype.hasOwnProperty.call(STAGE_ORDER, node.activity) ? STAGE_ORDER[node.activity] : 0;
    if (!grouped[stage]) grouped[stage] = [];
    grouped[stage].push(node);
  });
  const positions = {};
  Object.entries(grouped).forEach(([stage, values]) => {
    values.sort((a, b) => a.activity.localeCompare(b.activity));
    values.forEach((node, index) => {
      positions[node.activity] = {
        x: 100 + Number(stage) * 180,
        y: 100 + index * 95
      };
    });
  });
  return positions;
}

function renderProcessMap(cases) {
  const variants = visibleVariants(cases);
  const coverageLabel = document.getElementById("variantCoverageLabel");
  coverageLabel.textContent = state.filters.coverage === 100 ? "All variants" : `Top ${state.filters.coverage}%`;
  document.getElementById("variantCount").textContent = `${variants.length} visible variants`;
  document.getElementById("variantList").innerHTML = variants.slice(0, 6).map((variant) => {
    const avgLead = variant.items.reduce((sum, item) => sum + item.leadHours, 0) / variant.items.length;
    return `<li><strong>${variant.cases} cases</strong> • ${formatDays(avgLead)} • ${variant.variant}</li>`;
  }).join("");

  const { edges, nodes } = transitionStats(cases, variants);
  const positions = nodePositions(nodes);
  const svg = document.getElementById("processSvg");

  const stageLabels = Object.entries(STAGE_ORDER)
    .filter(([activity]) => activity === "Invoice received" || activity === "Three-way match" || activity === "Approval requested" || activity === "Approved" || activity === "Payment ready")
    .map(([activity, stage]) => `<text class="stage-label" x="${70 + stage * 180}" y="38">${activity}</text>`)
    .join("");

  const edgeMarkup = edges.map((edge) => {
    const from = positions[edge.from];
    const to = positions[edge.to];
    const loop = edge.from === edge.to;
    const toStage = Object.prototype.hasOwnProperty.call(STAGE_ORDER, edge.to) ? STAGE_ORDER[edge.to] : 0;
    const fromStage = Object.prototype.hasOwnProperty.call(STAGE_ORDER, edge.from) ? STAGE_ORDER[edge.from] : 0;
    const backflow = toStage < fromStage;
    const cls = loop ? "loop" : (backflow ? "backflow" : "");
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 - (loop || backflow ? 30 : 16);
    const path = loop
      ? `M ${from.x + 60} ${from.y + 18} C ${from.x + 120} ${from.y - 30}, ${from.x + 120} ${from.y + 60}, ${from.x + 60} ${from.y + 18}`
      : `M ${from.x + 120} ${from.y + 20} C ${midX} ${from.y + 20}, ${midX} ${to.y + 20}, ${to.x} ${to.y + 20}`;
    return `
      <path class="edge-line ${cls}" d="${path}"></path>
      <text class="edge-label" x="${midX}" y="${midY}">${edge.count} cases • ${formatHours(median(edge.hours))}</text>
    `;
  }).join("");

  const nodeMarkup = nodes.map((node) => {
    const pos = positions[node.activity];
    const exceptionClass = /review|grn|po/i.test(node.activity) ? "exception" : "";
    const controlClass = /evidence/i.test(node.activity) ? "control" : exceptionClass;
    return `
      <rect class="node-box ${controlClass}" x="${pos.x}" y="${pos.y}" width="120" height="42" rx="14"></rect>
      <text class="node-label" x="${pos.x + 10}" y="${pos.y + 18}">${node.activity}</text>
      <text class="node-sub" x="${pos.x + 10}" y="${pos.y + 34}">${node.count} events</text>
    `;
  }).join("");

  svg.innerHTML = `${stageLabels}${edgeMarkup}${nodeMarkup}`;
}

function renderFriction(cases) {
  const variants = variantStats(cases).slice(0, 6);
  document.getElementById("avgLeadTime").textContent = formatDays(cases.reduce((sum, item) => sum + item.leadHours, 0) / Math.max(cases.length, 1));
  document.getElementById("avgWaitTime").textContent = formatDays(cases.reduce((sum, item) => sum + item.waitHours, 0) / Math.max(cases.length, 1));
  document.getElementById("reworkRate").textContent = `${((cases.filter((item) => item.repeatedCount > 0).length / Math.max(cases.length, 1)) * 100).toFixed(0)}%`;
  document.getElementById("stpRate").textContent = `${((cases.filter((item) => item.stp).length / Math.max(cases.length, 1)) * 100).toFixed(0)}%`;
  document.getElementById("frictionRows").innerHTML = variants.map((variant) => {
    const items = variant.items;
    const lead = items.reduce((sum, item) => sum + item.leadHours, 0) / items.length;
    const touch = items.reduce((sum, item) => sum + item.touchHours, 0) / items.length;
    const wait = items.reduce((sum, item) => sum + item.waitHours, 0) / items.length;
    const loops = items.reduce((sum, item) => sum + item.repeatedCount, 0) / items.length;
    const handoffs = items.reduce((sum, item) => sum + item.handoffs, 0) / items.length;
    const reworkCost = loops * 1800 + wait * 900;
    return `<tr>
      <td>${variant.variant}</td>
      <td>${variant.cases}</td>
      <td>${formatDays(lead)}</td>
      <td>${formatHours(touch)}</td>
      <td>${formatDays(wait)}</td>
      <td>${handoffs.toFixed(1)}</td>
      <td>${loops.toFixed(1)}</td>
      <td>${formatInr(reworkCost * variant.cases)}</td>
    </tr>`;
  }).join("");
}

function findBreaches(cases) {
  const maxTimestamp = new Date(Math.max(...state.rows.map((row) => row.timestamp.getTime())));
  const breaches = [];
  cases.forEach((item) => {
    const seq = item.sequence;
    const hasApprovalAfterCash = item.controlViolation;
    const missingGrnAgeing = item.exceptionType === "Missing GRN" && item.exceptionAgeHours > 24;
    const unresolvedDuplicateReview = item.exceptionType === "Duplicate review" && item.exceptionAgeHours > 24;
    const highValueUnassigned = item.highValue && item.exceptionType !== "None" && item.waitHours > 4;
    const breachesForCase = [];
    if (hasApprovalAfterCash) breachesForCase.push("Payment-ready status reached before evidence was complete");
    if (missingGrnAgeing) breachesForCase.push("GRN missing beyond SLA");
    if (unresolvedDuplicateReview) breachesForCase.push("Duplicate review unresolved beyond SLA");
    if (highValueUnassigned) breachesForCase.push("High-value invoice waiting beyond assignment window");
    breachesForCase.forEach((breach) => {
      breaches.push({
        caseId: item.caseId,
        amount: item.amount,
        breach,
        age: item.exceptionAgeHours || item.waitHours,
        owner: item.currentOwner,
        evidenceStatus: item.evidenceStatus,
        escalation: breach.includes("Payment-ready") ? "Escalate to controller and P2P owner" : "Escalate to process owner within 4h",
        timestamp: maxTimestamp
      });
    });
  });
  return breaches.sort((a, b) => b.amount - a.amount).slice(0, 12);
}

function renderExceptions(cases) {
  const breaches = findBreaches(cases);
  document.getElementById("exceptionRows").innerHTML = breaches.map((item) => `<tr>
    <td>${item.caseId}</td>
    <td>${formatInr(item.amount)}</td>
    <td>${item.breach}</td>
    <td>${formatHours(item.age)}</td>
    <td>${item.owner}</td>
    <td>${item.evidenceStatus}</td>
    <td>${item.escalation}</td>
  </tr>`).join("");
  if (!breaches.length) {
    document.getElementById("exceptionRows").innerHTML = `<tr><td colspan="7">No breaches matched the current filters.</td></tr>`;
  }
}

function decisionInsights(cases) {
  const variants = variantStats(cases);
  const countsByException = Object.fromEntries([...new Set(cases.map((item) => item.exceptionType))].map((key) => [key, cases.filter((item) => item.exceptionType === key).length]));
  const stpRate = cases.filter((item) => item.stp).length / Math.max(cases.length, 1);
  return [
    {
      category: "Eliminate / standardize",
      insight: `Missing PO rework affects ${countsByException["Missing PO"] || 0} cases and repeatedly delays invoice progression.`,
      metric: "Reduce PO exception cycle time and repeat routing",
      owner: "AP and procurement lead",
      dependency: "Upstream PO discipline and non-PO exception policy",
      proof: "PO exception cycle time down by 20% within 30 days"
    },
    {
      category: "Redesign upstream process",
      insight: `Missing GRN cases create avoidable queue time across ${countsByException["Missing GRN"] || 0} cases.`,
      metric: "Lower GRN ageing and receiving-delay count",
      owner: "Operations receiving owner",
      dependency: "Receiving discipline and timely GRN posting",
      proof: "GRN queue below 24h median ageing"
    },
    {
      category: "Enable workflow",
      insight: `${((1 - stpRate) * 100).toFixed(0)}% of cases leave the straight-through path, but routine routing can still help the stable segment.`,
      metric: "Raise STP rate and reduce reminder lag",
      owner: "P2P process owner",
      dependency: "Stable rule set for standard invoices and approval routing",
      proof: "STP above 60% for four consecutive weeks"
    },
    {
      category: "Keep human-reviewed",
      insight: `Duplicate review still requires evidence-based judgement in ${countsByException["Duplicate review"] || 0} cases.`,
      metric: "Lower duplicate-review ageing without removing controller review",
      owner: "AP controller",
      dependency: "Documented duplicate-review workbench and evidence pack",
      proof: "Duplicate-review queue aged >48h reduced by half"
    },
    {
      category: "Assure and monitor",
      insight: `${findBreaches(cases).length} visible control breaches or trigger conditions need named ownership and monitoring.`,
      metric: "Zero payment-ready-before-evidence incidents",
      owner: "Controller + internal controls",
      dependency: "Rule-based trigger logging and escalation discipline",
      proof: "No post-facto evidence completion on high-value cases"
    }
  ];
}

function renderDecisionBoard(cases) {
  const insights = decisionInsights(cases);
  const list = document.getElementById("decisionList");
  list.innerHTML = insights.map((item, index) => `
    <button class="decision-button ${index === state.selectedDecision ? "active" : ""}" data-index="${index}" type="button">
      <small>${item.category}</small>
      <strong>${item.insight}</strong>
    </button>
  `).join("");
  const selected = insights[state.selectedDecision] || insights[0];
  document.getElementById("decisionTitle").textContent = selected.category;
  document.getElementById("decisionNarrative").textContent = selected.insight;
  document.getElementById("decisionMetric").textContent = selected.metric;
  document.getElementById("decisionOwner").textContent = selected.owner;
  document.getElementById("decisionDependency").textContent = selected.dependency;
  document.getElementById("decisionProof").textContent = selected.proof;
}

function renderMonitoring(cases) {
  const triggers = [
    {
      label: "High-value invoice exception unassigned > 4h",
      hit: cases.some((item) => item.highValue && item.exceptionType !== "None" && item.waitHours > 4),
      owner: "AP controller and budget owner",
      evidence: "Case owner, status, and ageing logged",
      deadline: "4-hour escalation"
    },
    {
      label: "GRN missing > 24h",
      hit: cases.some((item) => item.exceptionType === "Missing GRN" && item.exceptionAgeHours > 24),
      owner: "Operations receiving owner",
      evidence: "Receiving note and GRN status logged",
      deadline: "24-hour escalation"
    },
    {
      label: "Duplicate-review queue above five cases",
      hit: cases.filter((item) => item.exceptionType === "Duplicate review").length > 5,
      owner: "AP controller",
      evidence: "Duplicate-review queue with named reviewer",
      deadline: "Same-day controller review"
    },
    {
      label: "STP rate below 60%",
      hit: (cases.filter((item) => item.stp).length / Math.max(cases.length, 1)) < 0.6,
      owner: "P2P process owner",
      evidence: "Weekly STP trend and root-cause log",
      deadline: "Weekly process review"
    }
  ];
  document.getElementById("monitoringGrid").innerHTML = triggers.map((item) => `
    <article class="monitor-card ${item.hit ? "triggered" : "ok"}">
      <p><span class="status-chip ${item.hit ? "alert" : "ok"}">${item.hit ? "Triggered" : "Within threshold"}</span></p>
      <h3>${item.label}</h3>
      <p><strong>Owner:</strong> ${item.owner}</p>
      <p><strong>Evidence logged:</strong> ${item.evidence}</p>
      <p><strong>Escalation deadline:</strong> ${item.deadline}</p>
    </article>
  `).join("");
}

function renderDataRows() {
  document.getElementById("dataRows").innerHTML = state.rows.slice(0, 40).map((row) => `<tr>
    <td>${row.case_id}</td>
    <td>${row.activity}</td>
    <td>${row.timestamp.toLocaleString("en-IN")}</td>
    <td>${row.owner}</td>
    <td>${row.detail}</td>
    <td>${formatInr(row.amount_inr)}</td>
    <td>${row.entity}</td>
  </tr>`).join("");
}

function renderAll() {
  const cases = filteredCases();
  renderSteps();
  renderProcessMap(cases);
  renderFriction(cases);
  renderExceptions(cases);
  renderDecisionBoard(cases);
  renderMonitoring(cases);
  document.getElementById("explorePanel").hidden = state.filters.mode !== "explore";
  document.getElementById("screenQuestion").textContent = STEP_COPY[Math.min(state.selectedDecision, STEP_COPY.length - 1)].question;
}

function bindEvents() {
  document.getElementById("modeSelect").addEventListener("change", (event) => {
    state.filters.mode = event.target.value;
    renderAll();
  });
  document.getElementById("entityFilter").addEventListener("change", (event) => {
    state.filters.entity = event.target.value;
    renderAll();
  });
  document.getElementById("segmentFilter").addEventListener("change", (event) => {
    state.filters.segment = event.target.value;
    renderAll();
  });
  document.getElementById("amountFilter").addEventListener("change", (event) => {
    state.filters.amount = event.target.value;
    renderAll();
  });
  document.getElementById("exceptionFilter").addEventListener("change", (event) => {
    state.filters.exception = event.target.value;
    renderAll();
  });
  document.getElementById("variantFilter").addEventListener("change", (event) => {
    state.filters.variant = event.target.value;
    renderAll();
  });
  document.getElementById("statusFilter").addEventListener("change", (event) => {
    state.filters.status = event.target.value;
    renderAll();
  });
  document.getElementById("variantCoverage").addEventListener("input", (event) => {
    state.filters.coverage = Number(event.target.value);
    renderAll();
  });
  document.getElementById("resetDemo").addEventListener("click", () => {
    state.filters = { entity: "all", segment: "all", amount: "all", exception: "all", variant: "all", status: "all", coverage: 40, mode: "instructor" };
    state.selectedDecision = 0;
    document.getElementById("modeSelect").value = "instructor";
    document.getElementById("amountFilter").value = "all";
    document.getElementById("variantCoverage").value = "40";
    populateFilters();
    renderAll();
  });
  document.getElementById("stepStrip").addEventListener("click", (event) => {
    const button = event.target.closest("[data-step]");
    if (!button) return;
    state.selectedDecision = Number(button.dataset.step);
    renderAll();
  });
  document.getElementById("decisionList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-index]");
    if (!button) return;
    state.selectedDecision = Number(button.dataset.index);
    renderDecisionBoard(filteredCases());
  });
}

async function init() {
  const response = await fetch("Data/ap_event_log.csv");
  const text = await response.text();
  state.rows = parseCsv(text);
  state.cases = buildCases(state.rows);
  populateFilters();
  renderHappyPath();
  renderDataRows();
  bindEvents();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
