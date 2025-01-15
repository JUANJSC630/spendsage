import { z } from "zod";

export const formSchema = z.object({
  fromDate: z.date({
    required_error: "From date is required",
  }),
  toDate: z.date({
    required_error: "To date is required",
  }),
  name: z.string().nonempty({
    message: "Name is required",
  }),
  listPaymentScheduleId: z.string().nonempty({
    message: "List payment schedule id is required",
  }),
});
