import { useEffect, useMemo, useState } from "react";
import {
  fetchMyProfile,
  updateUser,
  sanitizeForPut,
} from "../../services/UsuarioService"; // ajusta la ruta si hace falta

// ========= Helpers =========
function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return String(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function labelGenero(v) {
  if (!v) return "";
  const s = String(v).trim().toUpperCase();
  if (s === "M" || s === "MASCULINO") return "Masculino";
  if (s === "F" || s === "FEMENINO") return "Femenino";
  return "Otro";
}

// ========= Componente =========
export default function Perfil() {
  const [user, setUser] = useState(null); // objeto crudo del backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // edición
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "",
    altura: "",
    peso: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveOk, setSaveOk] = useState("");

  // ======= CARGA PERFIL =======
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMyProfile();
        if (mounted) setUser(data);
      } catch (err) {
        setError(
          err?.response?.data?.detail || err?.message || "Error al cargar el perfil."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ======= DERIVADOS PARA UI =======
  const ui = useMemo(() => {
    if (!user) return null;

    // nombres REALES de la tabla (AbstractUser + extras)
    const firstName = user.first_name || user.nombre || user.name || "";
    const lastName = user.last_name || user.apellido || "";
    const nombreCompleto =
      `${firstName} ${lastName}`.trim() || (user.username ?? "Usuario");

    const email = user.email || "";
    const fechaNacimiento = user.fecha_nacimiento || user.fechaNacimiento || "";
    const genero = user.genero || "";
    const altura = user.altura ?? ""; // varchar(10)
    const peso = user.peso ?? ""; // varchar(10)

    const fechaRegistro = user.date_joined || user.created_at || "";
    const ultimoAcceso = user.last_login || "";

    const avatar =
      user.avatar ||
      user.foto ||
      user.foto_perfil ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nombreCompleto || email || "U"
      )}`;

    return {
      id: user.id ?? user.pk ?? null,
      raw: user,
      avatar,
      nombre: nombreCompleto || "—",
      email: email || "—",
      fechaNacimiento: formatDate(fechaNacimiento) || "—",
      genero: labelGenero(genero) || "—",
      altura: (altura ? `${altura} m` : "—"),
      peso: (peso ? `${peso} kg` : "—"),
      fechaRegistro: formatDate(fechaRegistro) || "—",
      ultimoAcceso: formatDate(ultimoAcceso) || "—",
      editable: {
        nombre: firstName,
        apellido: lastName,
        fecha_nacimiento: formatDate(fechaNacimiento) || "",
        genero: typeof genero === "string" ? genero : "",
        altura,
        peso,
        avatar: user.avatar || user.foto || user.foto_perfil || "",
      },
    };
  }, [user]);

  // precargar formulario al entrar en edición
  useEffect(() => {
    if (isEditing && ui?.editable) {
      setForm({
        nombre: ui.editable.nombre || "",
        apellido: ui.editable.apellido || "",
        fecha_nacimiento: ui.editable.fecha_nacimiento || "",
        genero: ui.editable.genero || "",
        altura: ui.editable.altura ?? "",
        peso: ui.editable.peso ?? "",
        avatar: ui.editable.avatar || "",
      });
      setSaveError("");
      setSaveOk("");
    }
  }, [isEditing, ui]);

  // ======= GUARDAR =======
  async function saveChanges(e) {
    e?.preventDefault?.();
    setSaving(true);
    setSaveError("");
    setSaveOk("");

    if (!ui?.id) {
      setSaveError("No se pudo determinar el ID del usuario.");
      setSaving(false);
      return;
    }

    const updates = {
      first_name: (form.nombre || "").trim(),
      last_name: (form.apellido || "").trim(),
      fecha_nacimiento: form.fecha_nacimiento || null, // YYYY-MM-DD
      genero: form.genero || null, // "M"/"F" o "Masculino"/"Femenino"/"Otro"
      altura: (form.altura ?? "").toString().trim() || null,
      peso: (form.peso ?? "").toString().trim() || null,
      avatar: (form.avatar || "").trim() || null, // quítalo si tu serializer no lo soporta
    };

    try {
      const data = await updateUser(ui.id, updates, {
        mergeWith: user,   // conserva email/username, etc., y sanea
        sanitize: true,
      });
      setUser(data);
      setSaveOk("¡Datos actualizados!");
      setIsEditing(false);
    } catch (err) {
      const msg =
        err?.response?.data
          ? Object.entries(err.response.data)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
              .join(" | ")
          : err?.message || "No se pudieron guardar los cambios.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }

  // ======= UI =======
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-white/20 animate-fade-in">
        {loading ? (
          <LoaderSkeleton />
        ) : error ? (
          <div className="text-red-200">
            <p className="font-semibold mb-4">Error al cargar el perfil</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        ) : ui ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <img
                src={isEditing ? (form.avatar || ui.avatar) : ui.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://randomuser.me/api/portraits/lego/1.jpg";
                }}
              />
              <h2 className="text-3xl font-bold text-white mb-1">
                {isEditing ? (form.nombre || "—") : ui.nombre}
              </h2>
              <span className="text-white/60 text-sm">{ui.email}</span>
            </div>

            {isEditing ? (
              <form onSubmit={saveChanges} className="grid grid-cols-1 gap-4 text-left mb-4">
                {saveError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
                    {saveError}
                  </div>
                )}
                {saveOk && (
                  <div className="bg-green-100 border border-green-500 text-green-800 px-4 py-2 rounded-lg">
                    {saveOk}
                  </div>
                )}

                <Input
                  label="Nombre"
                  value={form.nombre}
                  onChange={(v) => setForm((s) => ({ ...s, nombre: v }))}
                />
                <Input
                  label="Apellido"
                  value={form.apellido}
                  onChange={(v) => setForm((s) => ({ ...s, apellido: v }))}
                />
                <Input
                  label="Fecha de nacimiento"
                  type="date"
                  value={form.fecha_nacimiento}
                  onChange={(v) => setForm((s) => ({ ...s, fecha_nacimiento: v }))}
                />

                <Select
                  label="Género"
                  value={form.genero || ""}
                  onChange={(v) => setForm((s) => ({ ...s, genero: v }))}
                  options={[
                    { value: "", label: "Seleccionar" },
                    { value: "Masculino", label: "Masculino" },
                    { value: "Femenino", label: "Femenino" },
                    { value: "Otro", label: "Otro / Prefiero no decir" },
                    { value: "M", label: "M (compat.)" },
                    { value: "F", label: "F (compat.)" },
                  ]}
                />

                <Input
                  label="Altura (m)"
                  type="text"
                  value={String(form.altura ?? "")}
                  onChange={(v) => setForm((s) => ({ ...s, altura: v }))}
                  placeholder="Ej: 1.75"
                />
                <Input
                  label="Peso (kg)"
                  type="text"
                  value={String(form.peso ?? "")}
                  onChange={(v) => setForm((s) => ({ ...s, peso: v }))}
                  placeholder="Ej: 70.5"
                />
                <Input
                  label="Avatar (URL)"
                  value={form.avatar}
                  onChange={(v) => setForm((s) => ({ ...s, avatar: v }))}
                  placeholder="https://..."
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    onClick={() => {
                      setIsEditing(false);
                      setSaveError("");
                      setSaveOk("");
                    }}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 text-left mb-6">
                  <Row label="Email" value={ui.email} />
                  <Row label="Fecha de nacimiento" value={ui.fechaNacimiento} />
                  <Row label="Género" value={ui.genero} />
                  <Row label="Altura" value={ui.altura} />
                  <Row label="Peso" value={ui.peso} />
                  <Row label="Fecha de registro" value={ui.fechaRegistro} />
                  <Row label="Último acceso" value={ui.ultimoAcceso} />
                </div>

                <button
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-8 rounded-full transition-all duration-300 shadow-lg hover:scale-105"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </button>
              </>
            )}
          </>
        ) : (
          <p className="text-white/80">No se encontró información del usuario.</p>
        )}
      </section>
    </main>
  );
}

// ======= Subcomponentes UI =======
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
      <span className="text-white/70 font-medium">{label}:</span>
      <span className="font-semibold text-white">{value ?? "—"}</span>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "", ...rest }) {
  return (
    <label className="block">
      <span className="text-white/80 text-sm">{label}</span>
      <input
        className="mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-md"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
    </label>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <label className="block">
      <span className="text-white/80 text-sm">{label}</span>
      <select
        className="mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-md"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function LoaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-32 h-32 rounded-full bg-white/20 mx-auto mb-6" />
      <div className="h-6 bg-white/20 rounded w-1/2 mx-auto mb-2" />
      <div className="h-4 bg-white/20 rounded w-1/3 mx-auto mb-8" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-white/10 rounded" />
        ))}
      </div>
    </div>
  );
}
