import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Heart } from 'lucide-react';

/**
 * Vista inicial: Selección de categoría (Gimnasio o Fisioterapia)
 */
export default function CategoriaEjercicios() {
  const navigate = useNavigate();

  const categorias = [
    {
      id: 'gimnasio',
      nombre: 'Gimnasio',
      descripcion: 'Ejercicios de fuerza, resistencia y desarrollo muscular',
      icon: Dumbbell,
      color: 'bg-blue-500 hover:bg-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      id: 'fisioterapia',
      nombre: 'Fisioterapia',
      descripcion: 'Ejercicios de rehabilitación y recuperación',
      icon: Heart,
      color: 'bg-green-500 hover:bg-green-600',
      iconColor: 'text-green-500'
    }
  ];

  const handleSelectCategoria = (categoriaId) => {
    navigate(`/ejercicios/parte-cuerpo?categoria=${categoriaId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Categoría de Ejercicios
          </h1>
          <p className="text-gray-600 text-lg">
            Selecciona la categoría que deseas explorar
          </p>
        </div>

        {/* Cards de categorías */}
        <div className="grid md:grid-cols-2 gap-8">
          {categorias.map((categoria) => {
            const Icon = categoria.icon;
            return (
              <button
                key={categoria.id}
                onClick={() => handleSelectCategoria(categoria.id)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-left overflow-hidden"
              >
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gray-50 mb-6 ${categoria.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-12 h-12" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {categoria.nombre}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {categoria.descripcion}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span>Seleccionar</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            💡 Tip: Selecciona la categoría según tu objetivo de entrenamiento
          </p>
        </div>
      </div>
    </div>
  );
}
