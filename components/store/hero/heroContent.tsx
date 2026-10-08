import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroContent() {
  return (
    <div className="flex flex-col justify-center lg:col-span-5 lg:pr-8">
      <Badge variant="secondary" className="w-fit rounded-full">
        New season
      </Badge>

      <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
        Better things for everyday life.
      </h1>

      <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
        Tech, clothing, home and more, picked for quality and built to last.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          size="lg"
          className="rounded-full"
          render={<Link href="/products" />}
          nativeButton={false}
        >
          Shop all products
          <ArrowRight />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="rounded-full"
          render={<Link href="/categories" />}
          nativeButton={false}
        >
          Browse categories
        </Button>
      </div>
    </div>
  );
}
