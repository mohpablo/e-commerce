import { productRepository } from "@/repositories/product.repository";

export function getNewestProducts(take = 4) {
  return productRepository.findNewest(take);
}

export function getPopularProducts(take = 4) {
  return productRepository.findPopular(take);
}

export async function getProductsPage(page: number, sort?: string,q?: string) {
  const productsPerPage = 12;
  const { items, total } = await productRepository.findPaginated(
    page,
    productsPerPage,
    sort,
    q
  );

  return {
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / productsPerPage)),
  };
}
