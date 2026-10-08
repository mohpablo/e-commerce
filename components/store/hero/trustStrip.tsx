import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

const perks = [
  {
    icon: Truck,
    title: "Fast shipping",
    text: "Orders leave within 24 hours",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    text: "Your details stay protected",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    text: "30 days to change your mind",
  },
];

export function TrustStrip() {
  return (
    <div className="mt-10 grid gap-4 rounded-2xl border p-4 sm:grid-cols-3 sm:p-5">
      {perks.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Icon className="size-5" />
          </div>

          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
