"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * One line of text sized to exactly fill its container's width. Scales
 * from whatever size it's at now (width is proportional to font size), so
 * there's no reset-and-measure step; writes the size straight to the
 * element rather than through React state, which would skip the update
 * when a re-fit computes the same number. Re-fits on resize and once web
 * fonts load (the display face changes the width). Hidden until the first
 * fit so it never flashes at the wrong size.
 */
export default function FitText({ text, className = "" }: { text: string; className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const span = textRef.current;
    if (!box || !span) return;
    const fit = () => {
      const current = parseFloat(getComputedStyle(span).fontSize);
      const width = span.getBoundingClientRect().width;
      if (!current || !width || !box.clientWidth) return;
      span.style.fontSize = `${(current * box.clientWidth) / width}px`;
      span.style.visibility = "visible";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div ref={boxRef} className="w-full overflow-hidden">
      <span ref={textRef} className={`invisible block w-max whitespace-nowrap text-[100px] ${className}`}>
        {text}
      </span>
    </div>
  );
}
