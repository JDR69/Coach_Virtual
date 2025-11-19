import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, User, Activity, Footprints, Zap, Brain } from 'lucide-react';

/**
 * Vista de selección de parte del cuerpo
 */
export default function ParteCuerpo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('categoria');
  const [selectedCategoria, setSelectedCategoria] = useState('');

  useEffect(() => {
    if (!categoria) {
      navigate('/ejercicios/categoria');
    } else {
      setSelectedCategoria(categoria === 'gimnasio' ? 'Gimnasio' : 'Fisioterapia');
    }
  }, [categoria, navigate]);

  const partesCuerpo = [
    {
      id: 'brazos',
      nombre: 'Brazos',
      descripcion: 'Bíceps, tríceps, antebrazos',
      icon: Activity,
      color: 'from-red-400 to-red-600'
    },
    {
      id: 'piernas',
      nombre: 'Piernas',
      descripcion: 'Cuádriceps, isquiotibiales, pantorrillas',
      icon: Footprints,
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'espalda',
      nombre: 'Espalda',
      descripcion: 'Dorsales, lumbares, trapecio',
      icon: User,
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'cintura',
      nombre: 'Cintura',
      descripcion: 'Abdominales, oblicuos, core',
      icon: Zap,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'cabeza',
      nombre: 'Cabeza',
      descripcion: 'Cuello, trapecio superior',
      icon: Brain,
      color: 'from-green-400 to-green-600'
    }
  ];

  const handleSelectParte = (parteId) => {
    navigate(`/ejercicios/seleccion?categoria=${categoria}&parte=${parteId}`);
  };

  const handleBack = () => {
    navigate('/ejercicios/categoria');
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
          <span className="font-medium">Volver a categorías</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {selectedCategoria}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Selecciona la Parte del Cuerpo
          </h1>
          <p className="text-gray-600 text-lg">
            Elige el área que deseas trabajar
          </p>
        </div>

        {/* Grid de partes del cuerpo */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partesCuerpo.map((parte) => {
            const Icon = parte.icon;
            return (
              <button
                key={parte.id}
                onClick={() => handleSelectParte(parte.id)}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${parte.color}`} />
                
                {/* Content */}
                <div className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${parte.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {parte.nombre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {parte.descripcion}
                  </p>

                  {/* Hover effect */}
                  <div className="mt-4 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Ver ejercicios</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            💪 Selecciona una zona para ver los ejercicios disponibles
          </p>
        </div>
      </div>
    </div>
  );
}
