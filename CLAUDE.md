@AGENTS.md

# OCEOS Packaging v2: project context

One-page marketing site for OCEOS Packaging (reusable rPET and non-woven PP bags for enterprise retail). Built for Bion (Studio A&M). Prefers casual, brief replies with real opinions; no filler.

## Direction (decided)
- **Style (updated 2026-10-07 after viewing both live sites):** the *look* is **era-residence.com** (condensed uppercase Didone display, script accent word, tiny bold expanded labels, cream / mist-blue / forest bands, arches,  underlined serif CTAs, giant email in footer). *Structure and scroll moments* are **unitedcarriers.com** (preloader count, pinned expanding image, two-tone statement + stat column, route draw). Explicitly NOT the studio-anm look (Bion rejected that). Keep the same *stack* as studio-anm (`~/Cortex/dev/studio-anm`) but none of its visuals.
- One page for now.
- Site copy rules: confident, declarative, fragments fine, **no em dashes**, no "we offer" constructions.

## Where to change what
Bion vibe-codes (no Figma step), so every knob lives in one of three files. Keep it that way: when a value gets tweaked by hand, move it into one of these instead of burying it in a component.

| Change | File |
|---|---|
| Words, links, image/video paths, lists | `data/site.json` |
| Colours, band modes, fonts, type sizes, gutters, mark line, texture strength | `app/theme.css` |
| Motion: hero flight ranges, preloader timing, Process loop angles, easing | `lib/tune.ts` |

Font *faces* are loaded in `app/layout.tsx` (next/font, as `--font-montserrat` etc.); theme.css maps them to sans/serif/script. `app/globals.css` is plumbing (Lenis, cursors, band backgrounds, weave mask, hero stand-ins). Components hold structure and one-off layout classes.

## Stack
Next.js 16 static export (`output: "export"`), Tailwind v4 (CSS-only config: `@theme` in `app/theme.css`, no tailwind.config.js), Framer Motion 11, Lenis. The Style Dictionary / tokens JSON pipeline was removed 2026-10-12 when Bion moved off Figma-first. `npm run dev` on port 3001. Fonts via `next/font/google`: Oranienbaum (display, stands in for ERA's Ambroise), Ballet (script accent), Montserrat (text/labels, stands in for Maison Neue Extended; swapped from Archivo 125% width on 2026-10-11).

## How it's built
- **All copy** lives in `data/site.json`. Components only read from it. `"placeholder": true` shows an amber TBC badge in dev only (`components/Tbc.tsx`).
- `|` in a headline string = UC-style wide word gap (`components/Gap.tsx`, `RevealText` in `components/Reveal.tsx`).
- **Colours:** all in `app/theme.css` (palette `--brand-*`, semantic `--color-*` as Tailwind `@theme` so `bg-surface` etc. work, dark/mist overrides under it). `forest` is now navy-teal `#173A4C` but `forest-deep` is still the old olive `#566330` (rename/fix pending). Palette history: ERA's cream, navy (ink + accent) and mist, plus a muted olive `forest` `#57642B` for dark bands (history: ERA's plum, then Tengile's olive `#5C6E21`, then a rainforest `#22503B`; Bion settled on the olive hue at lower saturation; a moss green `#4B5C3D` was tried 2026-10-11 and reverted). Mist is `#DEE7ED` (was ERA's `#B5CEDB`). `-deep` variants are derived at the same lightness ratio. Muted text on forest is `sage` `#DBDECF`, 4.7:1 AA. `data-theme="dark"` (forest) or `data-theme="mist"` on ANY element flips tokens inside it. Mist only overrides surfaces, so don't nest it inside a dark band.
- Type classes in `app/theme.css` (sizes are `--size-*` vars at the top): `.t-mega .t-h1 .t-h2 .t-h3 .t-h4 .t-num .t-spaced` (serif, uppercase), `.t-script`, `.t-lead .t-body .t-small .t-label` (expanded sans), `.gutter` (wide on lg to clear the side rail), `.word-gap`, `.weave` (in globals.css; rPET spunbond diamond-dot texture, token-colored mask; on the preloader and the forest bands Process/Clients/Footer), `.hatch` (same weave, stronger, for media placeholders).
- **Fixed chrome:** `Header` is two corners (OCEOS `Mark` top left, serif Book a call + Menu top right; Book a call opens the drawer but only lives over the hero: it fades as the first clouds roll in (flight 0.26-0.42) via `lib/heroChrome.ts` (a shared motion value the hero drives) and Menu, with To top under it at the footer, slides up onto the mark line in its place; solid strip below lg). No scroll progress indicator: ERA's rail was too close to ERA, and a compass replacement was dropped because it competed with the circular mark. The header recolors via `lib/useBandTheme.ts`, which samples what's underneath; put `data-band="dark"` on full-bleed photos so chrome turns cream over them.
- `Button` variants: `solid` (underlined serif), `outline` (underlined label), `ring` (ERA circle).
- Shared libs: `lib/scroll.ts` (Lenis-aware `scrollToHash`, `lockScroll`), `lib/contact.ts` (`openContact()` event → `ContactDrawer`), `lib/loaded.ts` (preloader → hero handoff, plus an asset registry: above-the-fold media calls `usePreloadAsset(ref)` and the preloader count follows real progress, min 1.4s / max 5s), `lib/useMinWidth.ts`.
- `Button` href `"#contact"` opens the Book-a-call drawer. Drawer submits via `mailto:` (no backend yet).
- `Media` shows a hatched placeholder + expected filename (dev only) until the image exists at its path.

## Page order (app/page.tsx)
Preloader → Header (corners + full-screen menu) → Hero (wordmark top centre on the mark line, md+; like the title it never fades, sits above clouds and veil and turns navy with it (Bion: the client should see it with the copy); "the flight": pinned 370vh = 220vh of flight + a 50vh hold on the finished frame (all flight numbers in `tune.hero`) before Reasons; title never fades, sits above clouds and veil; under it a rule stretches from line 4 to the paragraph, then a client-logo ticker (`components/LogoTicker.tsx`, CSS marquee, masks in text color, names until files land in `public/brand/clients/`) with 40px from paragraph to ticker and ticker to the bottom edge, running to 160px from each side; and turns cream to navy over flight 0.36-0.47 with the header band flipping at 0.415 so the mark goes navy with it; top-down drone ocean loop (Adobe Firefly clip, hovering camera, waves move) with "One / bag / at a time." over it. The flight climbs straight up: the footage (a layer 130% of the screen tall, sliding up ~30svh so you also fly forward) zooms out 1.9 to 1 about the centre with an ease-in, water blurs and desaturates (saturate 1 to 0.6) and the cream haze thickens to 0.5; three transparent cloud decks arrive huge and blurred then shrink toward the centre (no slide; replaced a 1.15 zoom + 55svh slide on 2026-10-12 because it didn't read as gaining altitude; Bion wanted the slide kept, smaller); cream veil closes so the page continues seamlessly. Video only loops (AV1 WebM crf 42 + H.264 MP4 crf 28 in `public/videos/hero/ocean-firefly.*`, source in `imported/`). Baked into the files, no runtime overlay: a natural blue grade: half strength of a cobalt grade matched to a screenshot Bion picked (ffmpeg `curves=r='0/0 0.12/0.095 0.57/0.595 1/1':g='0/0 0.15/0.215 0.235/0.3175 0.6/0.765 1/1':b='0/0.025 0.18/0.345 0.26/0.43 0.59/0.795 1/1'`, each point halfway to identity; full strength doubles the lift; no saturation boost; 2026-10-12, replacing a turquoise grade; poster is frame 0 of the mp4 via cwebp -q 80) and a seamless loop (source frames 21-120 with the first 21 frames cross-faded in over the last 0.83s, xfade offset 3.333; 4.2s). Scroll drives transforms, and it pauses once the veil closes or the hero is off screen. Missing files fall back to `.ocean-placeholder` / `.cloud-placeholder` in globals.css. Phones and reduced motion: still poster + fade, no pin, no video. A WebGL ocean (R3F Gerstner shader) was tried 2026-10-11 and dropped: read as blobs top-down and cost more than video) → Reasons (same arch as the CTA via `components/ArchPanel.tsx`, but `theme="mist"`: solid mist blue, no photo, runs into the mist card band; rises as an arch, flattens, giant heading, hairline + tagline; then stacking cards on mist. Tried an ERA-style dome and a top-down hot air balloon first; Bion found the balloon tacky) → Statement (UC two-tone pinned headline + stat column) → Products (draggable cards w/ spec tables) → Process (pinned; the closed loop: the OCEOS mark as a faint solid tint inside a perfect circle, centred, starting 96px under the top-right description and ending 128px from the bottom; the bag rides the circle clockwise from 9 o'clock, steps at the clock angles from Bion's sketch (`tune.process.angles`); heading top left, description top right, 5.6 kg CO2e stat bottom left; replaced a "uses" odometer on 2026-10-12 because counting one bag's trips didn't fit a material loop; vertical timeline < md) → Why (mist; list + crossfading image) → Clients (forest; testimonial slider + logo wall) → FAQ → CTA (arch image that flattens) → Footer (forest; tagline + Book a call, email, link columns, the OCEOS PACKAGING wordmark (`company.wordmark`, CSS mask) edge to edge; `FitText` is now unused). ContactDrawer mounted at root.

- **Mark line:** `--mark-y` in globals.css is the nav mark's centre. On lg, every section's eyebrow sits on it when the section top hits the top of the screen (`lg:pt-mark`, `lg:top-mark` for sticky/pinned blocks). Right-hand blocks on that line take `lg:mr-24` to clear Book a call.

## Status
- Typechecks and builds. ERA restyle reviewed in Chrome at 1440 and 390 wide (2026-10-07).
- Gotcha when screenshotting through Claude in Chrome: the tab is often `visibilityState: hidden`, so rAF pauses and Framer reveals/preloader freeze mid-animation (headlines look blank or overlapped). Not a site bug. For review, inject a style forcing `span.overflow-hidden>span.inline-block{transform:none}` and hide `.z-[100]` (preloader) instead of removing nodes (removing them crashes React).
- Not yet restyled beyond tokens: Preloader (still UC dot field + count), Products cards, Clients, FAQ rows, ContactDrawer. They inherit the palette and type but have no ERA-specific moves.

## Repo and deploy
- GitHub: `artistandmachine/oceos-packaging-v2` (public), branch `master`. Pushing to master deploys via `.github/workflows/deploy.yml` to GitHub Pages at https://artistandmachine.github.io/oceos-packaging-v2/ (a project site; `artistandmachine.github.io` itself is the studio-anm site, a separate repo).
- Sub-path: the workflow sets `NEXT_PUBLIC_BASE_PATH` from actions/configure-pages; `next.config.js` uses it as `basePath`, and `lib/site.ts` prefixes every `/images|/videos|/brand` path in site.json. Always import copy from `@/lib/site`, never the JSON directly, or assets 404 on Pages. Local dev has no prefix.
- Not in git (too big; kept locally): `imported/` (Firefly source clip, ocean PSB/PNGs) and `assets-src/`.

## Content
- Copy in `data/site.json` comes from the live oceospackaging.com (scraped 2026-10-07): home, products, approach, impact, about, contact. Edits only where the copy rules forced them (em dashes, "only offer") or to fit a layout. The FAQ is new, written from facts on the live site (the site has none).
- **Email only, no phone.** Bion confirmed: there is no OCEOS phone number. Footer leads with the giant email. The contact form still asks the visitor for theirs (the live form does too).
- Bion has all original assets (built the live site). Ask for files rather than downloading from framerusercontent.com.

## Placeholders / open items
- Brand colors and fonts are ERA stand-ins (Bion prefers this palette to OCEOS's original navy #082D45). The OCEOS mark is in: `public/brand/oceos-mark.svg` (recolored to navy #17233B) and inlined as `Mark` in `components/Icons.tsx` with currentColor.
- All imagery (paths in README.md), client logo files (names are in `clients.logos`, 23 from the live site; one live logo had no alt text so it's missing).
- Live-site inconsistencies to confirm with OCEOS: "Since 2007" vs "over 20 years of experience" vs "18 years of impact"; "produce in the U.S." vs impact footnote citing the China facility; testimonials have roles but no names.
- Confirm OCEOS may show every listed client (incl. luxury houses) and the three testimonials.
- Contact form needs a real backend (Formspree / Cloudflare Worker) eventually.
- Organization JSON-LD is in `app/layout.tsx` (an item from an earlier SEO audit of oceospackaging.com).

## Branch hero-genai (test, 2026-10-12)
Hero uses a still drone photo (`hero.pan` in site.json, `PanImage` in Hero.tsx) that fills the screen width, opens centred showing 90% of it and the climb zooms out to 100% (`tune.hero.pan.visible`; no upward slide), and drifts toward the cursor, stopping dead at the photo's edges (that's how you reach the top/bottom a wide screen crops); delete `hero.pan` to fall back to the video. Source `imported/Oceos Gen AI.png` (2880 square) (ungraded; a vibrant turquoise grade was tried and reverted: ffmpeg `colorbalance=rs=-0.06:gs=0.04:bs=0.03:rm=-0.12:gm=0.07:bm=0.05,eq=saturation=1.6:contrast=1.04:gamma=1.14`), cwebp q80 (2880) and q78 resized to 1600 (`-sm`). A vertical Gen AI video was tried first and dropped (too soft cropped to landscape).
