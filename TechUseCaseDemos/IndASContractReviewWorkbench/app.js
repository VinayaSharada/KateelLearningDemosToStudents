const clauses = [
  { clause: "Performance obligation", signal: "Hardware and support bundled", finance: "Are there multiple obligations?", legal: "Is support separately enforceable?", owner: "Controller" },
  { clause: "Variable consideration", signal: "Quarter-end rebate linked to volume", finance: "Should revenue be constrained?", legal: "Is rebate formula binding?", owner: "FP&A + legal" },
  { clause: "Return rights", signal: "45-day return right on unused stock", finance: "Does this affect revenue timing?", legal: "Are return conditions narrow enough?", owner: "Revenue accounting" },
  { clause: "Renewal clause", signal: "Auto-renewal unless notice given", finance: "Does this affect contract term?", legal: "Is renewal enforceable as drafted?", owner: "Legal counsel" }
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("contractItems").innerHTML = clauses.map((item) => `<div class="trace-card"><span>${item.clause}</span><strong>${item.signal}</strong><p>${item.finance}</p></div>`).join("");
  document.getElementById("contractRows").innerHTML = clauses.map((item) => `<tr><td>${item.clause}</td><td>${item.signal}</td><td>${item.finance}</td><td>${item.legal}</td><td>${item.owner}</td></tr>`).join("");
});
