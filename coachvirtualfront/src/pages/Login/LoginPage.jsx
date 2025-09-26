import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import IniciarSesion from "./IniciarSesion";
import Register from "./Register";

const LoginPage = () => {
  const { signIn } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [isFlipped, setIsFlipped] = useState(false);

  // Imágenes
  const gymImage =
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1470&q=80";
  const leftImage =
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=870&q=80";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="relative w-full max-w-4xl h-[600px]" style={{ perspective: "1000px" }}>
        <div
          className={`relative w-full h-full transition-transform duration-700 ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Cara frontal */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
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
                <p className="text-xl text-white mb-8 opacity-90">Tu entrenador personal digital</p>
                <div className="space-x-4">
                  <button
                    onClick={() => { setMode("login"); setIsFlipped(true); }}
                    className="py-3 px-8 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 transform"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => { setMode("register"); setIsFlipped(true); }}
                    className="py-3 px-8 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 transform"
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cara trasera */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex w-full h-full">
              {/* Mitad izquierda */}
              <div className="w-1/2 h-full relative">
                <img src={leftImage} alt="Gym Environment" className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>

              {/* Mitad derecha */}
              <div className="w-1/2 h-full bg-gradient-to-br from-gray-800 to-black flex flex-col justify-center px-12">
                <div className="w-full max-w-md mx-auto">
                  {mode === "login" ? (
                    <IniciarSesion
                      signIn={signIn}
                      onBack={() => setIsFlipped(false)}
                      onSuccess={() => setIsFlipped(false)}
                      onSwitchToRegister={() => setMode("register")}
                    />
                  ) : (
                    <Register
                      signIn={signIn}
                      onBack={() => setIsFlipped(false)}
                      onSuccess={() => setIsFlipped(false)}
                      onSwitchToLogin={() => setMode("login")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* fin cara trasera */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
