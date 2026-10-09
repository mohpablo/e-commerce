import { Skeleton } from "@/components/ui/skeleton";

export function ProductsGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div>
      <Skeleton className="mb-6 h-4 w-24" />

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-4/5 w-full rounded-2xl" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
