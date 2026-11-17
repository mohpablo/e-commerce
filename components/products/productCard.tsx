import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import { formatPrice } from "../../lib/fromat";
import { ProductCardData } from "@/types/product.type";
import { ProductAddToCartButton } from "./productCardAddButton";
import { ProductCardVisual } from "./productCardVisual";

type Props = {
  product: ProductCardData;
};

export function ProductCard({ product }: Props) {
  const [primary, secondary] = product.images;
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group/card flex min-w-0 flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="group/product-media relative block aspect-4/5 overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {primary ? (
          <ProductCardVisual
            primary={primary}
            secondary={secondary}
            productName={product.name}
            soldOut={soldOut}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted via-card to-accent/70 text-sm text-muted-foreground">
            No image
          </div>
        )}

        {(soldOut || lowStock) && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 z-10 rounded-full border border-border/60 bg-background/90 shadow-sm backdrop-blur"
          >
            {soldOut ? "Sold out" : `Only ${product.stock} left`}
          </Badge>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1 rounded-2xl border border-border/60 bg-card/70 p-3 transition-colors duration-300 group-hover/card:bg-card/90">
        <Link
          href={`/categories/${product.category.slug}`}
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
        >
          {product.category.name}
        </Link>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold tracking-tight sm:text-[15px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <span className="truncate text-sm font-bold tabular-nums text-foreground sm:text-base">
            {formatPrice(product.price.toNumber())}
          </span>

          <ProductAddToCartButton
            productId={product.id}
            productName={product.name}
            soldOut={soldOut}
          />
        </div>
      </div>
    </article>
  );
}
