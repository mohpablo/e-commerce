import { prisma } from "@/lib/prisma";

export const categoryRepository = {
  async findNavCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
  },

  async findCategoriesWithCount() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
    });
  },
};
