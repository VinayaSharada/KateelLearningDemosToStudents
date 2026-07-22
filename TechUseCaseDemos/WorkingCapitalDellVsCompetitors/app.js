(function () {
  var baseData = [
    { company: "Dell", revenue: 88, dso: 34, dio: 32, dpo: 79 },
    { company: "HP", revenue: 63, dso: 46, dio: 39, dpo: 61 },
    { company: "Lenovo", revenue: 69, dso: 41, dio: 36, dpo: 54 },
    { company: "Apple", revenue: 383, dso: 28, dio: 12, dpo: 104 }
  ];

  var presets = {
    base: baseData,
    dell_discipline: [
      { company: "Dell", revenue: 88, dso: 30, dio: 28, dpo: 82 },
      { company: "HP", revenue: 63, dso: 40, dio: 34, dpo: 63 },
      { company: "Lenovo", revenue: 69, dso: 38, dio: 31, dpo: 58 },
      { company: "Apple", revenue: 383, dso: 27, dio: 11, dpo: 105 }
    ],
    supply_shock: [
      { company: "Dell", revenue: 88, dso: 36, dio: 46, dpo: 76 },
      { company: "HP", revenue: 63, dso: 50, dio: 54, dpo: 58 },
      { company: "Lenovo", revenue: 69, dso: 45, dio: 49, dpo: 52 },
      { company: "Apple", revenue: 383, dso: 30, dio: 20, dpo: 98 }
    ]
  };

  function cloneRows(rows) {
    return rows.map(function (row) {
      return {
        company: row.company,
        revenue: row.revenue,
        dso: row.dso,
        dio: row.dio,
        dpo: row.dpo
      };
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var tbody = document.getElementById("caseRows");
    if (!tbody) return;

    var state = cloneRows(baseData);

    function compute(row) {
      var ccc = row.dso + row.dio - row.dpo;
      var cashTied = (row.revenue / 365) * ccc;
      var cashFreedPerDsoDay = row.revenue / 365;
      return { ccc: ccc, cashTied: cashTied, cashFreedPerDsoDay: cashFreedPerDsoDay };
    }

    function number(value) {
      return Number(value).toFixed(1);
    }

    function render() {
      var results = state.map(function (row) {
        var calc = compute(row);
        return Object.assign({}, row, calc);
      });

      results.sort(function (a, b) { return a.ccc - b.ccc; });
      var best = results[0];
      var dell = results.find(function (row) { return row.company === "Dell"; });
      var avgCompetitorCash = results.filter(function (row) { return row.company !== "Dell"; }).reduce(function (sum, row) {
        return sum + row.cashTied;
      }, 0) / 3;
      var dellAdvantage = avgCompetitorCash - dell.cashTied;

      tbody.innerHTML = state.map(function (row) {
        var calc = compute(row);
        var highlight = row.company === "Dell" ? ' class="highlight"' : "";
        return [
          "<tr" + highlight + ">",
          "<td><strong>" + row.company + "</strong></td>",
          '<td><input data-company="' + row.company + '" data-field="revenue" type="number" min="1" step="1" value="' + row.revenue + '"></td>',
          '<td><input data-company="' + row.company + '" data-field="dso" type="number" min="0" step="1" value="' + row.dso + '"></td>',
          '<td><input data-company="' + row.company + '" data-field="dio" type="number" min="0" step="1" value="' + row.dio + '"></td>',
          '<td><input data-company="' + row.company + '" data-field="dpo" type="number" min="0" step="1" value="' + row.dpo + '"></td>',
          "<td>" + number(calc.ccc) + " days</td>",
          "<td>$" + number(calc.cashTied) + "B</td>",
          "<td>$" + number(calc.cashFreedPerDsoDay) + "B</td>",
          "</tr>"
        ].join("");
      }).join("");

      document.getElementById("bestCompany").textContent = best.company + " (" + number(best.ccc) + " days)";
      document.getElementById("dellAdvantage").textContent = "$" + number(dellAdvantage) + "B versus competitor average";
      document.getElementById("bestLever").textContent = inferBestLever(dell);
      document.getElementById("caseSummary").textContent =
        dell.ccc <= best.ccc
          ? "Dell leads on working-capital speed in this scenario. The case now becomes whether the advantage is driven more by operations, receivables discipline, or supplier power."
          : "Dell no longer leads in this scenario. Ask which assumption changed enough to erode the advantage and whether that shift is operationally realistic.";
      var actions = inferAction(dell);
      document.getElementById("executiveDecision").textContent = actions.decision;
      document.getElementById("riskDecision").textContent = actions.risk;
      document.getElementById("managementAction").textContent = actions.action;

      document.getElementById("insightList").innerHTML = [
        "<li>Dell currently ties up $" + number(dell.cashTied) + "B based on the chosen assumptions.</li>",
        "<li>Each 1-day reduction in Dell DSO would free roughly $" + number(dell.cashFreedPerDsoDay) + "B of cash.</li>",
        "<li>The spread between the best and worst CCC is " + number(results[results.length - 1].ccc - best.ccc) + " days.</li>",
        "<li>Apple-style supplier terms can offset inventory pressure, but that advantage may not be easy to replicate.</li>"
      ].join("");

      tbody.querySelectorAll("input").forEach(function (input) {
        input.addEventListener("input", function () {
          var company = input.getAttribute("data-company");
          var field = input.getAttribute("data-field");
          var row = state.find(function (item) { return item.company === company; });
          row[field] = Number(input.value || 0);
          render();
        });
      });
    }

    function inferBestLever(dell) {
      var levers = [
        { label: "Reduce DSO", impact: dell.dso },
        { label: "Reduce DIO", impact: dell.dio },
        { label: "Extend DPO carefully", impact: dell.dpo / 2 }
      ];
      levers.sort(function (a, b) { return b.impact - a.impact; });
      return levers[0].label;
    }

    function inferAction(dell) {
      var perDay = dell.cashFreedPerDsoDay;
      if (dell.dso >= dell.dio && dell.dso >= dell.dpo / 2) {
        return {
          decision: "Collections should be the first lever. Each 1-day DSO improvement frees about $" + number(perDay) + "B.",
          risk: "Customer friction can rise if collections pressure is too aggressive.",
          action: "Tighten dispute resolution, invoicing accuracy, and collections cadence before pushing supplier terms harder."
        };
      }
      if (dell.dio >= dell.dso) {
        return {
          decision: "Inventory looks like the bigger lever than receivables in this scenario.",
          risk: "Lower inventory may increase service or supply-chain risk.",
          action: "Improve planning and turns while protecting critical service levels."
        };
      }
      return {
        decision: "Supplier terms remain an important part of the case, but finance should test sustainability.",
        risk: "Supplier stress or pricing pressure may offset the cash benefit.",
        action: "Review supplier concentration and balance-sheet impact before extending DPO further."
      };
    }

    document.querySelectorAll("[data-preset]").forEach(function (button) {
      button.addEventListener("click", function () {
        state = cloneRows(presets[button.getAttribute("data-preset")] || baseData);
        render();
      });
    });

    document.getElementById("exportCase").addEventListener("click", function () {
      var content = [
        "Working Capital Case Summary",
        "Best CCC: " + document.getElementById("bestCompany").textContent,
        "Dell cash advantage: " + document.getElementById("dellAdvantage").textContent,
        "Largest improvement lever: " + document.getElementById("bestLever").textContent,
        "Executive decision: " + document.getElementById("executiveDecision").textContent,
        "Risk: " + document.getElementById("riskDecision").textContent,
        "Management action: " + document.getElementById("managementAction").textContent
      ].join("\n");
      var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "working-capital-case-summary.txt";
      link.click();
      URL.revokeObjectURL(url);
    });

    render();
  });
})();
