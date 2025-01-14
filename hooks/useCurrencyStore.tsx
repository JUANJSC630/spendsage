import { create } from "zustand";

// Definición del estado de la moneda y funciones relacionadas
interface CurrencyState {
  currency: "USD" | "EUR" | "COP"; // Monedas soportadas
  toggleCurrency: () => void; // Alternar entre monedas
  setCurrency: (currency: "USD" | "EUR" | "COP") => void; // Establecer moneda directamente
  getSymbol: () => string; // Obtener el símbolo de la moneda actual
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: "USD", // Valor inicial seguro para SSR
  toggleCurrency: () => {
    set((state) => {
      const newCurrency =
        state.currency === "USD"
          ? "EUR"
          : state.currency === "EUR"
          ? "COP"
          : "USD";
      if (typeof window !== "undefined") {
        localStorage.setItem("currency", newCurrency); // Actualizar localStorage en el cliente
      }
      return { currency: newCurrency };
    });
  },
  setCurrency: (currency) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currency", currency); // Guardar en localStorage
    }
    set({ currency });
  },
  getSymbol: () => {
    const { currency } = get();
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "COP":
        return "$";
      default:
        return "$"; // Valor predeterminado
    }
  },
}));

// Sincronización inicial con localStorage después de la hidratación del cliente
if (typeof window !== "undefined") {
  const storedCurrency = localStorage.getItem("currency") as
    | "USD"
    | "EUR"
    | "COP";
  if (storedCurrency) {
    useCurrencyStore.getState().setCurrency(storedCurrency);
  }
}
