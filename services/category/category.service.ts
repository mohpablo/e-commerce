import { categoryRepository } from "@/repositories/category.repository";

export function getCategories(){
  return categoryRepository.getCategories();
}

export function getCategoriesWithCount(){
  return categoryRepository.findCategoriesWithCount();
}