import { Suspense } from "react";

import { ProductsGridSkeleton } from "@/components/products/productsGridSkeleton";
import { ProductsResults } from "@/components/products/productsResults";
import { SearchForm } from "@/components/common/searchForm";

type SearchParams = Promise<{
  page?: string;
  q?: string;
}>;

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/categories/[slug]"> & {
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { page: pageParam, q = "" } = await searchParams;

  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const categoryTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page Header */}
        <header className="mb-8 space-y-3 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium tracking-wide text-primary">
            CATEGORY COLLECTION
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {categoryTitle} Products
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explore our {categoryTitle.toLowerCase()} collection and find
              exactly what you are looking for.
            </p>
          </div>
        </header>

        {/* Search Section */}
        <section className="mb-10">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:px-6 sm:py-5">
            <div className="min-w-0 space-y-1">
              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Looking for something specific?
              </h2>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Click the search icon to explore this collection.
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-end">
              <Suspense
                fallback={
                  <div className="size-12 animate-pulse rounded-full bg-muted" />
                }
              >
                <SearchForm className="w-full min-w-0" />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Category Results */}
        <section
          aria-label={`${categoryTitle} product results`}
          className="min-w-0"
        >
          <Suspense
            key={`${slug}-${page}-${q}`}
            fallback={<ProductsGridSkeleton />}
          >
            <ProductsResults page={page} q={q} category={slug} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
