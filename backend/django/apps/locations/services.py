import json
from functools import lru_cache
from pathlib import Path

from rest_framework import serializers

DATA_DIR = Path(__file__).resolve().parent / "data"


@lru_cache(maxsize=1)
def regions_data():
    with (DATA_DIR / "karnataka_regions.json").open(encoding="utf-8") as handle:
        return json.load(handle)


@lru_cache(maxsize=1)
def village_data():
    path = DATA_DIR / "karnataka_villages.json"
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def validate_karnataka_location(data, *, require_village=True):
    state = (data.get("state") or "Karnataka").strip()
    if state.casefold() != "karnataka":
        raise serializers.ValidationError({"state": "AgriMart is currently available only in Karnataka."})

    district = (data.get("district") or "").strip()
    taluk = (data.get("taluk") or "").strip()
    village = (data.get("village") or "").strip()
    regions = regions_data()
    district_row = next((item for item in regions["districts"] if item["name"].casefold() == district.casefold()), None)
    if not district_row:
        raise serializers.ValidationError({"district": "Select a valid Karnataka district."})
    taluk_row = next((item for item in regions["taluks"] if item["name"].casefold() == taluk.casefold() and item["district"] == district_row["name"]), None)
    if not taluk_row:
        raise serializers.ValidationError({"taluk": "Select a valid taluk for the selected district."})
    if require_village and not village:
        raise serializers.ValidationError({"village": "Select your village."})
    if village:
        villages = village_data()
        if not villages:
            raise serializers.ValidationError({"village": "Karnataka village data is not installed yet. Run python manage.py sync_karnataka_locations and try again."})
        exists = any(
            item["name"].casefold() == village.casefold()
            and item["district"].casefold() == district.casefold()
            and item["taluk"].casefold() == taluk.casefold()
            for item in villages
        )
        if not exists:
            raise serializers.ValidationError({"village": "Select a village from the results for the selected taluk."})
    return {"state": "Karnataka", "district": district_row["name"], "taluk": taluk_row["name"], "village": village}
