import json

import numpy as np
import pandas as pd
import pytest

from app import inference
from app.model_registry import Registry
from scripts import train_crop_recommendation as training


def test_dataset_validation_accepts_verified_shape_and_balanced_classes(tmp_path):
    rows = []
    for class_index, label in enumerate(sorted(training.EXPECTED_CLASSES)):
        for index in range(100):
            base = class_index * 100 + index
            rows.append({
                "N": base, "P": base + 1, "K": base + 2,
                "temperature": 20.0, "humidity": 60.0, "ph": 6.5,
                "rainfall": 100.0, "label": label,
            })
    path = tmp_path / "crop.csv"
    pd.DataFrame(rows, columns=training.FEATURE_COLUMNS + [training.TARGET_COLUMN]).to_csv(
        path, index=False
    )
    frame, digest = training.load_and_validate_dataset(path)
    assert frame.shape == (2200, 8)
    assert len(digest) == 64


def test_dataset_validation_rejects_duplicate_feature_vectors(tmp_path):
    rows = []
    for label in sorted(training.EXPECTED_CLASSES):
        for index in range(100):
            rows.append({
                "N": index, "P": index + 1, "K": index + 2,
                "temperature": 20.0, "humidity": 60.0, "ph": 6.5,
                "rainfall": 100.0, "label": label,
            })
    rows[-1] = dict(rows[0], label=sorted(training.EXPECTED_CLASSES)[-1])
    path = tmp_path / "duplicate.csv"
    pd.DataFrame(rows, columns=training.FEATURE_COLUMNS + [training.TARGET_COLUMN]).to_csv(
        path, index=False
    )
    with pytest.raises(ValueError, match="duplicate"):
        training.load_and_validate_dataset(path)


def test_candidate_models_are_reproducible_and_include_baseline():
    candidates = training.build_candidates()
    assert set(candidates) == {"dummy_most_frequent", "random_forest", "extra_trees"}
    assert candidates["random_forest"].named_steps["classifier"].random_state == 42
    assert candidates["extra_trees"].named_steps["classifier"].random_state == 42


class FakeCropClassifier:
    classes_ = np.array(["maize", "rice", "wheat"])

    def predict(self, frame):
        assert list(frame.columns) == training.FEATURE_COLUMNS
        return np.array(["rice"])

    def predict_proba(self, frame):
        return np.array([[0.2, 0.7, 0.1]])


def test_benchmark_prediction_uses_existing_seven_feature_schema(monkeypatch):
    monkeypatch.setattr(inference.registry, "crop_benchmark_model", FakeCropClassifier())
    request = {
        "nitrogen": 90, "phosphorus": 42, "potassium": 43,
        "temperature": 25, "humidity": 80, "ph": 6.5, "rainfall": 200,
    }
    result = inference.crop_benchmark_prediction(request)
    assert result["prediction"] == "rice"
    assert result["benchmark_only"] is True
    assert result["production_recommendations_enabled"] is False
    assert result["top_predictions"][0]["crop"] == "rice"


def test_registry_refuses_benchmark_artifact_with_wrong_sklearn_version(tmp_path, monkeypatch):
    import app.model_registry as registry_module

    monkeypatch.setattr(registry_module, "MODEL_DIR", tmp_path)
    crop_dir = tmp_path / "crop"
    crop_dir.mkdir()
    metadata = {
        "dataset_source": "PUBLIC_KAGGLE_BENCHMARK",
        "benchmark_only": True,
        "production_recommendations_enabled": False,
        "feature_columns": training.FEATURE_COLUMNS,
        "scikit_learn_version": "0.0.invalid",
        "dataset_sha256": "a" * 64,
    }
    import joblib
    joblib.dump({"pipeline": FakeCropClassifier(), "metadata": metadata},
                crop_dir / "crop_recommendation_pipeline.joblib")
    (crop_dir / "crop_recommendation_metadata.json").write_text(
        json.dumps(metadata), encoding="utf-8"
    )
    registry = Registry()
    registry.load()
    assert registry.crop_benchmark_model is None
    assert "crop_benchmark_model_load_failed" in registry.errors
