import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

import Home from "../pages/Home";
import Perfil from "../pages/GestionarUsuario/Perfil";
import Usuario from "../pages/GestionarUsuario/Usuario";
import Alerta from "../pages/GestionarAlerta/Alerta";
import LoginPage from "../pages/Login/LoginPage";
import PoseTest from "../pages/PoseTest";
import IAPage from "../pages/IAPage";

function RequireAuth() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing)
    return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

function GuestOnly() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();
  if (initializing)
    return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  const back = location.state?.from?.pathname || "/perfil";
  return isAuthenticated ? <Navigate to={back} replace /> : <Outlet />;
}

function RootRedirect() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing)
    return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return <Navigate to={isAuthenticated ? "/perfil" : "/login"} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/alertas" element={<Alerta />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pose-test" element={<PoseTest />} />
        <Route path="/ia" element={<IAPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
