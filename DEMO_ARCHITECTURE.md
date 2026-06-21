# Demo Information Architecture

This document defines the standard structure for demos in `KateelLearningDemosToStudents`.

It is intended to make every demo easier to:
- teach from
- navigate
- compare across courses
- maintain over time

This standard applies to:
- interactive browser demos
- `about.html` teaching pages
- demo-level `README.md` files
- Colab-oriented demos
- local-only demos
- multi-mode demos

It does **not** define templates for:
- course catalog README files
- top-level repository README files
- infrastructure or backend README files

Those should have separate templates.

---

## Goals

Every demo should make these things obvious:

1. What the demo is about
2. What the student is expected to learn
3. What sequence of actions the student should take
4. What each input means
5. What each action button does
6. What each output means
7. What to notice after the output changes
8. How the demo is meant to be run
9. How long startup or model-loading may take

---

## Standard Demo Layers

Each demo should ideally have two complementary layers:

### 1. `about.html`
Purpose:
- teaching guide
- concepts
- learning objectives
- usage instructions
- discussion prompts

### 2. `index.html`
Purpose:
- interactive hands-on experience
- inputs
- actions
- outputs
- interpretation

The `about.html` page should explain the demo.
The `index.html` page should let the student use the demo.

For demos that are not browser-launchable, the equivalent "launch surface" can be:
- a Colab notebook
- a local script or app entrypoint
- a mode selector page that routes to multiple execution paths

---

## Standard Interactive Demo Flow

Every interactive demo should follow this sequence as closely as possible:

1. `What this demo does`
2. `Learning goal or scenario context`
3. `Step 1: Inputs`
4. `Step 2: Decision / Action buttons`
5. `Step 3: Outputs`
6. `Step 4: Interpretation / What to notice`
7. `Export / Reset`

For non-browser or mixed-mode demos, add an execution-mode step before inputs:

1. `Choose Run Mode`
2. `Review setup expectations`
3. `Proceed to inputs`

This sequence should also be reflected visually on the page:
- inputs first
- buttons next
- outputs after that
- insights last

---

## Standard Section Model For Interactive Demos

### A. Demo Header
Should include:
- demo title
- one-sentence purpose
- optional badges such as `Browser-only`, `No API keys`, `Treasury`, `AI/ML`, `Cyber`

### B. Learning Goal Strip
Short plain-language framing such as:
- "In this demo you will learn how hedge ratios change under market stress."
- "In this demo you will compare model outputs across scenarios."

### C. Run Mode and Expectations
Every demo should clearly state one or more supported run modes:
- `Browser`
- `Colab`
- `Local`
- `Multiple modes`

It should also set expectations for:
- startup time
- model download time
- dependency installation time
- whether the first run is slower than later runs

Recommended expectation labels:
- `Starts immediately`
- `May take 10-30 seconds on first load`
- `Downloads a local model`
- `Requires local Python dependencies`
- `Best run in Colab`

### D. Step 1: Inputs
Should include:
- grouped inputs
- short explanation of each input
- default values with sensible starting points

Each input should answer:
- what is this?
- what happens if I increase or decrease it?

### E. Step 2: Action Buttons
Common buttons:
- `Run`
- `Optimize`
- `Generate`
- `Simulate`
- `Compare`
- `Export`
- `Reset`

Each action area should clarify:
- what the button does
- whether it computes, simulates, exports, or resets
- whether there is any delay or compute cost

### F. Step 3: Outputs
Outputs should be grouped into:
- summary metrics
- detailed views
- charts / tables
- AI recommendations if present

Each output should clarify:
- what it represents
- how to interpret high vs low values
- whether it is raw output, derived metric, or recommendation

### G. Step 4: What To Notice
This section should convert results into learning.

Examples:
- compare stress vs baseline
- notice trade-offs between risk and cost
- observe how one input changes multiple outputs
- identify where the AI recommendation differs from the base model

### H. Reset / Export
Should be present at the end of the interactive flow or near the action area.

---

## Standard `about.html` Structure

Every `about.html` page should follow this order:

1. `What This Demo Is About`
2. `Learning Objectives`
3. `Run Modes`
4. `Before You Start / Expected Wait Times`
5. `Business or Domain Context`
6. `How To Use The Demo`
7. `Input Variables Explained`
8. `Decision Buttons Explained`
9. `Outputs Explained`
10. `What To Notice`
11. `Discussion / Reflection Questions`
12. `Attribution`

Optional sections:
- prerequisites
- classroom activity
- assessment prompts
- limitations

---

## Standard Demo README Structure

Observed demo README files in this repo usually include:
- overview
- learning objectives
- quick start
- feature list
- related demos
- attribution

Going forward, the standard demo README should include:

1. `Title`
2. `Overview`
3. `Learning Objectives`
4. `Run Modes`
5. `Expected Setup / Startup Time`
6. `Demo Type`
7. `Files in This Folder`
8. `How To Run`
9. `How To Use The Demo`
10. `Inputs`
11. `Buttons / Actions`
12. `Outputs`
13. `What To Notice`
14. `Related Demos or Course Context`
15. `Attribution`

This keeps the README aligned with both `about.html` and `index.html`.

---

## UI Design Rules

To standardize UX across demos:

### Layout rules
- Inputs must come before buttons
- Buttons must come before outputs
- Outputs must come before interpretation
- Use numbered steps when a flow is sequential

### Writing rules
- Prefer plain English over technical shorthand
- Every major section should have a one-sentence helper description
- Avoid unexplained acronyms unless expanded nearby
- Explicitly say if the demo may take time to load or download models

### Interaction rules
- Default values should produce a meaningful output immediately
- Reset should always restore a known classroom-safe state
- Export should clearly describe what file is downloaded
- First-load delays should be explained before the user clicks
- Heavy browser model downloads should be labeled clearly
- Colab-required demos should say so immediately near the top

### Output rules
- Large numbers must wrap or scale safely inside cards
- Charts should include enough context to interpret them
- AI outputs should be visually separate from raw model outputs

---

## Recommended Folder-Level Demo Assets

When possible, a demo folder should contain:

- `index.html`
- `about.html`
- `app.js`
- `style.css`
- `README.md`

Optional:
- sample output files
- local data files
- helper scripts
- Colab notebook(s)
- mode selector or launcher helper page

---

## Run Mode Standard

Each demo should declare one of these run-mode patterns:

### Browser
- Launches via `index.html`
- Should say whether any in-browser model download occurs

### Colab
- Launches via notebook link or notebook file
- Should say what local setup is avoided by using Colab

### Local
- Launches via script, notebook, or local app
- Should list dependencies and expected setup effort

### Multi-Mode
- Supports two or more of Browser / Colab / Local
- Should present a short comparison table:
  - mode
  - best for
  - setup effort
  - expected first-run time

Example:

| Mode | Best For | Setup | First Run |
|------|----------|-------|-----------|
| Browser | Quick classroom demo | None | 10-30s if model downloads |
| Colab | GPU / larger models | Minimal | 1-3 min runtime setup |
| Local | Development / customization | Higher | depends on environment |

---

## Synchronization Rule

Yes, the three demo surfaces should be synchronized:

- `README.md`
- `about.html`
- launch surface such as `index.html`

But they should not be identical copies.

Use this rule:

### `README.md`
- repository-facing
- concise but complete
- good for GitHub browsing
- should state run modes and setup expectations

### `about.html`
- teaching-facing
- richer learning guide
- explains inputs, outputs, steps, and reflection

### `index.html` or launch surface
- action-facing
- optimized for doing, not reading
- should still include short expectation-setting near the top

These three should agree on:
- demo title
- one-sentence description
- supported run modes
- main learning goals
- main steps

---

## Separate vs Merged Pages

Default recommendation:

- keep `about.html` separate from the interactive launch page

Meaning:
- `about.html` = teaching guide
- `index.html` = actual demo launch and interaction

### Why separation is the default

- the interactive page stays focused on doing
- the teaching page can hold richer explanation without cluttering the demo
- students can choose quick launch or guided reading
- heavy browser demos can set expectations more fully on the about page
- this pattern scales better across many demos in the repo

### When separate pages are strongly recommended

Use separate pages when the demo is:

- multi-step
- concept-rich
- classroom-guided
- dependent on startup/setup expectations
- browser-based with local model downloads
- supported in multiple run modes

### When merging is acceptable

Merging the teaching content into the launch page is acceptable when the demo is:

- very small
- single-step
- easy to explain in a short intro panel
- unlikely to need substantial interpretation guidance

### Practical decision rule

- `simple demo` -> merged page is acceptable
- `multi-step or heavy demo` -> keep separate pages
- `browser demo with SLM/model download` -> keep separate pages
- `multi-mode demo (browser/colab/local)` -> keep separate pages

### Recommended hybrid pattern

Even when pages are separate, `index.html` should still include a compact orientation block:

- one-sentence purpose
- supported run mode
- expected startup/download time
- link to `about.html`

This gives students enough context without forcing them to leave the launch surface.

---

## Naming Convention Recommendation

We should standardize the *roles* of files, but not necessarily rename everything away from common conventions.

Recommended canonical filenames:

- `index.html` = Demo Launch
- `about.html` = About Demo
- `README.md` = Demo README

Why keep `README.md`:
- GitHub automatically renders it
- users expect it
- tooling expects it

So I do **not** recommend renaming it to `demoreadme.md`.

Instead, standardize by role and labeling:
- navigation label: `Launch Demo`
- navigation label: `About Demo`
- repository file: `README.md`

If additional launch modes exist, use predictable names:

- `index.html` for browser launch
- `demo_colab.ipynb` or a Colab link reference in README/about page
- `run_local.py` or `app.py` for local launcher
- `MODES.md` only if the demo has unusually complex execution options

For multi-mode demos, the recommended pattern is:

- `index.html` if browser mode exists
- `README.md` explains all run modes
- `about.html` includes a `Run Modes` teaching section

---

## Recommended Naming

Use these section labels consistently when possible:

- `Portfolio Setup`
- `Scenario Setup`
- `Inputs`
- `Run Optimizer`
- `Simulation Output`
- `Recommendations`
- `Risk and Cost Estimate`
- `What To Notice`

This consistency helps students move between demos without re-learning the interface.

---

## Templates

Starter templates are provided in:

- [DemoTemplates/interactive-demo-template.html](/C:/Users/vsathya/todel/gitrepos/KateelLearningDemosToStudents/DemoTemplates/interactive-demo-template.html)
- [DemoTemplates/about-demo-template.html](/C:/Users/vsathya/todel/gitrepos/KateelLearningDemosToStudents/DemoTemplates/about-demo-template.html)
- [DemoTemplates/demo-template.css](/C:/Users/vsathya/todel/gitrepos/KateelLearningDemosToStudents/DemoTemplates/demo-template.css)
- [DemoTemplates/demo-readme-template.md](/C:/Users/vsathya/todel/gitrepos/KateelLearningDemosToStudents/DemoTemplates/demo-readme-template.md)

These templates should be interpreted with run-mode awareness:
- browser demos use all three surfaces directly
- local-only demos use the README plus launch instructions
- multi-mode demos should include explicit expectation-setting in every surface

---

## Adoption Guidance

Recommended rollout:

1. Standardize new demos first
2. Apply to high-traffic browser demos next
3. Then update older demos by family

Suggested order:
- Treasury demos
- Browser-first demos
- Domain demos
- Cyber demos

This reduces churn while still creating a visible standard quickly.
