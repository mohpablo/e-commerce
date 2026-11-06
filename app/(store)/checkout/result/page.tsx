
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  ShoppingBag,
  RefreshCcw,
  Headset,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { PaymobRedirectCallbackParams } from "@/types/payment.type";
import { formatPrice } from "@/lib/fromat";

type PageProps = {
  searchParams: Promise<PaymobRedirectCallbackParams>;
};

export default async function ResultPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const status =
    params.success === "true"
      ? "success"
      : params.pending === "true"
        ? "pending"
        : "failed";

  const config = {
    success: {
      icon: CheckCircle2,
      title: "Payment Successful!",
      description:
        "Your payment has been completed successfully. Thank you for your purchase!",
      label: "Payment completed",
      color: "text-green-600",
      bg: "bg-green-500/10",
      badge: "bg-green-500/10 text-green-600",
    },
    pending: {
      icon: Clock3,
      title: "Payment Processing",
      description:
        "Your payment is currently being processed. We'll update your order once it's confirmed.",
      label: "Awaiting confirmation",
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      badge: "bg-amber-500/10 text-amber-600",
    },
    failed: {
      icon: XCircle,
      title: "Payment Failed",
      description:
        "Unfortunately, your payment couldn't be completed. You can try again or contact our support team.",
      label: "Payment unsuccessful",
      color: "text-destructive",
      bg: "bg-destructive/10",
      badge: "bg-destructive/10 text-destructive",
    },
  }[status];

  const StatusIcon = config.icon;

  const amount = Number(params.amount_cents);

  const formattedAmount =
    params.amount_cents &&
    Number.isFinite(amount) &&
    amount >= 0
      ? formatPrice(amount / 100)
      : null;

  const details = [
    ...(formattedAmount
      ? [{ label: "Amount", value: formattedAmount }]
      : []),
    { label: "Transaction ID", value: params.id || "Unavailable" },
    { label: "Order ID", value: params.order || "Unavailable" },
    { label: "Status", value: status },
  ];

  const action =
    status === "failed"
      ? {
          href: "/checkout",
          label: "Try again",
          icon: RefreshCcw,
        }
      : {
          href: "/orders",
          label: "View my orders",
          icon: ArrowRight,
        };

  const ActionIcon = action.icon;

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl overflow-hidden shadow-sm">
        <CardContent className="flex flex-col p-0 md:flex-row">
          {/* Payment Status */}
          <div className="flex flex-col items-center justify-center border-b bg-muted/20 px-6 py-8 text-center md:w-[40%] md:border-r md:border-b-0">
            <div
              className={`mb-4 flex size-16 items-center justify-center rounded-full ${config.bg}`}
            >
              <StatusIcon
                className={`size-9 ${config.color}`}
                strokeWidth={1.7}
              />
            </div>

            <Badge variant="outline" className={config.badge}>
              {config.label}
            </Badge>

            <h1 className="mt-3 text-xl font-bold tracking-tight">
              {config.title}
            </h1>

            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              {config.description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Headset className="size-4" />
              Need help? Contact our support team.
            </div>
          </div>

          {/* Transaction Details */}
          <div className="flex flex-1 flex-col justify-center px-6 py-7 sm:px-8">
            <h2 className="mb-5 text-sm font-semibold">
              Transaction details
            </h2>

            <div className="space-y-4 text-sm">
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-muted-foreground">{label}</span>

                  <span
                    className={`max-w-[60%] truncate font-medium ${
                      label === "Status" ? config.color : ""
                    }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-2.5">
              <Button
                nativeButton={false}
                render={<Link href={action.href} />}
                className="w-full"
              >
                {action.label}
                <ActionIcon className="size-4" />
              </Button>

              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/products" />}
                className="w-full"
              >
                <ShoppingBag className="size-4" />
                Continue shopping
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
