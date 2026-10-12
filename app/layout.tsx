import type { Metadata, Viewport } from "next";
import { Ballet, Montserrat, Oranienbaum } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import site from "@/lib/site";
import "./globals.css";

// ERA's type system, rebuilt from Google Fonts (theirs are licensed
// Adobe/commercial faces). All three download at build time via
// next/font, then self-host. Swap here once OCEOS brand type is decided.
//   Display: Oranienbaum, a condensed Didone (stands in for Ambroise).
//   Script:  Ballet, the flourished accent word ("Live in", "Cookies").
//   Text/UI: Montserrat (wide by nature; Maison Neue Extended stand-in).
const serif = Oranienbaum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const script = Ballet({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});
const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = `${site.company.name} | Reusable rPET and Non-Woven Bags`;
const description = site.hero.sub;

export const metadata: Metadata = {
  metadataBase: new URL(site.company.url),
  title,
  description,
  openGraph: {
    title,
    description,
    url: site.company.url,
    siteName: site.company.name,
    images: [{ url: site.hero.video.poster, width: 1920, height: 1080, alt: site.company.name }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description, images: [site.hero.video.poster] },
};

export const viewport: Viewport = {
  themeColor: "#F3F3EC",
};

// Organization schema (a gap flagged in the oceospackaging.com SEO audit).
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.company.name,
  url: site.company.url,
  email: site.company.email,
  description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${script.variable} ${sans.variable}`}>
      <body id="top">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
