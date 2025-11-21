// src/routes/AppRoutes.jsx (o como se llame)
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
// Nueva ruta reorganizada de rutina bíceps dentro de categoría gimnasio
import BicepsCurl from "../pages/Categoria/gimnasio/brazos/BicepsCurl";
import Flexiones from "../pages/Categoria/gimnasio/brazos/Flexiones";
import PressBanca from "../pages/Categoria/gimnasio/brazos/PressBanca";
import PressInclinado from "../pages/Categoria/gimnasio/brazos/PressInclinado";
import RemoSentadoMaquina from "../pages/Categoria/gimnasio/espalda/RemoSentadoMaquina";
import RemoConMancuernas from "../pages/Categoria/gimnasio/espalda/RemoConMancuernas";
import RemoSentadoPoleaBaja from "../pages/Categoria/gimnasio/espalda/RemoSentadoPoleaBaja";
import RemoUnilateralPiePolea from "../pages/Categoria/gimnasio/espalda/RemoUnilateralPiePolea";
import RemoInclinadoMancuernas from "../pages/Categoria/gimnasio/espalda/RemoInclinadoMancuernas";
import YogaPage from "../pages/Yoga/YogaPage";
import EjerciciosPage from "../pages/Ejercicios/EjerciciosPage";
import IAPage from "../pages/IAPage/IAPage";
import ChatIA from "../pages/Chat/ChatIA";
import Planes from "../pages/Planes/Planes";
import Pago from "../pages/Planes/Pago";

import AlertNotifier from "../pages/GestionarAlerta/AlertNotifier";

// Flujo de ejercicios limpio
import CategoriaEjercicios from "../pages/EjerciciosFlow/CategoriaEjercicios";
import ParteCuerpo from "../pages/EjerciciosFlow/ParteCuerpo";
import SeleccionEjercicio from "../pages/EjerciciosFlow/SeleccionEjercicio";

// Flujo categoría / músculo / ejercicios
import SelectCategory from "../pages/Categoria/SelectCategory";
import CategoryGate from "./CategoryGate";
import Musculo from "../pages/GestionarMusculo/Musculo";
import MusculoUsuario from "../pages/GestionarMusculo/MusculoUsuario";
import Ejercicio from "../pages/GestionarEjercicio/Ejercicio";
import Detalle_Musculo from "../pages/Detalle_Musculo/Detalle_Musculo";
import DetalleMusculoUsuario from "../pages/GestionarEjercicio/Detalle_MusculoUsuario";
import Ejercicio_Asignado from "../pages/GestionarEjercicio_Asignacion/Ejercicio_Asignado";
import Ejercicio_AsignadoUsuario from "../pages/GestionarEjercicio_Asignacion/Ejercicio_AsignadoUsuario";
import GestionarTipo from "../pages/GestionarTipo/GestionarTipo";
import GestionarTipoUsuario from "../pages/GestionarTipo/GestionarTipoUsuario";

// ====== Guards ======
function RequireAuth() {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestOnly() {
  const { isAuthenticated, isSuper, initializing } = useAuth();
  const { category } = useCategory();
  const location = useLocation();

  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;

  if (isAuthenticated) {
    if (isSuper) return <Navigate to="/home" replace />;
    // usuario normal: respetar flujo
    const fromRoot = location.pathname === "/" || location.pathname === "/login";
    if (fromRoot) {
      return (
        <Navigate
          to={category ? "/mis-musculos" : "/seleccionar"}
          replace
        />
      );
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function RootRedirect() {
  const { isAuthenticated, isSuper, initializing } = useAuth();
  const { category } = useCategory();

  if (initializing) return <div style={{ padding: 24 }}>Verificando sesión…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (isSuper) return <Navigate to="/home" replace />;
  return (
    <Navigate
      to={category ? "/mis-musculos" : "/seleccionar"}
      replace
    />
  );
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

          {/* 2) Flujo guiado que requiere categoría */}
          <Route element={<CategoryGate />}>
            {/* 2.a) Elegir músculo */}
            <Route path="/mis-musculos" element={<MusculoUsuario />} />
            {/* 2.b) Ver detalles según músculo elegido */}
            <Route path="/mis-ejercicios" element={<DetalleMusculoUsuario />} />
            {/* 2.c) Ver ejercicios asignados según detalles elegidos */}
            <Route
              path="/mis-ejercicios-asignados"
              element={<Ejercicio_AsignadoUsuario />}
            />

          </Route>

          {/* Otras secciones (sidebar visible) */}
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/planes/pago" element={<Pago />} />
          <Route path="/pose-test" element={<PoseTest />} />
          {/* Rutina específica reorganizada */}
          <Route path="/categoria/gimnasio/brazos/biceps-curl" element={<BicepsCurl />} />
          <Route path="/categoria/gimnasio/brazos/flexiones" element={<Flexiones />} />
          <Route path="/categoria/gimnasio/brazos/press-banca" element={<PressBanca />} />
          <Route path="/categoria/gimnasio/brazos/press-inclinado" element={<PressInclinado />} />
          {/* Espalda */}
          <Route path="/categoria/gimnasio/espalda/remo-sentado-maquina" element={<RemoSentadoMaquina />} />
          <Route path="/categoria/gimnasio/espalda/remo-con-mancuernas" element={<RemoConMancuernas />} />
          <Route path="/categoria/gimnasio/espalda/remo-sentado-polea-baja" element={<RemoSentadoPoleaBaja />} />
          <Route path="/categoria/gimnasio/espalda/remo-unilateral-pie-polea" element={<RemoUnilateralPiePolea />} />
          <Route path="/categoria/gimnasio/espalda/remo-inclinado-mancuernas" element={<RemoInclinadoMancuernas />} />
          <Route path="/yoga" element={<YogaPage />} />
          <Route path="/ejercicios" element={<EjerciciosPage />} />
          <Route path="/ia" element={<IAPage />} />
          <Route path="/chat-ia" element={<ChatIA />} />

          {/* Flujo limpio de ejercicios */}
          <Route path="/ejercicios/categoria" element={<CategoriaEjercicios />} />
          <Route path="/ejercicios/parte-cuerpo" element={<ParteCuerpo />} />
          <Route path="/ejercicios/seleccion" element={<SeleccionEjercicio />} />
          <Route path="/mis-alertas" element={<AlertaUsuario />} />
          <Route path="/seleccionar" element={<GestionarTipoUsuario />} />

          {/* SOLO superusuario */}
          <Route element={<RequireSuper />}>
            <Route path="/musculos" element={<Musculo />} />
            <Route path="/usuarios" element={<Usuario />} />
            <Route path="/alertas" element={<Alerta />} />
            <Route path="/banca-de-ejercicios" element={<Ejercicio />} />
            <Route path="/detalles-musculo" element={<Detalle_Musculo />} />
            <Route path="/ejercicios-asignados" element={<Ejercicio_Asignado />} />
            <Route path="/tipo" element={<GestionarTipo />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
