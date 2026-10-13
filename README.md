# OCEOS Packaging v2

One-page site. **Structure and scroll moments from unitedcarriers.com, tone from era-residence.com.** Stack: Next.js static export, Tailwind v4, Framer Motion, Lenis, CSS-only theme (`app/theme.css`).

**Where to change things:** copy in `data/site.json`, look in `app/theme.css`, motion in `lib/tune.ts`.

```
npm install
npm run dev     # http://localhost:3001
npm run build   # static export to ./out
```

Fonts (Oranienbaum, Ballet, Montserrat) come from `next/font/google`, so the first dev/build run needs internet.

## Design language

- **Palette (ERA's, with a muted olive):** cream `#F3F3EC` ground, navy `#17233B` ink, mist `#DEE7ED` and muted olive `#57642B` bands. All in `app/theme.css`.
- **Bands:** put `data-theme="dark"` on any element and every token inside flips to the ink palette. That's how sections alternate.
- **Type:** serif display (`.t-mega / .t-h1 / .t-h2 / .t-h3 / .t-num`), grotesk text (`.t-lead / .t-body / .t-small / .t-label`). Defined in `app/globals.css`.
- **UC word gaps:** a `|` in any headline string in `data/site.json` becomes a wide gap ("We make|the bag.").
- **Motion:** masked word-rise headlines (`RevealText`), fade-rise blocks (`Reveal`), text-roll buttons (`Button` / `Roll`), Lenis smoothing.

## Page

| Section | Component | Borrowed from |
|---|---|---|
| Preloader | `Preloader.tsx` | UC: dot field, cycling lists, 000→100 |
| Header + menu | `Header.tsx` | both: floating pill, hide on scroll, full-screen serif menu (ERA) |
| Hero | `Hero.tsx` | UC opening flown upward: drone ocean loop zooms out as you scroll, clouds rise through, ends on cream |
| Three reasons | `Reasons.tsx` | ERA stacking cards |
| Statement + stats | `Statement.tsx` | UC "We own the outcome" + ERA drifting images |
| Products | `Products.tsx` | UC services as ERA apartment cards, draggable |
| Process | `Process.tsx` | UC moving vehicle + km/h readout, ERA drawn route |
| Why us | `Why.tsx` | UC list, ERA amenities layout |
| Clients | `Clients.tsx` | UC testimonials + logo wall |
| FAQ | `Faq.tsx` | UC |
| CTA | `Cta.tsx` | ERA closing image card |
| Footer | `Footer.tsx` | UC |
| Book a call | `ContactDrawer.tsx` | ERA side panel (opens a pre-filled email until a form backend exists) |

## Content and media

All copy is in `data/site.json`, taken from the live oceospackaging.com (Oct 2026) and lightly edited. Fields flagged `"placeholder": true` show an amber **TBC** in dev only.

Every image slot shows a hatched placeholder with its expected filename (dev only) until the file exists:

```
public/videos/hero/ocean-firefly.webm|.mp4  (top-down drone loop; AV1 crf 42 + H.264 crf 28, muted; see CLAUDE.md)
public/images/hero/ocean-firefly-poster.webp (first frame of the loop; also the OG image)
public/images/hero/cloud-01.webp ... cloud-03.webp   (transparent cloud layers, back to front, ~2400px wide)
public/images/reasons/01-better-bags.webp, 02-recycled.webp, 03-stewardship.webp
public/images/statement/01.webp, 02.webp
public/images/products/rpet-non-woven.webp, non-woven-pp.webp, ultrasonic-rpet.webp, stitched.webp
public/images/why/01-sourcing.webp, 02-traceable.webp, 03-branding.webp, 04-quality.webp, 05-delivery.webp
public/images/cta/cta.webp
public/brand/clients/<slug>.svg   (any colors; drawn monochrome via CSS mask. Filenames are the `logo` paths in site.json clients.logos)
```
