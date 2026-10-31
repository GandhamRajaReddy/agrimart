import logging

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import client
from .client import MLServiceUnavailable
from .serializers import DiseaseSerializer, FertilizerSerializer

logger = logging.getLogger(__name__)


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


class FertilizerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FertilizerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            return Response(client.fertilizer(serializer.validated_data))
        except MLServiceUnavailable:
            logger.warning("Harvestify fertilizer service unavailable")
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
            logger.warning("Harvestify disease service unavailable")
            return unavailable()


class MLHealthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            return Response(client.health())
        except MLServiceUnavailable:
            return unavailable()
