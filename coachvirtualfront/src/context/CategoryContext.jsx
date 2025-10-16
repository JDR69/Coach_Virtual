import { createContext, useContext, useState } from "react";

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [category, setCategory] = useState(
    () => localStorage.getItem("cv.category") || null // "gym" | "fisio" | null
  );

  const chooseCategory = (value) => {
    setCategory(value);
    localStorage.setItem("cv.category", value);
  };

  const clearCategory = () => {
    setCategory(null);
    localStorage.removeItem("cv.category");
  };

  return (
    <CategoryContext.Provider value={{ category, chooseCategory, clearCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => useContext(CategoryContext);
