// src/pages/GestionarEjercicio/Detalle_MusculoUsuario.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetalleMusculoService from "../../services/DetalleMusculoService";
import MusculoService from "../../services/MusculoService";
import EjercicioService from "../../services/EjercicioService";
import { useCategory } from "../../context/CategoryContext";

const DetalleMusculoUsuario = () => {
  const [detalles, setDetalles] = useState([]);
  const [musculos, setMusculos] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    selectedMuscleIds,
    selectedDetalleIds,
    toggleDetalle,
  } = useCategory();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [detallesData, musculosData, ejerciciosData] = await Promise.all([
        DetalleMusculoService.getAll(),
        MusculoService.getAll(),
        EjercicioService.getAll(),
      ]);
      setDetalles(Array.isArray(detallesData) ? detallesData : []);
      setMusculos(Array.isArray(musculosData) ? musculosData : []);
      setEjercicios(Array.isArray(ejerciciosData) ? ejerciciosData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDetalles([]);
      setMusculos([]);
      setEjercicios([]);
    } finally {
      setLoading(false);
    }
  };

  const getMusculoNombre = (id) => {
    const numId = Number(id);
    const musculo = musculos.find((m) => Number(m.id) === numId);
    return musculo ? musculo.nombre : id;
  };

  const getEjercicioNombre = (id) => {
    const numId = Number(id);
    const ejercicio = ejercicios.find((e) => Number(e.id) === numId);
    return ejercicio ? ejercicio.nombre : id;
  };

  const getEjercicioUrl = (id) => {
    const numId = Number(id);
    const ejercicio = ejercicios.find((e) => Number(e.id) === numId);
    return ejercicio ? ejercicio.url : null;
  };

  // ✅ Detalles filtrados por TODOS los músculos seleccionados
  const filteredDetalles =
    selectedMuscleIds.length > 0
      ? detalles.filter((d) =>
          selectedMuscleIds.includes(Number(d.idMusculo))
        )
      : detalles;

  const selectedMusclesNames =
    selectedMuscleIds
      .map((id) => getMusculoNombre(id))
      .filter(Boolean)
      .join(", ") || "Todos";

  const handleNext = () => {
    if (selectedDetalleIds.length === 0) return;
    navigate("/mis-ejercicios-asignados");
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl w-full border border-white/20 text-white">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 text-center">
          Detalles de Músculos Trabajados
        </h1>
        <p className="text-center text-white/70 mb-2 text-sm md:text-base">
          Selecciona uno o varios ejercicios (detalles) para los músculos
          elegidos.
        </p>

        <p className="text-center text-white/80 mb-6 text-sm">
          Músculos seleccionados:{" "}
          <span className="font-semibold">{selectedMusclesNames}</span>
        </p>

        {loading && (
          <div className="text-center py-8">
            <p className="text-white/60">Cargando detalles...</p>
          </div>
        )}

        {!loading && filteredDetalles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">
              No hay detalles de músculos disponibles para estos músculos.
            </p>
          </div>
        )}

        {!loading && filteredDetalles.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDetalles.map((detalle) => {
                const imgUrl = getEjercicioUrl(detalle.idEjercicio);
                const titulo = getEjercicioNombre(detalle.idEjercicio);
                const isSelected = selectedDetalleIds.includes(detalle.id);

                return (
                  <article
                    key={detalle.id}
                    className={`bg-white/10 border rounded-2xl p-4 md:p-5 shadow-lg transition-all ${
                      isSelected
                        ? "border-blue-400 bg-white/20"
                        : "border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {imgUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage({ url: imgUrl, title: titulo })
                        }
                        className="mb-3 rounded-xl overflow-hidden border border-white/20 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <img
                          src={imgUrl}
                          alt={titulo}
                          className="w-full h-32 object-cover hover:scale-[1.03] transition-transform"
                        />
                      </button>
                    )}

                    <h3 className="font-semibold text-lg mb-1">{titulo}</h3>

                    <div className="space-y-1 text-sm text-white/80 mb-3">
                      <p>
                        <span className="font-semibold text-white">
                          Músculo:
                        </span>{" "}
                        {getMusculoNombre(detalle.idMusculo)}
                      </p>
                      <p>
                        <span className="font-semibold text-white">
                          Activación:
                        </span>{" "}
                        {detalle.porcentaje}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDetalle(detalle.id)}
                      className={`w-full px-3 py-2 rounded-full text-sm font-semibold transition ${
                        isSelected
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {isSelected ? "Quitar de mi rutina" : "Agregar a mi rutina"}
                    </button>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleNext}
                disabled={selectedDetalleIds.length === 0}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Ver mis ejercicios asignados
              </button>
            </div>
          </>
        )}

        <footer className="mt-10 text-white/40 text-xs text-center">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg hover:bg-gray-200"
            >
              ✕
            </button>

            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/30 bg-black"
            />

            <p className="mt-3 text-center text-white/80 text-sm">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default DetalleMusculoUsuario;
