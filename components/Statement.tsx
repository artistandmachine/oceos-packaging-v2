"use client";

import Eyebrow from "./Eyebrow";
import Media from "./Media";
import Counter from "./Counter";
import Tbc from "./Tbc";
import Reveal, { RevealText } from "./Reveal";

type Stat = { value: number; suffix?: string; label: string; placeholder?: boolean };

/**
 * UC's "We move freight. We own the outcome.", set in ERA's caps. The
 * headline is two-tone (first sentence muted, the second full ink) and
 * stays pinned on the left with a small image above it, while the
 * stats scroll past on the right as big count-ups between hairlines.
 */
export default function Statement({
  eyebrow,
  heading,
  body,
  images,
  statsLabel,
  stats,
}: {
  eyebrow: string;
  heading: string;
  body: string[];
  images: string[];
  statsLabel: string;
  stats: Stat[];
}) {
  // Split after the first sentence: "We make|the bag." / "We own|the outcome."
  const cut = heading.indexOf(".") + 1;
  const [muted, strong] = cut > 0 ? [heading.slice(0, cut), heading.slice(cut).replace(/^\|/, "")] : ["", heading];

  return (
    <section id="about" aria-label={eyebrow} className="gutter py-28 md:py-40 lg:pt-mark">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <div className="flex flex-col gap-10 lg:sticky lg:top-mark">
            <Eyebrow>{eyebrow}</Eyebrow>
            <Media src={images[0]} sizes="(min-width: 1024px) 20vw, 60vw" className="aspect-[16/10] w-3/5 lg:w-2/5" />
            <h2 className="t-h1">
              {muted && <RevealText as="span" text={muted} className="block text-on-surface-variant/60" stagger={0.05} />}
              <RevealText as="span" text={strong} delay={0.15} className="block" stagger={0.05} />
            </h2>
            <div className="grid max-w-xl gap-5 sm:grid-cols-2">
              {body.map((p, i) => (
                <Reveal key={p} delay={i * 0.1} className="t-body text-on-surface-variant">
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-[30vh]">
          <p className="t-label border-b border-border pb-4">{statsLabel}</p>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05} className="flex flex-col gap-4 border-b border-border py-10 md:py-14">
              <span className="t-num">
                <Counter value={s.value} suffix={s.suffix} />
                <Tbc show={!!s.placeholder} />
              </span>
              <span className="t-label text-on-surface-variant">{s.label}</span>
            </Reveal>
          ))}
          <Media src={images[1]} sizes="(min-width: 1024px) 40vw, 100vw" className="mt-14 aspect-[4/3]" />
        </div>
      </div>
    </section>
  );
}
