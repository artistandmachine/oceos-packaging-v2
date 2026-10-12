"use client";

import { useImageOk } from "@/lib/useImageOk";

type Logo = { name: string; logo: string };

/**
 * Endless strip of client logos (the hero's, under the paragraph). Two
 * copies of the row slide left by one copy's width (globals.css
 * .ticker-track), so it loops with no seam; the last 3rem each side fades. Pure CSS
 * transform, so it runs on the compositor; reduced motion holds it still.
 *
 * Logos are masks filled with the current text color, like the Clients
 * wall, so they come out monochrome and follow the hero title from cream
 * to navy. Until a file exists at `logo`, the client's name shows.
 */
export default function LogoTicker({ logos, label, className = "" }: { logos: Logo[]; label: string; className?: string }) {
  if (!logos.length) return null;

  return (
    <div
      role="region"
      aria-label={label}
      className={`overflow-hidden ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 3rem, #000 calc(100% - 3rem), transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 3rem, #000 calc(100% - 3rem), transparent)",
      }}
    >
      {/* ~1.7s per logo keeps the pace calm whatever the count */}
      <div className="ticker-track flex w-max" style={{ ["--ticker-duration" as string]: `${logos.length * 1.7}s` }}>
        <Row logos={logos} />
        <Row logos={logos} hidden />
      </div>
    </div>
  );
}

function Row({ logos, hidden }: { logos: Logo[]; hidden?: boolean }) {
  // pr matches the gap so both copies are exactly the same width.
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-[3.3rem] pr-[3.3rem] md:gap-[4.4rem] md:pr-[4.4rem]">
      {logos.map((l, i) => (
        <li key={`${l.name}-${i}`} className="shrink-0">
          <Mark logo={l} />
        </li>
      ))}
    </ul>
  );
}

function Mark({ logo }: { logo: Logo }) {
  const ok = useImageOk(logo.logo);

  if (!ok) {
    return <span className="block whitespace-nowrap font-serif text-[1.5125rem] uppercase leading-none opacity-80">{logo.name}</span>;
  }
  return (
    <span
      role="img"
      aria-label={logo.name}
      className="block h-[1.65rem] w-[7.7rem] bg-current opacity-80"
      style={{
        maskImage: `url("${logo.logo}")`,
        WebkitMaskImage: `url("${logo.logo}")`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
