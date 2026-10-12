"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Media from "./Media";
import Eyebrow from "./Eyebrow";
import { RevealText } from "./Reveal";

/**
 * ERA's closing "Sea views" panel: full screen, rises as an arch and
 * flattens to a rectangle as it scrolls in. Eyebrow on top; the giant
 * caps and the caller's `children` grouped in the middle below it. Used by the Reasons
 * intro and the closing CTA, so the motion stays identical.
 *
 * theme "dark" (CTA): a photo with a slow zoom-out under a scrim, cream text.
 * theme "mist" (Reasons): a solid mist-blue arch with navy text, no photo,
 * so it runs straight into the mist band that follows.
 */
export default function ArchPanel({
  eyebrow,
  heading,
  image,
  theme = "dark",
  stacked = false,
  children,
}: {
  eyebrow: string;
  heading: string;
  image?: string;
  theme?: "dark" | "mist";
  /** Group the eyebrow in the middle too, instead of leaving it at the
   * top of the screen. */
  stacked?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.9], ["50vw 50vw 0vw 0vw", "0vw 0vw 0vw 0vw"]);

  return (
    <div ref={ref}>
      <motion.div
        data-theme={theme}
        style={reduce ? undefined : { borderRadius: radius }}
        className={`gutter relative flex min-h-[100svh] flex-col items-center overflow-hidden py-16 text-center md:py-24 ${stacked ? "" : "lg:pt-mark "}${
          stacked ? "justify-center gap-8 md:gap-12" : "justify-between"
        }`}
      >
        {image && (
          <motion.div className="absolute inset-0" style={reduce ? undefined : { scale }}>
            <Media src={image} rounded={false} sizes="100vw" className="h-full w-full" />
          </motion.div>
        )}

        <div className="relative">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        {stacked ? (
          <>
            <RevealText text={heading} className="t-mega relative max-w-[12ch]" stagger={0.08} />
            <div className="relative flex flex-col items-center gap-8">{children}</div>
          </>
        ) : (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-8 md:gap-10">
            <RevealText text={heading} className="t-mega relative max-w-[12ch]" stagger={0.08} />
            <div className="relative flex flex-col items-center gap-8 md:gap-10">{children}</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
