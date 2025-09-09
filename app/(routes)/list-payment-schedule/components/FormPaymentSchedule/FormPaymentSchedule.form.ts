import { z } from "zod";

export const formSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "La fecha de inicio es requerida",
    }),
    to: z.date({
      required_error: "La fecha de fin es requerida",
    }),
  }, {
    required_error: "El rango de fechas es requerido",
  }).refine((data) => data.to >= data.from, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["to"],
  }),
  name: z.string().min(1, {
    message: "El nombre es requerido",
  }),
  listPaymentScheduleId: z.string().min(1, {
    message: "El ID de la lista de lista de pagos es requerido",
  }),
});
