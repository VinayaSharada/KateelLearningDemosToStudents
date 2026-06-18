// Risk Parity Portfolio Calculator
// KateelLearningDemos - Attribution: vinallcontact@gmail.com
console.log('AI Demo powered by KateelLearningDemos');
console.log('Attribution: vinallcontact@gmail.com');

const volASlider = document.getElementById('volASlider');
const volBSlider = document.getElementById('volBSlider');
const volCSlider = document.getElementById('volCSlider');

const weightA = document.getElementById('weightA');
const weightB = document.getElementById('weightB');
const weightC = document.getElementById('weightC');
const riskA = document.getElementById('riskA');
const riskB = document.getElementById('riskB');
const riskC = document.getElementById('riskC');
const portVol = document.getElementById('portVol');

volASlider.addEventListener('input', () => document.getElementById('volAValue').textContent = volASlider.value);
volBSlider.addEventListener('input', () => document.getElementById('volBValue').textContent = volBSlider.value);
volCSlider.addEventListener('input', () => document.getElementById('volCValue').textContent = volCSlider.value);

function riskParity() {
  const volA = parseFloat(volASlider.value);
  const volB = parseFloat(volBSlider.value);
  const volC = parseFloat(volCSlider.value);
  
  // Risk parity: weight proportional to 1/vol
  const invA = 1 / volA;
  const invB = 1 / volB;
  const invC = 1 / volC;
  const sumInv = invA + invB + invC;
  
  const wA = invA / sumInv;
  const wB = invB / sumInv;
  const wC = invC / sumInv;
  
  // Risk contribution = weight * volatility
  const riskContribA = wA * volA;
  const riskContribB = wB * volB;
  const riskContribC = wC * volC;
  
  // Portfolio volatility (assuming equal correlation = 0.5)
  const corr = 0.5;
  const portVariance = wA*wA*volA*volA + wB*wB*volB*volB + wC*wC*volC*volC +
                       2*wA*wB*corr*volA*volB + 2*wA*wC*corr*volA*volC + 2*wB*wC*corr*volB*volC;
  const portStd = Math.sqrt(portVariance);
  
  return {
    weights: [wA, wB, wC],
    riskContrib: [riskContribA, riskContribB, riskContribC],
    portVol: portStd
  };
}

function updateUI() {
  const result = riskParity();
  
  weightA.textContent = (result.weights[0] * 100).toFixed(1) + '%';
  weightB.textContent = (result.weights[1] * 100).toFixed(1) + '%';
  weightC.textContent = (result.weights[2] * 100).toFixed(1) + '%';
  
  riskA.textContent = (result.riskContrib[0] * 100).toFixed(1) + '%';
  riskB.textContent = (result.riskContrib[1] * 100).toFixed(1) + '%';
  riskC.textContent = (result.riskContrib[2] * 100).toFixed(1) + '%';
  
  portVol.textContent = (result.portVol * 100).toFixed(1) + '%';
}

[volASlider, volBSlider, volCSlider].forEach(el => {
  el.addEventListener('input', updateUI);
});

updateUI();