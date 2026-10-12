"use client";

import { Fragment, useRef } from "react";
import { easeInOut, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Media from "./Media";
import ArchPanel from "./ArchPanel";

type Item = { title: string; body: string; image: string };

// Extra scroll (svh) each card stays pinned and readable before the next
// one starts sliding over it.
const HOLD = 70;

/**
 * "Three reasons to choose OCEOS", in two moves:
 *  1. The same arch as the closing CTA (ArchPanel), in solid mist: rises
 *     as an arch and flattens straight into the mist band; eyebrow, giant
 *     heading and the display tagline grouped in the middle.
 *  2. Full-width cards pin and stack on the mist band. Each holds for
 *     HOLD svh of scroll so it can be read, then shrinks and dims a touch
 *     only while the next one slides over it.
 */
export default function Reasons({
  eyebrow,
  heading,
  tagline,
  items,
}: {
  eyebrow: string;
  heading: string;
  tagline: string;
  items: Item[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="reasons" aria-label={eyebrow}>
      <ArchPanel eyebrow={eyebrow} heading={heading} theme="mist" stacked>
        <p className="t-h2 max-w-[18ch] text-balance">{tagline}</p>
      </ArchPanel>

      <div data-theme="mist" className="gutter">
        <div ref={ref} className="relative">
          {items.map((item, i) => (
            <Fragment key={item.title}>
              <Card item={item} index={i} total={items.length} progress={scrollYProgress} />
              {/* Hold: the stuck card stays fully readable while this
                  scrolls past, before the next card starts to cover it. */}
              {i < items.length - 1 && <div aria-hidden="true" style={{ height: `${HOLD}svh` }} />}
            </Fragment>
          ))}
        </div>
        <div className="h-28 md:h-40" />
      </div>
    </section>
  );
}

function Card({
  item,
  index,
  total,
  progress,
}: {
  item: Item;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  // Scroll (in svh) through the stack: each card is 100svh tall with a
  // HOLD spacer after it, so card i+1 enters the viewport at
  // (i+1)(100+HOLD) - 100 and finishes covering card i at (i+1)(100+HOLD).
  // Card i only shrinks and dims across that window, as a fraction of the
  // stack's scrollable distance.
  const stack = total * 100 + (total - 1) * HOLD;
  const scrollable = stack - 100;
  const arrive = (index + 1) * (100 + HOLD);
  const start = Math.max(0, (arrive - 100) / scrollable);
  const end = Math.min(1, arrive / scrollable);
  const isLast = index === total - 1;
  // Eased, and gentle, so the handoff reads as one card settling back
  // under the next rather than a mechanical shrink.
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.97], { ease: easeInOut });
  const dim = useTransform(progress, [start, end], [0, isLast ? 0 : 0.18], { ease: easeInOut });
  const dark = index % 2 === 1;

  return (
    // Centered in the viewport: equal room above and below (13rem total
    // clears the nav corners at the top). Every card pins at the same spot,
    // so the next one (full size) completely hides the shrinking one under it.
    <div className="sticky top-0 flex h-[100svh] items-center">
      <motion.article
        style={reduce ? undefined : { scale }}
        data-theme={dark ? "dark" : undefined}
        className={`relative grid h-[calc(100svh-13rem)] w-full origin-top grid-cols-1 gap-6 overflow-hidden p-5 md:grid-cols-2 md:gap-10 md:p-10 ${dark ? "" : "bg-[var(--brand-cream)]"}`}
      >
        <div className="flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between">
            <span className="t-num">{index + 1}</span>
            <span className="t-label tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="t-h2 max-w-[11ch]">{item.title}</h3>
            <p className="t-body max-w-[38ch] text-on-surface-variant">{item.body}</p>
          </div>
        </div>
        <Media src={item.image} alt={item.title} sizes="(min-width: 768px) 50vw, 100vw" className="min-h-48 h-full w-full" />
        {!reduce && <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />}
      </motion.article>
    </div>
  );
}
