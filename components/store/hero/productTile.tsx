import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/fromat";
import { ProductCardData } from "@/types/product.type";

type Props = {
  product: ProductCardData;
};

export function ProductTile({ product }: Props) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative aspect-square overflow-hidden rounded-3xl bg-muted sm:aspect-4/3"
    >
      {image && (
        <Image
          src={image.url}
          alt={image.alt ?? product.name}
          fill
          sizes="(max-width: 1024px) 50vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-x-2 bottom-2 rounded-xl bg-background/90 px-3 py-2 backdrop-blur">
        <p className="line-clamp-1 text-sm font-medium">{product.name}</p>

        <p className="text-xs tabular-nums text-muted-foreground">
          {formatPrice(product.price.toNumber())}
        </p>
      </div>
    </Link>
  );
}
