"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/fromat";
import { CartLine } from "@/services/cart/cart.service";
import { removeCartItemAction, updateCartItemAction } from "@/app/actions/cart.actions";

function getFirstError(errors?: Record<string, string[]>): string | undefined {
  if (!errors) return undefined;
  return Object.values(errors).flat()[0];
}

export function CartItemRow({ item }: { item: CartLine }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const { product } = item;
  const soldOut = product.stock <= 0;

  function changeQuantity(next: number) {
    setMessage(undefined);
    startTransition(async () => {
      const res = await updateCartItemAction({
        cartItemId: item.id,
        quantity: next,
      });
      if (res.errors) {
        setMessage(getFirstError(res.errors));
      } else if (res.message) {
        setMessage(res.message);
      }
    });
  }

  function remove() {
    setMessage(undefined);
    startTransition(async () => {
      const res = await removeCartItemAction({ cartItemId: item.id });
      if (res.errors) {
        setMessage(getFirstError(res.errors));
      }
    });
  }

  return (
    <li className={`flex gap-4 py-6 ${pending ? "opacity-60" : ""}`}>
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-28"
      >
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt ?? product.name}
            fill
            sizes="112px"
            className={`object-cover ${soldOut ? "grayscale" : ""}`}
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/products/${product.slug}`}
              className="font-medium tracking-tight hover:underline"
            >
              {product.name}
            </Link>
            <p className="text-sm text-muted-foreground tabular-nums">
              {formatPrice(product.price)}
            </p>
          </div>
          <p className="font-semibold tabular-nums">
            {formatPrice(item.lineTotal)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 rounded-full"
              disabled={pending || item.quantity <= 1}
              onClick={() => changeQuantity(item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </Button>
            <span
              className="w-6 text-center text-sm tabular-nums"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 rounded-full"
              disabled={pending || soldOut || item.quantity >= product.stock}
              onClick={() => changeQuantity(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            disabled={pending}
            onClick={remove}
          >
            <Trash2 className="size-4" />
            Remove
          </Button>
        </div>

        {soldOut ? (
          <p className="text-sm text-destructive">
            Sold out. Remove it to continue.
          </p>
        ) : item.quantity >= product.stock ? (
          <p className="text-sm text-amber-600">Max available in your cart.</p>
        ) : null}
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </li>
  );
}