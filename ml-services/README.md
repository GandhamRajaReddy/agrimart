# AgriMart Harvestify ML service

Independent FastAPI process for crop, fertilizer and plant-disease inference. Django communicates over HTTP and never imports ML libraries.

Required reviewed artifacts:
- models/crop/RandomForest.pkl
- models/disease/plant_disease_model.pth
- data/fertilizer.csv

Binary artifacts are intentionally not committed. Missing artifacts keep readiness false; predictions are never fabricated. Verify feature order, disease class order, architecture and preprocessing against exact training artifacts. Upstream Harvestify describes itself as a proof of concept and warns against definitive farming decisions. Review GPL-3.0 obligations before redistributing adapted code or assets.

Run in a dedicated Python 3.11 venv: install requirements.txt, then run uvicorn app.main:app --host 127.0.0.1 --port 8100.
Liveness: /health/live. Readiness: /health/ready.
Private deployment only; no database credentials or public model port.
