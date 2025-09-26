import { useState } from "react";
import api from "../../api/api"; // ajusta la ruta si fuera necesario

const PasswordInput = ({
  value,
  onChange,
  name = "password",
  placeholder = "Contraseña",
  autoComplete = "new-password",
  required = false,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full px-4 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-md"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white"
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        title={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {show ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l18 18" />
            <path d="M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42" />
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.29 20.29 0 0 1 5.06-5.94" />
            <path d="M9.88 4.24A10.88 10.88 0 0 1 12 4c7 0 11 8 11 8a20.27 20.27 0 0 1-3.06 4.2" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
};

const Register = ({ signIn, onBack, onSuccess, onSwitchToLogin }) => {
  const [regData, setRegData] = useState({
    email: "",
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "",
    altura: "",
    peso: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const handleRegChange = (e) =>
    setRegData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOkMsg("");

    try {
      const payload = {
        email: regData.email.trim(),
        username: regData.username.trim(),
        password: regData.password,
        nombre: regData.nombre.trim(),
        apellido: regData.apellido.trim(),
        fecha_nacimiento: regData.fecha_nacimiento || null,
        genero: regData.genero || null,
        altura: regData.altura ? parseFloat(regData.altura) : null,
        peso: regData.peso ? parseFloat(regData.peso) : null,
      };

      // Con baseURL = http://127.0.0.1:8000/api
      await api.post("/usuarios/", payload);

      setOkMsg("¡Cuenta creada! Te estamos iniciando sesión...");
      try {
        await signIn(regData.email, regData.password);
        onSuccess?.();
      } catch {
        setOkMsg("Cuenta creada. Inicia sesión con tus credenciales.");
        onSwitchToLogin?.();
      }
    } catch (err) {
      // Intenta leer errores del backend
      const msg =
        err?.response?.data
          ? Object.entries(err.response.data)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
              .join(" | ")
          : (err?.message || "Error al registrar la cuenta.");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6 text-center">
        Crear cuenta
      </h2>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center shadow-md">
          {error}
        </div>
      )}
      {okMsg && (
        <div className="mb-4 bg-green-100 border border-green-500 text-green-800 px-4 py-3 rounded-lg text-center shadow-md">
          {okMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* ... (inputs igual que antes) ... */}
        <input name="email" type="email" required value={regData.email} onChange={handleRegChange}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-md"
          placeholder="Email" />
        <input name="username" type="text" required value={regData.username} onChange={handleRegChange}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-md"
          placeholder="Usuario" />
        <PasswordInput name="password" value={regData.password} onChange={handleRegChange} required />

        <div className="grid grid-cols-2 gap-3">
          <input name="nombre" type="text" value={regData.nombre} onChange={handleRegChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-md"
            placeholder="Nombre" />
          <input name="apellido" type="text" value={regData.apellido} onChange={handleRegChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-md"
            placeholder="Apellido" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="fecha_nacimiento" type="date" value={regData.fecha_nacimiento} onChange={handleRegChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duración-300 shadow-md" />
          <select name="genero" value={regData.genero} onChange={handleRegChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duración-300 shadow-md">
            <option value="">Género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro / Prefiero no decir</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="altura" type="number" step="0.01" min="0" value={regData.altura} onChange={handleRegChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duración-300 shadow-md"
            placeholder="Altura (m)" />
          <input name="peso" type="number" step="0.1" min="0" value={regData.peso} onChange={handleRegChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duración-300 shadow-md"
            placeholder="Peso (kg)" />
        </div>

        <button type="submit" disabled={isLoading}
          className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
          {isLoading ? "Procesando..." : "Registrarme"}
        </button>

        <div className="flex items-center justify-between pt-1">
          <button type="button" onClick={onBack} className="py-2 text-gray-300 hover:text-white transition-colors duration-300">← Volver</button>
          <button type="button" onClick={onSwitchToLogin} className="py-2 text-gray-300 hover:text-white transition-colors duration-300">¿Ya tienes cuenta? Inicia sesión</button>
        </div>
      </form>
    </>
  );
};

export default Register;
