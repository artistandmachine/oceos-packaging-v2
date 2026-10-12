"use client";

import { useEffect, useState, type RefObject } from "react";

export type Band = "light" | "dark" | "mist";

/**
 * Which band is underneath a fixed element (ERA's nav and side rail flip
 * from navy to cream as forest bands and photos pass beneath them).
 *
 * Samples the page at the element's centre with elementFromPoint (the
 * fixed element itself must be pointer-events-none, or be skipped via
 * `ignore`), then walks up to the nearest [data-band] or [data-theme].
 * Put data-band="dark" on any full-bleed photo so chrome turns light
 * over it.
 */
export function useBandTheme(ref: RefObject<HTMLElement | null>, ignore?: RefObject<HTMLElement | null>) {
  const [band, setBand] = useState<Band>("light");

  useEffect(() => {
    let frame = 0;
    function sample() {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const prev = ignore?.current?.style.pointerEvents;
      if (ignore?.current) ignore.current.style.pointerEvents = "none";
      const hit = document.elementFromPoint(x, y);
      if (ignore?.current) ignore.current.style.pointerEvents = prev ?? "";
      const owner = hit?.closest<HTMLElement>("[data-band],[data-theme]");
      const value = owner?.dataset.band ?? owner?.dataset.theme;
      setBand(value === "dark" || value === "mist" ? value : "light");
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(sample);
    }
    sample();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The preloader and menu overlays change what's under us without a scroll.
    const id = setInterval(schedule, 400);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      clearInterval(id);
    };
  }, [ref, ignore]);

  return band;
}
