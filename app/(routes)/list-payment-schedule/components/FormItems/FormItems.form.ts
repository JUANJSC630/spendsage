import { z } from "zod";

export const formSchema = z.object({
  check: z.boolean().default(false),
  amount: z.string().min(1, "El monto es requerido"),
  date: z.date({
    required_error: "Por favor selecciona una fecha",
  }),
  description: z.string().min(1, "La descripción es requerida"),
});
