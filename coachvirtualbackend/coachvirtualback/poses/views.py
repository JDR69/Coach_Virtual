from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PoseTrainingData
from .serializers import PoseTrainingDataSerializer

class PoseTrainingDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet para manejar datos de entrenamiento de poses.
    
    Endpoints:
    - GET /api/poses/ - Listar todos los datos
    - POST /api/poses/ - Crear nuevo dato
    - GET /api/poses/{id}/ - Obtener un dato específico
    - PUT /api/poses/{id}/ - Actualizar un dato
    - DELETE /api/poses/{id}/ - Eliminar un dato
    - GET /api/poses/export/ - Exportar datos en formato JSON
    """
    queryset = PoseTrainingData.objects.all()
    serializer_class = PoseTrainingDataSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtrar por ejercicio si se proporciona
        ejercicio = self.request.query_params.get('ejercicio', None)
        if ejercicio:
            queryset = queryset.filter(ejercicio=ejercicio)
        # Filtrar por etiqueta si se proporciona
        etiqueta = self.request.query_params.get('etiqueta', None)
        if etiqueta:
            queryset = queryset.filter(etiqueta=etiqueta)
        return queryset
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        """
        Endpoint para exportar todos los datos en formato JSON.
        Útil para entrenar modelos ML.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'total': queryset.count(),
            'data': serializer.data
        })
