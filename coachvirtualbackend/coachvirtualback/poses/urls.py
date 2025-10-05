from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PoseTrainingDataViewSet

router = DefaultRouter()
router.register(r'', PoseTrainingDataViewSet, basename='pose-training')

urlpatterns = [
    path('', include(router.urls)),
]
