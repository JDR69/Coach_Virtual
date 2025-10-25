import 'package:flutter/material.dart';
import 'auth_service.dart';
import '../models/usuario.dart'; // Lo crearemos más adelante

class AuthProvider with ChangeNotifier {
  final AuthService _authService;

  Usuario? _user;
  bool _isAuthenticated = false;
  bool _initializing = true;

  AuthProvider({AuthService? authService}) : _authService = authService ?? AuthService() {
    _init();
  }

  // Getters
  Usuario? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isSuperuser => _user?.isSuperuser ?? false;
  bool get initializing => _initializing;

  Future<void> _init() async {
    // TODO: Implementar la restauración de la sesión.
    // Por ahora, simplemente finalizamos la inicialización.
    _initializing = false;
    notifyListeners();
  }

  Future<void> signIn(String email, String password) async {
    try {
      await _authService.login(email, password);
      // TODO: Después del login, obtener los datos del usuario (fetchMe)
      // y actualizar el estado.
      _isAuthenticated = true;
      notifyListeners();
    } catch (e) {
      // Manejar el error de login
      rethrow;
    }
  }

  Future<void> signOut() async {
    await _authService.logout();
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }
  Future<void> register({
    required String email,
    required String username,
    required String password,
    String? firstName,
    String? lastName,
    String? fechaNacimiento,
    String? genero,
    String? altura,
    String? peso,
  }) async {
    try {
      await _authService.register(
        email: email,
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        fechaNacimiento: fechaNacimiento,
        genero: genero,
        altura: altura,
        peso: peso,
      );
      // No iniciamos sesión automáticamente después del registro,
      // el usuario debe ir a la página de login.
    } catch (e) {
      rethrow;
    }
  }
}