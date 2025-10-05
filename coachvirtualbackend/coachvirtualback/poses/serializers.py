from rest_framework import serializers
from .models import PoseTrainingData

class PoseTrainingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoseTrainingData
        fields = ['id', 'ejercicio', 'landmarks', 'angulos', 'etiqueta', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_etiqueta(self, value):
        if value not in ['correcto', 'incorrecto']:
            raise serializers.ValidationError("La etiqueta debe ser 'correcto' o 'incorrecto'")
        return value
