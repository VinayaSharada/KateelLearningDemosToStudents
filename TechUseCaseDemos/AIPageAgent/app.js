// AI Page Agent Demo - in-page agent that reads the UI as text and acts on it
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const ASSIGNEES = ['Unassigned', 'Sam', 'Priya', 'Alex'];
const DESTRUCTIVE_ACTIONS = new Set(['resolve', 'escalate']);

const DEFAULT_TICKETS = [
  { id: 101, subject: 'Checkout page throwing 500 error', customer: 'Acme Corp', priority: 'High', status: 'Open', assignee: 'Unassigned' },
  { id: 102, subject: 'Request: export invoices to CSV', customer: 'Beacon Retail', priority: 'Low', status: 'Open', assignee: 'Sam' },
  { id: 103, subject: 'Login fails after password reset', customer: 'Northwind Traders', priority: 'High', status: 'In Progress', assignee: 'Priya' },
  { id: 104, subject: 'Dashboard chart colors hard to read', customer: 'Globex', priority: 'Low', status: 'Open', assignee: 'Unassigned' },
  { id: 105, subject: 'API rate limit too aggressive', customer: 'Initech', priority: 'Medium', status: 'In Progress', assignee: 'Alex' },
  { id: 106, subject: 'Billing charged twice this month', customer: 'Umbrella Inc', priority: 'High', status: 'Open', assignee: 'Unassigned' },
];

let tickets = DEFAULT_TICKETS.map(t => ({ ...t }));
let actionsTaken = 0;
let pendingAction = null;

// On-device AI state. modelBackend stays null until a real model is confirmed
// working — 'chrome-prompt-api' (Gemini Nano via Chrome's built-in Prompt API)
// or 'webllm' (a small open-weight model downloaded once and run locally via
// WebGPU). Nothing here is loaded until the user explicitly picks "On-device
// AI" from the interpreter dropdown — no surprise downloads on page load.
let interpreterMode = 'rules';
let modelBackend = null;
let modelUnavailable = false;
let modelSession = null;
let webllmEngine = null;
let modelInitPromise = null;
const WEBLLM_MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

const el = id => document.getElementById(id);
const ticketTable = el('ticketTable');
const traceLog = el('traceLog');
const commandInput = el('commandInput');
const guardrailToggle = el('guardrailToggle');
const confirmBanner = el('confirmBanner');
const confirmText = el('confirmText');
const interpreterSelect = el('interpreterSelect');
const modelStatusText = el('modelStatusText');
const modelProgressFill = el('modelProgressFill');

function renderTickets() {
  ticketTable.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'ticket-row ticket-head';
  header.innerHTML = '<span>Ticket</span><span>Customer</span><span>Priority</span><span>Status</span><span>Assignee</span><span>Actions</span>';
  ticketTable.appendChild(header);

  tickets.forEach(t => {
    const row = document.createElement('div');
    row.className = 'ticket-row';
    row.id = `ticket-row-${t.id}`;

    const assigneeOptions = ASSIGNEES.map(a => `<option value="${a}" ${a === t.assignee ? 'selected' : ''}>${a}</option>`).join('');
    const label = `Ticket #${t.id}: ${t.subject} (${t.customer}, ${t.priority} priority, ${t.status}, assigned to ${t.assignee})`;

    row.innerHTML = `
      <span class="ticket-id">#${t.id}<br><small>${t.subject}</small></span>
      <span>${t.customer}</span>
      <span class="priority-badge priority-${t.priority.toLowerCase()}">${t.priority}</span>
      <span class="status-badge status-${t.status.toLowerCase().replace(/\s+/g, '-')}" id="status-${t.id}">${t.status}</span>
      <span>
        <select id="assign-${t.id}" data-agent-id="assign-${t.id}" data-agent-label="Assignee dropdown for ${label}" aria-label="Assignee for ticket ${t.id}">
          ${assigneeOptions}
        </select>
      </span>
      <span class="ticket-actions">
        <button id="resolve-${t.id}" data-agent-id="resolve-${t.id}" data-agent-label="Resolve button for ${label}" type="button">Resolve</button>
        <button id="escalate-${t.id}" data-agent-id="escalate-${t.id}" data-agent-label="Escalate button for ${label}" type="button">Escalate</button>
      </span>
    `;
    ticketTable.appendChild(row);

    row.querySelector(`#assign-${t.id}`).addEventListener('change', e => {
      t.assignee = e.target.value;
      renderTickets();
    });
    row.querySelector(`#resolve-${t.id}`).addEventListener('click', () => {
      t.status = 'Resolved';
      renderTickets();
    });
    row.querySelector(`#escalate-${t.id}`).addEventListener('click', () => {
      t.status = 'Escalated';
      t.priority = 'High';
      renderTickets();
    });
  });
}

function setAgentState(state, note) {
  el('agentState').textContent = state;
  el('agentStateNote').textContent = note;
}

function appendTrace(step, html) {
  const item = document.createElement('div');
  item.className = 'trace-item';
  item.innerHTML = `<strong>${step}</strong> ${html}`;
  traceLog.appendChild(item);
  traceLog.scrollTop = traceLog.scrollHeight;
}

function clearTrace() {
  traceLog.innerHTML = '';
}

// Step 1: Observe. Reads the live DOM as text, the same way a text-grounded
// browser agent (no screenshots, no vision model) would see the page.
function observePage() {
  return Array.from(document.querySelectorAll('[data-agent-id]')).map(node => ({
    id: node.dataset.agentId,
    tag: node.tagName.toLowerCase(),
    label: node.dataset.agentLabel,
  }));
}

// Step 2: Decide. A small rule-based parser stands in for an LLM call so this
// demo runs with zero setup and no API key — a real agent would reason over
// the same observation list with far more flexibility than these regexes.
function parseCommand(command) {
  const text = command.trim().toLowerCase();
  if (!text) return null;

  const ticketIdMatch = text.match(/\b(\d{3})\b/);
  const explicitId = ticketIdMatch ? Number(ticketIdMatch[1]) : null;

  const bySubject = keyword => tickets.find(t => t.subject.toLowerCase().includes(keyword));
  const resolveTicket = () => {
    if (explicitId) return tickets.find(t => t.id === explicitId) || null;
    if (text.includes('billing')) return bySubject('billing');
    if (text.includes('login')) return bySubject('login');
    if (text.includes('checkout')) return bySubject('checkout');
    if (text.includes('rate limit') || text.includes('api')) return bySubject('rate limit');
    if (text.includes('chart') || text.includes('dashboard')) return bySubject('dashboard');
    if (text.includes('export') || text.includes('csv')) return bySubject('export');
    return null;
  };

  if (/\b(resolve|close|mark.*resolved)\b/.test(text)) {
    const ticket = resolveTicket();
    if (!ticket) return { unmatched: true, reason: "recognized the verb 'resolve' but couldn't identify which ticket" };
    return { action: 'resolve', ticket, elementId: `resolve-${ticket.id}` };
  }

  if (/\bescalate\b/.test(text)) {
    const ticket = resolveTicket();
    if (!ticket) return { unmatched: true, reason: "recognized the verb 'escalate' but couldn't identify which ticket" };
    return { action: 'escalate', ticket, elementId: `escalate-${ticket.id}` };
  }

  if (/\b(assign|reassign)\b/.test(text)) {
    const ticket = resolveTicket();
    const assignee = ASSIGNEES.find(a => text.includes(a.toLowerCase()));
    if (!ticket || !assignee) {
      return { unmatched: true, reason: "recognized the verb 'assign' but couldn't identify both a ticket and a person" };
    }
    return { action: 'assign', ticket, value: assignee, elementId: `assign-${ticket.id}` };
  }

  if (/\b(show|filter|highlight)\b/.test(text)) {
    const priority = ['high', 'medium', 'low'].find(p => text.includes(p));
    const status = ['open', 'in progress', 'resolved', 'escalated'].find(s => text.includes(s));
    if (!priority && !status) {
      return { unmatched: true, reason: "recognized a filter request but couldn't identify a priority or status to filter by" };
    }
    return { action: 'filter', priority, status };
  }

  return { unmatched: true, reason: "couldn't match this to any action this page supports (resolve, escalate, assign, or filter)" };
}

// --- On-device AI backend -------------------------------------------------
// Two real, no-API-key options exist for running an LLM inside the browser:
// 1. Chrome's built-in Prompt API (window.LanguageModel / window.ai.languageModel)
//    — uses the OS-level Gemini Nano model, no download managed by this page.
// 2. WebLLM (@mlc-ai/web-llm) — downloads a small open-weight model once and
//    runs it locally via WebGPU. Works in any WebGPU browser, not just Chrome.
// This section tries (1) first since it has no download, then falls back to
// (2). If neither is available, the demo stays on the rule-based parser.

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setModelStatus(text, progressPct) {
  modelStatusText.textContent = text;
  if (typeof progressPct === 'number') {
    modelProgressFill.style.width = `${Math.max(0, Math.min(100, progressPct))}%`;
  }
}

function updateInterpreterCard() {
  if (interpreterMode === 'rules') {
    el('interpreterState').textContent = 'Rule-based';
    el('interpreterNote').textContent = 'Regex parser — switch to on-device AI above to try a real model.';
  } else if (modelBackend === 'chrome-prompt-api') {
    el('interpreterState').textContent = 'Chrome Built-in AI';
    el('interpreterNote').textContent = "Using Gemini Nano via Chrome's on-device Prompt API.";
  } else if (modelBackend === 'webllm') {
    el('interpreterState').textContent = 'WebLLM (local)';
    el('interpreterNote').textContent = `Using ${WEBLLM_MODEL_ID}, downloaded once and run locally via WebGPU.`;
  } else if (modelUnavailable) {
    el('interpreterState').textContent = 'Unavailable';
    el('interpreterNote').textContent = 'No on-device AI in this browser — commands will report "not available" until you switch back to rule-based.';
  } else {
    el('interpreterState').textContent = 'Checking…';
    el('interpreterNote').textContent = 'Detecting on-device AI support in this browser.';
  }
}

// Tries Chrome's built-in Prompt API. Handles both the newer top-level
// `LanguageModel` global and the older `window.ai.languageModel` shape, and
// both `availability()`/`capabilities()` method names, since this API has
// changed shape across Chrome versions.
async function tryChromePromptAPI() {
  const LM = (typeof LanguageModel !== 'undefined' && LanguageModel) || (self.ai && self.ai.languageModel);
  if (!LM) return null;

  try {
    let availability = 'unavailable';
    if (typeof LM.availability === 'function') {
      availability = await LM.availability();
    } else if (typeof LM.capabilities === 'function') {
      const caps = await LM.capabilities();
      availability = caps.available === 'no' ? 'unavailable' : (caps.available === 'readily' ? 'available' : 'downloadable');
    }
    if (availability === 'unavailable') return null;

    setModelStatus('Chrome built-in AI found — preparing session…', 5);
    const session = await LM.create({
      monitor(monitor) {
        monitor.addEventListener('downloadprogress', (e) => {
          const pct = Math.round((e.loaded || 0) * 100);
          setModelStatus(`Downloading Chrome's on-device model… ${pct}%`, pct);
        });
      },
    });
    return session;
  } catch (err) {
    console.warn('Chrome Prompt API present but not usable:', err);
    return null;
  }
}

// Falls back to WebLLM: requires WebGPU, downloads a small model via CDN the
// first time (cached by the browser after that).
async function tryWebLLM() {
  if (!navigator.gpu) return null;

  try {
    setModelStatus('WebGPU found — loading WebLLM engine…', 0);
    const webllm = await import('https://esm.run/@mlc-ai/web-llm');
    const engine = await webllm.CreateMLCEngine(WEBLLM_MODEL_ID, {
      initProgressCallback: (report) => {
        const pct = Math.round((report.progress || 0) * 100);
        setModelStatus(report.text || `Downloading ${WEBLLM_MODEL_ID}… ${pct}%`, pct);
      },
    });
    return engine;
  } catch (err) {
    console.error('WebLLM failed to load:', err);
    return null;
  }
}

async function initOnDeviceModel() {
  modelUnavailable = false;
  setModelStatus('Checking for on-device AI…', 0);
  updateInterpreterCard();

  const session = await tryChromePromptAPI();
  if (session) {
    modelSession = session;
    modelBackend = 'chrome-prompt-api';
    setModelStatus('Ready — using Chrome built-in AI (Gemini Nano). No download needed.', 100);
    updateInterpreterCard();
    return true;
  }

  const engine = await tryWebLLM();
  if (engine) {
    webllmEngine = engine;
    modelBackend = 'webllm';
    setModelStatus(`Ready — using ${WEBLLM_MODEL_ID} locally via WebGPU.`, 100);
    updateInterpreterCard();
    return true;
  }

  modelUnavailable = true;
  setModelStatus('Not supported: this browser has neither Chrome built-in AI nor WebGPU. Staying on rule-based mode.', 0);
  updateInterpreterCard();
  return false;
}

function ensureModelReady() {
  if (modelBackend) return Promise.resolve(true);
  if (!modelInitPromise) modelInitPromise = initOnDeviceModel();
  return modelInitPromise;
}

function buildModelPrompt(command, observation) {
  const obsText = observation.map(o => `- [${o.id}] (${o.tag}) ${o.label}`).join('\n');
  return `You control a support-ticket web page for a user via natural language commands.

Actionable elements currently on the page:
${obsText}

Respond with ONLY one JSON object, no markdown formatting and no explanation outside the JSON, matching this exact schema:
{"action": "resolve" | "escalate" | "assign" | "filter" | "none", "ticketId": number or null, "value": string or null, "reason": string}

Rules:
- "resolve" and "escalate" require ticketId; value must be null.
- "assign" requires ticketId and value must be exactly one of: Unassigned, Sam, Priya, Alex.
- "filter" requires value to be exactly one of: High, Medium, Low, Open, In Progress, Resolved, Escalated; ticketId must be null.
- If the command does not clearly map to one of these actions, use "action": "none" and explain briefly in "reason".

User command: "${command}"

JSON:`;
}

async function callModel(promptText) {
  if (modelBackend === 'chrome-prompt-api') {
    return await modelSession.prompt(promptText);
  }
  if (modelBackend === 'webllm') {
    const reply = await webllmEngine.chat.completions.create({
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.1,
    });
    return reply.choices[0].message.content;
  }
  throw new Error('no model backend ready');
}

function parseModelJson(raw) {
  const cleaned = String(raw || '').replace(/```json|```/gi, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

// Maps the model's structured JSON response onto the exact same shape
// parseCommand() returns, so the rest of the pipeline (guardrail, execute,
// trace) doesn't need to know which interpreter made the decision.
function modelResultToAction(result) {
  if (!result || !result.action || result.action === 'none') {
    return { unmatched: true, reason: (result && result.reason) || 'model returned no actionable result' };
  }

  if (result.action === 'resolve' || result.action === 'escalate') {
    const ticket = tickets.find(t => t.id === Number(result.ticketId));
    if (!ticket) return { unmatched: true, reason: `model chose "${result.action}" but ticketId ${result.ticketId} does not exist` };
    return { action: result.action, ticket, elementId: `${result.action}-${ticket.id}` };
  }

  if (result.action === 'assign') {
    const ticket = tickets.find(t => t.id === Number(result.ticketId));
    const assignee = ASSIGNEES.find(a => a.toLowerCase() === String(result.value || '').toLowerCase());
    if (!ticket || !assignee) {
      return { unmatched: true, reason: `model chose "assign" but ticketId/value was invalid (ticketId=${result.ticketId}, value=${result.value})` };
    }
    return { action: 'assign', ticket, value: assignee, elementId: `assign-${ticket.id}` };
  }

  if (result.action === 'filter') {
    const value = String(result.value || '').toLowerCase();
    const priority = ['high', 'medium', 'low'].includes(value) ? value : undefined;
    const status = ['open', 'in progress', 'resolved', 'escalated'].includes(value) ? value : undefined;
    if (!priority && !status) {
      return { unmatched: true, reason: `model chose "filter" but value "${result.value}" wasn't a recognized priority or status` };
    }
    return { action: 'filter', priority, status };
  }

  return { unmatched: true, reason: `model returned an unrecognized action "${result.action}"` };
}

// Dispatches to whichever interpreter is active and returns a decision in
// the shared { unmatched, reason } | { action, ticket, value, elementId } shape.
async function getDecision(command, observation) {
  if (interpreterMode === 'ondevice') {
    const ready = modelBackend || await ensureModelReady();
    if (!ready) {
      return { parsed: { unmatched: true, reason: 'on-device AI is not available in this browser (see status panel above)' }, extraNote: '' };
    }
    try {
      const promptText = buildModelPrompt(command, observation);
      const raw = await callModel(promptText);
      appendTrace('Decide:', `<code>${modelBackend}</code> raw response: <em>${escapeHtml(String(raw).trim()).slice(0, 300)}</em>`);
      const json = parseModelJson(raw);
      return { parsed: modelResultToAction(json), extraNote: '' };
    } catch (err) {
      return { parsed: { unmatched: true, reason: `model call failed (${err.message})` }, extraNote: '' };
    }
  }
  return {
    parsed: parseCommand(command),
    extraNote: ' A real LLM-backed agent would likely handle more phrasings than these rules do — that gap is the point.',
  };
}

// Step 3/4: Act + Result. Executes the decided action on the real DOM.
function executeAction(parsed) {
  if (parsed.action === 'resolve') {
    document.getElementById(`resolve-${parsed.ticket.id}`).click();
    appendTrace('Act:', `clicked <code>#resolve-${parsed.ticket.id}</code>.`);
    appendTrace('Result:', `Ticket #${parsed.ticket.id} status is now <strong>Resolved</strong>.`);
  } else if (parsed.action === 'escalate') {
    document.getElementById(`escalate-${parsed.ticket.id}`).click();
    appendTrace('Act:', `clicked <code>#escalate-${parsed.ticket.id}</code>.`);
    appendTrace('Result:', `Ticket #${parsed.ticket.id} status is now <strong>Escalated</strong> and priority raised to High.`);
  } else if (parsed.action === 'assign') {
    const select = document.getElementById(`assign-${parsed.ticket.id}`);
    select.value = parsed.value;
    select.dispatchEvent(new Event('change'));
    appendTrace('Act:', `set <code>#assign-${parsed.ticket.id}</code> to "${parsed.value}".`);
    appendTrace('Result:', `Ticket #${parsed.ticket.id} is now assigned to <strong>${parsed.value}</strong>.`);
  } else if (parsed.action === 'filter') {
    document.querySelectorAll('.ticket-row').forEach(row => row.classList.remove('highlight'));
    const matches = tickets.filter(t =>
      (!parsed.priority || t.priority.toLowerCase() === parsed.priority) &&
      (!parsed.status || t.status.toLowerCase() === parsed.status)
    );
    matches.forEach(t => {
      const row = document.getElementById(`ticket-row-${t.id}`);
      if (row) row.classList.add('highlight');
    });
    appendTrace('Act:', `highlighted ${matches.length} matching row(s) — no data changed, this is a read-only filter.`);
    appendTrace('Result:', matches.length
      ? `Showing ${matches.map(t => '#' + t.id).join(', ')}.`
      : 'No tickets matched that filter.');
  }

  actionsTaken += 1;
  el('actionsTaken').textContent = String(actionsTaken);
  setAgentState('Idle', 'Action complete. Type another command.');
}

async function runAgent() {
  const command = commandInput.value;
  if (!command.trim()) return;

  clearTrace();
  hideConfirmBanner();
  setAgentState(
    interpreterMode === 'ondevice' ? 'Thinking' : 'Observing',
    interpreterMode === 'ondevice' ? 'Asking the on-device model to decide…' : 'Reading the page as text (no screenshots).'
  );

  const observation = observePage();
  appendTrace('Observe:', `read ${observation.length} actionable elements from the live page, e.g. <em>"${observation[0]?.label ?? 'none found'}"</em>.`);

  const { parsed, extraNote } = await getDecision(command, observation);

  if (!parsed || parsed.unmatched) {
    // parsed.reason may echo untrusted model output (e.g. a hallucinated ticketId or
    // its free-text "reason" field) — escape before inserting into trace HTML.
    appendTrace('Decide:', `no confident match — ${parsed ? escapeHtml(parsed.reason) : 'empty command'}.`);
    appendTrace('Result:', `No action taken.${extraNote}`);
    setAgentState('Idle', 'Command not understood. Try one of the example chips, or check the on-device AI status.');
    return;
  }

  const summary = parsed.action === 'filter'
    ? `filter tickets by ${[parsed.priority && 'priority=' + parsed.priority, parsed.status && 'status=' + parsed.status].filter(Boolean).join(', ')}`
    : `${parsed.action} ticket #${parsed.ticket.id}${parsed.value ? ' → ' + parsed.value : ''}`;
  appendTrace('Decide:', `matched command to action <strong>${summary}</strong>${parsed.elementId ? ` (target <code>#${parsed.elementId}</code>)` : ''}.`);

  if (DESTRUCTIVE_ACTIONS.has(parsed.action) && guardrailToggle.checked) {
    pendingAction = parsed;
    setAgentState('Awaiting confirmation', 'Guardrail intercepted a destructive action.');
    showConfirmBanner(`Guardrail: this would ${summary}, which changes ticket state. Confirm before the agent proceeds?`);
    return;
  }

  executeAction(parsed);
}

function showConfirmBanner(text) {
  confirmText.textContent = text;
  confirmBanner.classList.remove('hidden');
}

function hideConfirmBanner() {
  confirmBanner.classList.add('hidden');
  pendingAction = null;
}

el('runAgentBtn').addEventListener('click', runAgent);
commandInput.addEventListener('keypress', e => { if (e.key === 'Enter') runAgent(); });

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    commandInput.value = chip.dataset.command;
    runAgent();
  });
});

el('confirmActionBtn').addEventListener('click', () => {
  if (!pendingAction) return;
  const action = pendingAction;
  hideConfirmBanner();
  executeAction(action);
});

el('cancelActionBtn').addEventListener('click', () => {
  appendTrace('Result:', 'Action cancelled by the human reviewer. Nothing changed.');
  setAgentState('Idle', 'Cancelled. Type another command.');
  hideConfirmBanner();
});

interpreterSelect.addEventListener('change', async (e) => {
  interpreterMode = e.target.value;
  updateInterpreterCard();
  if (interpreterMode === 'ondevice' && !modelBackend) {
    await ensureModelReady();
  }
});

guardrailToggle.addEventListener('change', () => {
  el('guardrailState').textContent = guardrailToggle.checked ? 'On' : 'Off';
  el('guardrailNote').textContent = guardrailToggle.checked
    ? 'Destructive actions (resolve, escalate) pause for confirmation before they run.'
    : 'Destructive actions run immediately — no confirmation step.';
});

el('resetBtn').addEventListener('click', () => {
  tickets = DEFAULT_TICKETS.map(t => ({ ...t }));
  actionsTaken = 0;
  el('actionsTaken').textContent = '0';
  commandInput.value = '';
  guardrailToggle.checked = true;
  el('guardrailState').textContent = 'On';
  el('guardrailNote').textContent = 'Destructive actions (resolve, escalate) pause for confirmation before they run.';
  interpreterMode = 'rules';
  interpreterSelect.value = 'rules';
  updateInterpreterCard(); // note: an already-loaded on-device model stays in memory, no need to re-download
  hideConfirmBanner();
  clearTrace();
  appendTrace('Ready.', 'Run a command to see the agent\'s observe → decide → act → result trace here.');
  setAgentState('Idle', 'Type a command and click Run Agent.');
  renderTickets();
});

renderTickets();
