"use client";

import { useActionState } from "react";
import { Building2, MapPin, Phone, Route } from "lucide-react";
import { Input } from "@/components/ui/input";
import { checkoutAction } from "@/app/actions/checkout.action";

export default function CheckoutForm() {
  const [state, formAction, isPending] = useActionState(checkoutAction, {});

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-4 border-b border-border bg-muted/40 px-5 py-5 sm:px-7">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <MapPin size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            Delivery details
          </h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ll use these to deliver your order.
          </p>
        </div>
      </div>

      <form
        id="checkout-form"
        action={formAction}
        className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7"
      >
        {/* Global/Form-level error message */}
        {state?.errors?._form && (
          <div className="sm:col-span-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            {state.errors._form}
          </div>
        )}

        {/* Phone */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone number
          </label>
          <div className="relative">
            <Phone
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+20 100 000 0000"
              autoComplete="tel"
              disabled={isPending}
              className="h-12 rounded-xl pl-11"
            />
          </div>
          {state?.errors?.phone && (
            <p className="text-xs text-destructive">{state.errors.phone[0]}</p>
          )}
          <p className="text-xs text-muted-foreground">
            The courier will call this number on delivery.
          </p>
        </div>

        {/* City */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <div className="relative">
            <Building2
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="city"
              name="city"
              placeholder="Cairo"
              autoComplete="address-level2"
              disabled={isPending}
              className="h-12 rounded-xl pl-11"
            />
          </div>
          {state?.errors?.city && (
            <p className="text-xs text-destructive">{state.errors.city[0]}</p>
          )}
        </div>

        {/* Street Address */}
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="address" className="text-sm font-medium">
            Street address
          </label>
          <div className="relative">
            <Route
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="address"
              name="address"
              placeholder="Street name, building, apartment"
              autoComplete="address-line1"
              disabled={isPending}
              className="h-12 rounded-xl pl-11"
            />
          </div>
          {state?.errors?.address && (
            <p className="text-xs text-destructive">
              {state.errors.address[0]}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
