import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "../../lib/fromat";
import { ProductCardData } from "@/types/product.type";

type Props = {
  product: ProductCardData;
};

export function ProductCard({ product }: Props) {
  const [primary, secondary] = product.images;
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden rounded-2xl bg-muted"
      >
        {primary ? (
          <>
            <Image
              src={primary.url}
              alt={primary.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${
                secondary ? "group-hover:opacity-0" : ""
              } ${soldOut ? "grayscale" : ""}`}
            />
            {secondary && (
              <Image
                src={secondary.url}
                alt={secondary.alt ?? product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}

        {(soldOut || lowStock) && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-full bg-background/90"
          >
            {soldOut ? "Sold out" : `Only ${product.stock} left`}
          </Badge>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1 px-1">
        <Link
          href={`/categories/${product.category.slug}`}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {product.category.name}
        </Link>

        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-medium tracking-tight">
            {product.name}
          </h3>
        </Link>


        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold tabular-nums sm:text-base">
            {formatPrice(product.price.toNumber())}
          </span>

          <form>
            <input type="hidden" name="productId" value={product.id} />
            <Button
              type="submit"
              size="sm"
              className="h-8 rounded-full px-2.5 sm:h-9 sm:px-3"
              disabled={soldOut}
              aria-label={soldOut ? "Sold out" : `Add ${product.name} to cart`}
            >
              <Plus className="size-4 shrink-0" />
              <span className="hidden sm:inline">
                {soldOut ? "Sold out" : "Add"}
              </span>
            </Button>
          </form>
        </div>
      </div>
    </article>
  );
}
