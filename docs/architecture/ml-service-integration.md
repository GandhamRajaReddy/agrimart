# ML service isolation

React calls authenticated Django routes. Django validates requests and proxies to private Harvestify FastAPI. Django never imports ML libraries, model artifacts or inference modules.

Django routes:
- POST /api/v1/ml/crop/recommend/
- POST /api/v1/ml/fertilizer/recommend/
- POST /api/v1/ml/disease/predict/
- GET /api/v1/ml/health/

Internal ML routes:
- POST /api/v1/crop/recommend
- POST /api/v1/fertilizer/recommend
- POST /api/v1/disease/predict
- GET /health/live and /health/ready

Configure ML_SERVICE_ENABLED, ML_SERVICE_URL, ML_CONNECT_TIMEOUT and ML_READ_TIMEOUT in Django. Configure HARVESTIFY_MODEL_DIR, HARVESTIFY_DATA_DIR and HARVESTIFY_MAX_IMAGE_BYTES in the ML process.

Django startup, commerce transactions and core health checks must not depend on ML readiness. Gateway requests have explicit timeouts and return a feature-scoped 503 when ML is down. Liveness is independent of artifacts; readiness requires model artifacts. Keep the ML port private. Add shared-cache/Redis circuit breaking and DRF throttling before production traffic; do not use per-worker in-memory breakers.

Binary model artifacts are not committed. Install reviewed upstream artifacts and verify crop feature order, disease class order, architecture, transforms and checkpoint compatibility. Harvestify describes itself as a proof of concept and warns against definitive farming decisions. Review GPL-3.0 obligations before redistributing adapted code or assets.
