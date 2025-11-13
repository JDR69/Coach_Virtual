from django.urls import path
from .controllers.musculo_controller import MusculoController
from .controllers.ejercicio_controller import EjercicioController
from .controllers.detalle_musculo_controller import (
    DetalleMusculoController,
)
from .controllers.ejercicio_asignado_controller import (
    EjercicioAsignadoController,
)

urlpatterns = [
    path(
        'musculos/',
        MusculoController.as_view(),
        name='musculos',
    ),
    path(
        'musculos/<str:pk>/',
        MusculoController.as_view(),
        name='musculo-detail',
    ),
    path(
        'ejercicios/',
        EjercicioController.as_view(),
        name='ejercicios',
    ),
    path(
        'ejercicios/<str:pk>/',
        EjercicioController.as_view(),
        name='ejercicio-detail',
    ),
    path(
        'detalle-musculos/',
        DetalleMusculoController.as_view(),
        name='detalle-musculos',
    ),
    path(
        'detalle-musculos/<str:pk>/',
        DetalleMusculoController.as_view(),
        name='detalle-musculo-detail',
    ),
    path(
        'ejercicios-asignados/',
        EjercicioAsignadoController.as_view(),
        name='ejercicios-asignados',
    ),
    path(
        'ejercicios-asignados/<str:pk>/',
        EjercicioAsignadoController.as_view(),
        name='ejercicio-asignado-detail',
    ),
]