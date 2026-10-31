import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI,File,HTTPException,UploadFile
from fastapi.responses import JSONResponse
from app.config import MAX_IMAGE_BYTES
from app.inference import crop_prediction,fertilizer_prediction,disease_prediction
from app.model_registry import registry
from app.schemas import CropRequest,FertilizerRequest
@asynccontextmanager
async def lifespan(app):
 registry.load(); yield
app=FastAPI(title="AgriMart Harvestify API",version="1.0.0",lifespan=lifespan)
@app.get("/health/live")
def live(): return {"status":"alive","service":"harvestify"}
@app.get("/health/ready")
def ready():
 if not registry.ready: return JSONResponse(status_code=503,content={"status":"degraded","features":registry.features,"missing_or_failed":registry.errors})
 return {"status":"ready" if all(registry.features.values()) else "degraded","service":"harvestify","features":registry.features}
@app.post("/api/v1/crop/recommend")
def crop(req:CropRequest):
 if registry.crop_model is None: raise HTTPException(503,"Crop model unavailable")
 try: data=crop_prediction(req)
 except Exception:
  logging.exception("Crop inference error"); raise HTTPException(503,"Crop recommendation unavailable")
 return {"success":True,"data":data,"model":{"name":"harvestify-crop","version":"1.0.0"},"disclaimer":"Informational only; validate with a local agronomist."}
@app.post("/api/v1/fertilizer/recommend")
def fertilizer(req:FertilizerRequest):
 try: data=fertilizer_prediction(req)
 except FileNotFoundError: raise HTTPException(503,"Fertilizer reference data unavailable")
 except ValueError as exc: raise HTTPException(422,str(exc))
 except Exception:
  logging.exception("Fertilizer inference error"); raise HTTPException(503,"Fertilizer advice unavailable")
 return {"success":True,"data":data,"model":{"name":"harvestify-fertilizer-rules","version":"1.0.0"},"disclaimer":"Informational only; not a dosage prescription."}
@app.post("/api/v1/disease/predict")
def disease(file:UploadFile=File(...)):
 if registry.disease_model is None: raise HTTPException(503,"Disease model unavailable")
 if file.content_type not in {"image/jpeg","image/png","image/webp"}: raise HTTPException(415,"Upload JPEG, PNG or WebP")
 raw=file.file.read(MAX_IMAGE_BYTES+1)
 if len(raw)>MAX_IMAGE_BYTES: raise HTTPException(413,"Image exceeds 5 MB")
 try: data=disease_prediction(raw)
 except ValueError: raise HTTPException(422,"Invalid image")
 except Exception:
  logging.exception("Disease inference error"); raise HTTPException(503,"Disease detection unavailable")
 return {"success":True,"data":data,"model":{"name":"harvestify-resnet9","version":"1.0.0"},"disclaimer":"Informational only; confirm with an agricultural expert."}
