import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/fromat";
import { getProductBySlug } from "@/services/product/product.service";
import { ProductGallery } from "@/components/products/productGallery";
import { AddToCartButton } from "@/components/cart/addToCartButton";

function getStockStatus(stock: number) {
  if (stock <= 0) return { label: "Out of stock", tone: "text-destructive" };
  if (stock <= 5)
    return { label: `Only ${stock} left in stock`, tone: "text-amber-600" };
  return { label: "In stock", tone: "text-emerald-600" };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const soldOut = product.stock <= 0;
  const stockStatus = getStockStatus(product.stock);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="size-4" />
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          images={product.images}
          productName={product.name}
          soldOut={soldOut}
        />

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full">
              {product.category.name}
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold tabular-nums">
              {formatPrice(product.price.toNumber())}
            </p>
          </div>

          <p className={`text-sm font-medium ${stockStatus.tone}`}>
            {stockStatus.label}
          </p>

          {product.description && (
            <div className="space-y-2 border-t pt-6">
              <h2 className="text-sm font-medium">Description</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          <AddToCartButton
            productId={product.id}
            productName={product.name}
            soldOut={soldOut}
          />
        </div>
      </div>
    </main>
  );
}
