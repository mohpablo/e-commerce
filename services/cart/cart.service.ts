import { prisma } from "@/lib/prisma";
import { cartRepository } from "@/repositories/cart.repository";
import { productRepository } from "@/repositories/product.repository";
import { ServiceResult } from "@/types/ServiceResult";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "./cart.validation";

type CartMutationData = {
  quantity: number;
  capped: boolean;
};

export async function addToCart(
  userId: string,
  rawInput: unknown,
): Promise<ServiceResult<CartMutationData>> {
  const parsed = addToCartSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { productId, quantity } = parsed.data;

  const product = await productRepository.findStockById(productId);

  if (!product) {
    return {
      success: false,
      errors: { productId: ["Product not found."] },
    };
  }

  if (product.stock <= 0) {
    return {
      success: false,
      errors: { quantity: ["This product is sold out."] },
    };
  }

  return prisma.$transaction(async () => {
    const cart = await cartRepository.findOrCreateByUserId(userId);
    const existing = await cartRepository.findItem(cart.id, productId);

    const desired = (existing?.quantity ?? 0) + quantity;
    const finalQuantity = Math.min(desired, product.stock);

    await cartRepository.setItemQuantity(cart.id, productId, finalQuantity);

    return {
      success: true as const,
      data: {
        quantity: finalQuantity,
        capped: finalQuantity < desired,
      },
    };
  });
}

export async function updateCartItemQuantity(
  userId: string,
  rawInput: unknown,
): Promise<ServiceResult<CartMutationData>> {
  const parsed = updateCartItemSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { cartItemId, quantity } = parsed.data;

  const item = await cartRepository.findItemForUser(userId, cartItemId);

  if (!item) {
    return {
      success: false,
      errors: { cartItemId: ["Cart item not found."] },
    };
  }

  if (item.product.stock <= 0) {
    return {
      success: false,
      errors: { quantity: ["This product is sold out."] },
    };
  }

  const finalQuantity = Math.min(quantity, item.product.stock);

  await cartRepository.updateItemQuantity(userId, cartItemId, finalQuantity);

  return {
    success: true,
    data: {
      quantity: finalQuantity,
      capped: finalQuantity < quantity,
    },
  };
}

export async function removeCartItem(
  userId: string,
  rawInput: unknown,
): Promise<ServiceResult> {
  const parsed = removeCartItemSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { cartItemId } = parsed.data;

  const { count } = await cartRepository.deleteItem(userId, cartItemId);

  if (count === 0) {
    return {
      success: false,
      errors: { cartItemId: ["Cart item not found."] },
    };
  }

  return { success: true };
}

export async function getCartCount(userId: string) {
  return cartRepository.countItems(userId);
}

export async function getCart(userId: string) {
  const cart = await cartRepository.findByUserId(userId);

  const items = (cart?.items ?? []).map((item) => {
    const price = item.product.price.toNumber();

    return {
      id: item.id,
      quantity: item.quantity,
      lineTotal: price * item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price,
        stock: item.product.stock,
        description:item.product.description,
        image: item.product.images[0] ?? null,
      },
    };
  });

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

// export async function getProductCartQuantity(
//   userId: string,
//   productId: string,
// ) {
//   return cartRepository.findProductQuantity(userId, productId);
// }

export type CartData = Awaited<ReturnType<typeof getCart>>;
export type CartLine = CartData["items"][number];
