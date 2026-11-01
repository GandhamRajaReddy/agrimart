from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import client
from .client import MLServiceUnavailable
from .serializers import (
    CropSerializer,
    CropDemoRankSerializer,
    DiseaseSerializer,
    FertilizerSerializer,
)


def unavailable():
    return Response(
        {
            "success": False,
            "code": "ML_SERVICE_UNAVAILABLE",
            "detail": (
                "This AI feature is temporarily unavailable. "
                "Other AgriMart services are unaffected."
            ),
        },
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


class CropView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CropSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            return Response(client.crop(serializer.validated_data))
        except MLServiceUnavailable:
            return unavailable()


class CropBenchmarkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CropSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            return Response(client.crop_benchmark_predict(serializer.validated_data))
        except MLServiceUnavailable:
            return unavailable()


class CropDemoRankView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CropDemoRankSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            return Response(client.crop_demo_rank(serializer.validated_data))
        except MLServiceUnavailable:
            return unavailable()


class FertilizerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FertilizerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            return Response(client.fertilizer(serializer.validated_data))
        except MLServiceUnavailable:
            return unavailable()


class DiseaseView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = DiseaseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            return Response(client.disease(serializer.validated_data["file"]))
        except MLServiceUnavailable:
            return unavailable()


class MLHealthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            return Response(client.health())
        except MLServiceUnavailable:
            return unavailable()
