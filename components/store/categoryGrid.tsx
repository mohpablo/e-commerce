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
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading title="Shop by category" href="/categories" />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] ?? Package;
          const count = category._count.products;
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group flex flex-col justify-between gap-8 rounded-2xl border p-4 transition-colors hover:bg-muted/60"
            >
              <Icon className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" />
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">
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
