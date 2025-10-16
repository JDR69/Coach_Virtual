import { useNavigate } from "react-router-dom";
import { useCategory } from "../../context/CategoryContext";

export default function SelectCategory() {
  const { chooseCategory } = useCategory();
  const navigate = useNavigate();

  const pick = (value) => {
    chooseCategory(value); // "gym" | "fisio"
    navigate("/musculo", { replace: true });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full text-center border border-white/20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
          ¿Qué deseas entrenar hoy?
        </h1>
        <p className="text-white/80 text-base md:text-lg mb-8">
          Elige una categoría para cargar tus rutinas.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => pick("gym")}
            className="bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 rounded-2xl p-6 text-left text-white transition-all shadow-lg hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold">Gimnasio</h2>
            <p className="text-white/70 mt-2">Fuerza, resistencia e hipertrofia.</p>
          </button>

          <button
            onClick={() => pick("fisio")}
            className="bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 rounded-2xl p-6 text-left text-white transition-all shadow-lg hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold">Fisioterapia</h2>
            <p className="text-white/70 mt-2">Rehabilitación, movilidad y control del dolor.</p>
          </button>
        </div>

        <footer className="mt-8 text-white/40 text-xs">
          Coach Virtual &copy; {new Date().getFullYear()}
        </footer>
      </section>
    </main>
  );
}
