import React, { createContext, useContext } from "react";

type ThemeContextType = {
  colors: {
    background: string;
    text: string;
    card: string;
    border: string;
    subText: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colors = {
    background: "#FFFFFF",
    text: "#000000",
    card: "#FFFFFF",
    border: "#E5E7EB",
    subText: "#666666",
  };

  return (
    <ThemeContext.Provider value={{ colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
}
