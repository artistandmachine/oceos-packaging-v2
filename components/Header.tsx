"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { lockScroll, scrollToHash } from "@/lib/scroll";
import { openContact } from "@/lib/contact";
import { useBandTheme } from "@/lib/useBandTheme";
import { useLoaded } from "@/lib/loaded";
import { EASE } from "./Reveal";
import { Roll } from "./Button";
import { InstagramIcon, LinkedInIcon, Mark } from "./Icons";

type Link = { label: string; href: string };
type Company = {
  name: string;
  email: string;
  address: string[];
  instagram: string;
  linkedin: string;
};

/**
 * ERA's chrome: no bar, just two fixed corners. Top left, the OCEOS mark
 * (centered in the wide left gutter on desktop). Top
 * right, a serif "Book a call" (the one contact entry point: it opens
 * the Book-a-call drawer) with a small Menu label under it. Both read navy on cream and flip to cream over forest bands
 * and photos (lib/useBandTheme.ts). "Menu" opens a full-screen forest
 * overlay with big serif links.
 */
export default function Header({ links, company }: { links: Link[]; company: Company }) {
  const [open, setOpen] = useState(false);
  const loaded = useLoaded();
  const leftRef = useRef<HTMLAnchorElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftBand = useBandTheme(leftRef, leftRef);
  const rightBand = useBandTheme(rightRef, rightRef);
  const theme = (band: string) => (open ? "dark" : band === "light" ? undefined : band);

  // Only lock/unlock when `open` actually changes. Running on mount would
  // unlock the page while the Preloader still holds it.
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current !== open) {
      prevOpen.current = open;
      lockScroll(open);
    }
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setOpen(false);
    // wait for the overlay to start closing so Lenis is running again
    setTimeout(() => scrollToHash(null, href), 350);
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        {/* Below lg there's no side rail to park the badge in, so the corners
            sit on a solid strip in the current band's color instead of
            floating over content. */}
        <div
          data-theme={theme(leftBand)}
          className="absolute inset-x-0 top-0 h-24 shadow-[0_1px_0_var(--color-border)] transition-colors duration-500 md:h-32 lg:hidden"
        />
        {/* The mark's top is solved so its centre sits on the centre of
            the "Book a call" line: right block top + half the t-h4 size -
            half the mark (h-12 / h-14 / h-16). */}
        <a
          ref={leftRef}
          href="#top"
          aria-label={`${company.name}, back to top`}
          onClick={(e) => scrollToHash(e, "#top")}
          data-theme={theme(leftBand)}
          style={{ backgroundColor: "transparent" }}
          className="pointer-events-auto absolute left-4 top-[calc(1.5rem_+_var(--size-h4)/2_-_1.5rem)] block text-on-surface transition-colors duration-500 md:left-6 md:top-[calc(2.5rem_+_var(--size-h4)/2_-_1.75rem)] lg:left-[2.25rem] lg:top-[calc(2.5rem_+_var(--size-h4)/2_-_2rem)]"
        >
          <NudgeMark />
        </a>

        <div
          ref={rightRef}
          data-theme={theme(rightBand)}
          style={{ backgroundColor: "transparent" }}
          className="pointer-events-auto absolute right-5 top-6 flex flex-col items-end gap-4 text-right text-on-surface transition-colors duration-500 md:right-10 md:top-10 lg:right-16"
        >
          <button type="button" onClick={openContact} className="group t-h4 relative flex flex-col items-end pb-1">
            <Roll>Book a call</Roll>
            <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-current transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-0" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-overlay"
            className="group t-label flex items-center gap-2"
          >
            <Roll>{open ? "Close" : "Menu"}</Roll>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-overlay"
            data-theme="dark"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="gutter fixed inset-0 z-40 flex flex-col justify-between pb-8 pt-32 md:pt-40"
          >
            <nav className="flex flex-col items-center text-center">
              {links.map((l, i) => (
                <div key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                    className="group flex items-start gap-3 py-1"
                  >
                    <span className="t-label pt-[0.6em] tabular-nums text-on-surface-variant">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-h2 transition-opacity duration-500 group-hover:opacity-60">{l.label}</span>
                  </motion.a>
                </div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3"
            >
              <div className="flex flex-col gap-2">
                <span className="t-label text-on-surface-variant">Email</span>
                <a href={`mailto:${company.email}`} className="t-body hover:opacity-60">{company.email}</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="t-label text-on-surface-variant">Location</span>
                <span className="t-body">{company.address.join(", ")}</span>
              </div>
              <div className="flex items-end gap-4 md:justify-end">
                <a href={company.instagram} aria-label="Instagram" className="hover:opacity-60"><InstagramIcon className="h-6 w-6" /></a>
                <a href={company.linkedin} aria-label="LinkedIn" className="hover:opacity-60"><LinkedInIcon className="h-6 w-6" /></a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * The nav mark gives a small spring kick when scrolling starts or changes
 * direction: tips 5deg clockwise going down, counter-clockwise going up,
 * then springs back level with a slight wobble. Holding a scroll doesn't
 * keep it tilted; only the start of a scroll (after a pause) or a
 * reversal triggers it. Off under reduced motion.
 */
function NudgeMark() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const rotate = useSpring(0, { stiffness: 260, damping: 9, mass: 0.8 });
  const last = useRef({ dir: 0, t: 0 });
  const release = useRef<ReturnType<typeof setTimeout>>(undefined);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (reduce) return;
    const prev = scrollY.getPrevious() ?? y;
    const dir = Math.sign(y - prev);
    if (!dir) return;
    const now = performance.now();
    const idle = now - last.current.t > 250;
    if (dir !== last.current.dir || idle) {
      rotate.set(dir * 5);
      clearTimeout(release.current);
      release.current = setTimeout(() => rotate.set(0), 110);
    }
    last.current = { dir, t: now };
  });

  useEffect(() => () => clearTimeout(release.current), []);

  return (
    <motion.span className="block" style={reduce ? undefined : { rotate }}>
      <Mark className="block h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16" />
    </motion.span>
  );
}
