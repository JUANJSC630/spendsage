import { z } from "zod";

export const formSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: "Start date is required",
    }),
    to: z.date({
      required_error: "End date is required",
    }),
  }, {
    required_error: "Date range is required",
  }).refine((data) => data.to >= data.from, {
    message: "End date must be after start date",
    path: ["to"],
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  listPaymentScheduleId: z.string().min(1, {
    message: "List payment schedule id is required",
  }),
});
