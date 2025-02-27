import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Définition des types pour le thème
type Theme = {
  headerColor: string;
  sidebarColor: string;
  // primaryColor: string;
  font: string;
  primaryColor: string;
  textColor: string;
};

type ThemeContextType = {
  theme: Theme;
  updateTheme: (key: keyof Theme, value: string) => void;
};

// Thème par défaut
const defaultTheme: Theme = {
  headerColor: "#ffffff", 
  sidebarColor: "#111827", // Noir
  // primaryColor: "#3B82F6", // Bleu primaire
  font: "Inter, sans-serif",
  primaryColor: "#3B82F6", // Couleur des boutons (bleu primaire)
  textColor: "#ffffff", // Couleur du texte (blanc)
};

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Fournisseur du thème
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("userTheme");
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  // Sauvegarder les modifications dans le localStorage à chaque changement de `theme`
  useEffect(() => {
    localStorage.setItem("userTheme", JSON.stringify(theme));
  }, [theme]);

  // Fonction pour mettre à jour le thème
  const updateTheme = (key: keyof Theme, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte du thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
