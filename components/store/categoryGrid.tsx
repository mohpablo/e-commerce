import Link from "next/link";
import {
  Dumbbell,
  Footprints,
  Home as HomeIcon,
  Laptop,
  Package,
  Shirt,
  ShoppingBag,
  Watch,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "./sectionHeading";
import { CategoryWithCount } from "@/types/category.type";

const categoryIcons: Record<string, LucideIcon> = {
  electronics: Laptop,
  clothing: Shirt,
  footwear: Footprints,
  "home-living": HomeIcon,
  accessories: Watch,
  "sports-fitness": Dumbbell,
  bags: ShoppingBag,
};

type Props = {
  categories: CategoryWithCount[];
};

export function CategoryGrid({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Shop by category" href="/products" />

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] ?? Package;
          const count = category._count.products;

          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="category-card group relative flex min-h-40 flex-col justify-between gap-7 rounded-2xl p-4 outline-none sm:min-h-44 sm:p-5"
            >
              {/* Glass reflection */}
              <span
                aria-hidden="true"
                className="category-card__reflection"
              />

              {/* Icon */}
              <div className="relative z-[1] flex items-start justify-between">
                <div className="category-card__icon grid size-11 place-items-center rounded-xl">
                  <Icon
                    strokeWidth={1.7}
                    className="size-[22px] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                  />
                </div>

                <ArrowUpRight
                  aria-hidden="true"
                  className="category-card__arrow size-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </div>

              {/* Category info */}
              <div className="relative z-[1] min-w-0">
                <h3 className="category-card__title truncate text-sm font-semibold tracking-tight sm:text-[15px]">
                  {category.name}
                </h3>

                <p className="category-card__count mt-1.5 text-xs">
                  {count} {count === 1 ? "product" : "products"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}