# CopilotKit Agent Demo

## Learning Objectives
- Understand agentic AI workflows
- Learn streaming response patterns
- Explore tool integration for quantitative tasks
- Practice building AI agents

## How to Run
1. Open `index.html` in a browser
2. Type questions about finance/quant topics
3. See streaming responses (demo mode)
4. For full CopilotKit features, see the documentation

## Key Features

### CopilotKit Capabilities
- **Streaming**: Real-time response generation
- **Tools**: Function calling for calculations
- **Agents**: Multi-step reasoning workflows
- **Human-in-the-loop**: Intervention when needed

### For Full Functionality
This demo shows the integration pattern. To enable full CopilotKit features:

```bash
npm install @copilotkit/react-core @copilotkit/react-ui
```

Then connect to your backend with the desired LLM provider.

## Example Queries
- "Calculate Black-Scholes price for S=100, K=105, T=0.5, r=0.05, σ=0.2"
- "What's portfolio variance for 60% stocks (20% vol) and 40% bonds (5% vol)?"
- "Explain risk parity"

## Attribution
KateelLearningDemos - vinallcontact@gmail.com