"""
Endpoints del módulo dispositivo
 - Google Fit (cuenta fija)
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .googlefit import GoogleFitClient


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def googlefit_stats(request):
    """
    GET /api/dispositivo/googlefit/
    Retorna pasos, calorías y frecuencia cardiaca del día desde Google Fit
    usando la cuenta fija configurada en variables de entorno.
    """
    try:
        client = GoogleFitClient()
        data = client.get_today_stats()
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
