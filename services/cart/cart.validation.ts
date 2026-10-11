import { z } from "zod";

const quantity = z.coerce
  .number()
  .int()
  .min(1, "Quantity must be at least 1")
  .max(99, "Quantity is too large");

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Invalid product"),
  quantity,
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Invalid cart item"),
  quantity,
});

export const removeCartItemSchema = z.object({
  cartItemId: z.string().min(1, "Invalid cart item"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>;
