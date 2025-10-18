import React, { useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./auth/AuthProvider.jsx";
import { CategoryProvider } from "./context/CategoryContext";

function AppContent({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  // Ocultar sidebar en login, seleccionar y SOLO en /musculo (no en subrutas)
  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/seleccionar" ||
    location.pathname === "/musculo";

  return (
    <>
      {/* Header en lugar de Navbar */}
      <Header
        sidebarOpen={!hideSidebar && sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {!hideSidebar && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <div
        className={`pt-16 transition-all duration-300 ${
          !hideSidebar && sidebarOpen ? "ml-56 max-md:ml-0" : "ml-0"
        }`}
      >
        <AppRoutes />
      </div>
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
          <AppContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </CategoryProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
