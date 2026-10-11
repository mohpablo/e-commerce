import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/fromat";

import { getCart } from "@/services/cart/cart.service";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CartItemRow } from "@/components/cart/cartItem";


export default async function CartPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/login?callbackUrl=${encodeURIComponent("/")}`);
  const user = session.user;
  const cart = await getCart(user.id);

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button className="rounded-full">
          <Link href="/products">Browse products</Link>
        </Button>
      </main>
    );
  }

  const hasUnavailable = cart.items.some((i) => i.product.stock <= 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">
        Your cart{" "}
        <span className="text-lg font-normal text-muted-foreground">
          ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y border-y">
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>

        <aside className="h-fit space-y-4 rounded-2xl border p-6 lg:sticky lg:top-24">
          <h2 className="font-medium">Order summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold tabular-nums">
              {formatPrice(cart.subtotal)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Shipping is calculated at checkout.
          </p>

          {hasUnavailable ? (
            <Button className="h-12 w-full rounded-full" disabled>
              Remove sold-out items to checkout
            </Button>
          ) : (
            <Button className="h-12 w-full rounded-full">
              <Link href="/checkout">Checkout</Link>
            </Button>
          )}
        </aside>
      </div>
    </main>
  );
}
