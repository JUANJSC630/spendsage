import { z } from "zod";

export const budgetFormSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  amount: z.string().refine(
    value => {
      const numericValue = parseInt(value);
      return value !== "" && !isNaN(numericValue) && numericValue > 0;
    }, 
    {
      message: "El monto debe ser mayor que 0"
    }
  ),
  period: z.string().min(1, "El período es requerido"),
  month: z.number().min(1, "Mes inválido").max(12, "Mes inválido"),
  year: z.number().min(2020, "Año inválido").max(2030, "Año inválido"),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;