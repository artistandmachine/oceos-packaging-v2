"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { tune } from "@/lib/tune";

export const EASE = tune.ease;

/** Fade + rise on first view. Used for blocks (cards, paragraphs). */
export default function Reveal({
  children,
  delay = 0,
  y = 32,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Masked line-by-word rise for serif headlines (both reference sites do
 * this). Splits on spaces; a "|" in the string becomes a UC-style wide
 * gap. Screen readers get the plain sentence from a visually hidden
 * copy; the animated words are aria-hidden.
 */
export function RevealText({
  text,
  as = "h2",
  className = "",
  delay = 0,
  stagger = 0.06,
  play,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Drive it manually (e.g. hero waits for the preloader). When
   * omitted it plays on scroll into view. */
  play?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  // Tokens: words, plus "|" gap markers kept as their own token.
  const tokens = text.split(/(\|)|\s+/).filter((t): t is string => !!t && t.length > 0);
  const label = text.replace(/\|/g, " ").replace(/\s+/g, " ").trim();
  let wordIndex = 0;

  const trigger =
    play === undefined
      ? { whileInView: { y: "0%" }, viewport: { once: true, margin: "-8%" } }
      : { animate: { y: play ? "0%" : "110%" } };

  return (
    <Tag className={className}>
      <span className="sr-only">{label}</span>
      {tokens.map((t, i) => {
        if (t === "|") return <span key={i} aria-hidden="true" className="word-gap" />;
        const index = wordIndex++;
        return (
          <Fragment key={i}>
            <span aria-hidden="true" className="inline-block overflow-hidden whitespace-nowrap pb-[0.08em] align-top">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "110%" }}
                {...trigger}
                transition={{ duration: 1.1, ease: EASE, delay: delay + index * stagger }}
              >
                {t}
              </motion.span>
            </span>
            {/* Real space outside the mask so lines break between words. Inside
                the mask it could wrap on its own and double the line height. */}{" "}
          </Fragment>
        );
      })}
    </Tag>
  );
}
