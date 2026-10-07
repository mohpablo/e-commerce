import { cache } from "react";
import { categoryRepository } from "@/repositories/category.repository";

export type NavCategory = { id: string; name: string; slug: string };

export const getNavCategories = cache(async (): Promise<NavCategory[]> => {
  return categoryRepository.findNavCategories();
});
