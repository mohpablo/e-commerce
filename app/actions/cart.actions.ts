"use server";

import { auth } from "@/lib/auth";
import {
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cart/cart.service";
import type {
  RemoveCartItemInput,
  UpdateCartItemInput,
} from "@/services/cart/cart.validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type CartActionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

function refreshCart() {
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}

export async function addToCartAction(
  _prevState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login?callbackUrl=/cart");

  const raw = Object.fromEntries(formData);
  const result = await addToCart(session.user.id, raw);

  if (!result.success) {
    return { errors: result.errors };
  }

  refreshCart();

  return {
    success: true,
    message: result.data?.capped
      ? `Added. Only ${result.data.quantity} available, so that's your max.`
      : "Added to cart.",
  };
}

export async function updateCartItemAction(
  input: UpdateCartItemInput,
): Promise<CartActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { errors: { auth: ["Please log in."] } };
  }

  const result = await updateCartItemQuantity(session.user.id, input);

  if (!result.success) {
    return { errors: result.errors };
  }

  refreshCart();

  return {
    success: true,
    message: result.data?.capped
      ? `Only ${result.data.quantity} available.`
      : undefined,
  };
}

export async function removeCartItemAction(
  input: RemoveCartItemInput,
): Promise<CartActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { errors: { auth: ["Please log in."] } };
  }

  const result = await removeCartItem(session.user.id, input);

  if (!result.success) {
    return { errors: result.errors };
  }

  refreshCart();

  return { success: true };
}
