function inr(v) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

function runCardEconomics() {
  const amount = Number(document.getElementById("ticketSize").value || 0);
  const grossMarginPct = Number(document.getElementById("grossMargin").value || 0) / 100;
  const interchangePct = Number(document.getElementById("interchange").value || 0) / 100;
  const mdrPct = Number(document.getElementById("mdr").value || 0) / 100;
  const gatewayPct = Number(document.getElementById("gateway").value || 0) / 100;
  const chargebackPct = Number(document.getElementById("chargeback").value || 0) / 100;
  const fraudLossPct = Number(document.getElementById("fraudLoss").value || 0) / 100;
  const settlementDays = Number(document.getElementById("settlementDays").value || 0);

  const issuerShare = amount * interchangePct;
  const merchantDiscount = amount * mdrPct;
  const gatewayCost = amount * gatewayPct;
  const acquirerSpread = Math.max(merchantDiscount - issuerShare - gatewayCost, 0);
  const chargebackCost = amount * chargebackPct;
  const fraudCost = amount * fraudLossPct;
  const grossProfit = amount * grossMarginPct;
  const merchantNet = grossProfit - merchantDiscount - chargebackCost - fraudCost;

  document.getElementById("merchantNet").textContent = inr(merchantNet);
  document.getElementById("issuerValue").textContent = inr(issuerShare);
  document.getElementById("mdrValue").textContent = inr(merchantDiscount);
  document.getElementById("delayValue").textContent = `T+${settlementDays}`;
  document.getElementById("frictionValue").textContent = chargebackPct > 0.015 ? "High dispute drag" : "Moderate dispute drag";

  document.getElementById("participantRows").innerHTML = [
    ["Cardholder", "Gets immediate authorization feedback and later statement-level dispute rights."],
    ["Merchant", `Sells ${inr(amount)} but funds arrive after ${settlementDays} settlement day(s), net of MDR and downstream losses.`],
    ["Acquirer", `Keeps approximately ${inr(acquirerSpread)} after network, issuer, and gateway outflows.`],
    ["Network", "Routes authorization and clearing messages while enforcing scheme rules."],
    ["Issuer", `Earns about ${inr(issuerShare)} in interchange while carrying credit and fraud exposure.`]
  ].map(([name, detail]) => `<div class="participant-row"><strong>${name}</strong><span>${detail}</span></div>`).join("");

  const merchantRetainedPct = Math.max((merchantNet / amount) * 100, 0);
  document.getElementById("waterfall").innerHTML = `
    <div><strong style="color:#fff">Merchant retained contribution after fees and expected losses</strong></div>
    <div class="waterfall-bar" style="width:${Math.max(merchantRetainedPct, 5)}%"></div>
    <div style="color:#9db0c7">${merchantRetainedPct.toFixed(1)}% of transaction value remains as contribution after gross margin, fees, fraud, and chargeback assumptions.</div>
  `;

  document.getElementById("summaryBox").textContent =
    `The card payment succeeds fastest at authorization time, but the real economics settle later. Merchant margin is squeezed by MDR, settlement lag, chargeback risk, and fraud loss long after the customer has left checkout.`;
}

document.getElementById("runCardEconomics").addEventListener("click", runCardEconomics);
runCardEconomics();
