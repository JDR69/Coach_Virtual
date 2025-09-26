import React from "react";
import { useAuth } from "../auth/useAuth";         // <-- importante
import { useNavigate } from "react-router-dom";

const Navbar = ({ sidebarOpen, onMenuClick }) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();                 // limpia tokens/estado
    navigate("/login", { replace: true }); // opcional: la guarda igual te redirige
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-blue-600 px-4 flex items-center z-50 shadow">
      <div className="max-w-7xl mx-auto flex items-center w-full">
        {/* Botón menú (siempre visible cuando Navbar está montado) */}
        <button
          className="text-white focus:outline-none text-2xl ml-2"
          onClick={onMenuClick}
          aria-label="Abrir/Cerrar menú"
          title="Menú"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Título centrado */}
        <div className="flex-1 text-center text-white font-bold text-xl">
          Coach Virtual
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              {/* Mostrar nombre o email si existe */}
              {user && (user.name || user.email) && (
                <span className="hidden sm:block text-white/90 text-sm">
                  {user.name || user.email}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition-colors"
                title="Cerrar sesión"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
