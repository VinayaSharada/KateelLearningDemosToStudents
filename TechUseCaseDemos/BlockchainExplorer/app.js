// Main Application - Tab Navigation and Event Handlers

document.addEventListener('DOMContentLoaded', () => {
  setupTabNavigation();
  setupBitcoinHandlers();
  setupEthereumHandlers();
  setupContractHandlers();
  setupNFTHandlers();
});

// ============ Tab Navigation ============
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      // Hide all tabs
      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      // Remove active class from all buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });

      // Show selected tab
      document.getElementById(`${tabName}-tab`).classList.add('active');
      button.classList.add('active');
    });
  });
}

// ============ Bitcoin Section Handlers ============
function setupBitcoinHandlers() {
  const startMiningBtn = document.getElementById('startMining');
  const resetBlockBtn = document.getElementById('resetBlock');
  const incrementNonceBtn = document.getElementById('incrementNonce');
  const decrementNonceBtn = document.getElementById('decrementNonce');
  const addTransactionBtn = document.getElementById('addTransaction');

  let miningInProgress = false;

  startMiningBtn?.addEventListener('click', () => {
    if (miningInProgress) return;

    miningInProgress = true;
    startMiningBtn.textContent = '⏸️ Mining...';
    startMiningBtn.disabled = true;

    document.getElementById('miningStats').style.display = 'block';
    const startTime = Date.now();
    let hashCount = 0;

    BitcoinModule.startMining(
      (progress) => {
        // Update UI with progress
        document.getElementById('hashCount').textContent = progress.hashesComputed.toLocaleString();
        document.getElementById('timeElapsed').textContent = progress.timeElapsed.toFixed(1) + 's';
        document.getElementById('blockHash').textContent = progress.currentHash || '...';

        if (progress.hashesComputed > 0) {
          const rate = (progress.hashesComputed / progress.timeElapsed).toFixed(0);
          document.getElementById('hashRate').textContent = rate + ' hashes/sec';
        }
      },
      (result) => {
        // Mining complete
        miningInProgress = false;
        startMiningBtn.textContent = '⛏️ Start Mining';
        startMiningBtn.disabled = false;
        document.getElementById('difficultyMatch').style.display = 'block';

        document.getElementById('nonce').value = result.nonce;
        document.getElementById('blockHash').textContent = result.hash;
        document.getElementById('hashCount').textContent = result.hashesComputed.toLocaleString();
        document.getElementById('timeElapsed').textContent = result.timeElapsed.toFixed(2) + 's';
        document.getElementById('hashRate').textContent = result.hashRate + ' hashes/sec';
      }
    );
  });

  resetBlockBtn?.addEventListener('click', () => {
    BitcoinModule.stopMining();
    BitcoinModule.resetBlock();
    document.getElementById('nonce').value = '0';
    document.getElementById('blockHash').textContent = '0000...0000';
    document.getElementById('miningStats').style.display = 'none';
    document.getElementById('difficultyMatch').style.display = 'none';
    document.getElementById('transactions').innerHTML = '';
    document.getElementById('merkleTreeViz').innerHTML = '<p class="placeholder">Add transactions to visualize merkle tree...</p>';
  });

  // Nonce controls
  incrementNonceBtn?.addEventListener('click', () => {
    const nonce = parseInt(document.getElementById('nonce').value) || 0;
    document.getElementById('nonce').value = nonce + 1;
    updateBitcoinHash();
  });

  decrementNonceBtn?.addEventListener('click', () => {
    const nonce = parseInt(document.getElementById('nonce').value) || 0;
    if (nonce > 0) {
      document.getElementById('nonce').value = nonce - 1;
      updateBitcoinHash();
    }
  });

  // Nonce input listener
  document.getElementById('nonce')?.addEventListener('change', updateBitcoinHash);

  // Difficulty input listener
  document.getElementById('difficulty')?.addEventListener('change', (e) => {
    BitcoinModule.setDifficulty(parseInt(e.target.value) || 2);
    updateBitcoinHash();
  });

  // Add transaction
  addTransactionBtn?.addEventListener('click', () => {
    const txInput = document.getElementById('newTransaction');
    const txData = txInput.value.trim();

    if (!txData) {
      alert('Enter transaction data');
      return;
    }

    BitcoinModule.addTransaction(txData);
    txInput.value = '';
    updateMerkleTree();
    updateBitcoinHash();

    // Update transaction list
    const transactions = BitcoinModule.getTransactions();
    const txList = document.getElementById('transactions');
    txList.innerHTML = '';

    transactions.forEach((tx, idx) => {
      const div = document.createElement('div');
      div.className = 'tx-item';
      div.innerHTML = `
        <div class="tx-index">TX #${idx}</div>
        <div class="tx-data">${tx.data.substring(0, 50)}...</div>
        <div class="tx-hash" title="${tx.hash}"><code>${tx.hash.substring(0, 20)}...</code></div>
      `;
      txList.appendChild(div);
    });
  });

  // Update Merkle Root display
  const updateMerkleRoot = () => {
    const block = BitcoinModule.getCurrentBlock();
    document.getElementById('merkleRoot').value = block.merkleRoot || '0000...0000';
  };

  const updateMerkleTree = () => {
    const merkleData = BitcoinModule.getMerkleTree();
    const viz = document.getElementById('merkleTreeViz');
    viz.innerHTML = BitcoinModule.visualizeMerkleTree(merkleData);
    updateMerkleRoot();
  };
}

function updateBitcoinHash() {
  const nonce = parseInt(document.getElementById('nonce').value) || 0;
  BitcoinModule.setNonce(nonce);

  const result = BitcoinModule.updateBlockHash();
  document.getElementById('blockHash').textContent = result.hash;

  if (result.isValid) {
    document.getElementById('hashStatus').innerHTML = `
      ✓ Valid! Hash meets difficulty target (${result.difficulty} leading zeros)
    `;
    document.getElementById('hashStatus').style.color = '#10b981';
  } else {
    document.getElementById('hashStatus').innerHTML = `
      ✗ Not yet valid for difficulty ${result.difficulty}. Need ${result.difficulty} leading zeros.
    `;
    document.getElementById('hashStatus').style.color = '#ef4444';
  }
}

// ============ Ethereum Section Handlers ============
function setupEthereumHandlers() {
  const txTypeSelect = document.getElementById('txType');
  const gasPriceInput = document.getElementById('gasPrice');

  const updateGasCost = () => {
    const txType = txTypeSelect?.value || 'transfer';
    const gasPrice = parseInt(gasPriceInput?.value) || 20;

    const cost = EthereumModule.calculateGasCost(txType, gasPrice);

    document.getElementById('gasLimit').textContent = cost.gasLimit.toLocaleString();
    document.getElementById('gasPriceDisplay').textContent = cost.gasPrice + ' gwei';
    document.getElementById('totalCost').textContent = `${cost.totalEth} ETH ($${cost.totalUSD})`;
  };

  txTypeSelect?.addEventListener('change', updateGasCost);
  gasPriceInput?.addEventListener('input', updateGasCost);

  // Initial calculation
  updateGasCost();
}

// ============ Smart Contracts Section Handlers ============
function setupContractHandlers() {
  const disassembleBtn = document.getElementById('disassembleBytecode');
  const functionSelect = document.getElementById('functionSelect');
  const executeBtn = document.getElementById('executeFunction');

  disassembleBtn?.addEventListener('click', () => {
    const bytecode = '6080604052600180553480156200001657600080fd5b50620001f8806200002a6000396000f3fe60806040';
    const instructions = ContractsModule.disassembleBytecode(bytecode);

    const opcodePanel = document.getElementById('opcodePanel');
    const opcodeBody = document.getElementById('opcodeBody');

    opcodeBody.innerHTML = '';

    instructions.forEach(instr => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${instr.pc.toString().padStart(2, '0')}</td>
        <td><code>${instr.name}</code></td>
        <td>${instr.gas}</td>
        <td>${instr.description}</td>
      `;
      opcodeBody.appendChild(row);
    });

    opcodePanel.style.display = 'block';
  });

  executeBtn?.addEventListener('click', () => {
    const functionName = functionSelect?.value || 'constructor';
    const contractName = 'simpleToken';

    // Simulate function execution
    let params = [];
    switch (functionName) {
      case 'transfer':
        params = ['0x0987654321098765432109876543210987654321', 100];
        break;
      case 'approve':
        params = ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 500];
        break;
    }

    const result = ContractsModule.executeContractFunction(contractName, functionName, params);

    const outputDiv = document.getElementById('executionOutput');
    const stateChangesBody = document.querySelector('#stateChanges tbody');

    stateChangesBody.innerHTML = '';

    if (result.stateChanges) {
      result.stateChanges.forEach(change => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><code>${change.variable}</code></td>
          <td><code>${change.before}</code></td>
          <td><code>${change.after}</code></td>
        `;
        stateChangesBody.appendChild(row);
      });
    }

    outputDiv.style.display = 'block';
  });
}

// ============ NFT Section Handlers ============
function setupNFTHandlers() {
  const mintBtn = document.getElementById('mintNFT');
  const calculateBtn = document.getElementById('calculateRoyalties');

  mintBtn?.addEventListener('click', () => {
    const name = document.getElementById('nftName').value || 'Unnamed NFT';
    const description = document.getElementById('nftDescription').value || 'A unique token';
    const color = document.getElementById('nftColor').value;

    const imageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='${encodeURIComponent(color)}' width='400' height='400'/%3E%3C/svg%3E`;

    const nft = NFTModule.mintNFT(name, description, imageUrl, [
      { trait_type: 'Color', value: color },
      { trait_type: 'Rarity', value: 'Unique' }
    ]);

    // Display metadata
    const metadata = document.getElementById('nftMetadata');
    metadata.textContent = JSON.stringify(nft, null, 2);

    // Display preview
    const preview = document.getElementById('nftPreview');
    preview.innerHTML = `
      <div class="nft-preview-content">
        <div class="nft-image" style="background-color: ${color}; width: 200px; height: 200px;"></div>
        <h4>${nft.name}</h4>
        <p>${nft.description}</p>
        <p><small>Token ID: #${nft.tokenId}</small></p>
      </div>
    `;

    document.getElementById('nftOutput').style.display = 'block';
  });

  calculateBtn?.addEventListener('click', () => {
    const floorPrice = parseFloat(document.getElementById('floorPrice').value) || 5;
    const royaltyPercent = parseInt(document.getElementById('royaltyPercent').value) || 10;

    const royalties = NFTModule.calculateRoyalties(floorPrice, royaltyPercent);

    document.getElementById('sellerAmount').textContent = royalties.sellerAmount.toFixed(4) + ' ETH';
    document.getElementById('royaltyAmount').textContent = royalties.creatorRoyalty.toFixed(4) + ' ETH';
    document.getElementById('platformFee').textContent = royalties.platformFee.toFixed(4) + ' ETH';

    document.getElementById('royaltyOutput').style.display = 'block';
  });
}

// ============ Utility: Format Numbers ============
function formatNumber(num) {
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

// ============ Utility: Copy to Clipboard ============
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert('Copied to clipboard!');
}
