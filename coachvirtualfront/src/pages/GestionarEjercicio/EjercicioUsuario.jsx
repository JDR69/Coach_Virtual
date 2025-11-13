import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";
import EjercicioService from "../../services/EjercicioService";
import DetalleMusculoUsuario from "../Detalle_Musculo/Destalle_MusculoUsuario";

export default function EjercicioUsuario() {
  const navigate = useNavigate();
  const { category } = useCategory();

  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEjercicios();
  }, []);

  const fetchEjercicios = async () => {
    try {
      setLoading(true);
      const data = await EjercicioService.getAll();
      // Filtrar solo ejercicios activos y asegurar que sea un array
      const ejerciciosData = Array.isArray(data) ? data : [];
      setEjercicios(ejerciciosData.filter(ej => ej.estado));
    } catch (error) {
      console.error("Error fetching ejercicios:", error);
      setEjercicios([]);
    } finally {
      setLoading(false);
    }
  };

  const startTraining = () => navigate("/pose-test");

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl w-full border border-white/20 text-white">
        <header className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            {category === "gym" ? "Ejercicios" : "Terapias"}
          </h1>
          <p className="text-white/80 mt-2">
            Recomendaciones para tu entrenamiento.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-white/60">Cargando ejercicios...</p>
          </div>
        ) : (
          <>
            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ejercicios.map((ejercicio) => (
                <article
                  key={ejercicio.id}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 transition hover:bg-white/20"
                >
                  {ejercicio.url && (
                    <img 
                      src={ejercicio.url} 
                      alt={ejercicio.nombre} 
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-lg">{ejercicio.nombre}</h3>
                  <p className="text-sm text-white/70 mt-2">3–4 series · 8–12 reps</p>
                </article>
              ))}
              {!ejercicios.length && (
                <p className="text-white/80 col-span-full text-center">
                  No hay ejercicios activos configurados todavía.
                </p>
              )}
            </section>

            {/* Sección para DetalleMusculoUsuario */}
            <DetalleMusculoUsuario />
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/musculo")}
            className="px-5 py-2 rounded-full border-2 border-white/30 hover:border-white/60 text-white font-semibold transition hover:bg-white/10"
          >
            Cambiar músculos
          </button>
          <button
            onClick={startTraining}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:scale-105 transition"
          >
            Entrenar ahora (IA)
          </button>
        </div>

        <footer className="mt-8 text-white/40 text-xs text-center">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>
    </main>
  );
}
