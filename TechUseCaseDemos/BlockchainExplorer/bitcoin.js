// Bitcoin Module - Block Structure, Mining, and Merkle Trees

const BitcoinModule = (() => {
  let currentBlock = {
    version: '00000004',
    prevBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
    merkleRoot: '0000000000000000000000000000000000000000000000000000000000000000',
    timestamp: Math.floor(Date.now() / 1000),
    difficulty: 2,
    nonce: 0,
    transactions: []
  };

  let miningInProgress = false;
  let miningStartTime = 0;
  let hashesComputed = 0;

  // ============ Block Header Construction ============
  const constructBlockHeader = () => {
    const header = currentBlock.version +
                   currentBlock.prevBlockHash +
                   currentBlock.merkleRoot +
                   padLeft(currentBlock.timestamp.toString(16), 8) +
                   padLeft(currentBlock.difficulty.toString(16), 8) +
                   padLeft(currentBlock.nonce.toString(16), 8);
    return header;
  };

  const padLeft = (str, len) => {
    return str.padStart(len, '0');
  };

  // ============ Mining Simulation ============
  const startMining = async (onProgress, onComplete) => {
    if (miningInProgress) return;

    miningInProgress = true;
    miningStartTime = Date.now();
    hashesComputed = 0;

    const target = '0'.repeat(currentBlock.difficulty);
    let nonce = parseInt(document.getElementById('nonce').value) || 0;
    const header = constructBlockHeader();

    // Use requestAnimationFrame to allow UI updates
    const mine = () => {
      let localHashCount = 0;
      const batchSize = 10000;

      for (let i = 0; i < batchSize && miningInProgress; i++) {
        const headerWithNonce = header.slice(0, -8) + padLeft(nonce.toString(16), 8);
        const hash = CryptoModule.sha256(headerWithNonce);
        hashesComputed++;
        localHashCount++;

        if (hash.startsWith(target)) {
          currentBlock.nonce = nonce;
          miningInProgress = false;

          const elapsed = (Date.now() - miningStartTime) / 1000;
          const hashRate = (hashesComputed / elapsed).toFixed(0);

          onComplete({
            nonce: nonce,
            hash: hash,
            hashesComputed: hashesComputed,
            timeElapsed: elapsed,
            hashRate: hashRate
          });

          document.getElementById('nonce').value = nonce;
          return;
        }

        nonce++;

        if (nonce % 10000 === 0) {
          onProgress({
            nonce: nonce,
            hashesComputed: hashesComputed,
            currentHash: hash,
            timeElapsed: (Date.now() - miningStartTime) / 1000
          });
        }
      }

      if (miningInProgress) {
        // Update UI
        document.getElementById('nonce').value = nonce;
        onProgress({
          nonce: nonce,
          hashesComputed: hashesComputed,
          timeElapsed: (Date.now() - miningStartTime) / 1000
        });

        // Continue mining
        requestAnimationFrame(mine);
      }
    };

    mine();
  };

  const stopMining = () => {
    miningInProgress = false;
  };

  // ============ Hash Calculation ============
  const updateBlockHash = () => {
    const header = constructBlockHeader();
    const hash = CryptoModule.sha256(header);
    const target = '0'.repeat(currentBlock.difficulty);
    const isValid = hash.startsWith(target);

    return {
      header: header,
      hash: hash,
      isValid: isValid,
      difficulty: currentBlock.difficulty,
      nonce: currentBlock.nonce
    };
  };

  // ============ Merkle Tree Construction ============
  const addTransaction = (txData) => {
    currentBlock.transactions.push({
      data: txData,
      hash: CryptoModule.sha256(txData)
    });
    updateMerkleRoot();
    return currentBlock.transactions.length;
  };

  const updateMerkleRoot = () => {
    if (currentBlock.transactions.length === 0) {
      currentBlock.merkleRoot = CryptoModule.sha256('');
      return;
    }

    let hashes = currentBlock.transactions.map(tx => tx.hash);
    const tree = [hashes];

    while (hashes.length > 1) {
      const newHashes = [];
      for (let i = 0; i < hashes.length; i += 2) {
        if (i + 1 < hashes.length) {
          newHashes.push(CryptoModule.sha256(hashes[i] + hashes[i + 1]));
        } else {
          newHashes.push(CryptoModule.sha256(hashes[i] + hashes[i]));
        }
      }
      tree.push(newHashes);
      hashes = newHashes;
    }

    currentBlock.merkleRoot = hashes[0];
    return tree;
  };

  const getMerkleTree = () => {
    if (currentBlock.transactions.length === 0) return null;

    let hashes = currentBlock.transactions.map((tx, idx) => ({
      hash: tx.hash,
      level: 0,
      index: idx,
      original: true
    }));

    const tree = [hashes];
    let level = 1;

    while (hashes.length > 1) {
      const newHashes = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || hashes[i];
        const combined = left.hash + right.hash;
        const newHash = CryptoModule.sha256(combined);

        newHashes.push({
          hash: newHash,
          level: level,
          left: left,
          right: right,
          original: false
        });
      }
      tree.push(newHashes);
      hashes = newHashes;
      level++;
    }

    return {
      tree: tree,
      root: hashes[0] ? hashes[0].hash : ''
    };
  };

  // ============ Block Reset ============
  const resetBlock = () => {
    currentBlock = {
      version: '00000004',
      prevBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleRoot: '0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: Math.floor(Date.now() / 1000),
      difficulty: 2,
      nonce: 0,
      transactions: []
    };
    stopMining();
    miningInProgress = false;
    hashesComputed = 0;
  };

  // ============ Visualization Helpers ============
  const visualizeMerkleTree = (merkleData) => {
    if (!merkleData) {
      return '<p class="placeholder">Add transactions to visualize merkle tree...</p>';
    }

    let html = '<div class="merkle-visualization">';

    // Draw from leaves to root
    for (let level = merkleData.tree.length - 1; level >= 0; level--) {
      html += `<div class="merkle-level" data-level="${level}">`;
      const hashes = merkleData.tree[level];

      for (let hash of hashes) {
        html += `<div class="hash-node" title="${hash.hash}">
                  <code>${hash.hash.slice(0, 16)}...</code>
                </div>`;
      }

      html += '</div>';
    }

    html += '</div>';
    return html;
  };

  const getBlockInfo = () => {
    return {
      ...currentBlock,
      header: constructBlockHeader(),
      hash: updateBlockHash().hash
    };
  };

  // ============ Public API ============
  return {
    startMining,
    stopMining,
    updateBlockHash,
    addTransaction,
    updateMerkleRoot,
    getMerkleTree,
    visualizeMerkleTree,
    resetBlock,
    getBlockInfo,
    setDifficulty: (d) => { currentBlock.difficulty = d; },
    setNonce: (n) => { currentBlock.nonce = n; },
    getTransactions: () => currentBlock.transactions,
    getCurrentBlock: () => currentBlock
  };
})();
