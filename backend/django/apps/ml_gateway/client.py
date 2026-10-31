import requests
from django.conf import settings
from requests.exceptions import RequestException
class MLServiceUnavailable(Exception): pass
def call_ml(method,path,**kwargs):
 if not getattr(settings,"ML_SERVICE_ENABLED",False): raise MLServiceUnavailable("ML service disabled")
 base=getattr(settings,"ML_SERVICE_URL","").rstrip("/")
 if not base: raise MLServiceUnavailable("ML service URL missing")
 try:
  response=requests.request(method,base+path,timeout=(getattr(settings,"ML_CONNECT_TIMEOUT",2),getattr(settings,"ML_READ_TIMEOUT",20)),**kwargs)
  response.raise_for_status(); return response.json()
 except RequestException as exc: raise MLServiceUnavailable("ML service unavailable") from exc
def crop(payload): return call_ml("POST","/api/v1/crop/recommend",json=payload)
def fertilizer(payload): return call_ml("POST","/api/v1/fertilizer/recommend",json=payload)
def disease(upload):
 upload.seek(0)
 return call_ml("POST","/api/v1/disease/predict",files={"file":(upload.name,upload,upload.content_type)})
def health(): return call_ml("GET","/health/ready")
