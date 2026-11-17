"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Tilt from "@/components/originkit/ui/tilt";

type ProductImage = {
  url: string;
  alt: string | null;
};

type Props = {
  primary: ProductImage;
  secondary?: ProductImage;
  productName: string;
  soldOut: boolean;
};

const imageSizes =
  "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw";

export function ProductCardVisual({
  primary,
  secondary,
  productName,
  soldOut,
}: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;

    const pointerMotion = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const updatePointerMode = () => setCanTilt(pointerMotion.matches);
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setDimensions((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );
    };

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    observer?.observe(element);
    if (!observer) window.addEventListener("resize", measure);

    pointerMotion.addEventListener("change", updatePointerMode);
    updatePointerMode();
    measure();

    return () => {
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", measure);
      pointerMotion.removeEventListener("change", updatePointerMode);
    };
  }, []);

  const scale =
    dimensions.width > 0 && dimensions.height > 0
      ? Math.min(
          100,
          (dimensions.width / 320) * 100,
          (dimensions.height / 400) * 100,
        )
      : 100;

  const images = (
    <>
      <Image
        src={primary.url}
        alt={primary.alt ?? productName}
        fill
        sizes={imageSizes}
        className={`object-cover transition-[opacity,transform] duration-700 ease-out group-hover/product-media:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none ${
          secondary ? "group-hover/product-media:opacity-0" : ""
        } ${soldOut ? "grayscale" : ""}`}
      />
      {secondary && (
        <Image
          src={secondary.url}
          alt=""
          aria-hidden="true"
          fill
          sizes={imageSizes}
          className={`object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover/product-media:scale-[1.03] group-hover/product-media:opacity-100 motion-reduce:transform-none motion-reduce:transition-none ${
            soldOut ? "grayscale" : ""
          }`}
        />
      )}
    </>
  );

  return (
    <div ref={frame} className="absolute inset-0">
      {canTilt && dimensions.width > 0 && dimensions.height > 0 ? (
        <Tilt
          image=""
          offsetY={0}
          alt={primary.alt ?? productName}
          cardWidth={320}
          cardHeight={400}
          scale={scale}
          tilt={7}
          corner={22}
          shade={55}
          background="transparent"
          style={{ width: "100%", height: "100%" }}
        >
          {images}
        </Tilt>
      ) : (
        images
      )}
    </div>
  );
}
