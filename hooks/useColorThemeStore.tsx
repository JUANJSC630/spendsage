"use client";
import { create } from "zustand";
import { useEffect } from "react";

interface ColorThemeState {
  colorTheme: string;
  setColorTheme: (colorTheme: string) => void;
}

export const useColorThemeStore = create<ColorThemeState>((set, get) => ({
  colorTheme: "#3b82f6", // Tema de color predeterminado
  setColorTheme: (colorTheme: string) => {
    localStorage.setItem("colorTheme", colorTheme);
    set({ colorTheme });
  },
}));

// Hook para sincronizar el estado con localStorage en el cliente
export function useSyncColorTheme() {
  const { colorTheme, setColorTheme } = useColorThemeStore();

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const savedColorTheme = localStorage.getItem("colorTheme");
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, [setColorTheme]);

  return { colorTheme, setColorTheme };
}
