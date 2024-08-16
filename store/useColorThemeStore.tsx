import { create } from "zustand";

// Definición del estado del tema de color y las funciones relacionadas
interface ColorThemeState {
  colorTheme: string;
  setColorTheme: (colorTheme: string) => void; // Función para establecer un tema de color
}

export const useColorThemeStore = create<ColorThemeState>((set, get) => ({
  colorTheme: "#6366f1", // Tema de color predeterminado
  setColorTheme: (colorTheme) => {
    set({ colorTheme });
  },
}));
