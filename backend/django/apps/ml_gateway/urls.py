from django.urls import path
from .views import CropView,FertilizerView,DiseaseView,MLHealthView
urlpatterns=[
 path("health/",MLHealthView.as_view(),name="ml-health"),
 path("crop/recommend/",CropView.as_view(),name="ml-crop"),
 path("fertilizer/recommend/",FertilizerView.as_view(),name="ml-fertilizer"),
 path("disease/predict/",DiseaseView.as_view(),name="ml-disease"),
]
