/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens only (tokens/*.json -> app/tokens.generated.css).
        // Inside any [data-theme="dark"] element these flip to the dark
        // palette automatically, so components never hard-code a color.
        surface: "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        "surface-variant": "var(--color-surface-variant)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "on-accent": "var(--color-on-accent)",
        "skeleton-fill": "var(--color-skeleton-fill)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
