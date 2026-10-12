"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useMinWidth } from "@/lib/useMinWidth";
import Eyebrow from "./Eyebrow";
import Tbc from "./Tbc";
import Reveal, { RevealText } from "./Reveal";

type Step = { title: string; description: string };

const VIEW_W = 1200;
const VIEW_H = 420;
// One continuous route across the canvas (ERA's drawn location path,
// carrying UC's moving vehicle).
const ROUTE =
  "M10 330 C 160 330, 190 120, 330 120 S 520 340, 650 300 S 820 70, 960 110 S 1130 260, 1190 200";

/**
 * Pinned on an ink band. Scrolling draws the route, moves the marker
 * (the bag) along it, lights each milestone as it passes, and spins the
 * odometer: UC's "00 km/h" readout, here counting trips.
 * Below md (or with reduced motion) it's a vertical timeline instead.
 */
export default function Process({
  eyebrow,
  heading,
  body,
  steps,
  odometer,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  steps: Step[];
  odometer: { max: number; unit: string; placeholder?: boolean };
}) {
  const wide = useMinWidth(768);
  const reduce = useReducedMotion();

  return (
    <section id="process" data-theme="dark" aria-label={eyebrow} className="weave">
      {wide && !reduce ? (
        <Pinned eyebrow={eyebrow} heading={heading} body={body} steps={steps} odometer={odometer} />
      ) : (
        <Stacked eyebrow={eyebrow} heading={heading} body={body} steps={steps} />
      )}
    </section>
  );
}

function thresholds(n: number) {
  return Array.from({ length: n }, (_, i) => 0.06 + (i * 0.86) / Math.max(1, n - 1));
}

function Pinned({
  eyebrow,
  heading,
  body,
  steps,
  odometer,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  steps: Step[];
  odometer: { max: number; unit: string; placeholder?: boolean };
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });

  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [p, setP] = useState(0);
  const mx = useMotionValue("0%");
  const my = useMotionValue("0%");
  const ts = thresholds(steps.length);

  // Milestone positions along the route, as % of the canvas.
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setPoints(
      ts.map((t) => {
        const pt = path.getPointAtLength(t * len);
        return { x: (pt.x / VIEW_W) * 100, y: (pt.y / VIEW_H) * 100 };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setP(v);
    const path = pathRef.current;
    if (!path) return;
    const pt = path.getPointAtLength(v * path.getTotalLength());
    mx.set(`${(pt.x / VIEW_W) * 100}%`);
    my.set(`${(pt.y / VIEW_H) * 100}%`);
  });

  const trips = Math.round(p * odometer.max);

  return (
    <div ref={outerRef} className="relative" style={{ height: `${steps.length * 60 + 100}vh` }}>
      {/* Everything has to fit one screen: the panel is pinned, so anything
          taller than the viewport gets clipped under the nav. The headline
          is t-h2 on two lines, and the route's width is capped by the
          height left over (30rem covers nav clearance, headline block and
          the labels that hang below the route), keeping its aspect so the
          % milestone positions stay true. */}
      <div className="gutter sticky top-0 flex h-[100svh] flex-col justify-center gap-8 pb-10 pt-28">
        <div className="flex items-end justify-between gap-10">
          <div className="flex flex-col gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <RevealText text={heading} className="t-h2 max-w-[18ch]" />
          </div>
          <div className="flex shrink-0 flex-col items-end gap-4">
            <p className="t-body hidden max-w-xs text-right text-on-surface-variant lg:block">{body}</p>
            <div className="flex items-baseline gap-3">
              <span className="t-num tabular-nums">{String(trips).padStart(3, "0")}</span>
              <span className="t-label text-on-surface-variant">
                {odometer.unit}
                <Tbc show={!!odometer.placeholder} />
              </span>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto w-full"
          style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}`, maxWidth: `max(20rem, calc((100svh - 30rem) * ${VIEW_W / VIEW_H}))` }}
        >
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <path d={ROUTE} fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
            <motion.path
              ref={pathRef}
              d={ROUTE}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          {points.map((pt, i) => {
            const on = p >= ts[i] - 0.01;
            // label sits on whichever side of the route has more room
            const below = pt.y < 50;
            return (
              <div key={steps[i].title} className="absolute" style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                <span
                  className={`absolute -left-[7px] -top-[7px] h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300 ${
                    on ? "border-accent bg-accent" : "border-on-surface-variant bg-surface"
                  }`}
                />
                <div
                  className={`absolute w-44 -translate-x-1/2 transition-[opacity,transform] duration-500 lg:w-52 ${
                    below ? "top-5" : "bottom-5"
                  } ${on ? "translate-y-0 opacity-100" : `${below ? "translate-y-2" : "-translate-y-2"} opacity-30`}`}
                >
                  <p className="t-label tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <p className="t-h3 mt-2">{steps[i].title}</p>
                  <p className="t-small mt-1.5 text-on-surface-variant">{steps[i].description}</p>
                </div>
              </div>
            );
          })}

          {/* the moving marker */}
          <motion.div className="absolute" style={{ left: mx, top: my }}>
            <span className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_0_0_8px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]">
              <BagIcon className="h-4 w-4" />
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Stacked({ eyebrow, heading, body, steps }: { eyebrow: string; heading: string; body: string; steps: Step[] }) {
  return (
    <div className="gutter flex flex-col gap-10 py-28">
      <Eyebrow>{eyebrow}</Eyebrow>
      <RevealText text={heading} className="t-h1" />
      <p className="t-body text-on-surface-variant">{body}</p>
      <ol className="relative mt-4 flex flex-col gap-10 border-l border-border pl-8">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} className="relative">
            <span className="absolute -left-[39px] top-1 h-3.5 w-3.5 rounded-full bg-accent" />
            <p className="t-label tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</p>
            <p className="t-h3 mt-2">{s.title}</p>
            <p className="t-body mt-1.5 text-on-surface-variant">{s.description}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 5.5h10l-.8 8.5H3.8L3 5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
