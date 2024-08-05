import { z } from "zod";

export const formSchema = z.object({
  check: z.boolean().default(false),
  amount: z.string(),
  date: z.date(),
  description: z.string(),
});
