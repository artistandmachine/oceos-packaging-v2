"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { lockScroll } from "@/lib/scroll";
import { assetProgress, markLoaded, trackAsset } from "@/lib/loaded";
import { EASE } from "./Reveal";
import Wordmark from "./Wordmark";

/** Never lands sooner than MIN (no flash on fast loads). At MAX it stops
 * waiting and runs to 100 regardless; BAIL lifts it outright in case rAF
 * is throttled (background tab). Seconds. */
const MIN = 1.4;
const MAX = 5;
const BAIL = 6.5;

/**
 * UC's intro: dotted field, two cycling lists (their countries + services;
 * here products + the bottle-to-bag stages), and a big 000 -> 100 count.
 * The count follows real progress: fonts plus whatever the hero registers
 * (poster, video) via lib/loaded.ts, eased so it never jumps or runs
 * backwards, with a slow creep so it never looks stuck. When it lands,
 * the ink panel lifts away like a curtain and the hero headline rises
 * underneath.
 */
export default function Preloader({ products, stages }: { products: string[]; stages: string[] }) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0);
  const count = useMotionValue(0);
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

  useEffect(() => {
    if (reduce) {
      setDone(true);
      markLoaded();
      return;
    }
    lockScroll(true);
    window.scrollTo(0, 0);

    const fonts = trackAsset();
    if (document.fonts) document.fonts.ready.then(fonts.settle, fonts.settle);
    else fonts.settle();

    const start = performance.now();
    let last = start;
    let raf = 0;
    let finishing = false;
    let lift: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (finishing) return;
      finishing = true;
      cancelAnimationFrame(raf);
      count.set(100);
      lift = setTimeout(() => setDone(true), 200);
    };

    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const real = t >= MAX ? 1 : assetProgress();
      // Hold just short of 100 until everything is in, creeping into the
      // remaining gap meanwhile so a slow video never reads as stuck.
      const creep = Math.min(t / MAX, 1);
      const goal = Math.min(t / MIN, real === 1 ? 1 : (real + (1 - real) * 0.8 * creep) * 0.95);
      const v = count.get() / 100;
      const next = Math.max(v, v + (goal - v) * (1 - Math.exp(-dt * 7)));
      if (goal === 1 && next > 0.995) return finish();
      count.set(next * 100);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const bail = setTimeout(finish, BAIL * 1000);
    const id = setInterval(() => setTick((t) => t + 1), 180);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bail);
      clearTimeout(lift);
      clearInterval(id);
      fonts.untrack();
    };
  }, [reduce, count]);

  useEffect(() => {
    if (!done) return;
    lockScroll(false);
    // Let the curtain start lifting before the hero rises.
    const t = setTimeout(markLoaded, 250);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          data-theme="dark"
          aria-hidden="true"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden p-5 md:p-10 lg:p-16"
        >
          {/* rPET weave field (globals.css .weave), standing in for UC's
              dotted world map: faded out toward the edges */}
          <div
            className="weave pointer-events-none absolute inset-0"
            style={{
              ["--weave-opacity" as string]: "0.35",
              maskImage: "radial-gradient(ellipse 55% 45% at 50% 48%, #000 35%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 55% 45% at 50% 48%, #000 35%, transparent 80%)",
            }}
          />

          <div className="relative flex items-start justify-between">
            <Wordmark className="text-2xl" />
            <span className="t-label text-on-surface-variant">One bag at a time</span>
          </div>

          <div className="relative flex items-end justify-between gap-6">
            <div className="flex gap-10 md:gap-20">
              <CycleList items={products} active={tick % products.length} />
              <CycleList items={stages} active={tick % stages.length} className="hidden sm:flex" />
            </div>
            <motion.span className="font-serif leading-[0.75] tracking-[-0.04em] tabular-nums text-[28vw] md:text-[18vw]">
              {label}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CycleList({ items, active, className = "" }: { items: string[]; active: number; className?: string }) {
  return (
    <ul className={`flex flex-col gap-1.5 ${className}`}>
      {items.map((w, i) => (
        <li
          key={w}
          className={`t-label transition-[opacity,transform] duration-200 ${
            i === active ? "translate-x-2 text-accent opacity-100" : "opacity-30"
          }`}
        >
          {w}
        </li>
      ))}
    </ul>
  );
}
