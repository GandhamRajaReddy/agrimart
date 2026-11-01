from pydantic import BaseModel, Field, ConfigDict


class CropCandidate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    crop: str = Field(min_length=1, max_length=80)
    crop_duration_days: int = Field(ge=1, le=500)
    water_requirement: str = Field(min_length=1, max_length=30)
    mandi_modal_price_inr_qtl: float = Field(ge=0, le=100000)
    price_volatility_30d_pct: float = Field(ge=0, le=1000)
    mandi_arrivals_qtl_day: float = Field(ge=0, le=10000000)
    demand_index_0_1: float = Field(ge=0, le=1)
    nearest_mandi_distance_km: float = Field(ge=0, le=2000)
    competitor_crop_area_ha: float = Field(ge=0, le=100000000)


class CropRequest(BaseModel):
    nitrogen: float = Field(ge=0, le=300)
    phosphorus: float = Field(ge=0, le=300)
    potassium: float = Field(ge=0, le=300)
    temperature: float = Field(ge=-10, le=60)
    humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    rainfall: float = Field(ge=0, le=10000)


class CropDemoRankRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    state: str = Field(min_length=2, max_length=80)
    district: str = Field(min_length=2, max_length=80)
    year: int = Field(ge=2000, le=2100)
    month: int = Field(ge=1, le=12)
    season: str = Field(min_length=2, max_length=30)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    climate_zone: str = Field(min_length=2, max_length=80)
    rainfall_mm: float = Field(ge=0, le=10000)
    temperature_c: float = Field(ge=-10, le=60)
    humidity_pct: float = Field(ge=0, le=100)
    soil_ph: float = Field(ge=0, le=14)
    organic_carbon_pct: float = Field(ge=0, le=100)
    nitrogen_kg_ha: float = Field(ge=0, le=10000)
    phosphorus_kg_ha: float = Field(ge=0, le=10000)
    potassium_kg_ha: float = Field(ge=0, le=10000)
    soil_moisture_pct: float = Field(ge=0, le=100)
    irrigation_type: str = Field(min_length=2, max_length=40)
    candidates: list[CropCandidate] = Field(min_length=1, max_length=10)


class FertilizerRequest(BaseModel):
    crop: str = Field(min_length=1, max_length=80)
    nitrogen: float = Field(ge=0, le=300)
    phosphorus: float = Field(ge=0, le=300)
    potassium: float = Field(ge=0, le=300)
