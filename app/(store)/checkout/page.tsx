import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCart } from "@/services/cart/cart.service";
import CheckoutForm from "@/components/checkout/checkoutForm";
import DeliveryMethodCard from "@/components/checkout/deliveryMethodCard";
import OrderSummary from "@/components/checkout/orderSummary";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    redirect(`/login?callbackUrl=${encodeURIComponent("/checkout")}`);
  const user = session.user;

  const cart = await getCart(user.id);
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const subtotal = cart.subtotal;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <div className="space-y-6">
            <CheckoutForm />
            <DeliveryMethodCard />
          </div>

          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </main>
  );
}
