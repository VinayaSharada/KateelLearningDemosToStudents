# Browser Linux Sandbox

## Overview

A real Buildroot Linux machine that boots entirely inside your browser tab, using [v86](https://github.com/copy/v86), an open-source x86 PC emulator compiled to WebAssembly. This is a genuine virtual machine running a real Linux kernel - not a scripted or simulated terminal. It exists for students who only have a locked-down official/corporate laptop with no admin rights, and therefore no WSL2, no VirtualBox, no Docker, and no ability to install a VM.

## Learning Objectives

- Practice core Linux shell commands (filesystem navigation, processes, basic networking) with zero setup.
- Understand what a virtual machine is by watching a real kernel boot in a browser tab.
- Get comfortable experimenting freely - the machine resets to a clean state on every restart.

## Run Modes

- Browser only

## Expected Setup / Startup Time

- First boot downloads a small (~10 MB) Linux kernel image from public CDNs and takes roughly 10-30 seconds depending on connection speed.
- Restarting the same page (via the "Restart" button) reboots instantly - no re-download.
- Requires outbound internet access to reach the CDNs listed below; no local install, admin rights, or server of any kind is needed.

## Demo Type

- Interactive browser demo (real WebAssembly x86 emulator, not scripted)
- Cross-course utility demo - useful anywhere a course needs students to touch a real Linux shell
- No API keys or cloud services required

## Files in This Folder

- `index.html` - launch page with the live emulator widget
- `about.html` - teaching guide and learning page
- `app.js` - wires up the v86 emulator (start/restart, status, download progress)
- `style.css` - demo styling
- `README.md` - this file

## How To Run

### Browser Demo

1. Open `index.html` in a modern desktop browser (Chrome, Edge, Firefox).
2. Click **Start Linux** and wait for the kernel to download and boot.
3. Click inside the black terminal area to focus it, then type shell commands.
4. Use **Restart** at any time to reboot back to a clean machine.

## How To Use The Demo

1. Start the machine and wait for the login-free root shell to appear.
2. Explore the filesystem: `ls /`, `cd /etc`, `cat /etc/os-release`.
3. Inspect the running system: `ps`, `whoami`, `uname -a`.
4. Try basic networking: `ping -c 3 example.com`, `curl example.com`.
5. Write and run a small script with the bundled `lua` interpreter.
6. Restart to return to a clean baseline between exercises.

## What To Notice

- Everything runs inside the emulated machine - nothing touches the host laptop's real filesystem.
- Performance is CPU-emulation speed, not native - fine for shell practice, not for heavy compute.
- Nothing persists after the tab closes; there is no save/restore wired into this demo.

## Technical Notes (for maintainers)

This demo loads v86 and its boot assets directly from public, CORS-enabled CDNs rather than bundling large binaries in this git repository:

- `libv86.js` / `v86.wasm` - jsDelivr, from the `v86` npm package (`cdn.jsdelivr.net/npm/v86@0.5.424/build/...`)
- `seabios.bin` / `vgabios.bin` - jsDelivr, from the `copy/v86` GitHub repo (`cdn.jsdelivr.net/gh/copy/v86@master/bios/...`)
- `xterm.js` / `xterm.css` - jsDelivr, from the `xterm` npm package (`cdn.jsdelivr.net/npm/xterm@5.3.0/...`)
- `buildroot-bzimage68.bin` (the Linux kernel + initramfs, ~10 MB) - committed in this folder and served from GitHub Pages

Buildroot Linux was chosen over Alpine because it boots from a single self-contained bzImage (kernel + initramfs) with no separate multi-file root filesystem to fetch, keeping first boot fast. The kernel image is self-hosted rather than loaded from `i.copy.sh` (the host the official [copy.sh/v86](https://copy.sh/v86/) demo uses) because that CDN enforces referrer-based hotlink protection and returns 403 for requests from any other domain. If a version bump is needed, check `https://copy.sh/v86/` for the current profile list, download the new `.bin` with a browser-like User-Agent, and replace the file in this folder.

This particular kernel profile writes its console to the emulated serial port, not the VGA screen (confirmed against v86's own `examples/serial.html`, which boots the same image with the VGA `screen_container` commented out). `app.js` wires serial0 to an xterm.js terminal via v86's `set_serial_container_xtermjs()` and sets `disable_keyboard: true` so keystrokes go to the guest through the serial channel instead of the (unused) PS/2 keyboard path. If you ever swap in a different kernel/profile that does use the VGA console, restore a `screen_container` div/canvas pair instead.

## Related Demos / Course Context

- Related demo: [IoT Ethernet Pen Test](../IoT_Ethernet_PenTest_v86/about.html) - a scripted/simulated Linux terminal for a cybersecurity scenario. This demo is the general-purpose, genuinely-functional counterpart for basic Linux practice.

## Attribution

This demo is part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) by Professor Vinaya Sathyanarayana.

**Attribution Email:** vinallcontact@gmail.com

Runs on [v86](https://github.com/copy/v86) (BSD-2-Clause licensed) by Fabian and contributors.

---

*Educational Use Only - For usage guidelines, see the main repository.*
