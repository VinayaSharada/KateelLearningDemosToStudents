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

const el = id => document.getElementById(id);
const ticketTable = el('ticketTable');
const traceLog = el('traceLog');
const commandInput = el('commandInput');
const guardrailToggle = el('guardrailToggle');
const confirmBanner = el('confirmBanner');
const confirmText = el('confirmText');

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

function runAgent() {
  const command = commandInput.value;
  if (!command.trim()) return;

  clearTrace();
  hideConfirmBanner();
  setAgentState('Observing', 'Reading the page as text (no screenshots).');

  const observation = observePage();
  appendTrace('Observe:', `read ${observation.length} actionable elements from the live page, e.g. <em>"${observation[0]?.label ?? 'none found'}"</em>.`);

  const parsed = parseCommand(command);

  if (!parsed || parsed.unmatched) {
    appendTrace('Decide:', `no confident match — ${parsed ? parsed.reason : 'empty command'}.`);
    appendTrace('Result:', 'No action taken. A real LLM-backed agent would likely handle more phrasings than these rules do — that gap is the point.');
    setAgentState('Idle', 'Command not understood. Try one of the example chips.');
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
  hideConfirmBanner();
  clearTrace();
  appendTrace('Ready.', 'Run a command to see the agent\'s observe → decide → act → result trace here.');
  setAgentState('Idle', 'Type a command and click Run Agent.');
  renderTickets();
});

renderTickets();
