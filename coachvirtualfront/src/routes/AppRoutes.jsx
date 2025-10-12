// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

import Home from "../pages/Home";
import Perfil from "../pages/GestionarUsuario/Perfil";
import Usuario from "../pages/GestionarUsuario/Usuario";
import Alerta from "../pages/GestionarAlerta/Alerta";
import AlertaUsuario from "../pages/GestionarAlerta/AlertaUsuario";
import LoginPage from "../pages/Login/LoginPage";
import PoseTest from "../pages/PoseTest";
import IAPage from "../pages/IAPage";
import ChatIA from "../pages/Chat/ChatIA";

// ⬇️ importa el notificador
import AlertNotifier from "../pages/GestionarAlerta/AlertNotifier";

// ====== Guards ======
function RequireAuth() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

function GuestOnly() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  const back = location.state?.from?.pathname || "/home";
  return isAuthenticated ? <Navigate to={back} replace /> : <Outlet />;
}

function RootRedirect() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}

function RequireSuper() {
  const { isSuper, initializing } = useAuth();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return isSuper ? <Outlet /> : <Navigate to="/home" replace />;
}

// ====== Layout autenticado con notificador ======
function AuthenticatedLayout() {
  // Monta el notificador UNA sola vez en toda el área autenticada
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
        {/* Layout que incluye el notificador */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/pose-test" element={<PoseTest />} />
          <Route path="/ia" element={<IAPage />} />
          <Route path="/chat-ia" element={<ChatIA />} />
          <Route path="/mis-alertas" element={<AlertaUsuario />} />  {/* usuario */}

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
