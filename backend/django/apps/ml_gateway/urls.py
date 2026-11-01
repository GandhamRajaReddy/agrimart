from django.urls import path

from .views import (
    CropView,
    CropBenchmarkView,
    CropDemoRankView,
    DiseaseView,
    FertilizerView,
    MLHealthView,
)

urlpatterns = [
    path("health/", MLHealthView.as_view(), name="ml-health"),
    path("crop/recommend/", CropView.as_view(), name="ml-crop"),
    path("crop/benchmark-predict/", CropBenchmarkView.as_view(), name="ml-crop-benchmark"),
    path("crop/demo-rank/", CropDemoRankView.as_view(), name="ml-crop-demo-rank"),
    path("fertilizer/recommend/", FertilizerView.as_view(), name="ml-fertilizer"),
    path("disease/predict/", DiseaseView.as_view(), name="ml-disease"),
]
