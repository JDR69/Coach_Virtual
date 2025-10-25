// Fichero: movil/lib/api/endpoints.dart

class Endpoints {
  static const String baseUrl = 'http://192.168.1.2:8000';
  static const String apiBaseUrl = '$baseUrl/api';

  // Autenticación
  static const String token = '/token/';
  static const String tokenRefresh = '/token/refresh/';
  static const String register = '/usuarios/';
  static const String me = '/usuarios/me/';

  // Otras rutas...
}