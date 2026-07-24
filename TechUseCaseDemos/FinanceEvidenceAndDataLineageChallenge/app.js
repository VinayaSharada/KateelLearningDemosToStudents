const claims = [
  { claim: "Revenue grew 6%", source: "Trial balance row 18 and sales report tab B", status: "Supported" },
  { claim: "Margin improved because sourcing discipline improved", source: "No direct row trace", status: "Unsupported" },
  { claim: "Collections improved by two days", source: "AR ageing export row 42", status: "Supported" }
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lineageClaims").innerHTML = claims.map((item) => `<div class="trace-card"><span>${item.status}</span><strong>${item.claim}</strong><p>${item.source}</p></div>`).join("");
});
