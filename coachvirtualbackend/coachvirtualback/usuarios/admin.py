from django.contrib import admin
from .models import (
    Usuario, Plan, Alertas, DetallePlan, Objetivo, TipoPrograma,
    ProgramaEntrenamiento, Dia, TipoEntrenamiento, DiasEntrenamiento,
    Mediciones, Sesion, Musculo, Ejercicios, DetalleMusculo,
    EjerciciosAsignados
)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'email', 'genero', 'fecha_nacimiento']
    list_filter = ['genero', 'fecha_nacimiento']
    search_fields = ['nombre', 'email']

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio']
    list_filter = ['precio']

@admin.register(Alertas)
class AlertasAdmin(admin.ModelAdmin):
    list_display = ['mensaje', 'fecha', 'estado', 'usuario']
    list_filter = ['estado', 'fecha']
    search_fields = ['mensaje', 'usuario__nombre']

@admin.register(DetallePlan)
class DetallePlanAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'plan', 'fecha_inicio', 'fecha_final']
    list_filter = ['plan', 'fecha_inicio']

@admin.register(Objetivo)
class ObjetivoAdmin(admin.ModelAdmin):
    list_display = ['nombre']

@admin.register(TipoPrograma)
class TipoProgramaAdmin(admin.ModelAdmin):
    list_display = ['nombre']

@admin.register(ProgramaEntrenamiento)
class ProgramaEntrenamientoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'fecha_inicio', 'fecha_final', 'estado']
    list_filter = ['estado', 'tipo_programa', 'objetivo']

@admin.register(Dia)
class DiaAdmin(admin.ModelAdmin):
    list_display = ['nombre']

@admin.register(TipoEntrenamiento)
class TipoEntrenamientoAdmin(admin.ModelAdmin):
    list_display = ['nombre']

@admin.register(DiasEntrenamiento)
class DiasEntrenamientoAdmin(admin.ModelAdmin):
    list_display = ['dia', 'tipo_entrenamiento', 'descripcion']
    list_filter = ['dia', 'tipo_entrenamiento']

@admin.register(Mediciones)
class MedicionesAdmin(admin.ModelAdmin):
    list_display = ['calorias', 'cronometrio']

@admin.register(Sesion)
class SesionAdmin(admin.ModelAdmin):
    list_display = ['fecha', 'estado', 'dias_entrenamiento']
    list_filter = ['estado', 'fecha']

@admin.register(Musculo)
class MusculoAdmin(admin.ModelAdmin):
    list_display = ['nombre']

@admin.register(Ejercicios)
class EjerciciosAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'estado']
    list_filter = ['estado']

@admin.register(DetalleMusculo)
class MusculoAdmin(admin.ModelAdmin):
    list_display = ['ejercicio', 'musculo', 'porcentaje']
    list_filter = ['musculo']

@admin.register(EjerciciosAsignados)
class EjerciciosAsignadosAdmin(admin.ModelAdmin):
    list_display = ['ejercicio', 'series', 'repeticiones', 'sesion']
    list_filter = ['ejercicio']
