# AgriMart Repository Audit — 2026-11-01

**Repository:** `GandhamRajaReddy/agrimart`  
**Audited ref:** `main`  
**Audited commit:** `28738f28de838cd8ac99ff8e558ae0897f986702`  
**Scope:** Django API, Harvestify FastAPI service, market-intelligence frontend, ML training artifacts, CI and deployment manifests.

## Executive summary

AgriMart has a useful modular foundation: Django REST API v1, a separately deployed FastAPI/Harvestify service, a market-intelligence Django app, React feature modules, and CI workflows. The current market-intelligence implementation is deliberately fail-closed. It does **not** yet provide live mandi prices, historical market observations, price forecasts, or production crop-profit rankings.

The most important next step is to implement and validate the market-data ingestion and persistence layer before enabling forecasts or crop-plan responses. Synthetic workbook labels and public crop-recommendation benchmark data must remain clearly separated from verified market observations and field-validated agronomic recommendations.

No production recommendation or price forecast should be enabled merely by setting an environment flag.

## Findings

### P0 — Production Django secret key has an unsafe fallback

**Evidence:** `backend/django/config/settings/base.py` defines `DJANGO_SECRET_KEY` with a hard-coded development fallback. `production.py` disables DEBUG but does not reject that fallback.

**Risk:** A production deployment missing its secret environment variable could start with a publicly known signing key.

**Branch remediation:** Implemented in `backend/django/config/settings/production.py` on this audit branch. Production settings now raise `ImproperlyConfigured` if the configured key is missing/empty or equals the known development fallback. Commit: `bf2e3af9efb56b623166b3fba05f20a1ea59a922`. This change has not yet been executed in CI or a production-like environment.

### P1 — Market intelligence has no persisted market data or ingestion pipeline

**Evidence:**
- `backend/django/apps/market/models.py` contains no market models.
- `backend/django/apps/market/api_views.py` exposes only readiness status and a crop-plan endpoint that intentionally returns HTTP 503.
- `backend/django/apps/market/urls.py` has no observations, history, forecast, or ingestion endpoints.
- `DATA_GOV_IN_API_KEY` is configured in settings, but no market ingestion client, scheduled job, source-resource configuration, deduplication, or provenance store is present.

**Risk:** The UI cannot display actual mandi prices or historical trends. There is no auditable source data from which to train or backtest a forecast.

**Required remediation:** Add an idempotent, retryable AGMARKNET/data.gov.in ingestion pipeline; persist source, commodity, variety, market, arrival date, min/modal/max price, arrivals/units, source record ID, retrieval time and raw-source provenance. Validate units, date ranges, duplicates and outliers. Expose read-only, paginated observations only after successful ingestion.

### P1 — No verified training dataset or trained production market model is committed

**Evidence:**
- The repository tree contains no `ml-services/harvestify/data/training/` workbook or market-history dataset.
- `models/crop/` and `models/disease/` contain only `.gitkeep` placeholders.
- `train_crop_ranker.py` expects `data/training/agrimart_synthetic_market_mandi_intelligence.xlsx`, which is not present in the audited repository tree.
- The ranker explicitly labels its data as `SYNTHETIC` and `demo_only`.
- The public crop benchmark is explicitly marked benchmark-only and the farmer-facing crop recommendation route returns HTTP 503.

**Risk:** Model training cannot be reproduced from this checkout, and neither synthetic nor public benchmark performance is evidence of real-world Karnataka market or yield accuracy.

**Required remediation:** Version or externally register immutable dataset snapshots with checksums and provenance; provide a reproducible acquisition/validation command; preserve a temporal holdout; evaluate forecast errors by commodity/market/horizon against naïve baselines; document coverage and confidence intervals. Keep production flags disabled until independent acceptance criteria are met.

### P1 — Market frontend API modules are placeholders, not data APIs

**Evidence:**
- `frontend/src/features/market-intelligence/api/priceApi.js`, `forecastApi.js`, and `riskApi.js` all return the market status response.
- Feature page modules currently re-export the single `MarketIntelligencePage`.
- The current page correctly describes its APMC directory as reference-only and does not claim that it is a live price feed.

**Risk:** Future screens could accidentally treat a readiness payload as price, forecast, or risk data if these wrappers are used as if they were implemented APIs.

**Required remediation:** Keep status as a separate API contract. Add typed/validated API clients only when corresponding Django endpoints exist; distinguish loading, empty, unavailable and stale-data states. Do not fabricate charts from status fields.

### P2 — ML readiness can report HTTP 200 while the service is degraded

**Evidence:** `app/model_registry.py` defines `ready` as `any(self.features.values())`; `/health/ready` returns HTTP 200 whenever at least one feature is loaded, while the response body can say `degraded`. The Docker health check only checks the HTTP status.

**Risk:** Container orchestration can mark a partially functional ML service healthy even when a required feature is unavailable.

**Required remediation:** Define readiness per deployment contract. Either make the overall readiness check return non-2xx when required features are absent, or expose distinct liveness and feature-readiness checks and configure orchestration against the required feature set.

### P2 — Production dependency manifest is incomplete if used as a standalone install file

**Evidence:** `backend/django/requirements/base.txt` is empty, while `requirements/production.txt` contains only `requests==2.32.3`. The full Django runtime dependencies currently live in `requirements/development.txt`.

**Risk:** A production deployment installing only `requirements/production.txt` will not install Django, DRF, database, settings, and other runtime dependencies.

**Required remediation:** Move runtime-pinned packages into `base.txt`; have development and production manifests include the base manifest, then add environment-specific packages separately. Verify the actual deployment build command before changing the manifests.

### P2 — Backend CI does not exercise the full API or ML service

**Evidence:** `.github/workflows/backend-ci.yml` runs Django checks, migration checks, and tests for `apps.accounts`, `apps.locations`, and `apps.market`. It does not run the other Django app suites or Harvestify tests/build.

**Risk:** Regressions in ML gateway, orders, procurement, payments, or cross-service contracts can pass the current backend workflow.

**Required remediation:** Add a separate ML-service CI job (install pinned requirements, run pytest and import/health checks); expand Django tests by app and add API contract tests. Add frontend tests when meaningful component/service tests are introduced.

## Existing safeguards worth preserving

- Farmer-facing crop recommendation currently fails closed rather than returning an unvalidated prediction.
- Synthetic candidate ranking and public benchmark inference are explicitly labelled demo/benchmark-only.
- The crop-ranker training script uses a temporal split and excludes known target-leakage columns.
- The market status endpoint does not claim historical data or forecasts are available.
- The market UI clearly distinguishes the Karnataka APMC reference directory from a live feed.
- Django-to-ML calls are isolated behind a gateway with connect/read timeouts and a controlled 503 response.

## Recommended implementation order

1. Harden production settings and make runtime dependency installation deterministic.
2. Implement market observation schema, migrations, source adapter, ingestion command and provenance.
3. Add fixture-based ingestion tests, idempotency tests, validation tests and API contract tests.
4. Connect the market UI to real, paginated observations with explicit freshness/source metadata.
5. Build per-market/per-commodity time-series baselines; backtest chronologically and compare to naïve baselines.
6. Add forecast endpoints only after validation gates pass.
7. Add profitability ranking only after verified yield, input-cost, crop-duration and market-price data are available; retain uncertainty and assumptions in every result.

## Audit limitations

This is a source-tree and targeted-file audit of the audited commit. No repository checkout was executed in a local runtime, no CI workflow was run, no production environment was inspected, and no live AGMARKNET/data.gov.in credentials or source records were available. Findings about deploy-time dependency installation are therefore conditional on the deployment command. This report does not certify production readiness.


## Changes made on the audit branch

- Added this audit report.
- Added a production-startup guard that rejects the known development Django signing-key fallback.
- No market ingestion, forecast, or profitability endpoint has been enabled because verified source records and the required model-validation evidence are not present in the repository.
