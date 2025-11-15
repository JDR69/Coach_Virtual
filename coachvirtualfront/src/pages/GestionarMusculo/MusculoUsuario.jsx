// src/pages/GestionarMusculo/MusculoUsuario.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MusculoService from "../../services/MusculoService";
import { useCategory } from "../../context/CategoryContext";

const MusculoUsuario = () => {
  const [musculos, setMusculos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { selectedMuscleIds, toggleMuscle } = useCategory();
  const navigate = useNavigate();

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

  const handleNext = () => {
    if (!selectedMuscleIds.length) return;
    navigate("/mis-ejercicios");
  };

  const isSelected = (id) => selectedMuscleIds.includes(Number(id));

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl w-full text-center border border-white/20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          Músculos Disponibles
        </h1>
        <p className="text-white/80 mb-6 text-sm md:text-base">
          Selecciona uno o varios músculos para armar tu rutina.
        </p>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-white/60">Cargando músculos...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
              {musculos.map((musculo) => {
                const selected = isSelected(musculo.id);
                return (
                  <button
                    key={musculo.id}
                    type="button"
                    onClick={() => toggleMuscle(musculo.id)}
                    className={`rounded-2xl p-6 transition-all shadow-lg border relative overflow-hidden text-left ${
                      selected
                        ? "bg-white/20 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border-white/20"
                    } text-white`}
                  >
                    {musculo.url && (
                      <div className="mb-4">
                        <img
                          src={musculo.url}
                          alt={musculo.nombre}
                          className="max-w-full h-auto rounded-xl"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold">{musculo.nombre}</h3>
                    <p className="text-xs text-white/60 mt-2">
                      {selected
                        ? "Seleccionado ✔"
                        : "Haz clic para seleccionar"}
                    </p>
                  </button>
                );
              })}

              {musculos.length === 0 && (
                <p className="text-white/80 col-span-full text-center">
                  No hay músculos disponibles todavía.
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedMuscleIds.length}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Ver ejercicios para mis músculos
              </button>
            </div>
          </>
        )}

        <footer className="mt-8 text-white/40 text-xs">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>
    </main>
  );
};

export default MusculoUsuario;
