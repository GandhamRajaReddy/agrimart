from pydantic import BaseModel,Field
class CropRequest(BaseModel):
 nitrogen:float=Field(ge=0,le=300)
 phosphorus:float=Field(ge=0,le=300)
 potassium:float=Field(ge=0,le=300)
 temperature:float=Field(ge=-10,le=60)
 humidity:float=Field(ge=0,le=100)
 ph:float=Field(ge=0,le=14)
 rainfall:float=Field(ge=0,le=10000)
class FertilizerRequest(BaseModel):
 crop:str=Field(min_length=1,max_length=80)
 nitrogen:float=Field(ge=0,le=300)
 phosphorus:float=Field(ge=0,le=300)
 potassium:float=Field(ge=0,le=300)
