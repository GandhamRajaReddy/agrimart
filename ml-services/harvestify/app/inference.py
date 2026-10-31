from io import BytesIO

import pandas as pd
import torch
from PIL import Image, UnidentifiedImageError
from torchvision import transforms

from app.config import DATA_DIR
from app.disease_model import DISEASE_CLASSES
from app.model_registry import registry


def fertilizer_prediction(payload):
    path = DATA_DIR / "fertilizer.csv"
    if not path.is_file():
        raise FileNotFoundError("fertilizer_reference_missing")

    frame = pd.read_csv(path)
    required_columns = {"Crop", "N", "P", "K"}
    if not required_columns.issubset(frame.columns):
        raise ValueError("fertilizer_reference_invalid")

    rows = frame[
        frame["Crop"].astype(str).str.casefold()
        == payload.crop.casefold()
    ]
    if rows.empty:
        raise ValueError("unsupported_crop")

    row = rows.iloc[0]
    differences = {
        "N": float(row["N"]) - payload.nitrogen,
        "P": float(row["P"]) - payload.phosphorus,
        "K": float(row["K"]) - payload.potassium,
    }
    nutrient = max(differences, key=lambda key: abs(differences[key]))
    delta = differences[nutrient]

    return {
        "crop": str(row["Crop"]),
        "most_significant_nutrient": nutrient,
        "status": "low" if delta > 0 else "high" if delta < 0 else "balanced",
        "reference_difference": round(delta, 2),
        "note": (
            "Reference-table comparison only; this is not a fertilizer "
            "dosage prescription."
        ),
    }


def disease_prediction(raw):
    if registry.disease_model is None:
        raise RuntimeError("disease_model_unavailable")

    try:
        image = Image.open(BytesIO(raw)).convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError("invalid_image") from exc

    tensor = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.ToTensor(),
        ]
    )(image).unsqueeze(0)

    with torch.inference_mode():
        probabilities = torch.softmax(registry.disease_model(tensor), dim=1)[0]
        score, index = torch.max(probabilities, dim=0)

    return {
        "classification": DISEASE_CLASSES[int(index.item())],
        "confidence": round(float(score.item()), 4),
    }
