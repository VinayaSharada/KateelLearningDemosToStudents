function clamp(v) { return Math.max(1, Math.min(10, v)); }

function runCbdc() {
  const retail = document.getElementById("cbdcScope").value === "retail";
  const token = document.getElementById("cbdcModel").value === "token";
  const architecture = document.getElementById("cbdcArch").value;
  const offline = document.getElementById("cbdcOffline").checked;
  const privacy = document.getElementById("cbdcPrivacy").value;
  const limit = Number(document.getElementById("cbdcLimit").value || 0);
  const interest = document.getElementById("cbdcInterest").checked;
  const programmable = document.getElementById("cbdcProgrammable").checked;
  const xborder = document.getElementById("cbdcXborder").checked;

  const scores = {
    inclusion: clamp((retail ? 8 : 3) + (offline ? 2 : 0) - (limit < 20000 ? 1 : 0)),
    privacy: clamp((privacy === "high" ? 9 : privacy === "medium" ? 6 : 3) + (token ? 1 : 0)),
    control: clamp((architecture === "direct" ? 9 : architecture === "hybrid" ? 7 : 5) + (programmable ? 1 : 0)),
    resilience: clamp((architecture === "hybrid" ? 8 : architecture === "intermediated" ? 7 : 6) + (offline ? 1 : 0)),
    disruption: clamp((retail ? 7 : 3) + (interest ? 2 : 0) + (architecture === "direct" ? 1 : 0))
  };

  const mount = document.getElementById("scoreGrid");
  mount.innerHTML = Object.entries(scores).map(([label, value]) => `
    <div class="score-card">
      <div class="label">${label}</div>
      <div class="value">${value}/10</div>
      <div class="score-bar" style="width:${value * 10}%"></div>
    </div>
  `).join("");

  const tradeoffs = [
    `This design is ${retail ? "retail-facing" : "wholesale-focused"}, so inclusion pressure is ${retail ? "high" : "secondary"} while systemic-control concerns remain ${retail ? "visible" : "dominant"}.`,
    `${token ? "Token-style" : "Account-style"} representation changes how offline support, traceability, and recovery are discussed.`,
    `${architecture.charAt(0).toUpperCase() + architecture.slice(1)} architecture shifts operational burden between the central bank and intermediaries.`,
    `${programmable ? "Programmability increases control and use-case flexibility, but also governance complexity." : "Non-programmable design reduces complexity but limits conditional-payment scenarios."}`,
    `${xborder ? "Cross-border ambition improves corridor utility but raises interoperability and compliance design burden." : "Domestic-only design reduces early complexity but leaves corridor questions unresolved."}`
  ];
  document.getElementById("tradeoffList").innerHTML = tradeoffs.map(t => `<div class="tradeoff-item">${t}</div>`).join("");

  document.getElementById("designNote").textContent =
    `The strongest teaching point here is that every CBDC choice solves one policy problem by moving cost, risk, or control somewhere else. Holding limit: INR ${limit.toLocaleString("en-IN")}. Interest ${interest ? "enabled" : "disabled"}.`;
}

document.getElementById("runCbdc").addEventListener("click", runCbdc);
runCbdc();
