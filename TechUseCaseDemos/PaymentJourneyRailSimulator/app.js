const railData = {
  upi: {
    label: "UPI",
    feePct: 0.0,
    feeFlat: 0,
    finality: "Near-real-time with operational reversals",
    settlement: "Switch-mediated bank settlement, immediate UX",
    liquidity: "Intraday bank liquidity and exception handling matter",
    fraud: "APP fraud, mule risk, duplicate timeout ambiguity",
    customer: "Fast, familiar, low-friction",
    merchant: "Low acceptance friction, high exception sensitivity",
    participants: [
      ["Payer", "Initiates the payment in the app."],
      ["Payer PSP", "Authenticates and forwards the instruction."],
      ["NPCI switch", "Routes and coordinates the message flow."],
      ["Payee PSP", "Receives and validates beneficiary context."],
      ["Beneficiary bank / merchant", "Accepts credit and handles reconciliation."]
    ],
    flow: [
      ["Authorization", "Payer app authenticates and payer PSP sends the request to the switch."],
      ["Routing", "NPCI switch routes to the payee PSP and beneficiary bank path."],
      ["Posting", "Beneficiary side accepts or rejects the credit instruction."],
      ["Confirmation", "Success or pending response returns to the payer app."],
      ["Exception handling", "Timeouts, retries, and reversals determine true closure."]
    ],
    baseMinutes: 0.5
  },
  card: {
    label: "Card",
    feePct: 1.85,
    feeFlat: 1.5,
    finality: "Authorization now, settlement later",
    settlement: "Batch clearing and T+1/T+2 merchant funding",
    liquidity: "Merchant waits for funding; issuer funds float the system",
    fraud: "CNP fraud, chargebacks, friendly fraud, refund leakage",
    customer: "Simple checkout with visible auth result",
    merchant: "Strong acceptance, delayed funding, fee drag",
    participants: [
      ["Cardholder", "Presents card credentials."],
      ["Merchant / gateway", "Captures the request."],
      ["Acquirer", "Forwards the authorization and settles the merchant."],
      ["Card network", "Routes auth and clearing messages."],
      ["Issuer", "Approves, declines, or later disputes."]
    ],
    flow: [
      ["Authorization", "Merchant seeks issuer approval through acquirer and network."],
      ["Capture", "Merchant finalizes the sale for clearing."],
      ["Clearing", "Network sends financial records to issuer and acquirer."],
      ["Settlement", "Acquirer pays merchant after network / issuer settlement."],
      ["Post-settlement disputes", "Chargebacks and refunds can reopen economics later."]
    ],
    baseMinutes: 1440
  },
  wallet: {
    label: "Wallet",
    feePct: 0.6,
    feeFlat: 1,
    finality: "Fast inside the wallet, depends on funding rail underneath",
    settlement: "Stored-value or linked-instrument settlement model",
    liquidity: "Issuer or escrow structure carries stored-value obligation",
    fraud: "Account takeover, fake merchants, refund abuse",
    customer: "Convenient repeat-pay experience",
    merchant: "Fast acceptance, wallet-fee and withdrawal considerations",
    participants: [
      ["Customer", "Uses stored balance or linked source."],
      ["Wallet operator", "Maintains balance and routing logic."],
      ["Funding / withdrawal bank", "Moves money into or out of the wallet."],
      ["Merchant", "Accepts wallet balance or wallet token."],
      ["Safeguarding account", "Protects stored-value liability."]
    ],
    flow: [
      ["Funding", "Customer tops up or links the wallet to a bank/card source."],
      ["Authorization", "Wallet validates balance and merchant credentials."],
      ["Posting", "Wallet debits customer and credits merchant balance or claim."],
      ["Settlement", "Merchant withdrawal or wallet settlement batch closes the loop."],
      ["Refund / dormancy handling", "Liability treatment matters after payment."]
    ],
    baseMinutes: 60
  },
  neft: {
    label: "NEFT",
    feePct: 0.05,
    feeFlat: 2,
    finality: "Batch-style bank transfer finality",
    settlement: "Deferred net settlement through bank transfer infrastructure",
    liquidity: "Bank treasury timing matters more than customer experience",
    fraud: "APP fraud, beneficiary setup risk, delayed detection",
    customer: "Reliable but less instant",
    merchant: "Good for account-based transfers, slower confidence",
    participants: [
      ["Originator", "Requests transfer at the sending bank."],
      ["Remitter bank", "Validates and sends the instruction."],
      ["Settlement infrastructure", "Schedules and settles participating banks."],
      ["Beneficiary bank", "Credits recipient account."],
      ["Beneficiary", "Receives funds after settlement cycle."]
    ],
    flow: [
      ["Instruction capture", "Sending bank records the transfer request."],
      ["Batch queue", "Instruction enters scheduled settlement processing."],
      ["Interbank settlement", "Banks settle net obligations."],
      ["Account credit", "Beneficiary bank posts the customer credit."],
      ["Confirmation", "Originator sees completion after bank posting."]
    ],
    baseMinutes: 120
  },
  rtgs: {
    label: "RTGS",
    feePct: 0.02,
    feeFlat: 25,
    finality: "High-value real-time gross finality",
    settlement: "Immediate central-bank money style settlement",
    liquidity: "High intraday liquidity need, strong certainty",
    fraud: "High-value APP fraud, approval-control failure risk",
    customer: "Used for urgency and value, not convenience",
    merchant: "Strong certainty when confirmed, higher threshold and formality",
    participants: [
      ["Sender", "Initiates high-value transfer."],
      ["Remitter bank", "Performs controls and liquidity checks."],
      ["RTGS system", "Settles each transfer individually."],
      ["Beneficiary bank", "Receives final settled funds."],
      ["Recipient", "Gets high-certainty value transfer."]
    ],
    flow: [
      ["Pre-check", "Bank verifies limits, approvers, and available liquidity."],
      ["Submission", "Instruction goes to the RTGS system."],
      ["Gross settlement", "Transfer settles individually in real time."],
      ["Credit", "Beneficiary bank posts the funds."],
      ["Closure", "Little room for operational reversal after settlement."]
    ],
    baseMinutes: 10
  },
  cash: {
    label: "Cash",
    feePct: 0,
    feeFlat: 0,
    finality: "Immediate physical handoff",
    settlement: "No interbank clearing, but physical handling cost",
    liquidity: "Merchant receives usable value immediately",
    fraud: "Counterfeit, theft, cash handling loss",
    customer: "High certainty, low data trail",
    merchant: "Immediate funds, high handling burden",
    participants: [
      ["Payer", "Hands over physical notes."],
      ["Cashier / merchant", "Accepts and verifies."],
      ["Cash handling team", "Counts, secures, and deposits."],
      ["Bank branch / CIT", "Moves and credits physical cash later."],
      ["Treasury / finance", "Tracks cash reconciliation and leakage."]
    ],
    flow: [
      ["Exchange", "Value changes hands physically."],
      ["Verification", "Merchant checks authenticity and amount."],
      ["Storage", "Cash is secured on site."],
      ["Deposit", "Merchant later moves value into the banking system."],
      ["Reconciliation", "Cash records must match till and deposit records."]
    ],
    baseMinutes: 0.1
  },
  bitcoin: {
    label: "Bitcoin",
    feePct: 0.15,
    feeFlat: 3,
    finality: "Probabilistic finality after confirmations",
    settlement: "Network confirmation, not card-style or bank-style clearing",
    liquidity: "Price volatility and treasury conversion policy matter",
    fraud: "Address error, phishing, irreversible destination mistakes",
    customer: "Can feel fast but certainty depends on confirmations",
    merchant: "Settlement visibility high, recovery low",
    participants: [
      ["Sender wallet", "Creates and signs transaction."],
      ["Node / mempool", "Broadcasts pending instruction."],
      ["Miners / validators", "Include transaction in a block."],
      ["Recipient wallet", "Observes confirmations."],
      ["Treasury / exchange", "Handles conversion and balance-sheet policy."]
    ],
    flow: [
      ["Broadcast", "Transaction enters the mempool."],
      ["Inclusion", "A miner includes it in a block."],
      ["Confirmations", "Confidence rises as blocks build on top."],
      ["Treasury decision", "Merchant decides whether to hold or convert."],
      ["Irreversibility", "Recovery options are weak after confirmation."]
    ],
    baseMinutes: 30
  }
};

function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function renderJourney() {
  const rail = railData[document.getElementById("railSelect").value];
  const amount = Number(document.getElementById("amountInput").value || 0);
  const failure = document.getElementById("failureSelect").value;
  const crossBorder = document.getElementById("crossBorderToggle").checked;
  const fee = amount * rail.feePct / 100 + rail.feeFlat + (crossBorder ? amount * 0.012 : 0);
  const minutes = rail.baseMinutes * (failure === "timeout" ? 4 : failure === "reversal" ? 2 : failure === "fraud" ? 3 : 1) * (crossBorder ? 1.8 : 1);

  document.getElementById("railLabel").textContent = rail.label;
  document.getElementById("finalityValue").textContent = rail.finality;
  document.getElementById("feeValue").textContent = formatMoney(fee);
  document.getElementById("timeValue").textContent = `${minutes < 60 ? minutes.toFixed(1) + " min" : (minutes / 60).toFixed(1) + " hrs"}`;
  document.getElementById("liqValue").textContent = rail.liquidity;
  document.getElementById("fraudValue").textContent = rail.fraud;
  document.getElementById("cxValue").textContent = rail.customer;
  document.getElementById("mxValue").textContent = rail.merchant;
  document.getElementById("settlementValue").textContent = rail.settlement;

  document.getElementById("participantList").innerHTML = rail.participants.map(([name, detail]) => (
    `<div class="participant-chip"><strong>${name}</strong><span>${detail}</span></div>`
  )).join("");

  document.getElementById("flowList").innerHTML = rail.flow.map(([phase, explain], idx) => (
    `<div class="flow-step"><div class="phase">Step ${idx + 1}</div><div class="title">${phase}</div><div class="explain">${explain}</div></div>`
  )).join("");

  const scenarioTags = [
    crossBorder ? "Cross-border extension active" : "Domestic flow active",
    failure === "clean" ? "Happy path" : `Exception path: ${failure}`,
    amount >= 200000 ? "High-value handling matters" : "Retail-scale payment"
  ];
  document.getElementById("scenarioTags").innerHTML = scenarioTags.map(tag => `<span class="scenario-tag">${tag}</span>`).join("");

  const insight = failure === "clean"
    ? `The ${rail.label} happy path looks simple, but the real teaching point is where operational closure differs from customer-perceived completion.`
    : `The ${rail.label} exception path shows why payment-state ambiguity matters: ${failure} delays confidence, increases support load, and can create reconciliation work even when the customer thinks the payment already happened.`;
  document.getElementById("insightBox").textContent = insight;
}

document.getElementById("railSelect").addEventListener("change", renderJourney);
document.getElementById("amountInput").addEventListener("input", renderJourney);
document.getElementById("failureSelect").addEventListener("change", renderJourney);
document.getElementById("crossBorderToggle").addEventListener("change", renderJourney);
renderJourney();
