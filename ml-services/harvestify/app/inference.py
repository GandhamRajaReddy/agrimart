from io import BytesIO
import numpy as np,pandas as pd,torch
from PIL import Image,UnidentifiedImageError
from torchvision import transforms
from app.config import DATA_DIR
from app.disease_model import DISEASE_CLASSES
from app.model_registry import registry
def crop_prediction(p):
 if registry.crop_model is None: raise RuntimeError("crop_model_unavailable")
 x=np.array([[p.nitrogen,p.phosphorus,p.potassium,p.temperature,p.humidity,p.ph,p.rainfall]],dtype=float)
 return {"recommended_crop":str(registry.crop_model.predict(x)[0])}
def fertilizer_prediction(p):
 path=DATA_DIR/"fertilizer.csv"
 if not path.is_file(): raise FileNotFoundError("fertilizer_reference_missing")
 df=pd.read_csv(path)
 if not {"Crop","N","P","K"}.issubset(df.columns): raise ValueError("fertilizer_reference_invalid")
 rows=df[df.Crop.astype(str).str.casefold()==p.crop.casefold()]
 if rows.empty: raise ValueError("unsupported_crop")
 row=rows.iloc[0]; diffs={"N":float(row.N)-p.nitrogen,"P":float(row.P)-p.phosphorus,"K":float(row.K)-p.potassium}
 nutrient=max(diffs,key=lambda k:abs(diffs[k])); delta=diffs[nutrient]
 return {"crop":str(row.Crop),"most_significant_nutrient":nutrient,"status":"low" if delta>0 else "high" if delta<0 else "balanced","reference_difference":round(delta,2),"note":"Reference-table comparison only; not a fertilizer dosage prescription."}
def disease_prediction(raw):
 if registry.disease_model is None: raise RuntimeError("disease_model_unavailable")
 try: image=Image.open(BytesIO(raw)).convert("RGB")
 except (UnidentifiedImageError,OSError,ValueError) as exc: raise ValueError("invalid_image") from exc
 tensor=transforms.Compose([transforms.Resize(256),transforms.ToTensor()])(image).unsqueeze(0)
 with torch.inference_mode():
  probs=torch.softmax(registry.disease_model(tensor),dim=1)[0]; score,index=torch.max(probs,dim=0)
 return {"classification":DISEASE_CLASSES[int(index.item())],"confidence":round(float(score.item()),4)}
