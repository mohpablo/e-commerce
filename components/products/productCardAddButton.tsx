"use client";

import { useActionState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";

import { addToCartAction, CartActionState } from "@/app/actions/cart.actions";
import ArrowRevealButton from "@/components/originkit/ui/arrow-reveal-button";

type Props = {
  productId: string;
  productName: string;
  soldOut: boolean;
};

const initialState: CartActionState = {};

function getFirstError(errors?: Record<string, string[]>): string | undefined {
  if (!errors) return undefined;
  return Object.values(errors).flat()[0];
}

export function ProductAddToCartButton({
  productId,
  productName,
  soldOut,
}: Props) {
  const [state, formAction, pending] = useActionState(
    addToCartAction,
    initialState,
  );

  const errorMessage = getFirstError(state.errors);
  const isError = Boolean(state.errors);
  const displayMessage = errorMessage || state.message;

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={1} />

      <ArrowRevealButton
        type="submit"
        className="h-10 w-full rounded-xl text-sm font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        style={{ width: "100%" }}
        padding="8px 12px"
        rounded={100}
        colors={{
          fill: "var(--primary)",
          textColor: "var(--primary-foreground)",
          hoverFill: "var(--accent)",
          hoverTextColor: "var(--accent-foreground)",
        }}
        border={{ borderColor: "transparent", borderWidth: 0, borderStyle: "solid" }}
        icon={{
          side: "right",
          type: "icon",
          size: 16,
          badgeSize: 32,
          padding: 8,
          rounded: 100,
          background: "var(--accent)",
          color: "var(--accent-foreground)",
        }}
        iconNode={
          pending ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <ShoppingCart className="size-4" />
          )
        }
        disabled={soldOut || pending}
        aria-label={soldOut ? "Sold out" : `Add ${productName} to cart`}
        aria-busy={pending}
        label={soldOut ? "Sold out" : pending ? "Adding..." : "Add to cart"}
        gap={8}
        font={{
          fontFamily: "var(--font-geist-sans), ui-sans-serif, sans-serif",
          fontWeight: 600,
          fontSize: 13,
          lineHeight: "1",
        }}
      />

      {displayMessage && (
        <p
          role="status"
          className={`text-sm ${
            isError ? "text-destructive" : "text-emerald-600"
          }`}
        >
          {displayMessage}
        </p>
      )}
    </form>
  );
}
