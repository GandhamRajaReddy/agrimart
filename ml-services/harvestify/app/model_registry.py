import logging

import joblib
import sklearn
import torch

from app.config import MODEL_DIR
from app.disease_model import ResNet9, DISEASE_CLASSES

logger = logging.getLogger(__name__)


class Registry:
    def __init__(self):
        self.crop_model = None
        self.crop_metadata = {}
        self.crop_feature_columns = []
        self.disease_model = None
        self.errors = []

    def load(self):
        self.errors = []
        self.crop_model = None
        self.crop_metadata = {}
        self.crop_feature_columns = []
        crop = MODEL_DIR / "crop" / "crop_ranker.joblib"
        legacy_crop = MODEL_DIR / "crop" / "RandomForest.pkl"
        disease = MODEL_DIR / "disease" / "plant_disease_model.pth"

        if crop.is_file():
            try:
                artifact = joblib.load(crop)
                pipeline = artifact["pipeline"]
                metadata = artifact["metadata"]
                if metadata.get("dataset_source") != "SYNTHETIC" or not metadata.get("demo_only"):
                    raise ValueError("Crop ranker metadata is missing its synthetic/demo-only marker.")
                if metadata.get("scikit_learn_version") != sklearn.__version__:
                    raise ValueError(
                        "Crop artifact scikit-learn version mismatch: "
                        f"artifact={metadata.get('scikit_learn_version')}, runtime={sklearn.__version__}. Retrain the model."
                    )
                self.crop_model = pipeline
                self.crop_metadata = metadata
                self.crop_feature_columns = list(metadata["feature_columns"])
            except Exception:
                logger.exception("Crop ranker artifact load failed")
                self.errors.append("crop_model_load_failed")
        elif legacy_crop.is_file():
            logger.warning(
                "Ignoring legacy RandomForest.pkl: it was serialized with an incompatible "
                "scikit-learn version. Retrain from the supplied workbook."
            )
            self.errors.append("legacy_crop_artifact_incompatible")
        else:
            self.errors.append("crop_model_missing")

        if disease.is_file():
            try:
                model = ResNet9(3, len(DISEASE_CLASSES))
                state = torch.load(disease, map_location="cpu", weights_only=True)
                model.load_state_dict(state)
                model.eval()
                self.disease_model = model
            except Exception:
                logger.exception("Disease artifact load failed")
                self.errors.append("disease_model_load_failed")
        else:
            self.errors.append("disease_model_missing")

    @property
    def features(self):
        from app.config import DATA_DIR
        return {
            "crop": (
                self.crop_model is not None
                and self.crop_metadata.get("production_recommendations_enabled") is True
            ),
            "crop_demo": self.crop_model is not None,
            "fertilizer": (DATA_DIR / "fertilizer.csv").is_file(),
            "disease": self.disease_model is not None,
        }

    @property
    def ready(self):
        return any(self.features.values())


registry = Registry()
