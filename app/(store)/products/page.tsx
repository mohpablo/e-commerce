import { Suspense } from "react";

import { ProductSortSelect } from "@/components/products/productSort";
import { ProductsResults } from "@/components/products/productsResults";
import { ProductsGridSkeleton } from "@/components/products/productsGridSkeleton";
import { SearchForm } from "@/components/common/searchForm";

type SearchParams = Promise<{
  page?: string;
  sort?: string;
  q?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page: pageParam, sort = "newest", q = "" } = await searchParams;

  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page Header */}
        <header className="mb-8 space-y-3 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium tracking-wide text-primary">
            PRODUCT CATALOG
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Explore Products
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Discover our collection and find exactly what you are looking for.
            </p>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="mb-8 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {/* Search */}
            {/* Search */}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold tracking-tight sm:text-base">
                  Find your product
                </h2>

                <p className="hidden text-xs text-muted-foreground sm:block sm:text-sm">
                  Search through our collection.
                </p>
              </div>

              <div className="">
                <Suspense
                  fallback={
                    <div className="size-11 animate-pulse rounded-full bg-muted" />
                  }
                >
                  <SearchForm />
                </Suspense>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border/70 sm:h-10 sm:w-px" />

            {/* Sorting */}
            <div className="flex min-w-0 items-center gap-3 sm:w-[240px] sm:shrink-0">
              <span className="shrink-0 text-sm font-medium text-muted-foreground">
                Sort by
              </span>

              <div className="min-w-0 flex-1">
                <Suspense
                  fallback={
                    <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
                  }
                >
                  <ProductSortSelect value={sort} className="w-full" />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <section aria-label="Product results" className="min-w-0">
          <Suspense
            key={`${page}-${sort}-${q}`}
            fallback={<ProductsGridSkeleton />}
          >
            <ProductsResults page={page} sort={sort} q={q} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
