from rest_framework import serializers
class CropSerializer(serializers.Serializer):
 nitrogen=serializers.FloatField(min_value=0,max_value=300); phosphorus=serializers.FloatField(min_value=0,max_value=300); potassium=serializers.FloatField(min_value=0,max_value=300)
 temperature=serializers.FloatField(min_value=-10,max_value=60); humidity=serializers.FloatField(min_value=0,max_value=100); ph=serializers.FloatField(min_value=0,max_value=14); rainfall=serializers.FloatField(min_value=0,max_value=10000)
class FertilizerSerializer(serializers.Serializer):
 crop=serializers.CharField(max_length=80); nitrogen=serializers.FloatField(min_value=0,max_value=300); phosphorus=serializers.FloatField(min_value=0,max_value=300); potassium=serializers.FloatField(min_value=0,max_value=300)
class DiseaseSerializer(serializers.Serializer):
 file=serializers.ImageField()
 def validate_file(self,value):
  if value.size>5*1024*1024: raise serializers.ValidationError("Image must be 5 MB or smaller.")
  return value
