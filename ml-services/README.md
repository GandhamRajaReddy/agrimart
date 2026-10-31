# AgriMart ML services

## Harvestify service

The Harvestify FastAPI service exposes exactly two capabilities:

- Plant disease classification using the reviewed ResNet9/PyTorch artifact.
- Fertilizer reference-table comparison using `data/fertilizer.csv`.

It does **not** provide crop recommendation or market-price forecasting. Those capabilities must not be routed to Harvestify.

Binary model artifacts are intentionally excluded from Git. Readiness reports each capability and returns HTTP 503 until both required artifacts/data are available. Predictions must never be fabricated when an artifact is missing.

Run in a dedicated Python 3.11 virtual environment:

```powershell
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8100
```

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`
- Fertilizer comparison: `POST /api/v1/fertilizer/recommend`
- Disease detection: `POST /api/v1/disease/predict`

Keep this service private behind the Django gateway. Do not expose database credentials or the model port publicly.

## Separate AgriMart price-intelligence capability

Karnataka mandi price ingestion, 30/60/90-day price forecasting, and profitability-ranked crop planning are a separate AgriMart service. They require verified historical market observations, yield/cost inputs, and temporal backtesting. No market forecast or profit estimate is enabled until those inputs are available and validated.

Review the upstream Harvestify GPL-3.0 license obligations before redistributing adapted code or assets.
