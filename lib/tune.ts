/**
 * TUNE: the motion numbers, in one place.
 *
 * Hero ranges are shares of the flight, 0 = top of the hero, 1 = the
 * cream veil fully closed. [start, end] means "happens between these
 * two points". Save and the page hot-reloads.
 *
 * Look lives in app/theme.css, copy in data/site.json.
 */

type Range = [number, number];

export const tune = {
  /** The house easing curve (cubic-bezier), used by every reveal. */
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],

  preloader: {
    /** Seconds. Never lands sooner than min; stops waiting at max; bails at bail. */
    min: 1.4,
    max: 5,
    bail: 6.5,
    /** How fast the word lists cycle, ms per word. */
    cycleMs: 180,
  },

  hero: {
    /** Scroll length in vh: the flight, then a hold on the finished frame. */
    flight: 220,
    hold: 50,
    /** Zoom out from `from` to 1 over `range`. `curve` > 1 starts slow. */
    zoom: { range: [0, 0.95] as Range, from: 1.9, curve: 1.6 },
    /** The water slides up (flying forward), as % of a 130%-tall layer. */
    forward: { range: [0, 0.95] as Range, to: "-23%" },
    /** Water softens (px of blur) and loses colour (0-1) with height. */
    blur: { range: [0.4, 0.75] as Range, px: 4 },
    desaturate: { range: [0.15, 0.7] as Range, amount: 0.4 },
    /** Cream haze over the water: opacity it reaches. */
    haze: { range: [0.1, 0.6] as Range, to: 0.5 },
    /** Title drifts up slightly. */
    titleDrift: { range: [0, 0.65] as Range, to: "-4%" },
    /** Title and wordmark turn cream to navy; the header flips at `headerFlip`. */
    titleToNavy: [0.36, 0.47] as Range,
    headerFlip: 0.415,
    /** Header: Book a call fades, then Menu rises into its place. */
    bookCallFade: [0.26, 0.42] as Range,
    menuLift: [0.42, 0.5] as Range,
    /** Cream veil closes over everything. */
    veil: [0.68, 0.95] as Range,
    /** The still photo (hero.pan in site.json): fills the screen's width,
     * opens centred showing `visible` of that width, and the climb zooms
     * out to all of it (replaces `zoom` and `forward` above). The cursor
     * drifts it toward the cropped parts, stopping at the edges.
     * speed: px per second with the cursor at the screen edge.
     * deadZone: share of the screen around the centre where it holds still.
     * response: how quickly it speeds up and glides to a stop (higher = snappier).
     * idle: once the cursor rests `after` seconds (or leaves the window) it
     * wanders on its own at `speed` x the full speed, turning gently, and
     * eases between the two at `response`. */
    pan: {
      visible: 0.9,
      speed: 40,
      deadZone: 0.15,
      response: 1.5,
      idle: { after: 2, speed: 0.25, response: 0.4 },
    },
    /** Cloud decks, far to near: when each passes, start/end scale, opacity. */
    clouds: [
      { range: [0.26, 0.9] as Range, scale: [2.2, 0.7] as Range, opacity: 0.5 },
      { range: [0.33, 0.93] as Range, scale: [3, 0.8] as Range, opacity: 0.9 },
      { range: [0.4, 0.96] as Range, scale: [4, 0.9] as Range, opacity: 1 },
    ],
  },

  process: {
    /** Scroll length: vh per step, plus extra. */
    vhPerStep: 60,
    extraVh: 100,
    /** Each step's spot on the loop, degrees clockwise from 12 o'clock. */
    angles: [270, 331, 29, 90, 158, 213],
  },

  header: {
    /** Degrees the nav mark tips when scrolling starts or reverses. */
    nudge: 5,
  },
};
