from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class MarketStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        configured = bool(getattr(settings, "DATA_GOV_IN_API_KEY", ""))
        validated = bool(getattr(settings, "MARKET_FORECAST_MODEL_VALIDATED", False))
        return Response(
            {
                "service": "agrimart-market-intelligence",
                "region": "Karnataka",
                "data_source": "AGMARKNET / data.gov.in",
                "data_source_configured": configured,
                "historical_data_available": False,
                "forecast_model_validated": validated,
                "forecasts_available": False,
                "message": (
                    "Verified historical mandi data and an independently "
                    "backtested forecasting model are required before forecasts "
                    "or profit rankings can be published."
                ),
            }
        )


class CropPlanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Fail closed until ingestion, yield/cost datasets, and time-based
        # validation are implemented. Never return fabricated profitability.
        return Response(
            {
                "success": False,
                "code": "CROP_PLAN_NOT_READY",
                "detail": (
                    "Crop recommendations are unavailable until verified "
                    "Karnataka mandi history, crop yield/cost data, and a "
                    "backtested model are configured."
                ),
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
