import React from 'react';

const Navbar = ({ sidebarOpen, onMenuClick }) => {
    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-blue-600 px-4 flex items-center z-50 shadow">
            <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
                {/* Botón SIEMPRE visible */}
                <button className="text-white focus:outline-none text-2xl ml-4" onClick={onMenuClick}>
                    {sidebarOpen ? (
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
                {/* Logo */}
                <div className="text-white font-bold text-xl">Coach Virtual</div>
            </div>
        </nav>
    );
};

export default Navbar;