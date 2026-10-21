import { z } from "zod";
import { checkoutSchema } from "../checkout/checkout.validation";


const cents = (n: number) => Math.round(n * 100);

export const orderItemSchema = z
  .object({
    productId: z.string().min(1, "Product is required"),
    productName: z.string().min(1, "Product name is required"),
    unitPrice: z.number().positive("Price must be greater than 0"),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(99, "Quantity is too high"),
    subtotal: z.number().positive(),
  })
  .refine(
    (item) => cents(item.unitPrice * item.quantity) === cents(item.subtotal),
    {
      message: "Item subtotal must equal price × quantity",
      path: ["subtotal"],
    },
  );

export const createOrderSchema = z
  .object({
    userId: z.string().min(1, "User is required"),

    subtotal: z.number().positive("Subtotal must be greater than 0"),
    shippingCost: z.number().min(0, "Shipping cannot be negative"),
    total: z.number().positive("Total must be greater than 0"),

    shippingName: z.string().trim().min(1, "Name is required"),
    shippingEmail: z.string().email("Enter a valid email"),
    shippingPhone: checkoutSchema.shape.phone,
    shippingAddress: z.string().trim().min(3, "Address is required"),
    shippingCity: z.string().trim().min(2, "City is required"),

    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  })
  .refine(
    (order) =>
      cents(order.items.reduce((sum, item) => sum + item.subtotal, 0)) ===
      cents(order.subtotal),
    { message: "Subtotal must equal the sum of the items", path: ["subtotal"] },
  )
  .refine(
    (order) => cents(order.total) >= cents(order.subtotal + order.shippingCost),
    {
      message: "Total cannot be less than subtotal + shipping",
      path: ["total"],
    },
  );

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
