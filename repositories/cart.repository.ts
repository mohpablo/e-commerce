import { prisma } from "@/lib/prisma";

export const cartRepository = {
  async findOrCreateByUserId(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  },

  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                images: {
                  orderBy: { position: "asc" },
                  take: 1,
                  select: { url: true, alt: true },
                },
              },
            },
          },
        },
      },
    });
  },

  async countItems(userId: string) {
    const result = await prisma.cartItem.aggregate({
      where: { cart: { userId } },
      _sum: { quantity: true },
    });
    return result._sum.quantity ?? 0;
  },

  async findItem(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
  },

  async findItemForUser(userId: string, cartItemId: string) {
    return prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { userId } },
      include: { product: { select: { stock: true } } },
    });
  },

  async setItemQuantity(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: { cartId, productId, quantity },
      update: { quantity },
    });
  },

  async updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ) {
    return prisma.cartItem.updateMany({
      where: { id: cartItemId, cart: { userId } },
      data: { quantity },
    });
  },

  async deleteItem(userId: string, cartItemId: string) {
    return prisma.cartItem.deleteMany({
      where: { id: cartItemId, cart: { userId } },
    });
  },

  async findProductQuantity(userId: string, productId: string) {
    const item = await prisma.cartItem.findFirst({
      where: { productId, cart: { userId } },
      select: { quantity: true },
    });
    return item?.quantity ?? 0;
  },
};
