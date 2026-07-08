// Ethereum Module - Accounts, Gas, and State

const EthereumModule = (() => {
  // ============ Gas Costs Reference ============
  // These are based on Ethereum yellow paper
  const gasCosts = {
    transfer: 21000,
    'contract-creation': 53000,
    'token-transfer': 65000,
    swap: 150000,
    storage_write: 20000,
    storage_read: 800,
    opcode_add: 3,
    opcode_mul: 5,
    opcode_sha256: 60
  };

  // ============ Account Model ============
  const accounts = {
    user1: {
      address: '0x1234567890123456789012345678901234567890',
      balance: 10.5,
      nonce: 42,
      code: null // EOA (externally owned account)
    },
    user2: {
      address: '0x0987654321098765432109876543210987654321',
      balance: 5.25,
      nonce: 18,
      code: null
    },
    token: {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      balance: 0, // Contract accounts don't hold ETH directly
      nonce: 0,
      code: 'ERC20TokenContract', // Smart contract code reference
      storage: {
        'totalSupply': 1000000,
        'balances[user1]': 500000,
        'balances[user2]': 500000
      }
    }
  };

  // ============ Gas Calculation ============
  const calculateGasCost = (txType, gasPrice = 20) => {
    const gasLimit = gasCosts[txType] || 21000;
    const gasPriceWei = gasPrice * 1e9; // Convert gwei to wei
    const totalWei = gasLimit * gasPriceWei;
    const totalEth = totalWei / 1e18;

    return {
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      gasPriceWei: gasPriceWei,
      totalWei: totalWei,
      totalEth: totalEth.toFixed(6),
      totalUSD: (totalEth * 1800).toFixed(2) // Assume 1 ETH = $1800
    };
  };

  // ============ State Tree Representation ============
  // Ethereum uses Merkle Patricia Trie for state storage
  const getStateRoot = () => {
    // Simplified: hash of all account states
    const stateData = JSON.stringify(accounts);
    return CryptoModule.sha256(stateData);
  };

  const getAccountProof = (address) => {
    // Simplified Merkle proof that account exists with given state
    const accountData = JSON.stringify(accounts[address] || {});
    const accountHash = CryptoModule.sha256(accountData);
    const stateRoot = getStateRoot();

    return {
      accountHash: accountHash,
      stateRoot: stateRoot,
      proof: [stateRoot, accountHash] // Simplified proof path
    };
  };

  // ============ Transaction Execution ============
  const executeTransaction = (from, to, amount, type = 'transfer') => {
    const fromAccount = accounts[from];
    const toAccount = accounts[to];
    const gasCost = calculateGasCost(type);

    if (!fromAccount || !toAccount) {
      return {
        success: false,
        error: 'Account not found',
        gasUsed: 0
      };
    }

    const totalCost = parseFloat(gasCost.totalEth) + (amount || 0);

    if (fromAccount.balance < totalCost) {
      return {
        success: false,
        error: `Insufficient balance. Have ${fromAccount.balance} ETH, need ${totalCost} ETH`,
        gasUsed: 0
      };
    }

    // Execute transaction
    const originalFromBalance = fromAccount.balance;
    const originalToBalance = toAccount.balance;

    fromAccount.balance -= totalCost;
    toAccount.balance += (amount || 0);
    fromAccount.nonce++;

    return {
      success: true,
      from: from,
      to: to,
      amount: amount || 0,
      gasUsed: gasCost.gasLimit,
      gasCost: parseFloat(gasCost.totalEth),
      totalCost: totalCost,
      stateChanges: [
        {
          account: from,
          variable: 'balance',
          before: originalFromBalance,
          after: fromAccount.balance
        },
        {
          account: from,
          variable: 'nonce',
          before: fromAccount.nonce - 1,
          after: fromAccount.nonce
        },
        {
          account: to,
          variable: 'balance',
          before: originalToBalance,
          after: toAccount.balance
        }
      ]
    };
  };

  // ============ Smart Contract Interaction ============
  const callContractFunction = (contractAddress, functionName, args) => {
    const contract = accounts[contractAddress];

    if (!contract || !contract.code) {
      return {
        success: false,
        error: 'Contract not found'
      };
    }

    // Simulate function calls
    let result = { success: true, output: null };

    switch (functionName) {
      case 'transfer':
        const [recipient, amount] = args;
        const balance = contract.storage['balances[user1]'] || 0;
        if (balance >= amount) {
          contract.storage['balances[user1]'] -= amount;
          contract.storage[`balances[${recipient}]`] = (contract.storage[`balances[${recipient}]`] || 0) + amount;
          result.output = true;
        } else {
          result.success = false;
          result.error = 'Insufficient balance';
        }
        break;

      case 'balanceOf':
        const [account] = args;
        result.output = contract.storage[`balances[${account}]`] || 0;
        break;

      case 'approve':
        const [spender, allowance] = args;
        contract.storage[`allowance[user1][${spender}]`] = allowance;
        result.output = true;
        break;

      default:
        result.error = 'Function not found';
        result.success = false;
    }

    return result;
  };

  // ============ Account Information ============
  const getAccountInfo = (accountName) => {
    return accounts[accountName] || null;
  };

  const getAllAccounts = () => {
    return accounts;
  };

  const updateAccountBalance = (accountName, newBalance) => {
    if (accounts[accountName]) {
      accounts[accountName].balance = newBalance;
      return true;
    }
    return false;
  };

  // ============ Comparison with Bitcoin ============
  const getComparison = () => {
    return {
      bitcoin: {
        model: 'UTXO (Unspent Transaction Output)',
        programmability: 'Limited scripting (Bitcoin Script)',
        statefulness: 'Stateless',
        transaction: 'Spend UTXOs, create new UTXOs',
        fees: 'Static per byte'
      },
      ethereum: {
        model: 'Accounts (like traditional banking)',
        programmability: 'Turing-complete (Solidity)',
        statefulness: 'Full state (account balances, contract storage)',
        transaction: 'Transfer between account balances',
        fees: 'Dynamic per operation (gas)'
      }
    };
  };

  // ============ Public API ============
  return {
    calculateGasCost,
    executeTransaction,
    callContractFunction,
    getAccountInfo,
    getAllAccounts,
    updateAccountBalance,
    getStateRoot,
    getAccountProof,
    getComparison,
    accounts: accounts
  };
})();
