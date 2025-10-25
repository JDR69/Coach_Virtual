# Plan de Desarrollo para la Aplicación Móvil (Flutter) - v2 (Simplificado)

## 1. Objetivo

Crear una aplicación móvil nativa con Flutter que replique y mejore la experiencia del frontend web existente, conectándose al backend de Django. Este plan utiliza una estructura de directorios simplificada, orientada a funcionalidades, para facilitar la edición y el mantenimiento.

## 2. Estructura de Directorios Simplificada (por Funcionalidad)

```
movil/
└── lib/
    ├── main.dart
    ├── api/
    │   ├── api_client.dart      # Cliente HTTP centralizado con interceptores
    │   └── endpoints.dart       # Constantes para las rutas de la API
    ├── core/
    │   ├── auth/
    │   │   ├── auth_provider.dart   # Gestiona el estado (user, isAuthenticated)
    │   │   ├── auth_service.dart    # Lógica de login, logout, registro
    │   │   └── token_storage.dart   # Almacenamiento seguro de tokens
    │   └── models/
    │       └── usuario.dart         # Modelo de datos del usuario
    ├── features/
    │   ├── 1_auth/
    │   │   ├── login_page.dart
    │   │   └── register_page.dart
    │   ├── 2_category/
    │   │   └── select_category_page.dart
    │   ├── 3_pose_detection/
    │   │   └── pose_detector_page.dart
    │   ├── 4_profile/
    │   │   └── profile_page.dart
    │   └── 5_alerts/
    │       ├── my_alerts_page.dart
    │       └── alert_notifier_widget.dart
    ├── shared/
    │   ├── widgets/               # Widgets reutilizables (botones, layout)
    │   │   └── main_layout.dart
    │   └── routing/
    │       └── app_router.dart      # Configuración de GoRouter
    └── utils/
        └── app_colors.dart
```

## 3. Plan de Implementación por Secciones

### Sección 1: Configuración y Núcleo de Autenticación (Prioridad: Crítica)

**Objetivo:** Establecer la base del proyecto y la lógica de autenticación completa.

1.  **Crear Proyecto y Dependencias:**
    *   Generar el proyecto con `flutter create movil`.
    *   Añadir `http`, `provider`, `flutter_secure_storage`, `shared_preferences` y `go_router` a `pubspec.yaml`.
2.  **Estructura Base:** Crear la estructura de directorios simplificada (`api`, `core`, `features`, `shared`, `utils`).
3.  **Cliente API (`api/api_client.dart`):**
    *   Configurar un cliente `http` con la URL base.
    *   Implementar un interceptor que añada el token de acceso a las cabeceras y gestione el refresco automático del token en caso de error 401.
4.  **Núcleo de Autenticación (`core/auth/`):**
    *   **`token_storage.dart`**: Implementar métodos para guardar, leer y borrar tokens usando `flutter_secure_storage`.
    *   **`auth_service.dart`**: Crear la lógica para `login`, `register` y `logout`, interactuando con el `api_client` y `token_storage`.
    *   **`auth_provider.dart`**: Gestionar y exponer el estado del usuario (`user`, `isAuthenticated`, `isSuperuser`, `initializing`). Al iniciar, debe intentar restaurar la sesión.
5.  **Modelo de Usuario (`core/models/usuario.dart`):** Crear la clase `Usuario` para mapear los datos del backend.

**Pruebas de la Sección 1:**
*   Verificar que la lógica de `AuthService` puede llamar a la API, obtener tokens y guardarlos.
*   Confirmar que `AuthProvider` puede restaurar una sesión si hay un token válido.

### Sección 2: UI de Autenticación y Navegación (Prioridad: Alta)

**Objetivo:** Conectar la lógica de autenticación con la interfaz de usuario y configurar la navegación inicial.

1.  **UI de Login y Registro (`features/1_auth/`):**
    *   Crear `login_page.dart` y `register_page.dart` con los formularios necesarios.
    *   Conectar los formularios a los métodos `signIn` y `register` del `AuthProvider`.
2.  **Enrutador (`shared/routing/app_router.dart`):**
    *   Configurar `GoRouter`.
    *   Definir las rutas `/login` y `/register`.
    *   Implementar la lógica de redirección: si el usuario está autenticado, redirigir a `/` (que luego llevará a la página principal); si no, a `/login`.
3.  **Integración en `main.dart`:**
    *   Envolver la aplicación con el `AuthProvider`.
    *   Configurar el `MaterialApp.router` para usar la configuración de `GoRouter`.

**Pruebas de la Sección 2:**
*   Un usuario puede registrarse y luego iniciar sesión.
*   La aplicación redirige correctamente a la página de login si no hay sesión.
*   Después del login, la aplicación navega a una página principal (placeholder por ahora).

### Sección 3: Flujo Principal del Usuario (Prioridad: Media)

**Objetivo:** Implementar la selección de categoría y el layout principal.

1.  **UI de Selección de Categoría (`features/2_category/select_category_page.dart`):**
    *   Crear la pantalla para que el usuario elija "Gimnasio" o "Fisioterapia".
    *   Guardar la selección en `shared_preferences`.
2.  **Layout Principal (`shared/widgets/main_layout.dart`):**
    *   Crear un `Scaffold` con una `BottomNavigationBar` para la navegación principal (`Home`, `Perfil`, etc.).
3.  **Actualizar Rutas:**
    *   Añadir la ruta `/seleccionar-categoria` y las rutas que usarán el `MainLayout`.
    *   Ajustar la redirección post-login para que vaya a `/seleccionar-categoria` si no hay una categoría guardada.

**Pruebas de la Sección 3:**
*   El usuario puede seleccionar y guardar una categoría.
*   El layout principal con la barra de navegación se muestra en las páginas correctas.

### Sección 4: Detección de Poses y Funcionalidades Adicionales (Prioridad: Media-Baja)

**Objetivo:** Integrar las características clave de la aplicación.

1.  **Detección de Poses (`features/3_pose_detection/pose_detector_page.dart`):**
    *   Añadir `camera` y `google_ml_kit` a las dependencias.
    *   Implementar la vista de la cámara, la detección de landmarks y el dibujado sobre un `CustomPainter`.
2.  **Perfil de Usuario (`features/4_profile/profile_page.dart`):**
    *   Mostrar los datos del usuario desde `AuthProvider`.
    *   Crear un formulario para actualizar el perfil.
3.  **Sistema de Alertas (`features/5_alerts/`):**
    *   Crear `my_alerts_page.dart` para listar las alertas del usuario.
    *   Implementar `alert_notifier_widget.dart` para buscar nuevas alertas periódicamente.

**Pruebas de la Sección 4:**
*   La cámara se inicia y detecta poses.
*   El perfil de usuario se muestra y se puede actualizar.
*   Las alertas se muestran correctamente.