// Blockchain Cryptography Module
// Implements SHA-256, ECDSA, and related functions for finance professionals

const CryptoModule = (() => {
  // ============ SHA-256 Implementation ============
  // Secure Hash Algorithm 256-bit - the foundation of blockchain

  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const rightRotate = (value, amount) => ((value >>> amount) | (value << (32 - amount))) >>> 0;
  const rightShift = (value, amount) => value >>> amount;
  const ch = (x, y, z) => (x & y) ^ (~x & z);
  const maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
  const sigma0 = x => rightRotate(x, 2) ^ rightRotate(x, 13) ^ rightRotate(x, 22);
  const sigma1 = x => rightRotate(x, 6) ^ rightRotate(x, 11) ^ rightRotate(x, 25);
  const gamma0 = x => rightRotate(x, 7) ^ rightRotate(x, 18) ^ rightShift(x, 3);
  const gamma1 = x => rightRotate(x, 17) ^ rightRotate(x, 19) ^ rightShift(x, 10);

  const toHexString = (value, length = 8) => {
    let hex = value.toString(16);
    return hex.padStart(length, '0');
  };

  const sha256 = (input) => {
    // Convert input to bytes
    let message;
    if (typeof input === 'string') {
      message = new TextEncoder().encode(input);
    } else if (input instanceof Uint8Array) {
      message = input;
    } else {
      message = new Uint8Array(input);
    }

    // Initial hash values
    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    // Pre-processing (Padding)
    const ml = message.length * 8;
    const msg = new Uint8Array(((ml + 513) >>> 9) << 6);
    msg.set(message);
    msg[message.length] = 0x80;

    let t = message.length;
    while ((t % 64) !== 56) t++;
    const dv = new DataView(msg.buffer);
    dv.setBigInt64(t, BigInt(ml), false);

    // Process message in 512-bit chunks
    for (let offset = 0; offset < msg.length; offset += 64) {
      const w = new Uint32Array(64);

      for (let i = 0; i < 16; i++) {
        w[i] = dv.getUint32(offset + i * 4, false);
      }

      for (let i = 16; i < 64; i++) {
        w[i] = (gamma1(w[i - 2]) + w[i - 7] + gamma0(w[i - 15]) + w[i - 16]) >>> 0;
      }

      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

      for (let i = 0; i < 64; i++) {
        const t1 = (h + sigma1(e) + ch(e, f, g) + K[i] + w[i]) >>> 0;
        const t2 = (sigma0(a) + maj(a, b, c)) >>> 0;
        h = g;
        g = f;
        f = e;
        e = (d + t1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (t1 + t2) >>> 0;
      }

      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
      h5 = (h5 + f) >>> 0;
      h6 = (h6 + g) >>> 0;
      h7 = (h7 + h) >>> 0;
    }

    return toHexString(h0) + toHexString(h1) + toHexString(h2) + toHexString(h3) +
           toHexString(h4) + toHexString(h5) + toHexString(h6) + toHexString(h7);
  };

  // ============ ECDSA Key Pair Generation ============
  // Bitcoin uses secp256k1 elliptic curve
  // For browser implementation, we'll use SubtleCrypto APIs

  const generateKeyPair = async () => {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256'
        },
        true, // extractable
        ['sign', 'verify']
      );

      const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);

      const privateKeyHex = bufferToHex(privateKey).slice(0, 64);
      const publicKeyHex = bufferToHex(publicKey);

      return {
        privateKey: privateKeyHex,
        publicKey: publicKeyHex,
        keyPair: keyPair
      };
    } catch (e) {
      console.error('Key generation error:', e);
      // Fallback: mock keys for demo purposes
      return {
        privateKey: generateMockPrivateKey(),
        publicKey: generateMockPublicKey(),
        keyPair: null
      };
    }
  };

  const generateMockPrivateKey = () => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateMockPublicKey = () => {
    const arr = new Uint8Array(65);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const signMessage = async (message, privateKey, keyPair) => {
    if (!keyPair) {
      return mockSignature(message, privateKey);
    }

    try {
      const messageData = new TextEncoder().encode(message);
      const signature = await crypto.subtle.sign('ECDSA', keyPair.privateKey, messageData);
      return bufferToHex(signature);
    } catch (e) {
      return mockSignature(message, privateKey);
    }
  };

  const mockSignature = (message, privateKey) => {
    const hash = sha256(message + privateKey);
    return hash.slice(0, 128);
  };

  const verifySignature = async (message, signature, publicKey, keyPair) => {
    if (!keyPair) {
      return true; // Mock verification always passes
    }

    try {
      const messageData = new TextEncoder().encode(message);
      const signatureBuffer = hexToBuffer(signature);
      return await crypto.subtle.verify('ECDSA', keyPair.publicKey, signatureBuffer, messageData);
    } catch (e) {
      return false;
    }
  };

  const bufferToHex = (buffer) => {
    const view = new Uint8Array(buffer);
    return Array.from(view).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const hexToBuffer = (hex) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes.buffer;
  };

  // ============ Hash160 (RIPEMD-160(SHA-256(x))) ============
  // Used for Bitcoin addresses

  const hash160 = async (data) => {
    // Simplified: use SHA-256 twice (actual Bitcoin uses RIPEMD-160)
    const hash1 = sha256(data);
    const hash2 = sha256(hash1);
    return hash2.slice(0, 40); // 20 bytes = 40 hex chars
  };

  // ============ Merkle Tree ============
  // Bitcoin uses merkle trees to hash all transactions in a block

  const calculateMerkleRoot = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return sha256('');
    }

    let hashes = transactions.map(tx =>
      typeof tx === 'string' ? tx : sha256(JSON.stringify(tx))
    );

    while (hashes.length > 1) {
      const newHashes = [];
      for (let i = 0; i < hashes.length; i += 2) {
        if (i + 1 < hashes.length) {
          newHashes.push(sha256(hashes[i] + hashes[i + 1]));
        } else {
          newHashes.push(sha256(hashes[i] + hashes[i]));
        }
      }
      hashes = newHashes;
    }

    return hashes[0];
  };

  // ============ Proof of Work ============
  // Bitcoin's mining: find a nonce such that hash meets difficulty target

  function* proofOfWork(data, difficulty = 4) {
    let nonce = 0;
    let target = '0'.repeat(difficulty);
    let hash;

    while (true) {
      hash = sha256(data + nonce);
      if (hash.startsWith(target)) {
        return { nonce, hash };
      }
      nonce++;
      if (nonce % 100000 === 0) {
        // Allow UI updates
        yield { progress: nonce, currentHash: hash };
      }
    }
  }

  // ============ Base58Check Encoding ============
  // Used for Bitcoin addresses

  const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  const base58Encode = (buffer) => {
    let encoded = '';
    let num = 0n;

    // Convert buffer to big integer
    for (const byte of buffer) {
      num = num * 256n + BigInt(byte);
    }

    // Convert to base58
    while (num > 0n) {
      encoded = BASE58_ALPHABET[Number(num % 58n)] + encoded;
      num = num / 58n;
    }

    // Add leading '1's for zero bytes
    for (const byte of buffer) {
      if (byte === 0) encoded = '1' + encoded;
      else break;
    }

    return encoded || '1';
  };

  const base58Decode = (encoded) => {
    let num = 0n;

    for (const char of encoded) {
      num = num * 58n + BigInt(BASE58_ALPHABET.indexOf(char));
    }

    const buffer = [];
    while (num > 0n) {
      buffer.unshift(Number(num % 256n));
      num = num / 256n;
    }

    for (const char of encoded) {
      if (char === '1') buffer.unshift(0);
      else break;
    }

    return new Uint8Array(buffer);
  };

  // ============ Public API ============

  return {
    sha256,
    hash160,
    calculateMerkleRoot,
    proofOfWork,
    generateKeyPair,
    signMessage,
    verifySignature,
    base58Encode,
    base58Decode,
    bufferToHex,
    hexToBuffer
  };
})();

// Make available globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CryptoModule;
}
