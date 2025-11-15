# musculos/serializers.py
from rest_framework import serializers
from .models import Musculo, DetalleMusculo, Ejercicio, EjercicioAsignado


class MusculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Musculo
        fields = ["id", "nombre", "url"]
        read_only_fields = ["id"]


class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = ["id", "nombre", "url", "estado"]
        read_only_fields = ["id"]


class EjercicioAsignadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjercicioAsignado
        # 🔹 ahora incluye la FK a DetalleMusculo
        fields = ["id", "idDetalleMusculo", "series", "repeticiones"]
        read_only_fields = ["id"]


class DetalleMusculoSerializer(serializers.ModelSerializer):
    # 🔹 Si quieres ver los ejercicios asignados en el JSON del detalle:
    ejercicios_asignados = EjercicioAsignadoSerializer(many=True, read_only=True)

    class Meta:
        model = DetalleMusculo
        fields = ["id", "porcentaje", "idMusculo", "idEjercicio", "ejercicios_asignados"]
        read_only_fields = ["id"]
