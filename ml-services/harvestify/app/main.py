import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from app.config import MAX_IMAGE_BYTES
from app.inference import disease_prediction, fertilizer_prediction
from app.model_registry import registry
from app.schemas import FertilizerRequest

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app):
    registry.load()
    yield


app = FastAPI(
    title="AgriMart Harvestify API",
    version="1.1.0",
    lifespan=lifespan,
)


@app.get("/health/live")
def live():
    return {"status": "alive", "service": "harvestify"}


@app.get("/health/ready")
def ready():
    features = registry.features
    if not registry.ready:
        return JSONResponse(
            status_code=503,
            content={
                "status": "degraded",
                "service": "harvestify",
                "features": features,
                "missing_or_failed": registry.errors,
            },
        )
    return {
        "status": "ready",
        "service": "harvestify",
        "features": features,
    }


@app.post("/api/v1/fertilizer/recommend")
def fertilizer(request: FertilizerRequest):
    try:
        data = fertilizer_prediction(request)
    except FileNotFoundError:
        raise HTTPException(503, "Fertilizer reference data unavailable")
    except ValueError as exc:
        raise HTTPException(422, str(exc))
    except Exception:
        logger.exception("Fertilizer inference failed")
        raise HTTPException(503, "Fertilizer advice unavailable")

    return {
        "success": True,
        "data": data,
        "model": {"name": "harvestify-fertilizer-rules", "version": "1.0.0"},
        "disclaimer": "Informational only; not a fertilizer dosage prescription.",
    }


@app.post("/api/v1/disease/predict")
def disease(file: UploadFile = File(...)):
    if registry.disease_model is None:
        raise HTTPException(503, "Disease model unavailable")
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(415, "Upload JPEG, PNG or WebP")

    raw = file.file.read(MAX_IMAGE_BYTES + 1)
    if len(raw) > MAX_IMAGE_BYTES:
        raise HTTPException(413, "Image exceeds 5 MB")

    try:
        data = disease_prediction(raw)
    except ValueError:
        raise HTTPException(422, "Invalid image")
    except Exception:
        logger.exception("Disease inference failed")
        raise HTTPException(503, "Disease detection unavailable")

    return {
        "success": True,
        "data": data,
        "model": {"name": "harvestify-resnet9", "version": "1.0.0"},
        "disclaimer": "Informational only; confirm with an agricultural expert.",
    }
