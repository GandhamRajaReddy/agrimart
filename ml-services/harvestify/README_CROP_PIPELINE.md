# AgriMart crop candidate-ranking prototype

## Important data limitation

The supplied workbook is explicitly synthetic. Its crop-selection target is generated from a simulated composite score, not measured farmer outcomes, verified agronomic suitability, government market prices, IMD weather, or laboratory soil measurements.

This pipeline is for software integration, preprocessing, model-training, and API prototyping only. The model artifact and API response are marked demo_only and SYNTHETIC. Do not present its scores as agricultural advice, yield forecasts, market forecasts, or profit estimates.

## Dataset placement

Place the supplied workbook at:

data/training/agrimart_synthetic_market_mandi_intelligence.xlsx

Alternatively pass its path using --workbook. The workbook is not committed as a model artifact. Keep farmer data and production datasets out of source control unless approved.

## Environment

From ml-services/harvestify:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
```

## Train

Default training scope is Karnataka, matching the current AgriMart regional rollout. The script uses 2021–2024 for training and 2025 as a chronological holdout test. Candidate rows remain grouped by state, district, year, and season for group-level ranking metrics.

```powershell
python scripts\train_crop_ranker.py
```

To experiment on all six synthetic states:

```powershell
python scripts\train_crop_ranker.py --allow-non-karnataka
```

Artifacts:
- models/crop/crop_ranker.joblib: preprocessing pipeline, classifier, and metadata.
- models/crop/crop_ranker_metrics.json: chronological holdout metrics and leakage exclusions.

The script excludes target-derived fields, including recommended_crop_label, best_crop_for_district_season, recommendation_rank, agronomic_market_score, gross revenue, net return, margin, yield, and estimated cost.

## API

After training, restart Harvestify. The authenticated Django gateway exposes:

POST /api/v1/ml/crop/recommend/

The gateway forwards the structured request to Harvestify POST /api/v1/crop/recommend. The request includes farmer context and one to ten candidate crops with their candidate-level crop/market attributes. The response returns candidate ranking scores and an explicit synthetic/demo-only warning.

The request fields must be supplied from measured or otherwise verified sources in any future production integration. Do not substitute guessed soil values, market prices, weather, or mandi statistics.

## Evaluation and production gate

Review both row-level metrics and group-level top-1/top-3 hit rates in the metrics JSON. These scores only measure agreement with the workbook's synthetic labels. They are not evidence of real-world performance.

Before any farmer-facing production release:
1. Replace synthetic labels with independently observed agronomic and farmer outcome data.
2. Record source, timestamp, geography, units, and provenance for every input.
3. Use time-based and geographic holdouts; prevent repeated district/season observations leaking across folds.
4. Compare against agronomist and simple agronomic baselines.
5. Evaluate crop-specific precision/recall, top-k utility, calibration, and subgroup performance.
6. Obtain agricultural expert review and explicitly approve production release.