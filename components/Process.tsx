"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useMinWidth } from "@/lib/useMinWidth";
import Eyebrow from "./Eyebrow";
import Tbc from "./Tbc";
import { tune } from "@/lib/tune";
import Reveal, { RevealText } from "./Reveal";

type Step = { title: string; description: string };

type Stat = { value: string; label: string; placeholder?: boolean };

// The OCEOS mark (48x48, same paths as `Mark` in Icons.tsx), drawn as a
// faint solid tint, with a perfect circle around it for the loop.
const MARK = [
  "M44.5972 25.1564C44.5972 35.3417 37.8834 39.5511 30.6292 39.3195C41.1415 46.7236 48.0006 33.8205 48.0006 24.3799C48.0006 12.8368 39.064 0.964502 24.1811 0.637554C9.2959 0.308336 -1.14372 12.998 0.100494 26.9637C2.50038 11.6448 14.2728 2.62876 25.8658 4.22717C37.4588 5.82558 44.5972 14.971 44.5972 25.1564Z",
  "M29.9257 16.692C32.8841 16.692 34.7504 18.3745 35.7494 19.5551C35.2954 18.5879 33.3314 14.5873 26.3225 14.8257C15.9646 15.1799 11.46 24.1233 11.46 31.1345C11.46 39.1493 17.177 47.97 27.6734 47.3366C40.8694 46.5419 45.7531 35.1124 46.7476 31.223C40.8535 43.252 20.8347 41.9419 20.8347 28.058C20.8347 20.6245 25.9274 16.6898 29.9257 16.6898V16.692Z",
  "M21.0869 11.7901C28.9427 11.8718 34.2533 16.2334 35.795 19.6118C26.0774 8.07786 0.0509951 19.6119 10.5133 44.4553C-4.11532 35.4552 4.33991 11.6153 21.0869 11.7901Z",
];
// The canvas is the circle's bounding box; the mark sits centred inside.
const R = 26;
const CANVAS = 2 * R;
const INSET = R - 24;
// Starts at 9 o'clock and runs clockwise, so the bag sets off over the top.
const LOOP = `M0 ${R} A${R} ${R} 0 1 1 ${CANVAS} ${R} A${R} ${R} 0 1 1 0 ${R} Z`;
// Each step's angle, clockwise from 12 o'clock (from Bion's sketch, set in
// lib/tune.ts): 01 at 9, 02/03 either side of the top, 04 at 3, 05/06
// along the bottom.
const ANGLES = tune.process.angles;

/**
 * Pinned on an ink band. Scrolling draws the loop and moves the marker
 * (the bag) once around it, lighting each step as it passes, then back
 * to the start. Below md (or with reduced motion) it's a vertical
 * timeline instead.
 */
export default function Process({
  eyebrow,
  heading,
  body,
  steps,
  stat,
  loopBack,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  steps: Step[];
  stat: Stat;
  loopBack: string;
}) {
  const wide = useMinWidth(768);
  const reduce = useReducedMotion();

  return (
    <section
      id="process"
      data-theme="dark"
      aria-label={eyebrow}
      className="weave overflow-x-clip"
    >
      {wide && !reduce ? (
        <Pinned
          eyebrow={eyebrow}
          heading={heading}
          body={body}
          steps={steps}
          stat={stat}
        />
      ) : (
        <Stacked
          eyebrow={eyebrow}
          heading={heading}
          body={body}
          steps={steps}
          stat={stat}
          loopBack={loopBack}
        />
      )}
    </section>
  );
}

/** Each step's spot on the loop, as a 0-1 share of the lap. Six steps
 *  use ANGLES; other counts spread evenly. */
function stops(n: number) {
  if (n !== ANGLES.length) return Array.from({ length: n }, (_, i) => i / n);
  return ANGLES.map((a) => ((a - 270 + 360) % 360) / 360);
}

/** A share of the lap to a position on the circle, as % of the canvas. */
function onCircle(t: number) {
  const a = ((270 + t * 360) * Math.PI) / 180;
  return { x: 50 + 50 * Math.sin(a), y: 50 - 50 * Math.cos(a) };
}

function Pinned({
  eyebrow,
  heading,
  body,
  steps,
  stat,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  steps: Step[];
  stat: Stat;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const ts = stops(steps.length);
  const points = ts.map(onCircle);
  const [p, setP] = useState(0);
  const mx = useMotionValue("0%");
  const my = useMotionValue("50%");

  useMotionValueEvent(scrollYProgress, "change", (v) => move(v));
  // Park the marker on step 1 before the first scroll event.
  useEffect(() => move(scrollYProgress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  function move(v: number) {
    setP(v);
    const pt = onCircle(v);
    mx.set(`${pt.x}%`);
    my.set(`${pt.y}%`);
  }

  return (
    <div
      ref={outerRef}
      className="relative"
      style={{ height: `${steps.length * tune.process.vhPerStep + tune.process.extraVh}vh` }}
    >
      {/* Pinned, one screen. The description sits top right and the
          circle starts 96px under it, centred and as tall as what's left
          down to 128px from the bottom. Heading top left and stat bottom
          left float beside the circle. */}
      <div className="gutter sticky top-0 h-[100svh]">
        <div className="relative flex h-full flex-col pb-32 pt-28 lg:pt-mark">
          <div className="absolute left-0 top-28 flex max-w-[27vw] lg:top-mark flex-col gap-6">
            <Eyebrow>{eyebrow}</Eyebrow>
            <RevealText
              text={heading}
              className="t-h2 !text-[clamp(2rem,2.9vw,4rem)]"
            />
          </div>
          <p className="t-body max-w-[18rem] self-end text-right lg:mr-24 text-on-surface-variant">
            {body}
          </p>
          <div className="absolute bottom-32 left-0">
            <p className="t-h2 whitespace-nowrap !text-[clamp(2rem,2.9vw,4rem)]">
              {stat.value}
            </p>
            <p className="t-label mt-3 text-on-surface-variant">
              {stat.label}
              <Tbc show={!!stat.placeholder} />
            </p>
          </div>

          <div className="mt-24 flex min-h-0 flex-1 justify-center">
            <div className="relative aspect-square h-full">
              <svg
                viewBox={`0 0 ${CANVAS} ${CANVAS}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                <g
                  fill="currentColor"
                  opacity="0.12"
                  transform={`translate(${INSET} ${INSET})`}
                >
                  {MARK.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </g>
                <path
                  d={LOOP}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="0.12"
                  strokeDasharray="0.05 0.4"
                  strokeLinecap="round"
                />
                <motion.path
                  d={LOOP}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="0.13"
                  strokeLinecap="round"
                  style={{ pathLength: scrollYProgress }}
                />
              </svg>

              {points.map((pt, i) => {
                const on = p >= ts[i] - 0.01;
                // labels hang outward: left of the dot on the left half,
                // right of it on the right half (lifted above the dot near
                // the top so they clear the line)
                const side = pt.x < 50 ? "left" : "right";
                const lift = pt.y < 25 ? "bottom-1" : "-top-3";
                const pos =
                  side === "left"
                    ? `right-5 ${lift} text-right`
                    : `left-5 ${lift}`;
                const shift =
                  side === "left" ? "translate-x-2" : "-translate-x-2";
                return (
                  <div
                    key={steps[i].title}
                    className="absolute"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  >
                    <span
                      className={`absolute -left-[7px] -top-[7px] h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300 ${
                        on
                          ? "border-accent bg-accent"
                          : "border-on-surface-variant bg-surface"
                      }`}
                    />
                    <div
                      className={`absolute w-36 transition-[opacity,transform] duration-500 ${pos} ${
                        on
                          ? "translate-x-0 translate-y-0 opacity-100"
                          : `${shift} opacity-30`
                      }`}
                    >
                      <p className="t-label tabular-nums text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1.5 font-serif text-[1.625rem] uppercase leading-none tracking-[-0.012em]">
                        {steps[i].title}
                      </p>
                      <p className="t-small mt-1.5 text-on-surface-variant [@media(max-height:860px)]:hidden">
                        {steps[i].description}
                      </p>
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
      </div>
    </div>
  );
}

function Stacked({
  eyebrow,
  heading,
  body,
  steps,
  stat,
  loopBack,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  steps: Step[];
  stat: Stat;
  loopBack: string;
}) {
  return (
    <div className="gutter flex flex-col gap-10 py-28">
      <Eyebrow>{eyebrow}</Eyebrow>
      <RevealText text={heading} className="t-h1" />
      <p className="t-body text-on-surface-variant">{body}</p>
      <ol className="relative mt-4 flex flex-col gap-10 border-l border-border pl-8">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} className="relative">
            <span className="absolute -left-[39px] top-1 h-3.5 w-3.5 rounded-full bg-accent" />
            <p className="t-label tabular-nums text-accent">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="t-h3 mt-2">{s.title}</p>
            <p className="t-body mt-1.5 text-on-surface-variant">
              {s.description}
            </p>
          </Reveal>
        ))}
      </ol>
      {/* the loop closes: back to step 1 */}
      <p className="t-label -mt-4 pl-8 text-on-surface-variant">{loopBack}</p>
      <div className="border-t border-border pt-8">
        <p className="t-h2">{stat.value}</p>
        <p className="t-label mt-3 text-on-surface-variant">
          {stat.label}
          <Tbc show={!!stat.placeholder} />
        </p>
      </div>
    </div>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 5.5h10l-.8 8.5H3.8L3 5.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
