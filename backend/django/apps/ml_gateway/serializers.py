from rest_framework import serializers


class CropCandidateSerializer(serializers.Serializer):
    crop = serializers.CharField(min_length=1, max_length=80)
    crop_duration_days = serializers.IntegerField(min_value=1, max_value=500)
    water_requirement = serializers.CharField(min_length=1, max_length=30)
    mandi_modal_price_inr_qtl = serializers.FloatField(min_value=0, max_value=100000)
    price_volatility_30d_pct = serializers.FloatField(min_value=0, max_value=1000)
    mandi_arrivals_qtl_day = serializers.FloatField(min_value=0, max_value=10000000)
    demand_index_0_1 = serializers.FloatField(min_value=0, max_value=1)
    nearest_mandi_distance_km = serializers.FloatField(min_value=0, max_value=2000)
    competitor_crop_area_ha = serializers.FloatField(min_value=0, max_value=100000000)


class CropSerializer(serializers.Serializer):
    state = serializers.CharField(min_length=2, max_length=80)
    district = serializers.CharField(min_length=2, max_length=80)
    year = serializers.IntegerField(min_value=2000, max_value=2100)
    month = serializers.IntegerField(min_value=1, max_value=12)
    season = serializers.CharField(min_length=2, max_length=30)
    latitude = serializers.FloatField(min_value=-90, max_value=90)
    longitude = serializers.FloatField(min_value=-180, max_value=180)
    climate_zone = serializers.CharField(min_length=2, max_length=80)
    rainfall_mm = serializers.FloatField(min_value=0, max_value=10000)
    temperature_c = serializers.FloatField(min_value=-10, max_value=60)
    humidity_pct = serializers.FloatField(min_value=0, max_value=100)
    soil_ph = serializers.FloatField(min_value=0, max_value=14)
    organic_carbon_pct = serializers.FloatField(min_value=0, max_value=100)
    nitrogen_kg_ha = serializers.FloatField(min_value=0, max_value=10000)
    phosphorus_kg_ha = serializers.FloatField(min_value=0, max_value=10000)
    potassium_kg_ha = serializers.FloatField(min_value=0, max_value=10000)
    soil_moisture_pct = serializers.FloatField(min_value=0, max_value=100)
    irrigation_type = serializers.CharField(min_length=2, max_length=40)
    candidates = CropCandidateSerializer(many=True, allow_empty=False)

    def validate_candidates(self, value):
        if len(value) > 10:
            raise serializers.ValidationError("Submit no more than 10 crop candidates.")
        names = [item["crop"].casefold() for item in value]
        if len(names) != len(set(names)):
            raise serializers.ValidationError("Crop candidates must be unique.")
        return value


class FertilizerSerializer(serializers.Serializer):
    crop = serializers.CharField(max_length=80)
    nitrogen = serializers.FloatField(min_value=0, max_value=300)
    phosphorus = serializers.FloatField(min_value=0, max_value=300)
    potassium = serializers.FloatField(min_value=0, max_value=300)


class DiseaseSerializer(serializers.Serializer):
    file = serializers.ImageField()

    def validate_file(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image must be 5 MB or smaller.")
        return value
