import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  Flame, 
  Trophy,
  Plus,
  ChevronRight,
  Activity,
  Dumbbell,
  PlayCircle
} from 'lucide-react';

/**
 * Dashboard principal del usuario
 * - Gráfica de comportamiento/progreso
 * - Rutinas actuales
 * - Botón para explorar nuevos ejercicios
 */
const Home = () => {
  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState([
    // Datos de ejemplo - reemplazar con llamada a API
    {
      id: 1,
      nombre: 'Rutina de Brazos',
      categoria: 'Gimnasio',
      parte: 'Brazos',
      ejercicios: 5,
      duracion: '45 min',
      progreso: 60,
      ultimoEntrenamiento: '2024-11-15'
    },
    {
      id: 2,
      nombre: 'Recuperación Espalda',
      categoria: 'Fisioterapia',
      parte: 'Espalda',
      ejercicios: 3,
      duracion: '30 min',
      progreso: 30,
      ultimoEntrenamiento: '2024-11-10'
    }
  ]);

  // Datos de ejemplo para estadísticas - reemplazar con API
  const estadisticas = {
    entrenamientosSemanales: 4,
    minutosTotal: 180,
    caloriasQuemadas: 850,
    racha: 7
  };

  // Datos de ejemplo para la gráfica - reemplazar con API
  const datosGrafica = [
    { dia: 'Lun', minutos: 30 },
    { dia: 'Mar', minutos: 45 },
    { dia: 'Mié', minutos: 20 },
    { dia: 'Jue', minutos: 60 },
    { dia: 'Vie', minutos: 40 },
    { dia: 'Sáb', minutos: 50 },
    { dia: 'Dom', minutos: 35 }
  ];

  const maxMinutos = Math.max(...datosGrafica.map(d => d.minutos));

  const handleExplorarEjercicios = () => {
    navigate('/ejercicios/categoria');
  };

  const handleIniciarRutina = (rutinaId) => {
    // Aquí navegarías a la página de entrenamiento
    alert(`Iniciando rutina ${rutinaId}\n(Próximamente: página de entrenamiento)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bienvenido de nuevo! Aquí está tu progreso 💪
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-500">Esta semana</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{estadisticas.entrenamientosSemanales}</p>
            <p className="text-sm text-gray-600">Entrenamientos</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{estadisticas.minutosTotal}</p>
            <p className="text-sm text-gray-600">Minutos</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-sm text-gray-500">Quemadas</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{estadisticas.caloriasQuemadas}</p>
            <p className="text-sm text-gray-600">Calorías</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-gray-500">Racha</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{estadisticas.racha}</p>
            <p className="text-sm text-gray-600">Días consecutivos</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfica de comportamiento */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Actividad Semanal
              </h2>
              <span className="text-sm text-gray-500">Últimos 7 días</span>
            </div>

            {/* Gráfica de barras simple */}
            <div className="flex items-end justify-between h-64 gap-4">
              {datosGrafica.map((dato, index) => {
                const altura = (dato.minutos / maxMinutos) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:from-blue-600 hover:to-blue-400 transition-all duration-300 cursor-pointer group relative"
                        style={{ height: `${altura}%` }}
                      >
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          {dato.minutos} min
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{dato.dia}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card de explorar ejercicios */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white flex flex-col justify-between">
            <div>
              <Target className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">
                Explorar Nuevos Ejercicios
              </h3>
              <p className="text-white/90 text-sm mb-6">
                Descubre rutinas personalizadas de gimnasio y fisioterapia
              </p>
            </div>
            <button
              onClick={handleExplorarEjercicios}
              className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Explorar Ahora</span>
            </button>
          </div>
        </div>

        {/* Sección de rutinas */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-blue-500" />
              Mis Rutinas
            </h2>
            {rutinas.length > 0 && (
              <button
                onClick={handleExplorarEjercicios}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Añadir rutina
              </button>
            )}
          </div>

          {rutinas.length === 0 ? (
            /* Estado vacío */
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Activity className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes rutinas todavía
              </h3>
              <p className="text-gray-500 mb-6">
                Explora nuestro catálogo y crea tu primera rutina personalizada
              </p>
              <button
                onClick={handleExplorarEjercicios}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Explorar Ejercicios
              </button>
            </div>
          ) : (
            /* Lista de rutinas */
            <div className="grid md:grid-cols-2 gap-6">
              {rutinas.map((rutina) => (
                <div
                  key={rutina.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {rutina.nombre}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {rutina.categoria}
                        </span>
                        <span>•</span>
                        <span>{rutina.parte}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span>{rutina.ejercicios} ejercicios</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{rutina.duracion}</span>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-semibold text-gray-800">{rutina.progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rutina.progreso}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleIniciarRutina(rutina.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
                  >
                    <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Iniciar Rutina</span>
                    <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;