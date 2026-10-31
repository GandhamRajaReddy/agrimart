import os
from pathlib import Path
BASE_DIR=Path(__file__).resolve().parents[1]
MODEL_DIR=Path(os.getenv("HARVESTIFY_MODEL_DIR",BASE_DIR/"models"))
DATA_DIR=Path(os.getenv("HARVESTIFY_DATA_DIR",BASE_DIR/"data"))
MAX_IMAGE_BYTES=int(os.getenv("HARVESTIFY_MAX_IMAGE_BYTES","5242880"))
