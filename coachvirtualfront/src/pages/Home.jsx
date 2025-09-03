
import React from 'react';

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-2xl w-full text-center border border-white/20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 animate-fade-in">
          ¡Bienvenido!
        </h1>
        <p className="text-lg md:text-2xl text-white/80 mb-8">
          Esta es una página de inicio moderna, minimalista y lista para personalizar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:scale-105">
            Empezar
          </button>
          <button className="border-2 border-white/30 hover:border-white/60 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-white/10">
            Saber más
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center hover:bg-white/20 transition">
            <span className="text-3xl mb-2">⚡</span>
            <h3 className="text-white font-semibold mb-1">Rápido</h3>
            <p className="text-white/60 text-sm">Carga instantánea y animaciones suaves</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center hover:bg-white/20 transition">
            <span className="text-3xl mb-2">🔒</span>
            <h3 className="text-white font-semibold mb-1">Seguro</h3>
            <p className="text-white/60 text-sm">Construido con buenas prácticas modernas</p>
          </div>
          <div className="bg-white/10 rounded-xl p-6 flex flex-col items-center hover:bg-white/20 transition">
            <span className="text-3xl mb-2">🎨</span>
            <h3 className="text-white font-semibold mb-1">Personalizable</h3>
            <p className="text-white/60 text-sm">Fácil de adaptar a tu proyecto</p>
          </div>
        </div>
      </section>
      <footer className="mt-10 text-white/40 text-xs">Coach Virtual &copy; {new Date().getFullYear()}</footer>
    </main>
  );
};

export default Home;