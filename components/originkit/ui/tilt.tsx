/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

// Delivered by Originkit · stack: framer
// Paste into a Framer code component. Property controls included.
import * as React from "react"
import { useEffect, useRef, useState } from "react"
/**
 * Tilt: a picture card that gives under the pointer. It sinks, it does not
 * lift: the point you are over goes away and the far side comes up, the
 * opposite of the usual tilt card. A surface that rises to your finger is
 * being displayed to you; one that gives under it is being touched.
 *
 * The rotation alone reads as a pivot, so the darkest point tracks the pointer
 * (a dent catches shadow at its deepest) and the rim opposite catches light.
 * The shadow tightens rather than grows, because a thing pressed into a
 * surface has less air under it. One pair of sprung numbers, the pointer
 * position as -1..1, is the whole state: the rotation, both gradients and the
 * shadow are all read off it, so they can never disagree.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 560
 * @framerIntrinsicHeight 660
 */

interface TiltProps {
    image: string
    /** Which band of the cover crop shows: -250 bottom edge flush, 0 centred, 250 top edge flush. */
    offsetY: number
    alt: string
    /** Card size in px at Scale 100, exactly as set; never shrunk to the frame. */
    cardWidth: number
    cardHeight: number
    /** Multiplies the card size. */
    scale: number
    tilt: number
    corner: number
    shade: number
    background: string
    style?: React.CSSProperties
    children?: React.ReactNode
}

const PHOTO = "https://images.unsplash.com/photo-1639427203692-a69f54ce8284?auto=format&fit=crop&w=780&h=960&q=80"

// The original layout card: depth, sink, radius and shadow were tuned at this
// height, so they scale with the card's actual height to keep its shape.
const H = 320
/* How deep the room is: about two and a half card heights back, far enough
   that foreshortening is a suggestion, close enough that corners differ. */
const DEPTH = 800
/* How far the card retreats while touched. Past about twenty a press becomes a zoom. */
const SINK = 14

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const mix = (a: number, b: number, t: number) => a + (b - a) * t

/* ---- Spring --------------------------------------------------------------
 * 0..100 into stiffness and per-frame decay, chosen by damping ratio. Frames,
 * not milliseconds: damping is raised to dt, so a dropped frame decays the
 * same energy as the frames it replaced. The loop parks once settled. */
const springOf = (tune: number) => ({ k: 0.08 + (tune / 100) * 0.16, d: 0.62 + (tune / 100) * 0.2 })

function useSpring(target: number, tune = 50, instant = false) {
    const [at, setAt] = useState(target)
    const cur = useRef(target)
    const vel = useRef(0)
    const raf = useRef(0)

    useEffect(() => {
        if (instant) {
            cur.current = target
            vel.current = 0
            setAt(target)
            return
        }
        const { k, d } = springOf(tune)
        let prev = 0
        const tick = (t: number) => {
            const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1
            prev = t
            vel.current += (target - cur.current) * k * dt
            vel.current *= Math.pow(d, dt)
            cur.current += vel.current * dt
            if (Math.abs(target - cur.current) < 0.002 && Math.abs(vel.current) < 0.002) {
                cur.current = target
                vel.current = 0
                setAt(target)
                raf.current = 0
                return
            }
            setAt(cur.current)
            raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(raf.current)
            raf.current = 0
        }
    }, [target, tune, instant])

    return at
}

export default function Tilt(props: TiltProps) {
    const { image, offsetY = 0, alt, cardWidth = 450, cardHeight = 550, scale = 78, tilt, corner, shade, background, style, children } = props

    const root = useRef<HTMLDivElement | null>(null)
    const skin = useRef<HTMLDivElement | null>(null)
    const [at, setAt] = useState({ x: 0, y: 0 })
    const [on, setOn] = useState(false)
    const [still, setStill] = useState(false)

    useEffect(() => {
        setStill(!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    }, [])

    /* The spring is on the position, not the rotation, so the gradients and
       the transform are three readings of one number. The lag is what gives
       the card mass; the settle on the way out is what makes leaving feel
       like anything. */
    const sx = useSpring(on ? at.x : 0, 50, still)
    const sy = useSpring(on ? at.y : 0, 50, still)
    // How much of any of this applies, so the shadow and sheen fade rather than cut.
    const lit = useSpring(on ? 1 : 0, 50, still)

    // Positive rotateX sends the top back, positive rotateY the right: the negation of the usual pair.
    const max = still ? 0 : clamp(tilt, 0, 20)
    const rx = -sy * max
    const ry = sx * max

    /* A flat card tipped toward a light shades as a flat ramp, not a spot: one
       linear gradient from the sunk side (darker) to the risen side (lighter),
       soft-light blended so it shifts the photo's own tones instead of laying a
       milky white haze over it. The old pair of radial blobs read as a glow. */
    const lean = Math.min(1, Math.hypot(sx, sy))
    const ang = (Math.atan2(-sx, sy) * 180) / Math.PI
    const amt = (clamp(shade, 0, 100) / 100) * lean * lit
    const dark = 0.6 * amt
    const rim = 0.45 * amt

    const track = (e: React.PointerEvent) => {
        const el = skin.current
        if (!el) return
        /* Measured from the frame, which never moves. Asking the rotating card
           where it is would, near the edges, ask a thing that has already
           turned away from the pointer. */
        const r = el.getBoundingClientRect()
        setAt({
            x: clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1),
            y: clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1),
        })
        setOn(true)
    }

    /* Card Width/Height exactly as set, times Scale. They used to be shrunk to fit
       the frame, which capped the height at the frame's and made a taller card
       come out narrower; now each one does only what it says. */
    const grow = clamp(scale ?? 100, 10, 200) / 100
    const card = { w: Math.max(20, cardWidth || 450) * grow, h: Math.max(20, cardHeight || 550) * grow }
    const k = card.h / H
    /* The card is laid out at the size it is shown, every length times k, rather than laid out
       at 260 × 320 and scaled by a transform: a scaled-up box is drawn at its small size and
       magnified, which softened the photo (in the builder the fit alone is ×1.7) and would have
       blurred it further at any Scale above 100. Perspective, depth, radius and shadow scale
       with it, so at Scale 100 the card is the same shape it always was, only sharp. */

    return (
        // A card bigger than its frame is let past the edge rather than cut off.
        <div ref={root} style={{ position: "relative", width: "100%", height: "100%", ...style, overflow: "visible", background }}>
            <div
                ref={skin}
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: card.w,
                    height: card.h,
                    marginLeft: -card.w / 2,
                    marginTop: -card.h / 2,
                    perspective: DEPTH * k,
                    touchAction: "none",
                }}
                // Pointer, not mouse: a finger dragged across the card gets the effect too.
                onPointerMove={track}
                onPointerDown={track}
                /* `out` with a containment test rather than `leave`: the same rule,
                   written out, so a scripted pointer walking off with no
                   relatedTarget still releases the card. Null counts as outside. */
                onPointerOut={(e) => {
                    const el = skin.current
                    const to = e.relatedTarget as Node | null
                    if (!el || !to || !el.contains(to)) setOn(false)
                }}
                // A touch taken over by a scroll never reports leaving.
                onPointerCancel={() => setOn(false)}
            >
                <div
                    role={children ? undefined : "img"}
                    aria-label={children ? undefined : alt}
                    style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                        borderRadius: clamp(corner, 0, 40) * k,
                        backgroundColor: "#d9d4ca",
                        // Quoted: an unquoted url() silently drops any address with a space, quote or bracket in it.
                        backgroundImage: image ? `url(${JSON.stringify(image)})` : undefined,
                        backgroundSize: "cover",
                        // A share of the crop overflow, not pixels, so every step moves the picture
                        // whatever its proportions; 0 is the centred crop.
                        backgroundPosition: `50% ${50 - (clamp(Number(offsetY) || 0, -250, 250) / 250) * 50}%`,
                        // translateZ first, so the retreat is in the room's axes, not the turned card's.
                        transform: `translateZ(${(-SINK * k * lit).toFixed(2)}px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`,
                        boxShadow: `0 ${(mix(20, 9, lit) * k).toFixed(2)}px ${(mix(44, 24, lit) * k).toFixed(2)}px ${(-8 * k).toFixed(2)}px rgba(15, 23, 42, ${mix(0.22, 0.15, lit).toFixed(3)})`,
                        // No will-change: it freezes the card's bitmap at the scale it was first drawn,
                        // which left it soft under a scaled preview and drew it differently run to run.
                    }}
                >
                    {children}
                    {/* Sunk side darker, risen side lighter, along the line through the pointer. */}
                    <span
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "inherit",
                            pointerEvents: "none",
                            mixBlendMode: "soft-light",
                            backgroundImage: `linear-gradient(${ang.toFixed(2)}deg, rgba(0, 0, 0, ${dark.toFixed(3)}) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, ${rim.toFixed(3)}) 100%)`,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

Tilt.defaultProps = {
    image: PHOTO,
    offsetY: 0,
    alt: "A woman in a yellow beanie crouching with a film camera",
    cardWidth: 450,
    cardHeight: 550,
    scale: 100,
    tilt: 10,
    corner: 20,
    shade: 60,
    background: "transparent",
}

// Control order arranged in the builder.
