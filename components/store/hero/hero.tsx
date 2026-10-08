import { HeroContent } from "./heroContent";
import { FeaturedProduct } from "./featuredProduct";
import { ProductTile } from "./productTile";
import { TrustStrip } from "./trustStrip";
import { ProductCardData } from "@/types/product.type";

type Props = {
  products: ProductCardData[];
};

export function Hero({ products }: Props) {
  const [main, ...rest] = products;
  const tiles = rest.slice(0, 2);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
        <HeroContent />

        {main ? (
          <div className="grid grid-cols-2 gap-4 lg:col-span-7">
            <FeaturedProduct product={main} />

            {tiles.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-80 items-center justify-center rounded-3xl bg-muted text-sm text-muted-foreground lg:col-span-7">
            Products will appear here once you add them.
          </div>
        )}
      </div>

      <TrustStrip />
    </section>
  );
}
