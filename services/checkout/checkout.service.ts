import z from "zod";
import { CheckoutInput, checkoutSchema } from "./checkout.validation";
import { getCart } from "../cart/cart.service";
import { CreateIntention } from "../payment/payment.service";
import { ServiceResult } from "@/types/ServiceResult";
import { User } from "better-auth";
import { cartRepository } from "@/repositories/cart.repository";
import { createOrder } from "../order/order.service";

export async function checkout(
  input: CheckoutInput,
  user: User,
): Promise<ServiceResult<{ client_secret: string }>> {
  const result = checkoutSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const cart = await getCart(user.id);

  if (!cart || cart.items.length === 0) {
    return {
      success: false,
      errors: {
        _form: ["Your cart is empty."],
      },
    };
  }

  const tax = Number((cart.subtotal * 0.08).toFixed(2));
  const shipping = 0;
  const total = cart.subtotal + tax + shipping;
  const totalInCents = Math.round(total * 100);

  const order = await createOrder(
    user,
    result.data,
    cart,
    tax,
    shipping,
    total,
  );

  if (!order) {
    return {
      success: false,
      errors: {
        _form: ["Failed to create order. Please try again."],
      },
    };
  }

  await cartRepository.clearCart(user.id);

  const paymobItems = [
    ...cart.items.map((item) => ({
      name: item.product.name,
      amount: Math.round(item.product.price * 100),
      description: item.product.description ?? undefined,
      quantity: item.quantity,
    })),
    ...(tax > 0
      ? [
          {
            name: "Estimated Tax",
            amount: Math.round(tax * 100),
            description: "Tax",
            quantity: 1,
          },
        ]
      : []),
  ];

  const res = await CreateIntention({
    amount: totalInCents,
    currency: "EGP",
    billing_data: {
      email: user.email,
      first_name: user.name?.split(" ")[0] || "Customer",
      last_name: user.name?.split(" ").slice(1).join(" ") || "Customer",
      phone_number: result.data.phone,
      city: result.data.city,
      country: "EGY",
    },
    items: paymobItems,
    redirection_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/result`,
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paymob`,
  });

  if (!res?.client_secret) {
    return {
      success: false,
      errors: {
        _form: ["Failed to initialize payment gateway. Please try again."],
      },
    };
  }

  return {
    success: true,
    data: {
      client_secret: res.client_secret,
    },
  };
}
