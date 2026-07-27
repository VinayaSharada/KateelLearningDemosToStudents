// Browser Linux Sandbox - real Buildroot Linux, boots via the v86 x86 emulator (WebAssembly)
// No installs, no admin rights, no Docker/WSL/VM software required on the host machine.
//
// This kernel profile writes its console to the emulated serial port rather than the VGA
// screen, so the terminal is an xterm.js instance wired to serial0 (see v86's own
// examples/serial.html), not the VGA screen_container used by most other v86 demos.

const V86_WASM_URL = "https://cdn.jsdelivr.net/npm/v86@0.5.424/build/v86.wasm";
const SEABIOS_URL = "https://cdn.jsdelivr.net/gh/copy/v86@master/bios/seabios.bin";
const VGABIOS_URL = "https://cdn.jsdelivr.net/gh/copy/v86@master/bios/vgabios.bin";
const KERNEL_URL = "buildroot-bzimage68.bin";

class LinuxSandbox {
    constructor() {
        this.emulator = null;
        this.statusEl = document.getElementById('status');
        this.progressEl = document.getElementById('progress');
        this.terminalEl = document.getElementById('terminal');
        this.powerBtn = document.getElementById('power-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.powerBtn.addEventListener('click', () => this.start());
        this.resetBtn.addEventListener('click', () => this.restart());

        this.setStatus('Ready to start', 'stopped');
    }

    setStatus(text, state) {
        this.statusEl.textContent = text;
        this.statusEl.className = `status-indicator ${state}`;
    }

    start() {
        if (this.emulator) {
            return;
        }
        if (typeof V86 === 'undefined' || typeof Terminal === 'undefined') {
            this.setStatus('Could not load the emulator library - check your internet connection and reload', 'stopped');
            return;
        }

        this.powerBtn.disabled = true;
        this.setStatus('Downloading Linux kernel (~10 MB)...', 'running');

        this.emulator = new V86({
            wasm_path: V86_WASM_URL,
            memory_size: 128 * 1024 * 1024,
            bios: { url: SEABIOS_URL },
            vga_bios: { url: VGABIOS_URL },
            bzimage: { url: KERNEL_URL },
            cmdline: "tsc=reliable mitigations=off random.trust_cpu=on",
            disable_keyboard: true,
            autostart: true,
        });

        this.emulator.set_serial_container_xtermjs(this.terminalEl);

        this.emulator.add_listener('download-progress', (e) => {
            if (e.file_name.includes('bzimage') && e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                this.progressEl.textContent = `Downloading kernel: ${pct}%`;
            }
        });

        this.emulator.add_listener('emulator-ready', () => {
            this.progressEl.textContent = '';
            this.setStatus('Booting Linux...', 'running');
        });

        this.emulator.add_listener('emulator-started', () => {
            this.setStatus('Running - click the terminal, then type', 'running');
            this.resetBtn.disabled = false;
        });
    }

    restart() {
        if (!this.emulator) {
            return;
        }
        this.setStatus('Restarting...', 'running');
        this.emulator.restart();
        setTimeout(() => this.setStatus('Running - click the terminal, then type', 'running'), 500);
    }
}

window.addEventListener('DOMContentLoaded', () => new LinuxSandbox());
