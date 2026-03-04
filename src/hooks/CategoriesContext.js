// CategoriesContext.js
import { createContext, useContext } from "react";
import { useCategoriesAndTasks as useCategoriesAndTasksHook } from "./useCategoriesAndTasks";

const CategoriesContext = createContext(null);

export const CategoriesProvider = ({ children }) => {
  const value = useCategoriesAndTasksHook();
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesAndTasks = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategoriesAndTasks must be used inside CategoriesProvider");
  }
  return context;
};