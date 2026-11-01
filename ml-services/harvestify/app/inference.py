from io import BytesIO

import pandas as pd
import torch
from PIL import Image, UnidentifiedImageError
from torchvision import transforms

from app.config import DATA_DIR
from app.disease_model import DISEASE_CLASSES
from app.model_registry import registry


def crop_prediction(request):
    if registry.crop_model is None:
        raise RuntimeError("crop_model_unavailable")
    payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
    candidates = payload.pop("candidates")
    rows = [{**payload, **candidate} for candidate in candidates]
    frame = pd.DataFrame(rows, columns=registry.crop_feature_columns)
    probabilities = registry.crop_model.predict_proba(frame)[:, 1]
    ranked = [
        {"crop": candidate["crop"], "candidate_score": round(float(probability), 4)}
        for candidate, probability in zip(candidates, probabilities)
    ]
    ranked.sort(key=lambda item: (-item["candidate_score"], item["crop"].casefold()))
    for rank, item in enumerate(ranked, start=1):
        item["rank"] = rank
    return {
        "ranked_candidates": ranked,
        "dataset_source": "SYNTHETIC",
        "demo_only": True,
        "production_recommendations_enabled": False,
        "message": (
            "Prototype ranking learned from synthetic simulator labels. "
            "Do not use as farm, yield, price, or profitability advice."
        ),
    }


def fertilizer_prediction(p):
    path = DATA_DIR / "fertilizer.csv"
    if not path.is_file():
        raise FileNotFoundError("fertilizer_reference_missing")
    df = pd.read_csv(path)
    if not {"Crop", "N", "P", "K"}.issubset(df.columns):
        raise ValueError("fertilizer_reference_invalid")
    rows = df[df.Crop.astype(str).str.casefold() == p.crop.casefold()]
    if rows.empty:
        raise ValueError("unsupported_crop")
    row = rows.iloc[0]
    diffs = {"N": float(row.N) - p.nitrogen, "P": float(row.P) - p.phosphorus, "K": float(row.K) - p.potassium}
    nutrient = max(diffs, key=lambda key: abs(diffs[key]))
    delta = diffs[nutrient]
    return {
        "crop": str(row.Crop),
        "most_significant_nutrient": nutrient,
        "status": "low" if delta > 0 else "high" if delta < 0 else "balanced",
        "reference_difference": round(delta, 2),
        "note": "Reference-table comparison only; not a fertilizer dosage prescription.",
    }


def disease_prediction(raw):
    if registry.disease_model is None:
        raise RuntimeError("disease_model_unavailable")
    try:
        image = Image.open(BytesIO(raw)).convert("RGB")
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError("invalid_image") from exc
    tensor = transforms.Compose([transforms.Resize(256), transforms.ToTensor()])(image).unsqueeze(0)
    with torch.inference_mode():
        probabilities = torch.softmax(registry.disease_model(tensor), dim=1)[0]
        score, index = torch.max(probabilities, dim=0)
    return {
        "classification": DISEASE_CLASSES[int(index.item())],
        "confidence": round(float(score.item()), 4),
    }

def crop_benchmark_prediction(request):
    if registry.crop_benchmark_model is None:
        raise RuntimeError("crop_benchmark_model_unavailable")
    payload = request.model_dump() if hasattr(request, "model_dump") else dict(request)
    feature_values = {
        "N": payload["nitrogen"],
        "P": payload["phosphorus"],
        "K": payload["potassium"],
        "temperature": payload["temperature"],
        "humidity": payload["humidity"],
        "ph": payload["ph"],
        "rainfall": payload["rainfall"],
    }
    frame = pd.DataFrame([feature_values], columns=[
        "N", "P", "K", "temperature", "humidity", "ph", "rainfall",
    ])
    probabilities = registry.crop_benchmark_model.predict_proba(frame)[0]
    classes = registry.crop_benchmark_model.classes_
    ranked = sorted(
        [
            {"crop": str(label), "benchmark_score": round(float(score), 4)}
            for label, score in zip(classes, probabilities)
        ],
        key=lambda item: (-item["benchmark_score"], item["crop"]),
    )
    return {
        "prediction": ranked[0]["crop"],
        "top_predictions": ranked[:3],
        "dataset_source": "PUBLIC_KAGGLE_BENCHMARK",
        "benchmark_only": True,
        "production_recommendations_enabled": False,
        "message": (
            "Prediction from a public benchmark dataset. It is not validated for "
            "Karnataka field conditions and must not be used as standalone crop advice."
        ),
    }
