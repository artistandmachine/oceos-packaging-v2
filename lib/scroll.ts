"use client";

import { getLenis } from "@/components/SmoothScroll";

/** Smooth-scrolls to an in-page anchor through Lenis (falls back to native).
 * "#top" goes to 0. Non-hash hrefs (mailto:, http) are left alone. */
export function scrollToHash(e: React.MouseEvent<HTMLAnchorElement> | null, href: string) {
  if (!href.startsWith("#")) return;
  e?.preventDefault();
  const lenis = getLenis();
  const target = href === "#top" ? null : (document.querySelector(href) as HTMLElement | null);

  if (!target) {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (lenis) lenis.scrollTo(target, { duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth" });
}

/** Pause / resume page scroll (menu, drawer, preloader). */
export function lockScroll(locked: boolean) {
  const lenis = getLenis();
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}
