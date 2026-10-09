import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { ProductSortSelect } from "@/components/products/productSort";
import { ProductsResults } from "@/components/products/productsResults";
import { ProductsGridSkeleton } from "@/components/products/productsGridSkeleton";

type SearchParams = Promise<{ page?: string; sort?: string; q?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam, sort = "newest", q = "" } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">All products</h1>

        <Suspense fallback={null}>
          <ProductSortSelect value={sort} />
        </Suspense>
      </div>

      <Separator className="my-6" />

      <Suspense
        key={`${page}-${sort}-${q}`}
        fallback={<ProductsGridSkeleton />}
      >
        <ProductsResults page={page} sort={sort} q={q} />
      </Suspense>
    </main>
  );
}
