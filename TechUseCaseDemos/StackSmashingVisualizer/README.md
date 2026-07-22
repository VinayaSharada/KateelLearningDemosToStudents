# Stack Smashing Visualizer

**Interactive in-browser demonstration of stack buffer overflow attacks and return address hijacking**

## Overview

The Stack Smashing Visualizer teaches how buffer overflows corrupt the stack memory, overwrite return addresses, and enable arbitrary code execution. Students visualize memory layouts, see overflows happen in real-time, and understand why bounds checking and memory protection mechanisms are critical.

## Key Features

- **Memory Layout Visualization**: See the stack structure with local variables, saved EBP, and return address
- **Interactive Buffer Overflow**: Adjust buffer size and input data to see how overflow propagates
- **Return Address Corruption Detection**: Highlights when the return address is hijacked
- **Hex Input Support**: Enter attack payloads as hex values for precise control
- **Sample Attacks**: Pre-built examples demonstrate small, medium, and large overflows
- **Detailed Analysis**: Tables show exactly which memory cells are overwritten and their impact
- **Educational Focus**: Learning objectives, discussion questions, and defense mechanisms

## Learning Objectives

After using this demo, students should be able to:

1. Explain the stack memory layout and the role of each section
2. Describe how buffer overflow leads to return address corruption
3. Understand why the return address is a critical control flow target
4. Recognize vulnerable code patterns (unbounded strcpy, sprintf, gets)
5. Explain how stack canaries, ASLR, DEP/NX, and CFI provide defense
6. Identify when input validation and bounds checking are necessary

## How to Use

### Step 1: Set Buffer Size
Use the slider to adjust the vulnerable buffer size (4-32 bytes). Smaller buffers are overflowed more easily.

### Step 2: Enter Hex Input
Enter your attack payload as space-separated hex values:
- `41 42 43 44` → "ABCD" (bytes will overflow beyond the buffer)
- `90 90 90 90` → NOP sled
- `CC CC CC CC` → Breakpoint pattern

### Step 3: Visualize Overflow
Click "Visualize Overflow" to see:
- Stack memory layout with each cell
- Which cells are overwritten
- Whether the return address was corrupted

### Step 4: Analyze Results
Check the analysis panel to see:
- Detailed breakdown of each byte written
- Which memory regions are affected
- Whether an exploit was successful

### Step 5: Try Sample Attacks
Use pre-built samples to see attack patterns:
- **Small Overflow**: Overwrite only part of the buffer
- **Medium Overflow**: Corrupt buffer and saved EBP
- **Large Overflow**: Overwrite return address
- **With NOP Sled**: Demonstrate NOP sled technique

## Memory Layout

```
Higher Address
     +------------------+
     | Caller's Stack   |
     +------------------+
     | Local Variables  | ← Buffer (fixed size)
     +------------------+
     | Saved EBP        | ← Frame pointer (4 bytes)
     +------------------+
     | Return Address   | ← CPU jumps here when function returns
     +------------------+
     | Caller's Args    |
     +------------------+
Lower Address
```

The attacker writes beyond the buffer boundaries to corrupt the saved EBP and return address.

## Attack Mechanics

1. **Buffer Overflow**: Input exceeds allocated buffer size
2. **Stack Corruption**: Data overwrites adjacent saved EBP
3. **Return Address Hijacking**: Attacker's value replaces original return address
4. **Code Execution**: When function returns, CPU jumps to attacker's chosen address

## Defense Mechanisms

### Stack Canaries
Place a sentinel value between buffer and return address. Detecting canary corruption prevents exploitation.

### Address Space Layout Randomization (ASLR)
Randomize memory locations so attackers can't predict where code/data is located.

### Data Execution Prevention (DEP/NX)
Mark memory pages as non-executable. Stack and heap can't execute code even if shellcode is injected.

### Bounds Checking
Use safe string functions that respect buffer sizes:
```c
strcpy(buf, input);          // ❌ Unsafe
strncpy(buf, input, 8);      // ✅ Safe
snprintf(buf, 8, "%s", input); // ✅ Safe
```

### Control Flow Integrity (CFI)
Verify that all control flow jumps go to legitimate targets. Invalid jumps abort the program.

## Discussion Questions

1. Why is `strcpy()` considered dangerous?
2. How would a stack canary detect this overflow?
3. If ASLR is enabled, how does it complicate the attack?
4. Why is NX/DEP alone not sufficient?
5. What's the relationship to privilege escalation?
6. Why can't you check buffer bounds after copying?

## Real-World Context

Stack smashing has been used in:
- **Morris Worm (1988)**: Early Internet worm that propagated via stack overflow
- **Privilege Escalation**: Users exploiting setuid binaries to gain root access
- **Malware Delivery**: Injecting shellcode to download and execute malicious software
- **Server Breaches**: Countless exploits of unpatched applications

## Related Concepts

- **Buffer Overflow**: Writing beyond allocated memory boundaries
- **Shellcode**: Malicious machine code injected and executed
- **Return-Oriented Programming (ROP)**: Chaining existing code sequences
- **Heap Overflow**: Similar attacks on heap-allocated memory
- **Format String**: Different vulnerability in printf-like functions

## References

- **Aleph One:** "Smashing the Stack for Fun and Profit" (Phrack Magazine, 1996)
- **OWASP:** Buffer Overflow vulnerability documentation
- **CWE-120:** Buffer Copy without Checking Size of Input
- **CWE-119:** Improper Restriction of Operations within the Bounds of a Memory Buffer

## Course Integration

- **Cybersecurity Course**: Core concept in understanding low-level attacks
- **System Security**: Foundation for understanding OS-level exploits
- **Application Security**: Why input validation and bounds checking matter
- **Compliance**: Understanding security vulnerabilities in audits

## Technologies

- Pure JavaScript (no external dependencies)
- HTML5 Canvas-free memory visualization
- Responsive design for desktop and mobile
- Fully client-side execution
- Works in all modern browsers

## Time Estimates

- **Guided demo**: 10-15 minutes
- **Self-exploration**: 15-20 minutes
- **With discussion**: 25-35 minutes

## Author

Created for the KateelLearningDemos project by Professor Vinaya Sathyanarayana

## License

Educational demo for classroom use

## Business decision

Use this demo to make the central decision in Stack Smashing Visualizer explicit, surface the key trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
