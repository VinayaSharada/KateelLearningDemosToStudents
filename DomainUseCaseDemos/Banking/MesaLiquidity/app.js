// Mesa Liquidity Data Generator - fully local browser edition
// Author: vinallcontact@gmail.com

(function() {
  function formatCurrency(value) {
    return "₹" + Math.round(value).toLocaleString("en-IN");
  }

  function emptyState(message) {
    return '<div class="chart-empty">' + message + "</div>";
  }

  class MesaLiquidityGenerator {
    constructor() {
      this.customers = [];
      this.accounts = [];
      this.transactions = [];
      this.metrics = [];
      this.aiEnabled = false;
      this.forecast = null;
      this.forecastDistribution = [];
      this.isSimulating = false;
      this.convergenceSeries = [];
      this.simulationClock = { startMs: null, elapsedMs: 0, completed: 0, total: 0, forecastDays: 30 };
      this.segmentColors = ["#4cc9f0", "#7b9cff", "#7ae582", "#ffb703"];
      this.riskColors = { low: "#7ae582", medium: "#ffb703", high: "#ff6b6b" };
      this.init();
    }

    init() {
      var self = this;

      document.getElementById("numCustomers").addEventListener("input", function(e) {
        document.getElementById("customersDisplay").textContent = Number(e.target.value).toLocaleString("en-IN");
      });

      document.getElementById("numTransactions").addEventListener("input", function(e) {
        document.getElementById("transactionsDisplay").textContent = Number(e.target.value).toLocaleString("en-IN");
      });

      document.getElementById("numIterations").addEventListener("input", function(e) {
        var value = self.normalizeIterations(e.target.value);
        document.getElementById("iterationsDisplay").textContent = value.toLocaleString("en-IN");
      });

      document.getElementById("simulationDelay").addEventListener("input", function(e) {
        var value = self.normalizeDelay(e.target.value);
        document.getElementById("delayDisplay").textContent = value.toFixed(2);
      });

      document.getElementById("aiToggle").addEventListener("change", function(e) {
        self.aiEnabled = e.target.checked;
        self.updateAIInsights();
      });

      document.getElementById("generateBtn").addEventListener("click", function() {
        self.generateData();
      });
      document.getElementById("forecastBtn").addEventListener("click", function() {
        self.runMonteCarlo();
      });
      document.getElementById("exportBtn").addEventListener("click", function() {
        self.exportData();
      });
      document.getElementById("resetBtn").addEventListener("click", function() {
        self.resetData();
      });

      document.querySelectorAll(".tab").forEach(function(tab) {
        tab.addEventListener("click", function() {
          self.switchTab(tab.dataset.tab);
        });
      });

      this.renderEmptyCharts();
      this.updateStoryPanel();
      this.updateSimulationPanel();
      this.updateProgress(0, 0, "No simulation running");
      this.updateWorkEstimate();
      this.updateAIInsights();
      this.updateForecastPanel();
    }

    switchTab(tabName) {
      document.querySelectorAll(".tab").forEach(function(t) {
        t.classList.toggle("active", t.dataset.tab === tabName);
      });

      document.querySelectorAll(".tab-content").forEach(function(c) {
        c.classList.toggle("active", c.id === tabName + "-tab");
      });

      if (this.customers.length === 0) {
        return;
      }

      if (tabName === "overview" || tabName === "customers") {
        this.renderSegmentChart();
      }
      if (tabName === "overview" || tabName === "metrics") {
        this.renderRiskChart();
      }
    }

    generateData() {
      var numCustomers = parseInt(document.getElementById("numCustomers").value, 10);
      var numTransactions = parseInt(document.getElementById("numTransactions").value, 10);

      this.customers = this.generateCustomers(numCustomers);
      this.accounts = this.generateAccounts(this.customers);
      this.transactions = this.generateTransactions(this.accounts, numTransactions);
      this.metrics = this.generateLiquidityMetrics(this.accounts, this.transactions);
      this.forecast = null;
      this.forecastDistribution = [];
      this.convergenceSeries = [];

      this.updateKPIs();
      this.updateTables();
      this.renderSegmentChart();
      this.renderRiskChart();
      this.updateStoryPanel();
      this.updateAIInsights();
      this.updateForecastPanel();
      this.updateSimulationPanel();
      this.updateProgress(0, 0, "Ready to run a new simulation");
      this.simulationClock = { startMs: null, elapsedMs: 0, completed: 0, total: 0, forecastDays: 30 };
      this.updateWorkEstimate();
      this.updateRuntimeStatus("Dataset generated locally in this browser", "success");
    }

    generateCustomers(count) {
      var customers = [];
      var segments = ["retail", "corporate", "sme", "hni"];
      var segmentWeights = [0.6, 0.2, 0.15, 0.05];
      var i;

      for (i = 0; i < count; i++) {
        var segment = this.weightedRandom(segments, segmentWeights);
        customers.push({
          customer_id: "CUST_" + String(i + 1).padStart(6, "0"),
          name: this.fakeName(),
          segment: segment,
          annual_income: this.logNormal(11, 0.8),
          risk_score: Math.max(300, Math.min(850, this.normal(500, 100))),
          kyc_status: Math.random() < 0.85 ? "verified" : (Math.random() < 0.95 ? "pending" : "incomplete"),
          is_active: Math.random() < 0.9
        });
      }

      return customers;
    }

    generateAccounts(customers) {
      var accounts = [];
      var accountTypes = ["savings", "current", "fixed_deposit", "loan", "credit_card"];
      var currencies = ["INR", "USD", "EUR", "GBP"];
      var currencyWeights = [0.8, 0.1, 0.05, 0.05];
      var segmentMultiplier = { retail: 1, sme: 2, corporate: 3, hni: 4 };
      var accountCounter = 1;
      var i;
      var j;

      for (i = 0; i < customers.length; i++) {
        var multiplier = segmentMultiplier[customers[i].segment] || 1;
        var numAccounts = Math.max(1, Math.min(6, Math.round(this.poisson(2 * multiplier))));

        for (j = 0; j < numAccounts; j++) {
          var accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
          var minBal = this.getMinBalance(accountType);
          var maxBal = this.getMaxBalance(accountType);
          var currentBalance = this.uniform(minBal, maxBal);

          accounts.push({
            account_id: "ACC_" + String(accountCounter).padStart(8, "0"),
            customer_id: customers[i].customer_id,
            account_type: accountType,
            currency: this.weightedRandom(currencies, currencyWeights),
            current_balance: currentBalance,
            available_balance: currentBalance * (0.9 + Math.random() * 0.1),
            is_active: Math.random() < 0.95
          });
          accountCounter++;
        }
      }

      return accounts;
    }

    generateTransactions(accounts, count) {
      var transactions = [];
      var txnTypes = ["deposit", "withdrawal", "transfer", "payment", "interest"];
      var channels = ["atm", "branch", "online", "mobile", "pos"];
      var activeAccounts = accounts.filter(function(a) {
        return a.is_active;
      });
      var i;

      for (i = 0; i < count; i++) {
        var account = activeAccounts[Math.floor(Math.random() * activeAccounts.length)];
        var txnType = txnTypes[Math.floor(Math.random() * txnTypes.length)];
        var signedAmount = this.uniform(100, 50000);

        transactions.push({
          transaction_id: "TXN_" + String(i + 1).padStart(10, "0"),
          account_id: account.account_id,
          transaction_type: txnType,
          transaction_date: this.randomDate(),
          amount: signedAmount,
          currency: account.currency,
          channel: channels[Math.floor(Math.random() * channels.length)],
          status: Math.random() < 0.9 ? "completed" : (Math.random() < 0.95 ? "pending" : "failed")
        });
      }

      transactions.sort(function(a, b) {
        return new Date(a.transaction_date) - new Date(b.transaction_date);
      });
      return transactions;
    }

    generateLiquidityMetrics(accounts, transactions) {
      var self = this;
      return accounts.map(function(account) {
        var accountTxns = transactions.filter(function(t) {
          return t.account_id === account.account_id;
        });
        var available = account.available_balance;
        var ratioBase = Math.max(Math.abs(account.current_balance), 1);
        var riskScore = Math.max(1, Math.min(99, self.normal(50, 15)));
        return {
          account_id: account.account_id,
          current_balance: account.current_balance,
          available_balance: available,
          avg_daily_balance: account.current_balance,
          transaction_velocity: accountTxns.length / 90,
          liquidity_ratio: available / ratioBase,
          liquidity_risk_score: riskScore,
          stress_test_survival_days: self.uniform(30, 180)
        };
      });
    }

    updateKPIs() {
      var metricsLength = this.metrics.length || 1;
      var avgBalance = this.metrics.reduce(function(sum, metric) {
        return sum + metric.avg_daily_balance;
      }, 0) / metricsLength;
      var avgRatio = this.metrics.reduce(function(sum, metric) {
        return sum + metric.liquidity_ratio;
      }, 0) / metricsLength;
      var avgVelocity = this.metrics.reduce(function(sum, metric) {
        return sum + metric.transaction_velocity;
      }, 0) / metricsLength;
      var totalValue = this.transactions.reduce(function(sum, txn) {
        return sum + txn.amount;
      }, 0);

      document.getElementById("customersCount").textContent = this.customers.length.toLocaleString("en-IN");
      document.getElementById("accountsCount").textContent = this.accounts.length.toLocaleString("en-IN");
      document.getElementById("transactionsCount").textContent = this.transactions.length.toLocaleString("en-IN");
      document.getElementById("totalValue").textContent = formatCurrency(totalValue);
      document.getElementById("avgBalance").textContent = formatCurrency(avgBalance);
      document.getElementById("liquidityRatio").textContent = Math.round(avgRatio * 100) + "%";
      document.getElementById("velocity").textContent = avgVelocity.toFixed(2);
    }

    updateTables() {
      var custTbody = document.querySelector("#customersTable tbody");
      custTbody.innerHTML = this.customers.slice(0, 100).map(function(c) {
        return "<tr><td>" + c.customer_id + "</td><td>" + c.name + "</td><td>" + c.segment + "</td><td>" + formatCurrency(c.annual_income) + "</td><td>" + c.kyc_status + "</td></tr>";
      }).join("");

      var acctTbody = document.querySelector("#accountsTable tbody");
      acctTbody.innerHTML = this.accounts.slice(0, 100).map(function(a) {
        return "<tr><td>" + a.account_id + "</td><td>" + a.account_type + "</td><td>" + a.currency + "</td><td>" + formatCurrency(a.current_balance) + "</td><td>" + formatCurrency(a.available_balance) + "</td></tr>";
      }).join("");

      var txnTbody = document.querySelector("#transactionsTable tbody");
      txnTbody.innerHTML = this.transactions.slice(0, 100).map(function(t) {
        return "<tr><td>" + t.transaction_id + "</td><td>" + t.transaction_type + "</td><td>" + formatCurrency(t.amount) + "</td><td>" + t.channel + "</td><td>" + t.status + "</td></tr>";
      }).join("");

      var metricTbody = document.querySelector("#metricsTable tbody");
      metricTbody.innerHTML = this.metrics.slice(0, 100).map(function(m) {
        return "<tr><td>" + m.account_id + "</td><td>" + Math.round(m.liquidity_ratio * 100) + "%</td><td>" + Math.round(m.liquidity_risk_score) + "</td><td>" + Math.round(m.stress_test_survival_days) + "</td></tr>";
      }).join("");
    }

    updateStoryPanel() {
      var topSegmentEl = document.getElementById("topSegment");
      var topSegmentNoteEl = document.getElementById("topSegmentNote");
      var topAccountTypeEl = document.getElementById("topAccountType");
      var topAccountNoteEl = document.getElementById("topAccountNote");
      var attentionAreaEl = document.getElementById("attentionArea");
      var attentionNoteEl = document.getElementById("attentionNote");
      var storySummaryEl = document.getElementById("storySummary");

      if (!this.customers.length) {
        topSegmentEl.textContent = "Not generated";
        topSegmentNoteEl.textContent = "No customer mix yet.";
        topAccountTypeEl.textContent = "Not generated";
        topAccountNoteEl.textContent = "Generate data to compare deposit and credit-heavy books.";
        attentionAreaEl.textContent = "Awaiting simulation";
        attentionNoteEl.textContent = "Monte Carlo will highlight the required liquidity buffer.";
        storySummaryEl.textContent = "Generate a dataset to see customer mix, balance structure, and liquidity pressure points translated into a simple treasury narrative.";
        return;
      }

      var topSegment = this.topCustomerSegment();
      var topSegmentCount = this.customers.filter(function(customer) {
        return customer.segment === topSegment;
      }).length;
      var topSegmentPct = ((topSegmentCount / this.customers.length) * 100).toFixed(1);
      var topAccountType = this.topAccountType();
      var topAccountTypeCount = this.accounts.filter(function(account) {
        return account.account_type === topAccountType;
      }).length;
      var highRiskCount = this.metrics.filter(function(metric) {
        return metric.liquidity_risk_score > 65;
      }).length;
      var highRiskPct = this.metrics.length ? ((highRiskCount / this.metrics.length) * 100).toFixed(1) : "0.0";

      topSegmentEl.textContent = topSegment.toUpperCase();
      topSegmentNoteEl.textContent = topSegmentCount.toLocaleString("en-IN") + " customers, or " + topSegmentPct + "% of the book.";
      topAccountTypeEl.textContent = topAccountType.replace("_", " ").toUpperCase();
      topAccountNoteEl.textContent = topAccountTypeCount.toLocaleString("en-IN") + " accounts currently anchor the synthetic portfolio mix.";

      if (this.forecast) {
        attentionAreaEl.textContent = "Liquidity buffer";
        attentionNoteEl.textContent = "Recommended crisis buffer: " + formatCurrency(this.forecast.recommendedBuffer) + ".";
      } else {
        attentionAreaEl.textContent = highRiskPct + "% high risk";
        attentionNoteEl.textContent = "Account-level stress suggests " + highRiskCount.toLocaleString("en-IN") + " high-risk accounts deserve review.";
      }

      storySummaryEl.textContent =
        "This generated book is led by " + topSegment.toUpperCase() +
        " customers and leans most heavily on " + topAccountType.replace("_", " ") +
        " accounts, with " + highRiskPct + "% of accounts currently flagged as high liquidity risk.";
    }

    renderEmptyCharts() {
      document.getElementById("segmentChart").innerHTML = emptyState("Generate data to see the customer mix across retail, corporate, SME, and HNI segments.");
      document.getElementById("riskChart").innerHTML = emptyState("Generate data to see how account liquidity risk spreads across the portfolio.");
    }

    renderSegmentChart() {
      var segmentCounts = {};
      var total = this.customers.length;
      var colors = this.segmentColors;
      var labels;
      var currentAngle;

      if (!total) {
        this.renderEmptyCharts();
        return;
      }

      this.customers.forEach(function(customer) {
        segmentCounts[customer.segment] = (segmentCounts[customer.segment] || 0) + 1;
      });

      labels = Object.keys(segmentCounts);
      currentAngle = 0;
      var stops = labels.map(function(label, index) {
        var value = segmentCounts[label];
        var angle = total === 0 ? 0 : (value / total) * 360;
        var start = currentAngle;
        currentAngle += angle;
        return colors[index % colors.length] + " " + start.toFixed(2) + "deg " + currentAngle.toFixed(2) + "deg";
      });

      var legend = labels.map(function(label, index) {
        var value = segmentCounts[label];
        var pct = ((value / total) * 100).toFixed(1);
        return '<div class="legend-item"><span class="legend-label"><span class="swatch" style="background:' + colors[index % colors.length] + ';"></span><strong>' + label.toUpperCase() + '</strong></span><span>' + value.toLocaleString("en-IN") + " (" + pct + "%)</span></div>";
      }).join("");

      document.getElementById("segmentChart").innerHTML =
        '<div class="donut-layout">' +
          '<div class="donut-chart" style="background: conic-gradient(' + stops.join(", ") + ');">' +
            '<div class="donut-center"><strong>' + total.toLocaleString("en-IN") + '</strong><span>customers</span></div>' +
          "</div>" +
          '<div class="legend">' + legend + "</div>" +
        "</div>";
    }

    renderRiskChart() {
      var riskBins = { low: 0, medium: 0, high: 0 };
      var maxValue;

      if (!this.metrics.length) {
        document.getElementById("riskChart").innerHTML = emptyState("Generate data to evaluate account-level liquidity risk.");
        return;
      }

      this.metrics.forEach(function(metric) {
        if (metric.liquidity_risk_score < 35) {
          riskBins.low++;
        } else if (metric.liquidity_risk_score < 65) {
          riskBins.medium++;
        } else {
          riskBins.high++;
        }
      });

      maxValue = Math.max(riskBins.low, riskBins.medium, riskBins.high, 1);

      document.getElementById("riskChart").innerHTML =
        '<div class="bar-chart">' +
          this.riskRow("Low Risk", riskBins.low, maxValue, this.riskColors.low) +
          this.riskRow("Medium Risk", riskBins.medium, maxValue, this.riskColors.medium) +
          this.riskRow("High Risk", riskBins.high, maxValue, this.riskColors.high) +
        "</div>";
    }

    riskRow(label, value, maxValue, color) {
      var width = (value / maxValue) * 100;
      return '<div class="bar-row"><strong>' + label + '</strong><div class="bar-track"><div class="bar-fill" style="width:' + width.toFixed(2) + "%; background:" + color + ';"></div></div><span>' + value.toLocaleString("en-IN") + "</span></div>";
    }

    updateAIInsights() {
      var aiInsightEl = document.getElementById("aiInsight");
      var recommendationEl = document.getElementById("recommendationText");

      if (!this.aiEnabled || this.customers.length === 0) {
        aiInsightEl.style.display = "none";
        return;
      }

      aiInsightEl.style.display = "block";

      var highRiskCount = this.metrics.filter(function(metric) {
        return metric.liquidity_risk_score > 65;
      }).length;
      var highRiskPct = this.metrics.length ? (highRiskCount / this.metrics.length) * 100 : 0;
      var topSegment = this.topCustomerSegment();
      var fastestAccounts = this.metrics.filter(function(metric) {
        return metric.transaction_velocity > 1.5;
      }).length;
      var recommendations = [
        "AI Analysis: " + highRiskPct.toFixed(1) + "% of accounts are high risk. Review " + topSegment.toUpperCase() + " customers for concentration risk.",
        "Recommendation: " + fastestAccounts.toLocaleString("en-IN") + " accounts show elevated velocity. Consider dynamic cash pooling and intraday monitoring.",
        "Insight: Pair the current customer mix with stress survival days to prioritize liquidity buffers for volatile account types.",
        "Alert: High-risk accounts are best reviewed with segment, balance, and velocity together rather than risk score alone."
      ];

      recommendationEl.textContent = recommendations[Math.floor(Math.random() * recommendations.length)];
    }

    topCustomerSegment() {
      var counts = { retail: 0, corporate: 0, sme: 0, hni: 0 };
      this.customers.forEach(function(customer) {
        counts[customer.segment] = (counts[customer.segment] || 0) + 1;
      });
      return Object.keys(counts).sort(function(a, b) {
        return counts[b] - counts[a];
      })[0] || "retail";
    }

    topAccountType() {
      var counts = {};
      this.accounts.forEach(function(account) {
        counts[account.account_type] = (counts[account.account_type] || 0) + 1;
      });
      return Object.keys(counts).sort(function(a, b) {
        return counts[b] - counts[a];
      })[0] || "savings";
    }

    async runMonteCarlo() {
      if (this.transactions.length === 0) {
        this.updateRuntimeStatus("Generate data before running the forecast", "warning");
        this.updateSimulationPanel("Generate data first so the simulation has transaction flows to model.");
        return;
      }

      if (this.isSimulating) {
        return;
      }

      var initialCash = 15000000;
      var numSimulations = this.normalizeIterations(document.getElementById("numIterations").value);
      var delaySeconds = this.normalizeDelay(document.getElementById("simulationDelay").value);
      var forecastDays = 30;
      var dailyFlows = {};
      var flows;
      var meanFlow;
      var stdFlow;
      var simResults = [];
      var chunkSize = Math.min(100, Math.max(25, Math.round(numSimulations / 20)));
      var sim;

      this.transactions.forEach(function(txn) {
        var date = txn.transaction_date.split("T")[0];
        var signed = txn.transaction_type === "deposit" || txn.transaction_type === "interest" ? txn.amount : -txn.amount;
        dailyFlows[date] = (dailyFlows[date] || 0) + signed;
      });

      flows = Object.values(dailyFlows);
      meanFlow = flows.reduce(function(sum, value) {
        return sum + value;
      }, 0) / flows.length;
      stdFlow = Math.sqrt(flows.reduce(function(sum, value) {
        return sum + Math.pow(value - meanFlow, 2);
      }, 0) / flows.length);

      this.isSimulating = true;
      this.setSimulationButtonsDisabled(true);
      this.forecast = null;
      this.forecastDistribution = [];
      this.convergenceSeries = [];
      this.simulationClock = {
        startMs: Date.now(),
        elapsedMs: 0,
        completed: 0,
        total: numSimulations,
        forecastDays: forecastDays
      };
      this.updateSimulationPanel("Monte Carlo simulation is running. Progress updates will appear below as iterations complete.");
      this.updateRuntimeStatus("Monte Carlo simulation running...", "warning");
      this.updateProgress(0, numSimulations, "Running simulation with " + delaySeconds.toFixed(2) + "s teaching delay per update...");
      this.updateWorkEstimate();

      var runningTotal = 0;
      for (sim = 0; sim < numSimulations; sim++) {
        var cash = initialCash;
        var day;
        for (day = 0; day < forecastDays; day++) {
          cash += this.normal(meanFlow, stdFlow);
        }
        simResults.push(cash);
        runningTotal += cash;

        if ((sim + 1) % chunkSize === 0 || sim === numSimulations - 1) {
          this.convergenceSeries.push({
            iteration: sim + 1,
            mean: runningTotal / (sim + 1)
          });
          this.simulationClock.elapsedMs = Date.now() - this.simulationClock.startMs;
          this.simulationClock.completed = sim + 1;
          this.updateProgress(sim + 1, numSimulations, "Running simulation with " + delaySeconds.toFixed(2) + "s teaching delay per update...");
          this.updateWorkEstimate();
          this.renderConvergenceChart(true);
          await this.pauseForPaint(delaySeconds * 1000);
        }
      }

      var var5 = this.percentile(simResults, 5);
      var var95 = this.percentile(simResults, 95);
      var meanFinal = simResults.reduce(function(sum, value) {
        return sum + value;
      }, 0) / simResults.length;
      var recommendedBuffer = Math.max(0, initialCash - var5);
      var mostLikelyValue = this.findMostLikelyValue(simResults);

      this.forecast = {
        meanFinal: meanFinal,
        var5: var5,
        var95: var95,
        recommendedBuffer: recommendedBuffer,
        mostLikelyValue: mostLikelyValue,
        iterations: numSimulations
      };
      this.forecastDistribution = simResults;
      this.isSimulating = false;
      this.setSimulationButtonsDisabled(false);
      this.simulationClock.elapsedMs = Date.now() - this.simulationClock.startMs;
      this.simulationClock.completed = numSimulations;

      this.updateForecastPanel();
      this.updateStoryPanel();
      this.updateSimulationPanel();
      this.updateProgress(numSimulations, numSimulations, "Simulation complete");
      this.updateWorkEstimate();
      this.updateRuntimeStatus("Monte Carlo simulation completed locally", "success");
      document.getElementById("simulationPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    updateForecastPanel() {
      var narrativeEl = document.getElementById("forecastNarrative");
      var meanEl = document.getElementById("forecastMean");
      var var5El = document.getElementById("forecastVar5");
      var bufferEl = document.getElementById("forecastBuffer");
      var likelyEl = document.getElementById("forecastLikely");

      if (!this.forecast) {
        narrativeEl.textContent = "Generate a dataset first, then run the forecast to estimate 30-day liquidity outcomes.";
        meanEl.textContent = "Not run yet";
        var5El.textContent = "Not run yet";
        bufferEl.textContent = "Not run yet";
        likelyEl.textContent = "Not run yet";
        return;
      }

      narrativeEl.textContent =
        "Over " + this.forecast.iterations.toLocaleString("en-IN") + " simulations, the model projects a 30-day mean final cash position of " +
        formatCurrency(this.forecast.meanFinal) +
        " with a 95th percentile upside near " +
        formatCurrency(this.forecast.var95) +
        ".";
      meanEl.textContent = formatCurrency(this.forecast.meanFinal);
      var5El.textContent = formatCurrency(this.forecast.var5);
      bufferEl.textContent = formatCurrency(this.forecast.recommendedBuffer);
      likelyEl.textContent = formatCurrency(this.forecast.mostLikelyValue);
    }

    updateSimulationPanel(customMessage) {
      var badgeEl = document.getElementById("simulationBadge");
      var stateEl = document.getElementById("simulationState");
      var distributionEl = document.getElementById("distributionChart");
      var densityEl = document.getElementById("densityChart");
      var bufferNarrativeEl = document.getElementById("bufferNarrative");

      if (this.isSimulating) {
        badgeEl.textContent = "Simulation running";
        badgeEl.classList.add("is-running");
        stateEl.classList.remove("is-ready");
        stateEl.innerHTML = customMessage || "Monte Carlo simulation is currently running in your browser.";
        distributionEl.innerHTML = '<div class="chart-empty">Outcome bands will populate as soon as the current run finishes.</div>';
        densityEl.innerHTML = '<div class="chart-empty">The density curve will appear after the final iteration completes.</div>';
        this.renderConvergenceChart(true);
        bufferNarrativeEl.textContent = "Crunching the distribution to estimate the required buffer.";
        return;
      }

      badgeEl.classList.remove("is-running");

      if (!this.forecast) {
        badgeEl.textContent = this.transactions.length ? "Ready to simulate" : "Waiting for a run";
        stateEl.classList.remove("is-ready");
        stateEl.innerHTML = customMessage || "Click <strong>Run Monte Carlo Simulation</strong> after generating data. The results will appear here and this panel will jump into view automatically.";
        distributionEl.innerHTML = '<div class="chart-empty">Run the simulation to see the spread of 100 forecast outcomes across worst-case, base-case, and upside bands.</div>';
        densityEl.innerHTML = '<div class="chart-empty">Run the simulation to draw the outcome distribution and identify the most likely terminal value.</div>';
        document.getElementById("convergenceChart").innerHTML = '<div class="chart-empty">The convergence line will update while the simulation is running.</div>';
        bufferNarrativeEl.textContent = "No liquidity buffer recommendation yet.";
        return;
      }

      badgeEl.textContent = "Simulation complete";
      stateEl.classList.add("is-ready");
      stateEl.innerHTML =
        "<strong>Result:</strong> " + this.forecast.iterations.toLocaleString("en-IN") + " local Monte Carlo paths were simulated over 30 days. " +
        "The book trends toward a mean terminal cash position of " + formatCurrency(this.forecast.meanFinal) +
        ", a most likely outcome near " + formatCurrency(this.forecast.mostLikelyValue) +
        ", and a stressed 5% downside of " + formatCurrency(this.forecast.var5) + ".";
      this.renderDistributionChart();
      this.renderDensityChart();
      this.renderConvergenceChart(false);
      bufferNarrativeEl.textContent =
        "To remain resilient in the stressed tail, hold approximately " +
        formatCurrency(this.forecast.recommendedBuffer) +
        " as a minimum liquidity buffer above today's opening cash assumption.";
    }

    renderDistributionChart() {
      var distributionEl = document.getElementById("distributionChart");
      if (!this.forecastDistribution.length) {
        distributionEl.innerHTML = '<div class="chart-empty">No distribution available yet.</div>';
        return;
      }

      var low = this.forecastDistribution.filter(function(value) {
        return value <= 0;
      }).length;
      var moderate = this.forecastDistribution.filter(function(value) {
        return value > 0 && value <= 15000000;
      }).length;
      var strong = this.forecastDistribution.filter(function(value) {
        return value > 15000000;
      }).length;
      var maxCount = Math.max(low, moderate, strong, 1);

      distributionEl.innerHTML =
        this.distributionRow("Stress tail", low, maxCount) +
        this.distributionRow("Base range", moderate, maxCount) +
        this.distributionRow("Upside tail", strong, maxCount);
    }

    renderDensityChart() {
      var densityEl = document.getElementById("densityChart");
      if (!this.forecastDistribution.length) {
        densityEl.innerHTML = '<div class="chart-empty">No density chart available yet.</div>';
        return;
      }

      var bins = this.buildHistogramBins(this.forecastDistribution, 12);
      var points = bins.map(function(bin) {
        return { x: bin.center, y: bin.count };
      });
      densityEl.innerHTML = this.renderLineAreaSvg(points, this.forecast.meanFinal, "Density");
    }

    renderConvergenceChart(isRunning) {
      var chartEl = document.getElementById("convergenceChart");
      if (!this.convergenceSeries.length) {
        chartEl.innerHTML = '<div class="chart-empty">The convergence line will update while the simulation is running.</div>';
        return;
      }

      chartEl.innerHTML = this.renderLineAreaSvg(this.convergenceSeries.map(function(point) {
        return { x: point.iteration, y: point.mean };
      }), null, isRunning ? "Running mean" : "Final convergence", true);
    }

    renderLineAreaSvg(points, markerValue, yTitle, useConvergenceStyle) {
      var width = 640;
      var height = 220;
      var padLeft = 52;
      var padRight = 18;
      var padTop = 18;
      var padBottom = 34;
      var xs = points.map(function(point) { return point.x; });
      var ys = points.map(function(point) { return point.y; });
      var minX = Math.min.apply(null, xs);
      var maxX = Math.max.apply(null, xs);
      var minY = Math.min.apply(null, ys);
      var maxY = Math.max.apply(null, ys);
      if (minY === maxY) {
        minY -= 1;
        maxY += 1;
      }

      function scaleX(value) {
        return padLeft + ((value - minX) / Math.max(maxX - minX, 1)) * (width - padLeft - padRight);
      }

      function scaleY(value) {
        return height - padBottom - ((value - minY) / Math.max(maxY - minY, 1)) * (height - padTop - padBottom);
      }

      var linePath = points.map(function(point, index) {
        return (index === 0 ? "M" : "L") + scaleX(point.x).toFixed(2) + " " + scaleY(point.y).toFixed(2);
      }).join(" ");
      var areaPath = linePath + " L " + scaleX(points[points.length - 1].x).toFixed(2) + " " + (height - padBottom) + " L " + scaleX(points[0].x).toFixed(2) + " " + (height - padBottom) + " Z";
      var gridLines = [0.25, 0.5, 0.75].map(function(ratio) {
        var y = padTop + ratio * (height - padTop - padBottom);
        return '<line class="chart-grid" x1="' + padLeft + '" y1="' + y.toFixed(2) + '" x2="' + (width - padRight) + '" y2="' + y.toFixed(2) + '"></line>';
      }).join("");
      var marker = "";
      if (markerValue !== null && markerValue !== undefined) {
        var markerX = scaleX(markerValue);
        marker = '<line class="mean-marker" x1="' + markerX.toFixed(2) + '" y1="' + padTop + '" x2="' + markerX.toFixed(2) + '" y2="' + (height - padBottom) + '"></line>';
      }
      var lineClass = useConvergenceStyle ? "convergence-stroke" : "curve-stroke";
      var fillClass = useConvergenceStyle ? "convergence-fill" : "curve-fill";
      var leftLabel = formatCurrency(maxY);
      var bottomLeft = useConvergenceStyle ? "1" : formatCurrency(minX);
      var bottomRight = useConvergenceStyle ? points[points.length - 1].x.toLocaleString("en-IN") : formatCurrency(maxX);

      return '' +
        '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + yTitle + ' chart">' +
          gridLines +
          '<line class="chart-axis" x1="' + padLeft + '" y1="' + padTop + '" x2="' + padLeft + '" y2="' + (height - padBottom) + '"></line>' +
          '<line class="chart-axis" x1="' + padLeft + '" y1="' + (height - padBottom) + '" x2="' + (width - padRight) + '" y2="' + (height - padBottom) + '"></line>' +
          '<path class="' + fillClass + '" d="' + areaPath + '"></path>' +
          '<path class="' + lineClass + '" d="' + linePath + '"></path>' +
          marker +
          '<text class="chart-label" x="' + padLeft + '" y="12">' + leftLabel + '</text>' +
          '<text class="chart-label" x="' + padLeft + '" y="' + (height - 10) + '">' + bottomLeft + '</text>' +
          '<text class="chart-label" x="' + (width - padRight) + '" y="' + (height - 10) + '" text-anchor="end">' + bottomRight + '</text>' +
        '</svg>';
    }

    distributionRow(label, value, maxCount) {
      var pct = (value / maxCount) * 100;
      return '<div class="distribution-row"><strong>' + label + '</strong><div class="distribution-track"><div class="distribution-fill" style="width:' + pct.toFixed(2) + '%;"></div></div><span>' + value + " runs</span></div>";
    }

    buildHistogramBins(values, binCount) {
      var min = Math.min.apply(null, values);
      var max = Math.max.apply(null, values);
      var width = Math.max((max - min) / binCount, 1);
      var bins = [];
      var i;

      for (i = 0; i < binCount; i++) {
        bins.push({
          start: min + i * width,
          end: i === binCount - 1 ? max : min + (i + 1) * width,
          center: min + (i + 0.5) * width,
          count: 0
        });
      }

      values.forEach(function(value) {
        var index = Math.min(binCount - 1, Math.floor((value - min) / width));
        bins[index].count += 1;
      });

      return bins;
    }

    findMostLikelyValue(values) {
      var bins = this.buildHistogramBins(values, 20);
      return bins.sort(function(a, b) {
        return b.count - a.count;
      })[0].center;
    }

    normalizeIterations(rawValue) {
      var parsed = parseInt(rawValue, 10);
      if (isNaN(parsed)) {
        parsed = 1000;
      }
      parsed = Math.max(100, Math.min(10000, parsed));
      parsed = Math.round(parsed / 100) * 100;
      return parsed;
    }

    normalizeDelay(rawValue) {
      var parsed = parseFloat(rawValue);
      if (isNaN(parsed)) {
        parsed = 0.01;
      }
      parsed = Math.max(0, Math.min(0.25, parsed));
      return Math.round(parsed * 100) / 100;
    }

    updateProgress(completed, total, label) {
      var pct = total > 0 ? (completed / total) * 100 : 0;
      document.getElementById("progressLabel").textContent = label;
      document.getElementById("progressCount").textContent = total > 0
        ? completed.toLocaleString("en-IN") + " / " + total.toLocaleString("en-IN")
        : "0 / 0";
      document.getElementById("progressFill").style.width = pct.toFixed(2) + "%";
    }

    updateWorkEstimate() {
      var iterations = this.isSimulating
        ? this.simulationClock.total
        : this.normalizeIterations(document.getElementById("numIterations").value);
      var forecastDays = this.simulationClock.forecastDays || 30;
      var totalSteps = iterations * forecastDays;
      var elapsedSeconds = (this.simulationClock.elapsedMs || 0) / 1000;
      var throughput = elapsedSeconds > 0
        ? (this.simulationClock.completed / elapsedSeconds)
        : 0;

      document.getElementById("workFormula").textContent = iterations.toLocaleString("en-IN") + " × " + forecastDays + " days";
      document.getElementById("totalWork").textContent = totalSteps.toLocaleString("en-IN");
      document.getElementById("elapsedTime").textContent = elapsedSeconds.toFixed(2) + "s";
      document.getElementById("throughput").textContent = throughput > 0
        ? Math.round(throughput).toLocaleString("en-IN") + " iterations/s"
        : "0 iterations/s";
    }

    setSimulationButtonsDisabled(disabled) {
      document.getElementById("forecastBtn").disabled = disabled;
      document.getElementById("generateBtn").disabled = disabled;
      document.getElementById("resetBtn").disabled = disabled;
      document.getElementById("exportBtn").disabled = disabled;
      document.getElementById("numIterations").disabled = disabled;
    }

    pauseForPaint(delayMs) {
      return new Promise(function(resolve) {
        setTimeout(resolve, Math.max(0, delayMs || 0));
      });
    }

    exportData() {
      if (this.customers.length === 0) {
        this.updateRuntimeStatus("Generate data before exporting", "warning");
        return;
      }

      var sections = [
        {
          title: "CUSTOMERS",
          headers: ["customer_id", "name", "segment", "annual_income", "risk_score", "kyc_status", "is_active"],
          rows: this.customers.map(function(customer) {
            return [customer.customer_id, customer.name, customer.segment, customer.annual_income, customer.risk_score, customer.kyc_status, customer.is_active];
          })
        },
        {
          title: "ACCOUNTS",
          headers: ["account_id", "customer_id", "account_type", "currency", "current_balance", "available_balance", "is_active"],
          rows: this.accounts.map(function(account) {
            return [account.account_id, account.customer_id, account.account_type, account.currency, account.current_balance, account.available_balance, account.is_active];
          })
        },
        {
          title: "TRANSACTIONS",
          headers: ["transaction_id", "account_id", "transaction_type", "transaction_date", "amount", "currency", "channel", "status"],
          rows: this.transactions.map(function(txn) {
            return [txn.transaction_id, txn.account_id, txn.transaction_type, txn.transaction_date, txn.amount, txn.currency, txn.channel, txn.status];
          })
        },
        {
          title: "LIQUIDITY_METRICS",
          headers: ["account_id", "current_balance", "available_balance", "avg_daily_balance", "transaction_velocity", "liquidity_ratio", "liquidity_risk_score", "stress_test_survival_days"],
          rows: this.metrics.map(function(metric) {
            return [metric.account_id, metric.current_balance, metric.available_balance, metric.avg_daily_balance, metric.transaction_velocity, metric.liquidity_ratio, metric.liquidity_risk_score, metric.stress_test_survival_days];
          })
        }
      ];

      var csv = sections.map(function(section) {
        var lines = ["=== " + section.title + " ===", section.headers.join(",")];
        section.rows.forEach(function(row) {
          lines.push(row.map(function(value) {
            var text = String(value).replace(/"/g, '""');
            return /[",\n]/.test(text) ? '"' + text + '"' : text;
          }).join(","));
        });
        return lines.join("\n");
      }).join("\n\n");

      var blob = new Blob([csv], { type: "text/csv" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "mesa_liquidity_data.csv";
      link.click();
      URL.revokeObjectURL(url);

      this.updateRuntimeStatus("CSV exported without leaving the browser", "success");
    }

    resetData() {
      this.customers = [];
      this.accounts = [];
      this.transactions = [];
      this.metrics = [];
      this.forecast = null;
      this.forecastDistribution = [];
      this.convergenceSeries = [];
      document.getElementById("customersCount").textContent = "0";
      document.getElementById("accountsCount").textContent = "0";
      document.getElementById("transactionsCount").textContent = "0";
      document.getElementById("totalValue").textContent = "₹0";
      document.getElementById("avgBalance").textContent = "₹0";
      document.getElementById("liquidityRatio").textContent = "0%";
      document.getElementById("velocity").textContent = "0.00";
      document.querySelectorAll("tbody").forEach(function(tbody) {
        tbody.innerHTML = "";
      });
      this.renderEmptyCharts();
      this.updateStoryPanel();
      this.updateForecastPanel();
      this.updateSimulationPanel();
      this.updateProgress(0, 0, "No simulation running");
      this.simulationClock = { startMs: null, elapsedMs: 0, completed: 0, total: 0, forecastDays: 30 };
      this.updateWorkEstimate();
      this.updateAIInsights();
      this.updateRuntimeStatus("State cleared. Ready for another local run");
    }

    updateRuntimeStatus(message, tone) {
      var statusEl = document.getElementById("runtimeStatus");
      statusEl.textContent = message;
      statusEl.classList.remove("is-warning", "is-success");
      if (tone === "warning") {
        statusEl.classList.add("is-warning");
      } else if (tone === "success") {
        statusEl.classList.add("is-success");
      }
    }

    weightedRandom(items, weights) {
      var total = weights.reduce(function(sum, weight) {
        return sum + weight;
      }, 0);
      var r = Math.random() * total;
      var i;
      for (i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) {
          return items[i];
        }
      }
      return items[items.length - 1];
    }

    normal(mean, std) {
      var u1 = Math.max(Math.random(), Number.EPSILON);
      var u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * std + mean;
    }

    logNormal(mean, std) {
      return Math.exp(this.normal(mean, std));
    }

    poisson(lambda) {
      var limit = Math.exp(-lambda);
      var k = 0;
      var p = 1;
      do {
        k++;
        p *= Math.random();
      } while (p > limit);
      return k - 1;
    }

    uniform(min, max) {
      return Math.random() * (max - min) + min;
    }

    randomDate() {
      var start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      var end = new Date();
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0];
    }

    percentile(arr, p) {
      var sorted = arr.slice().sort(function(a, b) {
        return a - b;
      });
      return sorted[Math.floor((p / 100) * (sorted.length - 1))];
    }

    fakeName() {
      var first = ["Raj", "Priya", "Amit", "Neha", "Suresh", "Kavita", "Rohan", "Anita", "Vikram", "Pooja"];
      var last = ["Sharma", "Patel", "Kumar", "Desai", "Reddy", "Menon", "Singh", "Iyer", "Gupta", "Mehta"];
      return first[Math.floor(Math.random() * first.length)] + " " + last[Math.floor(Math.random() * last.length)];
    }

    getMinBalance(type) {
      var ranges = { savings: 1000, current: 5000, fixed_deposit: 10000, loan: -1000000, credit_card: -100000 };
      return ranges[type] || 1000;
    }

    getMaxBalance(type) {
      var ranges = { savings: 500000, current: 10000000, fixed_deposit: 5000000, loan: -10000, credit_card: 50000 };
      return ranges[type] || 100000;
    }
  }

  window.MesaLiquidityGenerator = MesaLiquidityGenerator;

  document.addEventListener("DOMContentLoaded", function() {
    window.mesaApp = new MesaLiquidityGenerator();
  });
})();
