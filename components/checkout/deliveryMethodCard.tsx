import { Truck } from "lucide-react";

export default function DeliveryMethodCard() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
        <Truck size={20} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">Standard delivery</p>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-success">
            Free
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Arrives in 3–5 business days.
        </p>
      </div>
    </div>
  );
}
