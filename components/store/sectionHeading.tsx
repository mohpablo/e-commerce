import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string;
  href: string;
  cta?: string;
};

export function SectionHeading({
  title,
  description,
  href,
  cta = "View all",
}: Props) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        className="shrink-0 rounded-full"
        render={<Link href={href} />}
        nativeButton={false}
      >
        {cta}
        <ArrowRight />
      </Button>
    </div>
  );
}
