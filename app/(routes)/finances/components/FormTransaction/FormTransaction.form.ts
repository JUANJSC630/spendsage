import { z } from "zod";

export const formSchema = z.object({
  category: z
    .string({
      required_error: "Por favor selecciona una categoría",
    })
    .nonempty("Por favor selecciona una categoría"),
  description: z
    .string({
      required_error: "La descripción es requerida",
    })
    .nonempty("La descripción es requerida"),
  amount: z
    .string()
    .min(1, { message: "El monto es requerido" })
    .refine((value) => /^\d+$/.test(value), {
      message: "El monto debe ser un número",
    })
    .refine((value) => value.length >= 1, {
      message: "El monto debe tener al menos 1 dígito",
    }),
    date: z.date(
      {
        required_error: "La fecha es requerida",
      }
    ),
});
