import React, { useEffect, useState } from 'react';
import MusculoService from '../../services/MusculoService';

const MusculoUsuario = () => {
  const [musculos, setMusculos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusculos = async () => {
      try {
        setLoading(true);
        const data = await MusculoService.getAll();
        setMusculos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setMusculos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMusculos();
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl w-full text-center border border-white/20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          Músculos Disponibles
        </h1>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-white/60">Cargando músculos...</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {musculos.map((musculo) => (
              <div
                key={musculo.id}
                className="rounded-2xl p-6 transition-all shadow-lg border relative overflow-hidden bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                {musculo.url && (
                  <div className="mb-4">
                    <img src={musculo.url} alt={musculo.nombre} className="max-w-full h-auto rounded-xl" />
                  </div>
                )}
                <h3 className="text-xl font-semibold">{musculo.nombre}</h3>
              </div>
            ))}
            {musculos.length === 0 && (
              <p className="text-white/80 col-span-full text-center">
                No hay músculos disponibles todavía.
              </p>
            )}
          </div>
        )}

        <footer className="mt-8 text-white/40 text-xs">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>
    </main>
  );
};

export default MusculoUsuario;
