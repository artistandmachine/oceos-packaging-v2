"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Eyebrow from "./Eyebrow";
import Button from "./Button";
import Reveal, { RevealText, EASE } from "./Reveal";

type QA = { q: string; a: string };

/** UC's F.A.Q: heading left, accordion right, one open at a time. */
export default function Faq({
  eyebrow,
  heading,
  body,
  items,
  footnote,
  email,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  items: QA[];
  footnote: string;
  email: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" aria-label={eyebrow} className="gutter py-28 md:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <RevealText text={heading} className="t-h2" />
          <p className="t-body max-w-xs text-on-surface-variant">{body}</p>
        </div>

        <div className="lg:col-span-7">
          <ul className="border-t border-border">
            {items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${baseId}-${i}`;
              return (
                <Reveal as="li" key={item.q} delay={i * 0.04} y={16} className="border-b border-border">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
                  >
                    <span className="t-lead transition-transform duration-500 group-hover:translate-x-2">{item.q}</span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isOpen ? "border-accent bg-accent text-on-accent" : "border-border"
                      }`}
                      aria-hidden="true"
                    >
                      <span className="relative h-3 w-3">
                        <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                        <span className={`absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                      </span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="t-body max-w-xl pb-7 text-on-surface-variant">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              );
            })}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-body">{footnote}</p>
            <Button href={`mailto:${email}`} variant="outline">Email us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
