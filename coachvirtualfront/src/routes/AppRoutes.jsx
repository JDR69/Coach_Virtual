import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useCategory } from "../context/CategoryContext";

import Home from "../pages/Home";
import Perfil from "../pages/GestionarUsuario/Perfil";
import Usuario from "../pages/GestionarUsuario/Usuario";
import Alerta from "../pages/GestionarAlerta/Alerta";
import AlertaUsuario from "../pages/GestionarAlerta/AlertaUsuario";
import LoginPage from "../pages/Login/LoginPage";
import PoseTest from "../pages/Detector/PoseTest";
import BicepsCurlTrainer from "../pages/Detector/BicepsCurlTrainer";
import IAPage from "../pages/IAPage/IAPage";
import ChatIA from "../pages/Chat/ChatIA";
import Planes from "../pages/Planes/Planes";
import Pago from "../pages/Planes/Pago";

import AlertNotifier from "../pages/GestionarAlerta/AlertNotifier";

// Flujo categoría / músculo / ejercicios
import SelectCategory from "../pages/Categoria/SelectCategory";
import CategoryGate from "./CategoryGate";
import Musculo from "../pages/Musculo/Musculo";
import Ejercicios from "../pages/Ejercicios/Ejercicios";

// ====== Guards ======
function RequireAuth() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

function GuestOnly() {
  const { isAuthenticated, isSuper, initializing } = useAuth();
  const { category } = useCategory();
  const location = useLocation();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;

  if (isAuthenticated) {
    // Redirección por rol
    if (isSuper) return <Navigate to="/perfil" replace />;
    // Usuario normal: respeta flujo seleccionar/músculo
    const next = category ? "/musculo" : "/seleccionar";
    return <Navigate to={next} replace />;
  }

  return <Outlet />;
}

function RootRedirect() {
  const { isAuthenticated, isSuper, initializing } = useAuth();
  const { category } = useCategory();

  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Redirección por rol
  if (isSuper) return <Navigate to="/perfil" replace />;
  // Usuario normal: respeta flujo seleccionar/músculo
  return <Navigate to={category ? "/musculo" : "/seleccionar"} replace />;
}

function RequireSuper() {
  const { isSuper, initializing } = useAuth();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return isSuper ? <Outlet /> : <Navigate to="/home" replace />;
}

function AuthenticatedLayout() {
  return (
    <>
      <AlertNotifier intervalMs={10000} />
      <Outlet />
    </>
  );
}

// ====== Rutas ======
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Invitados */}
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Autenticados */}
      <Route element={<RequireAuth />}>
        <Route element={<AuthenticatedLayout />}>
          {/* 1) Selección de categoría (sin sidebar) */}
          <Route path="/seleccionar" element={<SelectCategory />} />

          {/* 2) Requiere categoría */}
          <Route element={<CategoryGate />}>
            {/* 2.a) Elegir uno o más músculos (sin sidebar) */}
            <Route path="/musculo" element={<Musculo />} />
            {/* 2.b) Ejercicios (aquí ya aparece el sidebar) */}
            <Route path="/musculo/ejercicios" element={<Ejercicios />} />
          </Route>

          {/* Otras secciones (sidebar visible) */}
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />

          
          <Route path="/planes" element={<Planes />} />
          <Route path="/planes/pago" element={<Pago />} />


          <Route path="/pose-test" element={<PoseTest />} />
          <Route path="/biceps-curl" element={<BicepsCurlTrainer />} />
          <Route path="/ia" element={<IAPage />} />
          <Route path="/chat-ia" element={<ChatIA />} />
          <Route path="/mis-alertas" element={<AlertaUsuario />} />

          {/* SOLO superusuario */}
          <Route element={<RequireSuper />}>
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/alertas" element={<Alerta />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
