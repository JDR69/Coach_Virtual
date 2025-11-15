// src/pages/usuario/DetalleMusculoUsuario.jsx
import React, { useState, useEffect } from 'react';
import DetalleMusculoService from '../../services/DetalleMusculoService';
import MusculoService from '../../services/MusculoService';
import EjercicioService from '../../services/EjercicioService';

const DetalleMusculoUsuario = () => {
  const [detalles, setDetalles] = useState([]);
  const [musculos, setMusculos] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // <- NUEVO

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
      console.error('Error fetching data:', error);
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

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl w-full border border-white/20 text-white">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 text-center">
          Detalles de Músculos Trabajados
        </h1>
        <p className="text-center text-white/70 mb-8 text-sm md:text-base">
          Visualiza qué músculos estás activando con cada ejercicio.
        </p>

        {loading && (
          <div className="text-center py-8">
            <p className="text-white/60">Cargando detalles...</p>
          </div>
        )}

        {!loading && detalles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">
              No hay detalles de músculos disponibles todavía.
            </p>
          </div>
        )}

        {!loading && detalles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {detalles.map((detalle) => {
              const imgUrl = getEjercicioUrl(detalle.idEjercicio);
              const titulo = getEjercicioNombre(detalle.idEjercicio);

              return (
                <article
                  key={detalle.id}
                  className="bg-white/10 border border-white/20 rounded-2xl p-4 md:p-5 shadow-lg hover:bg-white/20 transition-all"
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

                  <h3 className="font-semibold text-lg mb-1">
                    {titulo}
                  </h3>
                  <p className="text-xs text-white/50 mb-3">
                    Detalle #{detalle.id}
                  </p>

                  <div className="space-y-1 text-sm text-white/80">
                    <p>
                      <span className="font-semibold text-white">
                        Músculo:
                      </span>{' '}
                      {getMusculoNombre(detalle.idMusculo)}
                    </p>
                    <p>
                      <span className="font-semibold text-white">
                        Activación:
                      </span>{' '}
                      {detalle.porcentaje}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 text-white/40 text-xs text-center">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>

      {/* MODAL / LIGHTBOX PARA LA IMAGEN */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()} // evita que el click en la imagen cierre el modal
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
