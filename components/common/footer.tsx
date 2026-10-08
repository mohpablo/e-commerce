import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { Category } from "@/types/category.type";


type Props = {
  categories: Category[];
};

export function Footer({ categories }: Props) {
  const link =
    "text-sm text-muted-foreground transition-colors hover:text-foreground";

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              store.
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Thoughtfully selected products for everyday life.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Shop</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/products" className={link}>
                All products
              </Link>
              <Link href="/products?sort=newest" className={link}>
                New arrivals
              </Link>
              <Link href="/categories" className={link}>
                All categories
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Categories</h3>
            <div className="mt-4 flex flex-col gap-3">
              {categories.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className={link}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/sign-in" className={link}>
                Sign in
              </Link>
              <Link href="/sign-up" className={link}>
                Create account
              </Link>
              <Link href="/orders" className={link}>
                Your orders
              </Link>
              <Link href="/cart" className={link}>
                Cart
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} store. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
