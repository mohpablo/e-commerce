import { CheckCircle2, LockKeyhole, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/fromat";

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

interface Cart {
  itemCount: number;
  items: OrderItem[];
}

interface OrderSummaryProps {
  cart: Cart;
  subtotal: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  cart,
  subtotal,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm lg:sticky lg:top-8">
      <div className="border-b border-border bg-muted/40 px-5 py-5 sm:px-7">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Cart Items List */}
        <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative flex size-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Package size={28} className="text-muted-foreground" />
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {item.quantity}
                </span>
              </div>

              <div className="flex flex-1 items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 border-t border-border pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-success">Free</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-end justify-between rounded-xl bg-muted p-4">
          <div>
            <span className="font-semibold">Total</span>
            <p className="text-xs text-muted-foreground">EGP</p>
          </div>
          <p className="text-3xl font-bold tracking-tight">
            {formatPrice(total)}
          </p>
        </div>

        {/* Place Order Button (tied to the form via form="checkout-form") */}
        <Button
          type="submit"
          form="checkout-form"
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Place order
          <CheckCircle2 size={18} />
        </Button>

        {/* Secure Checkout */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <LockKeyhole size={14} />
            Secure payment
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Data protected
          </span>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          By placing your order, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </aside>
  );
}
