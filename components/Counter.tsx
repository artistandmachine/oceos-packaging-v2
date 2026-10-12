"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/** Scroll-triggered, one-shot spring count-up (the NumberTicker idea from
 * the A&M Framer components). Starts at 0, springs to `value` the first
 * time it enters view, never replays. Reduced motion shows the final
 * number immediately. */
export default function Counter({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduceMotion = useReducedMotion();
  const raw = useMotionValue(reduceMotion ? value : 0);
  const spring = useSpring(raw, { stiffness: 50, damping: 20, mass: 1 });
  // Keep as many decimals as the target has, so 1.2 counts up as 0.0 -> 1.2.
  const decimals = (String(value).split(".")[1] ?? "").length;
  const display = useTransform(spring, (v) =>
    v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  );

  useEffect(() => {
    if (inView) raw.set(value);
  }, [inView, raw, value]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
