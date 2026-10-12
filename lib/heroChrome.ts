import { motionValue } from "framer-motion";

/** 1 while the header's "Book a call" is showing over the hero, easing
 * to 0 as it goes. The hero drives it (the first clouds rolling in, or
 * the static hero scrolling away);
 * the header follows it: Book a call fades and Menu slides up into its
 * place. */
export const heroChrome = motionValue(1);

/** 0 to 1 as Menu rises into Book a call's place. Starts only once
 * heroChrome has reached 0, so Book a call is fully gone first. */
export const heroMenuLift = motionValue(0);
