from django.urls import path
from .controllers.usuario_controller import UsuarioListaCrearVista, UsuarioDetalleVista
from .controllers.alerta_controller import AlertasListaCrearVista, AlertasDetalleVista

urlpatterns = [
    path('usuarios/', UsuarioListaCrearVista.as_view(), name='usuario-lista-crear'),
    path('usuarios',  UsuarioListaCrearVista.as_view()),  
    path('usuarios/<int:pk>/', UsuarioDetalleVista.as_view(), name='usuario-detalle'),
    path('usuarios/<int:pk>',  UsuarioDetalleVista.as_view()), 

    path('alertas/', AlertasListaCrearVista.as_view(), name='alerta-lista-crear'),
    path('alertas',  AlertasListaCrearVista.as_view()),
    path('alertas/<int:pk>/', AlertasDetalleVista.as_view(), name='alerta-detalle'),
    path('alertas/<int:pk>',  AlertasDetalleVista.as_view()), 
]
