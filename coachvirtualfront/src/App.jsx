import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import React, { useState, useEffect } from "react";

export default function App() {
  // Sidebar abierto por defecto en desktop, cerrado en móvil
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Navbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'ml-56 max-md:ml-0' : 'ml-0'}`}>
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}