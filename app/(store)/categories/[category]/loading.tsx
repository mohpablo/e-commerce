import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProductsGridSkeleton } from "@/components/products/productsGridSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-10">
      <Skeleton className="h-9 w-50" />

      <Separator className="my-6" />

      <ProductsGridSkeleton />
    </main>
  );
}
