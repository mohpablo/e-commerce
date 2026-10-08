import { productRepository } from "@/repositories/product.repository";

export function getNewestProducts(take = 4) {
  return productRepository.findNewest(take);
}

export function getPopularProducts(take = 4) {
  return productRepository.findPopular(take);
}
