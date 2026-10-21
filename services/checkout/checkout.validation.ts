import { z } from "zod";

const egyptPhone = /^(?:\+20|0020|0)?1[0125]\d{8}$/;

export const checkoutSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => egyptPhone.test(v), "Enter a valid Egyptian mobile number"),
  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(60, "City is too long"),
  address: z
    .string()
    .trim()
    .min(3, "Street address is required")
    .max(120, "Street address is too long"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
