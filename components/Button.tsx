"use client";

import { scrollToHash } from "@/lib/scroll";
import { openContact } from "@/lib/contact";

/**
 * ERA's call to action: an uppercase serif label on a hairline underline,
 * no pill. On hover the label rolls (both reference sites double the
 * label in markup: "Book a callBook a call") and the underline wipes out
 * and back in.
 *
 * variant:
 *   "solid"    serif label, the primary action
 *   "outline"  small expanded-sans label, secondary actions
 *   "ring"     ERA's "View available apartments" circle
 *
 * href:
 *   "#contact"  opens the Book a call drawer
 *   "#section"  smooth-scrolls via Lenis
 *   anything else behaves as a normal link
 */
export default function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: string;
  variant?: "solid" | "outline" | "ring";
  className?: string;
}) {
  const external = href.startsWith("http");

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (href === "#contact") {
      e.preventDefault();
      openContact();
      return;
    }
    scrollToHash(e, href);
  }

  const common = {
    href,
    onClick,
    target: external ? "_blank" : undefined,
    rel: external ? "noreferrer" : undefined,
  };
  const focus = "focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-current";

  if (variant === "ring") {
    return (
      <a {...common} className={`group t-label relative flex aspect-square w-36 shrink-0 select-none items-center justify-center rounded-full text-center md:w-44 ${focus} ${className}`}>
        <span className="absolute inset-0 rounded-full border border-current opacity-40 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110" />
        <span className="max-w-[9ch]"><Roll>{children}</Roll></span>
      </a>
    );
  }

  return (
    <a
      {...common}
      className={`group relative inline-flex shrink-0 select-none flex-col pb-1 ${variant === "solid" ? "t-h4" : "t-label"} ${focus} ${className}`}
    >
      <Roll>{children}</Roll>
      <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-current transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-0" />
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform delay-200 duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
    </a>
  );
}

/** The doubled-label roll. Parent needs the `group` class. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden="true">
      <path d="M2 10L10 2M10 2H3.5M10 2V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}
