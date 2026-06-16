# Quality Function Deployment (QFD) — House of Quality Demo

Interactive demo implementing the classic **House of Quality** (HoQ) matrix for prioritizing AI features using Quality Function Deployment methodology.

## Learning Objectives

- Understand the full House of Quality structure and its six rooms
- Learn how to translate customer requirements (WHATs) into technical requirements (HOWs)
- Explore weighted importance scoring and feature prioritization
- Practice competitive benchmarking (Us vs Them)
- Understand TR-TR correlation via the roof matrix

## How to Run

1. Open `index.html` in any modern browser (no server required)
2. Edit customer/technical requirements in the top panels
3. Click relationship cells in the matrix to cycle: blank → △ Weak (1) → ○ Medium (3) → ● Strong (9)
4. Click roof (triangle) cells to cycle correlations: blank → + → ++ → - → --
5. Adjust importance weights and improvement directions
6. Review auto-calculated priority scores and rankings

## House of Quality Sections

| Section | Description |
|---------|-------------|
| **Roof** (triangle) | Technical requirement correlations (+, ++, -, --) |
| **Left wall** | Customer requirements (WHATs) with importance weights (1-5) |
| **Ceiling** | Technical requirements (HOWs) with improvement direction (▲▼◎) |
| **Body** | Relationship matrix (●=9 strong, ○=3 medium, △=1 weak) |
| **Right wall** | Competitive assessment (Us vs Them, 1-5 scale) |
| **Basement** | Technical importance scores, relative weights, and targets |

## Key Concepts Demonstrated

- **Customer Requirements (WHATs)**: What customers need from the AI system
- **Technical Requirements (HOWs)**: Engineering capabilities to deliver those needs
- **Relationship Matrix**: Strength of connection between each WHAT and HOW
- **Weighted Scoring**: importance × relationship strength, summed per HOW
- **Roof Correlations**: Synergies and conflicts between technical requirements
- **Competitive Assessment**: How our solution compares to alternatives
- **Prioritization**: Data-driven ranking of where to invest engineering effort
