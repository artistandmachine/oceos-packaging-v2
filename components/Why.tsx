"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Eyebrow from "./Eyebrow";
import Media from "./Media";
import { RevealText, EASE } from "./Reveal";

type Item = { title: string; description: string; image: string };

/**
 * UC's "Why us" five, laid out like ERA's amenities: a list of big serif
 * titles on the left, one open at a time, with the matching image
 * crossfading in the frame on the right. Hover or click to switch.
 */
export default function Why({ eyebrow, heading, items }: { eyebrow: string; heading: string; items: Item[] }) {
  const [active, setActive] = useState(0);

  return (
    <section id="why" data-theme="mist" aria-label={eyebrow} className="gutter py-28 md:py-40">
      <div className="flex flex-col gap-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <RevealText text={heading} className="t-h1 max-w-[16ch]" />
      </div>

      <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] lg:order-2 lg:aspect-auto lg:min-h-[640px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="absolute inset-0"
            >
              <Media src={items[active].image} alt={items[active].title} sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
          <span className="t-label absolute right-4 top-4 z-20 rounded-full bg-surface px-3 py-2 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>

        <ul className="flex flex-col border-t border-border lg:order-1">
          {items.map((item, i) => {
            const open = i === active;
            return (
              <li key={item.title} className="border-b border-border">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="flex w-full items-baseline gap-5 py-6 text-left md:gap-8"
                >
                  <span className={`t-label tabular-nums transition-colors ${open ? "" : "text-on-surface-variant"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`t-h3 transition-colors duration-500 ${open ? "" : "text-on-surface-variant"}`}>
                    {item.title}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="t-body max-w-md pb-7 pl-[calc(11px*2+1.25rem)] text-on-surface-variant md:pl-[calc(11px*2+2rem)]">{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
