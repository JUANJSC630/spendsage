import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
    })
    .nonempty("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  description: z
    .string()
    .max(200, "La descripción no puede exceder 200 caracteres")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "El color debe ser un código hexadecimal válido")
    .default("#3B82F6"),
  icon: z
    .string()
    .min(1, "El ícono es requerido")
    .default("Folder"),
  type: z
    .enum(["income", "expense", "transfer", "other"], {
      required_error: "El tipo es requerido",
    })
    .default("expense"),
});