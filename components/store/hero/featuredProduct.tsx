import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/fromat";
import { ProductCardData } from "@/types/product.type";

type Props = {
  product: ProductCardData;
};

export function FeaturedProduct({ product }: Props) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative col-span-2 aspect-16/10 overflow-hidden rounded-3xl bg-muted sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:min-h-105"
    >
      {image && (
        <Image
          src={image.url}
          alt={image.alt ?? product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 30vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-background/90 p-4 backdrop-blur">
        <p className="text-xs text-muted-foreground">Just in</p>

        <div className="mt-0.5 flex items-center justify-between gap-3">
          <p className="line-clamp-1 font-medium">{product.name}</p>

          <span className="text-sm font-semibold tabular-nums">
            {formatPrice(product.price.toNumber())}
          </span>
        </div>
      </div>
    </Link>
  );
}
