import { getProductsPage } from "@/services/product/product.service";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "./productCard";
import { ProductsPagination } from "./productsPagination";
import { redirect } from "next/navigation";

type Props = { page: number; sort?: string; q: string; category?: string };

export async function ProductsResults({ page, sort, q, category }: Props) {
  const { items, total, totalPages } = await getProductsPage({
    page,
    sort,
    q,
    category,
  });

  if (page > totalPages) {
    const params = new URLSearchParams({
      page: String(totalPages),
      ...(sort !== undefined && { sort }),
    });
    if (q) params.set("q", q);
    const pathname = category
      ? `/categories/${encodeURIComponent(category)}`
      : "/products";
    redirect(`${pathname}?${params.toString()}`);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <PackageSearch className="size-10 text-muted-foreground" />
        <h2 className="text-lg font-medium">
          {q ? `No results for "${q}"` : "No products yet"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {q ? "Try a different search term." : "Check back soon."}
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        {total} {total === 1 ? "product" : "products"}
        {q && ` for "${q}"`}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        <ProductsPagination
          page={page}
          totalPages={totalPages}
          sort={sort}
          q={q}
        />
      </div>
    </>
  );
}
