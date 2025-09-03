import React from 'react';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-blue-600 px-4 flex items-center z-50 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        {/* Logo */}
        <div className="text-white font-bold text-xl">Coach Virtual</div>
        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="text-white hover:text-blue-200 transition">Inicio</a>
          <a href="/dashboard" className="text-white hover:text-blue-200 transition">Dashboard</a>
          <a href="/perfil" className="text-white hover:text-blue-200 transition">Perfil</a>
        </div>
        {/* Botón mobile */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none" onClick={onMenuClick}>
            {/* Ícono hamburguesa */}
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;