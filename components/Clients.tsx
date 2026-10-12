"use client";

import { useState } from "react";
import { useImageOk } from "@/lib/useImageOk";
import { AnimatePresence, motion } from "framer-motion";
import Eyebrow from "./Eyebrow";
import Tbc from "./Tbc";
import Reveal, { RevealText, EASE } from "./Reveal";
import { ArrowIcon } from "./Button";

type Logo = { name: string; logo: string; placeholder?: boolean };
type Testimonial = { quote: string; name: string; role: string; company: string; placeholder?: boolean };

/**
 * UC's testimonials + partner wall on an ink band. One big serif quote
 * at a time with a counter and arrows, then a logo grid whose cells
 * flood with accent on hover (UC swaps default/hover logo art). Logos
 * are monochrome masks (see LogoCell); with no file yet, the client name.
 */
export default function Clients({
  eyebrow,
  heading,
  body,
  wallLabel,
  logos,
  testimonials,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  wallLabel: string;
  logos: Logo[];
  testimonials: Testimonial[];
}) {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <section id="clients" data-theme="dark" aria-label={eyebrow} className="weave gutter py-28 md:py-40">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <RevealText text={heading} className="t-h1 max-w-[14ch]" />
        </div>
        <p className="t-body max-w-sm text-on-surface-variant">{body}</p>
      </div>

      {/* Testimonial */}
      <div className="mt-20 grid gap-10 border-t border-border pt-10 md:mt-28 lg:grid-cols-12">
        <div className="flex items-center gap-3 lg:col-span-3 lg:flex-col lg:items-start lg:justify-between">
          <span className="t-label tabular-nums text-on-surface-variant">
            {String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
          <div className="ml-auto flex gap-3 lg:ml-0">
            <RoundButton label="Previous" onClick={() => go(-1)} flip />
            <RoundButton label="Next" onClick={() => go(1)} />
          </div>
        </div>
        <div className="min-h-[260px] lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col gap-10"
            >
              <blockquote className="t-h2 text-balance">
                &ldquo;{t.quote}&rdquo;
                <Tbc show={!!t.placeholder} />
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <span className="hatch h-12 w-12 overflow-hidden rounded-full bg-skeleton-fill" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="t-body font-semibold">{t.name}</span>
                  <span className="t-small text-on-surface-variant">
                    {t.role ? `${t.role} at ${t.company}` : t.company}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>

      {/* Logo wall */}
      <Reveal className="mt-24 md:mt-32">
        <p className="t-label mb-6 text-on-surface-variant">{wallLabel}</p>
        <ul className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-4">
          {logos.map((l, idx) => (
            <LogoCell key={`${l.name}-${idx}`} logo={l} />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function RoundButton({ label, onClick, flip }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-on-accent"
    >
      <ArrowIcon className={`h-3.5 w-3.5 ${flip ? "-rotate-[135deg]" : "rotate-45"}`} />
    </button>
  );
}

/**
 * One cell of the wall. Logos are drawn as a CSS mask filled with the
 * current text color, so any SVG dropped in public/brand/clients/ comes
 * out monochrome in the band's ink (cream here) whatever colors are in
 * the file, and flips with the hover flood like the text does. Until a
 * file exists at `logo`, the client's name shows instead.
 */
function LogoCell({ logo }: { logo: Logo }) {
  const ok = useImageOk(logo.logo);

  return (
    <li className="group relative flex aspect-[3/2] items-center justify-center overflow-hidden border-b border-r border-border">
      <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
      {ok ? (
        <span
          role="img"
          aria-label={logo.name}
          className="relative h-[34%] w-[58%] bg-on-surface opacity-85 transition-[background-color,opacity] duration-300 group-hover:bg-on-accent group-hover:opacity-100"
          style={{
            maskImage: `url("${logo.logo}")`,
            WebkitMaskImage: `url("${logo.logo}")`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: "contain",
            WebkitMaskSize: "contain",
          }}
        />
      ) : (
        <span className="t-h3 relative text-on-surface-variant transition-colors duration-300 group-hover:text-on-accent">
          {logo.name}
          <Tbc show={!!logo.placeholder} />
        </span>
      )}
    </li>
  );
}
