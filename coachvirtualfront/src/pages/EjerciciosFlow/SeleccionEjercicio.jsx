import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Target, TrendingUp, Loader2 } from 'lucide-react';
import DetalleMusculoService from '../../services/DetalleMusculoService';
import EjercicioService from '../../services/EjercicioService';

/**
 * Vista de selección de ejercicio específico
 * Los ejercicios se cargan dinámicamente desde el backend usando DetalleMusculoService y EjercicioService
 */
export default function SeleccionEjercicio() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('categoria');
  const parte = searchParams.get('parte');
  const [breadcrumb, setBreadcrumb] = useState({ categoria: '', parte: '' });
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoria || !parte) {
      navigate('/ejercicios/categoria');
    } else {
      setBreadcrumb({
        categoria: categoria === 'gimnasio' ? 'Gimnasio' : 'Fisioterapia',
        parte: parte.charAt(0).toUpperCase() + parte.slice(1)
      });
      fetchEjercicios();
    }
  }, [categoria, parte, navigate]);

  const fetchEjercicios = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todos los detalles de músculos y ejercicios del backend
      const [detalles, ejerciciosData] = await Promise.all([
        DetalleMusculoService.getAll(),
        EjercicioService.getAll()
      ]);

      // Filtrar por la parte del cuerpo (músculo) seleccionada y la categoría (tipo)
      const ejerciciosFiltrados = detalles
        .filter(detalle => {
          // Filtrar por el ID del músculo (parte) y el ID del tipo (categoría)
          return detalle.idMusculo === parseInt(parte) && detalle.idTipo === parseInt(categoria);
        })
        .map((detalle, index) => {
          // Buscar el ejercicio completo por ID
          const ejercicioCompleto = ejerciciosData.find(ej => ej.id === detalle.idEjercicio);

          return {
            id: detalle.idEjercicio,
            detalleId: detalle.id,
            nombre: ejercicioCompleto?.nombre || `Ejercicio ${detalle.idEjercicio}`,
            descripcion: `Porcentaje de trabajo: ${detalle.porcentaje}%`,
            porcentaje: detalle.porcentaje,
            url: ejercicioCompleto?.url || '', // URL de la imagen del ejercicio
            // Datos adicionales calculados
            duracion: '15 min',
            dificultad: getDificultadByPorcentaje(detalle.porcentaje),
            calorias: calcularCalorias(detalle.porcentaje)
          };
        });

      setEjercicios(ejerciciosFiltrados);
    } catch (err) {
      console.error('Error al cargar ejercicios:', err);
      setError('No se pudieron cargar los ejercicios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Determinar dificultad basada en el porcentaje
  const getDificultadByPorcentaje = (porcentaje) => {
    const percent = parseInt(porcentaje);
    if (percent < 50) return 'Principiante';
    if (percent < 75) return 'Intermedio';
    return 'Avanzado';
  };

  // Calcular calorías aproximadas basadas en el porcentaje
  const calcularCalorias = (porcentaje) => {
    const percent = parseInt(porcentaje);
    const calorias = Math.round((percent / 100) * 200);
    return `${calorias} kcal`;
  };

  const handleSelectEjercicio = (ejercicio) => {
    // Normalizar nombre para coincidencias simples (sin tildes / mayúsculas)
    const nombreNorm = ejercicio.nombre
      .toLowerCase()
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u');

    // Mapear a rutas según el ejercicio (por ahora solo bíceps)
    if (nombreNorm.includes('bicep') || nombreNorm.includes('curl')) {
      navigate('/categoria/gimnasio/brazos/biceps-curl');
      return;
    }

    // Fallback si no hay ruta específica aún
    alert('Ruta de rutina no implementada para: ' + ejercicio.nombre);
  };

  const handleBack = () => {
    navigate(`/ejercicios/parte-cuerpo?categoria=${categoria}`);
  };

  const getDificultadColor = (dificultad) => {
    switch (dificultad) {
      case 'Principiante': return 'text-green-600 bg-green-50';
      case 'Intermedio': return 'text-yellow-600 bg-yellow-50';
      case 'Avanzado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Volver a partes del cuerpo</span>
        </button>

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-gray-500">{breadcrumb.categoria}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-semibold">{breadcrumb.parte}</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Ejercicios de {breadcrumb.parte}
          </h1>
          <p className="text-gray-600 text-lg">
            Selecciona el ejercicio que deseas realizar
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchEjercicios}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && ejercicios.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
            <p className="text-yellow-700 text-lg">
              No hay ejercicios disponibles para esta parte del cuerpo en esta categoría.
            </p>
          </div>
        )}

        {/* Grid de ejercicios */}
        {!loading && !error && ejercicios.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ejercicios.map((ejercicio) => (
              <div
                key={ejercicio.detalleId}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image from URL or gradient placeholder */}
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                  {ejercicio.url ? (
                    <img
                      src={ejercicio.url}
                      alt={ejercicio.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">💪</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {ejercicio.nombre}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {ejercicio.descripcion}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{ejercicio.duracion}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span>{ejercicio.calorias}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-purple-500" />
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDificultadColor(ejercicio.dificultad)}`}>
                          {ejercicio.dificultad}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleSelectEjercicio(ejercicio)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
                    title="Iniciar rutina"
                  >
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Comenzar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            🏋️ Selecciona un ejercicio para comenzar tu entrenamiento
          </p>
        </div>
      </div>
    </div>
  );
}
