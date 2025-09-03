import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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
          <button className="text-white focus:outline-none">
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