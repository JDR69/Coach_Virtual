// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import { CategoryProvider } from "./context/CategoryContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import Dispositivo from "./components/Dispositivo";

function AppContent({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  // ⬇️ Ocultar header SOLO en la página de login
  const hideHeader = location.pathname === "/login";

  // ⬇️ Ocultar sidebar (y panel de dispositivo) en login y en /musculo
  const hideSidebar =
    location.pathname === "/login" ||
    // location.pathname === "/seleccionar" ||  // Si luego quieres ocultar ahí, descomenta
    location.pathname === "/musculo";

  return (
    <>
      {/* Header en lugar de Navbar (NO se muestra en /login) */}
      {!hideHeader && (
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Sidebar (no se muestra en /login ni en /musculo) */}
      {!hideSidebar && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Contenido principal */}
      <div
        className={`${hideHeader ? "" : "pt-16"} transition-all duration-300 ${
          !hideSidebar && sidebarOpen ? "ml-56 max-md:ml-0" : "ml-0"
        }`}
      >
        <AppRoutes />
      </div>

      {/* Panel Google Fit (solo cuando hay sidebar) */}
      {!hideSidebar && <Dispositivo />}
    </>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <CategoryProvider>
          <SubscriptionProvider>
            <AppContent
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </SubscriptionProvider>
        </CategoryProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
