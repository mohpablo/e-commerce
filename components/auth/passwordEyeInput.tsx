"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { gsap } from "gsap";
import { Input } from "@/components/ui/input";

type PasswordEyeInputProps = Omit<ComponentProps<typeof Input>, "type">;

const UPPER_D = "M1 12C1 12 5 4 12 4C19 4 23 12 23 12";
const LOWER_D = "M1 12C1 12 5 20 12 20C19 20 23 12 23 12";

export function PasswordEyeInput({
  id,
  name,
  disabled,
  ...props
}: PasswordEyeInputProps) {
  const [visible, setVisible] = useState(true);

  const eyeRef = useRef<SVGGElement>(null);
  const upperRef = useRef<SVGPathElement>(null);
  const pupilRef = useRef<SVGGElement>(null);

  const visibleRef = useRef(true);
  const aliveRef = useRef(true);
  const blinkDelayRef = useRef<gsap.core.Tween | null>(null);
  const resetDelayRef = useRef<gsap.core.Tween | null>(null);
  const animRef = useRef<gsap.core.Timeline | null>(null);
  const xToRef = useRef<((v: number) => void) | null>(null);
  const yToRef = useRef<((v: number) => void) | null>(null);

  const scheduleBlink = () => {
    const upper = upperRef.current;
    const pupil = pupilRef.current;
    if (!aliveRef.current || !visibleRef.current || !upper || !pupil) return;

    blinkDelayRef.current?.kill();
    blinkDelayRef.current = gsap.delayedCall(gsap.utils.random(2, 6), () => {
      if (!aliveRef.current || !visibleRef.current) return;

      animRef.current?.kill();
      animRef.current = gsap
        .timeline({ onComplete: scheduleBlink })
        .to(upper, { attr: { d: LOWER_D }, duration: 0.08, ease: "power1.in" }, 0)
        .to(pupil, { scaleY: 0, opacity: 0, duration: 0.08, ease: "power1.in" }, 0)
        .to(upper, { attr: { d: UPPER_D }, duration: 0.1, ease: "power1.out" })
        .to(pupil, { scaleY: 1, opacity: 1, duration: 0.1, ease: "power1.out" }, "<");
    });
  };

  useEffect(() => {
    const eye = eyeRef.current;
    const pupil = pupilRef.current;
    if (!eye || !pupil) return;

    aliveRef.current = true;

    // Scale around the eye center (SVG user-space coordinates)
    gsap.set(pupil, { svgOrigin: "12 12" });

    xToRef.current = gsap.quickTo(pupil, "x", { duration: 0.2, ease: "power2.out" });
    yToRef.current = gsap.quickTo(pupil, "y", { duration: 0.2, ease: "power2.out" });

    scheduleBlink();

    const handlePointerMove = (event: PointerEvent) => {
      resetDelayRef.current?.kill();

      if (!visibleRef.current) {
        xToRef.current?.(0);
        yToRef.current?.(0);
        return;
      }

      const bounds = eye.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      xToRef.current?.(gsap.utils.clamp(-3, 3, (event.clientX - centerX) * 0.12));
      yToRef.current?.(gsap.utils.clamp(-2, 2, (event.clientY - centerY) * 0.12));

      resetDelayRef.current = gsap.delayedCall(2, () => {
        xToRef.current?.(0);
        yToRef.current?.(0);
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      aliveRef.current = false;
      window.removeEventListener("pointermove", handlePointerMove);
      blinkDelayRef.current?.kill();
      resetDelayRef.current?.kill();
      animRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleVisibility = () => {
    if (disabled) return;

    const nextVisible = !visible;
    visibleRef.current = nextVisible;
    setVisible(nextVisible);

    const upper = upperRef.current;
    const pupil = pupilRef.current;
    if (!upper || !pupil) return;

    blinkDelayRef.current?.kill();
    resetDelayRef.current?.kill();
    animRef.current?.kill();

    if (nextVisible) {
      // Open: lid goes back up, pupil grows back in, then resume blinking
      animRef.current = gsap
        .timeline({ onComplete: scheduleBlink })
        .to(upper, { attr: { d: UPPER_D }, duration: 0.22, ease: "power2.out" }, 0)
        .to(pupil, { scaleY: 1, opacity: 1, duration: 0.22, ease: "power2.out" }, 0.04);
    } else {
      // Close: pupil recenters and fades, upper lid meets the lower lid
      xToRef.current?.(0);
      yToRef.current?.(0);
      animRef.current = gsap
        .timeline()
        .to(pupil, { scaleY: 0, opacity: 0, duration: 0.12, ease: "power2.in" }, 0)
        .to(upper, { attr: { d: LOWER_D }, duration: 0.18, ease: "power2.inOut" }, 0);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        {...props}
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={`pr-12 ${props.className ?? ""}`}
      />

      <button
        type="button"
        onClick={toggleVisibility}
        disabled={disabled}
        title={visible ? "Hide password" : "Show password"}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={id}
        aria-pressed={visible}
        className="absolute right-1 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-6 text-blue-500"
          aria-hidden="true"
        >
          <g ref={eyeRef}>
            <path
              ref={upperRef}
              d={UPPER_D}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={LOWER_D}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g ref={pupilRef}>
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <circle cx="13" cy="11" r="1" fill="var(--background)" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}