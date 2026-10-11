import { Prisma } from "@/lib/generated/prisma/client";
import { productCardInclude, productDetailInclude } from "@/repositories/product.repository";

export type ProductCardData = Prisma.ProductGetPayload<{
  include: typeof productCardInclude;
}>;

export type ProductDetailData = Prisma.ProductGetPayload<{
  include: typeof productDetailInclude;
}>;
