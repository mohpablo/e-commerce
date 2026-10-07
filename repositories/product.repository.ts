import { prisma } from "@/lib/prisma";

export const productCardInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: {
    orderBy: { position: "asc" as const },
    take: 2,
    select: { id: true, url: true, alt: true },
  },
} as const;

export const productRepository = {
  async findNewest(take = 4) {
    return prisma.product.findMany({
      take,
      orderBy: { createdAt: "desc" },
      include: productCardInclude,
    });
  },

  async findPopular(take = 4) {
    return prisma.product.findMany({
      take,
      where: { stock: { gt: 0 } },
      orderBy: { orderItems: { _count: "desc" } },
      include: productCardInclude,
    });
  },
};
