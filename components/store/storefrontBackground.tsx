"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Snowfall from "@/components/originkit/ui/snow-fall";

export function StorefrontBackground() {
  const { resolvedTheme } = useTheme();
  const [animationAllowed, setAnimationAllowed] = useState(false);
  const dark = resolvedTheme === "dark";

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setAnimationAllowed(!preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      {animationAllowed && (
        <Snowfall
          count={150}
          speedMin={0.45}
          speedMax={1.1}
          wind={0.05}
          windVariation={0.4}
          sizeMin={1.5}
          sizeMax={3}
          opacityMin={25}
          opacityMax={70}
          color={dark ? "#f8fbff" : "#7184c3"}
        />
      )}
    </div>
  );
}
