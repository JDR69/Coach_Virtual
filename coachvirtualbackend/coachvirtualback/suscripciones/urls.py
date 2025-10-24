from django.urls import path
from .controllers.suscripcion_controller import (
    PlanesDisponiblesVista, PlanActualVista, 
    VerificarPermisoVista, ActualizarPlanVista,
)

urlpatterns = [
    # Planes disponibles
    path('planes/', PlanesDisponiblesVista.as_view(), name='planes-disponibles'),
    path('planes/actual/', PlanActualVista.as_view(), name='plan-actual'),
    path('planes/verificar/', VerificarPermisoVista.as_view(), name='verificar-permiso'),
    
    # Actualización de plan (TODO: integrar con pasarela de pago)
    path('planes/actualizar/', ActualizarPlanVista.as_view(), name='actualizar-plan'),
]
