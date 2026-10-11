"use client";

import { useActionState } from "react";
import { Loader2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { addToCartAction, CartActionState } from "@/app/actions/cart.actions";

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
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={1} />

      <Button
        type="submit"
        size="sm"
        className="rounded-full px-4"
        disabled={soldOut || pending}
        aria-label={soldOut ? "Sold out" : `Add ${productName} to cart`}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ShoppingCart className="size-4" />
        )}
        {soldOut ? "Sold out" : "Add to Cart"}
      </Button>

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
