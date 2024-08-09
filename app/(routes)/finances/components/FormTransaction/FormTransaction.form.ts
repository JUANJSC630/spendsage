import { z } from "zod";

export const formSchema = z.object({
  category: z
    .string({
      required_error: "Please select a category",
    })
    .nonempty("Please select a category"),
  description: z
    .string({
      required_error: "Description is required",
    })
    .nonempty("Description is required"),
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine((value) => /^\d+$/.test(value), {
      message: "Amount must be a number",
    })
    .refine((value) => value.length >= 1, {
      message: "Amount must be at least 1 digits",
    }),
    date: z.date(
      {
        required_error: "Date is required",
      }
    ),
});
