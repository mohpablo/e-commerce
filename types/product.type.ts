import { Prisma } from "@/lib/generated/prisma/client";
import { productCardInclude } from "@/repositories/product.repository";

export type ProductCardData =
  Prisma.ProductGetPayload<{
    include: typeof productCardInclude;
  }>;