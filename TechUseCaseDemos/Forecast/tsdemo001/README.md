# Time Series Forecasting Demo (tsdemo001)

This demo demonstrates a simple time series forecasting workflow using synthetic data and an LSTM model.

## Overview

1. Generate synthetic time series data with trend, seasonality, and noise.
2. Visualize the data.
3. Prepare data for supervised learning (windowing).
4. Build and train a simple LSTM model.
5. Forecast and evaluate the model.
6. Plot actual vs predicted values.

## Dependencies

- numpy
- pandas
- matplotlib
- tensorflow
- scikit-learn

You can install them via:

```bash
pip install numpy pandas matplotlib tensorflow scikit-learn
```

## How to Run

```bash
python ts_demo.py
```

The script will generate:
- `synthetic_timeseries.png`: plot of the full synthetic series
- `training_history.png`: training and validation loss/MAE curves
- `forecast_plot.png`: actual vs forecast on test set
- `ts_forecast_model.h5`: trained LSTM model

## Notes

- The demo uses a fixed random seed for reproducibility.
- The model is intentionally simple for educational purposes.
- Adjust parameters like window size, number of epochs, or model architecture to experiment.

## Related

See the [Demo Index](../DEMO_INDEX.md) for other forecasting demos.

## Business decision

Use this demo or hub to make the central decision in Time Series Forecasting Demo (tsdemo001) explicit, understand the main trade-offs, and decide how you would adapt the workflow, assumptions, or outputs in your own context.

## What you can enhance on your own

- Add your own scenarios, datasets, thresholds, stakeholder views, or decision rules once the base workflow is clear.
- Add exports, approvals, exception routes, or facilitator prompts if you want to use the demo beyond a classroom walkthrough.
- Extend the demo with organization-specific terminology or visuals while keeping the core decision logic easy to inspect.

## How to adapt this demo to your use case

- Replace the sample assumptions, data, or examples with sanitized inputs from your own organization or course context.
- Revalidate thresholds, metrics, and interpretations with the relevant domain owners before operational use.
- Keep the demo as a decision-support and learning aid until the workflow is tested end to end in your setting.
