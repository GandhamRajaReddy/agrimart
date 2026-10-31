from pydantic import BaseModel, Field


class FertilizerRequest(BaseModel):
    crop: str = Field(min_length=1, max_length=80)
    nitrogen: float = Field(ge=0, le=300)
    phosphorus: float = Field(ge=0, le=300)
    potassium: float = Field(ge=0, le=300)
