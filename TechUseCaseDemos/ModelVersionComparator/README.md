# Model Version Comparator

## Learning Objectives
- Compare model versions using key performance metrics
- Understand trade-offs between accuracy and latency
- Learn to make data-driven deployment decisions

## How to Run
1. Open `index.html` in a browser
2. Modify Model A and Model B parameters
3. Click "Compare Models"
4. Review the side-by-side comparison and recommendation

## Metrics Compared
- **Accuracy**: Overall correctness
- **Precision**: True positive rate among positive predictions
- **Recall**: True positive rate among actual positives
- **Latency**: Response time in milliseconds

## Decision Guidance
The tool provides recommendations based on:
- 3+ improvements: Promote to production
- 2 improvements: Run A/B tests
- Fewer improvements: Keep current model

## Attribution
This demo is part of [KateelLearningDemosToStudents](https://github.com/VinayaSharada/KateelLearningDemosToStudents) by Professor Vinaya Sathyanarayana.

**Educational Use Only** - For usage guidelines, see the main repository.