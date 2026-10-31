from django.urls import path

from .api_views import CropPlanView, MarketStatusView

urlpatterns = [
    path("status/", MarketStatusView.as_view(), name="market-status"),
    path("crop-plan/", CropPlanView.as_view(), name="market-crop-plan"),
]
