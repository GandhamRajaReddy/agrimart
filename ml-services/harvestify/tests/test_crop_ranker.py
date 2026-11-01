import numpy as np
import pytest

from app import inference
from scripts import train_crop_ranker


class FakeRanker:
    def predict_proba(self, frame):
        assert list(frame.columns) == train_crop_ranker.FEATURES
        return np.array([[0.2, 0.8], [0.7, 0.3]])


def test_training_features_exclude_target_and_post_outcome_columns():
    assert not (set(train_crop_ranker.FEATURES) & train_crop_ranker.FORBIDDEN_FEATURES)
    assert train_crop_ranker.TARGET not in train_crop_ranker.FEATURES


def test_crop_prediction_ranks_candidates_without_claiming_production(monkeypatch):
    monkeypatch.setattr(inference.registry, 'crop_model', FakeRanker())
    monkeypatch.setattr(inference.registry, 'crop_feature_columns', train_crop_ranker.FEATURES)
    request = {
        'state': 'Karnataka', 'district': 'Mandya', 'year': 2025, 'month': 7,
        'season': 'Kharif', 'latitude': 12.52, 'longitude': 76.9,
        'climate_zone': 'Tropical', 'rainfall_mm': 700, 'temperature_c': 28,
        'humidity_pct': 70, 'soil_ph': 6.5, 'organic_carbon_pct': 0.6,
        'nitrogen_kg_ha': 180, 'phosphorus_kg_ha': 25, 'potassium_kg_ha': 200,
        'soil_moisture_pct': 35, 'irrigation_type': 'Canal',
        'candidates': [
            {'crop': 'Rice', 'crop_duration_days': 120, 'water_requirement': 'High',
             'mandi_modal_price_inr_qtl': 2200, 'price_volatility_30d_pct': 20,
             'mandi_arrivals_qtl_day': 300, 'demand_index_0_1': 0.7,
             'nearest_mandi_distance_km': 15, 'competitor_crop_area_ha': 1000},
            {'crop': 'Groundnut', 'crop_duration_days': 110, 'water_requirement': 'Medium',
             'mandi_modal_price_inr_qtl': 5000, 'price_volatility_30d_pct': 15,
             'mandi_arrivals_qtl_day': 100, 'demand_index_0_1': 0.6,
             'nearest_mandi_distance_km': 20, 'competitor_crop_area_ha': 500},
        ],
    }
    result = inference.crop_prediction(request)
    assert [item['crop'] for item in result['ranked_candidates']] == ['Rice', 'Groundnut']
    assert result['demo_only'] is True
    assert result['production_recommendations_enabled'] is False
    assert result['dataset_source'] == 'SYNTHETIC'


def test_crop_prediction_fails_when_model_is_missing(monkeypatch):
    monkeypatch.setattr(inference.registry, 'crop_model', None)
    with pytest.raises(RuntimeError, match='crop_model_unavailable'):
        inference.crop_prediction({})