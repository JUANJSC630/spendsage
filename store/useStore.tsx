import { create } from "zustand";

// Definición del estado de la moneda y las funciones relacionadas
interface CurrencyState {
  currency: "USD" | "EUR" | "COP";
  toggleCurrency: () => void; // Función para alternar la moneda
  setCurrency: (currency: "USD" | "EUR" | "COP") => void; // Función para establecer una moneda directamente
  getSymbol: () => string; // Función para obtener el símbolo de la moneda
}

// Recupera la moneda almacenada en localStorage o usa "USD" por defecto
const initialCurrency: "USD" | "EUR" | "COP" =
  (typeof window !== "undefined" &&
    (localStorage.getItem("currency") as "USD" | "EUR" | "COP")) ||
  "USD";

const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: initialCurrency,
  toggleCurrency: () => {
    set((state) => {
      // Alterna la moneda entre USD, EUR y COP
      const newCurrency =
        state.currency === "USD"
          ? "EUR"
          : state.currency === "EUR"
          ? "COP"
          : "USD";
      localStorage.setItem("currency", newCurrency); // Actualiza localStorage
      return { currency: newCurrency };
    });
  },
  setCurrency: (currency) => {
    localStorage.setItem("currency", currency); // Actualiza localStorage
    set({ currency });
  },
  getSymbol: () => {
    const { currency } = get();
    // Devuelve el símbolo de la moneda actual
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "COP":
        return "$";
    }
  },
}));

export default useCurrencyStore;
