# Arquitectura del Sistema: Asistente Virtual de Entrenamiento Físico y Fisioterapia

El sistema se compone de dos módulos principales: un backend (Django) y un frontend (React), que interactúan a través de una API RESTful.

## 1. Backend (Python/Django)

### Tecnologías Clave:
- **Framework:** Django 5.2.6
- **API:** Django REST Framework 3.16.1
- **Autenticación:** `djangorestframework_simplejwt` (JWT)
- **Base de Datos:** PostgreSQL (gestionada con `psycopg2`)
- **Configuración:** `python-decouple` para variables de entorno.
- **CORS:** `corsheaders` para gestionar el acceso cruzado.

### Estructura de Módulos (Apps de Django):
- **`usuarios`**: Gestión de usuarios, autenticación, perfiles.
    - Modelos: `Usuario` (extiende `AbstractUser` de Django), `Alertas`.
    - Vistas: `TokenObtainPairView`, `TokenRefreshView` (de `simplejwt`), vistas para registro, perfil, etc.
    - Controladores: `alerta_controller.py`, `suscripcion_controller.py`, `usuario_controller.py`.
- **`poses`**: Lógica relacionada con la detección y el entrenamiento de poses.
    - Modelos: `PoseTrainingData`.
    - Serializadores: `PoseSerializer`.
    - Controladores: `pose_controller.py`.
- **`suscripciones`**: Gestión de planes de suscripción.
    - Modelos: `Suscripcion`.
    - Controladores: `suscripcion_controller.py`.

### Flujo de Autenticación:
1. El frontend envía credenciales de usuario a `/api/token/`.
2. El backend devuelve un token de acceso y un token de refresco (JWT).
3. El token de acceso se usa en las cabeceras `Authorization: Bearer <token>` para acceder a recursos protegidos de la API.
4. El token de refresco se usa en `/api/token/refresh/` para obtener un nuevo token de acceso cuando el actual expira.

### Rutas Principales (coachvirtualback/coachvirtualback/urls.py):
- `/admin/`: Panel de administración de Django.
- `/api/token/`: Obtención de tokens.
- `/api/token/refresh/`: Refresco de tokens.
- `/api/`: Rutas de la app `usuarios`.
- `/api/poses/`: Rutas de la app `poses`.
- `/api/suscripciones/`: Rutas de la app `suscripciones`.

## 2. Frontend (JavaScript/React)

### Tecnologías Clave:
- **Framework:** React 19.1.1 con Vite 7.1.2
- **Estilos:** Tailwind CSS
- **Enrutamiento:** `react-router-dom` 7.8.2
- **Gestión de Estado:** `AuthContext` y `CategoryContext` (posiblemente usando React Context API o similar).
- **Peticiones HTTP:** `axios` 1.11.0
- **Visión por Computador:** `@mediapipe/pose` y `@mediapipe/tasks-vision` para análisis de postura.
- **Iconos:** `lucide-react`, `react-icons`.

### Estructura de Directorios (coachvirtualfront/src):
- **`api/`**: Módulos para interactuar con la API del backend (`api.js`, `auth.service.js`).
- **`assets/`**: Recursos estáticos como imágenes.
- **`auth/`**: Lógica de autenticación (`AuthProvider.jsx`, `useAuth.js`).
- **`components/`**: Componentes reutilizables (`Header.jsx`, `Sidebar.jsx`, `PrivateRute.jsx`, `FeatureGuard.jsx`, etc.).
- **`context/`**: Contextos de React para gestión de estado global (`AuthContext.jsx`, `CategoryContext.jsx`, `SubscriptionContext.jsx`).
- **`data/`**: Datos estáticos o de ejemplo (`posture_examples.json`).
- **`pages/`**: Componentes de página principales.
    - `Login/`: `LoginPage.jsx`, `IniciarSesion.jsx`, `Register.jsx`.
    - `GestionarUsuario/`: `Perfil.jsx`, `Usuario.jsx`.
    - `GestionarAlerta/`: `Alerta.jsx`, `AlertaUsuario.jsx`, `AlertNotifier.jsx`.
    - `Detector/`: `PoseDetector.jsx`, `PoseTest.jsx`.
    - `Chat/`: `ChatIA.jsx`.
    - `IAPage/`: `IAPage.jsx`.
    - `Planes/`: `Planes.jsx`.
    - `Categoria/`: `SelectCategory.jsx`.
    - `Musculo/`: `Musculo.jsx`.
    - `Ejercicios/`: `Ejercicios.jsx`.
- **`routes/`**: Definición de rutas (`AppRoutes.jsx`, `CategoryGate.jsx`).
- **`services/`**: Lógica de negocio y servicios específicos (`AlertaService.js`, `groqClient.js`, `poseTrainingApi.js`, `routine.service.js`, `UsuarioService.js`).
- **`utils/`**: Utilidades varias (`poseUtils.js`, `useSpeech.js`).

### Flujo de Navegación y Rutas (AppRoutes.jsx):
- **Rutas públicas:** `/login` (accesibles solo para no autenticados).
- **Rutas protegidas:** Requieren autenticación (`RequireAuth`).
    - Redirección inicial (`/`) basada en el estado de autenticación y rol.
    - Rutas para selección de categoría, músculos y ejercicios (`/seleccionar`, `/musculo`, `/musculo/ejercicios`).
    - Rutas principales: `/home`, `/perfil`, `/planes`, `/pose-test`, `/ia`, `/chat-ia`, `/mis-alertas`.
- **Rutas de superusuario:** Protegidas por `RequireSuper` (`/usuario`, `/alertas`).
- **Layouts:** `AuthenticatedLayout` envuelve las rutas autenticadas para incluir componentes como `AlertNotifier`.

## Diagrama de Arquitectura (Mermaid)

```mermaid
graph TD
    User -->|Interactúa con| Frontend
    Frontend -->|Peticiones HTTP (axios)| Backend
    Backend -->|Autenticación JWT| Auth_Service
    Backend -->|Acceso a Datos| PostgreSQL
    Auth_Service -->|Tokens JWT| Frontend
    Frontend -->|Visión por Computador| MediaPipe_Pose
    Frontend -->|Chat/IA| Groq_Client
    Backend -->|Gestión de Usuarios| Usuarios_App
    Backend -->|Gestión de Poses| Poses_App
    Backend -->|Gestión de Suscripciones| Suscripciones_App

    subgraph Frontend (React/Vite)
        A[AppRoutes] --> B(Pages)
        B --> C(Components)
        B --> D(Contexts)
        C --> E(Utils)
        D --> F(Auth Logic)
        F --> G(API Services)
    end

    subgraph Backend (Django/DRF)
        H[URLs] --> I(Usuarios App)
        H --> J(Poses App)
        H --> K(Suscripciones App)
        I --> L(Modelos de Usuarios)
        J --> M(Modelos de Poses)
        K --> N(Modelos de Suscripciones)
        I --> O(Controladores de Usuarios)
        J --> P(Controladores de Poses)
        K --> Q(Controladores de Suscripciones)
    end

    MediaPipe_Pose -->|Análisis de Postura| Frontend
    Groq_Client -->|Interacción IA| Frontend