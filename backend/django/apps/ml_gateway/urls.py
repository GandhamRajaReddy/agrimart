from django.urls import path

from .views import DiseaseView, FertilizerView, MLHealthView

urlpatterns = [
    path("health/", MLHealthView.as_view(), name="ml-health"),
    path("fertilizer/recommend/", FertilizerView.as_view(), name="ml-fertilizer"),
    path("disease/predict/", DiseaseView.as_view(), name="ml-disease"),
]
