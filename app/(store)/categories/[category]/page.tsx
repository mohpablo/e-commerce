import { ProductsGridSkeleton } from "@/components/products/productsGridSkeleton";
import { ProductsResults } from "@/components/products/productsResults";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

type SearchParams = Promise<{ page?: string; q?: string }>;

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/categories/[category]"> & { searchParams: SearchParams }) {
  const { category } = await params;
  const { page: pageParam, q = "" } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {category} products
      </h1>

      <Separator className="my-6" />

      <Suspense key={`${page}-${q}`} fallback={<ProductsGridSkeleton />}>
        <ProductsResults page={page} q={q} category={category} />
      </Suspense>
    </main>
  );
}
