import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "../../lib/fromat";
import { ProductCardData } from "@/services/home/home.service";

const perks = [
  { icon: Truck, title: "Fast shipping", text: "Orders leave within 24 hours" },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Your details stay protected",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    text: "30 days to change your mind",
  },
];

export function Hero({ products }: { products: ProductCardData[] }) {
  // First = large feature, next two = small tiles
  const [main, ...rest] = products;
  const tiles = rest.slice(0, 2);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col justify-center lg:col-span-5 lg:pr-8">
          <Badge variant="secondary" className="w-fit rounded-full">
            New season
          </Badge>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Better things for everyday life.
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            Tech, clothing, home and more, picked for quality and built to last.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full"
              render={<Link href="/products" />}
              nativeButton={false}
            >
              Shop all products
              <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              render={<Link href="/categories" />}
              nativeButton={false}
            >
              Browse categories
            </Button>
          </div>
        </div>

        {main ? (
          <div className="grid grid-cols-2 gap-4 lg:col-span-7">
            <Link
              href={`/products/${main.slug}`}
              className="group relative col-span-2 aspect-[16/10] overflow-hidden rounded-3xl bg-muted sm:col-span-1 sm:row-span-2 sm:aspect-auto sm:min-h-[420px]"
            >
              {main.images[0] && (
                <Image
                  src={main.images[0].url}
                  alt={main.images[0].alt ?? main.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-background/90 p-4 backdrop-blur">
                <p className="text-xs text-muted-foreground">Just in</p>
                <div className="mt-0.5 flex items-center justify-between gap-3">
                  <p className="line-clamp-1 font-medium">{main.name}</p>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatPrice(main.price)}
                  </span>
                </div>
              </div>
            </Link>

            {tiles.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group relative aspect-square overflow-hidden rounded-3xl bg-muted sm:aspect-[4/3]"
              >
                {p.images[0] && (
                  <Image
                    src={p.images[0].url}
                    alt={p.images[0].alt ?? p.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-x-2 bottom-2 rounded-xl bg-background/90 px-3 py-2 backdrop-blur">
                  <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-muted text-sm text-muted-foreground lg:col-span-7">
            Products will appear here once you add them.
          </div>
        )}
      </div>

      {/* Trust strip */}
      <div className="mt-10 grid gap-4 rounded-2xl border p-4 sm:grid-cols-3 sm:p-5">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
