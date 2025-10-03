import { z } from "zod";

export const editPaymentItemFormSchema = z.object({
  amount: z.string().min(1, "El monto es requerido"),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  description: z.string().min(1, "La descripción es requerida"),
});

export type EditPaymentItemFormValues = z.infer<typeof editPaymentItemFormSchema>;