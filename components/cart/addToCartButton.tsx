"use client";

import { useActionState } from "react";
import { ShoppingCart } from "lucide-react";

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

export function AddToCartButton({ productId, productName, soldOut }: Props) {
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
        size="lg"
        className="h-12 w-full rounded-full text-base"
        disabled={soldOut || pending}
        aria-label={soldOut ? "Sold out" : `Add ${productName} to cart`}
      >
        <ShoppingCart className="size-5" />
        {soldOut ? "Sold out" : pending ? "Adding..." : "Add to Cart"}
      </Button>

      {displayMessage && (
        <p
          role="status"
          className={`text-center text-sm ${
            isError ? "text-destructive" : "text-emerald-600"
          }`}
        >
          {displayMessage}
        </p>
      )}
    </form>
  );
}
