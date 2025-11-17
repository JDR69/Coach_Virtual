# musculos/serializers.py
from rest_framework import serializers
from .models import Musculo, DetalleMusculo, Ejercicio, EjercicioAsignado, Tipo


class MusculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Musculo
        fields = ["id", "nombre", "url"]
        read_only_fields = ["id"]


class TipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo
        fields = ["id", "nombre", "estado"]
        read_only_fields = ["id"]


class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = ["id", "nombre", "url", "estado"]
        read_only_fields = ["id"]


class EjercicioAsignadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjercicioAsignado
        fields = ["id", "idDetalleMusculo", "series", "repeticiones"]
        read_only_fields = ["id"]


class DetalleMusculoSerializer(serializers.ModelSerializer):
    # 🔹 Para ver los ejercicios asignados dentro del detalle
    ejercicios_asignados = EjercicioAsignadoSerializer(many=True, read_only=True)
    # 🔹 Para devolver también la info del tipo (además del idTipo)
    tipo = TipoSerializer(source="idTipo", read_only=True)

    class Meta:
        model = DetalleMusculo
        fields = [
            "id",
            "porcentaje",
            "idMusculo",
            "idEjercicio",
            "idTipo",          # FK para escribir
            "tipo",            # datos completos del tipo (solo lectura)
            "ejercicios_asignados",
        ]
        read_only_fields = ["id", "tipo", "ejercicios_asignados"]
