"""Reproducibly train the seven-feature crop benchmark classifier.

This is the public Kaggle crop-recommendation benchmark, not a Karnataka-
validated agronomic model. The generated artifact remains benchmark-only;
the production recommendation endpoint stays fail-closed.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import platform
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATASET = ROOT / "data" / "training" / "Crop_recommendation.csv"
MODEL_PATH = ROOT / "models" / "crop" / "crop_recommendation_pipeline.joblib"
METRICS_PATH = ROOT / "models" / "crop" / "crop_recommendation_metrics.json"
METADATA_PATH = ROOT / "models" / "crop" / "crop_recommendation_metadata.json"

FEATURE_COLUMNS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET_COLUMN = "label"
EXPECTED_CLASSES = {
    "apple", "banana", "blackgram", "chickpea", "coconut", "coffee",
    "cotton", "grapes", "jute", "kidneybeans", "lentil", "maize",
    "mango", "mothbeans", "mungbean", "muskmelon", "orange", "papaya",
    "pigeonpeas", "pomegranate", "rice", "watermelon",
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_and_validate_dataset(path: Path) -> tuple[pd.DataFrame, str]:
    if not path.is_file():
        raise FileNotFoundError(
            f"Dataset not found: {path}. Download the public Crop Recommendation "
            "CSV and place it at data/training/Crop_recommendation.csv."
        )
    frame = pd.read_csv(path)
    expected_columns = FEATURE_COLUMNS + [TARGET_COLUMN]
    if frame.columns.tolist() != expected_columns:
        raise ValueError(
            f"Expected columns in exact order {expected_columns}; "
            f"received {frame.columns.tolist()}."
        )
    if frame.shape != (2200, 8):
        raise ValueError(f"Expected 2200 rows and 8 columns; received {frame.shape}.")
    if frame.isna().any().any():
        raise ValueError("Dataset contains missing values.")
    if frame.duplicated().any():
        raise ValueError("Dataset contains duplicate rows.")
    if frame.duplicated(subset=FEATURE_COLUMNS).any():
        raise ValueError("Dataset contains duplicate feature vectors.")
    numeric = frame[FEATURE_COLUMNS].apply(pd.to_numeric, errors="coerce")
    if numeric.isna().any().any() or not np.isfinite(numeric.to_numpy(dtype=float)).all():
        raise ValueError("All seven feature columns must contain finite numeric values.")
    if set(frame[TARGET_COLUMN].astype(str).unique()) != EXPECTED_CLASSES:
        raise ValueError("Target labels do not match the expected 22 benchmark crops.")
    counts = frame[TARGET_COLUMN].value_counts()
    if not (counts == 100).all() or len(counts) != 22:
        raise ValueError("Expected exactly 100 observations for each of 22 crop classes.")
    frame[FEATURE_COLUMNS] = numeric
    frame[TARGET_COLUMN] = frame[TARGET_COLUMN].astype(str)
    return frame, sha256_file(path)


def build_candidates() -> dict[str, Pipeline]:
    def pipeline(estimator):
        return Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("classifier", estimator),
        ])

    return {
        "dummy_most_frequent": pipeline(
            DummyClassifier(strategy="most_frequent")
        ),
        "random_forest": pipeline(RandomForestClassifier(
            n_estimators=400,
            min_samples_leaf=1,
            max_features="sqrt",
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )),
        "extra_trees": pipeline(ExtraTreesClassifier(
            n_estimators=400,
            min_samples_leaf=1,
            max_features="sqrt",
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--test-size", type=float, default=0.20)
    parser.add_argument("--random-state", type=int, default=42)
    parser.add_argument("--cv-folds", type=int, default=5)
    args = parser.parse_args()
    if not 0.1 <= args.test_size <= 0.4:
        parser.error("--test-size must be between 0.1 and 0.4.")
    if args.cv_folds < 2 or args.cv_folds > 10:
        parser.error("--cv-folds must be between 2 and 10.")

    frame, dataset_hash = load_and_validate_dataset(args.dataset)
    X = frame[FEATURE_COLUMNS]
    y = frame[TARGET_COLUMN]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=args.test_size,
        random_state=args.random_state,
        stratify=y,
    )

    comparisons = {}
    candidates = build_candidates()
    for name, candidate in candidates.items():
        scores = cross_val_score(
            candidate, X_train, y_train,
            cv=args.cv_folds,
            scoring="f1_macro",
            n_jobs=1,
        )
        comparisons[name] = {
            "cv_macro_f1_mean": float(scores.mean()),
            "cv_macro_f1_std": float(scores.std()),
            "fold_scores": [float(score) for score in scores],
        }

    eligible = [name for name in comparisons if name != "dummy_most_frequent"]
    selected_name = max(
        eligible,
        key=lambda name: (comparisons[name]["cv_macro_f1_mean"], name),
    )
    selected_model = candidates[selected_name]
    selected_model.fit(X_train, y_train)
    predictions = selected_model.predict(X_test)
    probabilities = selected_model.predict_proba(X_test)
    class_order = selected_model.named_steps["classifier"].classes_.tolist()

    metrics = {
        "dataset": args.dataset.name,
        "dataset_source": "PUBLIC_KAGGLE_BENCHMARK",
        "dataset_sha256": dataset_hash,
        "rows": int(len(frame)),
        "class_count": int(y.nunique()),
        "class_distribution": {
            str(label): int(count) for label, count in y.value_counts().sort_index().items()
        },
        "feature_columns": FEATURE_COLUMNS,
        "target_column": TARGET_COLUMN,
        "split": {
            "strategy": "stratified_train_test_split",
            "test_size": args.test_size,
            "random_state": args.random_state,
            "train_rows": int(len(X_train)),
            "test_rows": int(len(X_test)),
        },
        "cross_validation": {
            "folds": args.cv_folds,
            "selection_metric": "macro_f1",
            "candidate_results": comparisons,
            "selected_model": selected_name,
        },
        "holdout_metrics": {
            "accuracy": float(accuracy_score(y_test, predictions)),
            "balanced_accuracy": float(balanced_accuracy_score(y_test, predictions)),
            "macro_f1": float(f1_score(y_test, predictions, average="macro")),
            "weighted_f1": float(f1_score(y_test, predictions, average="weighted")),
            "classification_report": classification_report(
                y_test, predictions, output_dict=True, zero_division=0
            ),
            "confusion_matrix": confusion_matrix(
                y_test, predictions, labels=class_order
            ).tolist(),
            "confusion_matrix_labels": class_order,
            "top_3_accuracy": float(
                np.mean([
                    actual in [class_order[i] for i in np.argsort(row)[-3:][::-1]]
                    for actual, row in zip(y_test.tolist(), probabilities)
                ])
            ),
        },
        "limitations": [
            "This is a public benchmark dataset, not a verified Karnataka field dataset.",
            "Metrics measure agreement with dataset labels, not real-world yield or profitability.",
            "Do not use this artifact as standalone farmer-facing crop advice.",
        ],
    }

    metadata = {
        "model_name": "agrimart-crop-recommendation-benchmark",
        "model_version": "1.0.0",
        "dataset_source": "PUBLIC_KAGGLE_BENCHMARK",
        "dataset_reference": "atharvaingle/crop-recommendation-dataset",
        "dataset_sha256": dataset_hash,
        "dataset_rows": int(len(frame)),
        "class_names": sorted(EXPECTED_CLASSES),
        "feature_columns": FEATURE_COLUMNS,
        "target_column": TARGET_COLUMN,
        "selected_estimator": selected_name,
        "scikit_learn_version": sklearn.__version__,
        "python_version": platform.python_version(),
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "production_recommendations_enabled": False,
        "benchmark_only": True,
    }
    artifact = {"pipeline": selected_model, "metadata": metadata}

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, MODEL_PATH)
    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    METADATA_PATH.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps({
        "model_path": str(MODEL_PATH),
        "metrics_path": str(METRICS_PATH),
        "metadata_path": str(METADATA_PATH),
        "selected_model": selected_name,
        "holdout_metrics": metrics["holdout_metrics"],
        "warning": "Public benchmark only; not Karnataka-validated agronomic advice.",
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
