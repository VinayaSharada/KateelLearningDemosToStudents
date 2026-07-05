# AI Page Agent

## Overview

An in-page agent that reads a support ticket queue as text (no screenshots, no vision model) and acts on it directly, inspired by the architectural pattern behind the open-source [page-agent](https://github.com/alibaba/page-agent) library. The "Decide" step has two real, swappable interpreters: a zero-setup rule-based parser (default) and an optional on-device AI mode that calls a real local model — Chrome's built-in Prompt API (Gemini Nano, no download) or, as a fallback, WebLLM (a small open-weight model downloaded once and run locally via WebGPU). Both interpreters feed the same guardrail/execute/trace pipeline, so switching between them isolates exactly one variable: how good the "Decide" step is.

## Learning Objectives

- Explain the observe-decide-act-result loop that browser-agent frameworks use to operate a UI.
- Compare text/DOM-based grounding (no screenshots) against vision-based agent approaches.
- Evaluate the build-vs-buy tradeoff between a custom in-page agent and frameworks like Stagehand, browser-use, or Nanobrowser.
- Identify where a human-in-the-loop guardrail belongs when an agent can take destructive actions.
- Run the same command through the rule-based parser and a real on-device model, and explain concretely why one succeeds where the other fails.

## Run Modes

- Browser

## Expected Setup / Startup Time

- Starts immediately in browser with no installs, no API keys, and classroom-safe defaults.

## Demo Type

- Interactive browser demo

## Files in This Folder

- `app.js`
- `index.html`
- `about.html`
- `README.md`
- `style.css`

## How To Run

- Browser: open `index.html`.

## How To Use The Demo

1. Click an example command chip, or type your own (e.g. "Resolve ticket 101").
2. Watch the Agent Trace panel's four steps: Observe, Decide, Act, Result.
3. Try a destructive command (resolve/escalate) with the guardrail on, then confirm or cancel it.
4. Turn the guardrail off and re-run the same command to see it execute immediately.
5. Try a command the rule-based parser can't handle (e.g. "the customer paying twice needs this fixed"), note the "no confident match" result, then switch **Command interpreter** to "On-device AI" and try the exact same command.
6. Check the "On-device AI status" panel — a "Not supported" result is a real, honest capability check (Chrome version / WebGPU support vary), not a bug.

## Inputs

- `Command input` — the natural-language instruction given to the agent.
- `Command interpreter` — switches the "Decide" step between the rule-based parser and on-device AI. Selecting on-device AI triggers a one-time capability check (and possibly a model download); nothing loads until you choose it.
- `Safety guardrail` — toggles whether destructive actions (resolve, escalate) pause for human confirmation before running, regardless of which interpreter decided the action.

## Buttons / Actions

- `Run Agent` executes the observe-decide-act-result loop once for the current command.
- `Confirm Action` / `Cancel` appear only when the guardrail intercepts a destructive action.
- `Reset Demo` restores the ticket queue, action counter, guardrail, and interpreter to their starting state. An already-loaded on-device model stays in memory — it won't re-download.

## Outputs

- `Agent Trace` shows the four-step loop: how many elements were observed, which action was decided (or why none matched, including the model's raw response when using on-device AI), what DOM mutation was performed, and the resulting ticket state.
- `On-device AI status` shows which backend is active (Chrome built-in AI, WebLLM, or unavailable) and download progress when applicable.
- `Support Ticket Queue` reflects the live effect of every agent action, and remains directly clickable for comparison.

## What To Notice

- The rule-based parser will fail on phrasings a real LLM would handle easily — that gap is the honest cost of a zero-setup, zero-API-key teaching demo. Switching to on-device AI narrows (but doesn't eliminate) that gap.
- The guardrail step is what separates "agent that suggests an action" from "agent that silently takes it" — a real product decision, not just a UI toggle, and it applies identically to both interpreters.
- The Observe step reads the *live* DOM (via `data-agent-id`/`data-agent-label` attributes), not a hardcoded script — try resolving a ticket by hand first, then ask the agent to act on the resulting state.
- The on-device AI path parses the model's JSON response defensively: malformed JSON, a hallucinated ticket ID, or an off-schema action all degrade to a visible "no confident match" instead of crashing, and the model's raw text is HTML-escaped before being shown in the trace log since it's untrusted output.

## On-device AI backends

| Backend | How it works | Requirement | Download |
|---|---|---|---|
| Chrome built-in AI | `LanguageModel` / `window.ai.languageModel` Prompt API, backed by Gemini Nano | Recent Chrome, may need a flag enabled | None managed by this page |
| WebLLM (fallback) | `@mlc-ai/web-llm`, loaded from a CDN, runs `Qwen2.5-0.5B-Instruct` locally | WebGPU-capable browser | ~300-500MB the first time, cached after |
| Rule-based (default) | Regex/keyword parser in `app.js` | None | None |

If neither on-device backend is available, the demo reports that clearly in the status panel and the agent falls back to reporting "not available" rather than silently doing nothing.

## Framework comparison (build vs. buy)

| Framework | Architecture | Needs | Live-demo fit |
|---|---|---|---|
| [Stagehand](https://github.com/browserbase/stagehand) (Browserbase) | Node SDK, CDP-based | Browserbase account + LLM API key | Poor — needs a backend and paid keys |
| [browser-use](https://github.com/browser-use/browser-use) | Python + Playwright | Python 3.11+, LLM API key | Poor — Python backend, not static-hostable |
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | Chrome extension, multi-agent | Extension install + LLM API key (or local Ollama) | Partial — real production pattern, needs an install |
| [page-agent](https://github.com/alibaba/page-agent) (this demo's inspiration) | Pure in-page JS, no backend | Any LLM endpoint you point it at | Best — just JavaScript in a page |

## Related Demos or Course Context

- Course path: [AI/ML Workflows](../../courses/ai-ml-workflows.html)
- Related demo: [Copilot Kit](../CopilotKitDemo/about.html)
- Related demo: [AI Workflow](../AIWorkflowDemo/about.html)

## Attribution

Created by **Professor Vinaya Sathyanarayana** as part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents).
Attribution email: `vinallcontact@gmail.com`

Architectural pattern inspired by the MIT-licensed [alibaba/page-agent](https://github.com/alibaba/page-agent) project. No code from that project is reused here.
