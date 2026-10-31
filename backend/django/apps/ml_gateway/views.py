from rest_framework import status
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from . import client
from .client import MLServiceUnavailable
from .serializers import CropSerializer,FertilizerSerializer,DiseaseSerializer
def unavailable():
 return Response({"success":False,"code":"ML_SERVICE_UNAVAILABLE","detail":"This AI feature is temporarily unavailable. Other AgriMart services are unaffected."},status=status.HTTP_503_SERVICE_UNAVAILABLE)
class CropView(APIView):
 permission_classes=[IsAuthenticated]
 def post(self,request):
  s=CropSerializer(data=request.data); s.is_valid(raise_exception=True)
  try: return Response(client.crop(s.validated_data))
  except MLServiceUnavailable: return unavailable()
class FertilizerView(APIView):
 permission_classes=[IsAuthenticated]
 def post(self,request):
  s=FertilizerSerializer(data=request.data); s.is_valid(raise_exception=True)
  try: return Response(client.fertilizer(s.validated_data))
  except MLServiceUnavailable: return unavailable()
class DiseaseView(APIView):
 permission_classes=[IsAuthenticated]; parser_classes=[MultiPartParser,FormParser]
 def post(self,request):
  s=DiseaseSerializer(data=request.data); s.is_valid(raise_exception=True)
  try: return Response(client.disease(s.validated_data["file"]))
  except MLServiceUnavailable: return unavailable()
class MLHealthView(APIView):
 permission_classes=[IsAuthenticated]
 def get(self,request):
  try: return Response(client.health())
  except MLServiceUnavailable: return unavailable()
