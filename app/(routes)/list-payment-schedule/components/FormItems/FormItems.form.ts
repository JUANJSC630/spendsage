import { z } from "zod";

export const formSchema = z.object({
  check: z.boolean().default(false),
  amount: z.string().nonempty("Amount is required"),
  date: z.date({
    required_error: "Please select a date",
  }),
  description: z.string().nonempty("Description is required"),
});
