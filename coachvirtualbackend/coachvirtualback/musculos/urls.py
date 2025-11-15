# musculos/urls.py
from django.urls import path
from .controllers.musculo_controller import MusculoController
from .controllers.ejercicio_controller import EjercicioController
from .controllers.detalle_musculo_controller import DetalleMusculoController
from .controllers.ejercicio_asignado_controller import EjercicioAsignadoController

urlpatterns = [
    # /api/musculos/
    path('musculos/', MusculoController.as_view(), name='musculos'),
    path('musculos/<int:pk>/', MusculoController.as_view(), name='musculo-detail'),

    # /api/ejercicios/
    path('ejercicios/', EjercicioController.as_view(), name='ejercicios'),
    path('ejercicios/<int:pk>/', EjercicioController.as_view(), name='ejercicio-detail'),

    # /api/detalle-musculos/
    path('detalle-musculos/', DetalleMusculoController.as_view(), name='detalle-musculos'),
    path('detalle-musculos/<int:pk>/', DetalleMusculoController.as_view(), name='detalle-musculo-detail'),

    # /api/ejercicios-asignados/
    path('ejercicios-asignados/', EjercicioAsignadoController.as_view(), name='ejercicios-asignados'),
    path('ejercicios-asignados/<int:pk>/', EjercicioAsignadoController.as_view(), name='ejercicio-asignado-detail'),
]
