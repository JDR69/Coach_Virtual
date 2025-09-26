import React, { useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./auth/AuthProvider.jsx"; // <-- IMPORTANTE

function AppContent({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && (
        <>
          <Navbar
            sidebarOpen={sidebarOpen}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}
      <div
        className={`pt-16 transition-all duration-300 ${
          !isLoginPage && sidebarOpen ? "ml-56 max-md:ml-0" : "ml-0"
        }`}
      >
        <AppRoutes />
      </div>
    </>
  );
}

export default function App() {
  // Sidebar abierto en desktop, cerrado en móvil
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthProvider>       {/* <-- ENVUELVE A TODO EL ROUTER */}
      <BrowserRouter>
        <AppContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
