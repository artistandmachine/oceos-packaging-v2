"use client";

import { useEffect, useState } from "react";

/** True once the viewport is at least `px` wide. Starts false so the
 * server-rendered markup and the first client render agree (static
 * export has no `window`); flips after mount and on every resize that
 * crosses the threshold. */
export function useMinWidth(px: number) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [px]);

  return matches;
}
