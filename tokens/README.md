# Color tokens

`tokens/*.json` is the source of truth for every color. `npm run tokens` (also runs on predev/prebuild) compiles it to `app/tokens.generated.css`. Never hand-edit the generated file.

- `primitives.json`: raw brand swatches (cream, navy, slate, mist, forest, sage and their deep variants). Mirror these as a Figma "Primitives" collection.
- `theme.light.json`: semantic tokens on `:root` (surface, on-surface, surface-variant, on-surface-variant, border, accent, on-accent, skeleton-fill).
- `theme.dark.json`: the overrides applied inside any `[data-theme="dark"]` element (forest bands). Anything not listed inherits from light.
- `theme.mist.json`: the overrides inside any `[data-theme="mist"]` element (pale blue bands).

In Figma: one "Theme" collection with Light, Dark and Mist modes, aliasing Primitives. Apply the Dark mode to a frame to preview a forest band.
