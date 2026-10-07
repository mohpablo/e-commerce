import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Good products. No unnecessary complexity.
          </h2>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/70 sm:text-base">
            Every item is chosen because it works well and lasts. Browse the full collection and
            filter by category.
          </p>
        </div>
        <Button size="lg" variant="secondary" className="w-fit rounded-full" render={<Link href="/products" />} nativeButton={false}>
          Explore the collection
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}