// AI Hedge Orchestrator
// KateelLearningDemos - Attribution: vinallcontact@gmail.com

(function() {
  var conditions = {
    normal: {
      name: "Normal Markets",
      vol: 10,
      description: "Balanced hedging with moderate coverage for known exposures."
    },
    volatile: {
      name: "High Volatility",
      vol: 20,
      description: "Raise protection for major currencies as market swings accelerate."
    },
    crisis: {
      name: "Market Crisis",
      vol: 30,
      description: "Prioritize capital preservation and maximum hedge certainty."
    }
  };

  var assetConfigs = [
    { key: "eur", label: "EUR", exposureId: "eurExposure", hedgeId: "eurHedge", confidenceId: "eurConfidence", base: 70, slope: 0.5, cap: 95, unitScale: 1000000 },
    { key: "gbp", label: "GBP", exposureId: "gbpExposure", hedgeId: "gbpHedge", confidenceId: "gbpConfidence", base: 65, slope: 0.4, cap: 85, unitScale: 1000000 },
    { key: "jpy", label: "JPY", exposureId: "jpyExposure", hedgeId: "jpyHedge", confidenceId: "jpyConfidence", base: 55, slope: 0.3, cap: 75, unitScale: 100000000 },
    { key: "commodity", label: "Commodity", exposureId: "commodityExposure", hedgeId: "commodityHedge", confidenceId: "commodityConfidence", base: 40, slope: 0.2, cap: 60, unitScale: 1000000 }
  ];

  var scenarioSelect = document.getElementById("scenarioSelect");
  var aiToggle = document.getElementById("aiToggle");
  var optimizeBtn = document.getElementById("optimizeBtn");
  var exportBtn = document.getElementById("exportBtn");
  var resetBtn = document.getElementById("resetBtn");
  var aiRecommendation = document.getElementById("aiRecommendation");

  function formatCurrency(value) {
    return "$" + Math.round(value).toLocaleString("en-US");
  }

  function portfolioScale() {
    return assetConfigs.reduce(function(sum, asset) {
      return sum + parseFloat(document.getElementById(asset.exposureId).value || 0);
    }, 0);
  }

  function updateScenario() {
    var scenario = scenarioSelect.value;
    var config = conditions[scenario] || conditions.normal;
    document.getElementById("scenarioHeadline").textContent = config.name;
    document.getElementById("scenarioDescription").textContent = config.description;
    updatePortfolioSummary();
    updateAIInsights();
  }

  function updatePortfolioSummary() {
    var total = portfolioScale();
    document.getElementById("portfolioNotional").textContent = formatCurrency(total);
    document.getElementById("portfolioScale").textContent = formatCurrency(total);
  }

  function confidenceLabel(hedgeRatio, scenario) {
    if (scenario === "crisis" && hedgeRatio >= 90) {
      return "Confidence: High urgency";
    }
    if (hedgeRatio >= 80) {
      return "Confidence: High";
    }
    if (hedgeRatio >= 65) {
      return "Confidence: Medium";
    }
    return "Confidence: Selective";
  }

  function computeRecommendations() {
    var scenario = scenarioSelect.value;
    var vol = conditions[scenario] ? conditions[scenario].vol : 10;

    return assetConfigs.map(function(asset) {
      var exposure = parseFloat(document.getElementById(asset.exposureId).value || 0);
      var exposureFactor = Math.min(8, exposure / asset.unitScale);
      var hedgeRatio = Math.min(asset.cap, asset.base + vol * asset.slope + exposureFactor);
      return {
        key: asset.key,
        label: asset.label,
        exposure: exposure,
        hedgeRatio: Math.round(hedgeRatio),
        confidence: confidenceLabel(hedgeRatio, scenario)
      };
    });
  }

  function renderCoverageBars(recommendations) {
    var container = document.getElementById("coverageBars");
    container.innerHTML = recommendations.map(function(item) {
      return '<div class="mini-bar-row"><strong>' + item.label + '</strong><div class="mini-track"><div class="mini-fill" style="width:' + item.hedgeRatio + '%;"></div></div><span>' + item.hedgeRatio + '%</span></div>';
    }).join("");
  }

  function renderTrace(recommendations) {
    var scenario = scenarioSelect.value;
    var vol = conditions[scenario].vol;
    var total = portfolioScale();
    var weighted = recommendations.reduce(function(sum, item) {
      return sum + item.hedgeRatio * item.exposure;
    }, 0) / Math.max(total, 1);

    document.getElementById("optimizerTrace").innerHTML = [
      '<div class="trace-item"><strong>1. Market state read:</strong> ' + conditions[scenario].name + ' with implied volatility shock of ' + vol + '%.</div>',
      '<div class="trace-item"><strong>2. Exposure aggregation:</strong> Portfolio notional scaled to ' + formatCurrency(total) + ' across four hedge buckets.</div>',
      '<div class="trace-item"><strong>3. Coverage balancing:</strong> Weighted hedge target converges near ' + Math.round(weighted) + '% after ranking the most sensitive exposures.</div>',
      '<div class="trace-item"><strong>4. Treasury action:</strong> Prioritize high-ratio assets first, then layer options or forwards based on liquidity and tenor.</div>'
    ].join("");
  }

  function updateRiskMetrics(recommendations) {
    var total = portfolioScale();
    var weightedHedge = recommendations.reduce(function(sum, item) {
      return sum + item.hedgeRatio * item.exposure;
    }, 0) / Math.max(total, 1);
    var residualRisk = Math.max(5, Math.round(100 - weightedHedge + conditions[scenarioSelect.value].vol * 0.4));
    var hedgeCost = total * (weightedHedge / 100) * 0.012;

    document.getElementById("weightedHedge").textContent = Math.round(weightedHedge) + "%";
    document.getElementById("residualRisk").textContent = residualRisk;
    document.getElementById("hedgeCost").textContent = formatCurrency(hedgeCost);
  }

  function optimizeHedges() {
    var recommendations = computeRecommendations();
    recommendations.forEach(function(item) {
      document.getElementById(item.key + "Hedge").textContent = item.hedgeRatio + "%";
      document.getElementById(item.key + "Confidence").textContent = item.confidence;
    });

    renderCoverageBars(recommendations);
    renderTrace(recommendations);
    updateRiskMetrics(recommendations);
    updatePortfolioSummary();
    updateAIInsights(recommendations);

    document.getElementById("optimizationState").textContent = "Optimized";
    document.getElementById("optimizationSummary").textContent =
      "Generated hedge instructions across four asset buckets with scenario-aware coverage levels and residual-risk trade-offs.";
  }

  function updateAIInsights(precomputed) {
    if (!aiToggle.checked) {
      aiRecommendation.textContent = "Enable AI insights to see treasury narrative guidance for the selected scenario.";
      return;
    }

    var recommendations = precomputed || computeRecommendations();
    var topAsset = recommendations.slice().sort(function(a, b) {
      return b.hedgeRatio - a.hedgeRatio;
    })[0];
    var weighted = recommendations.reduce(function(sum, item) {
      return sum + item.hedgeRatio * item.exposure;
    }, 0) / Math.max(portfolioScale(), 1);

    var narratives = {
      normal: "For normal markets, keep core currency exposures in the " + Math.round(weighted) + "% range and preserve flexibility for timing-sensitive commodity inputs.",
      volatile: "Volatility is elevated. Bias execution toward " + topAsset.label + " first because it currently carries the strongest protection requirement at " + topAsset.hedgeRatio + "%.",
      crisis: "Crisis mode favors execution certainty over optionality. Lock the highest-risk buckets immediately and accept higher hedge carry to suppress tail losses."
    };

    aiRecommendation.textContent = narratives[scenarioSelect.value];
  }

  function exportResults() {
    var recommendations = computeRecommendations();
    var data = {
      scenario: scenarioSelect.value,
      exposures: {
        eur: document.getElementById("eurExposure").value,
        gbp: document.getElementById("gbpExposure").value,
        jpy: document.getElementById("jpyExposure").value,
        commodity: document.getElementById("commodityExposure").value
      },
      recommendations: recommendations,
      aiEnabled: aiToggle.checked,
      timestamp: new Date().toISOString()
    };

    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "ai-hedge-results.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetValues() {
    scenarioSelect.value = "normal";
    document.getElementById("eurExposure").value = 5000000;
    document.getElementById("gbpExposure").value = 3000000;
    document.getElementById("jpyExposure").value = 200000000;
    document.getElementById("commodityExposure").value = 1500000;
    aiToggle.checked = true;
    document.getElementById("optimizationState").textContent = "Ready";
    document.getElementById("optimizationSummary").textContent = "Adjust exposures and click optimize to generate hedge instructions.";
    updateScenario();
    optimizeHedges();
  }

  function init() {
    scenarioSelect.addEventListener("change", updateScenario);
    aiToggle.addEventListener("change", updateAIInsights);
    optimizeBtn.addEventListener("click", optimizeHedges);
    exportBtn.addEventListener("click", exportResults);
    resetBtn.addEventListener("click", resetValues);
    assetConfigs.forEach(function(asset) {
      document.getElementById(asset.exposureId).addEventListener("input", updatePortfolioSummary);
    });

    updateScenario();
    optimizeHedges();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
