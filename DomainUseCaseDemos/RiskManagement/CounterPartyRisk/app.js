// Counter Party Risk - CVA Calculation Demo

class CounterPartyRisk {
  constructor() {
    this.ratingOrder = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC'];
    this.creditRatings = {
      AAA: { pd: 0.001, lgd: 0.4 },
      AA: { pd: 0.002, lgd: 0.45 },
      A: { pd: 0.005, lgd: 0.5 },
      BBB: { pd: 0.012, lgd: 0.55 },
      BB: { pd: 0.035, lgd: 0.6 },
      B: { pd: 0.08, lgd: 0.65 },
      CCC: { pd: 0.15, lgd: 0.7 }
    };

    this.init();
  }

  init() {
    document.getElementById('credit-rating').addEventListener('change', () => this.calculate());
    ['notional', 'maturity', 'collateral'].forEach(id => {
      document.getElementById(id).addEventListener('input', (e) => {
        document.getElementById(`${id}-val`).textContent = e.target.value;
        this.calculate();
      });
    });

    const downgradeBtn = document.getElementById('downgrade-btn');
    if (downgradeBtn) downgradeBtn.addEventListener('click', () => this.simulateDowngrade());

    this.calculate();
  }

  netCvaFor(rating, notional, collateral) {
    const { pd, lgd } = this.creditRatings[rating];
    const avgExposure = notional * 0.52;
    const cva = avgExposure * pd * lgd * (1 - collateral);
    return cva;
  }

  calculate() {
    const rating = document.getElementById('credit-rating').value;
    const notional = parseInt(document.getElementById('notional').value) * 100000;
    const collateral = parseInt(document.getElementById('collateral').value) / 100;

    const { pd, lgd } = this.creditRatings[rating];

    // Simplified CVA calculation
    const avgExposure = notional * 0.52;
    const cva = avgExposure * pd * lgd * (1 - collateral);

    // Update UI
    document.getElementById('pd').textContent = (pd * 100).toFixed(2) + '%';
    document.getElementById('lgd').textContent = (lgd * 100).toFixed(0) + '%';
    document.getElementById('exposure').textContent = '$' + (avgExposure / 1000000).toFixed(1) + 'M';
    document.getElementById('cva').textContent = '$' + (cva / 1000).toFixed(0) + 'K';
    document.getElementById('mortgage').textContent = '$' + (cva / 1000).toFixed(0) + 'K';
    document.getElementById('collateral-impact').textContent = '-$' + ((cva * collateral) / 1000).toFixed(0) + 'K';
    document.getElementById('net-cva').textContent = '$' + ((cva * (1 - collateral)) / 1000).toFixed(0) + 'K';

    // Clear any stale downgrade comparison once inputs change
    const resultBox = document.getElementById('downgrade-result');
    if (resultBox) resultBox.textContent = 'Not yet simulated for the current rating and collateral level.';
  }

  simulateDowngrade() {
    const rating = document.getElementById('credit-rating').value;
    const notional = parseInt(document.getElementById('notional').value) * 100000;
    const collateral = parseInt(document.getElementById('collateral').value) / 100;

    const currentIndex = this.ratingOrder.indexOf(rating);
    const nextIndex = Math.min(currentIndex + 1, this.ratingOrder.length - 1);
    const nextRating = this.ratingOrder[nextIndex];

    const beforeCva = this.netCvaFor(rating, notional, collateral);
    const afterCva = this.netCvaFor(nextRating, notional, collateral);
    const delta = afterCva - beforeCva;
    const pctChange = beforeCva > 0 ? (delta / beforeCva) * 100 : 0;

    const resultBox = document.getElementById('downgrade-result');
    if (!resultBox) return;

    if (nextIndex === currentIndex) {
      resultBox.textContent = `${rating} is already the lowest rating modeled here (CCC) — there is no further notch to downgrade to.`;
      return;
    }

    resultBox.innerHTML = `
      <strong>${rating} → ${nextRating} (one-notch downgrade):</strong>
      Net CVA moves from $${(beforeCva * (1 - collateral) / 1000).toFixed(0)}K to $${(afterCva * (1 - collateral) / 1000).toFixed(0)}K
      — a $${(delta * (1 - collateral) / 1000).toFixed(0)}K (${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(0)}%) change,
      at the same ${(collateral * 100).toFixed(0)}% collateral level. This is the rating-transition risk collateral only partly offsets.
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CounterPartyRisk();
});
