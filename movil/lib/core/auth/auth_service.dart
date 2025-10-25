import 'dart:convert';
import '../../api/api_client.dart';
import '../../api/endpoints.dart';
import 'token_storage.dart';

class AuthService {
  final ApiClient _apiClient;

  AuthService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _apiClient.post(
      Endpoints.token,
      body: {
        'email': email,
        'password': password,
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final accessToken = data['access'];
      final refreshToken = data['refresh'];

      if (accessToken != null && refreshToken != null) {
        await TokenStorage.saveTokens(
          accessToken: accessToken,
          refreshToken: refreshToken,
        );
      }
      
      // Por ahora, solo devolvemos los tokens.
      // Más adelante, podríamos devolver el perfil del usuario.
      return data;
    } else {
      throw Exception('Failed to login');
    }
  }

  Future<void> logout() async {
    // Opcional: llamar a un endpoint de logout en el backend si existe.
    await TokenStorage.clearTokens();
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String username,
    required String password,
    String? firstName,
    String? lastName,
    String? fechaNacimiento, // Formato 'YYYY-MM-DD'
    String? genero, // 'F', 'M', 'O'
    String? altura,
    String? peso,
  }) async {
    final Map<String, dynamic> body = {
      'email': email,
      'username': username,
      'password': password,
    };

    if (firstName != null && firstName.isNotEmpty) body['first_name'] = firstName;
    if (lastName != null && lastName.isNotEmpty) body['last_name'] = lastName;
    if (fechaNacimiento != null && fechaNacimiento.isNotEmpty) body['fecha_nacimiento'] = fechaNacimiento;
    if (genero != null && genero.isNotEmpty) body['genero'] = genero;
    if (altura != null && altura.isNotEmpty) body['altura'] = altura;
    if (peso != null && peso.isNotEmpty) body['peso'] = peso;

    final response = await _apiClient.post(
      Endpoints.register,
      body: body,
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      final errorData = jsonDecode(response.body);
      throw Exception('Failed to register: ${errorData.toString()}');
    }
  }
}