// src/context/CategoryContext.jsx
import { createContext, useContext, useState } from "react";

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [category, setCategory] = useState(
    () => localStorage.getItem("cv.category") || null // "gym" | "fisio" | null
  );

  // ✅ ahora son varios músculos seleccionados
  const [selectedMuscleIds, setSelectedMuscleIds] = useState([]); // number[]
  // ✅ ya tenías varios detalles seleccionados
  const [selectedDetalleIds, setSelectedDetalleIds] = useState([]); // number[]

  const chooseCategory = (value) => {
    setCategory(value);
    localStorage.setItem("cv.category", value);
    // al cambiar categoría limpiamos el flujo
    setSelectedMuscleIds([]);
    setSelectedDetalleIds([]);
  };

  const clearCategory = () => {
    setCategory(null);
    localStorage.removeItem("cv.category");
    setSelectedMuscleIds([]);
    setSelectedDetalleIds([]);
  };

  // ✅ marcar / desmarcar un músculo
  const toggleMuscle = (id) => {
    const numId = Number(id);
    setSelectedMuscleIds((prev) =>
      prev.includes(numId)
        ? prev.filter((x) => x !== numId)
        : [...prev, numId]
    );
    // si cambian los músculos, reseteo los detalles
    setSelectedDetalleIds([]);
  };

  const toggleDetalle = (id) => {
    const numId = Number(id);
    setSelectedDetalleIds((prev) =>
      prev.includes(numId)
        ? prev.filter((x) => x !== numId)
        : [...prev, numId]
    );
  };

  const resetFlow = () => {
    setSelectedMuscleIds([]);
    setSelectedDetalleIds([]);
  };

  return (
    <CategoryContext.Provider
      value={{
        category,
        chooseCategory,
        clearCategory,

        selectedMuscleIds,
        toggleMuscle,

        selectedDetalleIds,
        toggleDetalle,

        resetFlow,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => useContext(CategoryContext);
