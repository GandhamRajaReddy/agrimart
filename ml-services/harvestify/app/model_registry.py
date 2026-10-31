import logging

import torch

from app.config import DATA_DIR, MODEL_DIR
from app.disease_model import DISEASE_CLASSES, ResNet9

logger = logging.getLogger(__name__)


class Registry:
    """Load only the two capabilities actually provided by Harvestify."""

    def __init__(self):
        self.disease_model = None
        self.errors = []

    def load(self):
        self.errors = []
        disease_path = MODEL_DIR / "disease" / "plant_disease_model.pth"

        if not disease_path.is_file():
            self.errors.append("disease_model_missing")
        else:
            try:
                model = ResNet9(3, len(DISEASE_CLASSES))
                state = torch.load(
                    disease_path,
                    map_location="cpu",
                    weights_only=True,
                )
                model.load_state_dict(state)
                model.eval()
                self.disease_model = model
            except Exception:
                logger.exception("Disease model artifact failed to load")
                self.errors.append("disease_model_load_failed")

    @property
    def features(self):
        return {
            "fertilizer": (DATA_DIR / "fertilizer.csv").is_file(),
            "disease": self.disease_model is not None,
        }

    @property
    def ready(self):
        return all(self.features.values())


registry = Registry()
