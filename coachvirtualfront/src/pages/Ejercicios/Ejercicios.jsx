import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";

const STORAGE_KEY = "cv.muscleSelection";

const EXERCISES_BY_GROUP = {
  pecho: ["Press banca", "Aperturas con mancuernas", "Flexiones"],
  espalda: ["Dominadas", "Remo con barra", "Jalón al pecho"],
  hombros: ["Press militar", "Elevaciones laterales", "Pájaro"],
  piernas: ["Sentadilla", "Peso muerto rumano", "Zancadas"],
  brazos: ["Curl de bíceps", "Fondos", "Extensiones de tríceps"],
  core: ["Plancha", "Crunch", "Elevación de piernas"],
};

const LABELS = {
  pecho: "Pecho",
  espalda: "Espalda",
  hombros: "Hombros",
  piernas: "Piernas",
  brazos: "Brazos",
  core: "Core",
};

export default function Ejercicios() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useCategory();

  const groupsFromState = location.state?.groups;
  const groupsFromQuery = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const raw = qs.get("g") || "";
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }, [location.search]);

  let groups = groupsFromState?.length ? groupsFromState : groupsFromQuery;
  if (!groups?.length) {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : [];
      groups = Array.isArray(saved) ? saved : [];
    } catch {
      groups = [];
    }
  }

  useEffect(() => {
    if (!groups?.length) navigate("/musculo", { replace: true });
  }, [groups, navigate]);

  const exercises = useMemo(() => {
    const set = new Set();
    (groups || []).forEach((g) =>
      (EXERCISES_BY_GROUP[g] || []).forEach((e) => set.add(e))
    );
    return [...set];
  }, [groups]);

  const startTraining = () => navigate("/pose-test");

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-5xl w-full border border-white/20 text-white">
        <header className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            {category === "gym" ? "Ejercicios" : "Terapias"} —{" "}
            {(groups || []).map((g) => LABELS[g] || g).join(", ")}
          </h1>
          <p className="text-white/80 mt-2">
            Recomendaciones combinadas para los grupos seleccionados.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {(groups || []).map((g) => (
            <span
              key={g}
              className="px-3 py-1 rounded-full text-sm bg-white/10 border border-white/20"
            >
              {LABELS[g] || g}
            </span>
          ))}
        </div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((name, idx) => (
            <article
              key={idx}
              className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition"
            >
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-white/70">3–4 series · 8–12 reps</p>
            </article>
          ))}
          {!exercises.length && (
            <p className="text-white/80">
              No hay ejercicios configurados todavía.
            </p>
          )}
        </section>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/musculo")}
            className="px-5 py-2 rounded-full border-2 border-white/30 hover:border-white/60 text-white font-semibold transition hover:bg-white/10"
          >
            Cambiar músculos
          </button>
          <button
            onClick={startTraining}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:scale-105 transition"
          >
            Entrenar ahora (IA)
          </button>
        </div>

        <footer className="mt-8 text-white/40 text-xs text-center">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>
    </main>
  );
}
