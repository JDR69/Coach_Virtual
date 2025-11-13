from rest_framework import serializers
from .models import Musculo, DetalleMusculo, Ejercicio, EjercicioAsignado


class MusculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Musculo
        fields = '__all__'


class DetalleMusculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleMusculo
        fields = '__all__'


class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'


class EjercicioAsignadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjercicioAsignado
        fields = '__all__'
