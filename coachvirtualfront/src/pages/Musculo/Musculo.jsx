import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";

const GROUPS = [
  { id: "pecho", name: "Pecho" },
  { id: "espalda", name: "Espalda" },
  { id: "hombros", name: "Hombros" },
  { id: "piernas", name: "Piernas" },
  { id: "brazos", name: "Brazos" },
  { id: "core", name: "Core" },
];

const STORAGE_KEY = "cv.muscleSelection";

export default function Musculo() {
  const { category, clearCategory } = useCategory();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
  }, [selected]);

  const anySelected = selected.size > 0;
  const title = useMemo(
    () =>
      category === "gym"
        ? "Elige los grupos musculares"
        : "Elige las zonas de trabajo",
    [category]
  );

  const toggle = (id) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const goNext = () => {
    const arr = [...selected];
    const query = `?g=${encodeURIComponent(arr.join(","))}`;
    navigate(`/musculo/ejercicios${query}`, { state: { groups: arr } });
  };

  const clearAll = () => setSelected(new Set());

  const changeCategory = () => {
    clearCategory();
    sessionStorage.removeItem(STORAGE_KEY);
    navigate("/seleccionar", { replace: true });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl w-full text-center border border-white/20">
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          {title}
        </h1>
        <p className="text-white/70 mb-8">
          Puedes elegir más de uno. Seleccionados: <strong>{selected.size}</strong>
        </p>

        {/* Grid de músculos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {GROUPS.map((g) => {
            const active = selected.has(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                className={[
                  "rounded-2xl p-6 transition-all shadow-lg border relative overflow-hidden",
                  active
                    ? "bg-gradient-to-br from-blue-600/70 to-purple-600/70 border-white/30 text-white ring-2 ring-white/30 hover:scale-[1.01]"
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-white",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold">{g.name}</h3>
                  <span
                    className={[
                      "inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm font-bold",
                      active
                        ? "bg-white/90 text-blue-700 border-white/90"
                        : "bg-transparent border-white/40 text-transparent",
                    ].join(" ")}
                  >
                    ✓
                  </span>
                </div>
                <p className="text-white/70 mt-1">Ejercicios y series recomendadas.</p>
              </button>
            );
          })}
        </div>

        {/* Acciones inferiores */}
        <div className="mt-8 flex flex-wrap gap-3 items-center justify-center">
          <button
            onClick={changeCategory}
            className="px-5 py-2 rounded-full border-2 border-white/30 hover:border-white/60 text-white font-semibold hover:bg-white/10 transition"
          >
            Cambiar categoría
          </button>

          <button
            onClick={clearAll}
            disabled={!anySelected}
            className="px-5 py-2 rounded-full border-2 border-white/30 text-white/90 hover:border-white/60 hover:bg-white/10 disabled:opacity-40 transition"
          >
            Limpiar selección
          </button>

          <button
            onClick={goNext}
            disabled={!anySelected}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>

        <footer className="mt-8 text-white/40 text-xs">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>
    </main>
  );
}
