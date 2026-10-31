import { orderRepository } from "@/repositories/order.repository";
import { User } from "better-auth";
import { CheckoutInput } from "../checkout/checkout.validation";
import { CartData } from "@/types/cart.type";

export async function createOrder(
  user: User,
  checkoutData: CheckoutInput,
  cart: CartData,
  tax: number,
  shipping: number,
  total: number,
) {
  return await orderRepository.create({
    userId: user.id,
    status: "PENDING",
    subtotal: cart.subtotal,
    shippingCost: shipping,
    total: total,
    shippingName: user.name || "Customer",
    shippingEmail: user.email,
    shippingPhone: checkoutData.phone,
    shippingAddress: checkoutData.address,
    shippingCity: checkoutData.city,
    items: {
      create: cart.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })),
    },
  });
}
