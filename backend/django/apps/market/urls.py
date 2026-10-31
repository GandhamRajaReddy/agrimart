from django.urls import path

from .api_views import CropPlanView, MarketIntelligenceStatusView

urlpatterns = [
    path("status/", MarketIntelligenceStatusView.as_view(), name="market-status"),
    path("crop-plan/", CropPlanView.as_view(), name="market-crop-plan"),
]
