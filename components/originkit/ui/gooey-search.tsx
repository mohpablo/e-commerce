/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client"

// Delivered by Originkit · stack: framer
// Paste into a Framer code component. Property controls included.
import * as React from "react"
import { useEffect, useRef, useState } from "react"
/**
 * GooeySearch (was Seek): a search button that pulls apart into a button and a
 * field. Tap the circle and it stretches like a drop of something thick: the
 * lens carries its half of the blob off to the left, the rest draws out into
 * the input bar, a neck thins between them until it snaps, and each broken end
 * pulls back into its own rounded edge. Close it and the two reach for each
 * other, join, and shrink back into one circle.
 *
 * The goo is a single vector outline written once per frame, not the usual
 * blur-and-threshold SVG filter. A filter re-rasterises the whole area every
 * frame, stair-steps its edge, renders soft on retina Safari and has no way to
 * carry a hairline border. A path stays crisp at any zoom, and the border and
 * the focus ring follow the neck because they are the same path.
 *
 * Everything hangs off one spring, `p`: 0 shut, 1 open. A reversal mid-flight
 * therefore just turns the spring round, and nothing can get out of step. The
 * loop runs while it moves and parks once settled. A press compresses the blob
 * for a beat before it stretches. The lens leans a few pixels toward a nearby
 * pointer while shut, and thickens a hair while you type. Escape clears and
 * closes; leaving it empty closes it too. Once open, the circle is the search
 * button: tapped with text it submits, tapped empty it closes. An uncontrolled
 * submit clears the field; a controlled value remains the caller's choice.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1100
 * @framerIntrinsicHeight 600
 */

interface Placement {
    x: number
    y: number
    angle: number
    tilt: number
}

interface FontValue {
    fontFamily?: string
    fontWeight?: number | string
    fontStyle?: string
    fontSize?: number | string
    letterSpacing?: number | string
}

export interface GooeySearchProps {
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    /** Colour behind the search, filling the frame. */
    background?: string
    /** Fill of the circle and the bar. */
    fill?: string
    /** The hairline round the circle and the bar. */
    borderColor?: string
    /** The magnifier, and the focus ring drawn from it. */
    iconColor?: string
    font?: FontValue
    textColor?: string
    placeholderColor?: string
    width?: number
    gap?: number
    scale?: number
    barHeight?: number
    alignment?: "left" | "center" | "right"
    corner?: number
    placement?: Partial<Placement>
    give?: number
    stretch?: number
    spring?: number
    onSubmit?: (value: string) => void
    style?: React.CSSProperties
}

/* The closed object at the default Height: a circle, so the width is the height. */
const SHUT = 64
const CORNER = SHUT / 2
/* The lens and the text's inset past the curve of the bar's cap, as shares of Height. */
const LENS = 28 / SHUT
const TEXT_INSET = 24 / SHUT
const WIDE = 270
const MAX_OPEN = 400
const FRAME_X = 13
const FRAME_Y = 20
const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
/* Stated outright: outside Framer a Font control with no default is seeded as Inter. */
const DEFAULT_FONT: FontValue = { fontFamily: "system-ui", fontWeight: 400, fontSize: 17 }
/* The old dark theme's colours, so existing instances look unchanged. */
const DEFAULT_TEXT = "#f7f7f7"
const DEFAULT_SOFT = "rgba(255,255,255,0.42)"
const DEFAULT_SKIN = "#1c1c1e"
const DEFAULT_BORDER = "rgba(255,255,255,0.1)"
const DEFAULT_ICON = "#f7f7f7"
/* The focus ring is the icon colour at this opacity, as the old themes had it. */
const RING_OPACITY = 0.32
const DEFAULT_PLACEMENT: Placement = { x: 0, y: 0, angle: 0, tilt: 0 }
const PERSPECTIVE = 800

/* Half the thread's thickness at the instant it snaps. */
const THREAD = 1.1
/* How far the corner's arc has turned back when the neck leaves it at the snap. */
const NECK_ANGLE = 0.85
/* How early the waist thins as the two part. */
const NECK_THIN = 1
/* Share of the notch filled where two caps overlap, so a join is a curve, not a crease. */
const FILLET = 0.5
/* Share of the travel the blob spends as one pill before it starts to waist. */
const WAIST_FROM = 0.15

/* The broken ends: quick and a little loose, so they settle with a wobble. */
const TIP_W = 34
const TIP_Z = 0.42
/* A fresh join thickening up: no ring. */
const KNIT_W = 24
/* Slower closing: the gap shuts on the steep end of the travel, where opening has
   the spring's slow tail to show the neck in. */
const AIM_OPEN = 11
const AIM_CLOSE = 6.5
const STEP = 1 / 240

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const n = (v: number) => v.toFixed(2)

/* The shadows are the box-shadows this had as a plain box, fitted as drop-shadows
   so they follow the neck: within 0.2/255 of the originals round the shut circle. */
const SHADOW = "drop-shadow(0 1px 1px rgba(0,0,0,0.3)) drop-shadow(0 8px 8px rgba(0,0,0,0.2))"

/* ---- The goo --------------------------------------------------------------
 * `Goo` is what moves, `Shape` is what the panel set. Both are read fresh, so
 * dragging a control re-draws the next frame with no rebuild. */
interface Goo {
    aim: number
    p: number
    v: number
    joined: boolean
    /* The broken ends' reach past their rest edge: past 0 is a tip, under 0 a dimple. */
    tip: number
    tipV: number
    /* 0 a join that has just formed, as thin as a snapping thread; 1 full. */
    knit: number
    knitV: number
}

interface Shape {
    shut: number
    /* The outline's half-height: its 1px line is centred on the path and has to
       finish inside the box, as a CSS border would. */
    body: number
    r: number
    left: number
    right: number
    gap: number
    pitch: number
    snap: number
    meet: number
}

/* Centre of the circle to the bar's left cap, and the air between them. The
   square keeps the pair together through the fast middle of the spring and
   parts them as it slows, which is what gives the neck time to be seen. */
const pitchAt = (p: number, g: Shape) => {
    const q = Math.max(0, (p - WAIST_FROM) / (1 - WAIST_FROM))
    return g.pitch * q * q
}
const gapAt = (p: number, g: Shape) => pitchAt(p, g) - g.shut

/* The whole silhouette for one instant: one closed path while joined, two once
   snapped. Every corner is an arc of radius `r`, so `Corner` still does what it
   did: a circle and a pill at full, a rounded square and bar below it. The neck
   leaves the corner's arc at angle `phi`, on its tangent, so nothing kinks. */
function outline(s: Goo, g: Shape) {
    const { r, body } = g
    const flat = body - r
    const a = g.left * s.p
    const b = a + pitchAt(s.p, g)
    const c = Math.max(b, g.right * s.p)
    // Centres of the two corners that face each other.
    const A = a + flat
    const B = b - flat
    const mid = (A + B) / 2

    let phi: number
    let waist = 0
    let shrink = 1
    if (s.joined) {
        const t = clamp((B - A) / (2 * r + 1 + g.snap), 0, 1)
        const e = 1 - (1 - t) * s.knit
        const half = Math.max(0, B - A) / 2
        // Leave the arc well short of where the caps cross, or a fast join creases there.
        phi = Math.max(lerp(Math.PI / 2, NECK_ANGLE, e), r > 0 ? Math.acos(Math.min(1, (half * 0.62) / r)) : 0)
        // While they overlap the waist cannot drop below their crossing, and fills part
        // of the notch above it. Past that it thins early, so the thread has length.
        const cross = half < r ? Math.sqrt(r * r - half * half) : 0
        const seam = cross * (1 + flat / Math.max(r, 1))
        const fill = FILLET * Math.sqrt(cross / Math.max(r, 1))
        waist = Math.max(seam + (flat + r * Math.sin(phi) - seam) * fill, THREAD + (body - THREAD) * Math.pow(1 - e * e, NECK_THIN))
    } else {
        // Dimples use the same arc as tips, which is what makes the wobble read.
        shrink = Math.min(1, Math.abs(s.tip) / (g.snap / 2))
        phi = NECK_ANGLE * Math.sqrt(shrink)
    }

    const sin = Math.sin(phi)
    const cos = Math.cos(phi)
    const px = r * cos
    const py = flat + r * sin
    const reach = s.joined ? mid : a + body + s.tip
    const run = Math.max(0, reach - A - px)
    const end = s.joined ? waist : THREAD
    let pull = Math.max(0, Math.min((run * 0.6) / Math.max(sin, 0.05), (py - end) / Math.max(cos, 0.001)))
    // The one arc a cubic can stand in for: as a tip dies, its curve becomes the corner's.
    const arc = (4 / 3) * Math.tan(phi / 2) * r
    if (!s.joined) pull = lerp(arc, pull, shrink)
    const x1 = A + px + pull * sin
    const y1 = py - pull * cos

    const arcTo = `A${n(r)} ${n(r)} 0 0 1 `
    const head = `M${n(a - body)} ${n(flat)}V${n(-flat)}${arcTo}${n(a - flat)} ${n(-body)}H${n(A)}${arcTo}${n(A + px)} ${n(-py)}`
    const foot = `${arcTo}${n(A)} ${n(body)}H${n(a - flat)}${arcTo}${n(a - body)} ${n(flat)}Z`
    const bar = `${arcTo}${n(B)} ${n(-body)}H${n(c + flat)}${arcTo}${n(c + body)} ${n(-flat)}V${n(flat)}${arcTo}${n(c + flat)} ${n(body)}H${n(B)}${arcTo}${n(B - px)} ${n(py)}`
    // Mirror a point of the circle's side onto the bar's.
    const mx = (x: number) => n(A + B - x)

    if (s.joined) {
        const x2 = mid - run * 0.5
        const top = `C${n(x1)} ${n(-y1)} ${n(x2)} ${n(-waist)} ${n(mid)} ${n(-waist)}C${mx(x2)} ${n(-waist)} ${mx(x1)} ${n(-y1)} ${n(B - px)} ${n(-py)}`
        const under = `C${mx(x1)} ${n(y1)} ${mx(x2)} ${n(waist)} ${n(mid)} ${n(waist)}C${n(x2)} ${n(waist)} ${n(x1)} ${n(y1)} ${n(A + px)} ${n(py)}`
        return head + top + bar + under + foot
    }

    // Fresh from the snap a tip carries on the neck's concave curve, so the thread breaks
    // and retracts rather than popping into a cone; as it dies the curve rounds out.
    const round = lerp(arc, THREAD, shrink)
    const tipA = a + body + s.tip
    const tipB = b - body - s.tip
    const x2 = tipA - run * 0.5 * shrink
    return (
        `${head}C${n(x1)} ${n(-y1)} ${n(x2)} ${n(-round)} ${n(tipA)} 0C${n(x2)} ${n(round)} ${n(x1)} ${n(y1)} ${n(A + px)} ${n(py)}${foot}` +
        `M${n(tipB)} 0C${mx(x2)} ${n(-round)} ${mx(x1)} ${n(-y1)} ${n(B - px)} ${n(-py)}${bar}C${mx(x1)} ${n(y1)} ${mx(x2)} ${n(round)} ${n(tipB)} 0Z`
    )
}

/* One fixed substep of everything that moves, so a 120 Hz screen neither speeds
   it up nor changes where the neck snaps. */
function advance(s: Goo, g: Shape, open: boolean, stiff: number, drag: number, h: number) {
    // The spring chases an eased aim, not the target: handed a step it would start at
    // full acceleration, and closing would shut the gap before the goo could be seen.
    s.aim += ((open ? 1 : 0) - s.aim) * Math.min(1, (open ? AIM_OPEN : AIM_CLOSE) * h)
    s.v += (s.aim - s.p) * stiff * h - s.v * drag * h
    s.p += s.v * h
    const gap = gapAt(s.p, g)
    if (s.joined) {
        s.knitV += (1 - s.knit) * KNIT_W * KNIT_W * h - s.knitV * 2 * KNIT_W * h
        s.knit += s.knitV * h
        if (open && gap >= g.snap) {
            s.joined = false
            s.tip = g.snap / 2
            s.tipV = 0
        }
        return
    }
    // Closing, the ends swell toward each other before they touch.
    const want = open ? 0 : (clamp((g.gap - gap) / (g.gap - g.meet), 0, 1) * g.meet) / 2
    s.tipV += (want - s.tip) * TIP_W * TIP_W * h - s.tipV * 2 * TIP_Z * TIP_W * h
    s.tip += s.tipV * h
    if (!open && gap <= 2 * Math.max(s.tip, 0) + 0.25) {
        s.joined = true
        s.knit = 0
        s.knitV = 0
    }
}

const settled = (s: Goo, open: boolean) =>
    Math.abs((open ? 1 : 0) - s.aim) < 0.0004 && Math.abs(s.aim - s.p) < 0.0004 && Math.abs(s.v) < 0.004 && (s.joined ? s.knit > 0.999 : Math.abs(s.tip) < 0.02 && Math.abs(s.tipV) < 0.4)

/* The field comes up once the bar has parted and has somewhere to be. */
const sayAt = (p: number) => clamp((p - 0.72) / 0.26, 0, 1)

/* Read once: a preference, not a live input. */
const stillness = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

export default function GooeySearch({
    placeholder = "Search",
    value: controlledValue,
    onChange,
    background = "transparent",
    fill = DEFAULT_SKIN,
    borderColor = DEFAULT_BORDER,
    iconColor = DEFAULT_ICON,
    font,
    textColor = DEFAULT_TEXT,
    placeholderColor = DEFAULT_SOFT,
    width = WIDE,
    gap = 14,
    scale = 100,
    barHeight = SHUT,
    alignment = "center",
    corner = CORNER,
    placement,
    give = 50,
    stretch = 75,
    spring = 50,
    onSubmit,
    style,
}: GooeySearchProps) {
    const place = { ...DEFAULT_PLACEMENT, ...placement }
    const f = { ...DEFAULT_FONT, ...font }
    const type: React.CSSProperties = {
        fontFamily: f.fontFamily && !/^(sans-serif|system-ui)$/i.test(f.fontFamily.trim()) ? f.fontFamily : SANS,
        fontWeight: f.fontWeight,
        fontStyle: f.fontStyle,
        fontSize: f.fontSize,
        letterSpacing: f.letterSpacing,
    }

    /* Touch can change under you (a tablet's keyboard docked), so the mobile
       search keyboard hint is updated live. A narrow frame needs nothing here:
       `fit` already shrinks the whole search to it. */
    const [touch, setTouch] = useState(false)
    useEffect(() => {
        const coarse = window.matchMedia("(pointer: coarse)")
        const read = () => setTouch(coarse.matches)
        read()
        coarse.addEventListener("change", read)
        return () => coarse.removeEventListener("change", read)
    }, [])

    const frame = useRef<HTMLDivElement | null>(null)
    const field = useRef<HTMLInputElement | null>(null)
    const ruler = useRef<HTMLSpanElement | null>(null)
    const skins = useRef<SVGGElement | null>(null)
    const lensAt = useRef<SVGGElement | null>(null)
    const beat = useRef(0)
    const rest = useRef(0)

    const [open, setOpen] = useState(false)
    const [press, setPress] = useState(false)
    const [uncontrolledValue, setUncontrolledValue] = useState(controlledValue ?? "")
    const value = controlledValue ?? uncontrolledValue
    const [busy, setBusy] = useState(false)
    const [lean, setLean] = useState({ x: 0, y: 0 })
    const [still, setStill] = useState(false)
    const [fit, setFit] = useState(1)
    const [wordW, setWordW] = useState(0)
    useEffect(() => setStill(stillness()), [])

    const updateValue = (nextValue: string) => {
        if (controlledValue === undefined) setUncontrolledValue(nextValue)
        onChange?.(nextValue)
    }

    useEffect(
        () => () => {
            window.clearTimeout(beat.current)
            window.clearTimeout(rest.current)
        },
        []
    )

    const zoom = clamp(scale, 50, 200) / 100
    const shut = clamp(barHeight, 32, 120)
    const air = Math.max(gap, 2)
    const lens = shut * LENS
    const inset = shut * TEXT_INSET
    const tail = inset * 0.7
    /* The bar always holds the placeholder, measured in the current font: asking for
       less than that stops at it rather than cutting the word off. Only the 400 ceiling
       can beat it, for a placeholder too long for any width here. */
    const fits = shut + air + Math.max(shut, wordW + inset + tail)
    // 0 was the old "automatic" value; instances still carrying it get the default.
    const asked = width > 0 ? width : WIDE
    const openW = Math.max(Math.min(Math.max(asked, fits), MAX_OPEN), shut * 2 + air)
    const frameW = openW + FRAME_X * 2
    const frameH = shut + FRAME_Y * 2
    // A share of full round, so Corner at its top is a circle at any Height.
    const r = Math.max(0, (clamp(corner, 0, CORNER) / CORNER) * (shut / 2) - 0.5)
    const snap = air * (0.35 + (clamp(stretch, 0, 100) / 100) * 0.6)
    const left = shut / 2 - openW / 2
    const right = openW / 2 - shut / 2
    const shape: Shape = { shut, body: shut / 2 - 0.5, r, left, right, gap: air, pitch: shut + air, snap, meet: snap * 0.6 }
    const barLeft = shut + air
    const shown = fit * zoom

    const goo = useRef<Goo>({ aim: 0, p: 0, v: 0, joined: true, tip: 0, tipV: 0, knit: 1, knitV: 0 })
    const drawn = useRef(shape)
    drawn.current = shape
    const tune = clamp(spring, 0, 100) / 100
    const omega = 9 + tune * 8
    const zeta = 1 - tune * 0.42
    const tuning = useRef({ stiff: 0, drag: 0 })
    tuning.current = { stiff: omega * omega, drag: 2 * zeta * omega }

    useEffect(() => {
        const s = goo.current
        const paint = () => {
            const d = outline(s, drawn.current)
            const paths = skins.current?.children
            if (paths) for (let i = 0; i < paths.length; i++) paths[i].setAttribute("d", d)
            lensAt.current?.setAttribute("transform", `translate(${n(drawn.current.left * s.p)} 0)`)
            const say = sayAt(s.p)
            field.current?.style.setProperty("--say", say.toFixed(3))
            if (field.current) field.current.style.caretColor = say > 0.5 ? "" : "transparent"
        }
        if (still) {
            s.p = s.aim = open ? 1 : 0
            s.v = 0
            s.joined = !open
            s.tip = 0
            s.tipV = 0
            s.knit = 1
            s.knitV = 0
            paint()
            return
        }
        let raf = 0
        let prev = 0
        let bank = 0
        const tick = (t: number) => {
            bank += prev ? Math.min((t - prev) / 1000, 1 / 20) : 1 / 60
            prev = t
            const { stiff, drag } = tuning.current
            while (bank >= STEP) {
                advance(s, drawn.current, open, stiff, drag, STEP)
                bank -= STEP
            }
            const done = settled(s, open)
            if (done) {
                s.p = s.aim = open ? 1 : 0
                s.v = 0
                s.tip = 0
                s.tipV = 0
                s.knit = 1
            }
            paint()
            raf = done ? 0 : requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [open, still])

    /* A frame set smaller than the composition shrinks it rather than cutting it off. */
    useEffect(() => {
        const el = frame.current
        if (!el) return
        const ro = new ResizeObserver(() => setFit(Math.min(1, el.offsetWidth / (frameW * zoom), el.offsetHeight / (frameH * zoom))))
        ro.observe(el)
        return () => ro.disconnect()
    }, [frameW, frameH, zoom])

    /* Watched, not read once: a web font landing changes the word's width with no render of ours. */
    useEffect(() => {
        const el = ruler.current
        if (!el) return
        const ro = new ResizeObserver(() => setWordW(Math.ceil(el.offsetWidth) + 2))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    /* The magnet, measured from the frame (which never moves), not the object
       (which does): a vector read off the thing it displaces rings. Off once
       open: a field that drifts while you click into it is fighting you. */
    useEffect(() => {
        const el = frame.current
        if (!el || open || still) return
        let raf = 0
        let x = 0
        let y = 0
        let at = { x: 0, y: 0 }
        const turn = (-place.angle * Math.PI) / 180
        const publish = () => {
            raf = 0
            const b = el.getBoundingClientRect()
            // Measure in the block's own px, so the reach is the same in a scaled frame.
            const k = b.width / (el.offsetWidth || b.width) || 1
            const ox = (x - (b.left + b.width * (0.5 + place.x / 100))) / (k * shown)
            const oy = (y - (b.top + b.height * (0.5 + place.y / 100))) / (k * shown)
            // The lean happens inside the turned content, so bring the pointer in with it.
            const dx = ox * Math.cos(turn) - oy * Math.sin(turn)
            const dy = ox * Math.sin(turn) + oy * Math.cos(turn)
            const d = Math.hypot(dx, dy)
            const R = 110
            if (d > R) {
                if (at.x || at.y) setLean((at = { x: 0, y: 0 }))
                return
            }
            // A few pixels: past about seven it stops acknowledging you and starts following.
            const pull = (1 - d / R) ** 1.4 * (2 + (give / 100) * 5)
            setLean((at = { x: (dx / (d || 1)) * pull, y: (dy / (d || 1)) * pull }))
        }
        const read = (e: PointerEvent) => {
            x = e.clientX
            y = e.clientY
            if (!raf) raf = requestAnimationFrame(publish)
        }
        const gone = () => {
            x = y = -1e6
            if (!raf) raf = requestAnimationFrame(publish)
        }
        document.addEventListener("pointermove", read, { passive: true })
        document.addEventListener("pointerleave", gone)
        return () => {
            document.removeEventListener("pointermove", read)
            document.removeEventListener("pointerleave", gone)
            cancelAnimationFrame(raf)
            setLean({ x: 0, y: 0 })
        }
    }, [open, give, still, place.x, place.y, place.angle, shown])

    /* Opening: compress, then expand, then focus. 90ms is long enough to feel
       the object yield and short enough that nobody waits. Focus lands with
       the expansion, so the caret is there when the field arrives. */
    const start = () => {
        if (open) return
        setPress(true)
        window.clearTimeout(beat.current)
        beat.current = window.setTimeout(() => {
            setPress(false)
            setOpen(true)
            field.current?.focus()
        }, still ? 0 : 90)
    }

    const close = () => {
        setOpen(false)
    }

    // Away with nothing typed and it goes back; away with something typed and it stays.
    const away = () => {
        if (!value.trim()) close()
    }

    // A submitted search is done with: hand it over, then clear and close back to the circle,
    // the same way Escape does.
    const send = () => {
        const q = value.trim()
        if (!q) return
        onSubmit?.(q)
        if (controlledValue === undefined) setUncontrolledValue("")
        close()
        field.current?.blur()
    }

    // The way in while shut, the search button once it has come away.
    const tap = () => {
        if (!open) return start()
        if (value.trim()) return send()
        close()
        field.current?.blur()
    }

    const tapped = () => {
        setBusy(true)
        window.clearTimeout(rest.current)
        rest.current = window.setTimeout(() => setBusy(false), 340)
    }

    const skinT = `${!open ? `translate(${(lean.x * 0.35).toFixed(2)}px, ${(lean.y * 0.35).toFixed(2)}px)` : ""} scale(${press ? 0.92 : 1})`
    const lensT = `translate(${(open ? 0 : lean.x).toFixed(2)}px, ${(open ? 0 : lean.y).toFixed(2)}px)`
    const d = outline(goo.current, shape)
    const say = sayAt(goo.current.p)

    return (
        // The frame: fills it edge to edge with the Background and centres the search in it.
        <div
            style={{
                width: "100%",
                height: "100%",
                ...style,
                display: "flex",
                alignItems: "center",
                justifyContent:
                    alignment === "left"
                        ? "flex-start"
                        : alignment === "right"
                          ? "flex-end"
                          : "center",
                background,
            }}
        >
        <div
            ref={frame}
            style={{
                position: "relative",
                // The frame follows the field's setting, not its state, so it never moves mid-interaction.
                width: Math.ceil(frameW * zoom),
                height: Math.ceil(frameH * zoom),
                // A frame smaller than the search clamps this box, and `fit` shrinks the search to it.
                maxWidth: "100%",
                maxHeight: "100%",
                flexShrink: 0,
                fontFamily: SANS,
            }}
        >
            <style>{`
.sek-field { --say: 0; }
.sek-field::placeholder { color: var(--soft); opacity: var(--say); }
.sek-ring { opacity: 0; transition: opacity .15s ease; }
.sek-skin:focus-within .sek-ring { opacity: ${RING_OPACITY}; }
.sek-hit:focus-visible { outline: none; }
`}</style>
            <span ref={ruler} aria-hidden="true" style={{ ...type, position: "absolute", left: 0, top: 0, visibility: "hidden", whiteSpace: "pre", pointerEvents: "none" }}>
                {placeholder}
            </span>
            {/* Placement moves the content, never the frame. Offsets last, so turning spins it in place. */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    // The 3D part only while there is a Tilt. perspective() alone draws nothing
                    // different, but it makes the search a GPU layer, and under a scaled host
                    // (the preview's fit x Size) Chrome drew that layer at a slightly different
                    // scale and resampled it: every edge, the type included, came out soft.
                    // Flat, it paints straight at the size it shows.
                    transform: place.tilt
                        ? `translate(${place.x}%, ${place.y}%) perspective(${PERSPECTIVE}px) rotate(${place.angle}deg) rotateX(${place.tilt}deg) scale(${shown})`
                        : `translate(${place.x}%, ${place.y}%) rotate(${place.angle}deg) scale(${shown})`,
                }}
            >
                <div
                    className="sek-skin"
                    style={{
                        position: "absolute",
                        inset: 0,
                        transform: skinT,
                        transition: still ? "none" : "transform .16s cubic-bezier(.3,.7,.4,1)",
                    }}
                >
                    <svg
                        viewBox={`${-frameW / 2} ${-frameH / 2} ${frameW} ${frameH}`}
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: frameW,
                            height: frameH,
                            marginLeft: -frameW / 2,
                            marginTop: -frameH / 2,
                            overflow: "visible",
                            filter: SHADOW,
                            pointerEvents: "none",
                        }}
                    >
                        {/* One outline, three coats: focus ring under the fill, hairline over it. */}
                        <g ref={skins} strokeLinejoin="round">
                            <path className="sek-ring" d={d} fill="none" stroke={iconColor} strokeWidth={5} />
                            <path d={d} fill={fill} stroke={fill} strokeWidth={1} />
                            <path d={d} fill="none" stroke={borderColor} strokeWidth={1} />
                        </g>
                        {/* Drawn rather than imported: the lens takes a state (it thickens while you type). */}
                        <g ref={lensAt} transform={`translate(${n(shape.left * goo.current.p)} 0)`}>
                            <g style={{ transform: lensT, transition: still ? "none" : "transform .18s ease-out" }}>
                                <g
                                    transform={`translate(${-lens / 2} ${-lens / 2}) scale(${lens / 18})`}
                                    style={{
                                        fill: "none",
                                        stroke: iconColor,
                                        strokeWidth: busy ? 2.4 : 2,
                                        strokeLinecap: "round",
                                        transition: still ? "none" : "stroke-width .12s ease",
                                    }}
                                >
                                    <circle cx="7.6" cy="7.6" r="5.4" />
                                    <path d="M11.6 11.6 L15.4 15.4" />
                                </g>
                            </g>
                        </g>
                    </svg>

                    <input
                        ref={field}
                        className="sek-field"
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        aria-label={placeholder || "Search"}
                        // Hint the on-screen keyboard to use its search action on touch.
                        inputMode={touch ? "search" : undefined}
                        tabIndex={open ? 0 : -1}
                        onChange={(e) => {
                            updateValue(e.target.value)
                            tapped()
                        }}
                        onBlur={away}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && value.trim()) {
                                send()
                                return
                            }
                            if (e.key !== "Escape") return
                            e.preventDefault()
                            updateValue("")
                            close()
                            field.current?.blur()
                        }}
                        style={
                            {
                                "--say": say.toFixed(3),
                                "--soft": placeholderColor,
                                position: "absolute",
                                left: `calc(50% - ${openW / 2}px + ${barLeft}px)`,
                                top: "50%",
                                width: openW - barLeft,
                                height: shut,
                                marginTop: -shut / 2,
                                boxSizing: "border-box",
                                padding: `0 ${tail}px 0 ${inset}px`,
                                border: 0,
                                outline: "none",
                                background: "transparent",
                                ...type,
                                color: textColor,
                                caretColor: say > 0.5 ? undefined : "transparent",
                                opacity: open ? 1 : 0,
                                transition: "opacity .15s",
                                pointerEvents: open ? "auto" : "none",
                            } as React.CSSProperties
                        }
                    />

                    {/* The circle stays the target through the whole life of the thing. Held
                        mouse-down so tapping it does not blur the field and close it first. */}
                    <button
                        className="sek-hit"
                        aria-label={open ? "Search" : "Open search"}
                        onMouseDown={(e) => {
                            if (open) e.preventDefault()
                        }}
                        onClick={tap}
                        style={{
                            position: "absolute",
                            left: `calc(50% - ${shut / 2}px + ${open ? left : 0}px)`,
                            top: "50%",
                            width: shut,
                            height: shut,
                            marginTop: -shut / 2,
                            padding: 0,
                            border: 0,
                            background: "transparent",
                            cursor: "pointer",
                            borderRadius: r + 0.5,
                        }}
                    />
                </div>
            </div>
        </div>
        </div>
    )
}


