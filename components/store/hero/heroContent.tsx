import { Badge } from "@/components/ui/badge";
import MagneticButton from "@/components/originkit/ui/magnetic-hover-button";
import OrbitBorderButton from "@/components/originkit/ui/orbit-border-button";

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

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <MagneticButton
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          label="Shop all products"
          link="/products"
          newTab={false}
          fill="var(--primary)"
          textColor="var(--primary-foreground)"
          sweepColor="var(--background)"
          sweepTextColor="var(--foreground)"
          magnet={5}
          paddingX={24}
          paddingY={15}
          radius={999}
          border={false}
          font={{
            fontFamily: "var(--font-geist-sans), ui-sans-serif, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "1",
          }}
        />

        <OrbitBorderButton
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          label="Browse categories"
          link="/#categories"
          newTab={false}
          colors={{
            fill: "var(--background)",
            textColor: "var(--foreground)",
            hoverFill: "var(--muted)",
            hoverTextColor: "var(--foreground)",
          }}
          border={{
            borderColor: "var(--border)",
            borderWidth: 1,
            borderStyle: "solid",
          }}
          stroke={{
            color: "var(--primary)",
            size: 12,
            speed: 20,
            direction: "cw",
            hoverFill: 25,
          }}
          hoverScale={102}
          padding="15px 20px"
          rounded={100}
          font={{
            fontFamily: "var(--font-geist-sans), ui-sans-serif, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "1",
          }}
        />
      </div>
    </div>
  );
}
