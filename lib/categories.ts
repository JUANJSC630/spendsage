// Categorías compartidas entre módulos de transacciones y presupuestos
export const TRANSACTION_CATEGORIES = [
  {
    value: "income",
    label: "Ingresos",
    description: "Salarios, freelance, inversiones, bonificaciones"
  },
  {
    value: "fixed_expenses", 
    label: "Gastos Fijos",
    description: "Renta, servicios públicos, seguros, suscripciones"
  },
  {
    value: "variable_expenses",
    label: "Gastos Variables", 
    description: "Comida, transporte, entretenimiento, compras"
  },
  {
    value: "food",
    label: "Alimentación",
    description: "Supermercado, restaurantes, comida rápida"
  },
  {
    value: "transport",
    label: "Transporte",
    description: "Gasolina, transporte público, mantenimiento vehículo"
  },
  {
    value: "entertainment",
    label: "Entretenimiento", 
    description: "Películas, juegos, salidas, hobbies"
  },
  {
    value: "health",
    label: "Salud",
    description: "Médicos, medicamentos, seguros médicos"
  },
  {
    value: "education",
    label: "Educación",
    description: "Cursos, libros, materiales educativos"
  }
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  income: "Ingresos",
  fixed_expenses: "Gastos Fijos", 
  variable_expenses: "Gastos Variables",
  food: "Alimentación",
  transport: "Transporte",
  entertainment: "Entretenimiento",
  health: "Salud",
  education: "Educación",
};

// Type para garantizar que solo se usen categorías válidas
export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number]["value"];