import React, { useState, useEffect } from 'react';
import DetalleMusculoService from '../../services/DetalleMusculoService';
import MusculoService from '../../services/MusculoService';
import EjercicioService from '../../services/EjercicioService';

const DetalleMusculoUsuario = () => {
  const [detalles, setDetalles] = useState([]);
  const [musculos, setMusculos] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [detallesData, musculosData, ejerciciosData] = await Promise.all([
        DetalleMusculoService.getAll(),
        MusculoService.getAll(),
        EjercicioService.getAll()
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
    const musculo = musculos.find(m => m.id === id);
    return musculo ? musculo.nombre : id;
  };

  const getEjercicioNombre = (id) => {
    const ejercicio = ejercicios.find(e => e.id === id);
    return ejercicio ? ejercicio.nombre : id;
  };

  const getEjercicioUrl = (id) => {
    const ejercicio = ejercicios.find(e => e.id === id);
    return ejercicio ? ejercicio.url : null;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">Cargando detalles...</p>
      </div>
    );
  }

  if (detalles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No hay detalles de músculos disponibles.</p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 text-center">
        Detalles de Músculos Trabajados
      </h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {detalles.map((detalle) => (
          <article
            key={detalle.id}
            className="bg-white/10 border border-white/20 rounded-xl p-4 transition hover:bg-white/20"
          >
            {getEjercicioUrl(detalle.idEjercicio) && (
              <img 
                src={getEjercicioUrl(detalle.idEjercicio)} 
                alt={getEjercicioNombre(detalle.idEjercicio)} 
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            
            <h3 className="font-semibold text-lg mb-2">
              {getEjercicioNombre(detalle.idEjercicio)}
            </h3>
            
            <div className="space-y-1 text-sm text-white/70">
              <p>
                <span className="font-semibold text-white/90">Músculo:</span> {getMusculoNombre(detalle.idMusculo)}
              </p>
              <p>
                <span className="font-semibold text-white/90">Activación:</span> {detalle.porcentaje}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DetalleMusculoUsuario;