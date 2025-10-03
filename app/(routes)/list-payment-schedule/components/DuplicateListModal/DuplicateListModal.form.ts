import { z } from "zod";

export const duplicateListFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

export type DuplicateListFormValues = z.infer<typeof duplicateListFormSchema>;