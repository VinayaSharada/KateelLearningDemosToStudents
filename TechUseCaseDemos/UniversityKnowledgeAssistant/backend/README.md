# University Knowledge Assistant - Backend Pipeline

Complete data injection pipeline for web scraping, PDF extraction, and knowledge graph building.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Website   │────▶│  Scrapling   │────▶│  Docling    │────▶│ FalkorDB     │
│ (bits-pilani)│     │  (Crawler)   │     │  (PDF Extract)│     │  (Graph)     │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                                                    │
                                                    ▼
                                                PageIndex
                                                    │
                                                    ▼
                                            Local SLM (llama.cpp)
```

## Quick Start

```bash
# 1. Install dependencies
pip install scrapling docling falkordb-client python-dotenv

# 2. Start FalkorDB
docker run -d -p 9292:9292 falkordb/falkordb

# 3. Run the pipeline
python backend/data_pipeline.py --url https://www.bits-pilani.ac.in/
```

## File Structure

```
UniversityKnowledgeAssistant/
├── backend/
│   ├── data_pipeline.py      # Main pipeline
│   ├── scrapers/             # Web scrapers
│   ├── extractors/           # PDF/doc extractors
│   ├── processors/           # Data processors
│   └── config.py             # Configuration
├── frontend/                 # Browser demo files
├── docs/                     # Documentation
└── README.md
```

## Business decision

Use this demo or hub to make the central decision in University Knowledge Assistant - Backend Pipeline explicit, understand the main trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
