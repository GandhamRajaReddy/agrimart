# Canonical crop recommendation benchmark pipeline

## Dataset

Place the public Crop Recommendation CSV at:

`ml-services/harvestify/data/training/Crop_recommendation.csv`

Expected schema and order:

`N, P, K, temperature, humidity, ph, rainfall, label`

The training script validates 2,200 rows, 22 expected classes with 100 rows each, numeric finite features, no missing values, and no duplicate rows or feature vectors. It records the source file SHA-256 in its output metadata.

This commonly reused public Kaggle dataset is a benchmark, not a verified Karnataka field dataset. Its labels and measurements must not be represented as local agronomic ground truth.

## Train

From PowerShell:

```powershell
cd D:\AgriMart\ml-services\harvestify
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
python scripts\train_crop_recommendation.py
```

The script performs a stratified 80/20 split (seed 42 by default), compares a most-frequent DummyClassifier, Random Forest, and Extra Trees using five-fold macro-F1 cross-validation on the training partition, selects the best non-dummy candidate, and evaluates it once on the untouched holdout set.

Generated local artifacts:

- `models/crop/crop_recommendation_pipeline.joblib`
- `models/crop/crop_recommendation_metrics.json`
- `models/crop/crop_recommendation_metadata.json`

The dataset and joblib artifacts are ignored by Git. The script and tests are version-controlled so training is reproducible from the same dataset and pinned environment.

## API boundaries

Harvestify exposes a benchmark-only endpoint:

`POST /api/v1/crop/benchmark-predict`

The authenticated Django gateway exposes:

`POST /api/v1/ml/crop/benchmark-predict/`

The request reuses the existing seven-field crop schema: nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall. The response includes a top-three ranking and explicitly marks the output as a public benchmark result.

The production-style endpoints `/api/v1/crop/recommend` and `/api/v1/ml/crop/recommend/` remain fail-closed. A public benchmark model is not sufficient to enable farmer-facing crop recommendations. The synthetic candidate ranker remains separate and is not used by this classifier.

## Validation

Run the Harvestify tests:

```powershell
cd D:\AgriMart\ml-services\harvestify
.\.venv\Scripts\Activate.ps1
python -m pytest tests -q
```

Run Django validation:

```powershell
cd D:\AgriMart\backend\django
.\.venv\Scripts\Activate.ps1
python manage.py check
python manage.py test
```

Before any production enablement, obtain regionally representative field data, run temporal and geographic validation, review per-crop metrics with agricultural experts, and explicitly approve the production gate.
