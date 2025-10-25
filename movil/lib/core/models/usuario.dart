class Usuario {
  final int id;
  final String email;
  final String username;
  final String? firstName;
  final String? lastName;
  final bool isSuperuser;
  final DateTime? fechaNacimiento;
  final String? genero;
  final double? altura;
  final double? peso;

  Usuario({
    required this.id,
    required this.email,
    required this.username,
    this.firstName,
    this.lastName,
    this.isSuperuser = false,
    this.fechaNacimiento,
    this.genero,
    this.altura,
    this.peso,
  });

  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      id: json['id'],
      email: json['email'],
      username: json['username'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      isSuperuser: json['is_superuser'] ?? false,
      fechaNacimiento: json['fecha_nacimiento'] != null
          ? DateTime.tryParse(json['fecha_nacimiento'])
          : null,
      genero: json['genero'],
      altura: double.tryParse(json['altura']?.toString() ?? ''),
      peso: double.tryParse(json['peso']?.toString() ?? ''),
    );
  }

  String get fullName {
    return '${firstName ?? ''} ${lastName ?? ''}'.trim();
  }
}