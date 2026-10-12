"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import Eyebrow from "./Eyebrow";
import Media from "./Media";
import Button, { ArrowIcon } from "./Button";
import { RevealText, EASE } from "./Reveal";

type Product = { title: string; description: string; specs: { k: string; v: string }[]; image: string };

/**
 * UC's six services presented like ERA's apartment types: a draggable
 * rail of tall cards, each with a spec table ("Material / Recycled PET")
 * and an enquire button. Drag, swipe, or use the arrows. A hairline
 * under the rail shows position.
 */
export default function Products({
  eyebrow,
  heading,
  body,
  items,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  items: Product[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [max, setMax] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const measure = () => {
      const v = viewportRef.current;
      const t = trackRef.current;
      if (!v || !t) return;
      const cs = getComputedStyle(v);
      const inner = v.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      setMax(Math.max(0, t.scrollWidth - inner));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(x, "change", (v) => setProgress(max ? Math.min(1, Math.max(0, -v / max)) : 0));

  function step(dir: 1 | -1) {
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : 400;
    const next = Math.min(0, Math.max(-max, x.get() - dir * amount));
    animate(x, next, { duration: 0.9, ease: EASE });
  }

  return (
    <section id="products" aria-label={eyebrow} className="overflow-hidden py-28 md:py-40">
      <div className="gutter flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <RevealText text={heading} className="t-h1 max-w-[12ch]" />
        </div>
        <div className="flex max-w-sm flex-col gap-6">
          <p className="t-body text-on-surface-variant">{body}</p>
          <div className="flex items-center gap-3">
            <ArrowButton label="Previous" onClick={() => step(-1)} disabled={progress <= 0.001} flip />
            <ArrowButton label="Next" onClick={() => step(1)} disabled={progress >= 0.999} />
            <span className="t-label ml-2 text-on-surface-variant">Drag to see more</span>
          </div>
        </div>
      </div>

      <div ref={viewportRef} className="gutter mt-14 md:mt-20">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -max, right: 0 }}
          dragElastic={0.08}
          style={{ x }}
          className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
        >
          {items.map((p, i) => (
            <article key={p.title} className="flex w-[78vw] shrink-0 select-none flex-col gap-5 sm:w-[46vw] lg:w-[30vw]">
              <div className="relative">
                <Media src={p.image} alt={p.title} sizes="(min-width: 1024px) 30vw, 78vw" className="pointer-events-none aspect-[4/5]" />
                <span className="t-label absolute left-4 top-4 z-20 rounded-full bg-surface/80 px-3 py-2 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="t-h3">{p.title}</h3>
              <dl className="grid grid-cols-2 border-y border-border">
                {p.specs.map((s, j) => (
                  <div key={s.k} className={`flex flex-col gap-1.5 py-4 ${j === 1 ? "border-l border-border pl-4" : ""}`}>
                    <dt className="t-label text-on-surface-variant">{s.k}</dt>
                    <dd className="t-small">{s.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-body text-on-surface-variant">{p.description}</p>
              <div>
                <Button href="#contact" variant="outline">Enquire</Button>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="mt-12 h-px w-full bg-border">
          <div className="h-full origin-left bg-on-surface transition-transform duration-300" style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
        </div>
      </div>
    </section>
  );
}

function ArrowButton({ label, onClick, disabled, flip }: { label: string; onClick: () => void; disabled?: boolean; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors duration-300 hover:bg-on-surface hover:text-surface disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-on-surface"
    >
      <ArrowIcon className={`h-3.5 w-3.5 ${flip ? "-rotate-[135deg]" : "rotate-45"}`} />
    </button>
  );
}
