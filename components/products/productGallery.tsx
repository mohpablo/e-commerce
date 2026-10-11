"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = { id: string; url: string; alt: string | null };

type Props = {
  images: GalleryImage[];
  productName: string;
  soldOut?: boolean;
};

export function ProductGallery({ images, productName, soldOut }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) {
    return (
      <div className="flex aspect-4/5 items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted">
        <Image
          key={active.id}
          src={active.url}
          alt={active.alt ?? productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover ${soldOut ? "grayscale" : ""}`}
        />
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === activeIndex}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg bg-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  index === activeIndex
                    ? "ring-2 ring-foreground ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt ?? `${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
