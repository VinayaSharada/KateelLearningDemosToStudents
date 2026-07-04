# AI Page Agent

## Overview

An in-page agent that reads a support ticket queue as text (no screenshots, no vision model) and acts on it directly, inspired by the architectural pattern behind the open-source [page-agent](https://github.com/alibaba/page-agent) library. A rule-based command parser stands in for an LLM call so the demo runs with zero setup and no API key — the "Decide" step's occasional misses are an intentional teaching point about that tradeoff.

## Learning Objectives

- Explain the observe-decide-act-result loop that browser-agent frameworks use to operate a UI.
- Compare text/DOM-based grounding (no screenshots) against vision-based agent approaches.
- Evaluate the build-vs-buy tradeoff between a custom in-page agent and frameworks like Stagehand, browser-use, or Nanobrowser.
- Identify where a human-in-the-loop guardrail belongs when an agent can take destructive actions.

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
5. Try a command the parser can't handle (e.g. "do a backflip") and discuss what a real LLM would do differently.

## Inputs

- `Command input` — the natural-language instruction given to the agent.
- `Safety guardrail` — toggles whether destructive actions (resolve, escalate) pause for human confirmation before running.

## Buttons / Actions

- `Run Agent` executes the observe-decide-act-result loop once for the current command.
- `Confirm Action` / `Cancel` appear only when the guardrail intercepts a destructive action.
- `Reset Demo` restores the ticket queue, action counter, and guardrail to their starting state.

## Outputs

- `Agent Trace` shows the four-step loop: how many elements were observed, which action was decided (or why none matched), what DOM mutation was performed, and the resulting ticket state.
- `Support Ticket Queue` reflects the live effect of every agent action, and remains directly clickable for comparison.

## What To Notice

- The rule-based parser will fail on phrasings a real LLM would handle easily — that gap is the honest cost of a zero-setup, zero-API-key teaching demo.
- The guardrail step is what separates "agent that suggests an action" from "agent that silently takes it" — a real product decision, not just a UI toggle.
- The Observe step reads the *live* DOM (via `data-agent-id`/`data-agent-label` attributes), not a hardcoded script — try resolving a ticket by hand first, then ask the agent to act on the resulting state.

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
