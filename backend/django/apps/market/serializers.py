from rest_framework import serializers


class CropPlanRequestSerializer(serializers.Serializer):
    district = serializers.CharField(max_length=100)
    taluk = serializers.CharField(max_length=100, required=False, allow_blank=True)
    land_area_acres = serializers.FloatField(min_value=0.1, max_value=100000)
    season = serializers.ChoiceField(choices=("KHARIF", "RABI", "ZAID"))
    budget_per_acre = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0,
        required=False,
    )
