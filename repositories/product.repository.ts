import { prisma } from "@/lib/prisma";

const sortOrders = {
  newest: { createdAt: "desc" },
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  "name-asc": { name: "asc" },
} as const;

export const productCardInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: {
    orderBy: { position: "asc" as const },
    take: 2,
    select: { id: true, url: true, alt: true },
  },
} as const;

export const productRepository = {
  async findNewest(take: number) {
    return prisma.product.findMany({
      take,
      orderBy: { createdAt: "desc" },
      include: productCardInclude,
    });
  },

  async findPopular(take: number) {
    return prisma.product.findMany({
      take,
      where: { stock: { gt: 0 } },
      orderBy: { orderItems: { _count: "desc" } },
      include: productCardInclude,
    });
  },

  async findPaginated({
    page,
    pageSize,
    sort = "newest",
    q = "",
    category,
  }: {
    page: number;
    pageSize: number;
    sort?: string;
    q?: string;
    category?: string;
  }) {
    const orderBy = Object.hasOwn(sortOrders, sort)
      ? sortOrders[sort as keyof typeof sortOrders]
      : sortOrders.newest;

    const where = {
      ...(q.trim()
        ? {
            name: {
              contains: q.trim(),
            },
          }
        : {}),
      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [orderBy, { id: "asc" }],
        include: productCardInclude,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  },
};
