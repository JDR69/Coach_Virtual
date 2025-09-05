import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // URL de imagen temática de gimnasio
  const gymImage = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';
  const leftImage = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      console.log('Login exitoso');
    } catch (error) {
      setError(
        error.response?.data?.detail || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="relative w-full max-w-4xl h-[600px]" style={{ perspective: '1000px' }}>
        <div className={`relative w-full h-full transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Cara frontal - Pantalla de bienvenida */}
          <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl" style={{ backfaceVisibility: 'hidden' }}>
            <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-black flex flex-col items-center justify-center">
              <img 
                src={gymImage} 
                alt="Gym Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" 
              />
              <div className="relative z-10 text-center">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-8">
                  Coach Virtual
                </h1>
                <p className="text-xl text-white mb-8 opacity-90">
                  Tu entrenador personal digital
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="py-3 px-8 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 transform"
                  >
                    Iniciar Sesión
                  </button>
                  <button className="py-3 px-8 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 transform">
                    Registrarse
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cara trasera - Formulario de login */}
          <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl [transform:rotateY(180deg)]" style={{ backfaceVisibility: 'hidden' }}>
            <div className="flex w-full h-full">
              
              {/* Mitad izquierda - Imagen de gimnasio */}
              <div className="w-1/2 h-full relative">
                <img 
                  src={leftImage} 
                  alt="Gym Environment" 
                  className="w-full h-full object-cover pointer-events-none" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>

              {/* Mitad derecha - Formulario */}
              <div className="w-1/2 h-full bg-gradient-to-br from-gray-800 to-black flex flex-col justify-center px-12">
                <div className="w-full max-w-md mx-auto">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-8 text-center">
                    Inicia Sesión
                  </h2>
                  
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 shadow-md"
                        placeholder="Correo electrónico"
                      />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 shadow-md"
                        placeholder="Contraseña"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center shadow-md">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Iniciando sesión...
                        </div>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFlipped(false)}
                      className="w-full py-2 text-gray-300 hover:text-white transition-colors duration-300 text-center"
                    >
                      ← Volver
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
