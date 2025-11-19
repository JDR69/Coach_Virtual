import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Target, TrendingUp } from 'lucide-react';

/**
 * Vista de selección de ejercicio específico
 */
export default function SeleccionEjercicio() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('categoria');
  const parte = searchParams.get('parte');
  const [breadcrumb, setBreadcrumb] = useState({ categoria: '', parte: '' });

  useEffect(() => {
    if (!categoria || !parte) {
      navigate('/ejercicios/categoria');
    } else {
      setBreadcrumb({
        categoria: categoria === 'gimnasio' ? 'Gimnasio' : 'Fisioterapia',
        parte: parte.charAt(0).toUpperCase() + parte.slice(1)
      });
    }
  }, [categoria, parte, navigate]);

  // Datos de ejemplo - aquí podrías hacer fetch a tu API
  const ejerciciosPorParte = {
    brazos: [
      {
        id: 'biceps',
        nombre: 'Bíceps',
        descripcion: 'Curl de bíceps con mancuernas',
        duracion: '15 min',
        dificultad: 'Intermedio',
        calorias: '120 kcal',
        imagen: '💪'
      },
      {
        id: 'triceps',
        nombre: 'Tríceps',
        descripcion: 'Extensiones y fondos de tríceps',
        duracion: '12 min',
        dificultad: 'Intermedio',
        calorias: '100 kcal',
        imagen: '🦾'
      },
      {
        id: 'antebrazos',
        nombre: 'Antebrazos',
        descripcion: 'Curl de muñeca y agarre',
        duracion: '10 min',
        dificultad: 'Principiante',
        calorias: '80 kcal',
        imagen: '💪'
      }
    ],
    piernas: [
      {
        id: 'cuadriceps',
        nombre: 'Cuádriceps',
        descripcion: 'Sentadillas y extensiones',
        duracion: '20 min',
        dificultad: 'Intermedio',
        calorias: '180 kcal',
        imagen: '🦵'
      },
      {
        id: 'isquiotibiales',
        nombre: 'Isquiotibiales',
        descripcion: 'Peso muerto y curl femoral',
        duracion: '18 min',
        dificultad: 'Avanzado',
        calorias: '160 kcal',
        imagen: '🦵'
      }
    ],
    espalda: [
      {
        id: 'dorsales',
        nombre: 'Dorsales',
        descripcion: 'Dominadas y remo',
        duracion: '20 min',
        dificultad: 'Intermedio',
        calorias: '150 kcal',
        imagen: '💪'
      },
      {
        id: 'lumbares',
        nombre: 'Lumbares',
        descripcion: 'Hiperextensiones y buenos días',
        duracion: '15 min',
        dificultad: 'Intermedio',
        calorias: '110 kcal',
        imagen: '🔥'
      }
    ],
    cintura: [
      {
        id: 'abdominales',
        nombre: 'Abdominales',
        descripcion: 'Crunches y plancha',
        duracion: '15 min',
        dificultad: 'Principiante',
        calorias: '100 kcal',
        imagen: '🔥'
      },
      {
        id: 'oblicuos',
        nombre: 'Oblicuos',
        descripcion: 'Giros rusos y plancha lateral',
        duracion: '12 min',
        dificultad: 'Intermedio',
        calorias: '90 kcal',
        imagen: '⚡'
      }
    ],
    cabeza: [
      {
        id: 'cuello',
        nombre: 'Cuello',
        descripcion: 'Estiramientos y fortalecimiento',
        duracion: '10 min',
        dificultad: 'Principiante',
        calorias: '50 kcal',
        imagen: '🧘'
      },
      {
        id: 'trapecio',
        nombre: 'Trapecio',
        descripcion: 'Encogimientos y elevaciones',
        duracion: '12 min',
        dificultad: 'Intermedio',
        calorias: '80 kcal',
        imagen: '💪'
      }
    ]
  };

  const ejercicios = ejerciciosPorParte[parte] || [];

  const handleSelectEjercicio = (ejercicioId) => {
    // Aquí podrías navegar a la página del ejercicio específico
    alert(`Ejercicio seleccionado: ${ejercicioId}\nCategoría: ${categoria}\nParte: ${parte}`);
    // Ejemplo: navigate(`/ejercicios/entrenar/${ejercicioId}`);
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

        {/* Grid de ejercicios */}
        {ejercicios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay ejercicios disponibles para esta parte del cuerpo
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ejercicios.map((ejercicio) => (
              <div
                key={ejercicio.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image placeholder */}
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl">
                  {ejercicio.imagen}
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
                    onClick={() => handleSelectEjercicio(ejercicio.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
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
