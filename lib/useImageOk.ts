"use client";

import { useEffect, useState } from "react";

/** True once `src` has loaded. False while loading, on error, or with no
 * src, so callers can show a fallback (e.g. a client name until its logo
 * file lands in public/brand/clients/). */
export function useImageOk(src?: string) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
    img.src = src;
  }, [src]);

  return ok;
}
