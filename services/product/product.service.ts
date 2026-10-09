import { productRepository } from "@/repositories/product.repository";

export function getNewestProducts(take = 4) {
  return productRepository.findNewest(take);
}

export function getPopularProducts(take = 4) {
  return productRepository.findPopular(take);
}

export async function getProductsPage({
  page,
  category,
  q,
  sort,
}: {
  page: number;
  sort?: string;
  q?: string;
  category?: string;
}) {
  const productsPerPage = 12;
  const { items, total } = await productRepository.findPaginated({
    page,
    pageSize: productsPerPage,
    sort,
    q,
    category,
  });

  return {
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / productsPerPage)),
  };
}
