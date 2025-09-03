import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import React, { useState } from "react";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar siempre visible en desktop, toggle en móvil
  return (
    <BrowserRouter>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="pt-16 ml-56 max-md:ml-0 transition-all duration-300">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}