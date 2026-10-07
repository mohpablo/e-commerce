import { categoryRepository } from "@/repositories/category.repository";
import { productRepository } from "@/repositories/product.repository";
import { NavCategory } from "../category/category.service";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: NavCategory;
  images: { id: string; url: string; alt: string | null }[];
};

function toCardData(product: {
  id: string;
  name: string;
  slug: string;
  price: { toNumber(): number };
  stock: number;
  category: NavCategory;
  images: { id: string; url: string; alt: string | null }[];
}): ProductCardData {
  return { ...product, price: product.price.toNumber() };
}

export async function getHomeData() {
  const [categories, newest, popular] = await Promise.all([
    categoryRepository.findCategoriesWithCount(),
    productRepository.findNewest(4),
    productRepository.findPopular(4),
  ]);

  return {
    categories,
    newest: newest.map(toCardData),
    popular: popular.map(toCardData),
  };
}

export type HomeCategory = Awaited<
  ReturnType<typeof getHomeData>
>["categories"][number];
