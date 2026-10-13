"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLoaded, usePreloadAsset } from "@/lib/loaded";
import { useMinWidth } from "@/lib/useMinWidth";
import { heroChrome, heroMenuLift } from "@/lib/heroChrome";
import { RevealText, EASE } from "./Reveal";
import LogoTicker from "./LogoTicker";
import { tune } from "@/lib/tune";

type Cloud = { src: string };

/** Every number in the flight lives in lib/tune.ts (tune.hero). */
const T = tune.hero;
type Video = { webm: string; mp4: string; poster: string };
type Logo = { name: string; logo: string };

/**
 * The flight (UC's space-to-white opening, climbing straight up):
 *  1. A top-down drone loop of open ocean (hovering; the waves move, the
 *     camera doesn't) fills the screen, with the title over it.
 *  2. Scrolling pins it and zooms the footage out from 1.9x to 1x about
 *     the centre, slow at first then faster, so you lift off the water,
 *     while the water slides up the screen (flying forward as you climb).
 *     The water softens and loses colour and a cream haze thickens with
 *     height.
 *  3. Three transparent cloud decks arrive huge and soft, then shrink
 *     toward the centre as you climb past them (nearer decks shrink
 *     further), then
 *     a cream veil closes over everything. It ends on the page's exact
 *     cream, so the next section starts with no seam.
 *
 * The video just loops; scroll only drives transforms (scrubbing
 * currentTime is janky and unreliable on iOS). It pauses once the veil
 * has closed or the hero is off screen. Missing files fall back to an
 * ocean gradient and CSS clouds. Phones and reduced motion get the still
 * poster, the title, and a short fade to cream, no pin, no video.
 */
export default function Hero({
  eyebrow,
  titleTop,
  titleBottom,
  script,
  since,
  sub,
  video,
  clouds,
  wordmark,
  logos = [],
  logosLabel = "Clients",
}: {
  eyebrow: string;
  titleTop: string;
  /** Optional second display line. */
  titleBottom?: string;
  script: string;
  since: string;
  sub: string;
  video: Video;
  clouds: Cloud[];
  /** OCEOS PACKAGING wordmark (company.wordmark), top centre on the mark line. */
  wordmark: string;
  /** Client logos for the ticker under the paragraph (site.clients.logos). */
  logos?: Logo[];
  logosLabel?: string;
}) {
  const wide = useMinWidth(768);
  const reduce = useReducedMotion();
  const copy = { eyebrow, titleTop, titleBottom, script, since, sub, logos, logosLabel };

  // Static hero: the header's Book a call goes as the hero scrolls half a
  // screen away (the flight drives heroChrome itself, in Ascent).
  useEffect(() => {
    if (wide && !reduce) return;
    const update = () => {
      const top = document.getElementById("hero")?.getBoundingClientRect().top ?? 0;
      const gone = -top / window.innerHeight; // screens scrolled past the hero top
      heroChrome.set(Math.min(1, Math.max(0, 1 - gone / 0.5)));
      heroMenuLift.set(Math.min(1, Math.max(0, (gone - 0.5) / 0.25)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [wide, reduce]);

  if (!wide || reduce) {
    return (
      <section id="hero" aria-label="Intro" className="relative">
        {/* The photo runs 6rem past the screen so the fade into the page
            cream happens below the fold, not under the logo ticker. */}
        <div data-band="dark" className="relative h-[calc(100svh+6rem)] overflow-hidden">
          <Ocean video={video} still />
          <Scrim />
          <Wordmark src={wordmark} />
          <div className="absolute inset-x-0 top-0 h-[100svh]">
            <Title {...copy} />
          </div>
        </div>
        {/* Short fade from the footage into the page cream */}
        <div aria-hidden="true" className="-mt-24 relative h-24 bg-gradient-to-b from-transparent to-surface" />
      </section>
    );
  }

  return <Ascent copy={copy} video={video} clouds={clouds} wordmark={wordmark} />;
}

type Copy = {
  eyebrow: string;
  titleTop: string;
  /** Optional second display line. */
  titleBottom?: string;
  script: string;
  since: string;
  sub: string;
  logos: Logo[];
  logosLabel: string;
};

function Ascent({ copy, video, clouds, wordmark }: { copy: Copy; video: Video; clouds: Cloud[]; wordmark: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // The flight runs over the first 220vh of scroll; the last 50vh holds
  // the finished frame (navy title on cream) before Reasons comes up.
  // Everything below is keyed to `p`, the flight's own 0-1.
  const p = useTransform(scrollYProgress, [0, T.flight / (T.flight + T.hold)], [0, 1]);

  // Climb straight up: no sliding, the whole view shrinks toward the
  // centre (1.9 -> 1) as the camera rises, slow off the water then
  // speeding up (ease-in). The footage only fills the screen, so 1.9x
  // is about the 1920px source's limit at desktop widths.
  const zoom = useTransform(p, T.zoom.range, [T.zoom.from, 1], { ease: (t) => t ** T.zoom.curve });
  // ...while the water also slides up the screen (flying forward as you
  // climb). % is of the footage layer (130% of the screen tall), so 23%
  // ~ 30svh, leaving its bottom edge at the fold.
  const forward = useTransform(p, T.forward.range, ["0%", T.forward.to]);
  // Altitude: the water goes soft and loses colour, and the cream haze
  // thickens, as you climb.
  const look = useTransform(p, (v) => {
    const k = (a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
    return `blur(${T.blur.px * k(...T.blur.range)}px) saturate(${1 - T.desaturate.amount * k(...T.desaturate.range)})`;
  });
  const haze = useTransform(p, T.haze.range, [0, T.haze.to]);

  // Title never fades and sits above the clouds and veil, so it reads for
  // the whole flight. It drifts up slightly, and turns from cream to navy
  // quickly as the haze and clouds whiten the sky behind it, ending navy
  // on the cream veil. Mixed in CSS from the theme's brand colours, so
  // changing them in app/theme.css carries through.
  const titleY = useTransform(p, T.titleDrift.range, ["0%", T.titleDrift.to]);
  const navy = useTransform(p, T.titleToNavy, [0, 100]);
  const titleColor = useTransform(navy, (v) => `color-mix(in srgb, var(--brand-navy) ${v}%, var(--brand-cream))`);
  // The header's Book a call fades as the first clouds roll in
  // (lib/heroChrome.ts); Menu then rises into its place once it's gone.
  // The wordmark stays, turning navy with the title.
  const markFade = useTransform(p, T.bookCallFade, [1, 0]);
  const menuLift = useTransform(p, T.menuLift, [0, 1]);
  useMotionValueEvent(markFade, "change", (v) => heroChrome.set(v));
  useMotionValueEvent(menuLift, "change", (v) => heroMenuLift.set(v));
  useEffect(() => {
    heroChrome.set(markFade.get());
    heroMenuLift.set(menuLift.get());
  }, [markFade, menuLift]);
  // Cream closes over everything at the top of the climb
  const veil = useTransform(p, T.veil, [0, 1]);

  // Header chrome (mark, Book a call, menu) reads cream over the ocean and
  // flips to navy halfway through the title's color change (its own
  // 500ms color transition carries it across with the title).
  const [band, setBand] = useState<"dark" | "light">("dark");
  // The video only plays while you can see it: not once the cream veil
  // has closed, not after the hero has scrolled away.
  const [covered, setCovered] = useState(false);
  const [inView, setInView] = useState(true);
  useMotionValueEvent(p, "change", (v) => {
    setBand(v < T.headerFlip ? "dark" : "light");
    setCovered(v >= T.veil[1] + 0.01);
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="hero" aria-label="Intro" className="relative" style={{ height: `${100 + T.flight + T.hold}vh` }}>
      <div data-band={band} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Outer: screen-sized, zooms out about the screen's centre. It
            never drops below 1, so the inner layer always covers.
            Inner: 130% of the screen tall, anchored at the top, so the
            upward slide has runway. */}
        <motion.div className="absolute inset-0" style={{ scale: zoom, filter: look }}>
          <motion.div className="absolute inset-x-0 top-0 h-[130%]" style={{ y: forward }}>
            <Ocean video={video} playing={inView && !covered} />
          </motion.div>
        </motion.div>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[var(--brand-cream)]" style={{ opacity: haze }} />
        <Scrim />

        {/* Far to near. Each deck arrives huge and soft around you, then
            shrinks toward the centre, dropping away below as you climb
            past it. Nearer decks start bigger and shrink further
            (parallax). No sliding: straight up. */}
        {T.clouds.map((c, i) => (
          <CloudLayer key={i} cloud={clouds[i]} progress={p} {...c} index={i} />
        ))}

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-surface" style={{ opacity: veil }} />

        <motion.div className="pointer-events-none absolute inset-0" style={{ y: titleY }}>
          <Title {...copy} color={titleColor} />
        </motion.div>
        <Wordmark src={wordmark} color={titleColor} />
      </div>
    </section>
  );
}

/** Title block over the footage. Always cream (it only ever sits on
 * water), via data-theme so the tokens flip. It ignores the pointer, so
 * lib/useBandTheme samples through it to the stage's data-band instead of
 * reading this as dark. */
function Title({ eyebrow, titleTop, titleBottom, script, since, sub, logos, logosLabel, color }: Copy & { color?: MotionValue<string> }) {
  const loaded = useLoaded();
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: loaded ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  // Lines 1-4 (lead-in / REUSABLE / shopping bags / sign-off) start
  // 20% of the screen height from the top (160px on an 800px-tall
  // screen); "\n" in the copy breaks lines 1 and 4. A
  // rule fills the space between line 4 and the paragraph; the paragraph
  // sits as far above the logo ticker as the ticker sits above the bottom. Lines 1->2 and
  // 3->4 share one gap (--hero-gap) so the lead-in and the sign-off sit
  // the same distance off the display pair. The paragraph and its rule
  // follow and settle at the bottom when there's room.
  return (
    <motion.div
      data-theme="dark"
      style={{ backgroundColor: "transparent", color, ["--hero-gap" as string]: "clamp(1.5rem, 4.5svh, 3rem)" }}
      className="gutter pointer-events-none absolute inset-0 flex flex-col items-center pb-10 pt-[20svh] text-center"
    >
      <h1 className="flex flex-col items-center">
        <motion.span {...fade(0)} className="t-label mb-[var(--hero-gap)] block whitespace-pre-line">
          {eyebrow}
        </motion.span>
        <RevealText as="span" text={titleTop} play={loaded} className="t-mega block text-[min(24vw,26svh)] md:text-[min(16vw,26svh)]" stagger={0.08} />
        {titleBottom && (
          <RevealText as="span" text={titleBottom} play={loaded} delay={0.14} className="t-mega -mt-[0.06em] block text-[min(24vw,26svh)] md:text-[min(16vw,26svh)]" stagger={0.08} />
        )}
        <motion.span {...fade(0.5)} className="t-script -mt-[0.35em] block whitespace-nowrap text-[clamp(2.5rem,min(6vw,11svh),6rem)]">
          {script}
        </motion.span>
        <motion.span {...fade(0.6)} className="t-label mt-[var(--hero-gap)] block whitespace-pre-line">
          {since}
        </motion.span>
      </h1>

      {/* Line 4 -> rule (stretches to fill whatever height is left) ->
          paragraph -> 40px -> logo ticker -> 40px -> bottom edge. */}
      <motion.div {...fade(0.7)} className="mt-4 flex min-h-0 flex-1 flex-col items-center">
        <span aria-hidden="true" className="min-h-3 w-px flex-1 bg-current/50" />
        <p className="t-body mt-4 max-w-[36ch]">{sub}</p>
      </motion.div>
      {/* Runs to 160px off each side (20px on phones) */}
      <motion.div {...fade(0.8)} className="mt-10 w-[calc(100vw-2.5rem)] shrink-0 md:w-[calc(100vw-320px)]">
        <LogoTicker logos={logos} label={logosLabel} />
      </motion.div>
    </motion.div>
  );
}

/** OCEOS PACKAGING, top centre on the nav mark's line (--mark-y). Like
 * the title it never fades and sits above the clouds and veil, cream
 * over the water and navy (`color`) by the end of the flight. A mask
 * filled with the color. md+; phones have no room between the header
 * corners. */
function Wordmark({ src, color }: { src: string; color?: MotionValue<string> }) {
  const loaded = useLoaded();
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="pointer-events-none absolute left-1/2 top-[var(--mark-y)] hidden h-[1.125rem] -translate-x-1/2 -translate-y-1/2 md:block lg:h-5"
      style={{ aspectRatio: "324 / 24" }}
    >
      <motion.span
        className="block h-full w-full bg-[var(--brand-cream)]"
        style={{
          backgroundColor: color,
          maskImage: `url("${src}")`,
          WebkitMaskImage: `url("${src}")`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </motion.div>
  );
}

/** Legibility shading for the title. Its own fixed layer (not part of the
 * title) so nothing with an edge ever moves or scales over the footage. */
function Scrim() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-black/35" />;
}

/** The drone loop over its poster. Falls back to the poster, then to a
 * moving ocean gradient if neither file exists yet. AV1 WebM first (half
 * the size), H.264 MP4 for browsers without AV1. Both hold the preloader
 * until ready (lib/loaded.ts). The tropical grade and the cross-faded
 * loop seam are baked into the files (see CLAUDE.md), so nothing is
 * composited over the footage at runtime. */
function Ocean({ video, still, playing = true }: { video: Video; still?: boolean; playing?: boolean }) {
  const [videoOk, setVideoOk] = useState(true);
  const [posterOk, setPosterOk] = useState(true);
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  usePreloadAsset(posterRef);
  usePreloadAsset(videoRef);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing]);

  return (
    <div className="ocean-placeholder absolute inset-0">
      {posterOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={posterRef} src={video.poster} alt="" aria-hidden="true" onError={() => setPosterOk(false)} className="absolute inset-0 h-full w-full object-cover" />
      )}
      {!still && videoOk && (
        <video
          ref={videoRef}
          poster={posterOk ? video.poster : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={video.webm} type='video/webm; codecs="av01.0.08M.08"' />
          {/* With <source> children the error lands on the last source,
              not the video, once every source has failed. */}
          <source src={video.mp4} type="video/mp4" onError={() => setVideoOk(false)} />
        </video>
      )}
    </div>
  );
}

/**
 * One cloud deck, seen from a camera looking straight down while it
 * climbs. You can't see a deck until you're inside it, so it arrives huge
 * and soft (filling the frame, swallowing the title), then shrinks and
 * sharpens as you rise past it and it falls away below, opening gaps
 * onto the water. Nearer decks start bigger and shrink further, which is
 * what gives the stack depth.
 */
function CloudLayer({
  cloud,
  progress,
  range,
  scale,
  opacity,
  index,
}: {
  cloud?: Cloud;
  progress: MotionValue<number>;
  range: [number, number];
  scale: [number, number];
  opacity: number;
  index: number;
}) {
  const [ok, setOk] = useState(true);
  const ts = useTransform(progress, range, scale);
  // Slow fade in, so each deck thickens rather than appears.
  const to = useTransform(progress, [range[0], range[0] + 0.16], [0, opacity]);
  const blur = useTransform(progress, [range[0], range[0] + (range[1] - range[0]) * 0.6], ["blur(18px)", "blur(0px)"]);

  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-[-15%]" style={{ scale: ts, opacity: to, filter: blur }}>
      {cloud && ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cloud.src} alt="" onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className={`cloud-placeholder cloud-placeholder-${index + 1} absolute inset-0`} />
      )}
    </motion.div>
  );
}
