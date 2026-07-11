// Stack Smashing Visualizer - Interactive Buffer Overflow Demonstration

class StackVisualizer {
  constructor() {
    this.bufferSize = 8;
    this.stackBaseAddress = 0x08048000;
    this.originalReturnAddress = 0x08048500;
    this.savedEBP = 0xbfff0000;

    this.init();
  }

  init() {
    document.getElementById('bufferInput').addEventListener('input', (e) => {
      this.bufferSize = parseInt(e.target.value);
      document.getElementById('bufferDisplay').textContent = this.bufferSize;
      this.clearVisualization();
    });

    document.getElementById('visualizeBtn').addEventListener('click', () => this.visualize());
    document.getElementById('clearBtn').addEventListener('click', () => this.clearVisualization());

    document.querySelectorAll('.sample-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.loadSample(e.target.dataset.sample));
    });
  }

  parseHexInput(input) {
    try {
      const bytes = input.trim().split(/\s+/).filter(s => s.length > 0);
      const parsed = bytes.map(b => {
        const val = parseInt(b, 16);
        if (isNaN(val) || val < 0 || val > 255) {
          throw new Error(`Invalid hex value: ${b}`);
        }
        return val;
      });
      return parsed;
    } catch (e) {
      alert(`Invalid input: ${e.message}`);
      return null;
    }
  }

  visualize() {
    const inputData = document.getElementById('inputData').value.trim();
    if (!inputData) {
      alert('Please enter hex data (e.g., 41 42 43 44)');
      return;
    }

    const bytes = this.parseHexInput(inputData);
    if (!bytes) return;

    const slowMotion = document.getElementById('slowMotion').checked;

    this.simulateOverflow(bytes, slowMotion);
  }

  simulateOverflow(bytes, slowMotion) {
    const stack = [];
    let offset = 0;

    // Initialize stack with original values
    const details = [];

    // Buffer
    for (let i = 0; i < this.bufferSize; i++) {
      const byteVal = bytes[i] !== undefined ? bytes[i] : 0x00;
      stack.push({
        offset: offset,
        value: byteVal,
        label: `Buffer[${i}]`,
        location: 'Local Variable',
        isOverflow: i >= this.bufferSize && bytes[i] !== undefined,
        isReturnAddress: false
      });
      details.push({
        offset: offset,
        data: `0x${byteVal.toString(16).padStart(2, '0')}`,
        location: `Buffer[${i}]`,
        impact: bytes[i] !== undefined ? (i < this.bufferSize ? 'Valid write' : '⚠️ Overflow!') : 'Uninitialized'
      });
      offset++;
    }

    // Saved EBP (4 bytes, little-endian)
    for (let i = 0; i < 4; i++) {
      const byteVal = bytes[this.bufferSize + i] !== undefined ? bytes[this.bufferSize + i] : (this.savedEBP >> (i * 8)) & 0xFF;
      const isCorrupted = bytes[this.bufferSize + i] !== undefined;

      stack.push({
        offset: offset,
        value: byteVal,
        label: `Saved EBP[${i}]`,
        location: 'Function Frame Pointer',
        isOverflow: isCorrupted,
        isSavedEBP: true,
        isReturnAddress: false
      });
      details.push({
        offset: offset,
        data: `0x${byteVal.toString(16).padStart(2, '0')}`,
        location: `Saved EBP[${i}]`,
        impact: isCorrupted ? '⚠️ Corrupted frame pointer!' : 'Frame pointer'
      });
      offset++;
    }

    // Return Address (4 bytes, little-endian)
    let corruptedReturnAddr = 0;
    for (let i = 0; i < 4; i++) {
      const byteVal = bytes[this.bufferSize + 4 + i] !== undefined ? bytes[this.bufferSize + 4 + i] : (this.originalReturnAddress >> (i * 8)) & 0xFF;
      const isCorrupted = bytes[this.bufferSize + 4 + i] !== undefined;

      stack.push({
        offset: offset,
        value: byteVal,
        label: `Return Address[${i}]`,
        location: 'Return Address',
        isOverflow: isCorrupted,
        isReturnAddress: true
      });
      details.push({
        offset: offset,
        data: `0x${byteVal.toString(16).padStart(2, '0')}`,
        location: `Return Address[${i}]`,
        impact: isCorrupted ? '🔴 HIJACKED - Control flow attack!' : 'Normal return'
      });

      if (isCorrupted) {
        corruptedReturnAddr |= (byteVal << (i * 8));
      }
      offset++;
    }

    this.renderStack(stack);
    this.renderDetails(details);

    // Check if return address was corrupted
    const hasReturnAddressOverflow = bytes.length > this.bufferSize + 4;
    if (hasReturnAddressOverflow) {
      this.showExploitInfo(corruptedReturnAddr);
    }

    if (slowMotion) {
      this.animateOverflow(stack, details);
    }
  }

  renderStack(stack) {
    const display = document.getElementById('stackDisplay');
    display.innerHTML = '';

    stack.forEach(cell => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'stack-cell';

      if (cell.isReturnAddress) {
        cellDiv.classList.add(cell.isOverflow ? 'overflow-return' : 'return-address');
      } else if (cell.isSavedEBP) {
        cellDiv.classList.add(cell.isOverflow ? 'overflow-ebp' : 'saved-ebp');
      } else if (cell.isOverflow) {
        cellDiv.classList.add('overflow-buffer');
      }

      const hex = `0x${cell.value.toString(16).padStart(2, '0').toUpperCase()}`;
      const ascii = cell.value >= 32 && cell.value < 127 ? String.fromCharCode(cell.value) : '.';

      cellDiv.innerHTML = `
        <div class="cell-addr">0x${(0xbfff0000 + cell.offset).toString(16)}</div>
        <div class="cell-content">
          <div class="cell-hex">${hex}</div>
          <div class="cell-ascii">'${ascii}'</div>
        </div>
        <div class="cell-label">${cell.label}</div>
      `;

      display.appendChild(cellDiv);
    });

    document.getElementById('statusBox').innerHTML = `
      <p><strong>✅ Stack overflow visualized</strong></p>
      <p>Buffer size: ${this.bufferSize} bytes</p>
      <p>Input data: ${document.getElementById('inputData').value}</p>
      <p>Total stack cells written: ${stack.length}</p>
    `;
  }

  renderDetails(details) {
    const tbody = document.getElementById('detailsTable');
    tbody.innerHTML = '';

    const hasOverflow = details.some(d => d.impact.includes('⚠️') || d.impact.includes('🔴'));

    if (hasOverflow) {
      document.getElementById('detailsBox').style.display = 'block';
    }

    details.forEach(detail => {
      const row = document.createElement('tr');
      const isHijack = detail.impact.includes('🔴');
      if (isHijack) row.classList.add('hijacked-row');

      row.innerHTML = `
        <td>+${detail.offset}</td>
        <td><code>${detail.data}</code></td>
        <td>${detail.location}</td>
        <td>${detail.impact}</td>
      `;
      tbody.appendChild(row);
    });
  }

  showExploitInfo(corruptedAddr) {
    document.getElementById('exploitBox').style.display = 'block';

    document.getElementById('origReturn').textContent = `0x${this.originalReturnAddress.toString(16).padStart(8, '0').toUpperCase()}`;
    document.getElementById('newReturn').textContent = `0x${corruptedAddr.toString(16).padStart(8, '0').toUpperCase()}`;
  }

  clearVisualization() {
    document.getElementById('stackDisplay').innerHTML = '';
    document.getElementById('detailsBox').style.display = 'none';
    document.getElementById('exploitBox').style.display = 'none';
    document.getElementById('inputData').value = '';
    document.getElementById('statusBox').innerHTML = '<p>Ready to analyze. Enter buffer size and input data above.</p>';
  }

  loadSample(type) {
    let bufferSize = 8;
    let input = '';

    switch (type) {
      case 'small':
        bufferSize = 8;
        input = '41 42 43 44'; // "ABCD" overflow into buffer
        break;
      case 'medium':
        bufferSize = 8;
        input = '41 41 41 41 41 41 41 41 42 42 42 42 43 43 43 43'; // Fill buffer, saved EBP, and start return address
        break;
      case 'large':
        bufferSize = 8;
        // Overflow all the way through return address
        input = '41 41 41 41 41 41 41 41 42 42 42 42 43 43 43 43 44 44 44 44 45 45 45 45';
        break;
      case 'nopsled':
        bufferSize = 8;
        // NOP sled (0x90) followed by shellcode signature
        input = '90 90 90 90 90 90 90 90 90 90 90 90 CC CC CC CC';
        break;
    }

    document.getElementById('bufferInput').value = bufferSize;
    document.getElementById('bufferDisplay').textContent = bufferSize;
    this.bufferSize = bufferSize;

    document.getElementById('inputData').value = input;
    this.visualize();
  }

  animateOverflow(stack, details) {
    // Could add step-by-step animation here
    console.log('Slow motion visualization initialized');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new StackVisualizer();
});
