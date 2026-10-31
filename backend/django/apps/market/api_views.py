from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class MarketIntelligenceStatusView(APIView):
    """Expose configuration readiness without leaking credentials."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        configured = bool(getattr(settings, "DATA_GOV_IN_API_KEY", ""))
        return Response(
            {
                "state_scope": "Karnataka",
                "data_source": "data.gov.in / AGMARKNET",
                "data_source_configured": configured,
                "historical_data_validated": False,
                "forecast_model_validated": False,
                "forecast_horizons_days": [30, 60, 90],
                "forecast_available": False,
                "crop_profitability_available": False,
                "message": (
                    "Market intelligence is awaiting verified historical mandi "
                    "data and temporal model validation."
                ),
            }
        )


class CropPlanView(APIView):
    """Fail closed until market, yield, and cultivation-cost data are validated."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response(
            {
                "success": False,
                "code": "MARKET_INTELLIGENCE_NOT_READY",
                "detail": (
                    "Karnataka crop-profitability recommendations are not enabled. "
                    "Verified historical mandi prices, yield and cultivation-cost "
                    "data, and temporal backtesting are required first."
                ),
                "required_inputs": [
                    "verified_historical_mandi_prices",
                    "crop_yield_data",
                    "cultivation_cost_data",
                    "temporal_backtesting",
                ],
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
