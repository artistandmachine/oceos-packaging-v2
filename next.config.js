/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static output — no Node server required, deployable to
  // Cloudflare Pages / Netlify / GitHub Pages as plain files.
  output: "export",
  // GitHub Pages serves this as a project site under /<repo>; the deploy
  // workflow sets NEXT_PUBLIC_BASE_PATH from actions/configure-pages.
  // Unset locally and on a root domain. Asset paths in site.json pick it
  // up via lib/site.ts.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: {
    // Static export can't run Next's on-demand resize/format server;
    // pre-size and pre-compress source images before they go in public/
    // instead (see README) to get the equivalent byte savings.
    unoptimized: true,
  },
};

module.exports = nextConfig;
