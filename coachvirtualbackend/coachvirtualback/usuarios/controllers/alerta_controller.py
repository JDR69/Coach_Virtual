# controllers/alerta_controller.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from ..models import Alertas
from ..serializers import AlertasSerializer


class AlertasListaCrearVista(APIView):
    def get_permissions(self):
        return [IsAuthenticated()]

    def get(self, request):
        if not request.user.is_superuser:
            return Response(
                {"detail": "No tienes permiso para ver la lista de alertas."},
                status=status.HTTP_403_FORBIDDEN
            )
        alertas = Alertas.objects.select_related('usuario').all().order_by('id')
        serializer = AlertasSerializer(alertas, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Si no hay token válido, mejor cortar aquí con 401 claro
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Autenticación requerida (envía Authorization: Bearer <token>)"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = AlertasSerializer(data=request.data, context={'request': request})

        # Si los datos son inválidos, queremos ver el detalle (400), no un 500
        serializer.is_valid(raise_exception=True)

        try:
            alerta = serializer.save()  # asigna usuario desde el serializer
            return Response(AlertasSerializer(alerta).data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            # FK o constraints
            return Response({"detail": f"Error de integridad: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # último recurso: devolver el mensaje en vez de 500 opaco
            return Response({"detail": f"Error al crear alerta: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class AlertasDetalleVista(APIView):
    permission_classes = [IsAuthenticated]

    def _can(self, request, alerta):
        return request.user.is_superuser or alerta.usuario_id == request.user.id

    def get(self, request, pk):
        alerta = get_object_or_404(Alertas, pk=pk)
        if not self._can(request, alerta):
            return Response({"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN)
        return Response(AlertasSerializer(alerta).data)

    def put(self, request, pk):
        alerta = get_object_or_404(Alertas, pk=pk)
        if not self._can(request, alerta):
            return Response({"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data.pop('usuario', None)  # no permitir reasignar dueño

        serializer = AlertasSerializer(alerta, data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({"detail": f"Error al actualizar: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        alerta = get_object_or_404(Alertas, pk=pk)
        if not self._can(request, alerta):
            return Response({"detail": "No autorizado."}, status=status.HTTP_403_FORBIDDEN)
        alerta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
