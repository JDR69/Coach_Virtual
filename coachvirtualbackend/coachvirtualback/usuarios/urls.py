# usuarios/urls.py
from django.urls import path
from .controllers.usuario_controller import UsuarioListaCrearVista, UsuarioDetalleVista

# usuarios/urls.py
urlpatterns = [
    path('usuarios/', UsuarioListaCrearVista.as_view(), name='usuario-lista-crear'),
    path('usuarios',  UsuarioListaCrearVista.as_view()),  
    path('usuarios/<int:pk>/', UsuarioDetalleVista.as_view(), name='usuario-detalle'),
    path('usuarios/<int:pk>',  UsuarioDetalleVista.as_view()), 
]
