import logging,pickle,torch
from app.config import MODEL_DIR
from app.disease_model import ResNet9,DISEASE_CLASSES
logger=logging.getLogger(__name__)
class Registry:
 def __init__(self): self.crop_model=None; self.disease_model=None; self.errors=[]
 def load(self):
  crop=MODEL_DIR/"crop"/"RandomForest.pkl"; disease=MODEL_DIR/"disease"/"plant_disease_model.pth"
  if crop.is_file():
   try:
    with crop.open("rb") as f: self.crop_model=pickle.load(f)
   except Exception: logger.exception("Crop artifact load failed"); self.errors.append("crop_model_load_failed")
  else: self.errors.append("crop_model_missing")
  if disease.is_file():
   try:
    model=ResNet9(3,len(DISEASE_CLASSES)); state=torch.load(disease,map_location="cpu",weights_only=True)
    model.load_state_dict(state); model.eval(); self.disease_model=model
   except Exception: logger.exception("Disease artifact load failed"); self.errors.append("disease_model_load_failed")
  else: self.errors.append("disease_model_missing")
 @property
 def ready(self): return self.crop_model is not None and self.disease_model is not None
registry=Registry()
